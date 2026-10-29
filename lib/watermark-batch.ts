import {
  createWatermarkedPhotoBlob,
  getWatermarkedFilename,
  loadWatermarkPhoto,
  releaseWatermarkPhoto,
  type DownloadFormat,
  type WatermarkAssets,
  type WatermarkPhoto,
  type WatermarkSizes,
} from './watermark'

export const MAX_BATCH_PHOTOS = 30
export const MAX_BATCH_BYTES = 200 * 1024 * 1024
const MAX_ENCODED_BYTES = 256 * 1024 * 1024

export type WatermarkBatchProgress = { completed: number; total: number; name: string }
export type WatermarkArchiveOptions = {
  signal?: AbortSignal
  onProgress?: (progress: WatermarkBatchProgress) => void
  filenameSuffix?: string
}

export function validateWatermarkBatch(files: readonly File[]): void {
  if (!files.length) throw new Error('Choose at least one photo to watermark.')
  if (files.length > MAX_BATCH_PHOTOS) {
    throw new Error(`Please choose up to ${MAX_BATCH_PHOTOS} photos at a time.`)
  }
  if (files.reduce((total, file) => total + file.size, 0) > MAX_BATCH_BYTES) {
    throw new Error('These photos exceed the 200 MB batch limit. Please choose a smaller batch.')
  }
}

function checkCancelled(signal?: AbortSignal): void {
  if (signal?.aborted) throw new DOMException('Photo processing was cancelled.', 'AbortError')
}

function uniqueFilename(name: string, format: DownloadFormat, used: Set<string>, filenameSuffix?: string): string {
  const original = getWatermarkedFilename(name, format, filenameSuffix)
  const dot = original.lastIndexOf('.')
  const base = original.slice(0, dot)
  const extension = original.slice(dot)
  let filename = original
  let suffix = 2
  while (used.has(filename.toLowerCase())) filename = `${base}-${suffix++}${extension}`
  used.add(filename.toLowerCase())
  return filename
}

export async function buildWatermarkedArchive(
  files: readonly File[],
  assets: WatermarkAssets,
  sizes: WatermarkSizes,
  format: DownloadFormat,
  options: WatermarkArchiveOptions = {},
): Promise<{ blob: Blob; exported: number; failed: { name: string; message: string }[] }> {
  const photos = Array.from(files)
  validateWatermarkBatch(photos)
  checkCancelled(options.signal)
  const { Zip, ZipPassThrough } = await import('fflate')
  checkCancelled(options.signal)

  // Blob parts avoid retaining all decoded photos or copying one giant ZIP buffer.
  const parts: Blob[] = []
  let zipError: Error | null = null
  let finished = false
  const zip = new Zip((error, data, final) => {
    if (error) {
      zipError = error
      return
    }
    if (data.length) parts.push(new Blob([data]))
    if (final) finished = true
  })
  const failed: { name: string; message: string }[] = []
  const names = new Set<string>()
  let exported = 0
  let encodedBytes = 0

  try {
    for (const [index, file] of photos.entries()) {
      checkCancelled(options.signal)
      let photo: WatermarkPhoto | undefined
      let encoded: Blob | undefined
      try {
        photo = await loadWatermarkPhoto(file)
        checkCancelled(options.signal)
        encoded = await createWatermarkedPhotoBlob(photo, assets, sizes, format)
        checkCancelled(options.signal)
      } catch (error) {
        checkCancelled(options.signal)
        failed.push({
          name: file.name,
          message: error instanceof Error ? error.message : 'This photo could not be watermarked.',
        })
      } finally {
        if (photo) releaseWatermarkPhoto(photo)
      }

      checkCancelled(options.signal)
      if (encoded) {
        encodedBytes += encoded.size
        if (encodedBytes > MAX_ENCODED_BYTES) {
          throw new Error('The watermarked photos exceed the 256 MB download limit. Choose JPG or use a smaller batch.')
        }
        const data = new Uint8Array(await encoded.arrayBuffer())
        checkCancelled(options.signal)
        // Keep ZIP errors outside the per-photo catch: a damaged archive is unusable.
        const entry = new ZipPassThrough(uniqueFilename(file.name, format, names, options.filenameSuffix))
        zip.add(entry)
        if (zipError) throw zipError
        entry.push(data, true)
        if (zipError) throw zipError
        exported += 1
      }
      options.onProgress?.({ completed: index + 1, total: photos.length, name: file.name })
      checkCancelled(options.signal)
    }

    if (!exported) throw new Error('None of these photos could be watermarked. Please check the images and try again.')
    zip.end()
    if (zipError) throw zipError
    if (!finished) throw new Error('The photo archive could not be completed. Please try again.')
    checkCancelled(options.signal)
    return { blob: new Blob(parts, { type: 'application/zip' }), exported, failed }
  } finally {
    zip.terminate()
    parts.length = 0
  }
}
