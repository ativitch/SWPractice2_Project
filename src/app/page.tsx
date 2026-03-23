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

  const isAdmin = user?.role === 'admin'

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
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.14),_transparent_30%),linear-gradient(to_bottom,_#eef4ff,_#f8fbff_35%,_#ffffff_100%)] px-6 py-10">
      <div className="mx-auto w-full max-w-[1240px]">
        <div className="overflow-hidden rounded-[36px] border border-slate-200/70 bg-white shadow-[0_25px_80px_rgba(15,23,42,0.10)]">
          <div className="grid gap-0 xl:grid-cols-[760px_1fr]">
            <div className="relative min-h-[760px] overflow-hidden bg-[linear-gradient(135deg,#0f172a_0%,#1e3a8a_45%,#dbeafe_100%)] px-10 py-12 text-white">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.12),transparent_28%),radial-gradient(circle_at_80%_30%,rgba(255,255,255,0.18),transparent_22%),radial-gradient(circle_at_60%_80%,rgba(255,255,255,0.12),transparent_26%)]" />

              <div className="relative z-10">
                <h1 className="max-w-[620px] text-[54px] font-bold leading-[1.05] tracking-tight">
                  Beautiful dental booking, organized in one place.
                </h1>

                <p className="mt-6 max-w-[560px] text-[18px] leading-8 text-slate-200">
                  A modern interface for discovering dentists, creating
                  appointments, and managing schedules with a seamless
                  experience for both patients and admins.
                </p>

                <div className="mt-8 flex gap-4">
                  <button
                    onClick={handleDentistRedirect}
                    className="rounded-2xl bg-white px-6 py-3 text-[15px] font-semibold text-slate-900 transition hover:bg-slate-200"
                  >
                    Explore Dentists
                  </button>

                  <button
                    onClick={handleBookingRedirect}
                    className="rounded-2xl border border-white/20 bg-white/10 px-6 py-3 text-[15px] font-semibold text-white transition hover:bg-white/20"
                  >
                    Manage Bookings
                  </button>
                </div>

                {isLoggedIn && isAdmin ? (
                  <div className="mt-12 grid max-w-[620px] gap-5">
                    <div className="rounded-[28px] border border-white/15 bg-white/10 p-6 backdrop-blur">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-200">
                            My Current Booking
                          </p>
                          <h3 className="mt-3 text-[28px] font-bold leading-tight text-white">
                            Monitor active appointments in one place
                          </h3>
                          <p className="mt-3 max-w-[460px] text-[15px] leading-7 text-slate-200">
                            Check the current booking queue, review appointment
                            details, and jump directly into booking management.
                          </p>
                        </div>

                        <div className="rounded-2xl bg-white/15 px-4 py-2 text-sm font-semibold text-white">
                          Active
                        </div>
                      </div>

                      <div className="mt-6 flex flex-wrap gap-3">
                        <button
                          onClick={() => router.push('/admin/bookings')}
                          className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-200"
                        >
                          Open Admin Bookings
                        </button>

                        <button
                          onClick={() => router.push('/admin/dentists')}
                          className="rounded-2xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
                        >
                          View Dentists
                        </button>
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="rounded-[24px] border border-white/15 bg-slate-950/35 p-5 backdrop-blur">
                        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-200">
                          Recent Booking
                        </p>
                        <p className="mt-3 text-[22px] font-bold text-white">
                          Latest booking activity
                        </p>
                        <p className="mt-2 text-[15px] leading-7 text-slate-200">
                          Review recently created, updated, or deleted bookings
                          to keep the system organized.
                        </p>
                      </div>

                      <div className="rounded-[24px] border border-white/15 bg-slate-950/35 p-5 backdrop-blur">
                        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-200">
                          Admin Control
                        </p>
                        <p className="mt-3 text-[22px] font-bold text-white">
                          Edit and manage quickly
                        </p>
                        <p className="mt-2 text-[15px] leading-7 text-slate-200">
                          Access all bookings and make changes confidently with
                          a cleaner management workflow.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mt-10 flex gap-8 text-white/95">
                    {['Easy booking', 'Full control', 'Clean & modern'].map(
                      (item) => (
                        <div key={item} className="flex items-center gap-3">
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 text-sm">
                            ✓
                          </div>
                          <span className="text-[17px] font-medium">
                            {item}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="min-h-[760px] bg-white px-8 py-10">
              <div className="mx-auto w-full max-w-[360px]">
                <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                  <p className="inline-flex rounded-full bg-sky-50 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.28em] text-sky-700">
                    Platform Guide
                  </p>

                  <h2 className="mt-5 text-[34px] font-bold leading-tight text-slate-900">
                    Everything your demo needs in one flow
                  </h2>

                  <p className="mt-4 text-[15px] leading-8 text-slate-600">
                    Show registration, authentication, dentist browsing,
                    booking creation, and role-based management in a polished
                    journey that looks consistent from start to finish.
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
                          <h3 className="text-[22px] font-semibold leading-tight text-slate-900">
                            {item.title}
                          </h3>
                          <p className="mt-2 text-[15px] leading-7 text-slate-600">
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
                    <p className="mt-2 text-[15px] leading-7 text-slate-600">
                      Create an account first, then log in to access dentists
                      and bookings.
                    </p>

                    <div className="mt-4 flex gap-3">
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
        </div>
      </div>
    </main>
  )
}