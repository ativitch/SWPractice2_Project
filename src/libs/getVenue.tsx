import { VenueDetailJson } from "../../interface"

export default async function getVenue(vid: string): Promise<VenueDetailJson> {
  const response = await fetch(
    `https://a08-venue-explorer-backend.vercel.app/api/v1/venues/${vid}`,
    { cache: "no-store" }
  )

  if (!response.ok) {
    throw new Error("Failed to fetch venue")
  }

  return await response.json()
}