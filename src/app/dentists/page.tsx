'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getDentists } from '@/lib/dentists'
import type { Dentist } from '@/interface'
import { useAppSelector } from '@/redux/hooks'

export default function DentistsPage() {
  const router = useRouter()
  const { token, isLoggedIn } = useAppSelector((state) => state.auth)

  const [dentists, setDentists] = useState<Dentist[]>([])
  const [search, setSearch] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

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
      } finally {
        setLoading(false)
      }
    }

    void loadDentists()
  }, [isLoggedIn, token, router])

  const filteredDentists = useMemo(() => {
    return dentists.filter((dentist) =>
      [dentist.name, dentist.areaOfExpertise]
        .join(' ')
        .toLowerCase()
        .includes(search.toLowerCase())
    )
  }, [dentists, search])

  return (
    <main className="min-h-screen px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="overflow-hidden rounded-[32px] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/70 sm:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <span className="rounded-full bg-sky-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">
                Dentist directory
              </span>
              <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
                Find the right dentist for your next appointment.
              </h1>
              <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
                Browse specialists, compare expertise, and jump straight into the
                booking flow with a cleaner card-based layout.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm text-slate-500">Available dentists</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {dentists.length}
                </p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm text-slate-500">Quick action</p>
                <button
                  onClick={() => router.push('/booking/me')}
                  className="mt-3 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                >
                  View my booking
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 sm:p-8">
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Dentist List</h2>
              <p className="mt-2 text-sm text-slate-600">
                Search by dentist name or area of expertise.
              </p>
            </div>
            <input
              type="text"
              placeholder="Search dentist or expertise"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full max-w-md rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-sky-300 focus:bg-white"
            />
          </div>

          {loading && <p className="text-slate-600">Loading dentists...</p>}
          {error && (
            <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {!loading && !error && (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredDentists.map((dentist) => (
                <div
                  key={dentist._id}
                  className="group rounded-[28px] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] p-6 shadow-lg shadow-slate-200/50"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">
                        {dentist.areaOfExpertise}
                      </p>
                      <h3 className="mt-3 text-xl font-bold text-slate-900">
                        {dentist.name}
                      </h3>
                    </div>
                    <div className="rounded-2xl bg-sky-50 px-3 py-2 text-right">
                      <p className="text-xs text-sky-700">Experience</p>
                      <p className="text-sm font-bold text-sky-900">
                        {dentist.yearsOfExperience} yrs
                      </p>
                    </div>
                  </div>

                  <p className="mt-5 text-sm leading-7 text-slate-600">
                    Specialist in <span className="font-semibold text-slate-900">{dentist.areaOfExpertise}</span> with a polished booking flow ready for quick appointment creation.
                  </p>

                  <div className="mt-6 flex gap-3">
                    <button
                      onClick={() => router.push(`/booking?dentist=${dentist._id}`)}
                      className="flex-1 rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 hover:-translate-y-0.5 hover:bg-slate-800"
                    >
                      Book now
                    </button>
                    <button
                      onClick={() => router.push('/booking/me')}
                      className="rounded-full border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                    >
                      My booking
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && !error && filteredDentists.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-10 text-center text-sm text-slate-600">
              No dentist found for your search.
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
