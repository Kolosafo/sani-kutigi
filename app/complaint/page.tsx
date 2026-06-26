import SubmissionForm from '../components/SubmissionForm'

export default function ComplaintPage() {
  return (
    <div className="py-14 px-6">
      <div className="max-w-2xl mx-auto">

        <div className="mb-10">
          <p className="text-green-700 text-sm font-semibold uppercase tracking-widest mb-2">
            Voice Your Concerns
          </p>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">
            File a Complaint
          </h1>
          <p className="text-gray-500 text-base leading-relaxed">
            Encountered an issue relating to the campaign, a representative, or a community
            matter you want addressed? Use this form to bring it to the attention of the
            campaign team. All complaints are treated with confidentiality.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm">
          <SubmissionForm
            type="complaint"
            subjectPlaceholder="e.g. Issue with campaign representative"
            messagePlaceholder="Describe the issue in detail. Include relevant dates, locations, or names if applicable…"
          />
        </div>

      </div>
    </div>
  )
}
