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
  title: "Sani Kutigi | Niger State South Senatorial Candidate – APC",
  description:
    "Official campaign website of Sani Kutigi, All Progressive Congress candidate for Niger State South Senatorial District.",
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

        {/* APC top bar */}
        <div className="bg-green-800 text-white text-center text-sm py-2 px-4 font-medium tracking-wide">
          All Progressive Congress &mdash; Niger State South Senatorial District
        </div>

        <Nav />

        <main className="flex-1">{children}</main>

        <footer className="bg-green-900 text-green-200 py-10 px-6 text-center">
          <p className="font-bold text-white text-lg mb-1">Sani Kutigi Campaign Office</p>
          <p className="text-sm mb-4">
            Niger State South Senatorial District &bull; All Progressive Congress
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm mb-6">
            <a href="mailto:info@sanikutigisenate.com" className="hover:text-white transition-colors">
              info@sanikutigisenate.com
            </a>
            <a href="/inquiry" className="hover:text-white transition-colors">
              Send an Inquiry
            </a>
            <a href="/complaint" className="hover:text-white transition-colors">
              File a Complaint
            </a>
          </div>
          <p className="text-xs text-green-400">
            &copy; 2026 Sani Kutigi Campaign. All rights reserved.
          </p>
        </footer>

      </body>
    </html>
  );
}
