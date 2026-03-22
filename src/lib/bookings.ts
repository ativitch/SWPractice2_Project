import { apiDelete, apiGet, apiPost, apiPut } from './api'
import type { BookingResponse, BookingsResponse } from '../interface'

export async function createBooking(
  body: { bookingDate: string; dentist: string },
  token: string
) {
  return apiPost<BookingResponse>('/bookings', body, token)
}

export async function getMyBooking(token: string) {
  return apiGet<BookingResponse>('/bookings/me', token)
}

export async function updateMyBooking(
  body: { bookingDate: string; dentist: string },
  token: string
) {
  return apiPut<BookingResponse>('/bookings/me', body, token)
}

export async function deleteMyBooking(token: string) {
  return apiDelete<{ success: boolean }>('/bookings/me', token)
}

export async function getAllBookings(token: string) {
  return apiGet<BookingsResponse>('/bookings', token)
}

export async function updateBookingById(
  id: string,
  body: { bookingDate: string; dentist: string },
  token: string
) {
  return apiPut<BookingResponse>(`/bookings/${id}`, body, token)
}

export async function deleteBookingById(id: string, token: string) {
  return apiDelete<{ success: boolean }>(`/bookings/${id}`, token)
}