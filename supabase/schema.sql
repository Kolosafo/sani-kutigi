-- New projects: run this in the Supabase dashboard SQL Editor, then run
-- migrations/202610110001_membership_registration_details.sql to install the
-- registration counter, constraints, backfill, and private passport bucket.
-- Existing projects only need the migration; see README.md for setup.

CREATE TABLE IF NOT EXISTS public.submissions (
  id          TEXT        PRIMARY KEY,
  type        TEXT        NOT NULL CHECK (type IN ('inquiry', 'complaint', 'suggestion', 'membership')),
  name        TEXT        NOT NULL,
  email       TEXT        NOT NULL,
  phone       TEXT        NOT NULL DEFAULT '',
  subject     TEXT        NOT NULL DEFAULT '',
  message     TEXT        NOT NULL DEFAULT '',
  lga         TEXT        NOT NULL DEFAULT '',
  ward        TEXT        NOT NULL DEFAULT '',
  occupation  TEXT        NOT NULL DEFAULT '',
  nin         TEXT        NOT NULL DEFAULT '',
  voter_id    TEXT        NOT NULL DEFAULT '',
  passport_photo_path TEXT NOT NULL DEFAULT '',
  registration_number BIGINT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS submissions_membership_nin_unique
  ON public.submissions (nin)
  WHERE type = 'membership' AND nin <> '';

-- No policies: only the server (secret key) can read or write; the public anon key gets nothing
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
