'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Booking, Dentist, User } from '@/interface'
import {
  deleteBookingById,
  getAllBookings,
  updateBookingById,
} from '@/lib/bookings'
import { getDentists } from '@/lib/dentists'
import { useAppSelector } from '@/redux/hooks'

function formatForDateTimeInput(dateString: string) {
  const date = new Date(dateString)
  const offset = date.getTimezoneOffset()
  const localDate = new Date(date.getTime() - offset * 60 * 1000)
  return localDate.toISOString().slice(0, 16)
}

function formatDisplayDate(dateString: string) {
  return new Date(dateString).toLocaleString()
}

function getUserInfo(user: Booking['user']) {
  if (typeof user === 'string') {
    return {
      name: user,
      email: '-',
    }
  }

  const bookingUser = user as User
  return {
    name: bookingUser.name,
    email: bookingUser.email,
  }
}

function getDentistInfo(dentist: Booking['dentist']) {
  if (typeof dentist === 'string') {
    return {
      id: dentist,
      name: dentist,
      areaOfExpertise: '-',
      yearsOfExperience: '-',
    }
  }

  const bookingDentist = dentist as Dentist
  return {
    id: bookingDentist._id,
    name: bookingDentist.name,
    areaOfExpertise: bookingDentist.areaOfExpertise,
    yearsOfExperience: bookingDentist.yearsOfExperience,
  }
}

