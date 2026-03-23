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

    void loadBooking()
  }, [isLoggedIn, token, router])

  const handleDelete = async () => {
    if (!token) return

    const confirmed = window.confirm('Delete your current booking?')
    if (!confirmed) return

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
    <main className="min-h-screen px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[320px_1fr]">
        <aside className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 sm:p-7">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-700">
            Quick actions
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
            My Booking
          </h1>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Manage your booking details and move quickly to other appointment actions.
          </p>

          <div className="mt-8 space-y-3">
            <button
              onClick={() => router.push('/booking')}
              className="w-full rounded-2xl bg-slate-900 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 hover:-translate-y-0.5 hover:bg-slate-800"
            >
              Add booking
            </button>

            <button
                onClick={() => router.push('/booking/edit')}
                className="w-full border border-slate-300 bg-white px-4 py-3 font-semibold text-slate-800 transition hover:bg-slate-100"
            >
                Update booking
            </button>

            <button
              onClick={handleDelete}
              className="w-full rounded-2xl border border-red-100 bg-red-50 px-4 py-3.5 text-sm font-semibold text-red-700 hover:bg-red-100"
            >
              Delete booking
            </button>
          </div>
        </aside>

        <section className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/70 sm:p-10">
          {loading ? (
            <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 px-6 py-16 text-center text-slate-600">
              Loading your booking...
            </div>
          ) : error ? (
            <div className="rounded-3xl border border-red-100 bg-red-50 px-6 py-16 text-center text-red-700">
              {error}
            </div>
          ) : booking ? (
            <div className="space-y-8">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-700">
                    Appointment detail
                  </p>
                  <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
                    Your booking is ready
                  </h2>
                </div>
                <span className="w-fit rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
                  Active booking
                </span>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                    Booking ID
                  </p>
                  <p className="mt-3 break-all text-base font-semibold text-slate-900">
                    {booking._id}
                  </p>
                </div>
                <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                    Appointment time
                  </p>
                  <p className="mt-3 text-base font-semibold text-slate-900">
                    {new Date(booking.bookingDate).toLocaleString()}
                  </p>
                </div>
                <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                    Dentist
                  </p>
                  <p className="mt-3 text-base font-semibold text-slate-900">
                    {dentist?.name || '-'}
                  </p>
                </div>
                <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                    Expertise
                  </p>
                  <p className="mt-3 text-base font-semibold text-slate-900">
                    {dentist?.areaOfExpertise || '-'}
                  </p>
                </div>
              </div>

              <div className="rounded-[28px] border border-sky-100 bg-sky-50 p-6">
                <p className="text-sm font-semibold text-sky-800">
                  Dentist experience
                </p>
                <p className="mt-3 text-base text-slate-700">
                  {dentist?.yearsOfExperience ?? '-'} years of experience
                </p>
              </div>
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 px-6 py-16 text-center text-slate-600">
              No booking found.
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
