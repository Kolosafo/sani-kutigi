'use client'

import { useState } from 'react'

const inputBase =
  'w-full border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition'

const lgas = [
  'Agaie',
  'Agwara',
  'Bida',
  'Borgu',
  'Bosso',
  'Chanchaga',
  'Edati',
  'Gbako',
  'Gurara',
  'Katcha',
  'Kontagora',
  'Lapai',
  'Lavun',
  'Magama',
  'Mariga',
  'Mashegu',
  'Mokwa',
  'Munya',
  'Paikoro',
  'Rafi',
  'Rijau',
  'Shiroro',
  'Suleja',
  'Tafa',
  'Wushishi',
]

export default function MembershipForm() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    lga: '',
    ward: '',
    occupation: '',
    message: '',
    agreed: false,
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value, type } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.agreed) {
      setErrorMsg('You must agree to the Oath of Membership to proceed.')
      return
    }
    setStatus('loading')
    setErrorMsg('')

    try {
      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'membership',
          name: form.name,
          email: form.email,
          phone: form.phone,
          lga: form.lga,
          ward: form.ward,
          occupation: form.occupation,
          subject: 'Membership Registration',
          message: form.message || 'Membership registration request.',
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Registration failed')
      }

      setStatus('success')
    } catch (err) {
      setStatus('error')
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    }
  }

  if (status === 'success') {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-10 text-center">
        <div className="w-16 h-16 rounded-full bg-green-700 text-white text-3xl flex items-center justify-center mx-auto mb-4">
          ✓
        </div>
        <h3 className="text-xl font-bold text-green-800 mb-2">Welcome to SKV 2027!</h3>
        <p className="text-gray-600 mb-2">
          Thank you, <span className="font-semibold">{form.name}</span>. Your membership
          registration has been received and will be reviewed by the coordinating office.
        </p>
        <p className="text-gray-500 text-sm">
          You will be contacted via <span className="font-medium">{form.email}</span> once
          your membership is confirmed.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Personal info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input type="text" name="name" required value={form.name} onChange={handleChange}
            placeholder="e.g. Aminu Bello" className={inputBase} />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input type="email" name="email" required value={form.email} onChange={handleChange}
            placeholder="you@example.com" className={inputBase} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <input type="tel" name="phone" required value={form.phone} onChange={handleChange}
            placeholder="+234 800 000 0000" className={inputBase} />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Occupation <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <input type="text" name="occupation" value={form.occupation} onChange={handleChange}
            placeholder="e.g. Teacher, Farmer, Trader" className={inputBase} />
        </div>
      </div>

      {/* Location */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Local Government Area <span className="text-red-500">*</span>
          </label>
          <select name="lga" required value={form.lga} onChange={handleChange} className={inputBase}>
            <option value="">Select LGA</option>
            {lgas.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Ward <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <input type="text" name="ward" value={form.ward} onChange={handleChange}
            placeholder="Your ward name" className={inputBase} />
        </div>
      </div>

      {/* Motivation */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Why do you want to join SKV 2027? <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <textarea name="message" rows={4} value={form.message} onChange={handleChange}
          placeholder="Share your motivation for joining the Vanguard…"
          className={`${inputBase} resize-none`} />
      </div>

      {/* Oath agreement */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
        <p className="text-blue-900 italic text-sm leading-relaxed mb-4">
          &ldquo;I solemnly pledge to uphold the Constitution of The Sani Kutigi Vanguard (SKV 2027),
          to remain loyal to its vision and leadership, to promote unity, development and progress in
          Niger South Senatorial District, and to discharge my responsibilities with honesty, discipline
          and integrity. So help me God.&rdquo;
        </p>
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="agreed"
            checked={form.agreed}
            onChange={handleChange}
            className="mt-0.5 w-4 h-4 accent-green-700"
          />
          <span className="text-sm text-gray-700 font-medium">
            I agree to the Oath of Membership and pledge to uphold the Constitution of SKV 2027.
          </span>
        </label>
      </div>

      {errorMsg && (
        <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          {errorMsg}
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full sm:w-auto bg-green-700 text-white font-bold px-10 py-3 rounded-full hover:bg-green-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === 'loading' ? 'Registering…' : 'Register as a Member'}
      </button>
    </form>
  )
}
