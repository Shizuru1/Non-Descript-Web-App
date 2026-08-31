import React, { useState } from "react";
import ReactDOM from "react-dom";
import Hamburger from "./hamburger";
import Kebab from "./kebab";
import Counters, { Total } from "./Counters";
import StarRating, { EditRating } from "./StarRating";
import TicTacToe, { TTTSidebar } from "./Tictac";
import ThreePTTT, { ThrTTSidebar } from "./3PTTT";
import Checkers, { ChckrsSidebar } from "./Checkers";
import Chess, { ChssSidebar } from "./Chess";
import Chess2, { Chss2Sidebar } from "./Chess2";
import Chess3, { Chss3Sidebar } from "./Chess+";
import ThreePChess, { ThrssSidebar } from "./3PChess";
import Raumschach, { RmschchSidebar } from "./Raumschach";
import Calculator, { CalcSidebar } from "./Calculator";

import "./styles.css";

function App() {
    const [state, setState] = useState("counter"); // controls what component you see
    const [view, setView] = useState([true, true]); // controls nav bar and side bar visibility
    const [count, setCount] = useState([0]); // information for counters component
    const [star, setStar] = useState(["a5f0h0"]); // information for star ratings component
    // information for tic tac toe component
    const [tState, setTState] = useState('X'); // player & win state
    const [tValues, setTValues] = useState(new Array(9).fill('')); // board values
    const [tHist, setTHist] = useState(''); // move history
    // information for 3 player tic tac toe component
    const [thState, setThState] = useState('X'); // player & win state
    const [thValues, setThValues] = useState(new Array(13).fill('')); // board values
    const [thHist, setThHist] = useState(''); // move history
    // information for checkers component
    const [dState, setDState] = useState('⛂'); // player & win state
    const [dValues, setDValues] = useState(['', '⛀', '', '⛀', '', '⛀', '', '⛀',
        '⛀', '', '⛀', '', '⛀', '', '⛀', '',
        '', '⛀', '', '⛀', '', '⛀', '', '⛀',
        '', '', '', '', '', '', '', '',
        '', '', '', '', '', '', '', '',
        '⛂', '', '⛂', '', '⛂', '', '⛂', '',
        '', '⛂', '', '⛂', '', '⛂', '', '⛂',
        '⛂', '', '⛂', '', '⛂', '', '⛂', '']); // board values
    const [dHist, setDHist] = useState(''); // move history
    const [dSelected, setDSelected] = useState({ id: -1, value: false, king: false, jumpArray: [], jumped: false, blockedArray: [] }); // trigger move state upon piece selection
    // information for chess component
    const [cState, setCState] = useState('White'); // player & win state
    const [cValues, setCValues] = useState(['♜', '♞', '♝', '♛', '♚', '♝', '♞', '♜',
        '♟', '♟', '♟', '♟', '♟', '♟', '♟', '♟',
        '', '', '', '', '', '', '', '',
        '', '', '', '', '', '', '', '',
        '', '', '', '', '', '', '', '',
        '', '', '', '', '', '', '', '',
        '♙', '♙', '♙', '♙', '♙', '♙', '♙', '♙',
        '♖', '♘', '♗', '♕', '♔', '♗', '♘', '♖']); // board values
    const [cHist, setCHist] = useState(''); // move history
    const [cSelected, setCSelected] = useState({ id: -1, value: false, piece: '', blockedArray: [], moved: [false, false, false, false, false, false], passant: -1 }); // trigger move state upon piece selection
    const [cCount, setCCount] = useState(0); // count for fifty move rule
    const [cRepetitions, setCRepetitions] = useState([]); // count for fivefold repetition rule
    // information for broken chess component
    const [bcState, setBCState] = useState('White'); // player & win state
    const [bcValues, setBCValues] = useState(['♜', '♞', '🨼', '♛', '♚', '🨒', '♞', '♜',
        '♟', '♟', '♟', '♟', '♟', '♟', '♟', '♟',
        '', '', '', '', '', '', '', '',
        '', '', '', '', '', '', '', '',
        '', '', '', '', '', '', '', '',
        '', '', '', '', '', '', '', '',
        '♙', '♙', '♙', '♙', '♙', '♙', '♙', '♙',
        '♖', '♘', '🨶', '♕', '♔', '🨌', '♘', '♖']); // board values
    const [bcHist, setBCHist] = useState(''); // move history
    const [bcSelected, setBCSelected] = useState({ id: -1, value: false, piece: '', blockedArray: [] }); // trigger move state upon piece selection
    const [bcCount, setBCCount] = useState(0); // count for fifty move rule
    const [bcRepetitions, setBCRepetitions] = useState([]); // count for fivefold repetition rule
    // information for 3 player chess component
    const [tcState, setTCState] = useState({ player: 'White', firstOut: '', win: '' }); // player & win state
    const [tcValues, setTCValues] = useState(['♜', '♟', '', '', '', '', '🨅', '🨂',
        '♞', '♟', '', '', '', '', '🨅', '🨄',
        '♝', '♟', '', '', '', '', '🨅', '🨃',
        '♛', '♟', '', '', '', '', '🨅', '🨀',
        '♚', '♟', '', '', '', '', '🨅', '🨁',
        '♝', '♟', '', '', '', '', '🨅', '🨃',
        '♞', '♟', '', '', '', '', '🨅', '🨄',
        '♜', '♟', '', '', '', '', '🨅', '🨂',
        '', '', '', '', '', '', '', '',
        '', '', '', '', '', '', '', '',
        '♙', '♙', '♙', '♙', '♙', '♙', '♙', '♙',
        '♖', '♘', '♗', '♕', '♔', '♗', '♘', '♖']); // board values
    const [tcHist, setTCHist] = useState(''); // move history
    const [tcSelected, setTCSelected] = useState({ id: -1, value: false, piece: '', blockedArray: [], moved: [false, false, false, false, false, false, false, false, false], passant: [-1, -1, false, false] }); // trigger move state upon piece selection
    const [tcCount, setTCCount] = useState(0); // count for fifty move rule
    const [tcRepetitions, setTCRepetitions] = useState([]); // count for fivefold repetition rule
    // information for 3d chess component
    const [rcState, setRCState] = useState('White'); // player & win state
    const [rcValues, setRCValues] = useState(['♜', '♞', '♚', '♞', '♜',
        '♟', '♟', '♟', '♟', '♟',
        '', '', '', '', '',
        '', '', '', '', '',
        '', '', '', '', '',
        '🨨', '♝', '♛', '🨨', '♝',
        '♟', '♟', '♟', '♟', '♟',
        '', '', '', '', '',
        '', '', '', '', '',
        '', '', '', '', '',
        '', '', '', '', '',
        '', '', '', '', '',
        '', '', '', '', '',
        '', '', '', '', '',
        '', '', '', '', '',
        '', '', '', '', '',
        '', '', '', '', '',
        '', '', '', '', '',
        '♙', '♙', '♙', '♙', '♙',
        '♗', '🨢', '♕', '♗', '🨢',
        '', '', '', '', '',
        '', '', '', '', '',
        '', '', '', '', '',
        '♙', '♙', '♙', '♙', '♙',
        '♖', '♘', '♔', '♘', '♖']); // board values
    const [rcHist, setRCHist] = useState(''); // move history
    const [rcSelected, setRCSelected] = useState({ id: -1, value: false, piece: '', blockedArray: [] }); // trigger move state upon piece selection
    const [rcCount, setRCCount] = useState(0); // count for fifty move rule
    const [rcRepetitions, setRCRepetitions] = useState([]); // count for fivefold repetition rule
    // information for another chess component
    const [acState, setACState] = useState('White'); // player & win state
    const [acValues, setACValues] = useState(['♜h80r0e3', '♞h100r0e3', '♝h60r0e4', '♛h160r0e4', '♚h300r0e5', '♝h60r0e5', '♞h100r0e4', '♜h80r0e3',
        '♟h40r0e2', '♟h40r0e3', '♟h40r0e4', '♟h40r0e5', '♟h40r0e5', '♟h40r0e4', '♟h40r0e3', '♟h40r0e2',
        'e2', 'e3', 'e5', 'e6', 'e6', 'e5', 'e3', 'e2',
        'e1', 'e4', 'e5', 'e7', 'e8', 'e6', 'e4', 'e3',
        'e3', 'e4', 'e6', 'e8', 'e7', 'e5', 'e4', 'e1',
        'e2', 'e3', 'e5', 'e6', 'e6', 'e5', 'e3', 'e2',
        '♙h40r0e2', '♙h40r0e3', '♙h40r0e4', '♙h40r0e5', '♙h40r0e5', '♙h40r0e4', '♙h40r0e3', '♙h40r0e2',
        '♖h80r0e3', '♘h100r0e3', '♗h60r0e4', '♕h160r0e4', '♔h300r0e5', '♗h60r0e5', '♘h100r0e4', '♖h80r0e3']); // board values
    const [acHist, setACHist] = useState(''); // move history
    const [acSelected, setACSelected] = useState({ id: -1, value: false, piece: '', blockedArray: [], moved: [false, false, false, false, false, false], passant: -1 }); // trigger move state upon piece selection
    const [acCount, setACCount] = useState(0); // count for fifty move rule
    const [acRepetitions, setACRepetitions] = useState([]); // count for fivefold repetition rule
    const [cellHover, setCellHover] = useState('') // hovered cell information
    // information for calculator component
    const [calcValue, setCalcValue] = useState({ value: '0', memory: '', repeat: false });
    const [base, setBase] = useState({ num: 10, values: ['<', '>', 'AC', '±', '=', '^^', 'log', '√', '^', '/', '*', '-', '+', 'e', 'π', 'i', '.', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'] });

    // reset tic tac toe component
    const tReset = () => {
        setTValues(new Array(9).fill(''));
        setTState('O');
        setTHist('');
    }

    // reset 3 player tic tac toe component
    const thReset = () => {
        setThValues(new Array(13).fill(''));
        setThState('∆');
        setThHist('');
    }

    // reset checkers component
    const dReset = () => {
        setDValues(['', '⛀', '', '⛀', '', '⛀', '', '⛀',
            '⛀', '', '⛀', '', '⛀', '', '⛀', '',
            '', '⛀', '', '⛀', '', '⛀', '', '⛀',
            '', '', '', '', '', '', '', '',
            '', '', '', '', '', '', '', '',
            '⛂', '', '⛂', '', '⛂', '', '⛂', '',
            '', '⛂', '', '⛂', '', '⛂', '', '⛂',
            '⛂', '', '⛂', '', '⛂', '', '⛂', '']);
        setDState('⛂');
        setDHist('');
        setDSelected({ id: -1, value: false, king: false, jumpArray: [], jumped: false, blockedArray: [] });
    }

    // reset chess component
    const cReset = () => {
        setCValues(['♜', '♞', '♝', '♛', '♚', '♝', '♞', '♜',
            '♟', '♟', '♟', '♟', '♟', '♟', '♟', '♟',
            '', '', '', '', '', '', '', '',
            '', '', '', '', '', '', '', '',
            '', '', '', '', '', '', '', '',
            '', '', '', '', '', '', '', '',
            '♙', '♙', '♙', '♙', '♙', '♙', '♙', '♙',
            '♖', '♘', '♗', '♕', '♔', '♗', '♘', '♖']);
        setCState('White');
        setCHist('');
        setCSelected({ id: -1, value: false, piece: '', blockedArray: [], moved: [false, false, false, false, false, false], passant: -1 });
        setCCount(0);
        setCRepetitions([]);
    }

    // reset broken chess component
    const bcReset = () => {
        setBCValues(['♜', '♞', '🨼', '♛', '♚', '🨒', '♞', '♜',
            '♟', '♟', '♟', '♟', '♟', '♟', '♟', '♟',
            '', '', '', '', '', '', '', '',
            '', '', '', '', '', '', '', '',
            '', '', '', '', '', '', '', '',
            '', '', '', '', '', '', '', '',
            '♙', '♙', '♙', '♙', '♙', '♙', '♙', '♙',
            '♖', '♘', '🨶', '♕', '♔', '🨌', '♘', '♖']);
        setBCState('White');
        setBCHist('');
        setBCSelected({ id: -1, value: false, piece: '', blockedArray: [] });
        setBCCount(0);
        setBCRepetitions([]);
    }

    // reset 3 player chess component
    const tcReset = () => {
        setTCValues(['♜', '♟', '', '', '', '', '🨅', '🨂',
            '♞', '♟', '', '', '', '', '🨅', '🨄',
            '♝', '♟', '', '', '', '', '🨅', '🨃',
            '♛', '♟', '', '', '', '', '🨅', '🨀',
            '♚', '♟', '', '', '', '', '🨅', '🨁',
            '♝', '♟', '', '', '', '', '🨅', '🨃',
            '♞', '♟', '', '', '', '', '🨅', '🨄',
            '♜', '♟', '', '', '', '', '🨅', '🨂',
            '', '', '', '', '', '', '', '',
            '', '', '', '', '', '', '', '',
            '♙', '♙', '♙', '♙', '♙', '♙', '♙', '♙',
            '♖', '♘', '♗', '♕', '♔', '♗', '♘', '♖']);
        setTCState({ player: 'White', firstOut: '', win: '' });
        setTCHist('');
        setTCSelected({ id: -1, value: false, piece: '', blockedArray: [], moved: [false, false, false, false, false, false, false, false, false], passant: -1 });
        setTCCount(0);
        setTCRepetitions([]);
    }

    const rcReset = () => {
        setRCValues(['♜', '♞', '♚', '♞', '♜',
            '♟', '♟', '♟', '♟', '♟',
            '', '', '', '', '',
            '', '', '', '', '',
            '', '', '', '', '',
            '🨨', '♝', '♛', '🨨', '♝',
            '♟', '♟', '♟', '♟', '♟',
            '', '', '', '', '',
            '', '', '', '', '',
            '', '', '', '', '',
            '', '', '', '', '',
            '', '', '', '', '',
            '', '', '', '', '',
            '', '', '', '', '',
            '', '', '', '', '',
            '', '', '', '', '',
            '', '', '', '', '',
            '', '', '', '', '',
            '♙', '♙', '♙', '♙', '♙',
            '♗', '🨢', '♕', '♗', '🨢',
            '', '', '', '', '',
            '', '', '', '', '',
            '', '', '', '', '',
            '♙', '♙', '♙', '♙', '♙',
            '♖', '♘', '♔', '♘', '♖']);
        setRCState('White');
        setRCHist('');
        setRCSelected({ id: -1, value: false, piece: '', blockedArray: [] });
        setRCCount(0);
        setRCRepetitions([]);
    }

    // reset another chess component
    const acReset = (random) => {
        if (random) {
            var arr = ['♜h80r0e', '♞h100r0e', '♝h60r0e', '♛h160r0e', '♚h300r0e', '♝h60r0e', '♞h100r0e', '♜h80r0e',
                '♟h40r0e', '♟h40r0e', '♟h40r0e', '♟h40r0e', '♟h40r0e', '♟h40r0e', '♟h40r0e', '♟h40r0e',
                'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e',
                'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e',
                'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e',
                'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e',
                '♙h40r0e', '♙h40r0e', '♙h40r0e', '♙h40r0e', '♙h40r0e', '♙h40r0e', '♙h40r0e', '♙h40r0e',
                '♖h80r0e', '♘h100r0e', '♗h60r0e', '♕h160r0e', '♔h300r0e', '♗h60r0e', '♘h100r0e', '♖h80r0e'];
            var brr = arr.map((val) => (val + (Math.floor(Math.random() * 8) + 1).toString()));
            setACValues(brr);
        } else {
            setACValues(prev => {
                var arr = ['♜h80r0', '♞h100r0', '♝h60r0', '♛h160r0', '♚h300r0', '♝h60r0', '♞h100r0', '♜h80r0',
                    '♟h40r0', '♟h40r0', '♟h40r0', '♟h40r0', '♟h40r0', '♟h40r0', '♟h40r0', '♟h40r0',
                    '', '', '', '', '', '', '', '',
                    '', '', '', '', '', '', '', '',
                    '', '', '', '', '', '', '', '',
                    '', '', '', '', '', '', '', '',
                    '♙h40r0', '♙h40r0', '♙h40r0', '♙h40r0', '♙h40r0', '♙h40r0', '♙h40r0', '♙h40r0',
                    '♖h80r0', '♘h100r0', '♗h60r0', '♕h160r0', '♔h300r0', '♗h60r0', '♘h100r0', '♖h80r0'];
                var brr = arr.map((val, ind) => (val + prev[ind].slice(prev[ind].lastIndexOf('e'))));
                return brr;
            });
        }
        setACState('White');
        setACHist('');
        setACSelected({ id: -1, value: false, piece: '', blockedArray: [], moved: [false, false, false, false, false, false], passant: -1 });
        setACCount(0);
        setACRepetitions([]);
        setCellHover('');
    }

    return (
        <>
            <header>
                <button className="menuButton" onClick={() => setView(prev => prev.map((value, index) => index == 0 ? !value : value))}>
                    <Hamburger />
                </button>
                <h2>
                    {state === "counter" && "Counters"}
                    {state === "star" && "Star Rating"}
                    {state === "ttt" && "Tic Tac Toe"}
                    {state === "3pttt" && "3-Player Tic Tac Toe"}
                    {state === "checkers" && "Checkers"}
                    {state === "chess" && "Chess"}
                    {state === "chess2" && "Broken Chess"}
                    {state === "3pchess" && "3-Player Chess"}
                    {state === "raumschach" && "3D Chess"}
                    {state === "chess+" && "Another Chess"}
                    {state === "calculator" && "Calculator"}
                </h2>
                <button className="sideButton" onClick={() => setView(prev => prev.map((value, index) => index == 1 ? !value : value))}>
                    <Kebab />
                </button>
            </header>
            <span>
                <nav style={{ display: view[0] ? "grid" : "none" }}>
                    <button className="pageButton" onClick={() => setState("counter")}>Counters</button>
                    <button className="pageButton" onClick={() => setState("star")}>Star Rating</button>
                    <button className="pageButton" onClick={() => setState("ttt")}>Tic Tac Toe</button>
                    <button className="pageButton" onClick={() => setState("3pttt")}>3-Player Tic Tac Toe</button>
                    <button className="pageButton" onClick={() => setState("checkers")}>Checkers</button>
                    <button className="pageButton" onClick={() => setState("chess")}>Chess</button>
                    <button className="pageButton" onClick={() => setState("chess2")}>Broken Chess</button>
                    <button className="pageButton" onClick={() => setState("3pchess")}>3-Player Chess</button>
                    <button className="pageButton" onClick={() => setState("raumschach")}>3D Chess</button>
                    <button className="pageButton" onClick={() => setState("chess+")}>Another Chess</button>
                    <button className="pageButton" onClick={() => setState("calculator")}>Calculator</button>
                </nav>
                <main style={{ width: view[0] ? (view[1] ? "80%" : "90%") : (view[1] ? "90%" : "100%"), left: view[0] ? "10%" : "0%" }}>
                    {state === "counter" && <Counters count={count} setCount={setCount} />}
                    {state === "star" && <StarRating stars={star} setStars={setStar} />}
                    {state === "ttt" && <TicTacToe state={tState} setState={setTState} values={tValues} setValues={setTValues} setHistory={setTHist} />}
                    {state === "3pttt" && <ThreePTTT state={thState} setState={setThState} values={thValues} setValues={setThValues} setHistory={setThHist} />}
                    {state === "checkers" && <Checkers state={dState} setState={setDState} values={dValues} setValues={setDValues} setHistory={setDHist} selected={dSelected} setSelected={setDSelected} />}
                    {state === "chess" && <Chess state={cState} setState={setCState} values={cValues} setValues={setCValues} setHistory={setCHist} selected={cSelected} setSelected={setCSelected} count={cCount} setCount={setCCount} repetitions={cRepetitions} setRepetitions={setCRepetitions} />}
                    {state === "chess2" && <Chess2 state={bcState} setState={setBCState} values={bcValues} setValues={setBCValues} setHistory={setBCHist} selected={bcSelected} setSelected={setBCSelected} count={bcCount} setCount={setBCCount} repetitions={bcRepetitions} setRepetitions={setBCRepetitions} />}
                    {state === "3pchess" && <ThreePChess state={tcState} setState={setTCState} values={tcValues} setValues={setTCValues} setHistory={setTCHist} selected={tcSelected} setSelected={setTCSelected} count={tcCount} setCount={setTCCount} repetitions={tcRepetitions} setRepetitions={setTCRepetitions} />}
                    {state === "raumschach" && <Raumschach state={rcState} setState={setRCState} values={rcValues} setValues={setRCValues} setHistory={setRCHist} selected={rcSelected} setSelected={setRCSelected} count={rcCount} setCount={setRCCount} repetitions={rcRepetitions} setRepetitions={setRCRepetitions} />}
                    {state === "chess+" && <Chess3 state={acState} setState={setACState} values={acValues} setValues={setACValues} setHistory={setACHist} selected={acSelected} setSelected={setACSelected} setCellHover={setCellHover} count={acCount} setCount={setACCount} repetitions={acRepetitions} setRepetitions={setACRepetitions} />}
                    {state === "calculator" && <Calculator base={base} setBase={setBase} values={calcValue} setValues={setCalcValue} />}
                </main>
                <aside style={{ display: view[1] ? "grid" : "none" }}>
                    {state === "counter" && <Total count={count} setCount={setCount} />}
                    {state === "star" && <EditRating star={star} setStar={setStar} />}
                    {state === "ttt" && <TTTSidebar reset={tReset} history={tHist} />}
                    {state === "3pttt" && <ThrTTSidebar reset={thReset} history={thHist} />}
                    {state === "checkers" && <ChckrsSidebar reset={dReset} history={dHist} />}
                    {state === "chess" && <ChssSidebar reset={cReset} history={cHist} />}
                    {state === "chess2" && <Chss2Sidebar reset={bcReset} history={bcHist} />}
                    {state === "3pchess" && <ThrssSidebar reset={tcReset} history={tcHist} />}
                    {state === "raumschach" && <RmschchSidebar reset={rcReset} history={rcHist} />}
                    {state === "chess+" && <Chss3Sidebar reset={acReset} history={acHist} hover={cellHover} />}
                    {state === "calculator" && <CalcSidebar base={base} setBase={setBase} />}
                </aside>
            </span>
        </>
    );
}

ReactDOM.render(<App />, document.getElementById("root"));
