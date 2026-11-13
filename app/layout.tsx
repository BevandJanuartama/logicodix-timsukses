import type { Metadata, Viewport } from 'next'
import { Atkinson_Hyperlegible_Next, Newsreader } from 'next/font/google'
import './globals.css'

const displayFont = Newsreader({
  subsets: ['latin'],
  weight: ['500', '600'],
  variable: '--font-display',
  display: 'swap',
})

const bodyFont = Atkinson_Hyperlegible_Next({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-body',
  display: 'swap',
  adjustFontFallback: false,
  fallback: ['system-ui', 'Segoe UI', 'Arial', 'sans-serif'],
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
  colorScheme: 'light',
  themeColor: '#EEF4F3',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${displayFont.variable} ${bodyFont.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
