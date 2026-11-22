import { createClient, type RealtimeChannel, type SupabaseClient } from '@supabase/supabase-js'
import { supabase } from './db'
import { SUPPORT_GROUP_BUCKET } from './support-group-storage'

const TOPIC = 'skv-support-group-count'
const EVENT = 'support-group-created'
const broadcastChannel = supabase.channel(TOPIC)
const registrationManifest = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\/registration\.json$/i

async function countCommittedRegistrations() {
  const bucket = supabase.storage.from(SUPPORT_GROUP_BUCKET)
  const signal = AbortSignal.timeout(8000)
  const manifests = new Set<string>()
  const cursors = new Set<string>()
  let cursor: string | undefined

  do {
    // A manifest is written only after both documents have been saved successfully.
    // Flat, cursor-based listing includes every registration without fetching private contents.
    const { data, error } = await bucket.listV2({
      limit: 1000,
      with_delimiter: false,
      cursor,
    }, { signal, cache: 'no-store' })

    if (error) throw new Error('Support group count is unavailable')
    for (const object of data.objects) {
      const key = object.key ?? object.name
      if (registrationManifest.test(key)) manifests.add(key)
    }
    if (!data.hasNext) return manifests.size
    if (!data.nextCursor || cursors.has(data.nextCursor)) {
      throw new Error('Support group count pagination is unavailable')
    }
    cursor = data.nextCursor
    cursors.add(cursor)
  } while (true)
}

let pendingCount: Promise<number> | null = null

export function getRegisteredSupportGroupCount() {
  // Viewers share an in-flight recount, but completed counts are never cached.
  if (!pendingCount) {
    pendingCount = countCommittedRegistrations().finally(() => {
      pendingCount = null
    })
  }
  return pendingCount
}

export async function notifySupportGroupRegistered() {
  try {
    await broadcastChannel.httpSend(EVENT, {}, { timeout: 3000 })
  } catch {
    // A notification failure must not fail a registration that is already saved.
    console.error('Unable to broadcast support group update.')
  }
}

type Subscription = {
  client: SupabaseClient
  channel: RealtimeChannel
  listeners: Set<() => void>
}

let subscription: Subscription | null = null

export function subscribeToSupportGroupRegistrations(listener: () => void) {
  if (!subscription) {
    // Keep credentials and the storage bucket on the server; browsers receive only totals.
    const client = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SECRET_KEY!, {
      auth: { persistSession: false },
      realtime: { disconnectOnEmptyChannelsAfterMs: 0 },
    })
    const listeners = new Set([listener])
    const channel = client.channel(TOPIC)
    subscription = { client, channel, listeners }

    const refresh = () => listeners.forEach((callback) => callback())
    channel.on('broadcast', { event: EVENT }, refresh).subscribe((status) => {
      if (status === 'SUBSCRIBED') refresh()
    })
  } else {
    subscription.listeners.add(listener)
  }

  const current = subscription
  return () => {
    current.listeners.delete(listener)
    if (current.listeners.size === 0 && subscription === current) {
      subscription = null
      void current.client.removeChannel(current.channel).catch(() => {
        console.error('Unable to close support group subscription.')
      })
    }
  }
}
