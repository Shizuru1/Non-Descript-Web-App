import React, { useState } from "react";
import ReactDOM from "react-dom";
import "./styles.css";
import "bulma/css/bulma.min.css";
import Counters from "./Counters";
import StarRating from "./StarRating";
import TicTacToe from "./Tictac";
import ThreePTTT from "./3PTTT";
import Checkers from "./Checkers";

// App
function App() {
  // Controls whether you see the Counter, Star Rating, or Tic Tac Toe components
  const [state, setState] = useState("counter"); // ['counter', 'star', 'ttt', '3pttt', 'checkers']

  return (
    <>
      <header>Header</header>
      <span>
        <nav>
          <div className="tag" onClick={() => setState("counter")}>Counters</div>
          <div className="tag" onClick={() => setState("star")}>Star Rating</div>
          <div className="tag" onClick={() => setState("ttt")}>Tic Tac Toe</div>
          <div className="tag" onClick={() => setState("3pttt")}>3-Player Tic Tac Toe</div>
          <div className="tag" onClick={() => setState("checkers")}>Checkers</div>
        </nav>
        <main>
          {state === "counter" && <Counters amount={14} />}
          {state === "star" && <StarRating />}
          {state === "ttt" && <TicTacToe />}
          {state === "3pttt" && <ThreePTTT />}
          {state === "checkers" && <Checkers />}
        </main>
        <aside>Sidebar</aside>
      </span>
      <footer>Footer</footer>
    </>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
