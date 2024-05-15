import React, { useEffect, useState } from "react";

import "./styles.css";

const Cell = (props) => {
    const { id, value, win, setPlayer, setArray } = props;

    const handleClick = () => {
        setPlayer();
        setArray();
    }
    const checkerboard = ((id % 2 != 1) && (Math.floor(id / 8) % 2 != 1)) || ((id % 2 == 1) && (Math.floor(id / 8) % 2 == 1));

    return <button className="cell2" onClick={handleClick} style={checkerboard ? { backgroundColor: "#fff", color: "#000" } : { backgroundColor: "#000", color: "#fff" }} disabled={(value != '') || (win != '')}>{value}</button>;
};

export default function App() {
    const [player, setPlayer] = useState('Black'); // whose turn
    const [win, setWin] = useState(''); // win state
    const initArray = new Array(64).fill('');
    const initBlacks = new Array(12).fill('○');
    const initWhites = new Array(12).fill('●');
    const initArrayBlacks = initArray.map((value, index) => (initBlacks.forEach((val, id) => ((index == id * 2 + 1) ? "○" : value))));
    const initArrayFull = initArrayBlacks.map((value, index) => (initWhites.forEach((val, id) => ((index == id * 2 + 40) ? "●" : value))));
    const [values, setValues] = useState(initArrayFull); // board state

    useEffect(() => {
        checkForWin();
    }, [values]);

    const arrayModifier = (id) => {
        setValues(values.map((value, index) => (index == id ? value = (player == 'Black' ? '○' : '●') : value)));
    }

    const playerModifier = (func) => {
        (player == 'Black') ? func('White') : func('Black');
    }

    const reset = () => {
        setValues(initArray);
        setPlayer('Black');
        setWin('');
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

    const checkForWin = () => {
        if (values.every(value => value != '')) {
            setWin('draw');
        }
        winningCombos.forEach(combin => {
            const [a, b, c] = combin;
            if (values[a] != '') {
                if (values[a] == values[b] && values[b] == values[c]) {
                    playerModifier(setWin);
                }
            }
        })
    }

    return (
        <div className="app2">
            <div aria-live="polite">
                {((win == '') ? ('Player ' + player + "'s turn") : ((win == 'draw') ? 'Draw' : ('Winner is ' + win)))}
            </div>
            <div className="board2">
                {values.map((value, index) => (<Cell id={index} value={value} win={win} setPlayer={() => playerModifier(setPlayer)} setArray={() => arrayModifier(index)} />))}
            </div>
            <button onClick={reset}>Reset</button>
        </div>
    );
}
