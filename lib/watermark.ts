export const MAX_PHOTO_BYTES = 20 * 1024 * 1024
const MAX_SOURCE_PIXELS = 64_000_000
const MAX_OUTPUT_PIXELS = 12_000_000
const MAX_OUTPUT_EDGE = 4096

export const DEFAULT_WATERMARK_SIZES = { main: 22, shadow: 65 }

export type WatermarkSizes = typeof DEFAULT_WATERMARK_SIZES
export type DownloadFormat = 'png' | 'jpeg'
export type WatermarkAssets = { main: HTMLImageElement; shadow: HTMLImageElement }
export type WatermarkPhoto = {
  image: HTMLImageElement | HTMLCanvasElement
  name: string
  width: number
  height: number
  resized: boolean
}

// Both supplied PNGs have the same transparent padding and artwork bounds.
const ARTWORK = { x: 280, y: 153, width: 729, height: 599 }

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('The image could not be read.'))
    image.src = src
  })
}

export async function loadWatermarkAssets(): Promise<WatermarkAssets> {
  const [main, shadow] = await Promise.all([
    loadImage('/overlay-watermark-main.png'),
    loadImage('/overlay-watermark-shadow.png'),
  ])
  return { main, shadow }
}

export async function loadWatermarkPhoto(file: File): Promise<WatermarkPhoto> {
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
    throw new Error('Please choose a JPG, PNG or WebP image.')
  }
  if (file.size > MAX_PHOTO_BYTES) {
    throw new Error('This image is too large. Please choose one smaller than 20 MB.')
  }

  const url = URL.createObjectURL(file)
  try {
    const image = await loadImage(url)
    const sourceWidth = image.naturalWidth
    const sourceHeight = image.naturalHeight
    if (!sourceWidth || !sourceHeight || sourceWidth * sourceHeight > MAX_SOURCE_PIXELS) {
      throw new Error('This image has too many pixels. Please choose a photo under 64 megapixels.')
    }
    const scale = Math.min(
      1,
      MAX_OUTPUT_EDGE / Math.max(sourceWidth, sourceHeight),
      Math.sqrt(MAX_OUTPUT_PIXELS / (sourceWidth * sourceHeight)),
    )
    const width = Math.max(1, Math.round(sourceWidth * scale))
    const height = Math.max(1, Math.round(sourceHeight * scale))
    let preparedImage: HTMLImageElement | HTMLCanvasElement = image
    if (scale < 1) {
      const resized = document.createElement('canvas')
      resized.width = width
      resized.height = height
      const context = resized.getContext('2d')
      if (!context) throw new Error('Your browser could not resize this photo. Please choose a smaller image.')
      context.imageSmoothingQuality = 'high'
      context.drawImage(image, 0, 0, width, height)
      preparedImage = resized
      // Retain only the reduced photo instead of its much larger decoded source.
      image.src = ''
    }
    return {
      image: preparedImage,
      name: file.name,
      width,
      height,
      resized: scale < 1,
    }
  } finally {
    URL.revokeObjectURL(url)
  }
}

export function releaseWatermarkPhoto(photo: WatermarkPhoto) {
  if ('getContext' in photo.image) {
    photo.image.width = 0
    photo.image.height = 0
  } else {
    photo.image.src = ''
  }
}

export function drawWatermarkedPhoto(
  canvas: HTMLCanvasElement,
  photo: WatermarkPhoto,
  assets: WatermarkAssets,
  sizes: WatermarkSizes,
  format: DownloadFormat,
  preview = false,
) {
  const scale = preview ? Math.min(1, 1000 / Math.max(photo.width, photo.height)) : 1
  canvas.width = Math.max(1, Math.round(photo.width * scale))
  canvas.height = Math.max(1, Math.round(photo.height * scale))
  const context = canvas.getContext('2d')
  if (!context) throw new Error('Your browser could not prepare the image. Please try another browser.')

  const { width, height } = canvas
  context.imageSmoothingEnabled = true
  context.imageSmoothingQuality = 'high'
  if (format === 'jpeg') {
    context.fillStyle = '#ffffff'
    context.fillRect(0, 0, width, height)
  }
  context.drawImage(photo.image, 0, 0, width, height)

  const margin = Math.min(width, height) * 0.035
  const aspect = ARTWORK.width / ARTWORK.height
  const drawMark = (image: HTMLImageElement, size: number, centered: boolean) => {
    const markWidth = Math.min(width * size / 100, width - 2 * margin, (height - 2 * margin) * aspect)
    const markHeight = markWidth / aspect
    const x = centered ? (width - markWidth) / 2 : width - margin - markWidth
    const y = centered ? (height - markHeight) / 2 : margin
    context.drawImage(image, ARTWORK.x, ARTWORK.y, ARTWORK.width, ARTWORK.height, x, y, markWidth, markHeight)
  }

  // The shadow PNG already contains approximately 30% alpha. Do not fade it again.
  drawMark(assets.shadow, sizes.shadow, true)
  drawMark(assets.main, sizes.main, false)
}

export function getWatermarkedFilename(name: string, format: DownloadFormat) {
  const base = name.replace(/\.[^.]+$/, '').replace(/[^a-zA-Z0-9_-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80) || 'photo'
  return `${base}-skv-watermarked.${format === 'jpeg' ? 'jpg' : 'png'}`
}

export async function createWatermarkedPhotoBlob(
  photo: WatermarkPhoto,
  assets: WatermarkAssets,
  sizes: WatermarkSizes,
  format: DownloadFormat,
) {
  const canvas = document.createElement('canvas')
  try {
    drawWatermarkedPhoto(canvas, photo, assets, sizes, format)
    return await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((result) => {
        if (result) resolve(result)
        else reject(new Error('Unable to save this image. Please try a smaller photo.'))
      }, `image/${format}`, 0.94)
    })
  } finally {
    canvas.width = 0
    canvas.height = 0
  }
}

export function saveWatermarkDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  try {
    link.click()
  } finally {
    link.remove()
    // Let the browser start the download before releasing its URL.
    window.setTimeout(() => URL.revokeObjectURL(url), 60_000)
  }
}

export async function downloadWatermarkedPhoto(
  photo: WatermarkPhoto,
  assets: WatermarkAssets,
  sizes: WatermarkSizes,
  format: DownloadFormat,
) {
  const blob = await createWatermarkedPhotoBlob(photo, assets, sizes, format)
  saveWatermarkDownload(blob, getWatermarkedFilename(photo.name, format))
}
