"use client";

import Image from "next/image";
import Link from "next/link";
import Rating from "@mui/material/Rating";
import InteractiveCard from "./InteractiveCard";

type CardProps = {
  vid: string;
  venueName: string;
  imgSrc: string;
  rating?: number;
  onRatingChange?: (venueName: string, rating: number) => void;
};

export default function Card({
  vid,
  venueName,
  imgSrc,
  rating,
  onRatingChange,
}: CardProps) {
  return (
    <InteractiveCard>
      <Link href={`/venue/${vid}`} className="block h-full w-full">
        <div className="relative h-[70%] w-full">
          <Image
            src={imgSrc}
            alt="Venue Picture"
            fill
            className="object-cover"
          />
        </div>

        <div className="h-[30%] w-full bg-white p-[10px]">
          <div className="mb-2 text-[16px] font-semibold text-black">
            {venueName}
          </div>
        </div>
      </Link>

      {onRatingChange !== undefined && rating !== undefined ? (
        <div
          className="flex h-[18%] items-center bg-white px-[10px]"
          onClick={(e) => e.stopPropagation()}
        >
          <Rating
            id={`${venueName} Rating`}
            name={`${venueName} Rating`}
            data-testid={`${venueName} Rating`}
            value={rating}
            onChange={(_, newValue) => {
              onRatingChange(venueName, newValue ?? 0);
            }}
          />
        </div>
      ) : null}
    </InteractiveCard>
  );
}