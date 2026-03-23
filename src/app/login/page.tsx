'use client'

import Link from 'next/link'
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
    <main className="min-h-screen px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-2xl shadow-slate-200/70 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="bg-[linear-gradient(135deg,#0f172a_0%,#1d4ed8_120%)] px-8 py-10 text-white sm:px-10 lg:px-12">
          <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-sky-100">
            Welcome back
          </span>
          <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">
            Sign in to your dental dashboard.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-8 text-slate-200">
            Manage appointments, browse dentist profiles, and access the right
            dashboard for your role with a clean and focused experience.
          </p>

          <div className="mt-10 space-y-4">
            <div className="rounded-3xl border border-white/10 bg-white/8 p-5 backdrop-blur-sm">
              <p className="text-sm font-semibold text-white">Patient flow</p>
              <p className="mt-2 text-sm leading-7 text-slate-200">
                Explore dentists, book an appointment, and manage your own booking in one place.
              </p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/8 p-5 backdrop-blur-sm">
              <p className="text-sm font-semibold text-white">Admin flow</p>
              <p className="mt-2 text-sm leading-7 text-slate-200">
                Review all booking records and keep the appointment schedule organized.
              </p>
            </div>
          </div>
        </section>

        <section className="px-8 py-10 sm:px-10 lg:px-12">
          <div className="mx-auto max-w-md">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-700">
              Account access
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
              Login
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Enter your email and password to continue.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Email
                </label>
                <input
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 shadow-sm outline-none focus:border-sky-300 focus:bg-white"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Password
                </label>
                <input
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 shadow-sm outline-none focus:border-sky-300 focus:bg-white"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {error && (
                <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-slate-900 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>

            <p className="mt-6 text-sm text-slate-600">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="font-semibold text-sky-700 hover:text-sky-800">
                Create one here
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}
