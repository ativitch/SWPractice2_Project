"use client";

import DateReserve from "@/components/DateReserve";
import { addBooking } from "@/redux/features/bookSlice";
import { useAppDispatch } from "@/redux/store";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import { useState } from "react";

export default function BookingPage() {
  const dispatch = useAppDispatch();

  const [nameLastname, setNameLastname] = useState("");
  const [tel, setTel] = useState("");
  const [venue, setVenue] = useState("");
  const [bookDate, setBookDate] = useState<Dayjs | null>(dayjs());

  const handleBooking = () => {
    if (!nameLastname || !tel || !venue || !bookDate) return;

    dispatch(
      addBooking({
        nameLastname,
        tel,
        venue,
        bookDate: bookDate.format("YYYY/MM/DD"),
      })
    );
  };

  return (
    <main className="min-h-screen bg-[#f3f0ec]">
      <div className="flex justify-center px-4 py-10">
        <Box
          sx={{
            width: "100%",
            maxWidth: 500,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            backgroundColor: "white",
            padding: 4,
            borderRadius: 3,
            boxShadow: 3,
          }}
        >
          <h1 className="text-2xl font-semibold text-gray-800">
            Venue Booking
          </h1>

          <TextField
            name="Name-Lastname"
            label="Name-Lastname"
            variant="standard"
            fullWidth
            value={nameLastname}
            onChange={(e) => setNameLastname(e.target.value)}
          />

          <TextField
            name="Contact-Number"
            label="Contact-Number"
            variant="standard"
            fullWidth
            value={tel}
            onChange={(e) => setTel(e.target.value)}
          />

          <FormControl fullWidth variant="standard">
            <InputLabel id="venue-label">Venue</InputLabel>
            <Select
              labelId="venue-label"
              id="venue"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              label="Venue"
            >
              <MenuItem value="Bloom">The Bloom Pavilion</MenuItem>
              <MenuItem value="Spark">Spark Space</MenuItem>
              <MenuItem value="GrandTable">The Grand Table</MenuItem>
            </Select>
          </FormControl>

          <DateReserve value={bookDate} onChange={setBookDate} />

          <Button
            name="Book Venue"
            variant="contained"
            onClick={handleBooking}
          >
            Book Venue
          </Button>
        </Box>
      </div>
    </main>
  );
}