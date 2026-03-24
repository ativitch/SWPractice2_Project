'use client'

import { FormEvent, useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { getDentists } from '@/lib/dentists'
import { createBooking } from '@/lib/bookings'
import type { Dentist } from '@/interface'
import { useAppSelector } from '@/redux/hooks'
import PageShell from '@/components/PageShell'

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

    void loadDentists()
  }, [isLoggedIn, token, router])

  useEffect(() => {
    const selectedDentist = searchParams.get('dentist')
    if (selectedDentist) {
      setDentist(selectedDentist)
    }
  }, [searchParams])

  const selectedDentist = useMemo(
    () => dentists.find((item) => item._id === dentist) ?? null,
    [dentists, dentist]
  )

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
    <PageShell>
      <div className="grid w-full gap-8 lg:grid-cols-[0.92fr_1.08fr]">
        <section className="rounded-[32px] border border-slate-200 bg-[linear-gradient(145deg,#0f172a_0%,#1e293b_60%,#164e63_120%)] p-8 text-white shadow-2xl shadow-slate-900/15 sm:p-10">
          <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-sky-100">
            Booking center
          </span>
          <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">
            Schedule your appointment with confidence.
          </h1>
          <p className="mt-5 text-sm leading-8 text-slate-200 sm:text-base">
            Choose a dentist, pick a date and time, and submit your booking in a cleaner, more polished flow.
          </p>

          <div className="mt-8 rounded-[28px] border border-white/10 bg-white/8 p-6 backdrop-blur-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-100">
              Selected dentist
            </p>
            {selectedDentist ? (
              <div className="mt-4 space-y-3">
                <h2 className="text-2xl font-bold text-white">{selectedDentist.name}</h2>
                <p className="text-sm text-slate-200">
                  Expertise: <span className="font-semibold text-white">{selectedDentist.areaOfExpertise}</span>
                </p>
                <p className="text-sm text-slate-200">
                  Experience: <span className="font-semibold text-white">{selectedDentist.yearsOfExperience} years</span>
                </p>
              </div>
            ) : (
              <p className="mt-4 text-sm leading-7 text-slate-200">
                Select a dentist from the form to preview the appointment details here.
              </p>
            )}
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-white/8 p-5 backdrop-blur-sm">
              <p className="text-sm font-semibold text-white">Step 1</p>
              <p className="mt-2 text-sm leading-7 text-slate-200">
                Choose your preferred appointment date and time.
              </p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/8 p-5 backdrop-blur-sm">
              <p className="text-sm font-semibold text-white">Step 2</p>
              <p className="mt-2 text-sm leading-7 text-slate-200">
                Select a dentist and confirm your booking.
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/70 sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-700">
            Appointment form
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
            Create Booking
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Fill in the information below to create your appointment.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Appointment Date and Time
              </label>
              <input
                type="datetime-local"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 outline-none focus:border-sky-300 focus:bg-white"
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Select Dentist
              </label>
              <select
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 outline-none focus:border-sky-300 focus:bg-white"
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

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 rounded-2xl bg-slate-900 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? 'Submitting...' : 'Book Now'}
              </button>
              <button
                type="button"
                onClick={() => router.push('/booking/me')}
                className="rounded-2xl border border-slate-200 px-5 py-3.5 text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                View my booking
              </button>
            </div>
          </form>
        </section>
      </div>
    </PageShell>
  )
}