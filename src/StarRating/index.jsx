import React from "react";
import { StarRating } from "./StarRating";

import "./styles.css";

export default function App() {
    return (
        <div>
            <StarRating max={5} filled={0} />
            <StarRating max={22} filled={0} />
            <StarRating max={6} filled={2} />
            <StarRating max={3} filled={4} />
        </div>
    );
}
