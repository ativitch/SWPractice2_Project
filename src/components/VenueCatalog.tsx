import Card from "./Card";
import { VenueItem, VenueJson } from "../../interface";

export default async function VenueCatalog({
  venuesJson,
}: {
  venuesJson: Promise<VenueJson>;
}) {
  const venueJsonReady = await venuesJson;

  return (
    <>
      <p className="text-center text-xl font-medium text-white">
        Explore {venueJsonReady.count} fabulous venues in our venue catalog
      </p>

      <div className="m-[20px] flex flex-row flex-wrap justify-around gap-6 p-[10px]">
        {venueJsonReady.data.map((venueItem: VenueItem) => (
          <Card
            key={venueItem._id}
            vid={venueItem._id}
            venueName={venueItem.name}
            imgSrc={venueItem.picture}
          />
        ))}
      </div>
    </>
  );
}