import Image from "next/image";
import Link from "next/link";

export default function Banner() {
  return (
    <section className="relative h-[92vh] w-full overflow-hidden">
      <Image
        src="/img/cover.jpg"
        alt="Event venue banner"
        fill
        priority
        className="object-cover"
      />

      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/45 to-black/30" />
      <div className="absolute inset-0 bg-black/20" />

      <div className="relative z-10 flex h-full items-center justify-center px-6">
        <div className="max-w-4xl text-center text-white">
          <p className="mb-4 inline-block rounded-full border border-white/30 bg-white/10 px-4 py-1 text-sm backdrop-blur-sm">
            Premium venue booking experience
          </p>

          <h1 className="text-4xl font-extrabold leading-tight md:text-6xl">
            where every event
            <br />
            finds its venue
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-white/90 md:text-xl">
            Finding the perfect venue has never been easier. Whether it&apos;s a
            wedding, corporate event, or private party, we connect you to the
            perfect place.
          </p>

          <div className="mt-8 flex justify-center">
            <Link
              href="/venue"
              className="rounded-full bg-cyan-500 px-7 py-3 text-base font-semibold text-white shadow-lg transition hover:scale-105 hover:bg-cyan-400"
            >
              Select Venue
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}