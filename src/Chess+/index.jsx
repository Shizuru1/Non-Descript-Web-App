import React, { useEffect } from "react";

import "./styles.css";

const Cell = (props) => {
    const { id, selected, value, state, setCount, setPlayer, setArray, setRest, setSelected, setHistory, checkForMovement, checkForCastle, setCellHover } = props;

    const player = state.slice(0, 5);

    const handleClick = () => {
        if (selected.value) {
            // Cancel Move
            if (id == selected.id) {
                setSelected({ id: -1, value: false, piece: selected.piece, blockedArray: selected.blockedArray, moved: selected.moved, passant: selected.passant });
            }
            // Normal Move
            else {
                var moves = selected.moved;
                setHistory(selected.piece, id, !value.startsWith('e'), selected.id, ((selected.piece[0] == '♙' || selected.piece[0] == '♟') && (Math.abs(id - selected.id) == 7 || Math.abs(id - selected.id) == 9) && value.startsWith('e')), ((id < 8 && selected.piece[0] == '♙') || (id > 55 && selected.piece[0] == '♟')), ((selected.piece[0] == '♔' || selected.piece[0] == '♚') && Math.abs(id - selected.id) == 2));
                if (selected.piece[0] == '♔' && !moves[0]) {
                    moves[0] = true;
                } else if (selected.piece[0] == '♚' && !moves[1]) {
                    moves[1] = true;
                } else if (selected.piece[0] == '♖') {
                    if (selected.id == 56 && !moves[2]) {
                        moves[2] = true;
                    } else if (selected.id == 63 && !moves[3]) {
                        moves[3] = true;
                    }
                } else if (selected.piece[0] == '♜') {
                    if (selected.id == 0 && !moves[4]) {
                        moves[4] = true;
                    } else if (selected.id == 7 && !moves[5]) {
                        moves[5] = true;
                    }
                }
                if (value[0] == '♖') {
                    if (id == 56 && !moves[2]) {
                        moves[2] = true;
                    } else if (id == 63 && !moves[3]) {
                        moves[3] = true;
                    }
                } else if (value[0] == '♜') {
                    if (id == 0 && !moves[4]) {
                        moves[4] = true;
                    } else if (id == 7 && !moves[5]) {
                        moves[5] = true;
                    }
                }
                var passant = selected.id;
                if ((selected.piece[0] == '♙' || selected.piece[0] == '♟') && Math.abs(id - selected.id) == 16) {
                    if (Math.floor(id / 8) == 4) {
                        passant -= 8;
                    } else if (Math.floor(id / 8) == 3) {
                        passant += 8;
                    }
                } else {
                    passant = -1;
                }
                if (value.startsWith('e') && selected.piece[0] != '♙' && selected.piece[0] != '♟') {
                    setCount(prev => prev + 1);
                } else {
                    setCount(0);
                }
                setRest();
                setPlayer();
                setArray(selected.id, id);
                setSelected({ id: selected.id, value: false, piece: selected.piece, blockedArray: selected.blockedArray, moved: moves, passant: passant });
            }
        } else {
            setSelected({ id: id, value: true, piece: value.slice(0, value.lastIndexOf('e')), blockedArray: selected.blockedArray, moved: selected.moved, passant: selected.passant });
        }
    }

    const handleHover = () => {
        var rest = parseInt(value.slice(value.lastIndexOf('r') + 1, value.lastIndexOf('e')))
        setCellHover(value.startsWith('e') ? ("Cell " + String.fromCharCode(97 + (id % 8)) + (8 - Math.floor(id / 8)).toString() +
            "\nElevation: " + value.slice(1)) : ("Cell " + String.fromCharCode(97 + (id % 8)) + (8 - Math.floor(id / 8)).toString() +
                "\nPiece: " + value[0] + "\nHit Points: " + value.slice(value.lastIndexOf('h') + 1, value.lastIndexOf('r')) + "\nRest: " +
            (rest <= 5 ? '0' : (Math.ceil((rest - 5) / 3)).toString()) + " moves\nElevation: " +
            value.slice(value.lastIndexOf('e') + 1)));
    }

    const blackSelect = player == 'Black' && value[0] != '♟' && value[0] != '♜' && value[0] != '♞' && value[0] != '♝' && value[0] != '♛' && value[0] != '♚';
    const whiteSelect = player == 'White' && value[0] != '♙' && value[0] != '♖' && value[0] != '♘' && value[0] != '♗' && value[0] != '♕' && value[0] != '♔';
    const blackCastle = selected.piece[0] == '♚' ? (checkForCastle(4, 0) ? id != 2 : true) && (checkForCastle(4, 7) ? id != 6 : true) : true;
    const whiteCastle = selected.piece[0] == '♔' ? (checkForCastle(60, 56) ? id != 58 : true) && (checkForCastle(60, 63) ? id != 62 : true) : true;
    const blackPassant = (id != selected.passant || id != selected.id + 7) && (id != selected.passant || id != selected.id + 9);
    const whitePassant = (id != selected.passant || id != selected.id - 7) && (id != selected.passant || id != selected.id - 9);
    const select = !selected.value && (selected.blockedArray.some(val => (id == val)) || (blackSelect || whiteSelect));
    const movement = selected.value && (!checkForMovement(selected.id).some(val => (id == val)) &&
        (player == 'Black' ? (selected.piece[0] == '♟' ? blackPassant : blackCastle) : (selected.piece[0] == '♙' ? whitePassant : whiteCastle)));

    return (<button className={(selected.value ? "cel5" : "cell5") + String.fromCharCode(96 + parseInt(value.slice(value.lastIndexOf('e') + 1)))} onClick={handleClick}
        onMouseOver={handleHover} disabled={select || movement || state.length > 5}>{value[0] != 'e' ? value[0] : ''}</button>);
};

export function Chss3Sidebar(props) {
    const { reset, history, hover } = props;

    return (
        <div>
            <div>
                <button className="resetButton" onClick={() => reset(false)}>Reset</button>
            </div>
            <br />
            <div>
                <button className="resetButton" onClick={() => reset(true)}>Reset and Randomise</button>
            </div>
            <br />
            <div>Cell Information:</div>
            <div className="moveHistory">{hover}</div>
            <br />
            <div>Move History:</div>
            <div className="moveHistory">{history}</div>
        </div>
    );
}

