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

      dispatch(
        setCredentials({
          token: loginRes.token,
          user: meRes.data,
        })
      )

      router.push(meRes.data.role === 'admin' ? '/admin/bookings' : '/')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthSplitLayout
      title="Sign in"
      subtitle="Access your dentist booking dashboard with your email and password."
      footerText="Don’t have an account yet?"
      footerLinkText="Create one here"
      footerHref="/register"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-800">
            Email
          </label>
          <input
            className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:bg-white"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-800">
            Password
          </label>
          <input
            className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:bg-white"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg border border-sky-500 bg-sky-500 px-4 py-3 font-semibold text-white transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? 'Signing in...' : 'Log In'}
        </button>
      </form>
    </AuthSplitLayout>
  )
}