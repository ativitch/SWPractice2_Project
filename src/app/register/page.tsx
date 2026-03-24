'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { registerUser } from '@/lib/auth'
import AuthSplitLayout from '@/components/AuthSplitLayout'

export default function RegisterPage() {
  const router = useRouter()

  const [name, setName] = useState('')
  const [telephone, setTelephone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await registerUser({ name, telephone, email, password })
      router.push('/login')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Register failed')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: '100%', padding: '12px 16px',
    borderRadius: 12, fontSize: 15,
    border: '1.5px solid #e4e1db',
    background: '#f9f8f6', color: '#18160f',
    outline: 'none',
  }

  const labelStyle = {
    display: 'block', fontSize: 13, fontWeight: 600,
    color: '#5c5850', marginBottom: 8, letterSpacing: '-0.01em',
  }

  const focusHandlers = {
    onFocus: (e: React.FocusEvent<HTMLInputElement>) => {
      e.target.style.borderColor = '#c8a96e'
      e.target.style.boxShadow = '0 0 0 3px rgba(200,169,110,0.12)'
      e.target.style.background = '#fff'
    },
    onBlur: (e: React.FocusEvent<HTMLInputElement>) => {
      e.target.style.borderColor = '#e4e1db'
      e.target.style.boxShadow = 'none'
      e.target.style.background = '#f9f8f6'
    },
  }

  return (
    <AuthSplitLayout
      title="Create account"
      subtitle="Register to browse dentists and manage your appointments."
      footerText="Already have an account?"
      footerLinkText="Sign in here"
      footerHref="/login"
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <label style={labelStyle}>Full Name</label>
          <input style={inputStyle} placeholder="Your full name" value={name}
            onChange={(e) => setName(e.target.value)} {...focusHandlers} required />
        </div>
        <div>
          <label style={labelStyle}>Telephone</label>
          <input style={inputStyle} placeholder="Your phone number" value={telephone}
            onChange={(e) => setTelephone(e.target.value)} {...focusHandlers} required />
        </div>
        <div>
          <label style={labelStyle}>Email address</label>
          <input style={inputStyle} type="email" placeholder="you@example.com" value={email}
            onChange={(e) => setEmail(e.target.value)} {...focusHandlers} required />
        </div>
        <div>
          <label style={labelStyle}>Password</label>
          <input style={inputStyle} type="password" placeholder="Create a password" value={password}
            onChange={(e) => setPassword(e.target.value)} {...focusHandlers} required />
        </div>

        {error && (
          <div style={{
            padding: '11px 14px', borderRadius: 10,
            background: '#fee2e2', border: '1px solid #fecaca',
            fontSize: 13, color: '#dc2626',
          }}>
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%', padding: '14px',
            borderRadius: 12, fontSize: 15, fontWeight: 600,
            background: loading ? 'rgba(200,169,110,0.5)' : 'linear-gradient(135deg, #c8a96e, #a8893e)',
            border: 'none', color: '#fff',
            cursor: loading ? 'not-allowed' : 'pointer',
            boxShadow: loading ? 'none' : '0 4px 20px rgba(200,169,110,0.40)',
            letterSpacing: '-0.01em', marginTop: 4,
          }}
        >
          {loading ? 'Creating account...' : 'Create Account'}
        </button>
      </form>
    </AuthSplitLayout>
  )
}
