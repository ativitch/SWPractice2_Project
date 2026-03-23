'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Dentist } from '@/interface'
import { getDentists } from '@/lib/dentists'
import { useAppSelector } from '@/redux/hooks'

export default function AdminDentistsPage() {
  const router = useRouter()
  const { token, isLoggedIn, user } = useAppSelector((state) => state.auth)

  const [dentists, setDentists] = useState<Dentist[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isLoggedIn || !token) {
      router.push('/login')
      return
    }

    if (user?.role !== 'admin') {
      router.push('/dentists')
      return
    }

    const loadDentists = async () => {
      try {
        const res = await getDentists(token)
        setDentists(res.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load dentists')
      } finally {
        setLoading(false)
      }
    }

    void loadDentists()
  }, [isLoggedIn, token, user, router])

  const filteredDentists = useMemo(() => {
    return dentists.filter((dentist) => {
      const text = [
        dentist.name,
        dentist.areaOfExpertise,
        String(dentist.yearsOfExperience),
      ]
        .join(' ')
        .toLowerCase()

      return text.includes(search.toLowerCase())
    })
  }, [dentists, search])

  const totalDentists = dentists.length
  const averageExperience =
    totalDentists > 0
      ? (
          dentists.reduce((sum, dentist) => sum + dentist.yearsOfExperience, 0) /
          totalDentists
        ).toFixed(1)
      : '0.0'
  const expertiseCount = new Set(dentists.map((dentist) => dentist.areaOfExpertise)).size

  return (
    <main className="min-h-screen px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/70 sm:p-10">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-2xl">
              <span className="rounded-full bg-cyan-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-700">
                Admin dentist directory
              </span>
              <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
                Review dentist profiles in a clearer management view.
              </h1>
              <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
                Search dentists, review specialties, and jump to the admin booking dashboard when you need to manage appointments.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => router.push('/admin/bookings')}
                className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:-translate-y-0.5 hover:bg-slate-800"
              >
                Go to admin bookings
              </button>
              <button
                onClick={() => router.push('/booking')}
                className="rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                Go to booking form
              </button>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/50">
            <p className="text-sm text-slate-500">Total dentists</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">{totalDentists}</p>
          </div>
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/50">
            <p className="text-sm text-slate-500">Specialties</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">{expertiseCount}</p>
          </div>
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/50">
            <p className="text-sm text-slate-500">Average experience</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">{averageExperience} yrs</p>
          </div>
        </section>

        <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 sm:p-8">
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">All dentists</h2>
              <p className="mt-2 text-sm text-slate-600">
                Search by dentist name or expertise.
              </p>
            </div>
            <input
              type="text"
              placeholder="Search by name or expertise"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full max-w-md rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-cyan-300 focus:bg-white"
            />
          </div>

          {error && (
            <div className="mb-4 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {loading ? (
            <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 px-6 py-16 text-center text-slate-600">
              Loading dentists...
            </div>
          ) : filteredDentists.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 px-6 py-16 text-center text-slate-600">
              No dentist found.
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredDentists.map((dentist) => (
                <div
                  key={dentist._id}
                  className="rounded-[28px] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] p-6 shadow-lg shadow-slate-200/50"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-700">
                        {dentist.areaOfExpertise}
                      </p>
                      <h3 className="mt-3 text-xl font-bold text-slate-900">
                        {dentist.name}
                      </h3>
                    </div>
                    <div className="rounded-2xl bg-cyan-50 px-3 py-2 text-right">
                      <p className="text-xs text-cyan-700">Experience</p>
                      <p className="text-sm font-bold text-cyan-900">
                        {dentist.yearsOfExperience} yrs
                      </p>
                    </div>
                  </div>

                  <p className="mt-5 text-sm leading-7 text-slate-600">
                    Review this profile or jump directly into booking management for appointment changes.
                  </p>

                  <p className="mt-4 break-all text-xs text-slate-400">
                    ID: {dentist._id}
                  </p>

                  <div className="mt-6 flex gap-3">
                    <button
                      onClick={() => router.push(`/booking?dentist=${dentist._id}`)}
                      className="flex-1 rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:-translate-y-0.5 hover:bg-slate-800"
                    >
                      Book
                    </button>
                    <button
                      onClick={() => router.push('/admin/bookings')}
                      className="flex-1 rounded-full border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                    >
                      Manage
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
