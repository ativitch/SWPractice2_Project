'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { logout } from '@/redux/features/authSlice'

export default function TopMenu() {
  const pathname = usePathname()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { isLoggedIn, user } = useAppSelector((state) => state.auth)

  if (pathname === '/login' || pathname === '/register') {
    return null
  }

  const isAdmin = user?.role === 'admin'

  const navItems = isAdmin
    ? [
        { label: 'Dentists', href: '/admin/dentists' },
        { label: 'Bookings', href: '/admin/bookings' },
      ]
    : [
        { label: 'Dentists', href: '/dentists' },
        { label: 'Bookings', href: '/booking/me' },
      ]

  const handleLogout = () => {
    dispatch(logout())
    router.push('/login')
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/90 backdrop-blur-xl">
      <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="grid h-20 grid-cols-[auto_1fr_auto] items-center gap-4">
          <Link href="/" className="flex min-w-0 items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-sky-400/40 bg-slate-900 text-lg font-bold text-white shadow-[0_10px_30px_rgba(59,130,246,0.25)]">
              DB
            </div>

            <div className="min-w-0">
              <p className="truncate text-2xl font-semibold tracking-tight text-white">
                Dentist Booking
              </p>
              <p className="truncate text-sm text-slate-400">
                Role based booking management
              </p>
            </div>
          </Link>

          <div className="hidden justify-center md:flex">
            <nav className="flex items-center gap-3">
              {navItems.map((item) => {
                const active = pathname === item.href

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`rounded-lg px-7 py-3 text-sm font-semibold transition ${
                      active
                        ? 'bg-sky-500 text-white shadow-[0_10px_28px_rgba(14,165,233,0.35)]'
                        : 'border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </nav>
          </div>

          <div className="flex items-center justify-end gap-3">
            {!isLoggedIn ? (
              <>
                <button
                  onClick={() => router.push('/register')}
                  className="rounded-lg border border-white/15 bg-white px-6 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-200"
                >
                  Register
                </button>

                <button
                  onClick={() => router.push('/login')}
                  className="rounded-lg border border-white/15 bg-sky-900/40 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-800/60"
                >
                  Sign In
                </button>
              </>
            ) : (
              <>
                <div className="hidden text-right sm:block">
                  <p className="text-sm font-medium text-white">{user?.name}</p>
                  <p className="text-xs uppercase tracking-[0.2em] text-sky-300">
                    {user?.role}
                  </p>
                </div>

                <button
                  onClick={handleLogout}
                  className="rounded-lg border border-white/15 bg-white/5 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}