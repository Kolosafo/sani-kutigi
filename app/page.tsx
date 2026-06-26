import Image from 'next/image'
import Link from 'next/link'
import CountdownTimer from './components/CountdownTimer'

export default function Home() {
  return (
    <div className="flex flex-col">

      {/* Hero */}
      <section className="relative bg-green-900 text-white overflow-hidden">
        {/* Background banner image */}
        <div className="absolute inset-0">
          <Image
            src="/campain-banner.jpeg"
            alt="Campaign banner"
            fill
            style={{ objectFit: 'cover', objectPosition: 'center' }}
            priority
            className="opacity-30"
          />
        </div>

        <div className="relative max-w-6xl mx-auto px-6 py-16 sm:py-24 flex flex-col-reverse sm:flex-row items-center gap-10 sm:gap-16">

          {/* Text */}
          <div className="flex-1 text-center sm:text-left">
            <p className="inline-block bg-white/20 text-white text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
              APC &bull; Niger State South
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-4">
              Sani Kutigi
            </h1>
            <p className="text-green-200 text-lg sm:text-xl font-medium mb-6">
              Your Voice in the Senate
            </p>
            <p className="text-green-100 text-base sm:text-lg leading-relaxed max-w-lg mb-8">
              A committed leader dedicated to development, security, and prosperity for every
              community in Niger State South Senatorial District.
            </p>
            <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
              <a
                href="#countdown"
                className="inline-block bg-white text-green-800 font-bold px-8 py-3 rounded-full hover:bg-green-50 transition-colors shadow-lg"
              >
                See Countdown
              </a>
              <Link
                href="/inquiry"
                className="inline-block border-2 border-white text-white font-bold px-8 py-3 rounded-full hover:bg-white/10 transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>

          {/* Candidate photo */}
          <div className="shrink-0">
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-full overflow-hidden shadow-2xl border-4 border-white/40">
              <Image
                src="/face-cap.jpeg"
                alt="Sani Kutigi – APC Senatorial Candidate"
                fill
                style={{ objectFit: 'cover', objectPosition: 'top center' }}
                priority
              />
            </div>
          </div>

        </div>
      </section>

      {/* Campaign flier strip */}
      <section className="bg-green-700 py-6 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-white">
          <p className="text-base sm:text-lg font-semibold text-center sm:text-left">
            Join the Movement — Vote Sani Kutigi for Niger State South Senate Seat
          </p>
          <Link
            href="/suggestions"
            className="shrink-0 bg-white text-green-800 font-bold px-6 py-2 rounded-full text-sm hover:bg-green-50 transition-colors"
          >
            Share Your Idea
          </Link>
        </div>
      </section>

      {/* Countdown */}
      <section id="countdown" className="relative py-16 sm:py-20 px-6 overflow-hidden">
        {/* Portrait banner on right side (decorative) */}
        <div className="absolute inset-y-0 right-0 w-64 hidden xl:block">
          <Image
            src="/countdown-campain-banner.jpeg"
            alt="Election countdown banner"
            fill
            style={{ objectFit: 'cover', objectPosition: 'center' }}
            className="opacity-20"
          />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <p className="text-green-700 text-sm font-semibold uppercase tracking-widest mb-3">
            Mark Your Calendar
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">
            Senatorial Election Countdown
          </h2>
          <p className="text-gray-500 text-lg mb-10">Saturday, January 16, 2027</p>
          <CountdownTimer />
          <p className="mt-8 text-gray-600 text-sm">
            Your vote for <span className="font-semibold text-green-700">Sani Kutigi</span> is a
            vote for progress in Niger State South.
          </p>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-16 sm:py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-green-700 text-sm font-semibold uppercase tracking-widest mb-3">
                About the Candidate
              </p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-6">
                Who is Sani Kutigi?
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                Sani Kutigi is an All Progressive Congress (APC) candidate vying for the Niger
                State South Senatorial seat. With a passion for grassroots development and
                community empowerment, he stands as a beacon of hope for the people of Niger
                State South Senatorial District.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { icon: '🏗️', title: 'Infrastructure', body: 'Roads, power, and water projects across every local government.' },
                  { icon: '🎓', title: 'Education', body: 'Quality education from primary to tertiary level.' },
                  { icon: '🛡️', title: 'Security', body: 'Peace and safety for all communities in the district.' },
                ].map(({ icon, title, body }) => (
                  <div key={title} className="bg-white rounded-2xl p-5 shadow-sm border border-green-100">
                    <div className="text-2xl mb-2">{icon}</div>
                    <h3 className="font-bold text-gray-900 text-sm mb-1">{title}</h3>
                    <p className="text-gray-500 text-xs leading-relaxed">{body}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Campaign flier */}
            <div className="flex justify-center">
              <div className="relative w-64 h-96 rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="/flier.jpeg"
                  alt="Sani Kutigi campaign flier"
                  fill
                  style={{ objectFit: 'cover', objectPosition: 'top' }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick links */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-3">Get Involved</h2>
          <p className="text-gray-500 mb-10">We want to hear from you. Choose how you&apos;d like to connect.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { href: '/inquiry', icon: '💬', title: 'Send an Inquiry', desc: 'Ask us anything about the campaign.' },
              { href: '/complaint', icon: '📋', title: 'File a Complaint', desc: 'Report an issue to the campaign team.' },
              { href: '/suggestions', icon: '💡', title: 'Share a Suggestion', desc: 'Help shape our agenda with your ideas.' },
            ].map(({ href, icon, title, desc }) => (
              <Link
                key={href}
                href={href}
                className="block bg-green-50 hover:bg-green-100 border border-green-100 rounded-2xl p-6 transition-colors text-left group"
              >
                <div className="text-3xl mb-3">{icon}</div>
                <h3 className="font-bold text-gray-900 text-base mb-1 group-hover:text-green-700 transition-colors">{title}</h3>
                <p className="text-gray-500 text-sm">{desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}
