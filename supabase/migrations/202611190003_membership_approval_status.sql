-- Store review decisions per member. Existing and new registrations remain
-- pending until the coordinating office explicitly accepts them.
BEGIN;

ALTER TABLE public.submissions
  ADD COLUMN IF NOT EXISTS membership_status TEXT NOT NULL DEFAULT 'pending';

DO $migration$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_catalog.pg_constraint
    WHERE conrelid = 'public.submissions'::pg_catalog.regclass
      AND conname = 'submissions_membership_status_check'
  ) THEN
    ALTER TABLE public.submissions
      ADD CONSTRAINT submissions_membership_status_check
      CHECK (membership_status IN ('pending', 'accepted'));
  END IF;
END;
$migration$;

NOTIFY pgrst, 'reload schema';
COMMIT;
