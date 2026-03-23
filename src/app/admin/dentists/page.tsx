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
  const totalExperience = dentists.reduce(
    (sum, dentist) => sum + dentist.yearsOfExperience,
    0
  )
  const averageExperience =
    totalDentists > 0 ? (totalExperience / totalDentists).toFixed(1) : '0.0'

  return (
   <main className="min-h-[calc(100vh-110px)] bg-[linear-gradient(135deg,#eef2ff_0%,#e2e8f0_35%,#f8fafc_100%)] px-4 py-6 sm:px-6 lg:px-10">
  <section className="mx-auto w-full max-w-[1600px] border border-slate-300 bg-white p-6 shadow-lg sm:p-8">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
              Admin Panel
            </p>
            <h1 className="text-3xl font-bold text-slate-900">
              Dentist Directory
            </h1>
            <p className="mt-2 text-slate-600">
              View all dentists in the system and navigate to booking
              management.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              onClick={() => router.push('/admin/bookings')}
              className="border border-slate-300 bg-slate-900 px-5 py-3 font-semibold text-white transition hover:bg-slate-800"
            >
              Go to Admin Bookings
            </button>

            <button
              onClick={() => router.push('/booking')}
              className="border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-800 transition hover:bg-slate-100"
            >
              Go to Booking Form
            </button>
          </div>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <div className="border border-slate-300 bg-slate-50 p-5">
            <p className="text-sm text-slate-500">Total Dentists</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">
              {totalDentists}
            </p>
          </div>

          <div className="border border-slate-300 bg-slate-50 p-5">
            <p className="text-sm text-slate-500">Total Experience</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">
              {totalExperience} yrs
            </p>
          </div>

          <div className="border border-slate-300 bg-slate-50 p-5">
            <p className="text-sm text-slate-500">Average Experience</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">
              {averageExperience} yrs
            </p>
          </div>
        </div>

        <div className="mb-6 flex items-center gap-4">
          <div className="h-5 w-5 border border-slate-500" />
          <input
            type="text"
            placeholder="Search by name or expertise"
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

        <div className="border border-slate-300 bg-slate-50 p-8">
          <h2 className="mb-6 text-2xl font-bold text-slate-900">
            All Dentists
          </h2>

          {loading ? (
            <p className="text-slate-600">Loading dentists...</p>
          ) : filteredDentists.length === 0 ? (
            <p className="text-slate-600">No dentist found.</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredDentists.map((dentist) => (
                <div
                  key={dentist._id}
                  className="border border-slate-300 bg-white p-5 shadow-sm"
                >
                  <h3 className="text-lg font-semibold text-slate-900">
                    {dentist.name}
                  </h3>

                  <p className="mt-2 text-slate-700">
                    <span className="font-medium">Expertise:</span>{' '}
                    {dentist.areaOfExpertise}
                  </p>

                  <p className="text-slate-700">
                    <span className="font-medium">Experience:</span>{' '}
                    {dentist.yearsOfExperience} years
                  </p>

                  <p className="mt-3 break-all text-xs text-slate-500">
                    ID: {dentist._id}
                  </p>

                  <div className="mt-5 flex gap-3">
                    <button
                      onClick={() =>
                        router.push(`/booking?dentist=${dentist._id}`)
                      }
                      className="flex-1 border border-slate-300 bg-slate-900 px-4 py-2 font-semibold text-white transition hover:bg-slate-800"
                    >
                      Book
                    </button>

                    <button
                      onClick={() => router.push('/admin/bookings')}
                      className="flex-1 border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-800 transition hover:bg-slate-100"
                    >
                      Manage
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}