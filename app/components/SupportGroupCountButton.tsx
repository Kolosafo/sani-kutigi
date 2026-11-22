'use client'

import RegistrationCountButton from './RegistrationCountButton'

export default function SupportGroupCountButton() {
  return (
    <RegistrationCountButton
      endpoint="/api/support-groups/count"
      registrationEvent="skv:support-group-registered"
      label="Registered support groups"
      detailLabel="Registered SKV 2027 support groups"
      registerHref="/support-groups"
      registerLabel="Register your support group"
    />
  )
}
