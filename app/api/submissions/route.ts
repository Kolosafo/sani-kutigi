import { NextRequest } from 'next/server'
import { supabase } from '@/lib/db'
import { notifyMemberRegistered } from '@/lib/membership-count'
import { MEMBERSHIP_CARD_FIELDS, toMembershipRegistration } from '@/lib/membership'
import {
  getPassportPhotoUrl,
  PassportPhotoError,
  preparePassportPhoto,
  removePassportPhoto,
  uploadPassportPhoto,
} from '@/lib/membership-photo'

type SubmissionType = 'inquiry' | 'complaint' | 'suggestion' | 'membership'

const VALID_TYPES = new Set<SubmissionType>(['inquiry', 'complaint', 'suggestion', 'membership'])

function dbError(error: unknown) {
  console.error('Supabase error:', error)
  return Response.json({ error: 'Something went wrong on our end. Please try again later.' }, { status: 500 })
}

export async function GET(request: NextRequest) {
  const type = request.nextUrl.searchParams.get('type') as SubmissionType | null

  // Membership records are retrieved only after verifying the member's email and NIN.
  if (type === 'membership') {
    return Response.json({ error: 'Use membership lookup to retrieve your registration.' }, { status: 403 })
  }
  let query = supabase.from('submissions')
    .select('id, type, name, email, phone, subject, message, created_at')
    .neq('type', 'membership')
    .order('created_at', { ascending: false })
  if (type && VALID_TYPES.has(type)) {
    query = query.eq('type', type)
  }

  const { data, error } = await query
  if (error) return dbError(error)

  return Response.json(data)
}

const NIN_PATTERN = /^\d{11}$/

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>
  try {
    const parsed: unknown = request.headers.get('content-type')?.includes('multipart/form-data')
      ? Object.fromEntries(await request.formData())
      : await request.json()
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return Response.json({ error: 'Invalid submission.' }, { status: 400 })
    }
    body = parsed as Record<string, unknown>
  } catch {
    return Response.json({ error: 'Unable to read your submission. Please try again.' }, { status: 400 })
  }
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
    voter_id = '',
    passport_photo,
  } = body

  if (typeof type !== 'string' || !VALID_TYPES.has(type as SubmissionType)) {
    return Response.json({ error: 'Invalid type' }, { status: 400 })
  }
  if (typeof name !== 'string' || !name.trim() || typeof email !== 'string' || !email.trim()) {
    return Response.json({ error: 'Missing required fields: name and email' }, { status: 400 })
  }
  if ([phone, subject, message, lga, ward, occupation, nin, voter_id].some((value) => typeof value !== 'string')) {
    return Response.json({ error: 'Submission fields must contain text.' }, { status: 400 })
  }
  if (type === 'membership' && (typeof nin !== 'string' || !NIN_PATTERN.test(nin.trim()))) {
    return Response.json({ error: 'A valid 11-digit NIN is required for membership registration' }, { status: 400 })
  }

  const normalizedNin = (nin as string).trim()
  const voterId = (voter_id as string).trim().replace(/\s+/g, '').toUpperCase()
  if (type === 'membership' && (voterId.length > 32 || (voterId && !/^[A-Z0-9]+$/.test(voterId)))) {
    return Response.json({ error: 'Enter a voter identification number using letters and numbers only.' }, { status: 400 })
  }

  let photo: Buffer | null = null
  if (type === 'membership') {
    try {
      photo = await preparePassportPhoto(passport_photo)
    } catch (error) {
      if (error instanceof PassportPhotoError) {
        return Response.json({ error: error.message }, { status: 400 })
      }
      return dbError(error)
    }
    const { data: existing, error } = await supabase
      .from('submissions')
      .select('id')
      .eq('type', 'membership')
      .eq('nin', normalizedNin)
      .limit(1)
    if (error) return dbError(error)
    if (existing && existing.length > 0) {
      return Response.json({ error: 'This NIN is already registered as a member.' }, { status: 409 })
    }
  }

  const id = crypto.randomUUID()
  let photoPath = ''
  let photoUrl: string | null = null
  if (photo) {
    try {
      photoPath = await uploadPassportPhoto(id, photo)
      photoUrl = await getPassportPhotoUrl(photoPath)
    } catch (error) {
      if (photoPath) await removePassportPhoto(photoPath)
      return dbError(error)
    }
  }

  const query = supabase
    .from('submissions')
    .insert({
      id, type, name: name.trim(), email: email.trim(), phone, subject, message, lga, ward, occupation,
      nin: type === 'membership' ? normalizedNin : '',
      ...(type === 'membership' ? { voter_id: voterId, passport_photo_path: photoPath } : {}),
    })
  const { data: submission, error } = await query
    .select(MEMBERSHIP_CARD_FIELDS)
    .single()
  if (error) {
    if (photoPath) await removePassportPhoto(photoPath)
    if (type === 'membership' && error.code === '23505' && error.message.includes('submissions_membership_nin_unique')) {
      return Response.json({ error: 'This NIN is already registered as a member.' }, { status: 409 })
    }
    return dbError(error)
  }

  if (type === 'membership') {
    await notifyMemberRegistered()

    // Identity numbers and the private storage path stay on the server.
    const membership = toMembershipRegistration(submission, photoUrl)

    return Response.json({ success: true, id, membership }, {
      status: 201,
      headers: { 'Cache-Control': 'private, no-store' },
    })
  }

  return Response.json({ success: true, id }, { status: 201 })
}
