export interface User {
  _id: string
  name: string
  telephone: string
  email: string
  role: 'user' | 'admin'
}

export interface Dentist {
  _id: string
  name: string
  areaOfExpertise: string
  yearsOfExperience: number
}

export interface Booking {
  _id: string
  bookingDate: string
  user: User | string
  dentist: Dentist | string
}

export interface AuthResponse {
  success: boolean
  token: string
}

export interface MeResponse {
  success: boolean
  data: User
}

export interface DentistsResponse {
  success: boolean
  count: number
  data: Dentist[]
}

export interface DentistResponse {
  success: boolean
  data: Dentist
}

export interface BookingResponse {
  success: boolean
  data: Booking
}

export interface BookingsResponse {
  success: boolean
  count: number
  data: Booking[]
}