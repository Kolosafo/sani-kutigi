import { unzipSync } from 'fflate'
import sharp from 'sharp'
import { supabase } from './db'
import {
  SUPPORT_GROUP_FILE_MAX_BYTES,
  type SupportGroupDetails,
  type SupportGroupFileField,
} from './support-groups'

export const SUPPORT_GROUP_BUCKET = 'support-group-registrations'

const formats = {
  pdf: { contentType: 'application/pdf', types: ['application/pdf'] },
  jpg: { contentType: 'image/jpeg', types: ['image/jpeg', 'image/pjpeg'] },
  jpeg: { contentType: 'image/jpeg', types: ['image/jpeg', 'image/pjpeg'] },
  png: { contentType: 'image/png', types: ['image/png'] },
  csv: { contentType: 'text/csv', types: ['text/csv', 'application/csv', 'text/plain', 'application/vnd.ms-excel'] },
  xls: { contentType: 'application/vnd.ms-excel', types: ['application/vnd.ms-excel', 'application/xls', 'application/x-excel'] },
  xlsx: {
    contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    types: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
  },
} as const

type Extension = keyof typeof formats

export type PreparedSupportGroupAttachment = {
  bytes: Buffer
  extension: Extension
  original_name: string
  content_type: string
  size_bytes: number
}

export class SupportGroupUploadError extends Error {
  constructor(
    public readonly field: SupportGroupFileField,
    message: string,
    public readonly status: 400 | 413 = 400,
  ) {
    super(message)
  }
}

function validSpreadsheet(bytes: Buffer) {
  if (!bytes.subarray(0, 4).equals(Buffer.from([0x50, 0x4b, 0x03, 0x04]))) return false
  let entries = 0
  let expandedBytes = 0
  const workbookFiles = new Set(['[Content_Types].xml', 'xl/workbook.xml'])
  const files = unzipSync(bytes, {
    filter(file) {
      entries += 1
      expandedBytes += file.originalSize
      if (entries > 1000 || expandedBytes > 32 * 1024 * 1024) throw new Error('Spreadsheet is too complex')
      if (!workbookFiles.has(file.name)) return false
      if (file.originalSize > 512 * 1024) throw new Error('Spreadsheet metadata is too large')
      return true
    },
  })
  const contentTypes = files['[Content_Types].xml']
  const workbook = files['xl/workbook.xml']
  if (!contentTypes || !workbook) return false
  const decode = new TextDecoder('utf-8', { fatal: true })
  return decode.decode(contentTypes).includes('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml')
    && /<(?:\w+:)?workbook(?:\s|>)/.test(decode.decode(workbook))
}

async function validContents(extension: Extension, bytes: Buffer) {
  if (extension === 'pdf') {
    return /^%PDF-\d\.\d/.test(bytes.subarray(0, 12).toString('ascii'))
      && bytes.subarray(-1024).includes(Buffer.from('%%EOF'))
  }
  if (extension === 'jpg' || extension === 'jpeg' || extension === 'png') {
    const signature = extension === 'png'
      ? bytes.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
      : bytes.subarray(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff]))
    if (!signature) return false
    const image = sharp(bytes, { limitInputPixels: 25_000_000, failOn: 'error' })
    const metadata = await image.metadata()
    if (metadata.format !== (extension === 'png' ? 'png' : 'jpeg') || (metadata.pages || 1) > 1) return false
    await image.stats()
    return true
  }
  if (extension === 'csv') {
    if (bytes.subarray(0, 5).equals(Buffer.from('%PDF-'))) return false
    const csv = new TextDecoder('utf-8', { fatal: true }).decode(bytes)
    return csv.trim().length > 0 && !/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f-\u009f]/.test(csv)
  }
  if (extension === 'xls') {
    return bytes.length >= 512
      && bytes.subarray(0, 8).equals(Buffer.from([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1]))
      && bytes.readUInt16LE(28) === 0xfffe
      && [9, 12].includes(bytes.readUInt16LE(30))
      && (bytes.includes(Buffer.from('Workbook\0', 'utf16le')) || bytes.includes(Buffer.from('Book\0', 'utf16le')))
  }
  return validSpreadsheet(bytes)
}

