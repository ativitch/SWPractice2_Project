'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAppSelector } from '@/redux/hooks'
import { getAllBookings, getMyBooking } from '@/lib/bookings'
import type { Booking, Dentist, User } from '@/interface'

export default function HomeBookingSummary() {
  const router = useRouter()
  const { isLoggedIn, token, user } = useAppSelector((state) => state.auth)

  const [myBooking, setMyBooking] = useState<Booking | null>(null)
  const [recentBookings, setRecentBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadData = async () => {
      if (!isLoggedIn || !token || !user) {
        setMyBooking(null)
        setRecentBookings([])
        setError('')
        return
      }

      setLoading(true)
      setError('')

      try {
        if (user.role === 'admin') {
          const res = await getAllBookings(token)
          setRecentBookings(res.data)
        } else {
          try {
            const res = await getMyBooking(token)
            setMyBooking(res.data)
          } catch {
            setMyBooking(null)
          }
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to load booking summary'
        )
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [isLoggedIn, token, user])

  const sortedRecentBookings = useMemo(() => {
    return [...recentBookings]
      .sort(
        (a, b) =>
          new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime()
      )
      .slice(0, 5)
  }, [recentBookings])

  const renderUserBooking = () => {
    if (!myBooking) {
      return (
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-6 py-10 text-center">
          <h3 className="text-2xl font-bold text-slate-900">No booking yet</h3>
          <p className="mt-3 text-base leading-7 text-slate-600">
            You have not created any appointment yet. Start by browsing dentists
            or create a booking now.
          </p>

          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => router.push('/dentists')}
              className="rounded-lg border border-slate-900 bg-slate-900 px-6 py-3 font-semibold text-white transition hover:bg-slate-800"
            >
              Explore Dentists
            </button>

            <button
              onClick={() => router.push('/booking')}
              className="rounded-lg border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-900 transition hover:bg-slate-100"
            >
              Create Booking
            </button>
          </div>
        </div>
      )
    }

    const dentist =
      myBooking.dentist && typeof myBooking.dentist !== 'string'
        ? (myBooking.dentist as Dentist)
        : null

    return (
      <div className="grid gap-6 lg:grid-cols-[1fr_auto]">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-6">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-sky-600">
            My Booking Summary
          </p>

          <h3 className="mt-2 text-3xl font-bold text-slate-900">
            Your current appointment
          </h3>

          <div className="mt-6 space-y-4 text-slate-700">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Dentist
              </p>
              <p className="text-xl font-semibold text-slate-900">
                {dentist?.name || 'Unknown dentist'}
              </p>
            </div>

            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Expertise
              </p>
              <p className="text-lg text-slate-800">
                {dentist?.areaOfExpertise || '-'}
              </p>
            </div>

            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Appointment Date
              </p>
              <p className="text-lg text-slate-800">
                {new Date(myBooking.bookingDate).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => router.push('/booking/me')}
            className="rounded-lg border border-slate-900 bg-slate-900 px-6 py-3 font-semibold text-white transition hover:bg-slate-800"
          >
            View My Booking
          </button>

          <button
            onClick={() => router.push('/booking/edit')}
            className="rounded-lg border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-900 transition hover:bg-slate-100"
          >
            Update Booking
          </button>

          <button
            onClick={() => router.push('/dentists')}
            className="rounded-lg border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-900 transition hover:bg-slate-100"
          >
            Browse Dentists
          </button>
        </div>
      </div>
    )
  }

  const renderAdminBookings = () => {
    return (
      <div>
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-sky-600">
              Admin Overview
            </p>
            <h3 className="mt-2 text-3xl font-bold text-slate-900">
              Recent bookings
            </h3>
            <p className="mt-2 text-base leading-7 text-slate-600">
              A quick overview of the latest booking activity in the system.
            </p>
          </div>

          <button
            onClick={() => router.push('/admin/bookings')}
            className="rounded-lg border border-slate-900 bg-slate-900 px-6 py-3 font-semibold text-white transition hover:bg-slate-800"
          >
            Manage All Bookings
          </button>
        </div>

        {sortedRecentBookings.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-6 py-10 text-center text-slate-600">
            No booking records found.
          </div>
        ) : (
          <div className="max-h-[460px] overflow-y-auto pr-1">
            <div className="space-y-4">
              {sortedRecentBookings.map((booking) => {
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
                    className="grid gap-4 rounded-xl border border-slate-200 bg-slate-50 p-5 lg:grid-cols-[1fr_auto]"
                  >
                    <div className="space-y-2">
                      <p className="text-lg font-semibold text-slate-900">
                        {bookingUser?.name || 'Unknown user'}
                      </p>
                      <p className="text-slate-600">
                        Email: {bookingUser?.email || '-'}
                      </p>
                      <p className="text-slate-600">
                        Dentist: {dentist?.name || 'Unknown dentist'}
                      </p>
                      <p className="text-slate-600">
                        Date: {new Date(booking.bookingDate).toLocaleString()}
                      </p>
                    </div>

                    <div className="flex items-start">
                      <button
                        onClick={() => router.push('/admin/bookings/edit')}
                        className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 font-semibold text-slate-900 transition hover:bg-slate-100"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    )
  }

  if (!isLoggedIn) {
    return (
      <section className="rounded-xl border border-slate-300 bg-white p-6 shadow-lg sm:p-8">
        <h2 className="text-3xl font-bold text-slate-900">
          Access your booking tools
        </h2>
        <p className="mt-3 text-base leading-7 text-slate-600">
          Sign in to view your booking summary, manage appointments, and browse
          dentists in the system.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={() => router.push('/login')}
            className="rounded-lg border border-slate-900 bg-slate-900 px-6 py-3 font-semibold text-white transition hover:bg-slate-800"
          >
            Sign in
          </button>

          <button
            onClick={() => router.push('/register')}
            className="rounded-lg border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-900 transition hover:bg-slate-100"
          >
            Create account
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className="rounded-xl border border-slate-300 bg-white p-6 shadow-lg sm:p-8">
      {loading ? (
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-6 py-10 text-center text-slate-600">
          Loading booking summary...
        </div>
      ) : error ? (
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-6 py-10 text-center text-red-600">
          {error}
        </div>
      ) : user?.role === 'admin' ? (
        renderAdminBookings()
      ) : (
        renderUserBooking()
      )}
    </section>
  )
}