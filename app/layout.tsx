import type { Metadata, Viewport } from 'next'
import { Archivo, Instrument_Sans, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const headingFont = Archivo({
  subsets: ['latin'],
  axes: ['wdth'],
  variable: '--font-heading',
  display: 'swap',
})

const bodyFont = Instrument_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

const telemetryFont = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-telemetry',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Dental Explorer 3D — Jelajahi Anatomi Gigi Interaktif',
  description:
    'Platform edukasi gigi 3D: jelajahi anatomi, pelajari penyakit gigi dan mulut, simulasikan tahap kerusakan, dan uji pemahaman lewat kuis.',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  colorScheme: 'dark',
  themeColor: '#000000',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${headingFont.variable} ${bodyFont.variable} ${telemetryFont.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
