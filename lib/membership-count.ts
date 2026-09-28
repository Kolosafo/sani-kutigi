import { createClient, type RealtimeChannel, type SupabaseClient } from '@supabase/supabase-js'
import { supabase } from './db'

const TOPIC = 'skv-membership-count'
const EVENT = 'membership-created'
const broadcastChannel = supabase.channel(TOPIC)

export async function getRegisteredMemberCount() {
  const { count, error } = await supabase
    .from('submissions')
    .select('id', { count: 'exact', head: true })
    .eq('type', 'membership')
    .abortSignal(AbortSignal.timeout(8000))

  if (error) throw error
  if (count === null) throw new Error('Member count is unavailable')
  return count
}

export async function notifyMemberRegistered() {
  try {
    await broadcastChannel.httpSend(EVENT, {}, { timeout: 3000 })
  } catch (error) {
    // A notification failure must not fail a registration that is already saved.
    console.error('Unable to broadcast membership update:', error)
  }
}

type Subscription = {
  client: SupabaseClient
  channel: RealtimeChannel
  listeners: Set<() => void>
}

let subscription: Subscription | null = null

export function subscribeToMemberRegistrations(listener: () => void) {
  if (!subscription) {
    // Share one server-side socket among viewers. Browser clients receive only counts.
    const client = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SECRET_KEY!, {
      auth: { persistSession: false },
      realtime: { disconnectOnEmptyChannelsAfterMs: 0 },
    })
    const listeners = new Set([listener])
    const channel = client.channel(TOPIC)
    subscription = { client, channel, listeners }

    const refresh = () => listeners.forEach((callback) => callback())
    channel.on('broadcast', { event: EVENT }, refresh).subscribe((status) => {
      // Recount after joining or reconnecting to cover events missed while disconnected.
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
      void current.client.removeChannel(current.channel).catch((error) => {
        console.error('Unable to close membership subscription:', error)
      })
    }
  }
}
