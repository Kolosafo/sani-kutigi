import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Nav from "./components/Nav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SKV 2027 | Sani Kutigi Vanguard – Niger State South",
  description:
    "Official campaign website of The Sani Kutigi Vanguard (SKV 2027) — supporting Distinguished Mohammed Sani Idris Legbo Kutigi for the Niger State South Senatorial seat under the All Progressive Congress.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white">

        {/* Official colours top bar: Green | White | Blue | Red */}
        <div className="flex h-1.5">
          <div className="flex-1 bg-green-700" />
          <div className="flex-1 bg-white border-y border-gray-200" />
          <div className="flex-1 bg-blue-700" />
          <div className="flex-1 bg-red-600" />
        </div>

        {/* APC / SKV announcement bar */}
        <div className="bg-green-800 text-white text-center text-xs sm:text-sm py-2 px-4 font-medium tracking-wide">
          The Sani Kutigi Vanguard (SKV 2027) &mdash; &ldquo;Leading the Way for a Greater Niger South&rdquo;
        </div>

        <Nav />

        <main className="flex-1">{children}</main>

        <footer className="bg-gray-900 text-gray-300 pt-12 pb-6 px-6">
          <div className="max-w-6xl mx-auto">

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-10">
              {/* Brand */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-9 h-9 rounded-full bg-green-700 flex items-center justify-center text-white font-extrabold text-xs">
                    SKV
                  </div>
                  <span className="font-extrabold text-white text-base">SKV 2027</span>
                </div>
                <p className="text-sm leading-relaxed text-gray-400">
                  The Sani Kutigi Vanguard — united in support of Distinguished Mohammed Sani
                  Idris Legbo Kutigi for Niger State South Senatorial District.
                </p>
                <p className="mt-3 text-xs italic text-green-400">
                  &ldquo;Leading the Way for a Greater Niger South&rdquo;
                </p>
              </div>

              {/* Quick links */}
              <div>
                <p className="font-bold text-white mb-3 text-sm uppercase tracking-wider">Quick Links</p>
                <ul className="space-y-2 text-sm">
                  {[
                    { href: '/', label: 'Home' },
                    { href: '/about', label: 'About SKV' },
                    { href: '/gallery', label: 'Gallery' },
                    { href: '/join', label: 'Join the Vanguard' },
                  ].map(({ href, label }) => (
                    <li key={href}>
                      <a href={href} className="hover:text-green-400 transition-colors">{label}</a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact */}
              <div>
                <p className="font-bold text-white mb-3 text-sm uppercase tracking-wider">Contact</p>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a href="mailto:info@sanikutigisenate.com" className="hover:text-green-400 transition-colors">
                      info@sanikutigisenate.com
                    </a>
                  </li>
                  <li><a href="/inquiry" className="hover:text-green-400 transition-colors">Send an Inquiry</a></li>
                  <li><a href="/complaint" className="hover:text-green-400 transition-colors">File a Complaint</a></li>
                  <li><a href="/suggestions" className="hover:text-green-400 transition-colors">Share a Suggestion</a></li>
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-700 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
              <p>&copy; 2026 The Sani Kutigi Vanguard (SKV 2027). All rights reserved.</p>
              <p>Niger State South Senatorial District &bull; All Progressive Congress</p>
            </div>
          </div>
        </footer>

      </body>
    </html>
  );
}
