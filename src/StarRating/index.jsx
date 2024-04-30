import React from "react";
import { StarRating } from "./StarRating";

import "./styles.css";

export default function App() {
  return (
    <div>
      <StarRating max={5} />
    </div>
  );
}
