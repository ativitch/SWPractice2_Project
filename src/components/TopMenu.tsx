'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { logout } from '@/redux/features/authSlice'

export default function TopMenu() {
  const router = useRouter()
  const pathname = usePathname()
  const dispatch = useAppDispatch()
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

  const handleLogout = () => {
    dispatch(logout())
    router.push('/login')
  }

  const isDentistActive =
    pathname === '/dentists' || pathname.startsWith('/admin/dentists')

  const isBookingActive =
    pathname.startsWith('/booking') || pathname.startsWith('/admin/bookings')

  return (
    <header className="w-full border-b border-slate-800/40 bg-[linear-gradient(90deg,#0b1220_0%,#17203a_55%,#1c2546_100%)] text-white shadow-md">
      <div className="w-full px-4 py-4 sm:px-6 lg:px-10">
        <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center border border-sky-500/40 bg-sky-500/10 text-2xl font-bold text-sky-200 shadow-inner">
              DB
            </div>

            <div>
              <button
                onClick={() => router.push('/')}
                className="text-left text-3xl font-bold tracking-tight text-white transition hover:text-sky-200"
              >
                Dentist Booking
              </button>
              <p className="text-sm text-slate-300">
                Role based booking management
              </p>
            </div>
          </div>

          <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2 border border-white/10 bg-white/5 p-1">
              <button
                onClick={handleDentistRedirect}
                className={`px-5 py-2 text-sm font-semibold transition ${
                  isDentistActive
                    ? 'bg-white text-slate-900'
                    : 'bg-transparent text-slate-200 hover:bg-white/10'
                }`}
              >
                Dentists
              </button>

              <button
                onClick={handleBookingRedirect}
                className={`px-5 py-2 text-sm font-semibold transition ${
                  isBookingActive
                    ? 'bg-white text-slate-900'
                    : 'bg-transparent text-slate-200 hover:bg-white/10'
                }`}
              >
                Bookings
              </button>
            </div>

            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20"
              >
                LOGOUT
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => router.push('/register')}
                  className="border border-white/20 bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
                >
                  Register
                </button>

                <button
                  onClick={() => router.push('/login')}
                  className="border border-sky-400 bg-sky-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-400"
                >
                  Sign In
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}