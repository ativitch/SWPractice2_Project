"use client";

import { ReactNode, useState } from "react";

type InteractiveCardProps = {
  children: ReactNode;
};

export default function InteractiveCard({ children }: InteractiveCardProps) {
  const [isHover, setIsHover] = useState(false);

  return (
    <div
      className={`w-[220px] h-[300px] rounded-lg overflow-hidden cursor-pointer transition-all duration-200 ${
        isHover ? "shadow-2xl bg-neutral-200 scale-105" : "shadow-lg bg-white"
      }`}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      {children}
    </div>
  );
}