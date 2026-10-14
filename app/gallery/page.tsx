import Image from 'next/image'
import Link from 'next/link'

const photos = [
  {
    src: '/face-cap.jpeg',
    alt: 'Sani Kutigi – Senatorial Candidate',
    caption: 'Sani Kutigi, APC Candidate',
    width: 1080,
    height: 720,
  },
  {
    src: '/campain-banner.jpeg',
    alt: 'Campaign Banner',
    caption: 'Campaign Banner',
    width: 1080,
    height: 720,
  },
  {
    src: '/flier.jpeg',
    alt: 'Campaign Flier',
    caption: 'Official Campaign Flier',
    width: 720,
    height: 1080,
  },
  {
    src: '/countdown-campain-banner.jpeg',
    alt: 'Election Countdown Banner',
    caption: 'Election Countdown – January 16, 2027',
    width: 720,
    height: 1080,
  },
]

export default function GalleryPage() {
  return (
    <div className="py-14 px-6">
      <div className="max-w-5xl mx-auto">

        <div className="text-center mb-12">
          <p className="text-green-700 text-sm font-semibold uppercase tracking-widest mb-2">
            Media
          </p>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
            Campaign Gallery
          </h1>
          <p className="text-gray-500 mt-3 text-base">
            Photos and materials from the Sani Kutigi senatorial campaign.
          </p>
        </div>

        <div className="mb-10 flex flex-col items-start justify-between gap-4 rounded-2xl border border-green-200 bg-green-50 p-5 sm:flex-row sm:items-center sm:p-6">
          <div>
            <h2 className="text-lg font-bold text-green-900">Make your photos campaign-ready</h2>
            <p className="mt-1 text-sm leading-relaxed text-green-800">
              Add the SKV Media &amp; Publicity Crew watermark to your photos and download them for sharing.
            </p>
          </div>
          <Link
            href="/watermark"
            className="shrink-0 rounded-xl bg-green-700 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-green-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700"
          >
            Watermark Photos
          </Link>
        </div>

        <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
          {photos.map((photo) => (
            <div
              key={photo.src}
              className="break-inside-avoid rounded-2xl overflow-hidden shadow-md group"
            >
              <div className="relative w-full" style={{ aspectRatio: `${photo.width} / ${photo.height}` }}>
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
              <div className="bg-white px-4 py-3 border-t border-gray-100">
                <p className="text-sm text-gray-700 font-medium">{photo.caption}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
