'use client'

import { useEffect, useRef, useState, type FormEvent } from 'react'
import type { RegistrationField } from '@/lib/digital-literacy'
import styles from './digital-literacy.module.css'

type Course = { slug: string; name: string }
type FormValues = Record<RegistrationField, string>
type FieldErrors = Partial<Record<RegistrationField, string>>
type Registration = FormValues & { id: string }

const emptyValues: FormValues = { name: '', lga: '', course: '' }

export default function RegistrationForm({ courses, lgas }: {
  courses: readonly Course[]
  lgas: readonly string[]
}) {
  const [values, setValues] = useState<FormValues>(emptyValues)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)
  const [registration, setRegistration] = useState<Registration | null>(null)
  const submitting = useRef(false)
  const resultRef = useRef<HTMLDivElement>(null)
  const nameRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (registration || error) resultRef.current?.focus()
  }, [registration, error])

  function update(field: RegistrationField, value: string) {
    setValues((previous) => ({ ...previous, [field]: value }))
    setFieldErrors((previous) => ({ ...previous, [field]: undefined }))
    setError('')
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (submitting.current) return

    const details = { ...values, name: values.name.trim().replace(/\s+/g, ' ') }
    if (!details.name) {
      setFieldErrors({ name: 'Please enter your full name.' })
      nameRef.current?.focus()
      return
    }

    submitting.current = true
    setPending(true)
    setError('')
    setFieldErrors({})

    try {
      const response = await fetch('/api/digital-literacy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(details),
      })
      const result: {
        success?: unknown
        id?: unknown
        error?: unknown
        fieldErrors?: FieldErrors
      } = await response.json()

      if (!response.ok || result.success !== true || typeof result.id !== 'string' || !result.id) {
        setFieldErrors(result.fieldErrors ?? {})
        setError(typeof result.error === 'string' ? result.error : 'We could not save your registration. Please try again.')
        return
      }

      setRegistration({ ...details, id: result.id })
    } catch {
      setError('We could not confirm your registration. Check your connection and try again.')
    } finally {
      submitting.current = false
      setPending(false)
    }
  }

  if (registration) {
    return (
      <div ref={resultRef} tabIndex={-1} className={styles.success} aria-labelledby="registration-success-title">
        <div className={styles.successIcon} aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 12 4 4 8-8" /></svg>
        </div>
        <p className={styles.formEyebrow}>Registration received</p>
        <h2 id="registration-success-title">You&apos;re registered, {registration.name}.</h2>
        <p className={styles.successCopy}>Your details have been saved for the digital literacy programme. Keep a copy of your registration reference.</p>
        <dl className={styles.summary}>
          <div><dt>Full name</dt><dd>{registration.name}</dd></div>
          <div><dt>Local government area</dt><dd>{registration.lga}</dd></div>
          <div><dt>Selected course</dt><dd>{courses.find((course) => course.slug === registration.course)?.name ?? registration.course}</dd></div>
          <div className={styles.reference}><dt>Registration reference</dt><dd>{registration.id}</dd></div>
        </dl>
        <button type="button" className={styles.submitButton} onClick={() => {
          setRegistration(null)
          setValues(emptyValues)
          setFieldErrors({})
          setError('')
          requestAnimationFrame(() => nameRef.current?.focus())
        }}>Register another participant</button>
      </div>
    )
  }

  return (
    <>
      <div className={styles.formHeading}>
        <p className={styles.formEyebrow}>Take your next step</p>
        <h2>Register to attend</h2>
        <p>Tell us a little about yourself to get started.</p>
      </div>

      <form onSubmit={submit} aria-busy={pending} className={styles.form}>
        <p className={styles.requiredNote}>All three fields are required.</p>

        {error && <div ref={resultRef} className={styles.errorSummary} role="alert" tabIndex={-1}>{error}</div>}

        <fieldset disabled={pending} className={styles.fields}>
          <legend className={styles.srOnly}>Participant details</legend>
          <div className={styles.field}>
            <label htmlFor="participant-name">Full name</label>
            <input
              ref={nameRef}
              id="participant-name"
              name="name"
              type="text"
              autoComplete="name"
              required
              maxLength={120}
              placeholder="Enter your full name"
              value={values.name}
              onChange={(event) => update('name', event.target.value)}
              aria-invalid={Boolean(fieldErrors.name)}
              aria-describedby={fieldErrors.name ? 'participant-name-error' : undefined}
            />
            {fieldErrors.name && <p className={styles.fieldError} id="participant-name-error">{fieldErrors.name}</p>}
          </div>

          <div className={styles.field}>
            <label htmlFor="participant-lga">Local government area (LGA)</label>
            <div className={styles.selectWrap}>
              <select id="participant-lga" name="lga" required value={values.lga} onChange={(event) => update('lga', event.target.value)} aria-invalid={Boolean(fieldErrors.lga)} aria-describedby={fieldErrors.lga ? 'participant-lga-error' : undefined}>
                <option value="" disabled>Select your LGA</option>
                {lgas.map((lga) => <option key={lga} value={lga}>{lga}</option>)}
              </select>
              <Chevron />
            </div>
            {fieldErrors.lga && <p className={styles.fieldError} id="participant-lga-error">{fieldErrors.lga}</p>}
          </div>

          <div className={styles.field}>
            <label htmlFor="participant-course">Course you want to study</label>
            <div className={styles.selectWrap}>
              <select id="participant-course" name="course" required value={values.course} onChange={(event) => update('course', event.target.value)} aria-invalid={Boolean(fieldErrors.course)} aria-describedby={fieldErrors.course ? 'participant-course-error' : 'participant-course-hint'}>
                <option value="" disabled>Choose a course</option>
                {courses.map((course) => <option key={course.slug} value={course.slug}>{course.name}</option>)}
              </select>
              <Chevron />
            </div>
            <p id="participant-course-hint" className={styles.fieldHint}>Select the course you are most interested in learning.</p>
            {fieldErrors.course && <p className={styles.fieldError} id="participant-course-error">{fieldErrors.course}</p>}
          </div>

          <button type="submit" className={styles.submitButton} disabled={pending}>
            {pending ? 'Saving your registration…' : 'Submit registration'}
          </button>
        </fieldset>

        <p className={styles.privacyNote}>
          Your name, LGA and course choice will be saved to organise participation in this programme.
        </p>
      </form>
    </>
  )
}

function Chevron() {
  return <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="m6 8 4 4 4-4" /></svg>
}
