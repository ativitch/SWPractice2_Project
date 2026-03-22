import { apiGet } from './api'
import type { DentistResponse, DentistsResponse } from '@/interface'

export async function getDentists(token: string) {
  return apiGet<DentistsResponse>('/dentists', token)
}

export async function getDentistById(id: string, token: string) {
  return apiGet<DentistResponse>(`/dentists/${id}`, token)
}