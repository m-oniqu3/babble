"use client";

import { type Ratings } from "@/src/types/search";
import ReactStars from "react-rating-star-with-type";

type Props = {
  ratings: Ratings | undefined;
  size?: number;
};

function BookRatings({ ratings, size = 25 }: Props) {
  if (!ratings) return null;

  return (
    <div className="my-4 flex flex-col items-center gap-2 sm:items-start">
      <ReactStars
        value={ratings?.summary?.average || 0}
        count={5}
        size={size}
        activeColor="black"
        inactiveColor="black"
        // activeColor="#3f3f46"
      />

      <p className="text-xs flex items-center justify-center gap-2 text-zinc-700 sm:text-sm">
        <span>{ratings?.summary?.average?.toFixed(2) || 0} ratings</span>
        <span>{"\u00B7"}</span>
        <span>{ratings?.summary?.count || 0} reviews</span>
      </p>
    </div>
  );
}

export default BookRatings;
