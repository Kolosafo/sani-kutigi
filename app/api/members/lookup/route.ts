import { supabase } from '@/lib/db'
import { MEMBERSHIP_CARD_FIELDS, toMembershipRegistration } from '@/lib/membership'

const responseOptions = { headers: { 'Cache-Control': 'private, no-store' } }

export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => null)
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return Response.json({ error: 'Enter your registration email and 11-digit NIN.' }, { ...responseOptions, status: 400 })
  }

  const { email, nin } = body as { email?: unknown; nin?: unknown }
  if (
    typeof email !== 'string' || email.trim().length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ||
    typeof nin !== 'string' || !/^\d{11}$/.test(nin.trim())
  ) {
    return Response.json({ error: 'Enter a valid registration email and 11-digit NIN.' }, { ...responseOptions, status: 400 })
  }

  const { data, error } = await supabase
    .from('submissions')
    .select(MEMBERSHIP_CARD_FIELDS)
    .eq('type', 'membership')
    .eq('nin', nin.trim())
    .abortSignal(AbortSignal.timeout(8000))
    .maybeSingle()

  if (error) {
    return Response.json({ error: 'Unable to retrieve your membership right now. Please try again later.' }, { ...responseOptions, status: 500 })
  }
  // Compare emails as text so wildcard characters cannot broaden a lookup.
  if (!data || data.email.trim().toLowerCase() !== email.trim().toLowerCase()) {
    return Response.json({ error: 'No membership matches those details. Check the email and NIN you used when registering.' }, { ...responseOptions, status: 404 })
  }

  return Response.json({ membership: toMembershipRegistration(data) }, responseOptions)
}
