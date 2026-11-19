-- Apply in the Supabase SQL Editor before accepting program registrations.
-- Course stores the stable slug from lib/skills.ts, rather than its display name.
BEGIN;

CREATE TABLE IF NOT EXISTS public.digital_literacy_registrations (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT        NOT NULL CHECK (char_length(btrim(name)) BETWEEN 1 AND 120),
  lga        TEXT        NOT NULL CHECK (lga IN ('Edati', 'Lavun')),
  course     TEXT        NOT NULL CHECK (char_length(btrim(course)) BETWEEN 1 AND 100),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.digital_literacy_registrations ENABLE ROW LEVEL SECURITY;

-- Registration data is only available through the server's secret key.
-- Public visitors can submit through the API, but cannot list participants.
REVOKE ALL ON TABLE public.digital_literacy_registrations FROM anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.digital_literacy_registrations TO service_role;

COMMIT;
