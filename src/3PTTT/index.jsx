import React, { useEffect, useRef } from "react";

import "./styles.css";

const Cell = (props) => {
    const { index, value, state, setArray, setHistory } = props;

    const handleClick = () => {
        setArray();
        setHistory();
    }

    return <div className={(value != '') || (state.length > 1) ? "border" + String.fromCharCode(97 + index) + " disabled" : "border" + String.fromCharCode(97 + index)} onClick={handleClick}>
        <button className={"cell" + String.fromCharCode(97 + index)} disabled={(value != '') || (state.length > 1)}>{value}</button>
    </div>;
};

export function ThrTTSidebar(props) {
    const { reset, history } = props;

    return (
        <div>
            <div>
                <button className="resetButton" onClick={reset}>Reset</button>
            </div>
            <br />
            <div>Move History:</div>
            <div className="moveHistory">{history}</div>
        </div>
    );
}

export default function Thrictac(props) {
    const { state, setState, values, setValues, setHistory } = props;

    const loadPage = useRef(true); // don't activate useEffect on first load

    useEffect(() => {
        if (loadPage.current) {
            loadPage.current = false;
            return;
        }
        checkState();
    }, [values]);

    const arrayModifier = (id) => {
        setValues(values.map((value, index) => (index == id ? value = state.slice(0, 1) : value)));
    }

    const histModifier = (id) => {
        switch (id) {
            case 0:
                var dir = " 10 O'Clock";
                break;
            case 1:
                var dir = " 11 O'Clock";
                break;
            case 2:
                var dir = " 12 O'Clock";
                break;
            case 3:
                var dir = " 1 O'Clock";
                break;
            case 4:
                var dir = " 2 O'Clock";
                break;
            case 5:
                var dir = " 9 O'Clock";
                break;
            case 6:
                var dir = " Middle";
                break;
            case 7:
                var dir = " 3 O'Clock";
                break;
            case 8:
                var dir = " 8 O'Clock";
                break;
            case 9:
                var dir = " 7 O'Clock";
                break;
            case 10:
                var dir = " 6 O'Clock";
                break;
            case 11:
                var dir = " 5 O'Clock";
                break;
            case 12:
            default:
                var dir = " 4 O'Clock";
                break;
        }
        setHistory(prev => state.slice(0, 1) + dir + '\n' + prev);
    }

    const winningCombos = [
        [0, 1, 2],
        [0, 5, 8],
        [0, 6, 12],
        [1, 6, 11],
        [2, 3, 4],
        [2, 6, 10],
        [3, 6, 9],
        [4, 6, 8],
        [4, 7, 12],
        [5, 6, 7],
        [8, 9, 10],
        [10, 11, 12],
    ];

    const checkState = () => {
        for (let i = 0; i < 12; i++) {
            const [a, b, c] = winningCombos[i];
            if (values[a] != '') {
                if (values[a] == values[b] && values[b] == values[c]) {
                    setState(prev => prev + 'win');
                    return;
                }
            }
        }
        if (values.every(value => value != '')) {
            setState(prev => prev + 'draw');
            return;
        }
        setState(prev => prev == '∆' ? 'X' : (prev == 'X' ? 'O' : '∆'));
    }

    return (
        <div className="appa">
            <div>
                {state.slice(1) == 'draw' ? 'Draw' : (state.slice(1) == 'win' ? 'Player ' + state.slice(0, 1) + ' wins' : 'Player ' + state.slice(0, 1) + "'s turn")}
            </div>
            <div className="boarda">
                {values.map((value, index) => (<Cell index={index} value={value} state={state} setArray={() => arrayModifier(index)} setHistory={() => histModifier(index)} />))}
            </div>
        </div>
    );
}
