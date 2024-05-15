import React, { useState } from "react";

// Counter Component
function Counter(props) {
    const { changeTotal } = props;
    const [num, setNum] = useState(0);

    const onIncrement = () => {
        // increase counter, change as needed
        var inc = num;
        inc += 1;
        setNum(inc);
        changeTotal((prevState) => (prevState + 1));
    };

    const onDecrement = () => {
        // decrease counter, change as needed
        var dec = num;
        dec -= 1;
        setNum(dec);
        changeTotal((prevState) => (prevState - 1));
    };

    return (
        <div>
            <div className="counter">
                <b>{num}</b>
                <div className="counter-controls">
                    <button className="button is-danger is-small" onClick={onDecrement} disabled={num <= 0 ? true : false}>-</button>
                    <button className="button is-success is-small" onClick={onIncrement}>+</button>
                </div>
            </div>
        </div>
    );
}

function Total(props) {
    const { total } = props;

    return (<div className="total"><b>{total}</b></div>)
}

function Counters(props) {
    const { amount } = props;
    const [total, setTotal] = useState(0);
    const data = new Array(amount).fill(0);

    return (
        <>
            <div>
                Counters:
                <div>
                    {data.map((_noth, index) => (<Counter key={index} changeTotal={setTotal} />))}
                </div>
            </div>
            <br></br>
            <div>
                Total:
                <div>
                    <Total total={total} />
                </div>
            </div>
        </>
    );
};

export default Counters;
