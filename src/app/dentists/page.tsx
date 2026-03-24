'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getDentists } from '@/lib/dentists'
import type { Dentist } from '@/interface'
import { useAppSelector } from '@/redux/hooks'
import PageShell from '@/components/PageShell'

type SortOption =
  | 'name-asc'
  | 'name-desc'
  | 'exp-asc'
  | 'exp-desc'

export default function DentistsPage() {
  const router = useRouter()
  const { token, isLoggedIn } = useAppSelector((state) => state.auth)

  const [dentists, setDentists] = useState<Dentist[]>([])
  const [search, setSearch] = useState('')
  const [expertiseFilter, setExpertiseFilter] = useState('all')
  const [experienceFilter, setExperienceFilter] = useState('all')
  const [sortBy, setSortBy] = useState<SortOption>('name-asc')
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

  const expertiseOptions = useMemo(() => {
    return [...new Set(dentists.map((dentist) => dentist.areaOfExpertise))].sort(
      (a, b) => a.localeCompare(b)
    )
  }, [dentists])

  const filteredDentists = useMemo(() => {
    let result = dentists.filter((dentist) => {
      const matchesSearch = [dentist.name, dentist.areaOfExpertise]
        .join(' ')
        .toLowerCase()
        .includes(search.toLowerCase())

      const matchesExpertise =
        expertiseFilter === 'all' ||
        dentist.areaOfExpertise === expertiseFilter

      const years = dentist.yearsOfExperience
      let matchesExperience = true

      if (experienceFilter === '0-5') {
        matchesExperience = years >= 0 && years <= 5
      } else if (experienceFilter === '6-10') {
        matchesExperience = years >= 6 && years <= 10
      } else if (experienceFilter === '11-15') {
        matchesExperience = years >= 11 && years <= 15
      } else if (experienceFilter === '16+') {
        matchesExperience = years >= 16
      }

      return matchesSearch && matchesExpertise && matchesExperience
    })

    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case 'name-desc':
          return b.name.localeCompare(a.name)
        case 'exp-asc':
          return a.yearsOfExperience - b.yearsOfExperience
        case 'exp-desc':
          return b.yearsOfExperience - a.yearsOfExperience
        case 'name-asc':
        default:
          return a.name.localeCompare(b.name)
      }
    })

    return result
  }, [dentists, search, expertiseFilter, experienceFilter, sortBy])

  return (
    <PageShell>
      <div className="w-full space-y-8">
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
                Browse specialists, compare expertise and experience, then book
                with a cleaner and more flexible directory page.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm text-slate-500">Available dentists</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {filteredDentists.length}
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
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Dentist List</h2>
            <p className="mt-2 text-sm text-slate-600">
              Search, filter, and sort dentists by expertise and years of
              experience.
            </p>
          </div>

          <div className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Search
              </label>
              <input
                type="text"
                placeholder="Search dentist or expertise"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-sky-300 focus:bg-white"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Area of Expertise
              </label>
              <select
                value={expertiseFilter}
                onChange={(e) => setExpertiseFilter(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-sky-300 focus:bg-white"
              >
                <option value="all">All expertise</option>
                {expertiseOptions.map((expertise) => (
                  <option key={expertise} value={expertise}>
                    {expertise}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Years of Experience
              </label>
              <select
                value={experienceFilter}
                onChange={(e) => setExperienceFilter(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-sky-300 focus:bg-white"
              >
                <option value="all">All experience</option>
                <option value="0-5">0 - 5 years</option>
                <option value="6-10">6 - 10 years</option>
                <option value="11-15">11 - 15 years</option>
                <option value="16+">16+ years</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-sky-300 focus:bg-white"
              >
                <option value="name-asc">Name: A to Z</option>
                <option value="name-desc">Name: Z to A</option>
                <option value="exp-asc">Experience: Low to High</option>
                <option value="exp-desc">Experience: High to Low</option>
              </select>
            </div>
          </div>

          {(search ||
            expertiseFilter !== 'all' ||
            experienceFilter !== 'all' ||
            sortBy !== 'name-asc') && (
            <div className="mb-6 flex flex-wrap gap-3">
              <button
                onClick={() => {
                  setSearch('')
                  setExpertiseFilter('all')
                  setExperienceFilter('all')
                  setSortBy('name-asc')
                }}
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                Reset filters
              </button>
            </div>
          )}

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
                    Specialist in{' '}
                    <span className="font-semibold text-slate-900">
                      {dentist.areaOfExpertise}
                    </span>{' '}
                    with a polished booking flow ready for quick appointment
                    creation.
                  </p>

                  <div className="mt-6 flex gap-3">
                    <button
                      onClick={() =>
                        router.push(`/booking?dentist=${dentist._id}`)
                      }
                      className="flex-1 rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 hover:-translate-y-0.5 hover:bg-slate-800"
                    >
                      Book now
                    </button>
                
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && !error && filteredDentists.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-10 text-center text-sm text-slate-600">
              No dentist found for your current filters.
            </div>
          )}
        </section>
      </div>
    </PageShell>
  )
}