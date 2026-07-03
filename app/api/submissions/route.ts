import { NextRequest } from 'next/server'
import { sql } from '@/lib/db'

type SubmissionType = 'inquiry' | 'complaint' | 'suggestion' | 'membership'

const VALID_TYPES = new Set<SubmissionType>(['inquiry', 'complaint', 'suggestion', 'membership'])

export async function GET(request: NextRequest) {
  const type = request.nextUrl.searchParams.get('type') as SubmissionType | null

  const rows = type && VALID_TYPES.has(type)
    ? await sql`SELECT * FROM submissions WHERE type = ${type} ORDER BY created_at DESC`
    : await sql`SELECT * FROM submissions ORDER BY created_at DESC`

  return Response.json(rows)
}

const NIN_PATTERN = /^\d{11}$/

export async function POST(request: NextRequest) {
  const body = await request.json()
  const {
    type,
    name,
    email,
    phone = '',
    subject = '',
    message = '',
    lga = '',
    ward = '',
    occupation = '',
    nin = '',
  } = body

  if (!type || !VALID_TYPES.has(type)) {
    return Response.json({ error: 'Invalid type' }, { status: 400 })
  }
  if (!name || !email) {
    return Response.json({ error: 'Missing required fields: name and email' }, { status: 400 })
  }
  if (type === 'membership' && !NIN_PATTERN.test(nin)) {
    return Response.json({ error: 'A valid 11-digit NIN is required for membership registration' }, { status: 400 })
  }

  if (type === 'membership') {
    const existing = await sql`SELECT id FROM submissions WHERE type = 'membership' AND nin = ${nin} LIMIT 1`
    if (existing.length > 0) {
      return Response.json({ error: 'This NIN is already registered as a member.' }, { status: 409 })
    }
  }

  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`

  try {
    await sql`
      INSERT INTO submissions (id, type, name, email, phone, subject, message, lga, ward, occupation, nin)
      VALUES (${id}, ${type}, ${name}, ${email}, ${phone}, ${subject}, ${message}, ${lga}, ${ward}, ${occupation}, ${nin})
    `
  } catch (err) {
    if (err instanceof Error && 'code' in err && (err as { code: string }).code === '23505') {
      return Response.json({ error: 'This NIN is already registered as a member.' }, { status: 409 })
    }
    throw err
  }

  return Response.json({ success: true, id }, { status: 201 })
}
