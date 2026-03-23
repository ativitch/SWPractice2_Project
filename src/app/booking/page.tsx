'use client'

import { FormEvent, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { getDentists } from '@/lib/dentists'
import { createBooking } from '@/lib/bookings'
import type { Dentist } from '@/interface'
import { useAppSelector } from '@/redux/hooks'

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
    if (!isLoggedIn || !token) {
      router.push('/login')
      return
    }

    const loadDentists = async () => {
      try {
        const res = await getDentists(token)
        setDentists(res.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load dentists')
      }
    }

    loadDentists()
  }, [isLoggedIn, token, router])

  useEffect(() => {
    const selectedDentist = searchParams.get('dentist')
    if (selectedDentist) {
      setDentist(selectedDentist)
    }
  }, [searchParams])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!token) return

    setError('')
    setSuccess('')
    setLoading(true)

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
    <main className="min-h-[calc(100vh-110px)] bg-[linear-gradient(135deg,#eef2ff_0%,#e2e8f0_35%,#f8fafc_100%)] px-4 py-6 sm:px-6 lg:px-10">
  <section className="mx-auto w-full max-w-[1600px] border border-slate-300 bg-white p-6 shadow-lg sm:p-8">
        <h1 className="mb-6 text-2xl font-bold text-slate-900">
          Create Booking
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block font-medium text-slate-700">
              Appointment Date and Time
            </label>
            <input
              type="datetime-local"
              className="w-full border border-slate-300 px-3 py-3 outline-none"
              value={bookingDate}
              onChange={(e) => setBookingDate(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="mb-2 block font-medium text-slate-700">
              Select Dentist
            </label>
            <select
              className="w-full border border-slate-300 px-3 py-3 outline-none"
              value={dentist}
              onChange={(e) => setDentist(e.target.value)}
              required
            >
              <option value="">Select dentist</option>
              {dentists.map((d) => (
                <option key={d._id} value={d._id}>
                  {d.name} - {d.areaOfExpertise}
                </option>
              ))}
            </select>
          </div>

          {error && <p className="text-red-600">{error}</p>}
          {success && <p className="text-green-600">{success}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full border border-slate-300 bg-slate-900 px-4 py-3 font-semibold text-white transition hover:bg-slate-800"
          >
            {loading ? 'Submitting...' : 'Book Now'}
          </button>
        </form>
      </section>
    </main>
  )
}