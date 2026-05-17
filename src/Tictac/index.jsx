import React, { useEffect, useRef } from "react";

import "./styles.css";

const Cell = (props) => {
    const { value, state, setArray, setHistory } = props;

    const handleClick = () => {
        setArray();
        setHistory();
    }

    return <button className="cell" onClick={handleClick} disabled={(value != '') || (state.length > 1)}>{value}</button>;
};

export function TTTSidebar(props) {
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

export default function Tictac(props) {
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
        setHistory(prev => state.slice(0, 1) + (id < 3 ? ' Top ' : (id < 6 ? ' Middle ' : ' Bottom ')) + (id % 3 == 0 ? 'Left' : (id % 3 == 1 ? 'Middle' : 'Right')) + '\n' + prev);
    }

    const winningCombos = [
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    const checkState = () => {
        for (let i = 0; i < 8; i++) {
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
        setState(prev => prev == 'O' ? 'X' : 'O');
    }

    return (
        <div className="app">
            <div>
                {state.slice(1) == 'draw' ? 'Draw' : (state.slice(1) == 'win' ? 'Player ' + state.slice(0, 1) + ' wins' : 'Player ' + state.slice(0,1) + "'s turn")}
            </div>
            <div className="board">
                {values.map((value, index) => (<Cell value={value} state={state} setArray={() => arrayModifier(index)} setHistory={() => histModifier(index)} />))}
            </div>
        </div>
    );
}
