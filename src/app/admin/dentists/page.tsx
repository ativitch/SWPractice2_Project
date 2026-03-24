'use client'

import { FormEvent, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Dentist } from '@/interface'
import {
  createDentist,
  deleteDentist,
  getDentists,
  updateDentist,
} from '@/lib/dentists'
import { useAppSelector } from '@/redux/hooks'

type FormState = {
  name: string
  areaOfExpertise: string
  yearsOfExperience: string
}

const initialForm: FormState = {
  name: '',
  areaOfExpertise: '',
  yearsOfExperience: '',
}

export default function AdminDentistsPage() {
  const router = useRouter()
  const { token, isLoggedIn, user } = useAppSelector((state) => state.auth)

  const [dentists, setDentists] = useState<Dentist[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>(initialForm)

  const loadDentists = async (authToken: string) => {
    try {
      const res = await getDentists(authToken)
      setDentists(res.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dentists')
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
      router.push('/dentists')
      return
    }

    void loadDentists(token)
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
  const expertiseCount = new Set(
    dentists.map((dentist) => dentist.areaOfExpertise)
  ).size

  const resetForm = () => {
    setForm(initialForm)
    setEditingId(null)
    setError('')
    setSuccess('')
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleEdit = (dentist: Dentist) => {
    setEditingId(dentist._id)
    setForm({
      name: dentist.name,
      areaOfExpertise: dentist.areaOfExpertise,
      yearsOfExperience: String(dentist.yearsOfExperience),
    })
    setError('')
    setSuccess('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id: string, name: string) => {
    if (!token) return

    const confirmed = window.confirm(`Delete dentist "${name}" ?`)
    if (!confirmed) return

    try {
      setError('')
      setSuccess('')
      await deleteDentist(id, token)
      setSuccess('Dentist deleted successfully')

      if (editingId === id) {
        resetForm()
      }

      await loadDentists(token)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed')
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!token) return

    setSubmitting(true)
    setError('')
    setSuccess('')

    try {
      const payload = {
        name: form.name.trim(),
        areaOfExpertise: form.areaOfExpertise.trim(),
        yearsOfExperience: Number(form.yearsOfExperience),
      }

      if (
        !payload.name ||
        !payload.areaOfExpertise ||
        Number.isNaN(payload.yearsOfExperience)
      ) {
        throw new Error('Please complete all dentist fields')
      }

      if (editingId) {
        await updateDentist(editingId, payload, token)
        setSuccess('Dentist updated successfully')
      } else {
        await createDentist(payload, token)
        setSuccess('Dentist created successfully')
      }

      resetForm()
      await loadDentists(token)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submit failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1440px] space-y-8">
        <section className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/70 sm:p-10">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-2xl">
              <span className="rounded-full bg-cyan-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-700">
                Admin dentist directory
              </span>
              <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
                Create, update, and remove dentist profiles.
              </h1>
              <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
                Manage dentist data directly from one page, including adding new
                dentists, editing profile details, and deleting entries.
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
                onClick={resetForm}
                className="rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                Add new dentist
              </button>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/50">
            <p className="text-sm text-slate-500">Total dentists</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">
              {totalDentists}
            </p>
          </div>
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/50">
            <p className="text-sm text-slate-500">Specialties</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">
              {expertiseCount}
            </p>
          </div>
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/50">
            <p className="text-sm text-slate-500">Average experience</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">
              {averageExperience} yrs
            </p>
          </div>
        </section>

        <section className="grid gap-8 xl:grid-cols-[420px_1fr]">
          <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 sm:p-8">
            <div className="mb-6">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-700">
                {editingId ? 'Edit dentist' : 'Create dentist'}
              </p>
              <h2 className="mt-2 text-2xl font-bold text-slate-900">
                {editingId ? 'Update dentist profile' : 'Add a new dentist'}
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Fill in the dentist information below.
              </p>
            </div>

            {error && (
              <div className="mb-4 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-4 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Dentist Name
                </label>
                <input
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter dentist name"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-cyan-300 focus:bg-white"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Area of Expertise
                </label>
                <input
                  name="areaOfExpertise"
                  type="text"
                  value={form.areaOfExpertise}
                  onChange={handleChange}
                  placeholder="e.g. Orthodontics"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-cyan-300 focus:bg-white"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Years of Experience
                </label>
                <input
                  name="yearsOfExperience"
                  type="number"
                  min="0"
                  value={form.yearsOfExperience}
                  onChange={handleChange}
                  placeholder="Enter years of experience"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-cyan-300 focus:bg-white"
                  required
                />
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting
                    ? editingId
                      ? 'Updating...'
                      : 'Creating...'
                    : editingId
                    ? 'Update dentist'
                    : 'Create dentist'}
                </button>

                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                >
                  Clear form
                </button>
              </div>
            </form>
          </div>

          <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 sm:p-8">
            <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  All dentists
                </h2>
                <p className="mt-2 text-sm text-slate-600">
                  Search by dentist name, expertise, or experience.
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

            {loading ? (
              <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 px-6 py-16 text-center text-slate-600">
                Loading dentists...
              </div>
            ) : filteredDentists.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 px-6 py-16 text-center text-slate-600">
                No dentist found.
              </div>
            ) : (
              <div className="grid gap-5 md:grid-cols-2">
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
                      Admin can edit or remove this dentist profile directly from
                      the directory.
                    </p>

                    <p className="mt-4 break-all text-xs text-slate-400">
                      ID: {dentist._id}
                    </p>

                    <div className="mt-6 flex flex-wrap gap-3">
                      <button
                        onClick={() => handleEdit(dentist)}
                        className="rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:-translate-y-0.5 hover:bg-slate-800"
                      >
                        Update
                      </button>

                      <button
                        onClick={() => handleDelete(dentist._id, dentist.name)}
                        className="rounded-full border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 hover:bg-red-100"
                      >
                        Delete
                      </button>

                      <button
                        onClick={() =>
                          router.push(`/booking?dentist=${dentist._id}`)
                        }
                        className="rounded-full border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                      >
                        Book
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  )
}