'use client'

import { useEffect, useRef, useState } from 'react'
import {
  DEFAULT_WATERMARK_SIZES, createWatermarkedPhotoBlob, drawWatermarkedPhoto,
  getWatermarkedFilename, loadWatermarkAssets, loadWatermarkPhoto,
  releaseWatermarkPhoto, saveWatermarkDownload,
  type DownloadFormat, type WatermarkAssets, type WatermarkPhoto,
} from '@/lib/watermark'
import { buildWatermarkedArchive, MAX_BATCH_PHOTOS, validateWatermarkBatch } from '@/lib/watermark-batch'

type QueuedPhoto = { id: string; file: File }
type Preview = { id: string; photo: WatermarkPhoto | null; error: string }
type Progress = { completed: number; total: number; name: string }
const buttonClass = 'rounded-xl px-4 py-3 text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-green-700 disabled:cursor-not-allowed disabled:opacity-50'

function PhotoIcon({ className = 'h-8 w-8' }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="3" /><circle cx="8.5" cy="8.5" r="1.5" /><path strokeLinecap="round" strokeLinejoin="round" d="m21 15-5-5L6 21M3 16l4-4 3 3" /></svg>
}

export default function WatermarkEditor({ variant = 'skv' }: { variant?: 'skv' | 'lavun' }) {
  const isLavun = variant === 'lavun'
  const filenameSuffix = isLavun ? 'lavun-watermarked' : 'skv-watermarked'
  const inputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const nextId = useRef(0)
  const downloadController = useRef<AbortController | null>(null)
  const [assets, setAssets] = useState<WatermarkAssets | null>(null)
  const [assetError, setAssetError] = useState('')
  const [assetAttempt, setAssetAttempt] = useState(0)
  const [photos, setPhotos] = useState<QueuedPhoto[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [preview, setPreview] = useState<Preview | null>(null)
  const [drawError, setDrawError] = useState<{ id: string; message: string } | null>(null)
  const [sizes, setSizes] = useState({ ...DEFAULT_WATERMARK_SIZES })
  const [format, setFormat] = useState<DownloadFormat>('jpeg')
  const [downloading, setDownloading] = useState(false)
  const [progress, setProgress] = useState<Progress | null>(null)
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState('')
  const [failed, setFailed] = useState<{ name: string; message: string }[]>([])
  const [status, setStatus] = useState('')

  const selected = photos.find((item) => item.id === selectedId) ?? photos[0]
  const selectedIndex = selected ? photos.indexOf(selected) : -1
  const currentPreview = preview?.id === selected?.id ? preview : null
  const photo = currentPreview?.photo ?? null
  const loading = Boolean(selected && !currentPreview)
  const previewError = currentPreview?.error || (drawError?.id === selected?.id ? drawError?.message : '')

  useEffect(() => {
    let cancelled = false
    loadWatermarkAssets(isLavun ? {
      main: '/lavun-watermark-overlay.png',
      shadow: '/lavun-watermark-overlay.png',
      shadowOpacity: 0.3,
    } : undefined).then((loaded) => {
      if (!cancelled) setAssets(loaded)
    }).catch(() => {
      if (!cancelled) setAssetError('The watermark images could not be loaded. Check your connection and try again.')
    })
    return () => { cancelled = true }
  }, [assetAttempt, isLavun])

  useEffect(() => {
    return () => {
      downloadController.current?.abort()
      downloadController.current = null
    }
  }, [])

  // Keep one preview instead of decoding every photo in the batch.
  useEffect(() => {
    if (!selected) return
    let cancelled = false
    loadWatermarkPhoto(selected.file).then((loaded) => {
      if (cancelled) { releaseWatermarkPhoto(loaded); return }
      setPreview({ id: selected.id, photo: loaded, error: '' })
    }).catch((uploadError) => {
      if (!cancelled) setPreview({ id: selected.id, photo: null, error: uploadError instanceof Error ? uploadError.message : 'Unable to open this photo. Please try another image.' })
    })
    return () => { cancelled = true }
  }, [selected])

  useEffect(() => {
    return () => { if (preview?.photo) releaseWatermarkPhoto(preview.photo) }
  }, [preview])

  useEffect(() => {
    if (!photo || !assets || !selected) return
    const frame = window.requestAnimationFrame(() => {
      try {
        if (canvasRef.current) drawWatermarkedPhoto(canvasRef.current, photo, assets, sizes, format, true)
        setDrawError(null)
      } catch {
        setDrawError({ id: selected.id, message: 'Your browser could not show the preview. Please choose a smaller photo or try another browser.' })
      }
    })
    return () => window.cancelAnimationFrame(frame)
  }, [photo, assets, sizes, format, selected])

  function addPhotos(files: FileList | null) {
    if (!files?.length || downloading) return
    setError(''); setFailed([]); setStatus('')
    const added = Array.from(files)
    try {
      validateWatermarkBatch([...photos.map((item) => item.file), ...added])
      const queued = added.map((file) => ({ id: String(++nextId.current), file }))
      setPhotos([...photos, ...queued])
      setSelectedId(selected?.id ?? queued[0].id)
      setStatus(`${added.length} ${added.length === 1 ? 'photo added' : 'photos added'}. The same watermark settings apply to every photo.`)
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'Unable to add these photos.')
    }
  }

  function removePhoto(id: string) {
    if (downloading) return
    const remaining = photos.filter((item) => item.id !== id)
    setPhotos(remaining)
    if (!remaining.length) setPreview(null)
    if (selected?.id === id) setSelectedId(remaining[Math.min(selectedIndex, remaining.length - 1)]?.id ?? null)
    setFailed([]); setError(''); setStatus('Photo removed.')
  }

  function clearPhotos() {
    if (downloading) return
    setPhotos([]); setSelectedId(null); setPreview(null); setFailed([]); setError('')
    setStatus('Photos cleared. Choose another batch to get started.')
    if (inputRef.current) inputRef.current.value = ''
  }

  async function handleDownload(all: boolean) {
    if (!assets || !photos.length || downloading || (!all && (!photo || previewError))) return
    const controller = new AbortController()
    downloadController.current = controller
    setDownloading(true); setError(''); setFailed([]); setStatus('')
    try {
      if (all && photos.length > 1) {
        const result = await buildWatermarkedArchive(photos.map((item) => item.file), assets, sizes, format, {
          signal: controller.signal,
          filenameSuffix,
          onProgress: (value) => { if (!controller.signal.aborted) setProgress(value) },
        })
        if (controller.signal.aborted) throw new DOMException('Download cancelled.', 'AbortError')
        saveWatermarkDownload(result.blob, `${filenameSuffix}-photos.zip`)
        setFailed(result.failed)
        setStatus(`${result.exported} ${result.exported === 1 ? 'watermarked photo is' : 'watermarked photos are'} ready in your ZIP download.${result.failed.length ? ` ${result.failed.length} could not be processed; see the list below.` : ''}`)
      } else if (photo && !previewError) {
        const blob = await createWatermarkedPhotoBlob(photo, assets, sizes, format)
        if (controller.signal.aborted) throw new DOMException('Download cancelled.', 'AbortError')
        saveWatermarkDownload(blob, getWatermarkedFilename(photo.name, format, filenameSuffix))
        setStatus('Your watermarked photo is ready. Check your downloads.')
      }
    } catch (downloadError) {
      if (controller.signal.aborted) {
        if (downloadController.current === controller) setStatus('Download cancelled. Your photos are still ready to use.')
      } else setError(downloadError instanceof Error ? downloadError.message : 'Unable to download your photos. Please try again.')
    } finally {
      if (downloadController.current === controller) {
        downloadController.current = null
        setDownloading(false); setProgress(null)
      }
    }
  }

  const ready = Boolean(photo && assets && !loading && !previewError)
  const canDownload = Boolean(assets && photos.length && !downloading && (photos.length > 1 || ready))

  return (
    <div>
      <div className="grid items-start gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6" aria-labelledby="upload-heading">
          <div className="mb-5 flex items-center gap-3"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-sm font-bold text-green-800">1</span><h2 id="upload-heading" className="text-lg font-extrabold">Choose your photos</h2></div>
          <input ref={inputRef} id="watermark-photo" type="file" multiple accept="image/jpeg,image/png,image/webp" className="sr-only" tabIndex={-1} disabled={downloading}
            onChange={(event) => { addPhotos(event.target.files); event.target.value = '' }} aria-label="Upload photos" />
          <button type="button" disabled={downloading} onClick={() => inputRef.current?.click()}
            onDragOver={(event) => { event.preventDefault(); if (!downloading) setDragging(true) }} onDragLeave={() => setDragging(false)}
            onDrop={(event) => { event.preventDefault(); setDragging(false); addPhotos(event.dataTransfer.files) }}
            className={`flex w-full flex-col items-center rounded-xl border-2 border-dashed px-4 py-7 text-center transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-green-700 disabled:cursor-not-allowed disabled:opacity-50 ${dragging ? 'border-green-600 bg-green-100' : 'border-green-200 bg-green-50/60 hover:border-green-500 hover:bg-green-50'}`}>
            <span className="mb-3 rounded-xl bg-white p-3 text-green-700 shadow-sm"><PhotoIcon /></span>
            <span className="text-sm font-bold text-green-900">{photos.length ? 'Add more photos' : 'Click to upload photos'}</span>
            <span className="mt-1 text-xs text-gray-500">or drag and drop several photos here</span>
            <span className="mt-4 text-xs leading-relaxed text-gray-500">JPG, PNG or WebP · 20 MB per photo<br />Up to {MAX_BATCH_PHOTOS} photos · 200 MB per batch</span>
          </button>
          {error && <p role="alert" className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          {assetError && <div role="alert" className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{assetError}{' '}<button type="button" onClick={() => { setAssetError(''); setAssetAttempt((attempt) => attempt + 1) }} className="font-bold underline underline-offset-2">Retry</button></div>}

          {photos.length > 0 && <div className="mt-4">
            <div className="mb-2 flex items-center justify-between gap-2"><p className="text-xs font-bold text-gray-700">{photos.length} {photos.length === 1 ? 'photo selected' : 'photos selected'}</p><button type="button" onClick={clearPhotos} disabled={downloading} className="rounded px-1 py-1 text-xs font-semibold text-gray-500 hover:text-red-700 focus-visible:outline-2 focus-visible:outline-green-700 disabled:opacity-50">Clear all</button></div>
            <ul aria-label="Selected photos" className="max-h-52 space-y-1 overflow-y-auto rounded-lg border border-gray-200 p-1">
              {photos.map((item, index) => <li key={item.id} className={`flex items-center gap-1 rounded-md ${selected?.id === item.id ? 'bg-green-50' : 'hover:bg-gray-50'}`}>
                <button type="button" onClick={() => setSelectedId(item.id)} disabled={downloading} aria-current={selected?.id === item.id ? 'true' : undefined} className="flex min-w-0 flex-1 items-center gap-2 rounded-md px-2 py-2.5 text-left text-xs text-gray-700 focus-visible:outline-2 focus-visible:outline-green-700 disabled:opacity-50" title={item.file.name}><span className="shrink-0 font-semibold tabular-nums text-green-800">{index + 1}.</span><span className="truncate">{item.file.name}</span></button>
                <button type="button" onClick={() => removePhoto(item.id)} disabled={downloading} aria-label={`Remove photo ${index + 1}: ${item.file.name}`} className="shrink-0 rounded-md px-2 py-2 text-lg leading-none text-gray-400 hover:text-red-700 focus-visible:outline-2 focus-visible:outline-green-700 disabled:opacity-50">×</button>
              </li>)}
            </ul>
          </div>}

          <div className="mt-5 rounded-xl border border-green-100 bg-green-50 p-4"><h3 className="text-sm font-bold text-green-900">Watermarks applied automatically</h3><p className="mt-1.5 text-xs leading-relaxed text-green-800">White {isLavun ? 'Lavun LGA' : 'SKV'} logo at the top right. Subtle logo in the center. The same proportions and opacity apply to every photo.</p></div>
          <details className="mt-4 rounded-xl border border-gray-200">
            <summary className="cursor-pointer rounded-xl px-4 py-3 text-sm font-semibold text-gray-700 focus-visible:outline-2 focus-visible:outline-green-700">Optional watermark adjustments</summary>
            <fieldset disabled={!photos.length || downloading} className="border-t border-gray-100 p-4 disabled:opacity-50">
              <legend className="sr-only">Watermark sizes for every photo</legend><p className="mb-4 text-xs leading-relaxed text-gray-500">Changes apply to the entire batch. The standard settings are ready to use.</p>
              <div className="space-y-5">
                <div><div className="flex items-center justify-between text-sm"><label htmlFor="main-size" className="font-medium text-gray-700">Top right logo</label><output htmlFor="main-size" className="text-xs font-semibold tabular-nums text-green-800">{sizes.main}%</output></div><input id="main-size" type="range" min="10" max="40" value={sizes.main} onChange={(event) => { setSizes({ ...sizes, main: Number(event.target.value) }); setStatus('') }} className="mt-3 w-full accent-green-700" /><p className="mt-1 text-xs text-gray-500">White logo · full opacity</p></div>
                <div><div className="flex items-center justify-between text-sm"><label htmlFor="shadow-size" className="font-medium text-gray-700">Center watermark</label><output htmlFor="shadow-size" className="text-xs font-semibold tabular-nums text-green-800">{sizes.shadow}%</output></div><input id="shadow-size" type="range" min="10" max="70" value={sizes.shadow} onChange={(event) => { setSizes({ ...sizes, shadow: Number(event.target.value) }); setStatus('') }} className="mt-3 w-full accent-green-700" /><p className="mt-1 text-xs text-gray-500">Centered shadow layer · about 30% opacity</p></div>
              </div>
              <button type="button" onClick={() => { setSizes({ ...DEFAULT_WATERMARK_SIZES }); setStatus('') }} className="mt-4 rounded px-1 py-1 text-xs font-semibold text-green-700 underline underline-offset-4 hover:text-green-900 focus-visible:outline-2 focus-visible:outline-green-700">Restore standard settings</button>
            </fieldset>
          </details>

          <div className="mt-5 border-t border-gray-100 pt-5">
            <label htmlFor="download-format" className="mb-2 block text-sm font-bold text-gray-900">Photo format</label>
            <select id="download-format" value={format} disabled={downloading} onChange={(event) => { setFormat(event.target.value as DownloadFormat); setStatus('') }} className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-700 focus:border-green-700 focus:outline-green-700 disabled:opacity-50"><option value="jpeg">JPG — recommended for sharing</option><option value="png">PNG — preserves transparency</option></select>
            <button type="button" onClick={() => { void handleDownload(true) }} disabled={!canDownload} className={`${buttonClass} mt-3 flex w-full items-center justify-center gap-2 bg-green-700 text-white hover:bg-green-800`}>{downloading ? 'Preparing your download…' : photos.length > 1 ? `Download all ${photos.length} photos (ZIP)` : 'Download watermarked photo'}</button>
            {photos.length > 1 && <><button type="button" onClick={() => { void handleDownload(false) }} disabled={!ready || downloading} className={`${buttonClass} mt-2 w-full border border-green-200 text-green-800 hover:bg-green-50`}>Download this photo</button><p className="mt-2 text-center text-xs text-gray-500">All finished photos in one ZIP file.</p></>}
            {downloading && <div className="mt-3">{progress && <><progress className="h-2 w-full accent-green-700" value={progress.completed} max={progress.total} aria-label="Photos processed" /><p className="mt-1 truncate text-xs text-gray-600">{progress.completed} of {progress.total} processed · {progress.name}</p></>}<button type="button" onClick={() => downloadController.current?.abort()} className="mt-2 rounded px-1 py-1 text-xs font-semibold text-gray-600 underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-green-700">Cancel download</button></div>}
          </div>
          <p className="mt-4 text-center text-xs leading-relaxed text-gray-500">Your photos stay on your device.</p>
        </section>

        <section className="min-w-0 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm" aria-labelledby="preview-heading" aria-busy={loading}>
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 px-5 py-4 sm:px-6"><div className="flex items-center gap-3"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-sm font-bold text-green-800">2</span><h2 id="preview-heading" className="text-lg font-extrabold">Your preview</h2></div>{ready && <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">Watermarks ready</span>}</div>
          {selected && <div className="flex items-center justify-between gap-3 border-b border-gray-100 px-5 py-3 text-xs text-gray-600 sm:px-6"><p className="min-w-0 truncate" title={selected.file.name}>{selectedIndex + 1} of {photos.length} · {selected.file.name}</p><div className="flex shrink-0 gap-2"><button type="button" disabled={selectedIndex === 0 || downloading} onClick={() => setSelectedId(photos[selectedIndex - 1].id)} aria-label="Preview previous photo" className="rounded-md border border-gray-200 px-2 py-1 hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-green-700 disabled:opacity-40">←</button><button type="button" disabled={selectedIndex === photos.length - 1 || downloading} onClick={() => setSelectedId(photos[selectedIndex + 1].id)} aria-label="Preview next photo" className="rounded-md border border-gray-200 px-2 py-1 hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-green-700 disabled:opacity-40">→</button></div></div>}
          <div className="flex min-h-80 items-center justify-center bg-gray-100 p-4 sm:min-h-[480px] sm:p-6" style={{ backgroundImage: 'conic-gradient(#e5e7eb 25%, #f3f4f6 0 50%, #e5e7eb 0 75%, #f3f4f6 0)', backgroundSize: '20px 20px' }}>
            {photo && assets ? <canvas ref={canvasRef} role="img" aria-label={`Your photo with the white ${isLavun ? 'Lavun LGA' : 'SKV'} logo in the top right and a subtle watermark centered on the image`} className="block h-auto max-h-[600px] w-auto max-w-full rounded-sm object-contain shadow-lg" /> : <div className="max-w-xs rounded-2xl bg-white/90 p-7 text-center"><PhotoIcon className="mx-auto mb-4 h-12 w-12 text-gray-400" /><p className="font-bold text-gray-700">{loading ? 'Opening your photo…' : previewError ? 'This photo could not be opened' : photo ? assetError ? 'Watermark unavailable' : 'Loading the watermark…' : 'Your photos will appear here'}</p><p className="mt-2 text-sm leading-relaxed text-gray-500">{previewError ? 'Remove it or choose another photo. Other valid photos can still be downloaded.' : selected ? 'Your preview will be ready shortly.' : 'Choose one or more photos. Both watermark layers are added automatically.'}</p></div>}
          </div>
          <div className="px-5 py-4 sm:px-6">{previewError && <p role="alert" className="mb-3 text-sm text-red-700">{previewError}</p>}{photo ? <><p className="text-sm font-medium text-gray-700">Download size: {photo.width.toLocaleString()} × {photo.height.toLocaleString()} px</p><p className="mt-1 text-xs leading-relaxed text-gray-500">{photo.resized ? 'This large photo is resized for reliable downloads on phones. Its proportions are preserved.' : 'Your photo keeps its original dimensions and proportions.'} {format === 'jpeg' ? 'Transparent areas use a white background in JPG.' : 'PNG preserves transparent areas.'}</p></> : <p className="text-xs leading-relaxed text-gray-500">Consistent placement on every photo. Your original files stay unchanged.</p>}</div>
        </section>
      </div>
      <p role="status" aria-live="polite" className="mt-4 min-h-5 text-center text-sm text-green-800">{downloading ? progress ? `Processing photo ${Math.min(progress.completed + 1, progress.total)} of ${progress.total}…` : 'Preparing your watermarked photo…' : status}</p>
      {failed.length > 0 && <div role="alert" className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900"><h3 className="font-bold">These photos were not included</h3><ul className="mt-2 space-y-1">{failed.map((item, index) => <li key={index} className="break-words">{item.name}: {item.message}</li>)}</ul></div>}
    </div>
  )
}
