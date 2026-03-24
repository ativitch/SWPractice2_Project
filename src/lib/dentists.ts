import { apiDelete, apiGet, apiPost, apiPut } from './api'
import type { DentistResponse, DentistsResponse } from '@/interface'

export async function getDentists(token: string) {
  return apiGet<DentistsResponse>('/dentists', token)
}

export async function getDentistById(id: string, token: string) {
  return apiGet<DentistResponse>(`/dentists/${id}`, token)
}

export async function createDentist(
  body: {
    name: string
    areaOfExpertise: string
    yearsOfExperience: number
  },
  token: string
) {
  return apiPost<DentistResponse>('/dentists', body, token)
}

export async function updateDentist(
  id: string,
  body: {
    name: string
    areaOfExpertise: string
    yearsOfExperience: number
  },
  token: string
) {
  return apiPut<DentistResponse>(`/dentists/${id}`, body, token)
}

export async function deleteDentist(id: string, token: string) {
  return apiDelete<{ success: boolean }>(`/dentists/${id}`, token)
}