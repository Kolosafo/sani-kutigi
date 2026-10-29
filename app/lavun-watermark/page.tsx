import type { Metadata } from 'next'
import WatermarkEditor from '../components/WatermarkEditor'

export const metadata: Metadata = {
  title: 'Lavun LGA Watermark Photos',
  description: 'Add the Lavun LGA Media & Publicity Team logo to multiple photos, then download them for sharing.',
  robots: { index: false, follow: false },
}

export default function LavunWatermarkPage() {
  return (
    <div className="bg-gray-50 px-4 py-12 text-gray-900 sm:px-6 sm:py-14">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto mb-9 max-w-2xl text-center">
          <span className="mb-4 inline-block rounded-full bg-green-100 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-green-800">
            Lavun LGA Media &amp; Publicity Team
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Watermark your photos in one go</h1>
          <p className="mt-3 text-base leading-relaxed text-gray-600">
            Choose your photos to automatically add the white Lavun LGA logo at the top right and a subtle watermark in the center.
            Preview the results, then download your watermarked photos to share.
          </p>
        </div>
        <WatermarkEditor variant="lavun" />
      </div>
    </div>
  )
}
