'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function MyBookingRedirectPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/booking/me')
  }, [router])

  return null
}