//TODO:  check: https://github.com/vercel/next.js/issues/47793#issuecomment-1653889244

import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'WEBP Magix',
  description: 'WEBP Magix',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        {children}
        {/* <Footer/> */}
      </body>
    </html>
  )
}