export default function AdminBookingsPage() {
  const router = useRouter()
  const { token, isLoggedIn, user } = useAppSelector((state) => state.auth)

  const [bookings, setBookings] = useState<Booking[]>([])
  const [dentists, setDentists] = useState<Dentist[]>([])
  const [search, setSearch] = useState('')

  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [bookingDate, setBookingDate] = useState('')
  const [dentistId, setDentistId] = useState('')

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const loadData = useCallback(async () => {
    if (!token) return

    setLoading(true)
    setError('')

    try {
      const [bookingsRes, dentistsRes] = await Promise.all([
        getAllBookings(token),
        getDentists(token),
      ])

      setBookings(bookingsRes.data)
      setDentists(dentistsRes.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load bookings')
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    if (!isLoggedIn || !token) {
      router.push('/login')
      return
    }

    if (user?.role !== 'admin') {
      router.push('/dentists')
      return
    }

    void loadData()
  }, [isLoggedIn, token, user, router, loadData])

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const userInfo = getUserInfo(booking.user)
      const dentistInfo = getDentistInfo(booking.dentist)

      const combinedText = [
        booking._id,
        userInfo.name,
        userInfo.email,
        dentistInfo.name,
        dentistInfo.areaOfExpertise,
        formatDisplayDate(booking.bookingDate),
      ]
        .join(' ')
        .toLowerCase()

      return combinedText.includes(search.toLowerCase())
    })
  }, [bookings, search])

  const handleSelectBooking = (booking: Booking) => {
    const dentistInfo = getDentistInfo(booking.dentist)

    setSelectedBooking(booking)
    setBookingDate(formatForDateTimeInput(booking.bookingDate))
    setDentistId(dentistInfo.id)
    setError('')
    setSuccess('')
  }

  const handleCancelEdit = () => {
    setSelectedBooking(null)
    setBookingDate('')
    setDentistId('')
    setError('')
    setSuccess('')
  }

  const handleUpdateBooking = async () => {
    if (!token || !selectedBooking) return

    setSubmitting(true)
    setError('')
    setSuccess('')

    try {
      await updateBookingById(
        selectedBooking._id,
        {
          bookingDate,
          dentist: dentistId,
        },
        token
      )

      setSuccess('Booking updated successfully')
      await loadData()
      handleCancelEdit()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update booking')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteBooking = async (id: string) => {
    if (!token) return

    const confirmed = window.confirm(
      'Are you sure you want to delete this booking?'
    )

    if (!confirmed) return

    setDeletingId(id)
    setError('')
    setSuccess('')

    try {
      await deleteBookingById(id, token)
      setSuccess('Booking deleted successfully')

      if (selectedBooking?._id === id) {
        handleCancelEdit()
      }

      await loadData()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete booking')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <main className="min-h-screen bg-slate-100 px-6 py-10">
      <div className="mx-auto max-w-7xl border border-slate-300 bg-white p-8 shadow-lg">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
              Admin Panel
            </p>
            <h1 className="text-3xl font-bold text-slate-900">
              Manage All Bookings
            </h1>
            <p className="mt-2 text-slate-600">
              View, update, and delete every booking in the system.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              onClick={() => router.push('/admin/dentists')}
              className="border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-800 transition hover:bg-slate-100"
            >
              Go to Admin Dentists
            </button>

            <button
              onClick={() => void loadData()}
              className="border border-slate-300 bg-slate-900 px-5 py-3 font-semibold text-white transition hover:bg-slate-800"
            >
              Refresh
            </button>
          </div>
        </div>

        <div className="mb-6 flex items-center gap-4">
          <div className="h-5 w-5 border border-slate-500" />
          <input
            type="text"
            placeholder="Search by booking id, patient, dentist, or expertise"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-xl border border-slate-500 px-4 py-2 outline-none"
          />
        </div>

        {error && (
          <div className="mb-4 border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 border border-green-200 bg-green-50 px-4 py-3 text-green-700">
            {success}
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
          <section className="border border-slate-300 bg-slate-50 p-6">
            <h2 className="mb-4 text-xl font-bold text-slate-900">
              {selectedBooking ? 'Edit Booking' : 'Booking Editor'}
            </h2>

            {selectedBooking ? (
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block font-medium text-slate-700">
                    Booking Date and Time
                  </label>
                  <input
                    type="datetime-local"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full border border-slate-300 px-3 py-3 outline-none"
                  />
                </div>

                <div>
                  <label className="mb-2 block font-medium text-slate-700">
                    Select Dentist
                  </label>
                  <select
                    value={dentistId}
                    onChange={(e) => setDentistId(e.target.value)}
                    className="w-full border border-slate-300 px-3 py-3 outline-none"
                  >
                    <option value="">Select dentist</option>
                    {dentists.map((dentist) => (
                      <option key={dentist._id} value={dentist._id}>
                        {dentist.name} - {dentist.areaOfExpertise}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-3 pt-2">
                  <button
                    onClick={handleUpdateBooking}
                    disabled={submitting || !bookingDate || !dentistId}
                    className="w-full border border-slate-300 bg-slate-900 px-4 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {submitting ? 'Saving...' : 'Save Changes'}
                  </button>

                  <button
                    onClick={handleCancelEdit}
                    className="w-full border border-slate-300 bg-white px-4 py-3 font-semibold text-slate-800 transition hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex min-h-[260px] items-center justify-center border border-dashed border-slate-300 bg-white p-6 text-center text-slate-500">
                Select a booking from the right side to edit it here.
              </div>
            )}
          </section>

          <section className="border border-slate-300 bg-slate-50 p-6">
            <h2 className="mb-6 text-2xl font-bold text-slate-900">
              All Booking Detail
            </h2>

            {loading ? (
              <p className="text-slate-600">Loading bookings...</p>
            ) : filteredBookings.length === 0 ? (
              <p className="text-slate-600">No booking found.</p>
            ) : (
              <div className="space-y-4">
                {filteredBookings.map((booking) => {
                  const userInfo = getUserInfo(booking.user)
                  const dentistInfo = getDentistInfo(booking.dentist)

                  return (
                    <div
                      key={booking._id}
                      className="border border-slate-300 bg-white p-5 shadow-sm"
                    >
                      <div className="mb-4 flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
                        <div className="space-y-2 text-slate-800">
                          <p>
                            <span className="font-semibold">Booking ID:</span>{' '}
                            {booking._id}
                          </p>
                          <p>
                            <span className="font-semibold">Patient:</span>{' '}
                            {userInfo.name}
                          </p>
                          <p>
                            <span className="font-semibold">Email:</span>{' '}
                            {userInfo.email}
                          </p>
                          <p>
                            <span className="font-semibold">Booking Date:</span>{' '}
                            {formatDisplayDate(booking.bookingDate)}
                          </p>
                          <p>
                            <span className="font-semibold">Dentist:</span>{' '}
                            {dentistInfo.name}
                          </p>
                          <p>
                            <span className="font-semibold">Expertise:</span>{' '}
                            {dentistInfo.areaOfExpertise}
                          </p>
                          <p>
                            <span className="font-semibold">Experience:</span>{' '}
                            {dentistInfo.yearsOfExperience} years
                          </p>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row xl:flex-col">
                          <button
                            onClick={() => handleSelectBooking(booking)}
                            className="border border-slate-300 bg-slate-900 px-4 py-2 font-semibold text-white transition hover:bg-slate-800"
                          >
                            Edit booking
                          </button>

                          <button
                            onClick={() => void handleDeleteBooking(booking._id)}
                            disabled={deletingId === booking._id}
                            className="border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-800 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {deletingId === booking._id
                              ? 'Deleting...'
                              : 'Delete booking'}
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  )
}