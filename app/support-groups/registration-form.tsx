'use client'

import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import {
  SUPPORT_GROUP_CERTIFICATE_ACCEPT,
  SUPPORT_GROUP_FILE_MAX_BYTES,
  SUPPORT_GROUP_REGISTER_ACCEPT,
  type SupportGroupField,
  type SupportGroupFieldErrors,
} from '@/lib/support-groups'

type DocumentField = 'certificate' | 'membership_register'
type TextField = Exclude<SupportGroupField, DocumentField>
type FormValues = Record<TextField, string>
type SavedRegistration = { groupName: string; reference: string }

const emptyValues: FormValues = {
  group_name: '',
  chairman_name: '',
  chairman_phone: '',
  secretary_name: '',
  secretary_phone: '',
  headquarters: '',
  member_count: '',
}

const fieldLabels: Record<SupportGroupField, string> = {
  group_name: 'Name of support group',
  chairman_name: 'Name of president / chairman',
  chairman_phone: 'President / chairman phone number',
  secretary_name: 'Secretary name',
  secretary_phone: 'Secretary phone number',
  headquarters: 'Support group headquarters',
  member_count: 'Number of registered members',
  certificate: 'Registration certificate',
  membership_register: 'Membership register',
}

const inputBase = 'block w-full min-w-0 rounded-xl border bg-white px-4 py-3 text-base leading-6 text-gray-900 placeholder:text-gray-400 transition-colors focus:border-green-700 focus:outline-none focus:ring-3 focus:ring-green-100 disabled:cursor-wait disabled:bg-gray-50 disabled:text-gray-500'
const fieldOrder = Object.keys(fieldLabels) as SupportGroupField[]

function documentError(file: File | null, accept: string) {
  if (!file || file.size === 0) return 'Please choose a file to upload.'
  if (file.size > SUPPORT_GROUP_FILE_MAX_BYTES) return 'Choose a file that is 2 MB or smaller.'
  const extension = `.${file.name.split('.').pop()?.toLowerCase()}`
  if (!accept.split(',').includes(extension)) return 'Choose one of the accepted file formats listed below.'
  return undefined
}

function readFieldErrors(value: unknown): SupportGroupFieldErrors {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {}
  return Object.fromEntries(fieldOrder.flatMap((field) => {
    const message = (value as Record<string, unknown>)[field]
    return typeof message === 'string' && message ? [[field, message]] : []
  }))
}

