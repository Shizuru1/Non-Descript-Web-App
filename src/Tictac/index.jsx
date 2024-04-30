import React, { useState } from "react";

import "./styles.css";

// Change whatever props you need to here
const Cell = (props) => {
  return <button className="cell">{/* Fill in what whever you need */}</button>;
};

export default function App() {
  return (
    <div className="app">
      <div aria-live="polite">
        Player X's turn/Player O's turn/Winner is X/Winner is O
      </div>
      <div className="board">
        {/* Placeholder cells */}
        <Cell />
        <Cell />
        <Cell />
        <Cell />
        <Cell />
        <Cell />
        <Cell />
        <Cell />
        <Cell />
      </div>
      <button>Reset</button>
    </div>
  );
}
