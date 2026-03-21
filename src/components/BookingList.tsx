"use client";

import { removeBooking } from "@/redux/features/bookSlice";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { Button } from "@mui/material";
import { BookingItem } from "../../interface";

export default function BookingList() {
  const dispatch = useAppDispatch();

  const bookItems = useAppSelector(
    (state) => state.bookSlice.bookItems
  ) as BookingItem[];

  if (bookItems.length === 0) {
    return (
      <div className="text-center text-lg text-gray-600">
        No Venue Booking
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {bookItems.map((item: BookingItem, index: number) => (
        <div
          key={index}
          className="rounded-lg border border-gray-300 bg-white p-4 shadow"
        >
          <div>
            <strong>Name:</strong> {item.nameLastname}
          </div>
          <div>
            <strong>Tel:</strong> {item.tel}
          </div>
          <div>
            <strong>Venue:</strong> {item.venue}
          </div>
          <div>
            <strong>Date:</strong> {item.bookDate}
          </div>

          <Button
            variant="outlined"
            color="error"
            sx={{ marginTop: 2 }}
            onClick={() => dispatch(removeBooking(item))}
          >
            Cancel Booking
          </Button>
        </div>
      ))}
    </div>
  );
}