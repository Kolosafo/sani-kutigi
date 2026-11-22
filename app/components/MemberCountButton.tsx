'use client'

import RegistrationCountButton from './RegistrationCountButton'

export default function MemberCountButton() {
  return (
    <RegistrationCountButton
      endpoint="/api/members/count"
      registrationEvent="skv:member-registered"
      label="Registered members"
      detailLabel="Registered SKV 2027 members"
      registerHref="/join"
      registerLabel="Join the Vanguard"
    />
  )
}
