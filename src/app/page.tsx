'use client'

import { useRouter } from 'next/navigation'
import { useAppSelector } from '@/redux/hooks'
import HomeBookingSummary from '@/components/HomeBookingSummary'

export default function HomePage() {
  const router = useRouter()
  const { isLoggedIn, user } = useAppSelector((state) => state.auth)

  const handleDentistRedirect = () => {
    if (!isLoggedIn || !user) {
      router.push('/login')
      return
    }
    router.push(user.role === 'admin' ? '/admin/dentists' : '/dentists')
  }

  const handleBookingRedirect = () => {
    if (!isLoggedIn || !user) {
      router.push('/login')
      return
    }
    router.push(user.role === 'admin' ? '/admin/bookings' : '/booking/me')
  }

  return (
    <main className="min-h-[calc(100vh-110px)] bg-[linear-gradient(135deg,#f7fbff_0%,#edf4ff_32%,#f8fafc_100%)] px-3 py-3 sm:px-4 sm:py-4 lg:px-5">
      <div className="space-y-4">
        <section className="grid gap-3 xl:grid-cols-[1.42fr_1fr]">
          <div className="overflow-hidden border border-slate-300 bg-[linear-gradient(135deg,#030817_0%,#0a1534_28%,#1e3f9f_66%,#ffffff_100%)] text-white shadow-xl">
            <div className="flex min-h-[560px] flex-col justify-between p-5 sm:p-6 lg:p-8">
              <div>
                <span className="inline-block border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-slate-100">
                  Smart Dental Appointment Platform
                </span>

                <h1 className="mt-5 max-w-5xl text-5xl font-bold leading-[1.03] sm:text-6xl xl:text-7xl">
                  Beautiful dental booking,
                  <br />
                  organized in one place.
                </h1>

                <p className="mt-5 max-w-4xl text-lg leading-9 text-slate-100 sm:text-xl">
                  A modern interface for discovering dentists, creating
                  appointments, and managing schedules with a seamless experience
                  for both patients and admins.
                </p>

                <div className="mt-10 flex flex-wrap gap-4">
                  <button
                    onClick={handleDentistRedirect}
                    className="border border-white bg-white px-7 py-4 font-semibold text-slate-900 shadow-[0_12px_28px_rgba(255,255,255,0.18)] transition hover:-translate-y-0.5 hover:bg-slate-100"
                  >
                    Explore Dentists
                  </button>

                  <button
                    onClick={handleBookingRedirect}
                    className="border border-white/30 bg-slate-950/35 px-7 py-4 font-semibold text-white shadow-[0_12px_28px_rgba(0,0,0,0.22)] transition hover:-translate-y-0.5 hover:bg-slate-950/50"
                  >
                    Manage Bookings
                  </button>
                </div>
              </div>

              <div className="pt-12 text-slate-100">
                <div className="flex flex-wrap gap-6 text-sm font-medium sm:text-base">
                  <span>✓ Search dentists</span>
                  <span>✓ Explore expertise</span>
                  <span>✓ Book directly</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex min-h-[560px] flex-col gap-4">
            <div className="border border-slate-300 bg-white p-6 shadow-lg">
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-sky-600">
                Platform Guide
              </p>
              <h2 className="mt-2 text-4xl font-bold leading-tight text-slate-900">
                Everything your demo needs in one flow
              </h2>
              <p className="mt-4 text-lg leading-8 text-slate-600">
                Show registration, authentication, dentist browsing, booking
                creation, and role-based management in a polished journey that
                looks consistent from start to finish.
              </p>
            </div>

            {[
              [
                '01',
                'Browse trusted dentists',
                'See dentists by expertise and experience before choosing the best match for your appointment.',
              ],
              [
                '02',
                'Book in a few clicks',
                'Create an appointment quickly with a clean booking flow and clear details before submission.',
              ],
              [
                '03',
                'Manage with confidence',
                'Users control their own bookings while admins can review and update every appointment in the system.',
              ],
            ].map(([no, title, desc]) => (
              <div
                key={no}
                className="grid grid-cols-[56px_1fr] gap-4 border border-slate-300 bg-white p-5 shadow"
              >
                <div className="flex h-14 w-14 items-center justify-center border border-slate-300 bg-slate-50 text-2xl font-bold text-sky-600">
                  {no}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">{title}</h3>
                  <p className="mt-2 text-lg leading-8 text-slate-600">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <HomeBookingSummary />
      </div>
    </main>
  )
}