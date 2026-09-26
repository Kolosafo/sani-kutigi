import Image from 'next/image'
import Link from 'next/link'
import ExecutiveCard from '../components/ExecutiveCard'
import { directors, executives, registration } from '@/lib/executives'

export default function ExecutivesPage() {
  return (
    <div className="py-14 px-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-block bg-green-100 text-green-800 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
            Leadership
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">Meet Our Executives</h1>
          <p className="text-gray-500 max-w-2xl mx-auto">
            The men and women leading The Sani Kutigi Vanguard (SKV 2027) in the drive for a greater
            Niger South.
          </p>
          <div className="flex h-2 w-40 mx-auto rounded-full overflow-hidden mt-6">
            <div className="flex-1 bg-green-700" />
            <div className="flex-1 bg-white border-y border-gray-300" />
            <div className="flex-1 bg-blue-700" />
            <div className="flex-1 bg-red-600" />
          </div>
        </div>

        {/* Certificate of Registration */}
        <section className="mb-16">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Officially Registered</h2>
          <div className="w-12 h-1 bg-green-700 rounded mb-6" />
          <div className="bg-green-800 text-white rounded-3xl p-6 sm:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
              <div className="lg:col-span-2">
                <p className="text-green-300 text-xs font-bold uppercase tracking-widest mb-3">
                  Certificate of Registration
                </p>
                <p className="text-lg leading-relaxed">
                  The Sani Kutigi Vanguard (SKV 2027) is a fully registered association under the{' '}
                  <strong>{registration.authority}</strong>, officially recognized and approved for operation.
                </p>
                <dl className="mt-6 grid grid-cols-2 gap-4">
                  <div className="bg-white/10 rounded-xl px-4 py-3">
                    <dt className="text-green-300 text-xs uppercase tracking-wider">Reg. No.</dt>
                    <dd className="font-extrabold mt-1">{registration.number}</dd>
                  </div>
                  <div className="bg-white/10 rounded-xl px-4 py-3">
                    <dt className="text-green-300 text-xs uppercase tracking-wider">Issued</dt>
                    <dd className="font-extrabold mt-1">{registration.date}</dd>
                  </div>
                </dl>
              </div>
              <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <figure>
                  <a
                    href="/certificate-of-registration.jpeg"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block relative aspect-1280/918 rounded-2xl overflow-hidden shadow-xl ring-4 ring-white/20"
                  >
                    <Image
                      src="/certificate-of-registration.jpeg"
                      alt="SKV 2027 Certificate of Registration, Reg. No. NS/0196/2026"
                      fill
                      style={{ objectFit: 'cover' }}
                      sizes="(max-width: 640px) 100vw, 30vw"
                    />
                  </a>
                  <figcaption className="text-green-200 text-xs mt-2 text-center">The certificate</figcaption>
                </figure>
                <figure>
                  <a
                    href="/certificate-presentation.jpeg"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block relative aspect-1182/864 rounded-2xl overflow-hidden shadow-xl ring-4 ring-white/20"
                  >
                    <Image
                      src="/certificate-presentation.jpeg"
                      alt="Presentation of the SKV 2027 Certificate of Registration"
                      fill
                      style={{ objectFit: 'cover' }}
                      sizes="(max-width: 640px) 100vw, 30vw"
                    />
                  </a>
                  <figcaption className="text-green-200 text-xs mt-2 text-center">
                    Presentation of the certificate
                  </figcaption>
                </figure>
              </div>
            </div>
          </div>
        </section>

        {/* Executive Council */}
        <section className="mb-16">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Executive Council</h2>
          <div className="w-12 h-1 bg-blue-700 rounded mb-6" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {executives.map((executive, i) => (
              <ExecutiveCard key={executive.portfolio} executive={executive} index={i + 1} />
            ))}
          </div>
        </section>

        {/* Directors */}
        <section className="mb-16">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Directorates</h2>
          <div className="w-12 h-1 bg-red-600 rounded mb-6" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {directors.map((director) => (
              <ExecutiveCard key={director.portfolio} executive={director} />
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="bg-green-800 rounded-3xl p-8 sm:p-10 text-center text-white">
          <h2 className="text-2xl font-extrabold mb-3">Stand With the Vanguard</h2>
          <p className="text-green-200 mb-6 max-w-lg mx-auto">
            Join our executives in working for a greater Niger South.
          </p>
          <Link
            href="/join"
            className="inline-block bg-white text-green-800 font-bold px-10 py-3 rounded-full hover:bg-green-50 transition-colors shadow-lg"
          >
            Register Now
          </Link>
        </div>

      </div>
    </div>
  )
}