export async function prepareSupportGroupAttachment(field: SupportGroupFileField, value: unknown): Promise<PreparedSupportGroupAttachment> {
  const label = field === 'certificate' ? 'registration certificate' : 'membership register'
  if (!(value instanceof File) || value.size === 0) {
    throw new SupportGroupUploadError(field, `Please upload your ${label}.`)
  }
  if (value.size > SUPPORT_GROUP_FILE_MAX_BYTES) {
    throw new SupportGroupUploadError(field, `Your ${label} must be 2 MB or smaller.`, 413)
  }
  if (value.name.length > 255 || /[\u0000-\u001f\u007f/\\]/.test(value.name)) {
    throw new SupportGroupUploadError(field, `Choose a ${label} with a valid file name.`)
  }
  const extension = value.name.split('.').pop()?.toLowerCase() as Extension | undefined
  if (!extension || !Object.hasOwn(formats, extension) || (field === 'certificate' && !['pdf', 'jpg', 'jpeg', 'png'].includes(extension))) {
    throw new SupportGroupUploadError(field, field === 'certificate'
      ? 'Upload the certificate as a PDF, JPG or PNG file.'
      : 'Upload the membership register as a PDF, JPG, PNG, CSV, XLS or XLSX file.')
  }
  const format = formats[extension]
  const mime = value.type.toLowerCase().split(';')[0].trim()
  if (mime && mime !== 'application/octet-stream' && !(format.types as readonly string[]).includes(mime)) {
    throw new SupportGroupUploadError(field, `The ${label} file type does not match its extension.`)
  }
  const bytes = Buffer.from(await value.arrayBuffer())
  try {
    if (!await validContents(extension, bytes)) throw new Error('Invalid content')
  } catch {
    throw new SupportGroupUploadError(field, `We could not read your ${label}. Choose a valid, undamaged file.`)
  }
  return { bytes, extension, original_name: value.name, content_type: format.contentType, size_bytes: bytes.length }
}

export async function persistSupportGroupRegistration(
  details: SupportGroupDetails,
  attachments: Record<SupportGroupFileField, PreparedSupportGroupAttachment>,
) {
  const id = crypto.randomUUID()
  const reference = `SKV-SG-${id.toUpperCase()}`
  const bucket = supabase.storage.from(SUPPORT_GROUP_BUCKET)
  const attemptedPaths: string[] = []
  const upload = async (path: string, bytes: Buffer, contentType: string) => {
    // Include uncertain uploads in cleanup if storage saves a file but its response fails.
    attemptedPaths.push(path)
    const { error } = await bucket.upload(path, bytes, { contentType, upsert: false, cacheControl: '0' })
    if (error) throw new Error('Support group storage upload failed')
  }

  try {
    const savedAttachments = {} as Record<SupportGroupFileField, Omit<PreparedSupportGroupAttachment, 'bytes' | 'extension'> & { path: string }>
    for (const field of ['certificate', 'membership_register'] as const) {
      const attachment = attachments[field]
      const path = `${id}/${field === 'certificate' ? 'certificate' : 'membership-register'}.${attachment.extension}`
      await upload(path, attachment.bytes, attachment.content_type)
      savedAttachments[field] = {
        path,
        original_name: attachment.original_name,
        content_type: attachment.content_type,
        size_bytes: attachment.size_bytes,
      }
    }
    // This final private manifest is the commit marker for a complete registration.
    const manifest = {
      schema_version: 1,
      id,
      reference,
      ...details,
      created_at: new Date().toISOString(),
      attachments: savedAttachments,
    }
    await upload(`${id}/registration.json`, Buffer.from(JSON.stringify(manifest)), 'application/json')
    return { id, reference }
  } catch {
    let cleaned = false
    for (let attempt = 0; attempt < 2 && !cleaned; attempt += 1) {
      try {
        const { error } = await bucket.remove(attemptedPaths)
        cleaned = !error
      } catch {
        // Retry cleanup once without logging submitted details or private storage paths.
      }
    }
    if (!cleaned) console.error('Support group registration cleanup could not be completed.')
    throw new Error('Support group registration could not be saved')
  }
}
