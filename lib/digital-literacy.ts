import { skills } from '@/lib/skills'

export const DIGITAL_LITERACY_LGAS = [
  'Agaie',
  'Bida',
  'Edati',
  'Gbako',
  'Katcha',
  'Lapai',
  'Lavun',
  'Mokwa',
] as const

// Keep the registration choices in step with the public course library.
export const DIGITAL_LITERACY_COURSES = skills.map(({ slug, name }) => ({ slug, name }))

export type RegistrationField = 'name' | 'lga' | 'course'
export type RegistrationFieldErrors = Partial<Record<RegistrationField, string>>

export function validateDigitalLiteracyRegistration(body: unknown) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { error: 'Please provide your name, LGA and preferred course.' } as const
  }

  const input = body as Record<string, unknown>
  const name = typeof input.name === 'string' ? input.name.trim().replace(/\s+/g, ' ') : ''
  const lga = typeof input.lga === 'string' ? input.lga.trim() : ''
  const course = typeof input.course === 'string' ? input.course.trim() : ''
  const fieldErrors: RegistrationFieldErrors = {}

  if (!name || name.length > 120) {
    fieldErrors.name = 'Enter your full name using 1 to 120 characters.'
  }
  if (!DIGITAL_LITERACY_LGAS.some((option) => option === lga)) {
    fieldErrors.lga = 'Choose your LGA in Niger South from the list.'
  }
  if (!DIGITAL_LITERACY_COURSES.some((option) => option.slug === course)) {
    fieldErrors.course = 'Choose a course from the list.'
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { error: 'Please check the highlighted fields.', fieldErrors } as const
  }

  return { registration: { name, lga, course } } as const
}
