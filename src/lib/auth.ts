import { apiGet, apiPost } from './api'
import type { AuthResponse, MeResponse } from '@/interface'

export async function registerUser(body: {
  name: string
  telephone: string
  email: string
  password: string
}) {
  return apiPost<AuthResponse>('/auth/register', body)
}

export async function loginUser(body: {
  email: string
  password: string
}) {
  return apiPost<AuthResponse>('/auth/login', body)
}

export async function getMe(token: string) {
  return apiGet<MeResponse>('/auth/me', token)
}
export async function logoutUser() {
  return apiGet<{ success: boolean }>('/auth/logout')
}