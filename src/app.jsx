import React, { useState } from "react";
import ReactDOM from "react-dom";
import "./styles.css";
import "bulma/css/bulma.min.css";
import Counters from "./Counters";
import StarRating from "./StarRating";
import TicTacToe from "./Tictac";

// App
function App() {
  // Controls whether you see the Counter, Star Rating, or Tic Tac Toe components
  const [state, setState] = useState("counter"); // ['counter', 'star', 'ttt']

  return (
    <>
      <header>Header</header>
      <div>
        <nav>
          <div onClick={() => setState("counter")}>
            <span className="tag">Counters</span>
          </div>
          <div onClick={() => setState("star")}>
            <span className="tag">Star Rating</span>
          </div>
          <div onClick={() => setState("ttt")}>
            <span className="tag">Tic Tac Toe</span>
          </div>
        </nav>
        <main>
          {state === "counter" && <Counters />}
          {state === "star" && <StarRating />}
          {state === "ttt" && <TicTacToe />}
        </main>
        <aside>Sidebar</aside>
      </div>
      <footer>Footer</footer>
    </>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
