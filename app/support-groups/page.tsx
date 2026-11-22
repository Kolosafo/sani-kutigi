import type { Metadata } from 'next'
import Link from 'next/link'
import RegistrationForm from './registration-form'

const title = 'Support Group Registration | SKV 2027'
const description = 'Register your support group with the Sani Kutigi Vanguard. Submit your group details, leadership contacts and registration documents.'

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description, type: 'website' },
}

export default function SupportGroupsPage() {
  return (
    <div className="bg-linear-to-br from-green-50 via-white to-white px-4 pb-16 pt-6 sm:px-6 sm:pb-20">
      <div className="mx-auto max-w-6xl">
        <nav aria-label="Breadcrumb" className="mb-8 flex flex-wrap items-center gap-3 text-sm text-gray-500">
          <Link href="/" className="rounded-sm hover:text-green-800 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-green-700">Home</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page" className="text-gray-800">Support groups</span>
        </nav>

        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.5fr)] lg:gap-12">
          <div className="lg:sticky lg:top-40">
            <span className="mb-5 inline-block rounded-full border border-green-200 bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-green-800">
              Sani Kutigi Vanguard
            </span>
            <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-4xl">
              Support group<br className="hidden lg:block" /> registration
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-gray-600">
              Register your group with SKV 2027. Share your leadership contacts, headquarters and membership details so we can coordinate support group activities.
            </p>
            <p className="mt-3 max-w-xl text-base font-medium leading-relaxed text-green-800">
              Your support group will be reviewed by DG Support Group Comrade Santali Abdullahi Mohammed.
            </p>

            <aside className="mt-7 rounded-2xl border border-green-200 bg-green-800 p-6 text-white" aria-labelledby="prepare-documents-title">
              <h2 id="prepare-documents-title" className="text-base font-bold">Have these ready</h2>
              <ul className="mt-4 space-y-3 text-sm leading-relaxed text-green-50">
                <li className="flex gap-3"><CheckIcon /><span>Your group details and registered member count.</span></li>
                <li className="flex gap-3"><CheckIcon /><span>Names and phone numbers for your president or chairman and secretary.</span></li>
                <li className="flex gap-3"><CheckIcon /><span>Your registration certificate and membership register.</span></li>
              </ul>
              <p className="mt-5 border-t border-green-600 pt-4 text-sm leading-relaxed text-green-100">
                Each document must be 2 MB or smaller. Accepted formats are listed beside each upload.
              </p>
            </aside>
          </div>

          <section aria-label="Support group registration form" className="min-w-0 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8">
            <RegistrationForm />
          </section>
        </div>
      </div>
    </div>
  )
}

function CheckIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" className="mt-0.5 h-5 w-5 shrink-0 text-green-200">
      <path d="m4 10 4 4 8-8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
