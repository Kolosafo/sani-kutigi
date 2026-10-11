-- Run once in the Supabase SQL Editor before deploying the updated registration form.
-- Safe to rerun: issued registration numbers and existing submissions are preserved.
BEGIN;

ALTER TABLE public.submissions
  ADD COLUMN IF NOT EXISTS voter_id TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS passport_photo_path TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS registration_number BIGINT;

-- ALTER TABLE holds an exclusive lock until commit, so backfilling and installing
-- the counter cannot race with a registration being inserted.
CREATE SCHEMA IF NOT EXISTS membership_private;
REVOKE ALL ON SCHEMA membership_private FROM PUBLIC, anon, authenticated;
GRANT USAGE ON SCHEMA membership_private TO service_role;

CREATE TABLE IF NOT EXISTS membership_private.registration_counter (
  singleton BOOLEAN PRIMARY KEY DEFAULT TRUE CHECK (singleton),
  last_registration_number BIGINT NOT NULL DEFAULT 0
    CHECK (last_registration_number >= 0)
);

ALTER TABLE membership_private.registration_counter ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE membership_private.registration_counter
  FROM PUBLIC, anon, authenticated, service_role;

-- Temporarily remove our trigger for a rerun, allowing a partial migration's
-- unnumbered legacy members to be backfilled without changing issued numbers.
DROP TRIGGER IF EXISTS submissions_assign_registration_number ON public.submissions;

WITH previous_maximum AS (
  SELECT COALESCE(MAX(registration_number), 0) AS last_number
  FROM public.submissions
  WHERE type = 'membership'
), unnumbered_members AS (
  SELECT submissions.id,
    previous_maximum.last_number + ROW_NUMBER() OVER (
      ORDER BY submissions.created_at, submissions.id
    ) AS new_number
  FROM public.submissions
  CROSS JOIN previous_maximum
  WHERE submissions.type = 'membership'
    AND submissions.registration_number IS NULL
)
UPDATE public.submissions AS submissions
SET registration_number = unnumbered_members.new_number
FROM unnumbered_members
WHERE submissions.id = unnumbered_members.id;

-- Never lower the counter, even if a previously numbered member was removed.
INSERT INTO membership_private.registration_counter AS registration_counter
  (singleton, last_registration_number)
SELECT TRUE, COALESCE(MAX(registration_number), 0)
FROM public.submissions
WHERE type = 'membership'
ON CONFLICT (singleton) DO UPDATE
SET last_registration_number = GREATEST(
  registration_counter.last_registration_number,
  EXCLUDED.last_registration_number
);

CREATE UNIQUE INDEX IF NOT EXISTS submissions_membership_registration_number_unique
  ON public.submissions (registration_number)
  WHERE type = 'membership';

DO $migration$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_catalog.pg_constraint
    WHERE conrelid = 'public.submissions'::pg_catalog.regclass
      AND conname = 'submissions_membership_registration_number_check'
  ) THEN
    ALTER TABLE public.submissions
      ADD CONSTRAINT submissions_membership_registration_number_check CHECK (
        (type = 'membership' AND registration_number IS NOT NULL AND registration_number > 0)
        OR (type <> 'membership' AND registration_number IS NULL)
      );
  END IF;
END;
$migration$;

CREATE OR REPLACE FUNCTION membership_private.assign_registration_number()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  IF NEW.type <> 'membership' THEN
    NEW.registration_number := NULL;
    RETURN NEW;
  END IF;

  IF TG_OP = 'UPDATE' THEN
    IF OLD.type = 'membership' THEN
      -- A membership keeps its issued number when its details are edited.
      NEW.registration_number := OLD.registration_number;
      RETURN NEW;
    END IF;
  END IF;

  -- The UPDATE locks the singleton row until the registration transaction ends.
  -- A failed insert rolls this increment back, unlike a PostgreSQL sequence.
  -- Ignore any number supplied by the caller: only this counter assigns numbers.
  UPDATE membership_private.registration_counter
  SET last_registration_number = last_registration_number + 1
  WHERE singleton = TRUE
  RETURNING last_registration_number INTO NEW.registration_number;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Membership registration counter is not initialized'
      USING ERRCODE = '55000';
  END IF;

  RETURN NEW;
END;
$function$;

REVOKE ALL ON FUNCTION membership_private.assign_registration_number()
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION membership_private.assign_registration_number() TO service_role;

CREATE TRIGGER submissions_assign_registration_number
  BEFORE INSERT OR UPDATE ON public.submissions
  FOR EACH ROW EXECUTE FUNCTION membership_private.assign_registration_number();

ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

-- Private files are uploaded and retrieved only by the server's secret key.
-- No anonymous/authenticated storage policies are created by this migration.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'membership-passports',
  'membership-passports',
  FALSE,
  2097152,
  ARRAY['image/jpeg', 'image/png']
)
ON CONFLICT (id) DO UPDATE SET
  public = FALSE,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

NOTIFY pgrst, 'reload schema';
COMMIT;
