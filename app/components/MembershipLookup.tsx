'use client'

import { useState } from 'react'
import type { MembershipRegistration } from '@/lib/membership'
import MembershipCard from './MembershipCard'

const inputBase =
  'w-full border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition'

export default function MembershipLookup() {
  const [email, setEmail] = useState('')
  const [nin, setNin] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [membership, setMembership] = useState<MembershipRegistration | null>(null)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError('')
    setMembership(null)

    try {
      const response = await fetch('/api/members/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, nin }),
        cache: 'no-store',
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok || !data.membership) {
        throw new Error(data.error || 'Unable to retrieve your membership. Please try again.')
      }

      setMembership(data.membership)
      setNin('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to retrieve your membership. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div data-membership-form-panel className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
      <form data-membership-print-hidden onSubmit={handleSubmit} className="space-y-5" aria-label="Retrieve membership card">
        <div>
          <label htmlFor="membership-email" className="mb-1 block text-sm font-semibold text-gray-700">
            Registration email
          </label>
          <input
            id="membership-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            maxLength={254}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="The email you registered with"
            className={inputBase}
          />
        </div>
        <div>
          <label htmlFor="membership-nin" className="mb-1 block text-sm font-semibold text-gray-700">
            National Identification Number (NIN)
          </label>
          <input
            id="membership-nin"
            name="nin"
            type="password"
            inputMode="numeric"
            autoComplete="off"
            required
            maxLength={11}
            pattern="[0-9]{11}"
            title="Enter the 11-digit NIN you registered with"
            value={nin}
            onChange={(event) => setNin(event.target.value)}
            aria-describedby="membership-nin-help"
            placeholder="Your 11-digit NIN"
            className={inputBase}
          />
          <p id="membership-nin-help" className="mt-2 text-xs text-gray-500">
            Enter the NIN used during registration to find your membership.
          </p>
        </div>

        {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-green-700 px-8 py-3 text-sm font-bold text-white transition-colors hover:bg-green-800 disabled:cursor-wait disabled:opacity-60 sm:w-auto"
        >
          {loading ? 'Finding membership…' : 'Find my membership'}
        </button>
      </form>

      {membership && (
        <>
          <p data-membership-print-hidden role="status" className="mt-6 text-sm font-medium text-green-800">
            Your membership card is ready. Print or download it below.
          </p>
          <MembershipCard membership={membership} />
        </>
      )}
    </div>
  )
}
