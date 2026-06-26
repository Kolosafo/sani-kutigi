import MembershipForm from '../components/MembershipForm'

const benefits = [
  { icon: '🗳️', text: 'Attend and vote in all general and executive meetings.' },
  { icon: '🎤', text: 'Express opinions freely within organizational rules.' },
  { icon: '🏃', text: 'Participate in campaigns, programs and activities.' },
  { icon: '🏆', text: 'Be considered for appointment into offices and committees.' },
]

export default function JoinPage() {
  return (
    <div className="py-14 px-6">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block bg-green-100 text-green-800 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
            Membership
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">
            Join the Sani Kutigi Vanguard
          </h1>
          <p className="text-green-700 italic text-lg font-medium mb-4">
            &ldquo;Leading the Way for a Greater Niger South&rdquo;
          </p>
          <p className="text-gray-500 text-base max-w-2xl mx-auto leading-relaxed">
            Become a registered member of SKV 2027 and join thousands of supporters working
            to bring Distinguished Mohammed Sani Idris Legbo Kutigi to the Niger State South
            Senate seat. Together we are stronger.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Left: eligibility & benefits */}
          <div className="lg:col-span-1 space-y-6">

            <div className="bg-green-800 text-white rounded-2xl p-6">
              <h2 className="font-extrabold text-lg mb-3">Eligibility</h2>
              <p className="text-green-200 text-sm leading-relaxed">
                Membership is open to any person who supports the aims and objectives of SKV 2027,
                is of good character, and agrees to abide by our Constitution.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <h2 className="font-extrabold text-gray-900 text-lg mb-4">Member Benefits</h2>
              <ul className="space-y-4">
                {benefits.map(({ icon, text }) => (
                  <li key={text} className="flex gap-3 text-sm text-gray-600">
                    <span className="text-xl shrink-0">{icon}</span>
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
              <h2 className="font-bold text-blue-900 text-base mb-2">Official Colours</h2>
              <div className="flex gap-2 mt-2">
                {[
                  { color: 'bg-green-700', label: 'Green' },
                  { color: 'bg-white border border-gray-300', label: 'White' },
                  { color: 'bg-blue-700', label: 'Blue' },
                  { color: 'bg-red-600', label: 'Red' },
                ].map(({ color, label }) => (
                  <div key={label} className="flex flex-col items-center gap-1">
                    <div className={`w-8 h-8 rounded-full ${color}`} />
                    <span className="text-xs text-gray-500">{label}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right: form */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm">
              <h2 className="font-extrabold text-gray-900 text-xl mb-1">Registration Form</h2>
              <p className="text-gray-400 text-sm mb-6">
                Fields marked <span className="text-red-500 font-bold">*</span> are required.
              </p>
              <MembershipForm />
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}
