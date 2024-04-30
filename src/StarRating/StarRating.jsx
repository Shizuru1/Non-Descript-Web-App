import React from "react";
import { Star } from "./Star";

export const StarRating = () => {
  return (
    <div>
      StarRating: <Star />
      <Star filled={true} />
    </div>
  );
};
