import type { Metadata } from 'next'
import localFont from 'next/font/local'
import StoreProvider from './providers/StoreProvider'
import './globals.css'

const customFont = localFont({
  src: './fonts/GeistVF.woff',
  fallback: ['system-ui', 'sans-serif'],
  variable: '--font-custom',
})

export const metadata: Metadata = {
  title: {
    default: 'Next.js App Router Project',
    template: '%s | Next.js App Router',
  },
  description: 'Complete challenges to learn Next.js App Router: server components, data fetching, streaming, and more.',
  keywords: ['Next.js', 'App Router', 'React', 'Server Components'],
  openGraph: {
    title: 'Next.js App Router Project',
    description: 'Learn Next.js App Router through hands-on challenges.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}): React.JSX.Element {
  return (
    <html lang="en">
      <body className={customFont.className}>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  )
}
