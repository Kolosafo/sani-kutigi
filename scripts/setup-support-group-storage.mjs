import { createClient } from '@supabase/supabase-js'

const url = process.env.SUPABASE_URL
const key = process.env.SUPABASE_SECRET_KEY
if (!url || !key) {
  throw new Error('Set SUPABASE_URL and SUPABASE_SECRET_KEY before configuring support-group storage.')
}

const bucket = 'support-group-registrations'
const settings = {
  public: false,
  fileSizeLimit: 2 * 1024 * 1024,
  allowedMimeTypes: [
    'application/json',
    'application/pdf',
    'image/jpeg',
    'image/png',
    'text/csv',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ],
}

const client = createClient(url, key, { auth: { persistSession: false } })
const existing = await client.storage.getBucket(bucket)
if (existing.error && String(existing.error.statusCode) !== '404') {
  console.error('Unable to inspect support-group storage:', existing.error.statusCode || 'storage error')
  process.exit(1)
}

const result = existing.data
  ? await client.storage.updateBucket(bucket, settings)
  : await client.storage.createBucket(bucket, settings)
if (result.error) {
  console.error('Unable to configure support-group storage:', result.error.statusCode || 'storage error')
  process.exit(1)
}

const verified = await client.storage.getBucket(bucket)
if (verified.error || verified.data.public || Number(verified.data.file_size_limit) !== settings.fileSizeLimit) {
  throw new Error('Support-group storage configuration could not be verified.')
}
console.log('Private support-group storage is ready. Maximum upload size: 2 MiB per document.')
