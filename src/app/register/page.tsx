'use client'

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

    if (telephone.length < 10) {
      setError('Telephone number must be at least 10 digits')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    try {
      await registerUser({ name, telephone, email, password })
      alert("Registration Successful!")
      router.push('/login')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Register failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <div className="mx-auto max-w-md rounded-xl bg-white p-8 shadow">
        <h1 className="mb-6 text-2xl font-bold">Register</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="w-full rounded border p-3"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            className="w-full rounded border p-3"
            placeholder="Telephone"
            value={telephone}
            onChange={(e) => setTelephone(e.target.value)}
            required
          />
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
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
      </div>
    </main>
  )
}