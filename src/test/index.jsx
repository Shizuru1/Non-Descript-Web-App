import React, { useState, useEffect } from "react";

import "./styles.css";

const Cell = (props) => {
  const { value, win, setPlayer, setArray } = props;

  const handleClick = () => {
    setPlayer();
    setArray();
  }

  return <button className="cella" onClick={handleClick} disabled={(value != '') || (win != '')}>{value}</button>;
};

export default function App() {
  const [ player, setPlayer ] = useState('O'); // whose turn
  const [ win, setWin ] = useState(''); // win state
  const [ values, setValues ] = useState(new Array(13).fill('')); // board state

  useEffect(() => {
    checkForWin();
  }, [values]);

  const arrayModifier = (id) => {
    setValues(values.map((value, index) => (index == id ? value = player : value)));
  }

  const playerModifier = (func) => {
    (player == 'O') ? func('X') : func('O');
  }

  const reset = () => {
    setValues(new Array(13).fill(''));
    setPlayer('O');
    setWin('');
  }

  const winningCombos = [
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,4,8],
    [2,4,6],
  ];

  const checkForWin = () => {
    if (values.every(value => value != '')) {
      setWin('draw');
    }
    winningCombos.forEach(combin => {
      const [a, b, c]  = combin;
      if (values[a] != '') {
        if(values[a] == values[b] && values[b] == values[c]) {
          playerModifier(setWin);
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
        {values.map((value, index) => (<Cell key={index} value={value} win={win} setPlayer={() => playerModifier(setPlayer)} setArray={() => arrayModifier(index)} />))}
      </div>
      <button onClick={reset}>Reset</button>
    </div>
  );
}
