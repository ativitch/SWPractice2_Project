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

    const confirmed = window.confirm('Are you sure you want to delete this booking?')
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
    <main className="min-h-screen px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/70 sm:p-10">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-2xl">
              <span className="rounded-full bg-violet-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-violet-700">
                Admin panel
              </span>
              <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
                Manage all bookings from one polished dashboard.
              </h1>
              <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
                Review every appointment, update dentist and time details, and remove bookings when needed.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm text-slate-500">Total bookings</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {bookings.length}
                </p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm text-slate-500">Selected</p>
                <p className="mt-2 text-lg font-bold text-slate-900">
                  {selectedBooking ? 'Editing booking' : 'No selection'}
                </p>
              </div>
            </div>
          </div>
        </section>

        {error && (
          <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {success}
          </div>
        )}

        <div className="grid gap-8 xl:grid-cols-[360px_1fr]">
          <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 sm:p-7 xl:sticky xl:top-28 xl:h-fit">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-violet-700">
                  Booking editor
                </p>
                <h2 className="mt-2 text-2xl font-bold text-slate-900">
                  {selectedBooking ? 'Edit booking' : 'Select a booking'}
                </h2>
              </div>
              <button
                onClick={() => void loadData()}
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                Refresh
              </button>
            </div>

            {selectedBooking ? (
              <div className="mt-8 space-y-5">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                  Editing booking ID: <span className="font-semibold text-slate-900">{selectedBooking._id}</span>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Booking Date and Time
                  </label>
                  <input
                    type="datetime-local"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 outline-none focus:border-violet-300 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Select Dentist
                  </label>
                  <select
                    value={dentistId}
                    onChange={(e) => setDentistId(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 outline-none focus:border-violet-300 focus:bg-white"
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
                    className="w-full rounded-2xl bg-slate-900 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitting ? 'Saving...' : 'Save changes'}
                  </button>

                  <button
                    onClick={handleCancelEdit}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3.5 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-8 rounded-[28px] border border-dashed border-slate-200 bg-slate-50 px-5 py-12 text-center text-sm leading-7 text-slate-600">
                Pick a booking from the right side to edit its dentist and appointment time here.
              </div>
            )}
          </section>

          <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 sm:p-8">
            <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-violet-700">
                  Booking records
                </p>
                <h2 className="mt-2 text-2xl font-bold text-slate-900">
                  All booking details
                </h2>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  type="text"
                  placeholder="Search booking, patient, dentist, or expertise"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full min-w-[260px] rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-violet-300 focus:bg-white"
                />
                <button
                  onClick={() => router.push('/admin/dentists')}
                  className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                >
                  View admin dentists
                </button>
              </div>
            </div>

            {loading ? (
              <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 px-6 py-16 text-center text-slate-600">
                Loading bookings...
              </div>
            ) : filteredBookings.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 px-6 py-16 text-center text-slate-600">
                No booking found.
              </div>
            ) : (
              <div className="space-y-4">
                {filteredBookings.map((booking) => {
                  const userInfo = getUserInfo(booking.user)
                  const dentistInfo = getDentistInfo(booking.dentist)
                  const isSelected = selectedBooking?._id === booking._id

                  return (
                    <div
                      key={booking._id}
                      className={`rounded-[28px] border p-6 shadow-lg transition ${
                        isSelected
                          ? 'border-violet-200 bg-violet-50/60 shadow-violet-100/60'
                          : 'border-slate-200 bg-slate-50/70 shadow-slate-200/40'
                      }`}
                    >
                      <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                        <div className="grid flex-1 gap-4 md:grid-cols-2">
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                              Booking ID
                            </p>
                            <p className="mt-2 break-all text-sm font-semibold text-slate-900">
                              {booking._id}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                              Patient
                            </p>
                            <p className="mt-2 text-sm font-semibold text-slate-900">
                              {userInfo.name}
                            </p>
                            <p className="text-sm text-slate-600">{userInfo.email}</p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                              Appointment time
                            </p>
                            <p className="mt-2 text-sm font-semibold text-slate-900">
                              {formatDisplayDate(booking.bookingDate)}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                              Dentist
                            </p>
                            <p className="mt-2 text-sm font-semibold text-slate-900">
                              {dentistInfo.name}
                            </p>
                            <p className="text-sm text-slate-600">
                              {dentistInfo.areaOfExpertise} · {dentistInfo.yearsOfExperience} years
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row xl:w-[220px] xl:flex-col">
                          <button
                            onClick={() => handleSelectBooking(booking)}
                            className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 hover:-translate-y-0.5 hover:bg-slate-800"
                          >
                            Edit booking
                          </button>
                          <button
                            onClick={() => void handleDeleteBooking(booking._id)}
                            disabled={deletingId === booking._id}
                            className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {deletingId === booking._id ? 'Deleting...' : 'Delete booking'}
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
