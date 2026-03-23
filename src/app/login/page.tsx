'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { loginUser, getMe } from '@/lib/auth'
import { useAppDispatch } from '@/redux/hooks'
import { setCredentials } from '@/redux/features/authSlice'

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

      dispatch(
        setCredentials({
          token: loginRes.token,
          user: meRes.data,
        })
      )

      if (meRes.data.role === 'admin') {
      router.push('/admin/bookings')
      } else {
      router.push('/dentists')
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <div className="mx-auto max-w-md rounded-xl bg-white p-8 shadow">
        <h1 className="mb-6 text-2xl font-bold">Login</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="w-full rounded border p-3"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="w-full rounded border p-3"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p className="text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded bg-slate-900 p-3 text-white hover:bg-slate-800"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </main>
  )
}