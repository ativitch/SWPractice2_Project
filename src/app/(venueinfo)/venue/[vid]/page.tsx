import Image from "next/image";
import getVenue from "@/libs/getVenue";

export default async function VenueDetailPage({
  params,
}: {
  params: Promise<{ vid: string }>;
}) {
  const { vid } = await params;
  const venueDetail = await getVenue(vid);
  const venue = venueDetail.data;

  return (
    <main className="min-h-screen bg-zinc-800 px-6 py-20">
      <div className="mx-auto max-w-5xl rounded-lg bg-white p-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-start">
          <div className="relative h-[260px] w-full md:h-[240px] md:w-[420px] shrink-0 overflow-hidden rounded-lg">
            <Image
              src={venue.picture}
              alt={venue.name}
              fill
              className="object-cover"
            />
          </div>

          <div className="text-black">
            <h1 className="mb-4 text-3xl font-bold">{venue.name}</h1>
            <p>Address: {venue.address}</p>
            <p>District: {venue.district}</p>
            <p>Province: {venue.province}</p>
            <p>Postal Code: {venue.postalcode}</p>
            <p>Tel: {venue.tel}</p>
            <p>Daily Rate: {venue.dailyrate}</p>
          </div>
        </div>
      </div>
    </main>
  );
}