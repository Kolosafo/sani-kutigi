'use client'

import { useState } from 'react'
import {
  getMembershipDetails,
  MEMBERSHIP_REVIEW_NOTICE,
  type MembershipRegistration,
} from '@/lib/membership'

export default function MembershipCard({ membership }: { membership: MembershipRegistration }) {
  const [downloading, setDownloading] = useState(false)
  const [error, setError] = useState('')

  async function handleDownload() {
    setDownloading(true)
    setError('')

    try {
      const { downloadMembershipPdf } = await import('@/lib/membership-pdf')
      await downloadMembershipPdf(membership)
    } catch {
      setError('Unable to download your card. Please try again, or use Print membership to save it as a PDF.')
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="mt-6 text-left">
      <article
        data-membership-card
        aria-labelledby="membership-card-title"
        className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
      >
        <div className="flex h-1.5" aria-hidden="true">
          <div className="flex-1 bg-green-700" />
          <div className="flex-1 bg-white" />
          <div className="flex-1 bg-blue-700" />
          <div className="flex-1 bg-red-600" />
        </div>

        <div className="border-b border-gray-200 bg-green-800 px-6 py-6 text-white sm:px-8">
          <p className="text-xs font-bold uppercase tracking-widest text-green-100">SKV 2027</p>
          <h3 id="membership-card-title" className="mt-1 text-xl font-extrabold sm:text-2xl">
            Membership Registration Card
          </h3>
          <p className="mt-2 text-sm text-green-100">The Sani Kutigi Vanguard</p>
          <p className="mt-1 text-xs italic text-green-100">Leading the Way for a Greater Niger South</p>
        </div>

        <div className="p-6 sm:p-8">
          <span className="mb-6 inline-block rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-800">
            Pending review
          </span>
          <dl className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
            {getMembershipDetails(membership).map(({ label, value }) => (
              <div key={label} className="min-w-0">
                <dt className="text-xs font-semibold text-gray-500">{label}</dt>
                <dd className="mt-1 text-sm font-semibold text-gray-900 [overflow-wrap:anywhere]">{value}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-6 border-t border-gray-200 pt-4 text-xs leading-relaxed text-gray-500">
            {MEMBERSHIP_REVIEW_NOTICE}
          </p>
        </div>
      </article>

      <div data-membership-print-hidden className="mt-5">
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => window.print()}
            className="rounded-full border border-green-700 bg-white px-6 py-3 text-sm font-bold text-green-800 transition-colors hover:bg-green-50"
          >
            Print membership
          </button>
          <button
            type="button"
            onClick={handleDownload}
            disabled={downloading}
            className="rounded-full bg-green-700 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-green-800 disabled:cursor-wait disabled:opacity-60"
          >
            {downloading ? 'Preparing PDF…' : 'Download membership PDF'}
          </button>
        </div>
        <p className="mt-3 text-xs text-gray-500">Save your card before leaving this page so you can keep it for your records.</p>
        {error && <p role="alert" className="mt-3 text-sm text-red-600">{error}</p>}
      </div>
    </div>
  )
}
