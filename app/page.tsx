import Image from 'next/image'
import CountdownTimer from './components/CountdownTimer'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white">

      {/* Top bar */}
      <div className="bg-green-800 text-white text-center text-sm py-2 px-4 font-medium tracking-wide">
        All Progressive Congress &mdash; Niger State South Senatorial District
      </div>

      {/* Header / Nav */}
      <header className="bg-white border-b border-green-100 shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-700 flex items-center justify-center text-white font-bold text-lg select-none">
              SK
            </div>
            <div>
              <p className="font-bold text-green-800 leading-tight text-base">Sani Kutigi</p>
              <p className="text-xs text-gray-500">APC Senatorial Candidate</p>
            </div>
          </div>
          <nav className="hidden sm:flex items-center gap-6 text-sm font-medium text-gray-600">
            <a href="#about" className="hover:text-green-700 transition-colors">About</a>
            <a href="#countdown" className="hover:text-green-700 transition-colors">Election Date</a>
            <a href="#contact" className="hover:text-green-700 transition-colors">Contact</a>
          </nav>
        </div>
      </header>

      <main className="flex-1">

        {/* Hero Section */}
        <section className="bg-linear-to-br from-green-800 via-green-700 to-green-900 text-white">
          <div className="max-w-6xl mx-auto px-6 py-16 sm:py-24 flex flex-col-reverse sm:flex-row items-center gap-10 sm:gap-16">

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
              <a
                href="#countdown"
                className="inline-block bg-white text-green-800 font-bold px-8 py-3 rounded-full hover:bg-green-50 transition-colors shadow-lg"
              >
                See Election Countdown
              </a>
            </div>

            {/* Candidate photo */}
            <div className="shrink-0">
              <div className="relative w-56 h-72 sm:w-72 sm:h-96 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/30">
                <Image
                  src="/candidate-placeholder.svg"
                  alt="Sani Kutigi – APC Senatorial Candidate"
                  fill
                  style={{ objectFit: 'cover', objectPosition: 'top' }}
                  priority
                />
              </div>
            </div>

          </div>
        </section>

        {/* Countdown Section */}
        <section id="countdown" className="bg-green-50 py-16 sm:py-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-green-700 text-sm font-semibold uppercase tracking-widest mb-3">
              Mark Your Calendar
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">
              Senatorial Election Countdown
            </h2>
            <p className="text-gray-500 text-lg mb-10">
              Saturday, January 16, 2027
            </p>
            <CountdownTimer />
            <p className="mt-8 text-gray-600 text-sm">
              Your vote for <span className="font-semibold text-green-700">Sani Kutigi</span> is
              a vote for progress in Niger State South.
            </p>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-16 sm:py-20 px-6 bg-white">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-green-700 text-sm font-semibold uppercase tracking-widest mb-3">
              About the Candidate
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-6">
              Who is Sani Kutigi?
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed max-w-2xl mx-auto">
              Sani Kutigi is an All Progressive Congress (APC) candidate vying for the Niger State
              South Senatorial seat. With a passion for grassroots development and community
              empowerment, he stands as a beacon of hope for the people of Niger State South
              Senatorial District.
            </p>

            <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-8">
              {[
                { icon: '🏗️', title: 'Infrastructure', body: 'Committed to road, power, and water projects across every local government.' },
                { icon: '🎓', title: 'Education', body: 'Expanding access to quality education from primary school to tertiary level.' },
                { icon: '🛡️', title: 'Security', body: 'Working with security agencies to ensure peace and safety for all communities.' },
              ].map(({ icon, title, body }) => (
                <div key={title} className="bg-green-50 rounded-2xl p-6 text-left">
                  <div className="text-3xl mb-3">{icon}</div>
                  <h3 className="font-bold text-gray-900 text-lg mb-2">{title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer id="contact" className="bg-green-900 text-green-200 py-10 px-6 text-center">
        <p className="font-bold text-white text-lg mb-1">Sani Kutigi Campaign Office</p>
        <p className="text-sm mb-4">Niger State South Senatorial District &bull; All Progressive Congress</p>
        <div className="flex justify-center gap-6 text-sm mb-6">
          <a href="mailto:info@sanikutigisenate.com" className="hover:text-white transition-colors">
            info@sanikutigisenate.com
          </a>
        </div>
        <p className="text-xs text-green-400">
          &copy; {new Date().getFullYear()} Sani Kutigi Campaign. All rights reserved.
        </p>
      </footer>

    </div>
  )
}
