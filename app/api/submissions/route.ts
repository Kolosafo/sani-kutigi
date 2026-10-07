import { NextRequest } from 'next/server'
import { supabase } from '@/lib/db'
import { notifyMemberRegistered } from '@/lib/membership-count'
import { MEMBERSHIP_CARD_FIELDS, toMembershipRegistration } from '@/lib/membership'

type SubmissionType = 'inquiry' | 'complaint' | 'suggestion' | 'membership'

const VALID_TYPES = new Set<SubmissionType>(['inquiry', 'complaint', 'suggestion', 'membership'])

function dbError(error: unknown) {
  console.error('Supabase error:', error)
  return Response.json({ error: 'Something went wrong on our end. Please try again later.' }, { status: 500 })
}

export async function GET(request: NextRequest) {
  const type = request.nextUrl.searchParams.get('type') as SubmissionType | null

  let query = supabase.from('submissions').select('*').order('created_at', { ascending: false })
  if (type && VALID_TYPES.has(type)) {
    query = query.eq('type', type)
  }

  const { data, error } = await query
  if (error) return dbError(error)

  return Response.json(data)
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
    const { data: existing, error } = await supabase
      .from('submissions')
      .select('id')
      .eq('type', 'membership')
      .eq('nin', nin)
      .limit(1)
    if (error) return dbError(error)
    if (existing.length > 0) {
      return Response.json({ error: 'This NIN is already registered as a member.' }, { status: 409 })
    }
  }

  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`

  const { data: submission, error } = await supabase
    .from('submissions')
    .insert({ id, type, name, email, phone, subject, message, lga, ward, occupation, nin })
    .select(MEMBERSHIP_CARD_FIELDS)
    .single()
  if (error) {
    if (error.code === '23505') {
      return Response.json({ error: 'This NIN is already registered as a member.' }, { status: 409 })
    }
    return dbError(error)
  }

  if (type === 'membership') {
    await notifyMemberRegistered()

    // Only return the fields needed for the card; NIN stays on the server.
    const membership = toMembershipRegistration(submission)

    return Response.json({ success: true, id, membership }, { status: 201 })
  }

  return Response.json({ success: true, id }, { status: 201 })
}
