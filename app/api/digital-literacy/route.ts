import { supabase } from '@/lib/db'
import { validateDigitalLiteracyRegistration } from '@/lib/digital-literacy'

const headers = { 'Cache-Control': 'private, no-store' }

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Unable to read your registration. Please try again.' }, { status: 400, headers })
  }

  const result = validateDigitalLiteracyRegistration(body)
  if ('error' in result) {
    return Response.json({ error: result.error, fieldErrors: result.fieldErrors }, { status: 400, headers })
  }

  const id = crypto.randomUUID()
  try {
    const { error } = await supabase
      .from('digital_literacy_registrations')
      .insert({ id, ...result.registration })

    if (error) {
      console.error('Digital literacy registration could not be saved:', error.code)
      return Response.json({ error: 'We could not save your registration. Please try again shortly.' }, { status: 500, headers })
    }
  } catch {
    console.error('Digital literacy registration database request failed.')
    return Response.json({ error: 'We could not save your registration. Please try again shortly.' }, { status: 500, headers })
  }

  return Response.json({ success: true, id }, { status: 201, headers })
}
