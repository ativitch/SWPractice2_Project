"use client";

import { useReducer } from "react";
import Card from "./Card";

type VenueItem = {
  vid: string;
  venueName: string;
  imgSrc: string;
};

type StateType = Map<string, number>;

type ActionType =
  | { type: "rate"; venueName: string; rating: number }
  | { type: "remove"; venueName: string };

const mockVenueRepo: VenueItem[] = [
  { vid: "001", venueName: "The Bloom Pavilion", imgSrc: "/img/bloom.jpg" },
  { vid: "002", venueName: "Spark Space", imgSrc: "/img/sparkspace.jpg" },
  { vid: "003", venueName: "The Grand Table", imgSrc: "/img/grandtable.jpg" },
];

const initialState: StateType = new Map([
  ["The Bloom Pavilion", 0],
  ["Spark Space", 0],
  ["The Grand Table", 0],
]);

function ratingReducer(state: StateType, action: ActionType): StateType {
  const newState = new Map(state);

  switch (action.type) {
    case "rate":
      newState.set(action.venueName, action.rating);
      return newState;
    case "remove":
      newState.delete(action.venueName);
      return newState;
    default:
      return state;
  }
}

export default function CardPanel() {
  const [ratingMap, dispatch] = useReducer(ratingReducer, initialState);

  return (
    <div className="m-[20px]">
      <div className="flex flex-row flex-wrap justify-around gap-6 p-[10px]">
        {mockVenueRepo.map((venue) => (
          <Card
            key={venue.vid}
            vid={venue.vid}
            venueName={venue.venueName}
            imgSrc={venue.imgSrc}
            rating={ratingMap.get(venue.venueName) ?? 0}
            onRatingChange={(venueName, rating) =>
              dispatch({ type: "rate", venueName, rating })
            }
          />
        ))}
      </div>

      <div className="mt-4 text-md font-semibold text-white">
        Venue List with Ratings: {ratingMap.size}
      </div>

      {Array.from(ratingMap.entries()).map(([venueName, rating]) => (
        <div
          key={venueName}
          data-testid={venueName}
          className="cursor-pointer text-white"
          onClick={() => dispatch({ type: "remove", venueName })}
        >
          {venueName} : {rating}
        </div>
      ))}
    </div>
  );
}