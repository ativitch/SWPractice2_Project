'use client'

import { useRouter } from 'next/navigation'
import { useAppSelector } from '@/redux/hooks'

export default function HomePage() {
  const router = useRouter()
  const { isLoggedIn, user } = useAppSelector((state) => state.auth)

  const handleDentistRedirect = () => {
    if (!isLoggedIn || !user) {
      router.push('/login')
      return
    }

    if (user.role === 'admin') {
      router.push('/admin/dentists')
    } else {
      router.push('/dentists')
    }
  }

  const handleBookingRedirect = () => {
    if (!isLoggedIn || !user) {
      router.push('/login')
      return
    }

    if (user.role === 'admin') {
      router.push('/admin/bookings')
    } else {
      router.push('/booking/me')
    }
  }

  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-slate-100 via-slate-50 to-slate-200">
      <section className="flex min-h-screen w-full flex-col px-8 py-8 lg:px-12">
        <header className="mb-8 w-full rounded-[24px] border border-slate-200 bg-white px-6 py-6 shadow-md">
          <div className="mb-6 flex items-center justify-between">
            <div className="w-[120px]" />

            <button
              onClick={() => router.push('/')}
              className="flex h-[84px] w-[320px] items-center justify-center border-2 border-dashed border-slate-300 bg-slate-50 text-sm font-semibold tracking-[0.15em] text-slate-400 transition hover:bg-slate-100"
            >
              LOGO IMAGE PLACEHOLDER
            </button>

            <button
              onClick={() => router.push(isLoggedIn ? '/' : '/login')}
              className="border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              {isLoggedIn ? 'ACCOUNT' : 'LOGIN'}
            </button>
          </div>

          <div className="flex items-center justify-between bg-slate-900 px-4 py-4">
            <button
              onClick={handleDentistRedirect}
              className="min-w-[180px] border border-slate-300 bg-white px-8 py-3 text-base font-semibold text-slate-800 transition hover:bg-slate-100"
            >
              Dentist
            </button>

            <button
              onClick={handleBookingRedirect}
              className="min-w-[180px] border border-slate-300 bg-white px-8 py-3 text-base font-semibold text-slate-800 transition hover:bg-slate-100"
            >
              Booking
            </button>
          </div>
        </header>

        <div className="grid flex-1 grid-cols-1 gap-8 xl:grid-cols-[1.35fr_0.9fr]">
          <div className="flex min-h-[640px] items-center justify-center border border-slate-800 bg-slate-950 px-12 py-14 text-white shadow-2xl">
            <div className="mx-auto flex w-full max-w-4xl flex-col items-start justify-center">
              <span className="mb-5 border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium uppercase tracking-[0.18em] text-slate-200">
                Smart Dental Appointment Platform
              </span>

              <h1 className="mb-8 text-5xl font-bold leading-[1.1] text-white xl:text-7xl">
                Modern dentist booking
                <br />
                made simple.
              </h1>

              <p className="max-w-3xl text-lg leading-9 text-slate-300 xl:text-xl">
                Book appointments, browse dentist information, and manage your
                schedule through a clean system designed for both patients and
                administrators.
              </p>

              <div className="mt-10 flex flex-wrap gap-4">
                <button
                  onClick={handleDentistRedirect}
                  className="border border-white bg-white px-7 py-3 text-base font-semibold text-slate-900 transition hover:bg-slate-200"
                >
                  View Dentists
                </button>

                <button
                  onClick={handleBookingRedirect}
                  className="border border-white/30 bg-transparent px-7 py-3 text-base font-semibold text-white transition hover:bg-white/10"
                >
                  Manage Booking
                </button>
              </div>
            </div>
          </div>

          <div className="flex min-h-[640px] flex-col justify-between border border-slate-200 bg-white p-8 shadow-xl">
            <div>
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-slate-500">
                User Guide
              </p>

              <h2 className="mb-6 text-3xl font-bold text-slate-900">
                What you can do in this system
              </h2>

              <div className="space-y-5 text-base leading-8 text-slate-700">
                <div className="border-l-4 border-slate-900 pl-4">
                  <p className="font-semibold text-slate-900">Browse dentists</p>
                  <p>
                    View the available dentists, check their area of expertise,
                    and review experience before making a decision.
                  </p>
                </div>

                <div className="border-l-4 border-slate-900 pl-4">
                  <p className="font-semibold text-slate-900">Create a booking</p>
                  <p>
                    Select a date and choose your preferred dentist to make an
                    appointment through the booking section.
                  </p>
                </div>

                <div className="border-l-4 border-slate-900 pl-4">
                  <p className="font-semibold text-slate-900">Manage your booking</p>
                  <p>
                    Users can view, update, or delete their own booking, while
                    administrators can manage booking records across the system.
                  </p>
                </div>

                <div className="border-l-4 border-slate-900 pl-4">
                  <p className="font-semibold text-slate-900">Role-based access</p>
                  <p>
                    The Dentist and Booking buttons will take you to different
                    pages depending on whether you are logged in as a user or an
                    administrator.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 border border-slate-200 bg-slate-50 p-6">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500">
                Quick Start
              </p>
              <ol className="mt-4 space-y-3 text-base leading-7 text-slate-700">
                <li>1. Log in to access system features.</li>
                <li>2. Open the Dentist page to review available dentists.</li>
                <li>3. Open the Booking page to create or manage appointments.</li>
              </ol>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}