import type { Metadata } from 'next'
import Link from 'next/link'
import { MEMBERSHIP_REGISTRATION_EXPIRED_MESSAGE } from '@/lib/membership'

export const metadata: Metadata = {
  title: 'Registration Expired | SKV 2027',
  description: MEMBERSHIP_REGISTRATION_EXPIRED_MESSAGE,
}

export default function JoinPage() {
  return (
    <div className="px-6 py-14">
      <div className="mx-auto max-w-2xl text-center">
        <p className="mb-4 text-sm font-bold uppercase tracking-widest text-green-800">
          Sani Kutigi Vanguard
        </p>
        <section aria-labelledby="registration-status" className="rounded-2xl border border-red-200 bg-red-50 px-6 py-10 sm:px-10">
          <span className="mb-5 inline-block rounded-full bg-red-100 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-red-800">
            Expired
          </span>
          <h1 id="registration-status" className="mb-4 text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Registration expired
          </h1>
          <p className="leading-relaxed text-gray-600">
            {MEMBERSHIP_REGISTRATION_EXPIRED_MESSAGE}
          </p>
        </section>

        <div className="mt-8">
          <h2 className="mb-2 text-lg font-bold text-gray-900">Already registered?</h2>
          <p className="mb-5 text-sm leading-relaxed text-gray-500">
            You can still retrieve, print or download your existing membership card.
          </p>
          <Link href="/membership" className="inline-block rounded-full bg-green-700 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-green-800">
            Download membership card
          </Link>
          <Link href="/" className="mt-5 block text-sm font-semibold text-green-700 underline underline-offset-4 hover:text-green-800">
            Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}
