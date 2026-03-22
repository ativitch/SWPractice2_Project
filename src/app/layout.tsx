import type { Metadata } from 'next'
import './globals.css'
import TopMenu from '@/components/TopMenu'
import ReduxProvider from '@/redux/provider'

export const metadata: Metadata = {
  title: 'Dentist Booking',
  description: 'Dentist booking management system',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
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