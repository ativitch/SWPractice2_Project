'use client'

import { useEffect, useState } from 'react'
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

    loadDentists()
  }, [isLoggedIn, token, router])

  const filteredDentists = dentists.filter((dentist) =>
    dentist.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <main className="min-h-[calc(100vh-110px)] bg-[linear-gradient(135deg,#eef2ff_0%,#e2e8f0_35%,#f8fafc_100%)] px-4 py-6 sm:px-6 lg:px-10">
  <section className="mx-auto w-full max-w-[1600px] border border-slate-300 bg-white p-6 shadow-lg sm:p-8">
        <div className="mb-6 flex items-center gap-4">
          <div className="h-5 w-5 border border-slate-500" />
          <input
            type="text"
            placeholder="Search dentist"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-xs border border-slate-500 px-4 py-2 outline-none"
          />
        </div>

        <div className="border border-slate-300 bg-slate-50 p-8">
          <div className="w-full">
            <h2 className="mb-6 text-center text-4xl font-bold text-slate-800">
              Dentist List
            </h2>

            {loading && <p>Loading...</p>}
            {error && <p className="text-red-600">{error}</p>}

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
                    Expertise: {dentist.areaOfExpertise}
                  </p>

                  <p className="text-slate-700">
                    Experience: {dentist.yearsOfExperience} years
                  </p>

                  <button
                    onClick={() =>
                      router.push(`/booking?dentist=${dentist._id}`)
                    }
                    className="mt-5 border border-slate-300 bg-slate-900 px-4 py-2 font-semibold text-white transition hover:bg-slate-800"
                  >
                    Book this dentist
                  </button>
                </div>
              ))}
            </div>

            {!loading && !error && filteredDentists.length === 0 && (
              <p className="text-center text-slate-600">No dentist found.</p>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}