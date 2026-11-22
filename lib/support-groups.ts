export const SUPPORT_GROUP_FILE_MAX_BYTES = 2 * 1024 * 1024
export const SUPPORT_GROUP_CERTIFICATE_ACCEPT = '.pdf,.jpg,.jpeg,.png'
export const SUPPORT_GROUP_REGISTER_ACCEPT = '.pdf,.jpg,.jpeg,.png,.csv,.xls,.xlsx'

export const SUPPORT_GROUP_DETAIL_FIELDS = [
  'group_name',
  'chairman_name',
  'chairman_phone',
  'secretary_name',
  'secretary_phone',
  'headquarters',
  'member_count',
] as const

export const SUPPORT_GROUP_FILE_FIELDS = ['certificate', 'membership_register'] as const

export type SupportGroupFileField = typeof SUPPORT_GROUP_FILE_FIELDS[number]
export type SupportGroupField = typeof SUPPORT_GROUP_DETAIL_FIELDS[number] | SupportGroupFileField
export type SupportGroupFieldErrors = Partial<Record<SupportGroupField, string>>

export type SupportGroupDetails = {
  group_name: string
  chairman_name: string
  chairman_phone: string
  secretary_name: string
  secretary_phone: string
  headquarters: string
  member_count: number
}

export function validateSupportGroupDetails(body: unknown) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { error: 'Please provide your support group details.' } as const
  }

  const input = body as Record<string, unknown>
  const text = (field: string) => typeof input[field] === 'string'
    ? input[field].trim().replace(/\s+/g, ' ')
    : ''
  const fieldErrors: SupportGroupFieldErrors = {}
  const group_name = text('group_name')
  const chairman_name = text('chairman_name')
  const chairman_phone = text('chairman_phone')
  const secretary_name = text('secretary_name')
  const secretary_phone = text('secretary_phone')
  const headquarters = text('headquarters')
  const count = text('member_count')
  const member_count = Number(count)

  for (const [field, value, maximum, label] of [
    ['group_name', group_name, 160, 'group name'],
    ['chairman_name', chairman_name, 120, "chairman's name"],
    ['secretary_name', secretary_name, 120, "secretary's name"],
    ['headquarters', headquarters, 400, 'headquarters address'],
  ] as const) {
    if (!value || value.length > maximum || /[\u0000-\u001f\u007f]/.test(value)) {
      fieldErrors[field] = `Enter the ${label} using 1 to ${maximum} characters.`
    }
  }

  for (const [field, value] of [
    ['chairman_phone', chairman_phone],
    ['secretary_phone', secretary_phone],
  ] as const) {
    const digits = value.replace(/\D/g, '')
    if (value.length > 40 || !/^\+?[\d ()-]+$/.test(value) || digits.length < 10 || digits.length > 15) {
      fieldErrors[field] = 'Enter a phone number with 10 to 15 digits.'
    }
  }

  if (!/^\d+$/.test(count) || !Number.isSafeInteger(member_count) || member_count < 1 || member_count > 1_000_000) {
    fieldErrors.member_count = 'Enter a whole number of members from 1 to 1,000,000.'
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { error: 'Please check the highlighted fields.', fieldErrors } as const
  }

  return {
    details: { group_name, chairman_name, chairman_phone, secretary_name, secretary_phone, headquarters, member_count },
  } as const
}
