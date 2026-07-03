import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL)

await sql`
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
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )
`

await sql`ALTER TABLE submissions ADD COLUMN IF NOT EXISTS nin TEXT NOT NULL DEFAULT ''`

await sql`
  CREATE UNIQUE INDEX IF NOT EXISTS submissions_membership_nin_unique
    ON submissions (nin)
    WHERE type = 'membership' AND nin <> ''
`

console.log('✓ submissions table ready')
