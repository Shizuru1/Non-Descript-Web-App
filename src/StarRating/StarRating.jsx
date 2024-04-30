import React, { useState } from "react";
import { Star } from "./Star";

export const StarRating = (props) => {
  const { max, filled } = props;
  var arr = new Array(max).fill(false);
  for (var i = 0; i < filled && i < max; i++) {
    arr[i] = true;
  }
  const [ hovarr, setHovarr ] = useState(arr);
  const [ starr, setStarr ] = useState(hovarr);

  const onChange = () => {
    setStarr(hovarr);
  }

  const onHover = (index) => {
    setHovarr(hovarr.map((val, id) => (id <= index ? val = true: val = false)));
  }

  const onUnhover = () => {
    setHovarr(starr);
  }
  
  return (
    <div>
      StarRating: {hovarr.map((value, index) => (<Star key={index} filled={value} hoverRating={() => onHover(index)} setRating={onChange} persistRating={onUnhover} />))}
    </div>
  );
};
