'use client'

import Link from 'next/link'
import { useEffect, useId, useState } from 'react'

function validCount(data: { count?: unknown }): data is { count: number } {
  return typeof data.count === 'number' && Number.isSafeInteger(data.count) && data.count >= 0
}

export default function MemberCountButton() {
  const [count, setCount] = useState<number | null>(null)
  const [live, setLive] = useState(false)
  const [unavailable, setUnavailable] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const panelId = useId()

  useEffect(() => {
    let active = true
    let revision = 0
    let streamLive = false
    const abortController = new AbortController()

    function applyCount(data: { count?: unknown }) {
      if (!active || !validCount(data)) return
      setCount(data.count)
      setUnavailable(false)
    }

    async function refreshCount() {
      const currentRevision = ++revision
      try {
        const response = await fetch('/api/members/count', {
          cache: 'no-store',
          signal: abortController.signal,
        })
        if (!response.ok) throw new Error('Unable to load member count')
        const data = await response.json()
        if (!validCount(data)) throw new Error('Invalid member count')
        if (currentRevision === revision) applyCount(data)
      } catch {
        if (active && currentRevision === revision) setUnavailable(true)
      }
    }

    const events = typeof EventSource === 'undefined'
      ? null
      : new EventSource('/api/members/count/stream')

    events?.addEventListener('count', (event) => {
      try {
        const data = JSON.parse((event as MessageEvent<string>).data)
        if (!validCount(data)) return
        revision += 1
        streamLive = true
        applyCount(data)
        setLive(true)
      } catch {
        // Keep the last verified count if an event is malformed.
      }
    })
    events?.addEventListener('unavailable', () => {
      streamLive = false
      setLive(false)
      setUnavailable(true)
    })
    if (events) {
      events.onerror = () => {
        streamLive = false
        setLive(false)
        void refreshCount()
      }
    }

    const refresh = () => void refreshCount()
    const onVisible = () => {
      if (document.visibilityState === 'visible') refresh()
    }
    const fallback = setInterval(() => {
      if (!streamLive) refresh()
    }, 30000)

    window.addEventListener('skv:member-registered', refresh)
    window.addEventListener('focus', refresh)
    document.addEventListener('visibilitychange', onVisible)
    refresh()

    return () => {
      active = false
      events?.close()
      abortController.abort()
      clearInterval(fallback)
      window.removeEventListener('skv:member-registered', refresh)
      window.removeEventListener('focus', refresh)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [])

  const formattedCount = count === null ? (unavailable ? 'Unavailable' : '…') : count.toLocaleString('en-NG')

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={() => setExpanded((open) => !open)}
        aria-expanded={expanded}
        aria-controls={panelId}
        className="inline-flex flex-wrap items-center justify-center gap-2 rounded-full border border-green-200 bg-white px-4 py-2 text-xs sm:text-sm font-semibold text-green-800 shadow-sm hover:bg-green-100 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700"
      >
        <svg aria-hidden="true" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2m20 0v-2a4 4 0 0 0-3-3.87M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8m7-7.87a4 4 0 0 1 0 7.75" />
        </svg>
        <span>Registered members</span>
        <span aria-live="polite" aria-atomic="true" className="rounded-full bg-green-700 px-2.5 py-0.5 font-bold tabular-nums text-white">
          {formattedCount}
        </span>
        <span className="inline-flex items-center gap-1 text-[10px] font-medium text-green-700">
          <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${live && !unavailable ? 'bg-green-500' : 'bg-gray-400'}`} />
          {live && !unavailable ? 'Live' : 'Updating'}
        </span>
      </button>
      {expanded && (
        <div id={panelId} className="w-full max-w-sm rounded-2xl border border-green-200 bg-white p-4 text-center shadow-sm">
          <p className="text-3xl font-extrabold tabular-nums text-green-800">{formattedCount}</p>
          <p className="mt-1 text-sm font-semibold text-gray-700">Registered SKV 2027 members</p>
          <p className="mt-1 text-xs text-gray-500" role="status">
            {unavailable ? 'Reconnecting to the latest total…' : 'The total updates automatically when someone registers.'}
          </p>
          <Link href="/join" onClick={() => setExpanded(false)} className="mt-3 inline-block text-sm font-bold text-green-700 hover:underline">
            Join the Vanguard &rarr;
          </Link>
        </div>
      )}
    </div>
  )
}
