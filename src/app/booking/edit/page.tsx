'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAppSelector } from '@/redux/hooks'
import { getMyBooking, updateMyBooking } from '@/lib/bookings'

export default function EditBookingPage() {
    const router = useRouter()
    const { token, isLoggedIn } = useAppSelector((state) => state.auth)
    const [date, setDate] = useState('')

    useEffect(() => {
        if (!isLoggedIn) router.push('/login')
        const loadOldData = async () => {
            const res = await getMyBooking(token!)
            if (res.data) setDate(res.data.bookingDate.split('T')[0])
        }
        loadOldData()
    }, [isLoggedIn, token])

    const handleUpdate = async () => {
        try {
            await updateMyBooking({ bookingDate: date, dentist: "" }, token!)
            alert("Update Success!")
            router.push('/mybooking')
        } catch (err) { alert("Update Failed") }
    }

    return (
        <main className="p-10">
            <h1 className="text-2xl font-bold mb-5">Edit Your Booking</h1>
            <input type="date" value={date} onChange={(e)=>setDate(e.target.value)} className="border p-2 mr-2" />
            <button onClick={handleUpdate} className="bg-slate-900 text-white px-4 py-2">Confirm Update</button>
        </main>
    )
}