'use client'

import Image from 'next/image'
import Link from 'next/link'

type AuthSplitLayoutProps = {
  title: string
  subtitle: string
  footerText: string
  footerLinkText: string
  footerHref: string
  children: React.ReactNode
}

export default function AuthSplitLayout({
  title,
  subtitle,
  footerText,
  footerLinkText,
  footerHref,
  children,
}: AuthSplitLayoutProps) {
  return (
    <main style={{ minHeight: '100vh', background: '#0f1624', display: 'flex', alignItems: 'stretch' }}>
      {/* Left — full-bleed image panel */}
      <div style={{ flex: '1.15', position: 'relative', display: 'none' }} className="lg:block" >
        <Image
          src="/img/login.jpg"
          alt="Dental clinic"
          fill
          priority
          style={{ objectFit: 'cover', objectPosition: 'center' }}
        />
        {/* Gradient overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(160deg, rgba(10,16,40,0.62) 0%, rgba(15,22,36,0.30) 50%, rgba(10,16,40,0.70) 100%)',
        }} />

        {/* Top bar */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          padding: '28px 36px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 38, height: 38, borderRadius: 10,
              background: 'linear-gradient(135deg, #c8a96e, #a8893e)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, fontWeight: 700, color: '#fff',
            }}>
              DB
            </div>
            <span style={{ fontSize: 15, fontWeight: 600, color: '#fff', letterSpacing: '-0.02em' }}>
              Dentist Booking
            </span>
          </div>
          <div style={{ display: 'flex', gap: 24 }}>
            {['Dentists', 'Appointments', 'Dashboard'].map((item) => (
              <span key={item} style={{ fontSize: 13, color: 'rgba(255,255,255,0.60)', fontWeight: 500 }}>
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom card */}
        <div style={{ position: 'absolute', bottom: 40, left: 36, right: 36 }}>
          <div style={{
            borderRadius: 20,
            background: 'rgba(10,16,40,0.55)',
            backdropFilter: 'blur(24px)',
            border: '1px solid rgba(255,255,255,0.10)',
            padding: '28px 32px',
          }}>
            <div style={{
              display: 'inline-block', marginBottom: 14,
              background: 'rgba(200,169,110,0.18)',
              border: '1px solid rgba(200,169,110,0.30)',
              borderRadius: 6, padding: '4px 12px',
              fontSize: 11, fontWeight: 700, letterSpacing: '0.10em',
              textTransform: 'uppercase', color: '#c8a96e',
            }}>
              Smart Dental Platform
            </div>
            <h2 style={{
              fontFamily: "'Instrument Serif', Georgia, serif",
              fontSize: 30, fontWeight: 400, color: '#fff',
              lineHeight: 1.25, letterSpacing: '-0.02em', margin: 0,
            }}>
              Your complete dental<br />appointment workflow.
            </h2>
            <p style={{ marginTop: 12, fontSize: 14, lineHeight: 1.7, color: 'rgba(255,255,255,0.58)' }}>
              Browse specialists, manage schedules, and keep track of every appointment through a professional role-based system.
            </p>
          </div>
        </div>
      </div>

      {/* Right — form panel */}
      <div style={{
        width: '100%', flex: '0 0 auto',
        maxWidth: 520,
        background: '#f9f8f6',
        display: 'flex', alignItems: 'center',
        padding: '48px 56px',
        position: 'relative',
      }}>
        {/* Subtle top accent line */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 3,
          background: 'linear-gradient(90deg, #c8a96e, #a8893e)',
        }} />

        <div style={{ width: '100%' }}>
          {/* Mobile logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 40 }} className="lg:hidden">
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'linear-gradient(135deg, #c8a96e, #a8893e)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 700, color: '#fff',
            }}>DB</div>
            <span style={{ fontSize: 16, fontWeight: 600, color: '#18160f', letterSpacing: '-0.02em' }}>
              Dentist Booking
            </span>
          </div>

          {/* Header */}
          <div style={{ marginBottom: 36 }}>
            <p style={{
              fontSize: 11, fontWeight: 700, letterSpacing: '0.10em',
              textTransform: 'uppercase', color: '#c8a96e', marginBottom: 10,
            }}>
              Authentication
            </p>
            <h1 style={{
              fontFamily: "'Instrument Serif', Georgia, serif",
              fontSize: 38, fontWeight: 400, color: '#18160f',
              letterSpacing: '-0.02em', lineHeight: 1.15, margin: 0,
            }}>
              {title}
            </h1>
            <p style={{ marginTop: 10, fontSize: 15, lineHeight: 1.65, color: '#5c5850' }}>
              {subtitle}
            </p>
          </div>

          {/* Form card */}
          <div style={{
            background: '#fff',
            borderRadius: 20,
            border: '1.5px solid #e4e1db',
            padding: '32px',
            boxShadow: '0 4px 24px rgba(24,22,15,0.07)',
          }}>
            {children}
          </div>

          {/* Footer */}
          <p style={{ marginTop: 24, fontSize: 14, color: '#8c8880', textAlign: 'center' }}>
            {footerText}{' '}
            <Link href={footerHref} style={{
              color: '#c8a96e', fontWeight: 600, textDecoration: 'none',
            }}>
              {footerLinkText}
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
