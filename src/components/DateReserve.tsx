"use client";

import * as React from "react";
import { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

export default function DateReserve({
  value,
  onChange,
}: {
  value: Dayjs | null;
  onChange: (value: Dayjs | null) => void;
}) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label="Reservation Date"
        value={value}
        onChange={onChange}
      />
    </LocalizationProvider>
  );
}