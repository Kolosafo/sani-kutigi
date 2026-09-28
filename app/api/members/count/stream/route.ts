import { getRegisteredMemberCount, subscribeToMemberRegistrations } from '@/lib/membership-count'

export const runtime = 'nodejs'
export const maxDuration = 60

export function GET(request: Request) {
  const encoder = new TextEncoder()
  let cleanup = () => {}

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      let closed = false
      let refreshing = false
      let refreshPending = false
      let lastCount: number | null = null

      function send(event: string, data: object) {
        if (!closed) controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`))
      }

      async function refreshCount() {
        refreshPending = true
        if (refreshing || closed) return
        refreshing = true
        try {
          do {
            refreshPending = false
            try {
              const count = await getRegisteredMemberCount()
              if (count !== lastCount) {
                send('count', { count })
                lastCount = count
              }
            } catch {
              lastCount = null
              send('unavailable', {})
            }
          } while (refreshPending && !closed)
        } finally {
          refreshing = false
        }
      }

      controller.enqueue(encoder.encode('retry: 1000\n\n'))
      const unsubscribe = subscribeToMemberRegistrations(() => void refreshCount())
      const heartbeat = setInterval(() => {
        if (!closed) controller.enqueue(encoder.encode(': heartbeat\n\n'))
      }, 15000)
      // Recover missed notifications and reflect changes made outside the registration form.
      const fallback = setInterval(() => void refreshCount(), 30000)
      // Reconnect before the hosting platform's function duration expires.
      const reconnect = setTimeout(() => {
        cleanup()
        controller.close()
      }, 50000)

      cleanup = () => {
        if (closed) return
        closed = true
        clearInterval(heartbeat)
        clearInterval(fallback)
        clearTimeout(reconnect)
        unsubscribe()
        request.signal.removeEventListener('abort', onAbort)
      }

      function onAbort() {
        cleanup()
        controller.close()
      }

      request.signal.addEventListener('abort', onAbort, { once: true })
      if (request.signal.aborted) onAbort()
      else void refreshCount()
    },
    cancel() {
      cleanup()
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-store, no-transform',
      'X-Accel-Buffering': 'no',
    },
  })
}
