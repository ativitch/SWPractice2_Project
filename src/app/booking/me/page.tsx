'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { deleteMyBooking, getMyBooking } from '@/lib/bookings'
import type { Booking, Dentist } from '@/interface'
import { useAppSelector } from '@/redux/hooks'

export default function MyBookingPage() {
  const router = useRouter()
  const { token, isLoggedIn } = useAppSelector((state) => state.auth)

  const [booking, setBooking] = useState<Booking | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isLoggedIn || !token) {
      router.push('/login')
      return
    }

    const loadBooking = async () => {
      try {
        const res = await getMyBooking(token)
        setBooking(res.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'No booking found')
      } finally {
        setLoading(false)
      }
    }

    loadBooking()
  }, [isLoggedIn, token, router])

  const handleDelete = async () => {
    if (!token) return

    try {
      await deleteMyBooking(token)
      setBooking(null)
      setError('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed')
    }
  }

  const dentist =
    booking?.dentist && typeof booking.dentist !== 'string'
      ? (booking.dentist as Dentist)
      : null

  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <div className="mx-auto max-w-5xl border border-slate-300 bg-white p-8 shadow">
        <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
          <div className="space-y-4">
            <button
              onClick={() => router.push('/booking')}
              className="w-full border border-slate-300 bg-slate-900 px-4 py-3 font-semibold text-white transition hover:bg-slate-800"
            >
              Add booking
            </button>

            <button
              onClick={() => router.push('/booking')}
              className="w-full border border-slate-300 bg-white px-4 py-3 font-semibold text-slate-800 transition hover:bg-slate-100"
            >
              Update booking
            </button>

            <button
              onClick={handleDelete}
              className="w-full border border-slate-300 bg-white px-4 py-3 font-semibold text-slate-800 transition hover:bg-slate-100"
            >
              Delete booking
            </button>
          </div>

          <div className="flex min-h-[420px] items-center justify-center border border-slate-300 bg-slate-50 p-8">
            {loading ? (
              <p className="text-slate-600">Loading...</p>
            ) : error ? (
              <p className="text-red-600">{error}</p>
            ) : booking ? (
              <div className="w-full max-w-lg space-y-4 text-slate-800">
                <h2 className="text-2xl font-bold">My Booking Detail</h2>

                <p>
                  <span className="font-semibold">Booking ID:</span> {booking._id}
                </p>

                <p>
                  <span className="font-semibold">Booking Date:</span>{' '}
                  {new Date(booking.bookingDate).toLocaleString()}
                </p>

                <p>
                  <span className="font-semibold">Dentist:</span> {dentist?.name || '-'}
                </p>

                <p>
                  <span className="font-semibold">Expertise:</span>{' '}
                  {dentist?.areaOfExpertise || '-'}
                </p>

                <p>
                  <span className="font-semibold">Experience:</span>{' '}
                  {dentist?.yearsOfExperience ?? '-'} years
                </p>
              </div>
            ) : (
              <p className="text-slate-600">No booking found.</p>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}