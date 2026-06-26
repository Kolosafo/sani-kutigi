'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const links = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About SKV' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/join', label: 'Join Us' },
  { href: '/inquiry', label: 'Inquiry' },
  { href: '/complaint', label: 'Complaint' },
  { href: '/suggestions', label: 'Suggestions' },
]

export default function Nav() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-20">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3">

        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-full bg-green-700 flex items-center justify-center text-white font-extrabold text-sm select-none border-2 border-green-500">
            SKV
          </div>
          <div>
            <p className="font-extrabold text-green-800 leading-tight text-sm sm:text-base tracking-tight">
              SKV 2027
            </p>
            <p className="text-xs text-gray-500 hidden sm:block leading-tight">
              Sani Kutigi Vanguard
            </p>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-0.5">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`whitespace-nowrap px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === href
                  ? 'bg-green-700 text-white'
                  : 'text-gray-600 hover:text-green-700 hover:bg-green-50'
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-green-50 transition-colors"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label="Toggle navigation"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            {mobileOpen
              ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white px-4 pb-4">
          <nav className="flex flex-col gap-1 mt-2">
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  pathname === href
                    ? 'bg-green-700 text-white'
                    : 'text-gray-700 hover:bg-green-50 hover:text-green-700'
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}
