import VenueCatalog from "@/components/VenueCatalog";
import getVenues from "@/libs/getVenues";

export default function VenuePage() {
  const venues = getVenues();

  return (
    <main className="bg-zinc-800 min-h-screen py-8">
      <h1 className="mb-6 text-center text-3xl font-bold text-white">
        Select your venue
      </h1>
      <VenueCatalog venuesJson={venues} />
    </main>
  );
}