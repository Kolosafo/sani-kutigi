import Link from 'next/link'

const aims = [
  'Support and promote the leadership vision of Distinguished Mohammed Sani Idris Legbo Kutigi.',
  'Mobilize grassroots support across Niger South Senatorial District.',
  'Encourage youth and women participation in governance and leadership.',
  'Promote peace, unity, development and democratic values.',
  'Support community development projects and empowerment initiatives.',
  'Serve as a platform for civic engagement and public enlightenment.',
  'Encourage accountability, transparency and responsible leadership.',
  'Undertake lawful activities that advance the welfare of the people.',
]

const executiveRoles = [
  'Grand Patron',
  'Patron(s)',
  'Chairman',
  'Deputy Chairman',
  'Director General',
  'Deputy Director General',
  'Secretary General',
  'Assistant Secretary General',
  'Treasurer',
  'Financial Secretary',
  'Auditor',
  'Legal Adviser',
  'Public Relations Officer',
]

const directorates = [
  'Administration',
  'Finance and Fundraising',
  'Media and Publicity',
  'Mobilization',
  'Youth Affairs',
  'Women Affairs',
  'ICT and Digital Strategy',
  'Research and Policy',
  'Security and Protocol',
  'Religious and Traditional Affairs',
  'Projects and Community Development',
]

const structures = [
  { label: 'Board of Trustees', desc: 'Strategic guidance, vision protection, and dispute mediation.' },
  { label: 'Senatorial Executive Council', desc: 'Top-level leadership and policy-making body of the Vanguard.' },
  { label: 'Local Government Coordinating Councils', desc: 'Coordination at each LGA within Niger South.' },
  { label: 'Ward Coordinating Councils', desc: 'Ground-level organizing across every ward.' },
  { label: 'Polling Unit Structures', desc: 'The frontline — mobilizing voters at each polling unit.' },
]

const memberRights = [
  'Attend meetings and activities.',
  'Express opinions in accordance with organizational rules.',
  'Participate in programs and activities.',
  'Be considered for appointment into offices and committees.',
]

export default function AboutPage() {
  return (
    <div className="py-14 px-6">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-block bg-green-100 text-green-800 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
            Official Constitution
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">
            The Sani Kutigi Vanguard
          </h1>
          <p className="text-2xl font-bold text-green-700 mb-4">SKV 2027</p>
          <p className="text-gray-500 italic text-lg mb-2">
            &ldquo;Leading the Way for a Greater Niger South&rdquo;
          </p>

          {/* Official colour strip */}
          <div className="flex h-2 w-40 mx-auto rounded-full overflow-hidden mt-4">
            <div className="flex-1 bg-green-700" />
            <div className="flex-1 bg-white border-y border-gray-300" />
            <div className="flex-1 bg-blue-700" />
            <div className="flex-1 bg-red-600" />
          </div>
          <p className="text-xs text-gray-400 mt-2">Official Colours: Green · White · Blue · Red</p>
        </div>

        {/* Preamble */}
        <section className="mb-14">
          <div className="bg-green-800 text-white rounded-3xl p-8 sm:p-10">
            <p className="text-green-300 text-xs font-bold uppercase tracking-widest mb-4">Preamble</p>
            <p className="text-base sm:text-lg leading-relaxed">
              We, the members of The Sani Kutigi Vanguard (SKV 2027), united by our commitment to{' '}
              <strong>good governance, quality representation, grassroots development, youth empowerment,
              social justice</strong>, and the advancement of Niger South Senatorial District, hereby adopt
              this Constitution as the supreme guiding document of our organization.
            </p>
            <p className="mt-4 text-base sm:text-lg leading-relaxed text-green-100">
              Recognizing the leadership qualities, vision, capacity, and service record of{' '}
              <strong className="text-white">Distinguished Mohammed Sani Idris Legbo Kutigi</strong>, we
              pledge to work collectively towards promoting his aspirations and supporting initiatives that
              advance the interests of Niger South Senatorial District and Niger State at large.
            </p>
          </div>
        </section>

        {/* Aims & Objectives */}
        <section className="mb-14">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Aims &amp; Objectives</h2>
          <div className="w-12 h-1 bg-green-700 rounded mb-6" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {aims.map((aim, i) => (
              <div key={i} className="flex gap-3 bg-gray-50 rounded-2xl p-5 border border-gray-100">
                <span className="shrink-0 w-7 h-7 rounded-full bg-green-700 text-white text-xs font-bold flex items-center justify-center mt-0.5">
                  {String.fromCharCode(96 + i + 1).toUpperCase()}
                </span>
                <p className="text-gray-600 text-sm leading-relaxed">{aim}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Organizational Structure */}
        <section className="mb-14">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Organizational Structure</h2>
          <div className="w-12 h-1 bg-blue-700 rounded mb-6" />
          <div className="space-y-3">
            {structures.map(({ label, desc }, i) => (
              <div key={label} className="flex gap-4 items-start bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                <div className="shrink-0 w-8 h-8 rounded-full bg-blue-700 text-white text-sm font-bold flex items-center justify-center">
                  {i + 1}
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">{label}</p>
                  <p className="text-gray-500 text-sm mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Executive Council */}
        <section className="mb-14">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Senatorial Executive Council</h2>
          <div className="w-12 h-1 bg-green-700 rounded mb-6" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {executiveRoles.map((role, i) => (
              <div key={role} className="bg-green-50 border border-green-100 rounded-xl px-4 py-3 text-center">
                <p className="text-green-800 font-semibold text-xs">{role}</p>
                <p className="text-gray-400 text-xs mt-0.5">Position {i + 1}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Directorates */}
        <section className="mb-14">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Directorates</h2>
          <div className="w-12 h-1 bg-red-600 rounded mb-6" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {directorates.map((d, i) => (
              <div key={d} className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl px-4 py-3 shadow-sm">
                <span className="shrink-0 w-6 h-6 rounded-full bg-red-600 text-white text-xs font-bold flex items-center justify-center">
                  {i + 1}
                </span>
                <p className="text-gray-700 text-sm font-medium">{d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Membership */}
        <section className="mb-14">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Membership</h2>
          <div className="w-12 h-1 bg-green-700 rounded mb-6" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span className="text-green-700">✓</span> Eligibility
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Membership is open to any person who supports the aims and objectives of the organization,
                is of good character, and agrees to abide by this Constitution.
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-3">Rights of Members</h3>
              <ul className="space-y-2">
                {memberRights.map((r) => (
                  <li key={r} className="flex gap-2 text-sm text-gray-600">
                    <span className="text-green-600 shrink-0">•</span> {r}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Oath */}
        <section className="mb-14">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Oath of Membership</h2>
          <div className="w-12 h-1 bg-blue-700 rounded mb-6" />
          <div className="bg-blue-50 border-l-4 border-blue-700 rounded-2xl p-8">
            <p className="text-blue-900 text-base sm:text-lg italic leading-relaxed">
              &ldquo;I solemnly pledge to uphold the Constitution of The Sani Kutigi Vanguard (SKV 2027),
              to remain loyal to its vision and leadership, to promote unity, development and progress in
              Niger South Senatorial District, and to discharge my responsibilities with honesty, discipline
              and integrity. So help me God.&rdquo;
            </p>
          </div>
        </section>

        {/* CTA */}
        <div className="bg-green-800 rounded-3xl p-8 sm:p-10 text-center text-white">
          <h2 className="text-2xl font-extrabold mb-3">Ready to Join the Vanguard?</h2>
          <p className="text-green-200 mb-6 max-w-lg mx-auto">
            Become a registered member of SKV 2027 and help us lead the way for a greater Niger South.
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
