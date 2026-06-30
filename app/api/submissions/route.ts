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
  } = body

  if (!type || !VALID_TYPES.has(type)) {
    return Response.json({ error: 'Invalid type' }, { status: 400 })
  }
  if (!name || !email) {
    return Response.json({ error: 'Missing required fields: name and email' }, { status: 400 })
  }

  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`

  await sql`
    INSERT INTO submissions (id, type, name, email, phone, subject, message, lga, ward, occupation)
    VALUES (${id}, ${type}, ${name}, ${email}, ${phone}, ${subject}, ${message}, ${lga}, ${ward}, ${occupation})
  `

  return Response.json({ success: true, id }, { status: 201 })
}
