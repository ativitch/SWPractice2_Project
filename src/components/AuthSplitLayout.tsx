'use client'

import Image from 'next/image'
import Link from 'next/link'

type AuthSplitLayoutProps = {
  title: string
  subtitle: string
  footerText: string
  footerLinkText: string
  footerHref: string
  children: React.ReactNode
}

export default function AuthSplitLayout({
  title,
  subtitle,
  footerText,
  footerLinkText,
  footerHref,
  children,
}: AuthSplitLayoutProps) {
  return (
    <main className="min-h-screen bg-[linear-gradient(135deg,#f8fbff_0%,#eef4ff_45%,#f8fafc_100%)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex w-full justify-center">
        <section className="grid min-h-[calc(100vh-48px)] w-full max-w-[1440px] overflow-hidden rounded-2xl border border-slate-300 bg-white shadow-2xl lg:grid-cols-[1.2fr_0.8fr]">
          <div className="relative min-h-[320px] lg:min-h-full">
            <Image
              src="/img/login.jpg"
              alt="Authentication visual"
              fill
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(2,6,23,0.45)_0%,rgba(15,23,42,0.2)_45%,rgba(255,255,255,0.02)_100%)]" />

            <div className="absolute inset-x-0 top-0 flex items-center justify-between border-b border-white/20 bg-white/10 px-5 py-4 backdrop-blur-sm">
              <div className="text-sm font-semibold uppercase tracking-[0.2em] text-white">
                Dentist Booking
              </div>

              <div className="hidden gap-6 text-sm font-medium text-white/90 md:flex">
                <span>Browse Dentists</span>
                <span>Book Appointment</span>
                <span>Manage Booking</span>
              </div>
            </div>

            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
              <div className="max-w-xl rounded-xl border border-white/15 bg-slate-950/35 p-6 text-white backdrop-blur-md">
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-sky-200">
                  Smart Dental Appointment Platform
                </p>
                <h2 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl">
                  Clean access to your dental booking workflow.
                </h2>
                <p className="mt-4 text-sm leading-7 text-slate-200 sm:text-base">
                  Browse dentists, manage appointments, and access booking tools
                  through a professional role-based system.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center bg-slate-50 px-5 py-8 sm:px-8 lg:px-10">
            <div className="mx-auto w-full max-w-md">
              <div className="mb-8">
                <p className="text-sm font-bold uppercase tracking-[0.22em] text-sky-600">
                  Authentication
                </p>
                <h1 className="mt-2 text-4xl font-bold text-slate-900">{title}</h1>
                <p className="mt-3 text-base leading-7 text-slate-600">{subtitle}</p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-lg sm:p-7">
                {children}
              </div>

              <p className="mt-6 text-sm leading-6 text-slate-600">
                {footerText}{' '}
                <Link
                  href={footerHref}
                  className="font-semibold text-sky-600 transition hover:text-sky-500"
                >
                  {footerLinkText}
                </Link>
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}