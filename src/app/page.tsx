'use client'

import { useRouter } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { logout } from '@/redux/features/authSlice'

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
  const dispatch = useAppDispatch()
  const { isLoggedIn, user } = useAppSelector((state) => state.auth)
  const handleLogout = () => {
  dispatch(logout())
  router.push('/login')
}
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
    <main className="min-h-[calc(100-screen-80px)] w-full bg-gradient-to-br from-slate-100 via-slate-50 to-slate-200">
      <section className="mx-auto max-w-[1600px] px-8 py-10 lg:px-12">
        
        {/* ลบส่วน <header> เดิมออกทั้งหมด เพราะเรามี TopMenu ใน layout.tsx แล้ว */}

        <div className="grid grid-cols-1 gap-8 xl:grid-cols-[1.35fr_0.9fr]">
          
          {/* ส่วน Banner หลัก */}
          <div className="flex min-h-[600px] items-center justify-center border border-slate-800 bg-slate-950 px-12 py-14 text-white shadow-2xl">
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

          {/* ส่วน User Guide ด้านข้าง */}
          <div className="flex min-h-[600px] flex-col justify-between border border-slate-200 bg-white p-8 shadow-xl">
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
                  <p className="text-sm">
                    View the available dentists, check their area of expertise,
                    and review experience before making a decision.
                  </p>
                </div>

                <div className="border-l-4 border-slate-900 pl-4">
                  <p className="font-semibold text-slate-900">Create a booking</p>
                  <p className="text-sm">
                    Select a date and choose your preferred dentist to make an
                    appointment through the booking section.
                  </p>
                </div>

                <div className="border-l-4 border-slate-900 pl-4">
                  <p className="font-semibold text-slate-900">Manage your booking</p>
                  <p className="text-sm">
                    Users can view, update, or delete their own booking, while
                    administrators can manage booking records across the system.
                  </p>
                </div>

                <div className="border-l-4 border-slate-900 pl-4">
                  <p className="font-semibold text-slate-900">Role-based access</p>
                  <p className="text-sm">
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
              <ol className="mt-4 space-y-3 text-sm leading-7 text-slate-700">
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