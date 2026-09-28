import { getRegisteredMemberCount } from '@/lib/membership-count'

export async function GET() {
  try {
    return Response.json(
      { count: await getRegisteredMemberCount() },
      { headers: { 'Cache-Control': 'no-store' } }
    )
  } catch (error) {
    console.error('Unable to load member count:', error)
    return Response.json(
      { error: 'Member count is temporarily unavailable.' },
      { status: 503, headers: { 'Cache-Control': 'no-store' } }
    )
  }
}
