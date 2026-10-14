'use client'

import { useEffect, useRef, useState } from 'react'
import {
  DEFAULT_WATERMARK_SIZES,
  downloadWatermarkedPhoto,
  drawWatermarkedPhoto,
  loadWatermarkAssets,
  loadWatermarkPhoto,
  type DownloadFormat,
  type WatermarkAssets,
  type WatermarkPhoto,
} from '@/lib/watermark'

function PhotoIcon({ className = 'h-8 w-8' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="m21 15-5-5L6 21M3 16l4-4 3 3" />
    </svg>
  )
}

export default function WatermarkEditor() {
  const inputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const uploadRequest = useRef(0)
  const [assets, setAssets] = useState<WatermarkAssets | null>(null)
  const [assetError, setAssetError] = useState('')
  const [assetAttempt, setAssetAttempt] = useState(0)
  const [photo, setPhoto] = useState<WatermarkPhoto | null>(null)
  const [sizes, setSizes] = useState({ ...DEFAULT_WATERMARK_SIZES })
  const [format, setFormat] = useState<DownloadFormat>('png')
  const [loading, setLoading] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState('')
  const [previewError, setPreviewError] = useState('')
  const [status, setStatus] = useState('')

  useEffect(() => {
    let cancelled = false
    loadWatermarkAssets().then((loaded) => {
      if (!cancelled) setAssets(loaded)
    }).catch(() => {
      if (!cancelled) setAssetError('The watermark images could not be loaded. Check your connection and try again.')
    })
    return () => { cancelled = true }
  }, [assetAttempt])

  useEffect(() => {
    return () => { uploadRequest.current += 1 }
  }, [])

  useEffect(() => {
    if (!photo || !assets) return
    const frame = window.requestAnimationFrame(() => {
      try {
        if (canvasRef.current) drawWatermarkedPhoto(canvasRef.current, photo, assets, sizes, format, true)
        setPreviewError('')
      } catch {
        setPreviewError('Your browser could not show the preview. Please choose a smaller photo or try another browser.')
      }
    })
    return () => window.cancelAnimationFrame(frame)
  }, [photo, assets, sizes, format])

  async function choosePhoto(files: FileList | null) {
    if (!files?.length || downloading) return
    const request = ++uploadRequest.current
    setError('')
    setStatus('')
    if (files.length > 1) {
      setLoading(false)
      setError('Please choose one photo at a time.')
      return
    }
    setLoading(true)
    try {
      const loaded = await loadWatermarkPhoto(files[0])
      if (request !== uploadRequest.current) return
      setPhoto(loaded)
      setPreviewError('')
      setStatus('Photo ready. Your watermark preview updates as you adjust the sizes.')
    } catch (uploadError) {
      if (request === uploadRequest.current) {
        setError(uploadError instanceof Error ? uploadError.message : 'Unable to open this photo. Please try another image.')
      }
    } finally {
      if (request === uploadRequest.current) setLoading(false)
    }
  }

  function removePhoto() {
    uploadRequest.current += 1
    setPhoto(null)
    setPreviewError('')
    setLoading(false)
    setError('')
    setStatus('Photo removed. Choose another photo to get started.')
    if (inputRef.current) inputRef.current.value = ''
  }

  async function handleDownload() {
    if (!photo || !assets || loading || downloading || previewError) return
    setDownloading(true)
    setError('')
    setStatus('')
    try {
      await downloadWatermarkedPhoto(photo, assets, sizes, format)
      setStatus('Your watermarked photo is ready. Check your downloads.')
    } catch (downloadError) {
      setError(downloadError instanceof Error ? downloadError.message : 'Unable to download your photo. Please try again.')
    } finally {
      setDownloading(false)
    }
  }

  const busy = loading || downloading
  const ready = Boolean(photo && assets && !loading && !previewError)
  const buttonClass = 'rounded-xl px-4 py-3 text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-green-700 disabled:cursor-not-allowed disabled:opacity-50'

  return (
    <div>
      <div className="grid items-start gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6" aria-labelledby="upload-heading">
          <div className="mb-5 flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-sm font-bold text-green-800">1</span>
            <h2 id="upload-heading" className="text-lg font-extrabold">Choose your photo</h2>
          </div>

          <input
            ref={inputRef}
            id="watermark-photo"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            tabIndex={-1}
            disabled={downloading}
            onChange={(event) => {
              void choosePhoto(event.target.files)
              event.target.value = ''
            }}
            aria-label="Upload a photo"
          />
          <button
            type="button"
            disabled={downloading}
            onClick={() => inputRef.current?.click()}
            onDragOver={(event) => {
              event.preventDefault()
              if (!downloading) setDragging(true)
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(event) => {
              event.preventDefault()
              setDragging(false)
              void choosePhoto(event.dataTransfer.files)
            }}
            className={`flex w-full flex-col items-center rounded-xl border-2 border-dashed px-4 py-8 text-center transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-green-700 disabled:cursor-not-allowed disabled:opacity-50 ${dragging ? 'border-green-600 bg-green-100' : 'border-green-200 bg-green-50/60 hover:border-green-500 hover:bg-green-50'}`}
          >
            <span className="mb-3 rounded-xl bg-white p-3 text-green-700 shadow-sm"><PhotoIcon /></span>
            <span className="text-sm font-bold text-green-900">{loading ? 'Opening your photo…' : photo ? 'Choose a different photo' : 'Click to upload a photo'}</span>
            <span className="mt-1 text-xs text-gray-500">or drag and drop it here</span>
            <span className="mt-4 text-xs text-gray-500">JPG, PNG or WebP · up to 20 MB</span>
          </button>

          {photo && (
            <div className="mt-3 flex items-center justify-between gap-3 rounded-lg bg-gray-50 px-3 py-2">
              <p className="min-w-0 truncate text-xs font-medium text-gray-700" title={photo.name}>{photo.name}</p>
              <button type="button" onClick={removePhoto} disabled={downloading} className="shrink-0 rounded px-1 py-1 text-xs font-semibold text-gray-500 hover:text-red-700 focus-visible:outline-2 focus-visible:outline-green-700 disabled:opacity-50">Remove</button>
            </div>
          )}

          <fieldset disabled={!photo || busy} className="mt-6 border-t border-gray-100 pt-5 disabled:opacity-50">
            <legend className="sr-only">Watermark sizes</legend>
            <h3 className="mb-4 text-sm font-bold text-gray-900">Adjust the watermark sizes</h3>
            <div className="space-y-5">
              <div>
                <div className="flex items-center justify-between text-sm">
                  <label htmlFor="main-size" className="font-medium text-gray-700">Top right logo</label>
                  <output htmlFor="main-size" className="text-xs font-semibold tabular-nums text-green-800">{sizes.main}%</output>
                </div>
                <input id="main-size" type="range" min="10" max="40" value={sizes.main} onChange={(event) => { setSizes({ ...sizes, main: Number(event.target.value) }); setStatus('') }} className="mt-3 w-full accent-green-700" />
                <p className="mt-1 text-xs text-gray-500">White logo · full opacity</p>
              </div>
              <div>
                <div className="flex items-center justify-between text-sm">
                  <label htmlFor="shadow-size" className="font-medium text-gray-700">Center watermark</label>
                  <output htmlFor="shadow-size" className="text-xs font-semibold tabular-nums text-green-800">{sizes.shadow}%</output>
                </div>
                <input id="shadow-size" type="range" min="30" max="90" value={sizes.shadow} onChange={(event) => { setSizes({ ...sizes, shadow: Number(event.target.value) }); setStatus('') }} className="mt-3 w-full accent-green-700" />
                <p className="mt-1 text-xs text-gray-500">Centered shadow layer · about 30% opacity</p>
              </div>
            </div>
            <button type="button" onClick={() => { setSizes({ ...DEFAULT_WATERMARK_SIZES }); setStatus('') }} className="mt-4 rounded px-1 py-1 text-xs font-semibold text-green-700 underline underline-offset-4 hover:text-green-900 focus-visible:outline-2 focus-visible:outline-green-700">Reset sizes</button>
          </fieldset>

          <div className="mt-6 border-t border-gray-100 pt-5">
            <label htmlFor="download-format" className="mb-2 block text-sm font-bold text-gray-900">Download format</label>
            <select id="download-format" value={format} disabled={busy} onChange={(event) => { setFormat(event.target.value as DownloadFormat); setStatus('') }} className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-700 focus:border-green-700 focus:outline-green-700 disabled:opacity-50">
              <option value="png">PNG — full quality</option>
              <option value="jpeg">JPG — smaller file for sharing</option>
            </select>
            <button type="button" onClick={handleDownload} disabled={!ready || downloading} className={`${buttonClass} mt-3 flex w-full items-center justify-center gap-2 bg-green-700 text-white hover:bg-green-800`}>
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v12m-5-5 5 5 5-5M5 16v4a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-4" /></svg>
              {downloading ? 'Preparing your download…' : 'Download watermarked photo'}
            </button>
          </div>

          <p className="mt-4 text-center text-xs leading-relaxed text-gray-500">Your photo stays on your device. No account needed.</p>
        </section>

        <section className="min-w-0 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm" aria-labelledby="preview-heading" aria-busy={loading || downloading}>
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 px-5 py-4 sm:px-6">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-sm font-bold text-green-800">2</span>
              <h2 id="preview-heading" className="text-lg font-extrabold">Your preview</h2>
            </div>
            {ready && <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">Ready to download</span>}
          </div>
          <div className="flex min-h-80 items-center justify-center bg-gray-100 p-4 sm:min-h-[480px] sm:p-6" style={{ backgroundImage: 'conic-gradient(#e5e7eb 25%, #f3f4f6 0 50%, #e5e7eb 0 75%, #f3f4f6 0)', backgroundSize: '20px 20px' }}>
            {photo && assets ? (
              <canvas ref={canvasRef} role="img" aria-label="Your photo with the white SKV logo in the top right and a subtle watermark centered on the image" className={`block h-auto max-h-[600px] w-auto max-w-full rounded-sm object-contain shadow-lg ${loading ? 'opacity-40' : ''}`} />
            ) : (
              <div className="max-w-xs rounded-2xl bg-white/90 p-7 text-center">
                <PhotoIcon className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                <p className="font-bold text-gray-700">{loading ? 'Opening your photo…' : photo ? assetError ? 'Watermark unavailable' : 'Loading the watermark…' : 'Your photo will appear here'}</p>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">{photo || loading ? 'Your preview will be ready shortly.' : 'Upload a photo to see both watermark layers before downloading.'}</p>
              </div>
            )}
          </div>
          <div className="px-5 py-4 sm:px-6">
            {photo ? (
              <>
                <p className="text-sm font-medium text-gray-700">Download size: {photo.width.toLocaleString()} × {photo.height.toLocaleString()} px</p>
                <p className="mt-1 text-xs leading-relaxed text-gray-500">{photo.resized ? 'This large photo is resized for reliable downloads on phones. Its proportions are preserved.' : 'Your photo keeps its original dimensions and proportions.'} {format === 'jpeg' ? 'Transparent areas use a white background in JPG.' : 'PNG preserves transparent areas.'}</p>
              </>
            ) : (
              <p className="text-xs leading-relaxed text-gray-500">Both marks are added automatically. Your original photo stays unchanged.</p>
            )}
          </div>
        </section>
      </div>

      {assetError && (
        <div role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {assetError}{' '}
          <button type="button" onClick={() => { setAssetError(''); setAssetAttempt((attempt) => attempt + 1) }} className="font-bold underline underline-offset-2">Retry</button>
        </div>
      )}
      {error && <p role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p>}
      {previewError && <p role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{previewError}</p>}
      <p role="status" aria-live="polite" className="mt-4 min-h-5 text-center text-sm text-green-800">{loading ? 'Opening your photo…' : downloading ? 'Preparing your watermarked photo…' : status}</p>
    </div>
  )
}
