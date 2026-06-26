import SubmissionForm from '../components/SubmissionForm'

export default function InquiryPage() {
  return (
    <div className="py-14 px-6">
      <div className="max-w-2xl mx-auto">

        <div className="mb-10">
          <p className="text-green-700 text-sm font-semibold uppercase tracking-widest mb-2">
            Get in Touch
          </p>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">
            Send an Inquiry
          </h1>
          <p className="text-gray-500 text-base leading-relaxed">
            Have a question about Sani Kutigi's campaign, policies, or how to get involved?
            Fill in the form below and the campaign team will get back to you.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm">
          <SubmissionForm
            type="inquiry"
            subjectPlaceholder="e.g. Campaign event in my area"
            messagePlaceholder="Write your question or message here…"
          />
        </div>

      </div>
    </div>
  )
}
