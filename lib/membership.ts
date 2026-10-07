export type MembershipRegistration = {
  id: string
  name: string
  email: string
  phone: string
  lga: string
  ward: string
  occupation: string
  createdAt: string
}

export const MEMBERSHIP_CARD_FIELDS = 'id, name, email, phone, lga, ward, occupation, created_at'

type MembershipSubmission = Omit<MembershipRegistration, 'createdAt'> & { created_at: string }

export function toMembershipRegistration(submission: MembershipSubmission): MembershipRegistration {
  return {
    id: submission.id,
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
    { label: 'Registration reference', value: membership.id },
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
