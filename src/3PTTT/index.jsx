import React, { useState, useEffect } from "react";

import "./styles.css";

const Cell = (props) => {
    const { index, value, win, setPlayer, setArray } = props;

    const handleClick = () => {
        setPlayer();
        setArray();
    }

    return <button className={"cell" + String.fromCharCode(97 + index)} onClick={handleClick} disabled={(value != '') || (win != '')}>{value}</button>;
};

export default function App() {
    const [player, setPlayer] = useState('O'); // whose turn
    const [win, setWin] = useState(''); // win state
    const [values, setValues] = useState(new Array(13).fill('')); // board state

    useEffect(() => {
        checkForWin();
    }, [values]);

    const arrayModifier = (id) => {
        setValues(values.map((value, index) => (index == id ? value = player : value)));
    }

    const reset = () => {
        setValues(new Array(13).fill(''));
        setPlayer('O');
        setWin('');
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

    const checkForWin = () => {
        if (values.every(value => value != '')) {
            setWin('draw');
        }
        winningCombos.forEach(combin => {
            const [a, b, c] = combin;
            if (values[a] != '') {
                if (values[a] == values[b] && values[b] == values[c]) {
                    (player == 'O') ? setWin('∆') : (player == 'X' ? setWin('O') : setWin('X'));
                }
            }
        })
    }

    return (
        <div className="appa">
            <div aria-live="polite">
                {((win == '') ? ('Player ' + player + "'s turn") : ((win == 'draw') ? 'Draw' : ('Winner is ' + win)))}
            </div>
            <div className="boarda">
                {values.map((value, index) => (<Cell index={index} value={value} win={win} setPlayer={() => ((player == 'O') ? setPlayer('X') : (player == 'X' ? setPlayer('∆') : setPlayer('O')))} setArray={() => arrayModifier(index)} />))}
            </div>
            <button onClick={reset}>Reset</button>
        </div>
    );
}