export default function RegistrationForm() {
  const [values, setValues] = useState<FormValues>(emptyValues)
  const [files, setFiles] = useState<Record<DocumentField, File | null>>({ certificate: null, membership_register: null })
  const [fieldErrors, setFieldErrors] = useState<SupportGroupFieldErrors>({})
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)
  const [registration, setRegistration] = useState<SavedRegistration | null>(null)
  const submitting = useRef(false)
  const resultRef = useRef<HTMLDivElement>(null)
  const groupNameRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (registration || error) resultRef.current?.focus()
  }, [registration, error])

  function update(field: TextField, value: string) {
    setValues((previous) => ({ ...previous, [field]: value }))
    setFieldErrors((previous) => ({ ...previous, [field]: undefined }))
    setError('')
  }

  function updateDocument(field: DocumentField, event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null
    const accept = field === 'certificate' ? SUPPORT_GROUP_CERTIFICATE_ACCEPT : SUPPORT_GROUP_REGISTER_ACCEPT
    setFiles((previous) => ({ ...previous, [field]: file }))
    setFieldErrors((previous) => ({ ...previous, [field]: file ? documentError(file, accept) : undefined }))
    setError('')
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (submitting.current) return

    const details = Object.fromEntries(Object.entries(values).map(([field, value]) => [field, value.trim()])) as FormValues
    const errors: SupportGroupFieldErrors = {}
    for (const field of Object.keys(details) as TextField[]) {
      if (!details[field]) errors[field] = `Please enter ${fieldLabels[field].toLowerCase()}.`
    }
    for (const field of ['chairman_phone', 'secretary_phone'] as const) {
      const phone = details[field]
      const digits = phone.replace(/\D/g, '')
      if (phone && (!/^\+?[\d\s()-]+$/.test(phone) || digits.length < 10 || digits.length > 15)) {
        errors[field] = 'Enter a phone number with 10 to 15 digits. You can include a country code.'
      }
    }
    if (details.member_count && (!/^\d+$/.test(details.member_count) || Number(details.member_count) < 1 || Number(details.member_count) > 1_000_000)) {
      errors.member_count = 'Enter a whole number between 1 and 1,000,000.'
    }
    for (const [field, accept] of [['certificate', SUPPORT_GROUP_CERTIFICATE_ACCEPT], ['membership_register', SUPPORT_GROUP_REGISTER_ACCEPT]] as const) {
      const message = documentError(files[field], accept)
      if (message) errors[field] = message
    }
    if (Object.keys(errors).length) {
      setFieldErrors(errors)
      setError('Please check the highlighted fields and try again.')
      resultRef.current?.focus()
      return
    }

    submitting.current = true
    setPending(true)
    setError('')
    setFieldErrors({})

    try {
      const body = new FormData()
      for (const [field, value] of Object.entries(details)) body.set(field, value)
      body.set('certificate', files.certificate!)
      body.set('membership_register', files.membership_register!)
      const response = await fetch('/api/support-groups', { method: 'POST', body })
      const result: { success?: unknown; id?: unknown; reference?: unknown; error?: unknown; fieldErrors?: unknown } = await response.json()
      if (response.status !== 201 || result.success !== true || typeof result.id !== 'string' || !result.id || typeof result.reference !== 'string' || !result.reference) {
        setFieldErrors(readFieldErrors(result.fieldErrors))
        setError(typeof result.error === 'string' ? result.error : 'We could not save your registration. Please try again.')
        return
      }
      setRegistration({ groupName: details.group_name, reference: result.reference })
      window.dispatchEvent(new Event('skv:support-group-registered'))
    } catch {
      setError('We could not confirm your registration. Check your connection and try again. Your details and selected files are still here.')
    } finally {
      submitting.current = false
      setPending(false)
    }
  }

  function input(field: TextField, options: { type?: string; maxLength?: number; placeholder?: string; autoComplete?: string } = {}) {
    return (
      <div className="min-w-0">
        <label htmlFor={`support-group-${field}`} className="mb-2 block text-sm font-semibold text-gray-800">{fieldLabels[field]}</label>
        <input
          ref={field === 'group_name' ? groupNameRef : undefined}
          id={`support-group-${field}`}
          name={field}
          type={options.type ?? 'text'}
          required
          min={field === 'member_count' ? 1 : undefined}
          max={field === 'member_count' ? 1_000_000 : undefined}
          step={field === 'member_count' ? 1 : undefined}
          inputMode={field === 'member_count' ? 'numeric' : options.type === 'tel' ? 'tel' : undefined}
          maxLength={options.maxLength}
          autoComplete={options.autoComplete ?? 'off'}
          placeholder={options.placeholder}
          value={values[field]}
          onChange={(event) => update(field, event.target.value)}
          aria-invalid={Boolean(fieldErrors[field])}
          aria-describedby={fieldErrors[field] ? `support-group-${field}-error` : undefined}
          className={`${inputBase} ${fieldErrors[field] ? 'border-red-500' : 'border-gray-300'}`}
        />
        {fieldErrors[field] && <p id={`support-group-${field}-error`} className="mt-2 text-sm leading-relaxed text-red-700">{fieldErrors[field]}</p>}
      </div>
    )
  }

  function document(field: DocumentField, accept: string, hint: string) {
    return (
      <div className={`min-w-0 rounded-xl border bg-gray-50 p-4 ${fieldErrors[field] ? 'border-red-400' : 'border-gray-200'}`}>
        <label htmlFor={`support-group-${field}`} className="mb-2 block text-sm font-semibold text-gray-800">Upload {fieldLabels[field].toLowerCase()}</label>
        <p id={`support-group-${field}-hint`} className="mb-4 text-xs leading-relaxed text-gray-500">{hint} Maximum 2 MB.</p>
        <input
          id={`support-group-${field}`}
          name={field}
          type="file"
          required
          accept={accept}
          onChange={(event) => updateDocument(field, event)}
          aria-invalid={Boolean(fieldErrors[field])}
          aria-describedby={`support-group-${field}-hint${fieldErrors[field] ? ` support-group-${field}-error` : ''}`}
          className="block w-full min-w-0 rounded-lg text-sm text-gray-600 file:mr-3 file:rounded-lg file:border-0 file:bg-green-100 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-green-900 hover:file:bg-green-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-green-700 disabled:cursor-wait"
        />
        {files[field] && <p className="mt-3 break-all text-xs font-medium text-green-800">Selected: {files[field].name}</p>}
        {fieldErrors[field] && <p id={`support-group-${field}-error`} className="mt-2 text-sm leading-relaxed text-red-700">{fieldErrors[field]}</p>}
      </div>
    )
  }

  if (registration) {
    return (
      <div ref={resultRef} tabIndex={-1} aria-labelledby="support-group-success-title" className="rounded-xl focus:outline-none focus-visible:ring-3 focus-visible:ring-green-200">
        <div aria-hidden="true" className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-800">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-7 w-7"><path d="m5 12 4 4L19 6" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
        <p className="text-xs font-bold uppercase tracking-widest text-green-800">Registration saved</p>
        <h2 id="support-group-success-title" className="mt-3 text-2xl font-extrabold leading-tight text-gray-900 sm:text-3xl">Thank you for registering your group.</h2>
        <p className="mt-4 text-base leading-relaxed text-gray-600">Your support group details and both documents have been saved. Keep your registration reference for future enquiries.</p>
        <dl className="my-7 space-y-5 rounded-xl border border-green-200 bg-green-50 p-5">
          <div><dt className="text-sm text-gray-500">Support group</dt><dd className="mt-1 break-words font-semibold text-gray-900">{registration.groupName}</dd></div>
          <div className="border-t border-green-200 pt-4"><dt className="text-sm text-gray-500">Registration reference</dt><dd className="mt-2 select-text break-all font-mono text-sm font-semibold text-green-900">{registration.reference}</dd></div>
        </dl>
        <button type="button" onClick={() => {
          setRegistration(null)
          setValues(emptyValues)
          setFiles({ certificate: null, membership_register: null })
          setFieldErrors({})
          setError('')
          requestAnimationFrame(() => groupNameRef.current?.focus())
        }} className="rounded-full bg-green-700 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-green-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-green-700">Register another support group</button>
      </div>
    )
  }

  return (
    <form onSubmit={submit} noValidate aria-busy={pending}>
      <div className="mb-6 border-b border-gray-100 pb-6">
        <h2 className="text-2xl font-extrabold text-gray-900">Tell us about your group</h2>
        <p className="mt-2 text-sm leading-relaxed text-gray-500">All fields and both document uploads are required.</p>
      </div>

      {error && (
        <div ref={resultRef} role="alert" tabIndex={-1} className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm leading-relaxed text-red-800 focus:outline-2 focus:outline-offset-2 focus:outline-red-600">
          <p className="font-semibold">{error}</p>
          {fieldOrder.some((field) => fieldErrors[field]) && (
            <ul className="mt-2 list-disc space-y-1 pl-5">
              {fieldOrder.filter((field) => fieldErrors[field]).map((field) => <li key={field}><a href={`#support-group-${field}`} onClick={(event) => { event.preventDefault(); window.document.getElementById(`support-group-${field}`)?.focus() }} className="underline underline-offset-2">{fieldLabels[field]}: {fieldErrors[field]}</a></li>)}
            </ul>
          )}
        </div>
      )}

      <fieldset disabled={pending} className="min-w-0 space-y-8 border-0 p-0">
        <legend className="sr-only">Support group registration details</legend>
        <fieldset className="min-w-0 space-y-5 border-0 p-0">
          <legend className="mb-4 text-sm font-bold uppercase tracking-wide text-green-800">Group details</legend>
          {input('group_name', { maxLength: 160, placeholder: 'Enter the full name of your support group' })}
          <div className="grid gap-5 sm:grid-cols-2">
            {input('headquarters', { maxLength: 400, placeholder: 'Enter your group headquarters' })}
            {input('member_count', { type: 'number', placeholder: 'Enter total members' })}
          </div>
        </fieldset>

        <fieldset className="min-w-0 border-0 border-t border-gray-100 p-0 pt-6">
          <legend className="px-0 text-sm font-bold uppercase tracking-wide text-green-800">Leadership contacts</legend>
          <div className="grid gap-5 sm:grid-cols-2">
            {input('chairman_name', { maxLength: 120, placeholder: 'Enter full name', autoComplete: 'section-chairman name' })}
            {input('chairman_phone', { type: 'tel', maxLength: 32, placeholder: 'e.g. +234 800 000 0000', autoComplete: 'section-chairman tel' })}
            {input('secretary_name', { maxLength: 120, placeholder: 'Enter full name', autoComplete: 'section-secretary name' })}
            {input('secretary_phone', { type: 'tel', maxLength: 32, placeholder: 'e.g. +234 800 000 0000', autoComplete: 'section-secretary tel' })}
          </div>
        </fieldset>

        <fieldset className="min-w-0 border-0 border-t border-gray-100 p-0 pt-6">
          <legend className="px-0 text-sm font-bold uppercase tracking-wide text-green-800">Registration documents</legend>
          <div className="grid gap-5 sm:grid-cols-2">
            {document('certificate', SUPPORT_GROUP_CERTIFICATE_ACCEPT, 'PDF, JPG or PNG.')}
            {document('membership_register', SUPPORT_GROUP_REGISTER_ACCEPT, 'PDF, JPG, PNG, CSV, XLS or XLSX.')}
          </div>
        </fieldset>

        <button type="submit" disabled={pending} className="w-full rounded-full bg-green-700 px-6 py-3.5 text-base font-bold text-white transition-colors hover:bg-green-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-green-700 disabled:cursor-wait disabled:bg-green-600">
          {pending ? 'Saving your registration and documents…' : 'Submit support group registration'}
        </button>
      </fieldset>

      <p className="mt-5 text-center text-xs leading-relaxed text-gray-500">
        Your group details, leadership contacts and documents will be used to coordinate support groups with the Sani Kutigi Vanguard.
      </p>
    </form>
  )
}
