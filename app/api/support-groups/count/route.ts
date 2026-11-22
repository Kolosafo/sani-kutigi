import { getRegisteredSupportGroupCount } from '@/lib/support-group-count'

export const runtime = 'nodejs'

export async function GET() {
  try {
    return Response.json(
      { count: await getRegisteredSupportGroupCount() },
      { headers: { 'Cache-Control': 'no-store' } },
    )
  } catch {
    console.error('Unable to load support group count.')
    return Response.json(
      { error: 'Support group count is temporarily unavailable.' },
      { status: 503, headers: { 'Cache-Control': 'no-store' } },
    )
  }
}
