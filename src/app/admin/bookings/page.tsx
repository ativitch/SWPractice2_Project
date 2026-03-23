'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { deleteBookingById, getAllBookings } from '@/lib/bookings'
import type { Booking, Dentist, User } from '@/interface'
import { useAppSelector } from '@/redux/hooks'

export default function AdminBookingsPage() {
  const router = useRouter()
  const { token, isLoggedIn, user } = useAppSelector((state) => state.auth)

  const [bookings, setBookings] = useState<Booking[]>([])
  const [search, setSearch] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const loadBookings = async () => {
    if (!token) return

    try {
      const res = await getAllBookings(token)
      setBookings(res.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load bookings')
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

    loadBookings()
  }, [isLoggedIn, token, user, router])

  const handleDelete = async (id: string) => {
    if (!token) return

    try {
      await deleteBookingById(id, token)
      await loadBookings()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed')
    }
  }

  const filteredBookings = useMemo(() => {
    const keyword = search.toLowerCase().trim()

    return bookings.filter((booking) => {
      const bookingUser =
        booking.user && typeof booking.user !== 'string'
          ? (booking.user as User)
          : null

      const dentist =
        booking.dentist && typeof booking.dentist !== 'string'
          ? (booking.dentist as Dentist)
          : null

      if (!keyword) return true

      return (
        bookingUser?.name?.toLowerCase().includes(keyword) ||
        bookingUser?.email?.toLowerCase().includes(keyword) ||
        dentist?.name?.toLowerCase().includes(keyword) ||
        false
      )
    })
  }, [bookings, search])

  return (
    <main className="min-h-screen bg-[#efefef] px-6 py-10">
      <div className="mx-auto max-w-7xl border border-slate-300 bg-white p-8 shadow-lg">
        <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
          <div className="space-y-4">
            <button
              onClick={() => router.push('/booking')}
              className="w-full border border-slate-300 bg-slate-900 px-4 py-3 font-semibold text-white transition hover:bg-slate-800"
            >
              Add booking
            </button>

            <button
              onClick={() => router.push('/admin/bookings/edit')}
              className="w-full border border-slate-300 bg-white px-4 py-3 font-semibold text-slate-800 transition hover:bg-slate-100"
            >
              Update booking
            </button>

            <button
              onClick={() => {
                if (filteredBookings.length > 0) {
                  handleDelete(filteredBookings[0]._id)
                }
              }}
              className="w-full border border-slate-300 bg-white px-4 py-3 font-semibold text-slate-800 transition hover:bg-slate-100"
            >
              Delete booking
            </button>
          </div>

          <div>
            <div className="mb-6 flex items-center gap-4">
              <div className="h-5 w-5 border border-slate-500" />
              <input
                type="text"
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full max-w-xs border border-slate-500 px-4 py-2 outline-none"
              />
            </div>

            <div className="border border-slate-300 bg-slate-50 p-8">
              <div className="w-full">
                <h2 className="mb-6 text-center text-3xl font-bold text-slate-800">
                  All Booking Detail
                </h2>

                {loading && <p>Loading...</p>}
                {error && <p className="text-red-600">{error}</p>}

                <div className="space-y-4">
                  {filteredBookings.map((booking) => {
                    const dentist =
                      booking.dentist && typeof booking.dentist !== 'string'
                        ? (booking.dentist as Dentist)
                        : null

                    const bookingUser =
                      booking.user && typeof booking.user !== 'string'
                        ? (booking.user as User)
                        : null

                    return (
                      <div
                        key={booking._id}
                        className="border border-slate-300 bg-white p-4"
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
                          {dentist?.name || 'Unknown dentist'}
                        </p>
                        <p>
                          <span className="font-semibold">Expertise:</span>{' '}
                          {dentist?.areaOfExpertise || '-'}
                        </p>
                        <p>
                          <span className="font-semibold">Date:</span>{' '}
                          {new Date(booking.bookingDate).toLocaleString()}
                        </p>

                        <div className="mt-3">
                          <button
                            onClick={() => handleDelete(booking._id)}
                            className="border border-slate-300 bg-white px-4 py-2 transition hover:bg-slate-100"
                          >
                            Delete this booking
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {!loading && !error && filteredBookings.length === 0 && (
                  <p className="text-center text-slate-600">No booking found.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
