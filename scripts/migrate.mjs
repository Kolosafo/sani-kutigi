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

console.log('✓ submissions table ready')
