-- Run this in the Supabase dashboard: SQL Editor → New query → Run

CREATE TABLE IF NOT EXISTS submissions (
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
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS submissions_membership_nin_unique
  ON submissions (nin)
  WHERE type = 'membership' AND nin <> '';

-- No policies: only the server (secret key) can read or write; the public anon key gets nothing
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
