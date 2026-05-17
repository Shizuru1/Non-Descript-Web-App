import React from "react";
import { StarRating } from "./StarRating";

import "./styles.css";

export function EditRating(props) {
    const { star, setStar } = props;

    const incrementRating = () => {
        // increase amount of star ratings
        var arr = ["a" + star[0].slice(star[0].lastIndexOf('a') + 1, star[0].lastIndexOf('f')) + "f0h0"];
        setStar(prev => prev.concat(arr));
    }

    const decrementRating = () => {
        // decrease amount of star ratings
        setStar(prev => prev.slice(0, prev.length - 1));
    }

    const incrementStar = () => {
        // increase amount of stars in each star rating
        setStar(prev => prev.map(value => value.slice(0, value.lastIndexOf('a') + 1) +
            (Number(value.slice(value.lastIndexOf('a') + 1, value.lastIndexOf('f'))) + 1).toString() + value.slice(value.lastIndexOf('f'))));
    }

    const decrementStar = () => {
        // decrease amount of stars in each star rating
        setStar(prev => prev.map(value => value.slice(0, value.lastIndexOf('a') + 1) +
            (Number(value.slice(value.lastIndexOf('a') + 1, value.lastIndexOf('f'))) - 1).toString() + value.slice(value.lastIndexOf('f'))));
    }

    return (
        <div>
            <div><b>Entries:</b></div>
            <div>
                <button className="minusButton" onClick={decrementRating} disabled={star.length <= 1 ? true : false}>-</button>
                <button className="plusButton" onClick={incrementRating}>+</button>
            </div>
            <br />
            <div><b>Stars:</b></div>
            <div>
                <button className="minusButton" onClick={decrementStar}
                    disabled={Number(star[0].slice(star[0].lastIndexOf('a') + 1, star[0].lastIndexOf('f'))) <= 1 ? true : false}>-</button>
                <button className="plusButton" onClick={incrementStar}>+</button>
            </div>
        </div>
    );
}

export default function StarRatings(props) {
    const { stars, setStars } = props;

    const textChange = (id, text) => {
        // store user text input
        setStars(prev =>
            prev.map((value, index) =>
                index == id ?
                    text + value.slice(value.lastIndexOf('a')) :
                    value));
    }

    const onChange = (id, fillID) => {
        // permanent star rating change
        setStars(prev =>
            prev.map((value, index) =>
                index == id ?
                    value.slice(0, value.lastIndexOf('f') + 1) + (fillID + 1).toString() + value.slice(value.lastIndexOf('h')) :
                    value));
    }

    const onHover = (id, hovID) => {
        // temporary star rating change
        setStars(prev =>
            prev.map((value, index) =>
                index == id ?
                    value.slice(0, value.lastIndexOf('h') + 1) + (hovID + 1).toString() :
                    value));
    }

    const onUnhover = (id) => {
        // undo hover change
        setStars(prev =>
            prev.map((value, index) =>
                index == id ?
                    value.slice(0, value.lastIndexOf('h') + 1) + "0" :
                    value));
    }

    return (
        <div>
            {stars.map((value, index) => (
                <div>
                    <div className="star-rating">
                        <input className="text-rating" placeholder="Text Placeholder"
                            defaultValue={value.slice(0, value.lastIndexOf('a'))}
                            onChange={(event) => textChange(index, event.target.value)} />
                        <StarRating max={Number(value.slice(value.lastIndexOf('a') + 1, value.lastIndexOf('f')))}
                            filled={Number(value.slice(value.lastIndexOf('f') + 1, value.lastIndexOf('h')))}
                            hover={Number(value.slice(value.lastIndexOf('h') + 1))}
                            onChange={(fill) => onChange(index, fill)}
                            onHover={(hov) => onHover(index, hov)}
                            onUnhover={() => onUnhover(index)} />
                    </div>
                </div>))}
        </div>
    );
}
