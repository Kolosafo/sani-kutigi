export type MembershipRegistration = {
  id: string
  registrationNumber: string
  passportPhotoUrl: string | null
  name: string
  email: string
  phone: string
  lga: string
  ward: string
  occupation: string
  createdAt: string
}

export const PASSPORT_PHOTO_MAX_BYTES = 2 * 1024 * 1024
export const PASSPORT_PHOTO_TYPES = ['image/jpeg', 'image/png']

export const MEMBERSHIP_CARD_FIELDS =
  'id, registration_number, passport_photo_path, name, email, phone, lga, ward, occupation, created_at'

type MembershipSubmission = Omit<MembershipRegistration, 'createdAt' | 'registrationNumber' | 'passportPhotoUrl'> & {
  created_at: string
  registration_number: number | string
  passport_photo_path: string
}

export function toMembershipRegistration(
  submission: MembershipSubmission,
  passportPhotoUrl: string | null = null,
): MembershipRegistration {
  return {
    id: submission.id,
    registrationNumber: `SKV-2027-${String(submission.registration_number).padStart(6, '0')}`,
    passportPhotoUrl,
    name: submission.name,
    email: submission.email,
    phone: submission.phone,
    lga: submission.lga,
    ward: submission.ward,
    occupation: submission.occupation,
    createdAt: submission.created_at,
  }
}

export const MEMBERSHIP_REVIEW_NOTICE =
  'This card acknowledges your registration. Membership is pending review by the coordinating office.'

export function getMembershipDetails(membership: MembershipRegistration) {
  return [
    { label: 'Registration number', value: membership.registrationNumber },
    {
      label: 'Registration date',
      value: new Intl.DateTimeFormat('en-NG', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        timeZone: 'Africa/Lagos',
      }).format(new Date(membership.createdAt)),
    },
    { label: 'Full name', value: membership.name },
    { label: 'Email address', value: membership.email },
    { label: 'Phone number', value: membership.phone || 'Not provided' },
    { label: 'Local Government Area', value: membership.lga || 'Not provided' },
    { label: 'Ward', value: membership.ward || 'Not provided' },
    { label: 'Occupation', value: membership.occupation || 'Not provided' },
  ]
}
