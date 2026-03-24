'use client'

import { FormEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getDentists } from '@/lib/dentists'
import { getMyBooking, updateMyBooking } from '@/lib/bookings'
import type { Booking, Dentist } from '@/interface'
import { useAppSelector } from '@/redux/hooks'
import PageShell from '@/components/PageShell'

export default function EditBookingPage() {
  const router = useRouter()
  const { token, isLoggedIn } = useAppSelector((state) => state.auth)

  const [dentists, setDentists] = useState<Dentist[]>([])
  const [booking, setBooking] = useState<Booking | null>(null)
  const [bookingDate, setBookingDate] = useState('')
  const [dentist, setDentist] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!isLoggedIn || !token) {
      router.push('/login')
      return
    }

    const loadData = async () => {
      try {
        const [dentistRes, bookingRes] = await Promise.all([
          getDentists(token),
          getMyBooking(token),
        ])

        setDentists(dentistRes.data)
        setBooking(bookingRes.data)
        setBookingDate(new Date(bookingRes.data.bookingDate).toISOString().slice(0, 16))

        if (
          bookingRes.data.dentist &&
          typeof bookingRes.data.dentist !== 'string'
        ) {
          setDentist(bookingRes.data.dentist._id)
        } else if (typeof bookingRes.data.dentist === 'string') {
          setDentist(bookingRes.data.dentist)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load booking')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [isLoggedIn, token, router])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!token) return

    setError('')
    setSuccess('')
    setSubmitting(true)

    try {
      await updateMyBooking({ bookingDate, dentist }, token)
      setSuccess('Booking updated successfully')
      router.push('/booking/me')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <PageShell className="bg-slate-100">
      <div className="flex w-full justify-center">
        <div className="w-full max-w-xl border border-slate-300 bg-white p-8 shadow-lg">
          <h1 className="mb-6 text-2xl font-bold text-slate-900">
            Update Booking
          </h1>

          {loading ? (
            <p>Loading...</p>
          ) : error && !booking ? (
            <p className="text-red-600">{error}</p>
          ) : (
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
                disabled={submitting}
                className="w-full border border-slate-300 bg-slate-900 px-4 py-3 font-semibold text-white transition hover:bg-slate-800"
              >
                {submitting ? 'Updating...' : 'Update Booking'}
              </button>
            </form>
          )}
        </div>
      </div>
    </PageShell>
  )
}