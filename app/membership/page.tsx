import type { Metadata } from 'next'
import Link from 'next/link'
import MembershipLookup from '../components/MembershipLookup'

export const metadata: Metadata = {
  title: 'Download Membership | SKV 2027',
  description: 'Retrieve, print or download your Sani Kutigi Vanguard membership registration card.',
}

export default function MembershipPage() {
  return (
    <div data-membership-page className="px-6 py-14">
      <div className="mx-auto max-w-2xl">
        <div data-membership-print-hidden className="mb-8 text-center">
          <span className="mb-4 inline-block rounded-full bg-green-100 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-green-800">
            Membership
          </span>
          <h1 className="mb-3 text-3xl font-extrabold text-gray-900 sm:text-4xl">Download your membership card</h1>
          <p className="text-sm leading-relaxed text-gray-500 sm:text-base">
            Already registered? Enter your registration email and NIN to retrieve your card.
            You can return here to print or download it again anytime.
          </p>
        </div>

        <MembershipLookup />

        <p data-membership-print-hidden className="mt-6 text-center text-sm text-gray-500">
          Not registered yet?{' '}
          <Link href="/join" className="font-semibold text-green-700 underline underline-offset-4 hover:text-green-800">
            Join the Vanguard
          </Link>
        </p>
      </div>
    </div>
  )
}