export default function Chess3(props) {
    const { state, setState, values, setValues, setHistory, selected, setSelected, count, setCount, repetitions, setRepetitions, setCellHover } = props;

    const player = state.slice(0, 5);

    useEffect(() => {
        checkForReps();
    }, [values]);

    useEffect(() => {
        checkForMate();
    }, [repetitions]);

    const upArray = [-1, -1, -1, -1, -1, -1, -1, -1,
        0, 1, 2, 3, 4, 5, 6, 7,
        8, 9, 10, 11, 12, 13, 14, 15,
        16, 17, 18, 19, 20, 21, 22, 23,
        24, 25, 26, 27, 28, 29, 30, 31,
        32, 33, 34, 35, 36, 37, 38, 39,
        40, 41, 42, 43, 44, 45, 46, 47,
        48, 49, 50, 51, 52, 53, 54, 55];

    const downArray = [8, 9, 10, 11, 12, 13, 14, 15,
        16, 17, 18, 19, 20, 21, 22, 23,
        24, 25, 26, 27, 28, 29, 30, 31,
        32, 33, 34, 35, 36, 37, 38, 39,
        40, 41, 42, 43, 44, 45, 46, 47,
        48, 49, 50, 51, 52, 53, 54, 55,
        56, 57, 58, 59, 60, 61, 62, 63,
        -1, -1, -1, -1, -1, -1, -1, -1];

    const leftArray = [-1, 0, 1, 2, 3, 4, 5, 6,
        -1, 8, 9, 10, 11, 12, 13, 14,
        -1, 16, 17, 18, 19, 20, 21, 22,
        -1, 24, 25, 26, 27, 28, 29, 30,
        -1, 32, 33, 34, 35, 36, 37, 38,
        -1, 40, 41, 42, 43, 44, 45, 46,
        -1, 48, 49, 50, 51, 52, 53, 54,
        -1, 56, 57, 58, 59, 60, 61, 62];

    const rightArray = [1, 2, 3, 4, 5, 6, 7, -1,
        9, 10, 11, 12, 13, 14, 15, -1,
        17, 18, 19, 20, 21, 22, 23, -1,
        25, 26, 27, 28, 29, 30, 31, -1,
        33, 34, 35, 36, 37, 38, 39, -1,
        41, 42, 43, 44, 45, 46, 47, -1,
        49, 50, 51, 52, 53, 54, 55, -1,
        57, 58, 59, 60, 61, 62, 63, -1];

    const whitePieces = (piece) => {
        if (piece != undefined) {
            return piece[0] == '♙' || piece[0] == '♖' || piece[0] == '♘' || piece[0] == '♗' || piece[0] == '♕' || piece[0] == '♔';
        }
    }

    const blackPieces = (piece) => {
        if (piece != undefined) {
            return piece[0] == '♟' || piece[0] == '♜' || piece[0] == '♞' || piece[0] == '♝' || piece[0] == '♛' || piece[0] == '♚';
        }
    }

    const checkForPiece = (piece, array) => {
        var aa = values.findIndex(value => value[0] == piece);
        var bb = values.findLastIndex(value => value[0] == piece);
        if (aa == bb && aa != -1) {
            array.push(aa);
        } else if (aa != -1) {
            array.push(aa);
            array.push(bb);
        }
    }

    const arrayModifier = (id, newVal) => {
        setValues(values => values.map((value, index) => (index == id ? newVal + value.slice(value.lastIndexOf('e')) : value)));
    }

    const moveModifier = (ida, idb) => {
        var pa = values[ida][0];
        var ha = parseInt(values[ida].slice(values[ida].lastIndexOf('h') + 1, values[ida].lastIndexOf('r')));
        var ra = parseInt(values[ida].slice(values[ida].lastIndexOf('r') + 1, values[ida].lastIndexOf('e')));
        var ea = parseInt(values[ida].slice(values[ida].lastIndexOf('e') + 1));
        var eb = parseInt(values[idb].slice(values[idb].lastIndexOf('e') + 1));
        var el = eb - ea;
        if (values[idb].startsWith('e')) {
            if ((pa == '♙' || pa == '♟') && (Math.abs(ida - idb) == 7 || Math.abs(ida - idb) == 9)) {
                var dm = ha * 4;
                if (Math.floor(idb / 8) == 2) {
                    var pb = values[idb + 8][0];
                    var hb = parseInt(values[idb + 8].slice(values[idb + 8].lastIndexOf('h') + 1, values[idb + 8].lastIndexOf('r')));
                    var rb = parseInt(values[idb + 8].slice(values[idb + 8].lastIndexOf('r') + 1, values[idb + 8].lastIndexOf('e')));
                    var ec = parseInt(values[idb + 8].slice(values[idb + 8].lastIndexOf('e') + 1));
                    var ef = ec - ea;
                    switch (ef) {
                        case -7:
                            dm *= 0.2;
                            break;
                        case -6:
                            dm *= 0.25;
                            break;
                        case -5:
                            dm *= 0.32;
                            break;
                        case -4:
                            dm *= 0.4;
                            break;
                        case -3:
                            dm *= 0.5;
                            break;
                        case -2:
                            dm *= 0.625;
                            break;
                        case -1:
                            dm *= 0.8;
                            break;
                        case 0:
                        default:
                            break;
                        case 1:
                            dm *= 1.25;
                            break;
                        case 2:
                            dm *= 1.6;
                            break;
                        case 3:
                            dm *= 2;
                            break;
                        case 4:
                            dm *= 2.5;
                            break;
                        case 5:
                            dm *= 3.125;
                            break;
                        case 6:
                            dm *= 4;
                            break;
                        case 7:
                            dm *= 5;
                            break;
                    }
                    var fp = hb - dm;
                    arrayModifier(idb + 8, fp > 0 ? (pb + 'h' + fp.toString() + 'r' + rb) : '');
                } else if (Math.floor(idb / 8) == 5) {
                    var pb = values[idb - 8][0];
                    var hb = parseInt(values[idb - 8].slice(values[idb - 8].lastIndexOf('h') + 1, values[idb - 8].lastIndexOf('r')));
                    var rb = parseInt(values[idb - 8].slice(values[idb - 8].lastIndexOf('r') + 1, values[idb - 8].lastIndexOf('e')));
                    var ec = parseInt(values[idb - 8].slice(values[idb - 8].lastIndexOf('e') + 1));
                    var ef = ec - ea;
                    switch (ef) {
                        case -7:
                            dm *= 0.2;
                            break;
                        case -6:
                            dm *= 0.25;
                            break;
                        case -5:
                            dm *= 0.32;
                            break;
                        case -4:
                            dm *= 0.4;
                            break;
                        case -3:
                            dm *= 0.5;
                            break;
                        case -2:
                            dm *= 0.625;
                            break;
                        case -1:
                            dm *= 0.8;
                            break;
                        case 0:
                        default:
                            break;
                        case 1:
                            dm *= 1.25;
                            break;
                        case 2:
                            dm *= 1.6;
                            break;
                        case 3:
                            dm *= 2;
                            break;
                        case 4:
                            dm *= 2.5;
                            break;
                        case 5:
                            dm *= 3.125;
                            break;
                        case 6:
                            dm *= 4;
                            break;
                        case 7:
                            dm *= 5;
                            break;
                    }
                    var fp = hb - dm;
                    arrayModifier(idb - 8, fp > 0 ? (pb + 'h' + fp.toString() + 'r' + rb) : '');
                }
            } else if ((pa == '♔' || pa == '♚') && Math.abs(ida - idb) == 2) {
                if (idb == 2) {
                    var pb = values[0][0];
                    var hb = parseInt(values[0].slice(values[0].lastIndexOf('h') + 1, values[0].lastIndexOf('r')));
                    var rb = parseInt(values[0].slice(values[0].lastIndexOf('r') + 1, values[0].lastIndexOf('e')));
                    var ec = parseInt(values[0].slice(values[0].lastIndexOf('e') + 1));
                    var ed = parseInt(values[3].slice(values[3].lastIndexOf('e') + 1));
                    var ef = ed - ec;
                    arrayModifier(0, '');
                    arrayModifier(3, pb + 'h' + hb + 'r' + (rb + (ef > 0 ? (ef * 5) : 0)).toString());
                } else if (idb == 6) {
                    var pb = values[7][0];
                    var hb = parseInt(values[7].slice(values[7].lastIndexOf('h') + 1, values[7].lastIndexOf('r')));
                    var rb = parseInt(values[7].slice(values[7].lastIndexOf('r') + 1, values[7].lastIndexOf('e')));
                    var ec = parseInt(values[7].slice(values[7].lastIndexOf('e') + 1));
                    var ed = parseInt(values[5].slice(values[5].lastIndexOf('e') + 1));
                    var ef = ed - ec;
                    arrayModifier(7, '');
                    arrayModifier(5, pb + 'h' + hb + 'r' + (rb + (ef > 0 ? (ef * 5) : 0)).toString());
                } else if (idb == 58) {
                    var pb = values[56][0];
                    var hb = parseInt(values[56].slice(values[56].lastIndexOf('h') + 1, values[56].lastIndexOf('r')));
                    var rb = parseInt(values[56].slice(values[56].lastIndexOf('r') + 1, values[56].lastIndexOf('e')));
                    var ec = parseInt(values[56].slice(values[56].lastIndexOf('e') + 1));
                    var ed = parseInt(values[59].slice(values[59].lastIndexOf('e') + 1));
                    var ef = ed - ec;
                    arrayModifier(56, '');
                    arrayModifier(59, pb + 'h' + hb + 'r' + (rb + (ef > 0 ? (ef * 5) : 0)).toString());
                } else if (idb == 62) {
                    var pb = values[idb - 8][0];
                    var hb = parseInt(values[63].slice(values[63].lastIndexOf('h') + 1, values[63].lastIndexOf('r')));
                    var rb = parseInt(values[63].slice(values[63].lastIndexOf('r') + 1, values[63].lastIndexOf('e')));
                    var ec = parseInt(values[63].slice(values[63].lastIndexOf('e') + 1));
                    var ed = parseInt(values[61].slice(values[61].lastIndexOf('e') + 1));
                    var ef = ed - ec;
                    arrayModifier(63, '');
                    arrayModifier(61, pb + 'h' + hb + 'r' + (rb + (ef > 0 ? (ef * 5) : 0)).toString());
                }
            }
            arrayModifier(ida, '');
            if (idb < 8 && pa == '♙') {
                arrayModifier(idb, '♕h' + (ha * 4).toString() + 'r' + (ra + (el > 0 ? (el * 5) : 0)).toString());
            } else if (idb > 55 && pa == '♟') {
                arrayModifier(idb, '♛h' + (ha * 4).toString() + 'r' + (ra + (el > 0 ? (el * 5) : 0)).toString());
            } else {
                arrayModifier(idb, pa + 'h' + ha + 'r' + (ra + (el > 0 ? (el * 5) : 0)).toString());
            }
        } else {
            var pb = values[idb][0];
            var hb = parseInt(values[idb].slice(values[idb].lastIndexOf('h') + 1, values[idb].lastIndexOf('r')));
            var rb = parseInt(values[idb].slice(values[idb].lastIndexOf('r') + 1, values[idb].lastIndexOf('e')));
            if ((pa == '♖' && whitePieces(pb)) || (pa == '♜' && blackPieces(pb))) {
                arrayModifier(ida, '');
                arrayModifier(idb, pa + 'h' + (ha + hb).toString() + 'r' + (ra + (el > 0 ? (el * 5) : 0)).toString());
            } else {
                var df = Math.abs(ida - idb);
                var dm = ha;
                switch (el) {
                    case -7:
                        dm *= 0.2;
                        break;
                    case -6:
                        dm *= 0.25;
                        break;
                    case -5:
                        dm *= 0.32;
                        break;
                    case -4:
                        dm *= 0.4;
                        break;
                    case -3:
                        dm *= 0.5;
                        break;
                    case -2:
                        dm *= 0.625;
                        break;
                    case -1:
                        dm *= 0.8;
                        break;
                    case 0:
                    default:
                        break;
                    case 1:
                        dm *= 1.25;
                        break;
                    case 2:
                        dm *= 1.6;
                        break;
                    case 3:
                        dm *= 2;
                        break;
                    case 4:
                        dm *= 2.5;
                        break;
                    case 5:
                        dm *= 3.125;
                        break;
                    case 6:
                        dm *= 4;
                        break;
                    case 7:
                        dm *= 5;
                        break;
                }
                switch (pa) {
                    case '♔':
                    case '♚':
                    case '♘':
                    case '♞':
                        dm *= 2;
                        break;
                    case '♕':
                    case '♛':
                        switch (df) {
                            case 1:
                            case 8:
                            case 4:
                            case 32:
                            case 9:
                            case 21:
                            case 27:
                                dm *= 1.5;
                                break;
                            case 3:
                            case 24:
                                dm *= 1.25;
                                break;
                            case 5:
                            case 40:
                            case 28:
                            case 36:
                                dm *= 2;
                                break;
                            case 6:
                            case 48:
                            case 35:
                            case 45:
                                dm *= 2.5;
                                break;
                            case 56:
                            case 42:
                            case 54:
                                dm *= 3;
                                break;
                            case 7:
                                if (Math.floor(ida / 8) == Math.floor(idb / 8)) {
                                    dm *= 3;
                                } else {
                                    dm *= 1.5;
                                }
                                break;
                            case 49:
                            case 63:
                                dm *= 4;
                                break;
                            default:
                                break;
                        }
                        break;
                    case '♗':
                    case '♝':
                        switch (df) {
                            case 7:
                            case 9:
                                if ((pa == '♗' && whitePieces(pb)) || (pa == '♝' && blackPieces(pb))) {
                                    dm *= -1;
                                } else {
                                    dm *= 3;
                                }
                                break;
                            case 14:
                            case 18:
                                if ((pa == '♗' && whitePieces(pb)) || (pa == '♝' && blackPieces(pb))) {
                                    dm *= -0.5;
                                } else {
                                    dm *= 2;
                                }
                                break;
                            case 21:
                            case 27:
                                dm *= 2;
                                break;
                            case 28:
                            case 36:
                                dm *= 3;
                                break;
                            case 35:
                            case 45:
                                dm *= 5;
                                break;
                            case 42:
                            case 54:
                                dm *= 7;
                                break;
                            case 49:
                            case 63:
                                dm *= 10;
                                break;
                            default:
                                break;
                        }
                        break;
                    case '♖':
                    case '♜':
                        switch (df) {
                            case 1:
                            case 8:
                            case 4:
                            case 32:
                                dm *= 2;
                                break;
                            case 3:
                            case 24:
                                dm *= 1.5;
                                break;
                            case 5:
                            case 40:
                                dm *= 3;
                                break;
                            case 6:
                            case 48:
                                dm *= 4;
                                break;
                            case 7:
                            case 56:
                                dm *= 5;
                                break;
                            default:
                                break;
                        }
                        break;
                    case '♙':
                    case '♟':
                        switch (df) {
                            case 7:
                            case 9:
                                dm *= 2;
                                break;
                            case 8:
                                dm *= 0.25;
                                break;
                            case 16:
                                dm *= 0.5;
                                break;
                            default:
                                break;
                        }
                        break;
                    default:
                        break;
                }
                var dn = hb;
                switch (-el) {
                    case -7:
                        dn *= 0.2;
                        break;
                    case -6:
                        dn *= 0.25;
                        break;
                    case -5:
                        dn *= 0.32;
                        break;
                    case -4:
                        dn *= 0.4;
                        break;
                    case -3:
                        dn *= 0.5;
                        break;
                    case -2:
                        dn *= 0.625;
                        break;
                    case -1:
                        dn *= 0.8;
                        break;
                    case 0:
                    default:
                        break;
                    case 1:
                        dn *= 1.25;
                        break;
                    case 2:
                        dn *= 1.6;
                        break;
                    case 3:
                        dn *= 2;
                        break;
                    case 4:
                        dn *= 2.5;
                        break;
                    case 5:
                        dn *= 3.125;
                        break;
                    case 6:
                        dn *= 4;
                        break;
                    case 7:
                        dn *= 5;
                        break;
                }
                switch (pb) {
                    case '♔':
                    case '♚':
                    case '♘':
                    case '♞':
                    default:
                        break;
                    case '♕':
                    case '♛':
                        switch (df) {
                            case 1:
                            case 8:
                            case 4:
                            case 32:
                            case 9:
                            case 21:
                            case 27:
                                dn *= 0.75;
                                break;
                            case 3:
                            case 24:
                                dn *= 0.625;
                                break;
                            case 5:
                            case 40:
                            case 28:
                            case 36:
                                break;
                            case 6:
                            case 48:
                            case 35:
                            case 45:
                                dn *= 1.25;
                                break;
                            case 56:
                            case 42:
                            case 54:
                                dn *= 1.5;
                                break;
                            case 7:
                                if (Math.floor(ida / 8) == Math.floor(idb / 8)) {
                                    dn *= 1.5;
                                } else {
                                    dn *= 0.75;
                                }
                                break;
                            case 49:
                            case 63:
                                dn *= 2;
                                break;
                            default:
                                break;
                        }
                        break;
                    case '♗':
                    case '♝':
                        switch (df) {
                            case 7:
                            case 9:
                            case 28:
                            case 36:
                                dn *= 1.5;
                                break;
                            case 14:
                            case 18:
                            case 21:
                            case 27:
                            default:
                                break;
                            case 35:
                            case 45:
                                dn *= 2.5;
                                break;
                            case 42:
                            case 54:
                                dn *= 3.5;
                                break;
                            case 49:
                            case 63:
                                dn *= 5;
                                break;
                        }
                        break;
                    case '♖':
                    case '♜':
                        dn *= 0.75;
                    case '♙':
                    case '♟':
                        dn *= 0.5;
                        break;
                }
                var fg = hb - dm;
                var fc = ha - dn;
                if (fg > 0) {
                    arrayModifier(idb, pb + 'h' + fg.toString() + 'r' + rb.toString());
                    if ((pa == '♗' && whitePieces(pb)) || (pa == '♝' && blackPieces(pb))) {
                        arrayModifier(ida, pa + 'h' + (ha * 0.875).toString() + 'r' + (ra + (Math.abs(Math.floor(ida / 8) - Math.floor(idb / 8)) * 7)).toString());
                    } else {
                        if (pa == '♗' || pa == '♝' || pa == '♕' || pa == '♛') {
                            if (pb == '♗' || pb == '♝' || pb == '♕' || pb == '♛' || df == 7 || df == 9 || df == 1 || df == 8) {
                                arrayModifier(ida, fc > 0 ? (pa + 'h' + fc.toString() + 'r' + (ra + (Math.abs(Math.floor(ida / 8) - Math.floor(idb / 8)) * 7)).toString()) : '');
                            } else {
                                arrayModifier(ida, pa + 'h' + ha.toString() + 'r' + (ra + (Math.abs(Math.floor(ida / 8) - Math.floor(idb / 8)) * 7)).toString());
                            }
                        } else {
                            arrayModifier(ida, fc > 0 ? (pa + 'h' + fc.toString() + 'r' + (ra + (el > 0 ? (el * 5) : 0)).toString()) : '');
                        }
                    }
                } else {
                    if ((pa == '♖' || pa == '♜') && (df == 1 || df == 8)) {
                        arrayModifier(ida, fc > 40 ? (pa + 'h' + (fc - 40).toString() + 'r' + (ra + (el > 0 ? (el * 5) : 0)).toString()) : '');
                        arrayModifier(idb, fc > 40 ? ((pa == '♖' ? '♙' : '♟') + 'h40r5') : (fc > 0 ? (pa + 'h' + fc.toString() + 'r' + (ra + (el > 0 ? (el * 5) : 0)).toString()) : ''));
                    } else {
                        if (pa == '♗' || pa == '♝' || pa == '♕' || pa == '♛') {
                            if (pb == '♗' || pb == '♝' || pb == '♕' || pb == '♛' || df == 7 || df == 9 || df == 1 || df == 8) {
                                arrayModifier(ida, fc > 0 ? (pa + 'h' + fc.toString() + 'r' + (ra + (Math.abs(Math.floor(ida / 8) - Math.floor(idb / 8)) * 7)).toString()) : '');
                            } else {
                                arrayModifier(ida, pa + 'h' + ha.toString() + 'r' + (ra + (Math.abs(Math.floor(ida / 8) - Math.floor(idb / 8)) * 7)).toString());
                            }
                            arrayModifier(idb, '');
                        } else {
                            arrayModifier(ida, '');
                            if (idb < 8 && pa == '♙') {
                                arrayModifier(idb, '♕h' + (fc * 4).toString() + 'r' + (ra + (el > 0 ? (el * 5) : 0)).toString());
                            } else if (idb > 55 && pa == '♟') {
                                arrayModifier(idb, '♛h' + (fc * 4).toString() + 'r' + (ra + (el > 0 ? (el * 5) : 0)).toString());
                            } else {
                                arrayModifier(idb, pa + 'h' + fc.toString() + 'r' + (ra + (el > 0 ? (el * 5) : 0)).toString());
                            }
                        }
                    }
                }
            }
        }
    }

    const restModifier = () => {
        setValues(values => values.map(value => {
            if (value.startsWith('e')) {
                return value;
            } else {
                var beginfo = value.slice(0, value.lastIndexOf('r') + 1);
                var rest = parseInt(value.slice(value.lastIndexOf('r') + 1, value.lastIndexOf('e')));
                var endfo = value.slice(value.lastIndexOf('e'));
                if (rest < 3) {
                    return beginfo + '0' + endfo;
                } else {
                    return beginfo + (rest - 3).toString() + endfo;
                }
            }
        }));
    }

    const playerModifier = () => {
        setState(prev => prev.slice(0, 5) == 'White' ? 'Black' : 'White');
    }

    const histModifier = (piece, id, capture, fromID, passant, promote, castle) => {
        if (castle) {
            switch (id) {
                case 6:
                case 62:
                default:
                    var zeroth = ' 0-0';
                    break;
                case 2:
                case 58:
                    var zeroth = ' 0-0-0';
                    break;
            }
        }
        switch (piece) {
            case '♔':
            case '♚':
                var first = ' K';
                break;
            case '♕':
            case '♛':
            case '♗':
            case '♝':
            case '♘':
            case '♞':
            case '♖':
            case '♜':
                switch (piece) {
                    case '♕':
                    case '♛':
                        var first = ' Q';
                        break;
                    case '♗':
                    case '♝':
                        var first = ' B';
                        break;
                    case '♘':
                    case '♞':
                        var first = ' N';
                        break;
                    case '♖':
                    case '♜':
                        var first = ' R';
                        break;
                }
                switch (fromID % 8) {
                    case 0:
                    default:
                        first += 'a';
                        break;
                    case 1:
                        first += 'b';
                        break;
                    case 2:
                        first += 'c';
                        break;
                    case 3:
                        first += 'd';
                        break;
                    case 4:
                        first += 'e';
                        break;
                    case 5:
                        first += 'f';
                        break;
                    case 6:
                        first += 'g';
                        break;
                    case 7:
                        first += 'h';
                        break;
                }
                first += (8 - Math.floor(fromID / 8)).toString();
                break;
            case '♙':
            case '♟':
            default:
                if (capture || passant) {
                    switch (fromID % 8) {
                        case 0:
                        default:
                            var first = ' a';
                            break;
                        case 1:
                            var first = ' b';
                            break;
                        case 2:
                            var first = ' c';
                            break;
                        case 3:
                            var first = ' d';
                            break;
                        case 4:
                            var first = ' e';
                            break;
                        case 5:
                            var first = ' f';
                            break;
                        case 6:
                            var first = ' g';
                            break;
                        case 7:
                            var first = ' h';
                            break;
                    }
                } else {
                    var first = ' ';
                }
                break;
        }
        switch (id % 8) {
            case 0:
            default:
                var second = 'a';
                break;
            case 1:
                var second = 'b';
                break;
            case 2:
                var second = 'c';
                break;
            case 3:
                var second = 'd';
                break;
            case 4:
                var second = 'e';
                break;
            case 5:
                var second = 'f';
                break;
            case 6:
                var second = 'g';
                break;
            case 7:
                var second = 'h';
                break;
        }
        setHistory(prev => player + (castle ? zeroth : (first + (capture || passant ? 'x' : '') + second + (8 - Math.floor(id / 8)).toString() + (promote ? '=Q' : '') + (passant ? ' e.p.' : ''))) + '\n' + prev);
    }

    const checkForBlocked = () => {
        var blockedArray = [];
        values.forEach((_noth, index) => {
            var a = checkForMovement(index);
            if (a.length <= 1) {
                blockedArray.push(index);
            }
        });
        setSelected({ id: selected.id, value: selected.value, piece: selected.piece, blockedArray: blockedArray, moved: selected.moved, passant: selected.passant });
        return blockedArray;
    }

    const checkForCastle = (kingIndex, rookIndex) => {
        if (kingIndex == 60 && !selected.moved[0]) {
            // white king
            if (rookIndex == 56 && !selected.moved[2]) {
                // left rook
                if (values[59] == '' && values[58] == '' && values[57] == '') {
                    return true;
                }
            } else if (rookIndex == 63 && !selected.moved[3]) {
                // right rook
                if (values[61] == '' && values[62] == '') {
                    return true;
                }
            }
        } else if (kingIndex == 4 && !selected.moved[1]) {
            // black king
            if (rookIndex == 0 && !selected.moved[4]) {
                // left rook
                if (values[3] == '' && values[2] == '' && values[1] == '') {
                    return true;
                }
            } else if (rookIndex == 7 && !selected.moved[5]) {
                // right rook
                if (values[5] == '' && values[6] == '') {
                    return true;
                }
            }
        }
        return false;
    }

    const checkForMovement = (index) => {
        var moveArray = [];
        moveArray.push(index);
        var rest = parseInt(values[index].slice(values[index].lastIndexOf('r') + 1, values[index].lastIndexOf('e')));
        if (rest <= 5) {
            switch (values[index][0]) {
                // White Pawn Movement
                case '♙':
                    if (blackPieces(values[upArray[rightArray[index]]])) {
                        moveArray.push(upArray[rightArray[index]]);
                    }
                    if (blackPieces(values[upArray[leftArray[index]]])) {
                        moveArray.push(upArray[leftArray[index]]);
                    }
                    if (!whitePieces(values[upArray[index]])) {
                        moveArray.push(upArray[index]);
                        if (Math.floor(index / 8) == 6 && !whitePieces(values[upArray[upArray[index]]])) {
                            moveArray.push(upArray[upArray[index]]);
                        }
                    }
                    break;
                // Black Pawn Movement
                case '♟':
                    if (whitePieces(values[downArray[leftArray[index]]])) {
                        moveArray.push(downArray[leftArray[index]]);
                    }
                    if (whitePieces(values[downArray[rightArray[index]]])) {
                        moveArray.push(downArray[rightArray[index]]);
                    }
                    if (!blackPieces(values[downArray[index]])) {
                        moveArray.push(downArray[index]);
                        if (Math.floor(index / 8) == 1 && !blackPieces(values[downArray[downArray[index]]])) {
                            moveArray.push(downArray[downArray[index]]);
                        }
                    }
                    break;
                // White Rook Movement
                case '♖':
                    for (let i = upArray[index]; i > -1; i = upArray[i]) {
                        if (values[i].startsWith('e')) {
                            moveArray.push(i);
                        } else {
                            if (blackPieces(values[i])) {
                                moveArray.push(i);
                            } else if (i == upArray[index]) {
                                moveArray.push(i);
                            }
                            break;
                        }
                    }
                    for (let i = downArray[index]; i > -1; i = downArray[i]) {
                        if (values[i].startsWith('e')) {
                            moveArray.push(i);
                        } else {
                            if (blackPieces(values[i])) {
                                moveArray.push(i);
                            } else if (i == downArray[index]) {
                                moveArray.push(i);
                            }
                            break;
                        }
                    }
                    for (let i = leftArray[index]; i > -1; i = leftArray[i]) {
                        if (values[i].startsWith('e')) {
                            moveArray.push(i);
                        } else {
                            if (blackPieces(values[i])) {
                                moveArray.push(i);
                            } else if (i == leftArray[index]) {
                                moveArray.push(i);
                            }
                            break;
                        }
                    }
                    for (let i = rightArray[index]; i > -1; i = rightArray[i]) {
                        if (values[i].startsWith('e')) {
                            moveArray.push(i);
                        } else {
                            if (blackPieces(values[i])) {
                                moveArray.push(i);
                            } else if (i == rightArray[index]) {
                                moveArray.push(i);
                            }
                            break;
                        }
                    }
                    break;
                // Black Rook Movement
                case '♜':
                    for (let i = upArray[index]; i > -1; i = upArray[i]) {
                        if (values[i].startsWith('e')) {
                            moveArray.push(i);
                        } else {
                            if (whitePieces(values[i])) {
                                moveArray.push(i);
                            } else if (i == upArray[index]) {
                                moveArray.push(i);
                            }
                            break;
                        }
                    }
                    for (let i = downArray[index]; i > -1; i = downArray[i]) {
                        if (values[i].startsWith('e')) {
                            moveArray.push(i);
                        } else {
                            if (whitePieces(values[i])) {
                                moveArray.push(i);
                            } else if (i == downArray[index]) {
                                moveArray.push(i);
                            }
                            break;
                        }
                    }
                    for (let i = leftArray[index]; i > -1; i = leftArray[i]) {
                        if (values[i].startsWith('e')) {
                            moveArray.push(i);
                        } else {
                            if (whitePieces(values[i])) {
                                moveArray.push(i);
                            } else if (i == leftArray[index]) {
                                moveArray.push(i);
                            }
                            break;
                        }
                    }
                    for (let i = rightArray[index]; i > -1; i = rightArray[i]) {
                        if (values[i].startsWith('e')) {
                            moveArray.push(i);
                        } else {
                            if (whitePieces(values[i])) {
                                moveArray.push(i);
                            } else if (i == rightArray[index]) {
                                moveArray.push(i);
                            }
                            break;
                        }
                    }
                    break;
                // White Knight Movement
                case '♘':
                    if ((values[upArray[leftArray[leftArray[index]]]] != undefined && values[upArray[leftArray[leftArray[index]]]].startsWith('e')) || blackPieces(values[upArray[leftArray[leftArray[index]]]])) {
                        moveArray.push(upArray[leftArray[leftArray[index]]]);
                    }
                    if ((values[downArray[leftArray[leftArray[index]]]] != undefined && values[downArray[leftArray[leftArray[index]]]].startsWith('e')) || blackPieces(values[downArray[leftArray[leftArray[index]]]])) {
                        moveArray.push(downArray[leftArray[leftArray[index]]]);
                    }
                    if ((values[upArray[upArray[leftArray[index]]]] != undefined && values[upArray[upArray[leftArray[index]]]].startsWith('e')) || blackPieces(values[upArray[upArray[leftArray[index]]]])) {
                        moveArray.push(upArray[upArray[leftArray[index]]]);
                    }
                    if ((values[downArray[downArray[leftArray[index]]]] != undefined && values[downArray[downArray[leftArray[index]]]].startsWith('e')) || blackPieces(values[downArray[downArray[leftArray[index]]]])) {
                        moveArray.push(downArray[downArray[leftArray[index]]]);
                    }
                    if ((values[upArray[rightArray[rightArray[index]]]] != undefined && values[upArray[rightArray[rightArray[index]]]].startsWith('e')) || blackPieces(values[upArray[rightArray[rightArray[index]]]])) {
                        moveArray.push(upArray[rightArray[rightArray[index]]]);
                    }
                    if ((values[downArray[rightArray[rightArray[index]]]] != undefined && values[downArray[rightArray[rightArray[index]]]].startsWith('e')) || blackPieces(values[downArray[rightArray[rightArray[index]]]])) {
                        moveArray.push(downArray[rightArray[rightArray[index]]]);
                    }
                    if ((values[upArray[upArray[rightArray[index]]]] != undefined && values[upArray[upArray[rightArray[index]]]].startsWith('e')) || blackPieces(values[upArray[upArray[rightArray[index]]]])) {
                        moveArray.push(upArray[upArray[rightArray[index]]]);
                    }
                    if ((values[downArray[downArray[rightArray[index]]]] != undefined && values[downArray[downArray[rightArray[index]]]].startsWith('e')) || blackPieces(values[downArray[downArray[rightArray[index]]]])) {
                        moveArray.push(downArray[downArray[rightArray[index]]]);
                    }
                    break;
                // Black Knight Movement
                case '♞':
                    if ((values[upArray[leftArray[leftArray[index]]]] != undefined && values[upArray[leftArray[leftArray[index]]]].startsWith('e')) || whitePieces(values[upArray[leftArray[leftArray[index]]]])) {
                        moveArray.push(upArray[leftArray[leftArray[index]]]);
                    }
                    if ((values[downArray[leftArray[leftArray[index]]]] != undefined && values[downArray[leftArray[leftArray[index]]]].startsWith('e')) || whitePieces(values[downArray[leftArray[leftArray[index]]]])) {
                        moveArray.push(downArray[leftArray[leftArray[index]]]);
                    }
                    if ((values[upArray[upArray[leftArray[index]]]] != undefined && values[upArray[upArray[leftArray[index]]]].startsWith('e')) || whitePieces(values[upArray[upArray[leftArray[index]]]])) {
                        moveArray.push(upArray[upArray[leftArray[index]]]);
                    }
                    if ((values[downArray[downArray[leftArray[index]]]] != undefined && values[downArray[downArray[leftArray[index]]]].startsWith('e')) || whitePieces(values[downArray[downArray[leftArray[index]]]])) {
                        moveArray.push(downArray[downArray[leftArray[index]]]);
                    }
                    if ((values[upArray[rightArray[rightArray[index]]]] != undefined && values[upArray[rightArray[rightArray[index]]]].startsWith('e')) || whitePieces(values[upArray[rightArray[rightArray[index]]]])) {
                        moveArray.push(upArray[rightArray[rightArray[index]]]);
                    }
                    if ((values[downArray[rightArray[rightArray[index]]]] != undefined && values[downArray[rightArray[rightArray[index]]]].startsWith('e')) || whitePieces(values[downArray[rightArray[rightArray[index]]]])) {
                        moveArray.push(downArray[rightArray[rightArray[index]]]);
                    }
                    if ((values[upArray[upArray[rightArray[index]]]] != undefined && values[upArray[upArray[rightArray[index]]]].startsWith('e')) || whitePieces(values[upArray[upArray[rightArray[index]]]])) {
                        moveArray.push(upArray[upArray[rightArray[index]]]);
                    }
                    if ((values[downArray[downArray[rightArray[index]]]] != undefined && values[downArray[downArray[rightArray[index]]]].startsWith('e')) || whitePieces(values[downArray[downArray[rightArray[index]]]])) {
                        moveArray.push(downArray[downArray[rightArray[index]]]);
                    }
                    break;
                // White Bishop Movement
                case '♗':
                    for (let i = upArray[leftArray[index]]; i > -1; i = upArray[leftArray[i]]) {
                        if (values[i].startsWith('e')) {
                            moveArray.push(i);
                        } else {
                            if (blackPieces(values[i])) {
                                moveArray.push(i);
                            } else if (i == upArray[leftArray[index]]) {
                                moveArray.push(i);
                            } else if (i == upArray[leftArray[upArray[leftArray[index]]]]) {
                                moveArray.push(i);
                            }
                            break;
                        }
                    }
                    for (let i = downArray[rightArray[index]]; i > -1; i = downArray[rightArray[i]]) {
                        if (values[i].startsWith('e')) {
                            moveArray.push(i);
                        } else {
                            if (blackPieces(values[i])) {
                                moveArray.push(i);
                            } else if (i == downArray[rightArray[index]]) {
                                moveArray.push(i);
                            } else if (i == downArray[rightArray[downArray[rightArray[index]]]]) {
                                moveArray.push(i);
                            }
                            break;
                        }
                    }
                    for (let i = upArray[rightArray[index]]; i > -1; i = upArray[rightArray[i]]) {
                        if (values[i].startsWith('e')) {
                            moveArray.push(i);
                        } else {
                            if (blackPieces(values[i])) {
                                moveArray.push(i);
                            } else if (i == upArray[rightArray[index]]) {
                                moveArray.push(i);
                            } else if (i == upArray[rightArray[upArray[rightArray[index]]]]) {
                                moveArray.push(i);
                            }
                            break;
                        }
                    }
                    for (let i = downArray[leftArray[index]]; i > -1; i = downArray[leftArray[i]]) {
                        if (values[i].startsWith('e')) {
                            moveArray.push(i);
                        } else {
                            if (blackPieces(values[i])) {
                                moveArray.push(i);
                            } else if (i == downArray[leftArray[index]]) {
                                moveArray.push(i);
                            } else if (i == downArray[leftArray[downArray[leftArray[index]]]]) {
                                moveArray.push(i);
                            }
                            break;
                        }
                    }
                    break;
                // Black Bishop Movement
                case '♝':
                    for (let i = upArray[leftArray[index]]; i > -1; i = upArray[leftArray[i]]) {
                        if (values[i].startsWith('e')) {
                            moveArray.push(i);
                        } else {
                            if (whitePieces(values[i])) {
                                moveArray.push(i);
                            } else if (i == upArray[leftArray[index]]) {
                                moveArray.push(i);
                            } else if (i == upArray[leftArray[upArray[leftArray[index]]]]) {
                                moveArray.push(i);
                            }
                            break;
                        }
                    }
                    for (let i = downArray[rightArray[index]]; i > -1; i = downArray[rightArray[i]]) {
                        if (values[i].startsWith('e')) {
                            moveArray.push(i);
                        } else {
                            if (whitePieces(values[i])) {
                                moveArray.push(i);
                            } else if (i == downArray[rightArray[index]]) {
                                moveArray.push(i);
                            } else if (i == downArray[rightArray[downArray[rightArray[index]]]]) {
                                moveArray.push(i);
                            }
                            break;
                        }
                    }
                    for (let i = upArray[rightArray[index]]; i > -1; i = upArray[rightArray[i]]) {
                        if (values[i].startsWith('e')) {
                            moveArray.push(i);
                        } else {
                            if (whitePieces(values[i])) {
                                moveArray.push(i);
                            } else if (i == upArray[rightArray[index]]) {
                                moveArray.push(i);
                            } else if (i == upArray[rightArray[upArray[rightArray[index]]]]) {
                                moveArray.push(i);
                            }
                            break;
                        }
                    }
                    for (let i = downArray[leftArray[index]]; i > -1; i = downArray[leftArray[i]]) {
                        if (values[i].startsWith('e')) {
                            moveArray.push(i);
                        } else {
                            if (whitePieces(values[i])) {
                                moveArray.push(i);
                            } else if (i == downArray[leftArray[index]]) {
                                moveArray.push(i);
                            } else if (i == downArray[leftArray[downArray[leftArray[index]]]]) {
                                moveArray.push(i);
                            }
                            break;
                        }
                    }
                    break;
                // White Queen Movement
                case '♕':
                    for (let i = upArray[index]; i > -1; i = upArray[i]) {
                        if (values[i].startsWith('e')) {
                            moveArray.push(i);
                        } else {
                            if (blackPieces(values[i])) {
                                moveArray.push(i);
                            }
                            break;
                        }
                    }
                    for (let i = downArray[index]; i > -1; i = downArray[i]) {
                        if (values[i].startsWith('e')) {
                            moveArray.push(i);
                        } else {
                            if (blackPieces(values[i])) {
                                moveArray.push(i);
                            }
                            break;
                        }
                    }
                    for (let i = leftArray[index]; i > -1; i = leftArray[i]) {
                        if (values[i].startsWith('e')) {
                            moveArray.push(i);
                        } else {
                            if (blackPieces(values[i])) {
                                moveArray.push(i);
                            }
                            break;
                        }
                    }
                    for (let i = rightArray[index]; i > -1; i = rightArray[i]) {
                        if (values[i].startsWith('e')) {
                            moveArray.push(i);
                        } else {
                            if (blackPieces(values[i])) {
                                moveArray.push(i);
                            }
                            break;
                        }
                    }
                    for (let i = upArray[leftArray[index]]; i > -1; i = upArray[leftArray[i]]) {
                        if (values[i].startsWith('e')) {
                            moveArray.push(i);
                        } else {
                            if (blackPieces(values[i])) {
                                moveArray.push(i);
                            }
                            break;
                        }
                    }
                    for (let i = downArray[rightArray[index]]; i > -1; i = downArray[rightArray[i]]) {
                        if (values[i].startsWith('e')) {
                            moveArray.push(i);
                        } else {
                            if (blackPieces(values[i])) {
                                moveArray.push(i);
                            }
                            break;
                        }
                    }
                    for (let i = upArray[rightArray[index]]; i > -1; i = upArray[rightArray[i]]) {
                        if (values[i].startsWith('e')) {
                            moveArray.push(i);
                        } else {
                            if (blackPieces(values[i])) {
                                moveArray.push(i);
                            }
                            break;
                        }
                    }
                    for (let i = downArray[leftArray[index]]; i > -1; i = downArray[leftArray[i]]) {
                        if (values[i].startsWith('e')) {
                            moveArray.push(i);
                        } else {
                            if (blackPieces(values[i])) {
                                moveArray.push(i);
                            }
                            break;
                        }
                    }
                    break;
                // Black Queen Movement
                case '♛':
                    for (let i = upArray[index]; i > -1; i = upArray[i]) {
                        if (values[i].startsWith('e')) {
                            moveArray.push(i);
                        } else {
                            if (whitePieces(values[i])) {
                                moveArray.push(i);
                            }
                            break;
                        }
                    }
                    for (let i = downArray[index]; i > -1; i = downArray[i]) {
                        if (values[i].startsWith('e')) {
                            moveArray.push(i);
                        } else {
                            if (whitePieces(values[i])) {
                                moveArray.push(i);
                            }
                            break;
                        }
                    }
                    for (let i = leftArray[index]; i > -1; i = leftArray[i]) {
                        if (values[i].startsWith('e')) {
                            moveArray.push(i);
                        } else {
                            if (whitePieces(values[i])) {
                                moveArray.push(i);
                            }
                            break;
                        }
                    }
                    for (let i = rightArray[index]; i > -1; i = rightArray[i]) {
                        if (values[i].startsWith('e')) {
                            moveArray.push(i);
                        } else {
                            if (whitePieces(values[i])) {
                                moveArray.push(i);
                            }
                            break;
                        }
                    }
                    for (let i = upArray[leftArray[index]]; i > -1; i = upArray[leftArray[i]]) {
                        if (values[i].startsWith('e')) {
                            moveArray.push(i);
                        } else {
                            if (whitePieces(values[i])) {
                                moveArray.push(i);
                            }
                            break;
                        }
                    }
                    for (let i = downArray[rightArray[index]]; i > -1; i = downArray[rightArray[i]]) {
                        if (values[i].startsWith('e')) {
                            moveArray.push(i);
                        } else {
                            if (whitePieces(values[i])) {
                                moveArray.push(i);
                            }
                            break;
                        }
                    }
                    for (let i = upArray[rightArray[index]]; i > -1; i = upArray[rightArray[i]]) {
                        if (values[i].startsWith('e')) {
                            moveArray.push(i);
                        } else {
                            if (whitePieces(values[i])) {
                                moveArray.push(i);
                            }
                            break;
                        }
                    }
                    for (let i = downArray[leftArray[index]]; i > -1; i = downArray[leftArray[i]]) {
                        if (values[i].startsWith('e')) {
                            moveArray.push(i);
                        } else {
                            if (whitePieces(values[i])) {
                                moveArray.push(i);
                            }
                            break;
                        }
                    }
                    break;
                // White King Movement
                case '♔':
                    if ((values[upArray[index]] != undefined && values[upArray[index]].startsWith('e')) || blackPieces(values[upArray[index]])) {
                        moveArray.push(upArray[index]);
                    }
                    if ((values[downArray[index]] != undefined && values[downArray[index]].startsWith('e')) || blackPieces(values[downArray[index]])) {
                        moveArray.push(downArray[index]);
                    }
                    if ((values[leftArray[index]] != undefined && values[leftArray[index]].startsWith('e')) || blackPieces(values[leftArray[index]])) {
                        moveArray.push(leftArray[index]);
                    }
                    if ((values[rightArray[index]] != undefined && values[rightArray[index]].startsWith('e')) || blackPieces(values[rightArray[index]])) {
                        moveArray.push(rightArray[index]);
                    }
                    if ((values[upArray[leftArray[index]]] != undefined && values[upArray[leftArray[index]]].startsWith('e')) || blackPieces(values[upArray[leftArray[index]]])) {
                        moveArray.push(upArray[leftArray[index]]);
                    }
                    if ((values[downArray[leftArray[index]]] != undefined && values[downArray[leftArray[index]]].startsWith('e')) || blackPieces(values[downArray[leftArray[index]]])) {
                        moveArray.push(downArray[leftArray[index]]);
                    }
                    if ((values[upArray[rightArray[index]]] != undefined && values[upArray[rightArray[index]]].startsWith('e')) || blackPieces(values[upArray[rightArray[index]]])) {
                        moveArray.push(upArray[rightArray[index]]);
                    }
                    if ((values[downArray[rightArray[index]]] != undefined && values[downArray[rightArray[index]]].startsWith('e')) || blackPieces(values[downArray[rightArray[index]]])) {
                        moveArray.push(downArray[rightArray[index]]);
                    }
                    break;
                // Black King Movement
                case '♚':
                    if ((values[upArray[index]] != undefined && values[upArray[index]].startsWith('e')) || whitePieces(values[upArray[index]])) {
                        moveArray.push(upArray[index]);
                    }
                    if ((values[downArray[index]] != undefined && values[downArray[index]].startsWith('e')) || whitePieces(values[downArray[index]])) {
                        moveArray.push(downArray[index]);
                    }
                    if ((values[leftArray[index]] != undefined && values[leftArray[index]].startsWith('e')) || whitePieces(values[leftArray[index]])) {
                        moveArray.push(leftArray[index]);
                    }
                    if ((values[rightArray[index]] != undefined && values[rightArray[index]].startsWith('e')) || whitePieces(values[rightArray[index]])) {
                        moveArray.push(rightArray[index]);
                    }
                    if ((values[upArray[leftArray[index]]] != undefined && values[upArray[leftArray[index]]].startsWith('e')) || whitePieces(values[upArray[leftArray[index]]])) {
                        moveArray.push(upArray[leftArray[index]]);
                    }
                    if ((values[downArray[leftArray[index]]] != undefined && values[downArray[leftArray[index]]].startsWith('e')) || whitePieces(values[downArray[leftArray[index]]])) {
                        moveArray.push(downArray[leftArray[index]]);
                    }
                    if ((values[upArray[rightArray[index]]] != undefined && values[upArray[rightArray[index]]].startsWith('e')) || whitePieces(values[upArray[rightArray[index]]])) {
                        moveArray.push(upArray[rightArray[index]]);
                    }
                    if ((values[downArray[rightArray[index]]] != undefined && values[downArray[rightArray[index]]].startsWith('e')) || whitePieces(values[downArray[rightArray[index]]])) {
                        moveArray.push(downArray[rightArray[index]]);
                    }
                    break;
                default:
                    break;
            }
        }
        return moveArray;
    }

    const checkForReps = () => {
        var whiteKing = values.findIndex(value => value[0] == '♔');
        var blackKing = values.findIndex(value => value[0] == '♚');
        var whiteQueens = [];
        values.forEach((value, index) => { if (value[0] == '♕' && !whiteQueens.some(val => index == val)) { whiteQueens.push(index); } });
        var blackQueens = [];
        values.forEach((value, index) => { if (value[0] == '♛' && !blackQueens.some(val => index == val)) { blackQueens.push(index); } });
        var whiteBishops = [];
        checkForPiece('♗', whiteBishops);
        var blackBishops = [];
        checkForPiece('♝', blackBishops);
        var whiteKnights = [];
        checkForPiece('♘', whiteKnights);
        var blackKnights = [];
        checkForPiece('♞', blackKnights);
        var whiteRooks = [];
        checkForPiece('♖', whiteRooks);
        var blackRooks = [];
        checkForPiece('♜', blackRooks);
        var whitePawns = [];
        values.forEach((value, index) => { if (value[0] == '♙' && !whitePawns.some(val => index == val)) { whitePawns.push(index); } });
        var blackPawns = [];
        values.forEach((value, index) => { if (value[0] == '♟' && !blackPawns.some(val => index == val)) { blackPawns.push(index); } });
        var boardState = 'whiteKing:' + whiteKing.toString() + ';blackKing:' + blackKing.toString() + ';whiteQueens:' + whiteQueens.toString() + ';blackQueens:' + blackQueens.toString() + ';whiteBishops:' + whiteBishops.toString() + ';blackBishops:' + blackBishops.toString() +
            ';whiteKnights:' + whiteKnights.toString() + ';blackKnights:' + blackKnights.toString() + ';whiteRooks:' + whiteRooks.toString() + ';blackRooks:' + blackRooks.toString() + ';whitePawns:' + whitePawns.toString() + ';blackPawns:' + blackPawns.toString() +
            ';player:' + player.toString() + ';castle:' + selected.moved.toString() + ';passant:' + selected.passant.toString();
        var ind = repetitions.findIndex(value => value.boardState == boardState);
        if (ind != -1) {
            if (repetitions[ind].repeats == '4') {
                console.log('Draw by 5-fold repetition rule');
                setState(prev => prev + 'draw');
            } else {
                var rep = { boardState: boardState, repeats: repetitions[ind].repeats + 1 };
                setRepetitions(repetitions => repetitions.map((value, index) => (index == ind ? rep : value)));
            }
        } else {
            var grep = { boardState: boardState, repeats: 1 };
            var rep = repetitions.slice();
            rep.push(grep);
            setRepetitions(rep);
        }
    }

    const checkForMate = () => {
        if (values.every(value => value[0] != '♔' && value[0] != '♕' && value[0] != '♗' && value[0] != '♘' && value[0] != '♖' && value[0] != '♙')) {
            console.log('Black wins by checkmate');
            setState('Blackwin');
            return;
        }
        if (values.every(value => value[0] != '♚' && value[0] != '♛' && value[0] != '♝' && value[0] != '♞' && value[0] != '♜' && value[0] != '♟')) {
            console.log('White wins by checkmate');
            setState('Whitewin');
            return;
        }
        var blocked = checkForBlocked();
        var spliced = values.slice();
        for (let i = 0; i < blocked.length; i++) {
            spliced.splice(blocked[i] - i, 1);
        }
        if (player == 'White' && spliced.every(value => value[0] != '♔' && value[0] != '♕' && value[0] != '♗' && value[0] != '♘' && value[0] != '♖' && value[0] != '♙')) {
            console.log('Black draws by stalemate');
            setState('Blackdraw');
        }
        if (player == 'Black' && spliced.every(value => value[0] != '♚' && value[0] != '♛' && value[0] != '♝' && value[0] != '♞' && value[0] != '♜' && value[0] != '♟')) {
            console.log('White draws by stalemate');
            setState('Whitedraw');
        }
        if (values.every(value => value[0] != '♕' && value[0] != '♗' && value[0] != '♘' && value[0] != '♖' && value[0] != '♙' && value[0] != '♛' && value[0] != '♝' && value[0] != '♞' && value[0] != '♜' && value[0] != '♟')) {
            console.log('Draw by dead position (King against King)');
            setState(prev => prev + 'draw');
        } else if (values.every(value => value[0] != '♕' && value[0] != '♘' && value[0] != '♖' && value[0] != '♙' && value[0] != '♛' && value[0] != '♝' && value[0] != '♞' && value[0] != '♜' && value[0] != '♟')) {
            var a = values.findIndex(value => value[0] == '♗');
            var b = values.findLastIndex(value => value[0] == '♗');
            if (a == b) {
                console.log('Draw by dead position (White King and Bishop against Black King)');
                setState(prev => prev + 'draw');
            }
        } else if (values.every(value => value[0] != '♕' && value[0] != '♗' && value[0] != '♘' && value[0] != '♖' && value[0] != '♙' && value[0] != '♛' && value[0] != '♞' && value[0] != '♜' && value[0] != '♟')) {
            var a = values.findIndex(value => value[0] == '♝');
            var b = values.findLastIndex(value => value[0] == '♝');
            if (a == b) {
                console.log('Draw by dead position (Black King and Bishop against White King)');
                setState(prev => prev + 'draw');
            }
        } else if (values.every(value => value[0] != '♕' && value[0] != '♗' && value[0] != '♖' && value[0] != '♙' && value[0] != '♛' && value[0] != '♝' && value[0] != '♞' && value[0] != '♜' && value[0] != '♟')) {
            var a = values.findIndex(value => value[0] == '♘');
            var b = values.findLastIndex(value => value[0] == '♘');
            if (a == b) {
                console.log('Draw by dead position (White King and Knight against Black King)');
                setState(prev => prev + 'draw');
            }
        } else if (values.every(value => value[0] != '♕' && value[0] != '♗' && value[0] != '♘' && value[0] != '♖' && value[0] != '♙' && value[0] != '♛' && value[0] != '♝' && value[0] != '♜' && value[0] != '♟')) {
            var a = values.findIndex(value => value[0] == '♞');
            var b = values.findLastIndex(value => value[0] == '♞');
            if (a == b) {
                console.log('Draw by dead position (Black King and Knight against White King)');
                setState(prev => prev + 'draw');
            }
        } else if (values.every(value => value[0] != '♕' && value[0] != '♘' && value[0] != '♖' && value[0] != '♙' && value[0] != '♛' && value[0] != '♞' && value[0] != '♜' && value[0] != '♟')) {
            var a = values.findIndex(value => value[0] == '♗');
            var b = values.findLastIndex(value => value[0] == '♗');
            var c = values.findIndex(value => value[0] == '♝');
            var d = values.findLastIndex(value => value[0] == '♝');
            if (a == b && c == d) {
                if (((a % 2 != 1) && (Math.floor(a / 8) % 2 != 1)) || ((a % 2 == 1) && (Math.floor(a / 8) % 2 == 1))) {
                    if (((c % 2 != 1) && (Math.floor(c / 8) % 2 != 1)) || ((c % 2 == 1) && (Math.floor(c / 8) % 2 == 1))) {
                        console.log('Draw by dead position (King and Bishop on white square against King and Bishop on white square)');
                        setState(prev => prev + 'draw');
                    }
                } else {
                    if (!(((c % 2 != 1) && (Math.floor(c / 8) % 2 != 1)) || ((c % 2 == 1) && (Math.floor(c / 8) % 2 == 1)))) {
                        console.log('Draw by dead position (King and Bishop on black square against King and Bishop on black square)');
                        setState(prev => prev + 'draw');
                    }
                }
            }
        }
        if (count >= 100) {
            console.log('Draw by 50-Move Rule');
            setState(prev => prev + 'draw');
        }
    }

    return (
        <div className="app2">
            <div>
                {state.slice(5) == 'draw' ? 'Draw' : (state.slice(5) == 'win' ?
                    'Player ' + (player) + ' wins' : 'Player ' + (player) + "'s turn")}
            </div>
            <div className="board2">
                {values.map((value, index) => (<Cell id={index} value={value} state={state} selected={selected} setCount={setCount}
                    setPlayer={playerModifier} setArray={moveModifier} setRest={restModifier} setSelected={setSelected} setHistory={histModifier}
                    checkForMovement={checkForMovement} checkForCastle={checkForCastle} setCellHover={setCellHover} />))}
            </div>
        </div>
    );
} 
