'use client'

import { FormEvent, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getAllBookings, updateBookingById } from '@/lib/bookings'
import { getDentists } from '@/lib/dentists'
import type { Booking, Dentist, User } from '@/interface'
import { useAppSelector } from '@/redux/hooks'

export default function AdminEditBookingsPage() {
  const router = useRouter()
  const { token, isLoggedIn, user } = useAppSelector((state) => state.auth)

  const [bookings, setBookings] = useState<Booking[]>([])
  const [dentists, setDentists] = useState<Dentist[]>([])
  const [search, setSearch] = useState('')
  const [selectedBookingId, setSelectedBookingId] = useState('')
  const [bookingDate, setBookingDate] = useState('')
  const [dentist, setDentist] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const loadData = async () => {
    if (!token) return

    try {
      const [bookingRes, dentistRes] = await Promise.all([
        getAllBookings(token),
        getDentists(token),
      ])

      setBookings(bookingRes.data)
      setDentists(dentistRes.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!isLoggedIn || !token) {
      router.push('/login')
      return
    }

    if (user?.role !== 'admin') {
      router.push('/')
      return
    }

    loadData()
  }, [isLoggedIn, token, user, router])

  const filteredBookings = useMemo(() => {
    const keyword = search.toLowerCase().trim()

    return bookings.filter((booking) => {
      const bookingUser =
        booking.user && typeof booking.user !== 'string'
          ? (booking.user as User)
          : null

      const bookingDentist =
        booking.dentist && typeof booking.dentist !== 'string'
          ? (booking.dentist as Dentist)
          : null

      if (!keyword) return true

      return (
        bookingUser?.name?.toLowerCase().includes(keyword) ||
        bookingUser?.email?.toLowerCase().includes(keyword) ||
        bookingDentist?.name?.toLowerCase().includes(keyword) ||
        false
      )
    })
  }, [bookings, search])

  const handleSelectBooking = (booking: Booking) => {
    setSelectedBookingId(booking._id)
    setError('')
    setSuccess('')

    const bookingDentist =
      booking.dentist && typeof booking.dentist !== 'string'
        ? (booking.dentist as Dentist)
        : null

    setBookingDate(new Date(booking.bookingDate).toISOString().slice(0, 16))
    setDentist(bookingDentist?._id || '')
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!token || !selectedBookingId) return

    setError('')
    setSuccess('')
    setSubmitting(true)

    try {
      await updateBookingById(
        selectedBookingId,
        {
          bookingDate,
          dentist,
        },
        token
      )

      setSuccess('Booking updated successfully')
      await loadData()
      router.push('/admin/bookings')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#efefef] px-6 py-10">
      <div className="mx-auto max-w-7xl border border-slate-300 bg-white p-8 shadow-lg">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <div className="mb-6 flex items-center gap-4">
              <div className="h-5 w-5 border border-slate-500" />
              <input
                type="text"
                placeholder="Search booking"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full max-w-xs border border-slate-500 px-4 py-2 outline-none"
              />
            </div>

            <div className="border border-slate-300 bg-slate-50 p-6">
              <h2 className="mb-6 text-2xl font-bold text-slate-900">
                Select Booking to Edit
              </h2>

              {loading && <p>Loading...</p>}
              {error && !selectedBookingId && <p className="text-red-600">{error}</p>}

              <div className="space-y-4">
                {filteredBookings.map((booking) => {
                  const bookingUser =
                    booking.user && typeof booking.user !== 'string'
                      ? (booking.user as User)
                      : null

                  const bookingDentist =
                    booking.dentist && typeof booking.dentist !== 'string'
                      ? (booking.dentist as Dentist)
                      : null

                  const isSelected = selectedBookingId === booking._id

                  return (
                    <div
                      key={booking._id}
                      className={`border p-4 ${
                        isSelected
                          ? 'border-slate-900 bg-slate-100'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      <p>
                        <span className="font-semibold">User:</span>{' '}
                        {bookingUser?.name || '-'}
                      </p>
                      <p>
                        <span className="font-semibold">Email:</span>{' '}
                        {bookingUser?.email || '-'}
                      </p>
                      <p>
                        <span className="font-semibold">Dentist:</span>{' '}
                        {bookingDentist?.name || 'Unknown dentist'}
                      </p>
                      <p>
                        <span className="font-semibold">Date:</span>{' '}
                        {new Date(booking.bookingDate).toLocaleString()}
                      </p>

                      <button
                        onClick={() => handleSelectBooking(booking)}
                        className="mt-4 border border-slate-300 bg-slate-900 px-4 py-2 font-semibold text-white transition hover:bg-slate-800"
                      >
                        Edit this booking
                      </button>
                    </div>
                  )
                })}
              </div>

              {!loading && !error && filteredBookings.length === 0 && (
                <p className="text-slate-600">No booking found.</p>
              )}
            </div>
          </div>

          <div className="border border-slate-300 bg-white p-6">
            <h2 className="mb-6 text-2xl font-bold text-slate-900">
              Update Booking
            </h2>

            {!selectedBookingId ? (
              <p className="text-slate-600">
                Select a booking from the left panel to edit it.
              </p>
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

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="border border-slate-300 bg-slate-900 px-5 py-3 font-semibold text-white transition hover:bg-slate-800"
                  >
                    {submitting ? 'Updating...' : 'Update Booking'}
                  </button>

                  <button
                    type="button"
                    onClick={() => router.push('/admin/bookings')}
                    className="border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-800 transition hover:bg-slate-100"
                  >
                    Back
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}