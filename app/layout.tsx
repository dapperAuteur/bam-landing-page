import './globals.css'
import { Inter } from 'next/font/google'
import Navigation from './../components/Navigation'
import React from 'react'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Brand Anthony McDonald | Voice Over Artist & Business Consultant',
  description: 'Professional voice over services and business consulting. Training to be the world\'s fastest centenarian.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navigation />
        {children}
      </body>
    </html>
  )
}