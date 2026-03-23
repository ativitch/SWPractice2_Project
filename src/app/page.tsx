'use client'

import { useRouter } from 'next/navigation'
import { useAppSelector } from '@/redux/hooks'

const platformSteps = [
  {
    number: '01',
    title: 'Browse trusted dentists',
    description:
      'See dentists by expertise and experience before choosing the best match for your appointment.',
  },
  {
    number: '02',
    title: 'Book in a few clicks',
    description:
      'Create an appointment quickly with a clean booking flow and clear details before submission.',
  },
  {
    number: '03',
    title: 'Manage with confidence',
    description:
      'Users control their own bookings while admins can review and update every appointment in the system.',
  },
]

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
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.16),_transparent_30%),linear-gradient(to_bottom,_#eef4ff,_#f8fbff_35%,_#ffffff_100%)]">
      <section className="mx-auto max-w-7xl px-6 pb-14 pt-8 lg:px-8 lg:pb-20 lg:pt-10">
        <div className="overflow-hidden rounded-[36px] border border-slate-200/70 bg-white/70 shadow-[0_25px_80px_rgba(15,23,42,0.10)] backdrop-blur">
          <div className="grid xl:grid-cols-[1.35fr_0.9fr]">
            <div className="relative overflow-hidden bg-[linear-gradient(135deg,#0f172a_0%,#1e3a8a_45%,#e5eefb_100%)] px-8 py-10 text-white sm:px-10 lg:px-14 lg:py-14">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.12),transparent_28%),radial-gradient(circle_at_80%_30%,rgba(255,255,255,0.20),transparent_22%),radial-gradient(circle_at_60%_80%,rgba(255,255,255,0.15),transparent_26%)]" />

              <div className="relative z-10 max-w-3xl">
                <h1 className="max-w-3xl text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
                  Beautiful dental booking,
                  <br className="hidden sm:block" />
                  organized in one place.
                </h1>

                <p className="mt-6 max-w-2xl text-base leading-8 text-slate-200 sm:text-lg">
                  A modern interface for discovering dentists, creating
                  appointments, and managing schedules with a seamless
                  experience for both patients and admins.
                </p>

                <div className="mt-8 flex flex-wrap gap-4">
                  <button
                    onClick={handleDentistRedirect}
                    className="rounded-2xl bg-white px-6 py-3 text-base font-semibold text-slate-900 transition hover:bg-slate-200"
                  >
                    Explore Dentists
                  </button>

                  <button
                    onClick={handleBookingRedirect}
                    className="rounded-2xl border border-white/20 bg-white/10 px-6 py-3 text-base font-semibold text-white transition hover:bg-white/20"
                  >
                    Manage Bookings
                  </button>
                </div>

                <div className="mt-12">
                  <div className="mx-auto w-full max-w-[520px] rounded-[28px] border border-white/20 bg-slate-900/70 p-4 shadow-[0_30px_60px_rgba(15,23,42,0.35)] backdrop-blur">
                    <div className="rounded-[22px] border border-white/10 bg-white p-4 text-slate-900">
                      <div className="mb-4 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">
                            Dentist Booking
                          </p>
                          <p className="text-xs text-slate-500">
                            Appointment dashboard preview
                          </p>
                        </div>

                        <div className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700">
                          Live
                        </div>
                      </div>

                      <div className="grid gap-3">
                        {[
                          ['Arin Dental', '10:30 AM', 'Dr. Somchai'],
                          ['Smile Center', '11:45 AM', 'Dr. Nicha'],
                          ['Tooth Studio', '01:15 PM', 'Dr. Kritt'],
                        ].map(([clinic, time, doctor]) => (
                          <div
                            key={clinic}
                            className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                          >
                            <div>
                              <p className="text-sm font-semibold">{clinic}</p>
                              <p className="text-xs text-slate-500">{doctor}</p>
                            </div>
                            <div className="rounded-full bg-sky-600 px-3 py-1 text-xs font-semibold text-white">
                              {time}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-10 flex flex-wrap gap-8 text-white/95">
                  {['Easy booking', 'Full control', 'Clean & modern'].map(
                    (item) => (
                      <div key={item} className="flex items-center gap-3">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 text-sm">
                          ✓
                        </div>
                        <span className="text-lg font-medium">{item}</span>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white px-6 py-8 sm:px-8 lg:px-10 lg:py-12">
              <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                <p className="inline-flex rounded-full bg-sky-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.28em] text-sky-700">
                  Platform Guide
                </p>

                <h2 className="mt-5 text-3xl font-bold leading-tight text-slate-900">
                  Everything your demo needs in one flow
                </h2>

                <p className="mt-4 text-base leading-8 text-slate-600">
                  Show registration, authentication, dentist browsing, booking
                  creation, and role-based management in a polished journey that
                  looks consistent from start to finish.
                </p>
              </div>

              <div className="mt-5 space-y-4">
                {platformSteps.map((item) => (
                  <div
                    key={item.number}
                    className="rounded-[26px] border border-slate-200 bg-slate-50 px-5 py-5 shadow-sm"
                  >
                    <div className="flex gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-lg font-bold text-sky-700 shadow-sm">
                        {item.number}
                      </div>

                      <div>
                        <h3 className="text-2xl font-semibold text-slate-900">
                          {item.title}
                        </h3>
                        <p className="mt-2 text-base leading-8 text-slate-600">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {!isLoggedIn && (
                <div className="mt-5 rounded-[24px] border border-sky-100 bg-[linear-gradient(135deg,#eff6ff,#ffffff)] p-5">
                  <p className="text-lg font-semibold text-slate-900">
                    New here?
                  </p>
                  <p className="mt-2 text-base leading-8 text-slate-600">
                    Create an account first, then log in to access dentists and
                    bookings.
                  </p>

                  <div className="mt-4 flex flex-wrap gap-3">
                    <button
                      onClick={() => router.push('/register')}
                      className="rounded-2xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700"
                    >
                      Create account
                    </button>

                    <button
                      onClick={() => router.push('/login')}
                      className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
                    >
                      Sign in
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}