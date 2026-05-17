import React from "react";
import { Star } from "./Star";

export const StarRating = (props) => {
    const { max, filled, hover, onChange, onHover, onUnhover } = props;
    var arr = new Array(max).fill(0);
    for (var i = 0; i < max; i++) {
        if (i < hover) {
            arr[i] = 2;
        } else if (i < filled) {
            arr[i] = 1;
        }
    }

    return (
        <div>
            {arr.map((value, index) =>
                <Star key={index} filled={value} hoverRating={() => onHover(index)}
                    setRating={() => onChange(index)} persistRating={onUnhover} />)}
        </div>
    );
};
