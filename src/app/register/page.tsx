'use client'

import Link from 'next/link'
import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { registerUser } from '@/lib/auth'

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

  return (
    <main className="min-h-screen px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-2xl shadow-slate-200/70 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="bg-[linear-gradient(135deg,#082f49_0%,#0f766e_50%,#0f172a_120%)] px-8 py-10 text-white sm:px-10 lg:px-12">
          <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-100">
            New account
          </span>
          <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">
            Create your dentist booking account.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-8 text-slate-200">
            Register once to explore dentist profiles, create appointments, and
            manage bookings inside a cleaner, modern system.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-white/8 p-5 backdrop-blur-sm">
              <p className="text-sm font-semibold text-white">Quick setup</p>
              <p className="mt-2 text-sm leading-7 text-slate-200">
                Just fill in your basic information and you are ready to start booking.
              </p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/8 p-5 backdrop-blur-sm">
              <p className="text-sm font-semibold text-white">Clean workflow</p>
              <p className="mt-2 text-sm leading-7 text-slate-200">
                Move from registration to login and into the full dentist directory without friction.
              </p>
            </div>
          </div>
        </section>

        <section className="px-8 py-10 sm:px-10 lg:px-12">
          <div className="mx-auto max-w-md">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-teal-700">
              Registration form
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
              Register
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Fill out your details to create your account.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Full name
                </label>
                <input
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 shadow-sm outline-none focus:border-teal-300 focus:bg-white"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Telephone
                </label>
                <input
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 shadow-sm outline-none focus:border-teal-300 focus:bg-white"
                  placeholder="08x-xxx-xxxx"
                  value={telephone}
                  onChange={(e) => setTelephone(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Email
                </label>
                <input
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 shadow-sm outline-none focus:border-teal-300 focus:bg-white"
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
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 shadow-sm outline-none focus:border-teal-300 focus:bg-white"
                  type="password"
                  placeholder="Create a secure password"
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
                {loading ? 'Registering...' : 'Create account'}
              </button>
            </form>

            <p className="mt-6 text-sm text-slate-600">
              Already have an account?{' '}
              <Link href="/login" className="font-semibold text-teal-700 hover:text-teal-800">
                Login here
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}
