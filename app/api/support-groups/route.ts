import {
  SUPPORT_GROUP_DETAIL_FIELDS,
  SUPPORT_GROUP_FILE_FIELDS,
  SUPPORT_GROUP_FILE_MAX_BYTES,
  type SupportGroupFieldErrors,
  validateSupportGroupDetails,
} from '@/lib/support-groups'
import {
  persistSupportGroupRegistration,
  prepareSupportGroupAttachment,
  type PreparedSupportGroupAttachment,
  SupportGroupUploadError,
} from '@/lib/support-group-storage'

export const runtime = 'nodejs'

const headers = { 'Cache-Control': 'private, no-store' }
const MAX_REQUEST_BYTES = 2 * SUPPORT_GROUP_FILE_MAX_BYTES + 64 * 1024

class BodyTooLargeError extends Error {}

async function readBoundedFormData(request: Request, contentType: string) {
  const reader = request.body?.getReader()
  if (!reader) throw new Error('Missing request body')
  const chunks: Uint8Array[] = []
  let size = 0
  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      size += value.byteLength
      if (size > MAX_REQUEST_BYTES) {
        await reader.cancel()
        throw new BodyTooLargeError()
      }
      chunks.push(value)
    }
  } finally {
    reader.releaseLock()
  }
  const bytes = new Uint8Array(size)
  let offset = 0
  for (const chunk of chunks) {
    bytes.set(chunk, offset)
    offset += chunk.byteLength
  }
  return new Response(bytes, { headers: { 'Content-Type': contentType } }).formData()
}

export async function POST(request: Request) {
  const contentType = request.headers.get('content-type') || ''
  if (!/^multipart\/form-data\s*;/i.test(contentType)) {
    return Response.json({ error: 'Submit the support group form with both required files.' }, { status: 400, headers })
  }
  const declaredLength = request.headers.get('content-length')
  if (declaredLength && /^\d+$/.test(declaredLength) && Number(declaredLength) > MAX_REQUEST_BYTES) {
    return Response.json({ error: 'The upload is too large. Each document must be 2 MB or smaller.' }, { status: 413, headers })
  }

  let form: FormData
  try {
    form = await readBoundedFormData(request, contentType)
  } catch (error) {
    return Response.json({ error: error instanceof BodyTooLargeError
      ? 'The upload is too large. Each document must be 2 MB or smaller.'
      : 'Unable to read your registration. Please submit the form again.' }, {
      status: error instanceof BodyTooLargeError ? 413 : 400,
      headers,
    })
  }

  for (const field of [...SUPPORT_GROUP_DETAIL_FIELDS, ...SUPPORT_GROUP_FILE_FIELDS]) {
    if (form.getAll(field).length > 1) {
      return Response.json({ error: 'Submit each registration field only once.' }, { status: 400, headers })
    }
  }
  const result = validateSupportGroupDetails(Object.fromEntries(form))
  const fieldErrors: SupportGroupFieldErrors = 'error' in result ? { ...result.fieldErrors } : {}
  const attachments: Partial<Record<typeof SUPPORT_GROUP_FILE_FIELDS[number], PreparedSupportGroupAttachment>> = {}
  let errorStatus = 400
  for (const field of SUPPORT_GROUP_FILE_FIELDS) {
    try {
      attachments[field] = await prepareSupportGroupAttachment(field, form.get(field))
    } catch (error) {
      if (!(error instanceof SupportGroupUploadError)) {
        return Response.json({ error: 'We could not process your documents. Please try again.' }, { status: 500, headers })
      }
      fieldErrors[field] = error.message
      if (error.status === 413) errorStatus = 413
    }
  }
  if ('error' in result || Object.keys(fieldErrors).length > 0) {
    return Response.json({ error: 'Please check the highlighted fields.', fieldErrors }, { status: errorStatus, headers })
  }

  try {
    const registration = await persistSupportGroupRegistration(result.details, {
      certificate: attachments.certificate!,
      membership_register: attachments.membership_register!,
    })
    return Response.json({ success: true, ...registration }, { status: 201, headers })
  } catch {
    return Response.json({ error: 'We could not save your registration. Please try again shortly.' }, { status: 500, headers })
  }
}
