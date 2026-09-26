import Image from 'next/image'
import type { Executive } from '@/lib/executives'

const TITLES = /^(hon\.|engr\.|barrister|malam|amb\.)\s+/i

function initials(name: string) {
  let rest = name
  while (TITLES.test(rest)) rest = rest.replace(TITLES, '')
  return rest
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}

export default function ExecutiveCard({ executive, index }: { executive: Executive; index?: number }) {
  const { name, portfolio, poster } = executive

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100 flex flex-col group">
      <div className="relative w-full aspect-3/4 bg-linear-to-br from-green-800 to-blue-900">
        {poster ? (
          <a href={poster} target="_blank" rel="noopener noreferrer" aria-label={`View ${name}'s poster`}>
            <Image
              src={poster}
              alt={`${name}, ${portfolio}`}
              fill
              style={{ objectFit: 'cover', objectPosition: 'top' }}
              className="transition-transform duration-300 group-hover:scale-[1.03]"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          </a>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
            <div className="w-24 h-24 rounded-full border-4 border-white/30 bg-white/10 flex items-center justify-center text-3xl font-extrabold tracking-wide">
              {initials(name)}
            </div>
            <p className="mt-4 text-xs font-bold uppercase tracking-widest text-green-200">SKV 2027</p>
          </div>
        )}
        {index !== undefined && (
          <span className="absolute top-3 left-3 w-8 h-8 rounded-full bg-red-600 text-white text-xs font-bold flex items-center justify-center shadow">
            {index}
          </span>
        )}
      </div>
      <div className="px-4 py-4 border-t-4 border-green-700 flex-1">
        <p className="text-green-700 text-xs font-bold uppercase tracking-wider">{portfolio}</p>
        <p className="text-gray-900 font-bold text-sm mt-1 leading-snug">{name}</p>
      </div>
    </div>
  )
}
