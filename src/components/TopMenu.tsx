'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { logout } from '@/redux/features/authSlice'

export default function TopMenu() {
  const pathname = usePathname()
  const router = useRouter()
  const pathname = usePathname()
  const dispatch = useAppDispatch()
  const { isLoggedIn, user } = useAppSelector((state) => state.auth)

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
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-sky-400/40 bg-slate-900 text-lg font-bold text-white shadow-[0_10px_30px_rgba(59,130,246,0.25)]">
            DB
          </div>

          <div>
            <p className="text-2xl font-semibold tracking-tight text-white">
              Dentist Booking
            </p>
            <p className="text-sm text-slate-400">
              Role based booking management
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 p-1.5 md:flex">
          {navItems.map((item) => {
            const active = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                  active
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-200 hover:bg-white/10 hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-3">
          {!isLoggedIn ? (
            <>
              <button
                onClick={() => router.push('/register')}
                className="rounded-2xl bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-200"
              >
                Register
              </button>
              <button
                onClick={() => router.push('/login')}
                className="rounded-2xl border border-white/15 bg-sky-900/40 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-800/60"
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
                className="rounded-2xl border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}