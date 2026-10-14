import type { Metadata } from 'next'
import WatermarkEditor from '../components/WatermarkEditor'

export const metadata: Metadata = {
  title: 'Watermark Photos | SKV 2027',
  description: 'Add the SKV Media & Publicity Crew logo and centered watermark to your photos, then download them for sharing.',
}

export default function WatermarkPage() {
  return (
    <div className="bg-gray-50 px-4 py-12 text-gray-900 sm:px-6 sm:py-14">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto mb-9 max-w-2xl text-center">
          <span className="mb-4 inline-block rounded-full bg-green-100 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-green-800">
            Media &amp; Publicity Crew
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Make your photos campaign ready</h1>
          <p className="mt-3 text-base leading-relaxed text-gray-600">
            Choose a photo to add the white SKV logo at the top right and a subtle watermark in the center.
            Preview it, then download your copy to share.
          </p>
        </div>
        <WatermarkEditor />
      </div>
    </div>
  )
}
