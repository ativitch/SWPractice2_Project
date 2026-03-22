'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { logout } from '@/redux/features/authSlice'

export default function TopMenu() {
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
    <nav className="border-b border-slate-300 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="w-24" />

        <Link
          href="/"
          className="rounded-xl border border-slate-400 px-16 py-3 text-lg font-semibold text-slate-800 transition hover:bg-slate-100"
        >
          Big Ass Logo
        </Link>

        <div>
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="rounded-full border border-slate-500 px-5 py-3 text-sm text-slate-800 transition hover:bg-slate-100"
            >
              logout
            </button>
          ) : (
            <button
              onClick={() => router.push('/login')}
              className="rounded-full border border-slate-500 px-5 py-3 text-sm text-slate-800 transition hover:bg-slate-100"
            >
              login
            </button>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 pb-4">
        <div className="flex items-center justify-between rounded-2xl border border-slate-400 px-12 py-4">
          <button
            onClick={handleDentistRedirect}
            className="min-w-[160px] rounded-xl border border-slate-500 px-8 py-3 text-slate-800 transition hover:bg-slate-100"
          >
            Dentist
          </button>

          <button
            onClick={handleBookingRedirect}
            className="min-w-[160px] rounded-xl border border-slate-500 px-8 py-3 text-slate-800 transition hover:bg-slate-100"
          >
            Booking
          </button>
        </div>
      </div>
    </nav>
  )
}