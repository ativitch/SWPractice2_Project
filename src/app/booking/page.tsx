'use client'

import { FormEvent, useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { getDentists } from '@/lib/dentists'
import { createBooking } from '@/lib/bookings'
import type { Dentist } from '@/interface'
import { useAppSelector } from '@/redux/hooks'
import PageShell from '@/components/PageShell'

const inputStyle = {
  width: '100%', padding: '13px 16px',
  borderRadius: 12, fontSize: 15,
  border: '1.5px solid #e4e1db',
  background: '#f9f8f6', color: '#18160f',
  outline: 'none',
}

const focusHandlers = {
  onFocus: (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    e.target.style.borderColor = '#c8a96e'
    e.target.style.boxShadow = '0 0 0 3px rgba(200,169,110,0.12)'
    e.target.style.background = '#fff'
  },
  onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    e.target.style.borderColor = '#e4e1db'
    e.target.style.boxShadow = 'none'
    e.target.style.background = '#f9f8f6'
  },
}

export default function BookingPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { token, isLoggedIn } = useAppSelector((state) => state.auth)

  const [dentists, setDentists] = useState<Dentist[]>([])
  const [bookingDate, setBookingDate] = useState('')
  const [dentist, setDentist] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isLoggedIn || !token) { router.push('/login'); return }
    const load = async () => {
      try {
        const res = await getDentists(token)
        setDentists(res.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load dentists')
      }
    }
    void load()
  }, [isLoggedIn, token, router])

  useEffect(() => {
    const d = searchParams.get('dentist')
    if (d) setDentist(d)
  }, [searchParams])

  const selectedDentist = useMemo(
    () => dentists.find((item) => item._id === dentist) ?? null,
    [dentists, dentist]
  )

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!token) return
    setError(''); setSuccess(''); setLoading(true)
    try {
      await createBooking({ bookingDate, dentist }, token)
      setSuccess('Booking created successfully')
      router.push('/booking/me')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Booking failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageShell>
      <div style={{ display: 'grid', gap: 20, gridTemplateColumns: '1fr 1fr' }}>
        {/* Left — info panel */}
        <section style={{
          borderRadius: 24,
          background: 'linear-gradient(150deg, #0d1a36 0%, #1a2744 50%, #243560 100%)',
          border: '1px solid rgba(255,255,255,0.07)',
          padding: '48px 48px',
          boxShadow: '0 20px 60px rgba(13,26,54,0.35)',
          position: 'relative', overflow: 'hidden',
        }}>
          {/* Top accent */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 2,
            background: 'linear-gradient(90deg, transparent, #c8a96e 30%, #a8893e 70%, transparent)',
          }} />

          <span style={{
            display: 'inline-block',
            background: 'rgba(200,169,110,0.14)', border: '1px solid rgba(200,169,110,0.28)',
            borderRadius: 6, padding: '4px 12px',
            fontSize: 11, fontWeight: 700, letterSpacing: '0.10em',
            textTransform: 'uppercase', color: '#c8a96e',
          }}>
            Booking Center
          </span>

          <h1 style={{
            fontFamily: "'Instrument Serif', Georgia, serif",
            fontSize: 'clamp(32px, 3vw, 44px)', fontWeight: 400,
            color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.15,
            marginTop: 20, maxWidth: 380,
          }}>
            Schedule your appointment with confidence.
          </h1>

          <p style={{ marginTop: 16, fontSize: 15, lineHeight: 1.75, color: 'rgba(255,255,255,0.55)', maxWidth: 360 }}>
            Choose a dentist, pick a date, and submit your booking in a clean, polished flow.
          </p>

          {/* Selected dentist preview */}
          <div style={{
            marginTop: 36,
            borderRadius: 18,
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.10)',
            padding: '24px 28px',
            backdropFilter: 'blur(12px)',
          }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', color: '#c8a96e' }}>
              Selected Dentist
            </p>
            {selectedDentist ? (
              <div style={{ marginTop: 16 }}>
                <h2 style={{ fontSize: 22, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em' }}>
                  {selectedDentist.name}
                </h2>
                <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)' }}>
                    Expertise: <span style={{ color: '#fff', fontWeight: 600 }}>{selectedDentist.areaOfExpertise}</span>
                  </p>
                  <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)' }}>
                    Experience: <span style={{ color: '#fff', fontWeight: 600 }}>{selectedDentist.yearsOfExperience} years</span>
                  </p>
                </div>
              </div>
            ) : (
              <p style={{ marginTop: 12, fontSize: 14, lineHeight: 1.7, color: 'rgba(255,255,255,0.45)' }}>
                Select a dentist from the form to preview details here.
              </p>
            )}
          </div>

          {/* Steps */}
          <div style={{ marginTop: 24, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[['Step 1', 'Choose your preferred appointment date and time.'], ['Step 2', 'Select a dentist and confirm your booking.']].map(([s, d]) => (
              <div key={s} style={{
                borderRadius: 14, background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
                padding: '16px 18px',
              }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: '#c8a96e', letterSpacing: '0.04em' }}>{s}</p>
                <p style={{ marginTop: 8, fontSize: 13, lineHeight: 1.6, color: 'rgba(255,255,255,0.50)' }}>{d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Right — form */}
        <section style={{
          borderRadius: 24, background: '#fff',
          border: '1.5px solid #e4e1db',
          padding: '48px 48px',
          boxShadow: '0 4px 24px rgba(24,22,15,0.07)',
        }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', color: '#a8893e' }}>
            Appointment Form
          </p>
          <h2 style={{
            fontFamily: "'Instrument Serif', Georgia, serif",
            fontSize: 34, fontWeight: 400, color: '#18160f',
            letterSpacing: '-0.02em', marginTop: 10,
          }}>
            Create Booking
          </h2>
          <p style={{ marginTop: 10, fontSize: 15, lineHeight: 1.65, color: '#5c5850' }}>
            Fill in the details below to schedule your appointment.
          </p>

          <form onSubmit={handleSubmit} style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#5c5850', marginBottom: 8 }}>
                Appointment Date & Time
              </label>
              <input
                type="datetime-local"
                style={inputStyle}
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                {...focusHandlers}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#5c5850', marginBottom: 8 }}>
                Select Dentist
              </label>
              <select
                style={{ ...inputStyle, appearance: 'none' }}
                value={dentist}
                onChange={(e) => setDentist(e.target.value)}
                {...focusHandlers}
                required
              >
                <option value="">Choose a dentist</option>
                {dentists.map((d) => (
                  <option key={d._id} value={d._id}>{d.name} — {d.areaOfExpertise}</option>
                ))}
              </select>
            </div>

            {error && (
              <div style={{ padding: '11px 14px', borderRadius: 10, background: '#fee2e2', border: '1px solid #fecaca', fontSize: 13, color: '#dc2626' }}>
                {error}
              </div>
            )}
            {success && (
              <div style={{ padding: '11px 14px', borderRadius: 10, background: '#dcfce7', border: '1px solid #bbf7d0', fontSize: 13, color: '#16a34a' }}>
                {success}
              </div>
            )}

            <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
              <button
                type="submit"
                disabled={loading}
                style={{
                  flex: 1, padding: '14px', borderRadius: 12, fontSize: 15, fontWeight: 600,
                  background: loading ? 'rgba(200,169,110,0.5)' : 'linear-gradient(135deg, #c8a96e, #a8893e)',
                  border: 'none', color: '#fff', cursor: loading ? 'not-allowed' : 'pointer',
                  boxShadow: loading ? 'none' : '0 4px 20px rgba(200,169,110,0.35)',
                  letterSpacing: '-0.01em',
                }}
              >
                {loading ? 'Submitting...' : 'Book Now'}
              </button>
              <button
                type="button"
                onClick={() => router.push('/booking/me')}
                style={{
                  padding: '14px 20px', borderRadius: 12, fontSize: 14, fontWeight: 500,
                  border: '1.5px solid #e4e1db', background: '#f9f8f6',
                  color: '#5c5850', cursor: 'pointer',
                }}
              >
                My Bookings
              </button>
            </div>
          </form>
        </section>
      </div>
    </PageShell>
  )
}
