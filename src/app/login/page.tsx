'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { loginUser, getMe } from '@/lib/auth'
import { useAppDispatch } from '@/redux/hooks'
import { setCredentials } from '@/redux/features/authSlice'
import AuthSplitLayout from '@/components/AuthSplitLayout'

export default function LoginPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const loginRes = await loginUser({ email, password })
      const meRes = await getMe(loginRes.token)
      dispatch(setCredentials({ token: loginRes.token, user: meRes.data }))
      router.push(meRes.data.role === 'admin' ? '/admin/bookings' : '/')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: '100%', padding: '13px 16px',
    borderRadius: 12, fontSize: 15,
    border: '1.5px solid #e4e1db',
    background: '#f9f8f6', color: '#18160f',
    outline: 'none', transition: 'all 0.15s ease',
  }

  const labelStyle = {
    display: 'block', fontSize: 13, fontWeight: 600,
    color: '#5c5850', marginBottom: 8, letterSpacing: '-0.01em',
  }

  return (
    <AuthSplitLayout
      title="Sign in"
      subtitle="Access your dental booking dashboard."
      footerText="Don't have an account?"
      footerLinkText="Create one here"
      footerHref="/register"
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div>
          <label style={labelStyle}>Email address</label>
          <input
            style={inputStyle}
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={(e) => {
              e.target.style.borderColor = '#c8a96e'
              e.target.style.boxShadow = '0 0 0 3px rgba(200,169,110,0.12)'
              e.target.style.background = '#fff'
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#e4e1db'
              e.target.style.boxShadow = 'none'
              e.target.style.background = '#f9f8f6'
            }}
            required
          />
        </div>

        <div>
          <label style={labelStyle}>Password</label>
          <input
            style={inputStyle}
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={(e) => {
              e.target.style.borderColor = '#c8a96e'
              e.target.style.boxShadow = '0 0 0 3px rgba(200,169,110,0.12)'
              e.target.style.background = '#fff'
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#e4e1db'
              e.target.style.boxShadow = 'none'
              e.target.style.background = '#f9f8f6'
            }}
            required
          />
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
            background: loading
              ? 'rgba(200,169,110,0.5)'
              : 'linear-gradient(135deg, #c8a96e 0%, #a8893e 100%)',
            border: 'none', color: '#fff',
            cursor: loading ? 'not-allowed' : 'pointer',
            boxShadow: loading ? 'none' : '0 4px 20px rgba(200,169,110,0.40)',
            letterSpacing: '-0.01em',
            marginTop: 4,
          }}
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </AuthSplitLayout>
  )
}
