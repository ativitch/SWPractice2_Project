'use client'

import { useRouter } from 'next/navigation'
import { useAppSelector } from '@/redux/hooks'
import HomeBookingSummary from '@/components/HomeBookingSummary'
import PageShell from '@/components/PageShell'

export default function HomePage() {
  const router = useRouter()
  const { isLoggedIn, user } = useAppSelector((state) => state.auth)

  const handleDentistRedirect = () => {
    if (!isLoggedIn || !user) { router.push('/login'); return }
    router.push(user.role === 'admin' ? '/admin/dentists' : '/dentists')
  }

  const handleBookingRedirect = () => {
    if (!isLoggedIn || !user) { router.push('/login'); return }
    router.push(user.role === 'admin' ? '/admin/bookings' : '/booking/me')
  }

  const steps = [
    { no: '01', title: 'Browse trusted dentists', desc: 'Explore specialists by expertise and experience to find the best match for your needs.' },
    { no: '02', title: 'Book in a few clicks', desc: 'Create an appointment quickly with a clean, straightforward booking flow.' },
    { no: '03', title: 'Manage with confidence', desc: 'Control your bookings while admins oversee the full system with role-based access.' },
  ]

  return (
    <PageShell
      className="py-6"
      containerClassName="max-w-[1520px]"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Hero grid */}
        <section style={{ display: 'grid', gap: 20, gridTemplateColumns: '1fr 1fr' }}>
          {/* Hero card */}
          <div style={{
            borderRadius: 24,
            background: 'linear-gradient(150deg, #0d1a36 0%, #1a2744 40%, #243560 75%, #1a3a6e 100%)',
            overflow: 'hidden', position: 'relative',
            border: '1px solid rgba(255,255,255,0.07)',
            boxShadow: '0 20px 60px rgba(13,26,54,0.40)',
          }}>
            {/* Gold accent line */}
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: 2,
              background: 'linear-gradient(90deg, transparent, #c8a96e 30%, #a8893e 70%, transparent)',
            }} />
            {/* Subtle radial glow */}
            <div style={{
              position: 'absolute', top: -60, right: -60, width: 300, height: 300,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(200,169,110,0.08), transparent 70%)',
              pointerEvents: 'none',
            }} />

            <div style={{ padding: '52px 52px 48px', minHeight: 560, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative' }}>
              <div>
                <span style={{
                  display: 'inline-block',
                  background: 'rgba(200,169,110,0.14)',
                  border: '1px solid rgba(200,169,110,0.28)',
                  borderRadius: 6, padding: '5px 14px',
                  fontSize: 11, fontWeight: 700, letterSpacing: '0.10em',
                  textTransform: 'uppercase', color: '#c8a96e',
                }}>
                  Smart Dental Platform
                </span>

                <h1 style={{
                  fontFamily: "'Instrument Serif', Georgia, serif",
                  fontSize: 'clamp(42px, 4.5vw, 64px)',
                  fontWeight: 400,
                  color: '#fff',
                  lineHeight: 1.1,
                  letterSpacing: '-0.03em',
                  marginTop: 24,
                  maxWidth: 520,
                }}>
                  Beautiful dental booking, organized in one place.
                </h1>

                <p style={{ marginTop: 20, fontSize: 16, lineHeight: 1.75, color: 'rgba(255,255,255,0.58)', maxWidth: 420 }}>
                  A modern platform for discovering dentists, creating appointments, and managing schedules with a seamless experience.
                </p>

                <div style={{ display: 'flex', gap: 12, marginTop: 36, flexWrap: 'wrap' }}>
                  <button
                    onClick={handleDentistRedirect}
                    style={{
                      padding: '14px 30px', borderRadius: 12, fontSize: 15, fontWeight: 600,
                      background: 'linear-gradient(135deg, #c8a96e, #a8893e)',
                      border: 'none', color: '#fff', cursor: 'pointer',
                      boxShadow: '0 6px 24px rgba(200,169,110,0.40)',
                      letterSpacing: '-0.01em',
                    }}
                  >
                    Explore Dentists
                  </button>
                  <button
                    onClick={handleBookingRedirect}
                    style={{
                      padding: '14px 30px', borderRadius: 12, fontSize: 15, fontWeight: 500,
                      background: 'rgba(255,255,255,0.07)',
                      border: '1px solid rgba(255,255,255,0.14)',
                      color: 'rgba(255,255,255,0.80)', cursor: 'pointer',
                      letterSpacing: '-0.01em',
                    }}
                  >
                    Manage Bookings
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                {['Search dentists', 'Create appointments', 'Manage bookings'].map((f) => (
                  <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{
                      width: 18, height: 18, borderRadius: '50%',
                      background: 'rgba(200,169,110,0.20)',
                      border: '1px solid rgba(200,169,110,0.40)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 10, color: '#c8a96e',
                    }}>✓</div>
                    <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.58)', fontWeight: 500 }}>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Intro card */}
            <div style={{
              borderRadius: 24, background: '#fff',
              border: '1.5px solid #e4e1db',
              padding: '32px 36px',
              boxShadow: '0 4px 24px rgba(24,22,15,0.07)',
            }}>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', color: '#c8a96e' }}>
                Platform Guide
              </p>
              <h2 style={{
                fontFamily: "'Instrument Serif', Georgia, serif",
                fontSize: 32, fontWeight: 400, color: '#18160f',
                letterSpacing: '-0.02em', lineHeight: 1.2, marginTop: 10,
              }}>
                Everything you need in one seamless flow
              </h2>
              <p style={{ marginTop: 12, fontSize: 15, lineHeight: 1.7, color: '#5c5850' }}>
                From registration to booking management — a polished journey for patients and admins alike.
              </p>
            </div>

            {/* Step cards */}
            {steps.map(({ no, title, desc }) => (
              <div
                key={no}
                style={{
                  borderRadius: 20, background: '#fff',
                  border: '1.5px solid #e4e1db',
                  padding: '22px 28px',
                  display: 'grid', gridTemplateColumns: '56px 1fr', gap: 18, alignItems: 'start',
                  boxShadow: '0 2px 12px rgba(24,22,15,0.05)',
                }}
              >
                <div style={{
                  width: 56, height: 56, borderRadius: 14,
                  background: '#f9f8f6', border: '1.5px solid #e4e1db',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: "'Instrument Serif', Georgia, serif",
                  fontSize: 22, color: '#c8a96e',
                }}>
                  {no}
                </div>
                <div>
                  <h3 style={{ fontSize: 17, fontWeight: 600, color: '#18160f', letterSpacing: '-0.01em' }}>{title}</h3>
                  <p style={{ marginTop: 6, fontSize: 14, lineHeight: 1.65, color: '#5c5850' }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <HomeBookingSummary />
      </div>
    </PageShell>
  )
}
