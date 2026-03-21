import Image from "next/image";
import Link from "next/link";
import TopMenuItem from "./TopMenuItem";

export default function TopMenu() {
  return (
    <div className="sticky top-0 z-50 w-full bg-white shadow-md">
      <div className="flex h-16 w-full items-center justify-between px-6">
        <div>
          <Link
            href="/api/auth/signin"
            className="rounded-full border border-amber-600 px-4 py-2 text-sm font-semibold text-amber-700 hover:bg-amber-600 hover:text-white"
          >
            Sign-In
          </Link>
        </div>

        <div className="ml-auto flex items-center gap-6">
          <TopMenuItem title="Booking" pageRef="/booking" />
          <TopMenuItem title="My Booking" pageRef="/mybooking" />
          <Link href="/">
            <Image
              src="/img/logo.png"
              alt="logo"
              width={42}
              height={42}
              className="rounded-full"
            />
          </Link>
        </div>
      </div>
    </div>
  );
}