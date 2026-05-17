import React from "react";

// Counter Component
function Counter(props) {
    const { index, value, setCount } = props;

    const onIncrement = () => {
        // increase counter
        setCount(prev => prev.map((val, id) => id == index ? val + 1 : val))
    };

    const onDecrement = () => {
        // decrease counter
        setCount(prev => prev.map((val, id) => id == index ? val - 1 : val))
    };

    return (
        <div>
            <div className="counter">
                <b>{value}</b>
                <div className="counter-controls">
                    <button className="minusButton" onClick={onDecrement} disabled={value <= 0 ? true : false}>-</button>
                    <button className="plusButton" onClick={onIncrement}>+</button>
                </div>
            </div>
        </div>
    );
}

export function Total(props) {
    const { count, setCount } = props;

    var total = 0;
    count.forEach((value) => total += value);

    return (
        <div>
            Total:
            <div><b>{total}</b></div>
            <br />
            <button className="resetButton" onClick={() => setCount(new Array(total).fill(0))}>Set Amount</button>
        </div>
    );
}

export default function Counters(props) {
    const { count, setCount } = props;

    return (
        <div style={{ display: "grid", gridAutoFlow: "column", gridTemplateRows: "repeat(12, 1fr)" }}>
            {count.map((val, ind) => (<Counter index={ind} value={val} setCount={setCount} />))}
        </div>
    );
};
