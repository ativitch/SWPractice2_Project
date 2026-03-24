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

  if (pathname === '/login' || pathname === '/register') return null

  const isAdmin = user?.role === 'admin'

  const navItems = isAdmin
    ? [
        { label: 'Dentists', href: '/admin/dentists' },
        { label: 'Bookings', href: '/admin/bookings' },
      ]
    : [
        { label: 'Dentists', href: '/dentists' },
        { label: 'My Bookings', href: '/booking/me' },
      ]

  const handleLogout = () => {
    dispatch(logout())
    router.push('/login')
  }

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(26,39,68,0.97)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        boxShadow: '0 1px 0 rgba(255,255,255,0.04), 0 4px 24px rgba(0,0,0,0.25)',
      }}
    >
      <div style={{ maxWidth: 1440, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', alignItems: 'center', gap: 16, height: 72 }}>
          
          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 14, textDecoration: 'none' }}>
            <div style={{
              width: 42, height: 42, borderRadius: 12,
              background: 'linear-gradient(135deg, #c8a96e 0%, #a8893e 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 15, fontWeight: 700, color: '#fff',
              letterSpacing: '-0.02em',
              boxShadow: '0 4px 16px rgba(200,169,110,0.35)',
            }}>
              DB
            </div>
            <div>
              <p style={{ fontSize: 17, fontWeight: 600, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                Dentist Booking
              </p>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.42)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Appointment Platform
              </p>
            </div>
          </Link>

          {/* Nav */}
          <nav style={{ display: 'flex', justifyContent: 'center', gap: 4 }}>
            {navItems.map((item) => {
              const active = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{
                    padding: '8px 20px',
                    borderRadius: 10,
                    fontSize: 14,
                    fontWeight: 500,
                    letterSpacing: '-0.01em',
                    textDecoration: 'none',
                    transition: 'all 0.15s ease',
                    ...(active
                      ? {
                          background: 'rgba(200,169,110,0.18)',
                          color: '#c8a96e',
                          border: '1px solid rgba(200,169,110,0.25)',
                        }
                      : {
                          color: 'rgba(255,255,255,0.65)',
                          border: '1px solid transparent',
                        }),
                  }}
                  onMouseEnter={(e) => {
                    if (!active) {
                      (e.target as HTMLAnchorElement).style.color = '#fff'
                      ;(e.target as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.06)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!active) {
                      (e.target as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.65)'
                      ;(e.target as HTMLAnchorElement).style.background = 'transparent'
                    }
                  }}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>

          {/* Auth area */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {!isLoggedIn ? (
              <>
                <button
                  onClick={() => router.push('/register')}
                  style={{
                    padding: '9px 20px', borderRadius: 10, fontSize: 14, fontWeight: 500,
                    background: 'transparent', border: '1px solid rgba(255,255,255,0.18)',
                    color: 'rgba(255,255,255,0.75)', cursor: 'pointer',
                  }}
                >
                  Register
                </button>
                <button
                  onClick={() => router.push('/login')}
                  style={{
                    padding: '9px 20px', borderRadius: 10, fontSize: 14, fontWeight: 600,
                    background: 'linear-gradient(135deg, #c8a96e, #a8893e)',
                    border: '1px solid rgba(200,169,110,0.3)',
                    color: '#fff', cursor: 'pointer',
                    boxShadow: '0 4px 16px rgba(200,169,110,0.3)',
                  }}
                >
                  Sign In
                </button>
              </>
            ) : (
              <>
                <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <span style={{ fontSize: 13, fontWeight: 500, color: '#fff', letterSpacing: '-0.01em' }}>
                    {user?.name}
                  </span>
                  <span style={{
                    fontSize: 10, fontWeight: 600, letterSpacing: '0.10em',
                    textTransform: 'uppercase', color: '#c8a96e',
                  }}>
                    {user?.role}
                  </span>
                </div>
                <div style={{ width: 1, height: 28, background: 'rgba(255,255,255,0.10)' }} />
                <button
                  onClick={handleLogout}
                  style={{
                    padding: '9px 20px', borderRadius: 10, fontSize: 14, fontWeight: 500,
                    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)',
                    color: 'rgba(255,255,255,0.7)', cursor: 'pointer',
                  }}
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
