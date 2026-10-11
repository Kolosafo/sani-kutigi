import sharp from 'sharp'
import { supabase } from './db'
import { PASSPORT_PHOTO_MAX_BYTES, PASSPORT_PHOTO_TYPES } from './membership'

const PASSPORT_BUCKET = 'membership-passports'

export class PassportPhotoError extends Error {}

export async function preparePassportPhoto(value: unknown) {
  if (!(value instanceof File) || value.size === 0) {
    throw new PassportPhotoError('Please upload a passport photograph.')
  }
  if (!PASSPORT_PHOTO_TYPES.includes(value.type)) {
    throw new PassportPhotoError('Your passport photograph must be a JPEG or PNG image.')
  }
  if (value.size > PASSPORT_PHOTO_MAX_BYTES) {
    throw new PassportPhotoError('Your passport photograph must be 2 MB or smaller.')
  }

  try {
    const image = sharp(Buffer.from(await value.arrayBuffer()), {
      limitInputPixels: 25_000_000,
      failOn: 'error',
    })
    const metadata = await image.metadata()
    if (!['jpeg', 'png'].includes(metadata.format || '') || (metadata.pages || 1) > 1) {
      throw new Error('Unsupported image')
    }
    // Decode the image, correct camera orientation, and strip embedded metadata.
    return await image.rotate().resize(600, 800, {
      fit: 'inside',
      withoutEnlargement: true,
    }).flatten({ background: '#ffffff' }).jpeg({ quality: 90 }).toBuffer()
  } catch {
    throw new PassportPhotoError('Unable to read your passport photograph. Choose a valid JPEG or PNG image.')
  }
}

export async function uploadPassportPhoto(id: string, image: Buffer) {
  const path = `${id}/passport.jpg`
  const { error } = await supabase.storage.from(PASSPORT_BUCKET).upload(path, image, {
    contentType: 'image/jpeg',
    upsert: false,
    cacheControl: '3600',
  })
  if (error) throw error
  return path
}

export async function getPassportPhotoUrl(path: string) {
  if (!path) return null
  const { data, error } = await supabase.storage.from(PASSPORT_BUCKET).createSignedUrl(path, 3600)
  if (error) throw error
  return data.signedUrl
}

export async function removePassportPhoto(path: string) {
  const { error } = await supabase.storage.from(PASSPORT_BUCKET).remove([path])
  if (error) console.error('Unable to remove an unused passport photograph:', error.message)
}
