import type { Metadata } from 'next'
import './globals.css'
import ReduxProvider from '@/redux/provider'
import TopMenu from '@/components/TopMenu'

export const metadata: Metadata = {
  title: 'Dentist Booking',
  description: 'Dentist Booking System',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-slate-100 text-slate-900">
        <ReduxProvider>
          <TopMenu />
          {children}
        </ReduxProvider>
      </body>
    </html>
  )
}