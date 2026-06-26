import SubmissionForm from '../components/SubmissionForm'

export default function SuggestionsPage() {
  return (
    <div className="py-14 px-6">
      <div className="max-w-2xl mx-auto">

        <div className="mb-10">
          <p className="text-green-700 text-sm font-semibold uppercase tracking-widest mb-2">
            Shape Our Agenda
          </p>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">
            Share a Suggestion
          </h1>
          <p className="text-gray-500 text-base leading-relaxed">
            Your ideas matter. Help Sani Kutigi build a stronger agenda for Niger State South
            by sharing what matters most to you — infrastructure, education, healthcare,
            security, or any other priority area.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm">
          <SubmissionForm
            type="suggestion"
            subjectPlaceholder="e.g. Improve road networks in Bida"
            messagePlaceholder="Describe your suggestion in detail. What problem does it solve? Who does it benefit?…"
          />
        </div>

      </div>
    </div>
  )
}
