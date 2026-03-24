'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getDentists } from '@/lib/dentists'
import type { Dentist } from '@/interface'
import { useAppSelector } from '@/redux/hooks'
import PageShell from '@/components/PageShell'

type SortOption = 'name-asc' | 'name-desc' | 'exp-asc' | 'exp-desc'

const inputStyle = {
  width: '100%', padding: '11px 16px',
  borderRadius: 12, fontSize: 14,
  border: '1.5px solid #e4e1db',
  background: '#f9f8f6', color: '#18160f',
  outline: 'none', appearance: 'none' as const,
}

export default function DentistsPage() {
  const router = useRouter()
  const { token, isLoggedIn } = useAppSelector((state) => state.auth)

  const [dentists, setDentists] = useState<Dentist[]>([])
  const [search, setSearch] = useState('')
  const [expertiseFilter, setExpertiseFilter] = useState('all')
  const [experienceFilter, setExperienceFilter] = useState('all')
  const [sortBy, setSortBy] = useState<SortOption>('name-asc')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isLoggedIn || !token) { router.push('/login'); return }
    const load = async () => {
      try {
        const res = await getDentists(token)
        setDentists(res.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load dentists')
      } finally {
        setLoading(false)
      }
    }
    void load()
  }, [isLoggedIn, token, router])

  const expertiseOptions = useMemo(() =>
    [...new Set(dentists.map((d) => d.areaOfExpertise))].sort((a, b) => a.localeCompare(b))
  , [dentists])

  const filteredDentists = useMemo(() => {
    let result = dentists.filter((d) => {
      const matchSearch = [d.name, d.areaOfExpertise].join(' ').toLowerCase().includes(search.toLowerCase())
      const matchExp = expertiseFilter === 'all' || d.areaOfExpertise === expertiseFilter
      const y = d.yearsOfExperience
      const matchYrs = experienceFilter === 'all'
        || (experienceFilter === '0-5' && y <= 5)
        || (experienceFilter === '6-10' && y >= 6 && y <= 10)
        || (experienceFilter === '11-15' && y >= 11 && y <= 15)
        || (experienceFilter === '16+' && y >= 16)
      return matchSearch && matchExp && matchYrs
    })
    return [...result].sort((a, b) => {
      switch (sortBy) {
        case 'name-desc': return b.name.localeCompare(a.name)
        case 'exp-asc': return a.yearsOfExperience - b.yearsOfExperience
        case 'exp-desc': return b.yearsOfExperience - a.yearsOfExperience
        default: return a.name.localeCompare(b.name)
      }
    })
  }, [dentists, search, expertiseFilter, experienceFilter, sortBy])

  const hasFilters = search || expertiseFilter !== 'all' || experienceFilter !== 'all' || sortBy !== 'name-asc'

  return (
    <PageShell>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Header */}
        <section style={{
          borderRadius: 24, background: '#fff',
          border: '1.5px solid #e4e1db',
          padding: '40px 44px',
          boxShadow: '0 4px 24px rgba(24,22,15,0.06)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 32, flexWrap: 'wrap' }}>
            <div style={{ maxWidth: 560 }}>
              <span style={{
                display: 'inline-block',
                background: '#f5edd8', border: '1px solid rgba(200,169,110,0.35)',
                borderRadius: 6, padding: '4px 12px',
                fontSize: 11, fontWeight: 700, letterSpacing: '0.10em',
                textTransform: 'uppercase', color: '#a8893e',
              }}>
                Dentist Directory
              </span>
              <h1 style={{
                fontFamily: "'Instrument Serif', Georgia, serif",
                fontSize: 'clamp(30px, 3vw, 44px)', fontWeight: 400,
                color: '#18160f', letterSpacing: '-0.02em', lineHeight: 1.15,
                marginTop: 16,
              }}>
                Find the right dentist for your next appointment.
              </h1>
              <p style={{ marginTop: 12, fontSize: 15, lineHeight: 1.7, color: '#5c5850' }}>
                Browse specialists, compare expertise, and book with confidence.
              </p>
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <div style={{
                borderRadius: 16, border: '1.5px solid #e4e1db',
                padding: '18px 24px', textAlign: 'center',
                minWidth: 110,
              }}>
                <p style={{ fontSize: 12, color: '#8c8880', fontWeight: 500 }}>Available</p>
                <p style={{ fontSize: 32, fontWeight: 700, color: '#18160f', letterSpacing: '-0.03em', lineHeight: 1.1, marginTop: 4 }}>
                  {filteredDentists.length}
                </p>
              </div>
              <div style={{
                borderRadius: 16, border: '1.5px solid #e4e1db',
                padding: '18px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'center',
              }}>
                <p style={{ fontSize: 12, color: '#8c8880', fontWeight: 500, marginBottom: 10 }}>Quick action</p>
                <button
                  onClick={() => router.push('/booking/me')}
                  style={{
                    padding: '8px 18px', borderRadius: 10, fontSize: 13, fontWeight: 600,
                    background: '#18160f', border: 'none', color: '#fff', cursor: 'pointer',
                    letterSpacing: '-0.01em',
                  }}
                >
                  My Bookings
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* List */}
        <section style={{
          borderRadius: 24, background: '#fff',
          border: '1.5px solid #e4e1db',
          padding: '36px 44px',
          boxShadow: '0 4px 24px rgba(24,22,15,0.05)',
        }}>
          <div style={{ marginBottom: 28 }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: '#18160f', letterSpacing: '-0.02em' }}>Dentist List</h2>
            <p style={{ marginTop: 6, fontSize: 14, color: '#8c8880' }}>Search, filter, and sort dentists by expertise and experience.</p>
          </div>

          {/* Filters */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, marginBottom: 24 }}>
            {[
              { label: 'Search', type: 'input' as const, value: search, onChange: setSearch, placeholder: 'Name or expertise' },
            ].map(({ label, value, onChange, placeholder }) => (
              <div key={label}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#8c8880', marginBottom: 8, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                  {label}
                </label>
                <input
                  style={inputStyle}
                  type="text"
                  placeholder={placeholder}
                  value={value as string}
                  onChange={(e) => onChange(e.target.value)}
                  onFocus={(e) => { e.target.style.borderColor = '#c8a96e'; e.target.style.background = '#fff' }}
                  onBlur={(e) => { e.target.style.borderColor = '#e4e1db'; e.target.style.background = '#f9f8f6' }}
                />
              </div>
            ))}

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#8c8880', marginBottom: 8, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Expertise</label>
              <select style={inputStyle} value={expertiseFilter} onChange={(e) => setExpertiseFilter(e.target.value)}
                onFocus={(e) => { e.target.style.borderColor = '#c8a96e'; e.target.style.background = '#fff' }}
                onBlur={(e) => { e.target.style.borderColor = '#e4e1db'; e.target.style.background = '#f9f8f6' }}>
                <option value="all">All expertise</option>
                {expertiseOptions.map((e) => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#8c8880', marginBottom: 8, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Experience</label>
              <select style={inputStyle} value={experienceFilter} onChange={(e) => setExperienceFilter(e.target.value)}
                onFocus={(e) => { e.target.style.borderColor = '#c8a96e'; e.target.style.background = '#fff' }}
                onBlur={(e) => { e.target.style.borderColor = '#e4e1db'; e.target.style.background = '#f9f8f6' }}>
                <option value="all">All experience</option>
                <option value="0-5">0–5 years</option>
                <option value="6-10">6–10 years</option>
                <option value="11-15">11–15 years</option>
                <option value="16+">16+ years</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#8c8880', marginBottom: 8, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Sort</label>
              <select style={inputStyle} value={sortBy} onChange={(e) => setSortBy(e.target.value as SortOption)}
                onFocus={(e) => { e.target.style.borderColor = '#c8a96e'; e.target.style.background = '#fff' }}
                onBlur={(e) => { e.target.style.borderColor = '#e4e1db'; e.target.style.background = '#f9f8f6' }}>
                <option value="name-asc">Name: A–Z</option>
                <option value="name-desc">Name: Z–A</option>
                <option value="exp-asc">Experience: Low–High</option>
                <option value="exp-desc">Experience: High–Low</option>
              </select>
            </div>
          </div>

          {hasFilters && (
            <div style={{ marginBottom: 20 }}>
              <button
                onClick={() => { setSearch(''); setExpertiseFilter('all'); setExperienceFilter('all'); setSortBy('name-asc') }}
                style={{
                  padding: '7px 16px', borderRadius: 8, fontSize: 13, fontWeight: 500,
                  border: '1.5px solid #e4e1db', background: '#fff',
                  color: '#5c5850', cursor: 'pointer',
                }}
              >
                Reset filters
              </button>
            </div>
          )}

          {loading && (
            <p style={{ fontSize: 14, color: '#8c8880', padding: '24px 0' }}>Loading dentists...</p>
          )}
          {error && (
            <div style={{ padding: '12px 16px', borderRadius: 12, background: '#fee2e2', border: '1px solid #fecaca', fontSize: 13, color: '#dc2626' }}>{error}</div>
          )}

          {!loading && !error && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
              {filteredDentists.map((dentist) => (
                <div
                  key={dentist._id}
                  style={{
                    borderRadius: 20,
                    border: '1.5px solid #e4e1db',
                    background: '#fff',
                    padding: '24px',
                    boxShadow: '0 2px 12px rgba(24,22,15,0.05)',
                    transition: 'box-shadow 0.2s ease, transform 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLDivElement
                    el.style.boxShadow = '0 8px 32px rgba(24,22,15,0.10)'
                    el.style.transform = 'translateY(-2px)'
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLDivElement
                    el.style.boxShadow = '0 2px 12px rgba(24,22,15,0.05)'
                    el.style.transform = 'translateY(0)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                    <div>
                      <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', color: '#a8893e' }}>
                        {dentist.areaOfExpertise}
                      </p>
                      <h3 style={{ fontSize: 19, fontWeight: 700, color: '#18160f', letterSpacing: '-0.02em', marginTop: 6 }}>
                        {dentist.name}
                      </h3>
                    </div>
                    <div style={{
                      borderRadius: 12,
                      background: '#f5edd8', border: '1px solid rgba(200,169,110,0.30)',
                      padding: '8px 14px', textAlign: 'center', flexShrink: 0,
                    }}>
                      <p style={{ fontSize: 10, color: '#a8893e', fontWeight: 600 }}>Exp.</p>
                      <p style={{ fontSize: 16, fontWeight: 700, color: '#18160f', letterSpacing: '-0.02em' }}>
                        {dentist.yearsOfExperience}y
                      </p>
                    </div>
                  </div>

                  <p style={{ marginTop: 14, fontSize: 13, lineHeight: 1.65, color: '#8c8880' }}>
                    Specialist in <span style={{ color: '#5c5850', fontWeight: 600 }}>{dentist.areaOfExpertise}</span> with a streamlined booking flow for quick appointments.
                  </p>

                  <div style={{ marginTop: 20 }}>
                    <button
                      onClick={() => router.push(`/booking?dentist=${dentist._id}`)}
                      style={{
                        width: '100%', padding: '11px', borderRadius: 12, fontSize: 14, fontWeight: 600,
                        background: '#18160f', border: 'none', color: '#fff', cursor: 'pointer',
                        letterSpacing: '-0.01em',
                      }}
                    >
                      Book now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && !error && filteredDentists.length === 0 && (
            <div style={{
              borderRadius: 16, border: '1.5px dashed #e4e1db',
              background: '#f9f8f6', padding: '48px 24px',
              textAlign: 'center', fontSize: 14, color: '#8c8880',
            }}>
              No dentist found matching your current filters.
            </div>
          )}
        </section>
      </div>
    </PageShell>
  )
}
