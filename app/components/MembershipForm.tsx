'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import {
  PASSPORT_PHOTO_MAX_BYTES,
  PASSPORT_PHOTO_TYPES,
  type MembershipRegistration,
} from '@/lib/membership'
import MembershipCard from './MembershipCard'

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
    nin: '',
    voter_id: '',
    lga: '',
    ward: '',
    occupation: '',
    message: '',
    agreed: false,
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [membership, setMembership] = useState<MembershipRegistration | null>(null)
  const [passportPhoto, setPassportPhoto] = useState<File | null>(null)
  const [passportPreview, setPassportPreview] = useState('')
  const [passportError, setPassportError] = useState('')
  const [photoProcessing, setPhotoProcessing] = useState(false)
  const passportInput = useRef<HTMLInputElement>(null)
  const photoSelection = useRef(0)
  const photoObjectUrl = useRef('')

  useEffect(() => {
    return () => {
      photoSelection.current += 1
      if (photoObjectUrl.current) URL.revokeObjectURL(photoObjectUrl.current)
    }
  }, [])

  async function handlePassportChange(e: React.ChangeEvent<HTMLInputElement>) {
    const input = e.currentTarget
    const file = input.files?.[0]
    const selection = ++photoSelection.current

    if (photoObjectUrl.current) URL.revokeObjectURL(photoObjectUrl.current)
    photoObjectUrl.current = ''
    setPassportPhoto(null)
    setPassportPreview('')
    setPassportError('')
    setPhotoProcessing(false)

    if (!file) return
    if (!PASSPORT_PHOTO_TYPES.some((type) => type === file.type)) {
      setPassportError('Please choose a JPEG or PNG passport photograph.')
      input.value = ''
      return
    }
    if (file.size > PASSPORT_PHOTO_MAX_BYTES) {
      setPassportError('Your passport photograph must be 2 MB or smaller.')
      input.value = ''
      return
    }

    const objectUrl = URL.createObjectURL(file)
    photoObjectUrl.current = objectUrl
    setPhotoProcessing(true)

    try {
      const preview = new window.Image()
      preview.src = objectUrl
      await preview.decode()
      if (selection !== photoSelection.current) return
      setPassportPhoto(file)
      setPassportPreview(objectUrl)
    } catch {
      if (selection !== photoSelection.current) return
      URL.revokeObjectURL(objectUrl)
      photoObjectUrl.current = ''
      input.value = ''
      setPassportError('This photograph could not be opened. Please choose another JPEG or PNG image.')
    } finally {
      if (selection === photoSelection.current) setPhotoProcessing(false)
    }
  }

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
    if (photoProcessing) return
    if (!passportPhoto) {
      setPassportError('Please upload your passport photograph to register.')
      passportInput.current?.focus()
      return
    }
    if (!form.agreed) {
      setErrorMsg('You must agree to the Oath of Membership to proceed.')
      return
    }
    setStatus('loading')
    setErrorMsg('')

    try {
      const body = new FormData()
      body.set('type', 'membership')
      body.set('name', form.name)
      body.set('email', form.email)
      body.set('phone', form.phone)
      body.set('nin', form.nin)
      body.set('voter_id', form.voter_id)
      body.set('lga', form.lga)
      body.set('ward', form.ward)
      body.set('occupation', form.occupation)
      body.set('subject', 'Membership Registration')
      body.set('message', form.message || 'Membership registration request.')
      body.set('passport_photo', passportPhoto)

      const res = await fetch('/api/submissions', {
        method: 'POST',
        body,
      })

      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        throw new Error(data.error || 'Registration failed')
      }

      setMembership(data.membership)
      window.dispatchEvent(new Event('skv:member-registered'))
      setStatus('success')
    } catch (err) {
      setStatus('error')
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    }
  }

  if (status === 'success' && membership) {
    return (
      <div data-membership-success className="bg-green-50 border border-green-200 rounded-2xl p-6 sm:p-8 text-center">
        <div data-membership-print-hidden role="status">
          <div className="w-16 h-16 rounded-full bg-green-700 text-white text-3xl flex items-center justify-center mx-auto mb-4">
            ✓
          </div>
          <h3 className="text-xl font-bold text-green-800 mb-2">Welcome to SKV 2027!</h3>
          <div className="bg-white border border-green-200 rounded-xl px-4 py-3 mb-4">
            <p className="text-sm text-green-800 font-medium">Your registration number</p>
            <p className="text-2xl font-bold text-green-900 tracking-wide break-all">{membership.registrationNumber}</p>
            <p className="text-xs text-gray-500 mt-1">Keep this number for future enquiries.</p>
          </div>
          <p className="text-gray-600 mb-2">
            Thank you, <span className="font-semibold">{membership.name}</span>. Your membership
            registration has been received and will be reviewed by the coordinating office.
          </p>
          <p className="text-gray-500 text-sm">
            You will be contacted via <span className="font-medium">{membership.email}</span> once
            your membership is confirmed.
          </p>
        </div>
        <MembershipCard membership={membership} />
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            National Identification Number (NIN) <span className="text-red-500">*</span>
          </label>
          <input type="text" inputMode="numeric" name="nin" required value={form.nin} onChange={handleChange}
            maxLength={11} pattern="[0-9]{11}" title="Enter your 11-digit NIN"
            placeholder="e.g. 12345678901" className={inputBase} />
          <p className="text-xs text-gray-500 mt-1">Your 11-digit National Identification Number. Used to prevent duplicate registrations.</p>
        </div>
        <div>
          <label htmlFor="membership-voter-id" className="block text-sm font-semibold text-gray-700 mb-1">
            Voter Identification Number (VIN) <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <input id="membership-voter-id" type="text" name="voter_id" value={form.voter_id} onChange={handleChange}
            maxLength={32} pattern="[A-Za-z0-9 ]+" title="Use letters, numbers and spaces only"
            aria-describedby="membership-voter-id-help" placeholder="Enter the VIN on your voter card" className={inputBase} />
          <p id="membership-voter-id-help" className="text-xs text-gray-500 mt-1">Enter your VIN as printed on your voter card, if available.</p>
        </div>
      </div>

      <div className="border border-gray-200 bg-gray-50 rounded-2xl p-5">
        <label htmlFor="membership-passport-photo" className="block text-sm font-semibold text-gray-700 mb-1">
          Passport Photograph <span className="text-red-500">*</span>
        </label>
        <p id="membership-passport-photo-help" className="text-xs text-gray-500 mb-3">
          Upload a clear, recent passport photograph showing your face. JPEG or PNG, maximum 2 MB.
        </p>
        <input ref={passportInput} id="membership-passport-photo" type="file" name="passport_photo" required
          accept={PASSPORT_PHOTO_TYPES.join(',')} onChange={handlePassportChange} disabled={status === 'loading'}
          aria-describedby={`membership-passport-photo-help${passportError ? ' membership-passport-photo-error' : ''}`}
          aria-invalid={Boolean(passportError)}
          className={`${inputBase} bg-white file:mr-3 file:rounded-lg file:border-0 file:bg-green-100 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-green-800`} />
        {photoProcessing && <p role="status" className="text-xs text-gray-500 mt-2">Checking your photograph…</p>}
        {passportError && <p id="membership-passport-photo-error" role="alert" className="text-sm text-red-600 mt-2">{passportError}</p>}
        {passportPreview && (
          <div className="mt-4 flex items-center gap-4">
            <Image src={passportPreview} width={96} height={120} unoptimized
              alt="Preview of your selected passport photograph" className="h-30 w-24 rounded-lg border border-gray-200 bg-white object-contain" />
            <p className="text-sm text-gray-600 break-all">{passportPhoto?.name}</p>
          </div>
        )}
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
        <p role="alert" className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          {errorMsg}
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'loading' || photoProcessing}
        className="w-full sm:w-auto bg-green-700 text-white font-bold px-10 py-3 rounded-full hover:bg-green-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === 'loading' ? 'Registering…' : photoProcessing ? 'Checking photograph…' : 'Register as a Member'}
      </button>
    </form>
  )
}
