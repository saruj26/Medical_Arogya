import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Arogya',
  description: 'Arogya Your Health Companion',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
