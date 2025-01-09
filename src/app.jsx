import React, { useState } from "react";
import ReactDOM from "react-dom";
import Counters from "./Counters";
import StarRating from "./StarRating";
import TicTacToe from "./Tictac";
import ThreePTTT from "./3PTTT";
import Checkers from "./Checkers";
import Chess from "./Chess";

import "./styles.css";
import "bulma/css/bulma.min.css";

// App
function App() {
    // Controls whether you see the Counter, Star Rating, or Tic Tac Toe components
    const [state, setState] = useState("counter"); // ['counter', 'star', 'ttt', '3pttt', 'checkers', 'chess']

    return (
        <>
            <header></header>
            <span>
                <nav>
                    <div className="tag" onClick={() => setState("counter")}>Counters</div>
                    <div className="tag" onClick={() => setState("star")}>Star Rating</div>
                    <div className="tag" onClick={() => setState("ttt")}>Tic Tac Toe</div>
                    <div className="tag" onClick={() => setState("3pttt")}>3-Player Tic Tac Toe</div>
                    <div className="tag" onClick={() => setState("checkers")}>Checkers</div>
                    <div className="tag" onClick={() => setState("chess")}>Chess</div>
                </nav>
                <main>
                    {state === "counter" && <Counters amount={14} />}
                    {state === "star" && <StarRating />}
                    {state === "ttt" && <TicTacToe />}
                    {state === "3pttt" && <ThreePTTT />}
                    {state === "checkers" && <Checkers />}
                    {state === "chess" && <Chess />}
                </main>
                <aside></aside>
            </span>
            <footer></footer>
        </>
    );
}

ReactDOM.render(<App />, document.getElementById("root"));
