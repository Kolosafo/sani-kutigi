import Image from 'next/image'
import Link from 'next/link'
import CountdownTimer from './components/CountdownTimer'

const aims = [
  { icon: '🏛️', text: 'Support and promote the leadership vision of Distinguished Mohammed Sani Idris Legbo Kutigi.' },
  { icon: '🤝', text: 'Mobilize grassroots support across Niger South Senatorial District.' },
  { icon: '👩‍🎓', text: 'Encourage youth and women participation in governance and leadership.' },
  { icon: '☮️', text: 'Promote peace, unity, development and democratic values.' },
  { icon: '🏘️', text: 'Support community development projects and empowerment initiatives.' },
  { icon: '📣', text: 'Serve as a platform for civic engagement and public enlightenment.' },
]

export default function Home() {
  return (
    <div className="flex flex-col">

      {/* ── Hero ── */}
      <section className="relative bg-green-900 text-white overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/campain-banner.jpeg"
            alt="SKV 2027 campaign banner"
            fill
            style={{ objectFit: 'cover', objectPosition: 'center' }}
            priority
            className="opacity-25"
          />
        </div>

        <div className="relative max-w-6xl mx-auto px-6 py-16 sm:py-24 flex flex-col-reverse sm:flex-row items-center gap-10 sm:gap-16">

          {/* Text */}
          <div className="flex-1 text-center sm:text-left">
            {/* Badges row */}
            <div className="flex flex-wrap gap-2 justify-center sm:justify-start mb-5">
              <span className="bg-white/20 text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                APC &bull; Niger State South
              </span>
              <span className="bg-blue-600/80 text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                SKV 2027
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight mb-1">
              Distinguished
            </h1>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-2 text-green-200">
              Mohammed Sani Idris
            </h1>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight mb-4">
              Legbo Kutigi
            </h1>

            <p className="text-green-300 text-base sm:text-lg font-semibold italic mb-2">
              &ldquo;Leading the Way for a Greater Niger South&rdquo;
            </p>
            <p className="text-green-100 text-sm sm:text-base leading-relaxed max-w-lg mb-8">
              Senatorial Candidate &mdash; Niger State South Senatorial District under the All
              Progressive Congress. Backed by The Sani Kutigi Vanguard (SKV 2027).
            </p>

            <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
              <a
                href="#countdown"
                className="inline-block bg-white text-green-800 font-bold px-7 py-3 rounded-full hover:bg-green-50 transition-colors shadow-lg text-sm"
              >
                Election Countdown
              </a>
              <Link
                href="/join"
                className="inline-block bg-red-600 text-white font-bold px-7 py-3 rounded-full hover:bg-red-700 transition-colors shadow-lg text-sm"
              >
                Join the Vanguard
              </Link>
            </div>
          </div>

          {/* Candidate portrait */}
          <div className="shrink-0">
            <div className="relative w-60 h-60 sm:w-76 sm:h-76 rounded-full overflow-hidden shadow-2xl border-4 border-white/40 ring-4 ring-green-500/30">
              <Image
                src="/face-cap.jpeg"
                alt="Distinguished Mohammed Sani Idris Legbo Kutigi"
                fill
                style={{ objectFit: 'cover', objectPosition: 'top center' }}
                priority
              />
            </div>
            <p className="text-center text-green-300 text-xs mt-3 font-medium">
              APC Senatorial Candidate
            </p>
          </div>

        </div>
      </section>

      {/* ── Motto strip ── */}
      <section className="bg-linear-to-r from-green-800 via-blue-800 to-green-800 py-5 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-white">
          <p className="text-base sm:text-lg font-bold text-center sm:text-left italic">
            &ldquo;Leading the Way for a Greater Niger South&rdquo;
          </p>
          <Link
            href="/join"
            className="shrink-0 bg-white text-green-800 font-bold px-6 py-2 rounded-full text-sm hover:bg-green-50 transition-colors"
          >
            Join SKV 2027 &rarr;
          </Link>
        </div>
      </section>

      {/* ── Countdown ── */}
      <section id="countdown" className="relative py-16 sm:py-20 px-6 bg-white overflow-hidden">
        <div className="absolute inset-y-0 right-0 w-56 hidden xl:block">
          <Image
            src="/countdown-campain-banner.jpeg"
            alt="Election countdown"
            fill
            style={{ objectFit: 'cover' }}
            className="opacity-15"
          />
        </div>
        <div className="relative max-w-4xl mx-auto text-center">
          <p className="text-green-700 text-sm font-semibold uppercase tracking-widest mb-3">Mark Your Calendar</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">
            Senatorial Election Countdown
          </h2>
          <p className="text-gray-400 text-lg mb-10">Saturday, January 16, 2027</p>
          <CountdownTimer />
          <p className="mt-8 text-gray-500 text-sm">
            Your vote for{' '}
            <span className="font-semibold text-green-700">Distinguished Mohammed Sani Idris Legbo Kutigi</span>{' '}
            is a vote for progress in Niger State South.
          </p>
        </div>
      </section>

      {/* ── Aims & Objectives ── */}
      <section className="py-16 sm:py-20 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-blue-700 text-sm font-semibold uppercase tracking-widest mb-2">Our Mission</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
              Aims &amp; Objectives of SKV 2027
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {aims.map(({ icon, text }, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex gap-4">
                <span className="text-2xl shrink-0 mt-0.5">{icon}</span>
                <p className="text-gray-600 text-sm leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/about" className="inline-block border-2 border-green-700 text-green-700 font-bold px-8 py-3 rounded-full hover:bg-green-700 hover:text-white transition-colors text-sm">
              Read the Full Constitution
            </Link>
          </div>
        </div>
      </section>

      {/* ── About / Flier ── */}
      <section className="py-16 sm:py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-green-700 text-sm font-semibold uppercase tracking-widest mb-3">The Candidate</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
                A Leader With Vision
              </h2>
              <p className="text-gray-600 text-base leading-relaxed mb-6">
                Distinguished Mohammed Sani Idris Legbo Kutigi is an All Progressive Congress
                (APC) candidate for the Niger State South Senatorial seat. Recognized for his
                leadership qualities, vision, capacity, and service record, he has earned the
                trust and confidence of The Sani Kutigi Vanguard and thousands of supporters
                across Niger South Senatorial District.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                {[
                  { icon: '🏗️', title: 'Infrastructure', body: 'Roads, power, and water projects across every LGA.' },
                  { icon: '🎓', title: 'Education', body: 'Quality education from primary to tertiary level.' },
                  { icon: '🛡️', title: 'Security', body: 'Peace and safety for all communities.' },
                ].map(({ icon, title, body }) => (
                  <div key={title} className="bg-green-50 rounded-2xl p-4 border border-green-100">
                    <div className="text-2xl mb-2">{icon}</div>
                    <h3 className="font-bold text-gray-900 text-sm mb-1">{title}</h3>
                    <p className="text-gray-500 text-xs leading-relaxed">{body}</p>
                  </div>
                ))}
              </div>
              <Link href="/about" className="text-green-700 font-semibold text-sm hover:underline">
                Learn more about SKV 2027 &rarr;
              </Link>
            </div>

            <div className="flex justify-center">
              <div className="relative w-64 h-96 rounded-3xl overflow-hidden shadow-2xl ring-4 ring-green-100">
                <Image
                  src="/flier.jpeg"
                  alt="SKV 2027 campaign flier"
                  fill
                  style={{ objectFit: 'cover', objectPosition: 'top' }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Get Involved ── */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-red-600 text-sm font-semibold uppercase tracking-widest mb-2">Take Action</p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-3">Get Involved</h2>
          <p className="text-gray-500 mb-10 max-w-xl mx-auto">
            Every member strengthens the movement. Join the Vanguard or reach out to the campaign.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { href: '/join', icon: '✊', title: 'Join the Vanguard', desc: 'Become a registered SKV 2027 member.', color: 'bg-red-50 border-red-100 hover:bg-red-100' },
              { href: '/inquiry', icon: '💬', title: 'Send an Inquiry', desc: 'Ask us anything about the campaign.', color: 'bg-green-50 border-green-100 hover:bg-green-100' },
              { href: '/complaint', icon: '📋', title: 'File a Complaint', desc: 'Report an issue to the campaign team.', color: 'bg-blue-50 border-blue-100 hover:bg-blue-100' },
              { href: '/suggestions', icon: '💡', title: 'Suggest an Idea', desc: 'Help shape our agenda with your ideas.', color: 'bg-yellow-50 border-yellow-100 hover:bg-yellow-100' },
            ].map(({ href, icon, title, desc, color }) => (
              <Link
                key={href}
                href={href}
                className={`block ${color} border rounded-2xl p-6 transition-colors text-left group`}
              >
                <div className="text-3xl mb-3">{icon}</div>
                <h3 className="font-bold text-gray-900 text-sm mb-1 group-hover:text-green-700 transition-colors">{title}</h3>
                <p className="text-gray-500 text-xs">{desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}
