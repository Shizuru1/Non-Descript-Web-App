import React, { useState } from "react";
import ReactDOM from "react-dom";
import Counters from "./Counters";
import StarRating from "./StarRating";
import TicTacToe from "./Tictac";
import ThreePTTT from "./3PTTT";
import Checkers from "./Checkers";
import Chess from "./Chess";
import Chess2 from "./Chess2";
import ThreePChess from "./3PChess";

import "./styles.css";
import "bulma/css/bulma.min.css";

// App
function App() {
    // Controls whether you see the Counter, Star Rating, or Tic Tac Toe components
    const [state, setState] = useState("counter"); // ['counter', 'star', 'ttt', '3pttt', 'checkers', 'chess', 'chess2', '3pchess']

    return (
        <>
            <header>
                {state === "counter" && "Counters"}
                {state === "star" && "Star Rating"}
                {state === "ttt" && "Tic Tac Toe"}
                {state === "3pttt" && "3-Player Tic Tac Toe"}
                {state === "checkers" && "Checkers"}
                {state === "chess" && "Chess"}
                {state === "chess2" && "Broken Chess"}
                {state === "3pchess" && "3-Player Chess"}
            </header>
            <span>
                <nav>
                    <div className="tag" onClick={() => setState("counter")}>Counters</div>
                    <div className="tag" onClick={() => setState("star")}>Star Rating</div>
                    <div className="tag" onClick={() => setState("ttt")}>Tic Tac Toe</div>
                    <div className="tag" onClick={() => setState("3pttt")}>3-Player Tic Tac Toe</div>
                    <div className="tag" onClick={() => setState("checkers")}>Checkers</div>
                    <div className="tag" onClick={() => setState("chess")}>Chess</div>
                    <div className="tag" onClick={() => setState("chess2")}>Broken Chess</div>
                    <div className="tag" onClick={() => setState("3pchess")}>3-Player Chess</div>
                </nav>
                <main>
                    {state === "counter" && <Counters amount={9} />}
                    {state === "star" && <StarRating />}
                    {state === "ttt" && <TicTacToe />}
                    {state === "3pttt" && <ThreePTTT />}
                    {state === "checkers" && <Checkers />}
                    {state === "chess" && <Chess />}
                    {state === "chess2" && <Chess2 />}
                    {state === "3pchess" && <ThreePChess /> }
                </main>
            </span>
        </>
    );
}

ReactDOM.render(<App />, document.getElementById("root"));
