import React, { useEffect, useState } from "react";

import "./styles.css";

const Cell = (props) => {
    const { id, selected, value, win, player, setCount, setPlayer, setArray, setSelected, checkForMovement, checkForCastle } = props;

    const handleClick = () => {
        if (selected.value) {
            // Cancel Move
            if (id == selected.id) {
                setSelected({ id: -1, value: false, piece: selected.piece, blockedArray: selected.blockedArray, moved: selected.moved, passant: selected.passant });
            }
            // Normal Move
            else {
                var moves = selected.moved;
                if (selected.piece == '♔' && !moves[0]) {
                    moves[0] = true;
                } else if (selected.piece == '♚' && !moves[1]) {
                    moves[1] = true;
                } else if (selected.piece == '♖') {
                    if (selected.id == 56 && !moves[2]) {
                        moves[2] = true;
                    } else if (selected.id == 63 && !moves[3]) {
                        moves[3] = true;
                    }
                } else if (selected.piece == '♜') {
                    if (selected.id == 0 && !moves[4]) {
                        moves[4] = true;
                    } else if (selected.id == 7 && !moves[5]) {
                        moves[5] = true;
                    }
                }
                if (value == '♖') {
                    if (id == 56 && !moves[2]) {
                        moves[2] = true;
                    } else if (id == 63 && !moves[3]) {
                        moves[3] = true;
                    }
                } else if (value == '♜') {
                    if (id == 0 && !moves[4]) {
                        moves[4] = true;
                    } else if (id == 7 && !moves[5]) {
                        moves[5] = true;
                    }
                }
                if ((selected.piece == '♔' || selected.piece == '♚') && Math.abs(id - selected.id) == 2) {
                    if (id == 2) {
                        setArray(0, '');
                        setArray(3, '♜');
                    } else if (id == 6) {
                        setArray(7, '');
                        setArray(5, '♜');
                    } else if (id == 58) {
                        setArray(56, '');
                        setArray(59, '♖');
                    } else if (id == 62) {
                        setArray(63, '');
                        setArray(61, '♖');
                    }
                }
                var passant = selected.id;
                if ((selected.piece == '♙' || selected.piece == '♟') && Math.abs(id - selected.id) == 16) {
                    if (Math.floor(id / 8) == 4) {
                        passant -= 8;
                    } else if (Math.floor(id / 8) == 3) {
                        passant += 8;
                    }
                } else {
                    passant = -1;
                }
                if ((selected.piece == '♙' || selected.piece == '♟') && (Math.abs(id - selected.id) == 7 || Math.abs(id - selected.id) == 9) && value == '') {
                    if (Math.floor(id / 8) == 2) {
                        setArray(id + 8, '');
                    } else if (Math.floor(id / 8) == 5) {
                        setArray(id - 8, '');
                    }
                }
                if (value == '' && selected.piece != '♙' && selected.piece != '♟') {
                    setCount(prev => prev + 1);
                } else {
                    setCount(0);
                }
                setPlayer();
                setArray(selected.id, '');
                setArray(id, selected.piece);
                setSelected({ id: selected.id, value: false, piece: selected.piece, blockedArray: selected.blockedArray, moved: moves, passant: passant });
            }
            // Upgrade White Pawn to Queen
            if (id < 8 && selected.piece == '♙') {
                setArray(id, '♕');
            }
            // Upgrade Black Pawn to Queen
            if (id > 55 && selected.piece == '♟') {
                setArray(id, '♛');
            }
        } else {
            setSelected({ id: id, value: true, piece: value, blockedArray: selected.blockedArray, moved: selected.moved, passant: selected.passant });
        }
    }

    const checkerboard = ((id % 2 != 1) && (Math.floor(id / 8) % 2 != 1)) || ((id % 2 == 1) && (Math.floor(id / 8) % 2 == 1));
    const blackSelect = player == 'Black' && value != '♟' && value != '♜' && value != '♞' && value != '♝' && value != '♛' && value != '♚';
    const whiteSelect = player == 'White' && value != '♙' && value != '♖' && value != '♘' && value != '♗' && value != '♕' && value != '♔';
    const blackCastle = selected.piece == '♚' ? (checkForCastle(4, 0) ? id != 2 : true) && (checkForCastle(4, 7) ? id != 6 : true) : true;
    const whiteCastle = selected.piece == '♔' ? (checkForCastle(60, 56) ? id != 58 : true) && (checkForCastle(60, 63) ? id != 62 : true) : true;
    const blackPassant = (id != selected.passant || id != selected.id + 7) && (id != selected.passant || id != selected.id + 9);
    const whitePassant = (id != selected.passant || id != selected.id - 7) && (id != selected.passant || id != selected.id - 9);
    const select = !selected.value && (selected.blockedArray.some(val => (id == val)) || (blackSelect || whiteSelect));
    const movement = selected.value && (!checkForMovement(selected.id).some(val => (id == val)) &&
        (player == 'Black' ? (selected.piece == '♟' ? blackPassant : blackCastle) : (selected.piece == '♙' ? whitePassant : whiteCastle)));
    const noWin = win != '' && win != 'Check';

    return <button className={"cell3" + (checkerboard ? "white" : "black")} onClick={handleClick}
        disabled={select || movement || noWin}>{value}</button>;
};

export default function App() {
    const [player, setPlayer] = useState('White'); // whose turn
    const [win, setWin] = useState(''); // win state
    const initArray = ['♜', '♞', '♝', '♛', '♚', '♝', '♞', '♜',
        '♟', '♟', '♟', '♟', '♟', '♟', '♟', '♟',
        '', '', '', '', '', '', '', '',
        '', '', '', '', '', '', '', '',
        '', '', '', '', '', '', '', '',
        '', '', '', '', '', '', '', '',
        '♙', '♙', '♙', '♙', '♙', '♙', '♙', '♙',
        '♖', '♘', '♗', '♕', '♔', '♗', '♘', '♖'];
    const [values, setValues] = useState(initArray); // board state
    const [selected, setSelected] = useState({ id: -1, value: false, piece: '', blockedArray: [], moved: [false, false, false, false, false, false], passant: -1 }); // trigger move state upon piece selection
    const [count, setCount] = useState(0); // count for fifty move rule
    const [repetitions, setRepetitions] = useState([]); // count for fivefold repetition rule

    useEffect(() => {
        checkForCheck();
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
        return piece == '♙' || piece == '♖' || piece == '♘' || piece == '♗' || piece == '♕';
    }

    const blackPieces = (piece) => {
        return piece == '♟' || piece == '♜' || piece == '♞' || piece == '♝' || piece == '♛';
    }

    const checkForPiece = (piece, array) => {
        var aa = values.findIndex(value => value == piece);
        var bb = values.findLastIndex(value => value == piece);
        if (aa == bb && aa != -1) {
            array.push(aa);
        } else if (aa != -1) {
            array.push(aa);
            array.push(bb);
        }
    }

    const arrayModifier = (id, newVal) => {
        setValues(values => values.map((value, index) => (index == id ? newVal : value)));
    }

    const playerModifier = (func) => {
        (player == 'White') ? func('Black') : func('White');
    }

    const reset = () => {
        setValues(initArray);
        setPlayer('White');
        setWin('');
        setSelected({ id: -1, value: false, piece: '', blockedArray: [], moved: [false, false, false, false, false, false], passant: -1 });
        setCount(0);
        setRepetitions([]);
    }

    const checkForBlocked = () => {
        var blockedArray = [];
        values.forEach((value, index) => {
            var a = checkForMovement(index);
            if (a.length <= 1) {
                blockedArray.push(index);
            }
        });
        setSelected({ id: selected.id, value: selected.value, piece: selected.piece, blockedArray: blockedArray, moved: selected.moved, passant: selected.passant });
        return blockedArray;
    }

    const checkForCheckWhite = (index) => {
        for (let i = upArray[index]; i > -1; i = upArray[i]) {
            if (values[i] != '') {
                if (values[i] == '♜' || values[i] == '♛') {
                    return true;
                } else if (values[i] == '♔' && i == upArray[index]) {
                    continue;
                }
                break;
            }
        }
        for (let i = downArray[index]; i > -1; i = downArray[i]) {
            if (values[i] != '') {
                if (values[i] == '♜' || values[i] == '♛') {
                    return true;
                } else if (values[i] == '♔' && i == downArray[index]) {
                    continue;
                }
                break;
            }
        }
        for (let i = leftArray[index]; i > -1; i = leftArray[i]) {
            if (values[i] != '') {
                if (values[i] == '♜' || values[i] == '♛') {
                    return true;
                } else if (values[i] == '♔' && i == leftArray[index]) {
                    continue;
                }
                break;
            }
        }
        for (let i = rightArray[index]; i > -1; i = rightArray[i]) {
            if (values[i] != '') {
                if (values[i] == '♜' || values[i] == '♛') {
                    return true;
                } else if (values[i] == '♔' && i == rightArray[index]) {
                    continue;
                }
                break;
            }
        }
        for (let i = upArray[leftArray[index]]; i > -1; i = upArray[leftArray[i]]) {
            if (values[i] != '') {
                if (values[i] == '♝' || values[i] == '♛') {
                    return true;
                } else if (values[i] == '♔' && i == upArray[leftArray[index]]) {
                    continue;
                }
                break;
            }
        }
        for (let i = downArray[rightArray[index]]; i > -1; i = downArray[rightArray[i]]) {
            if (values[i] != '') {
                if (values[i] == '♝' || values[i] == '♛') {
                    return true;
                } else if (values[i] == '♔' && i == downArray[rightArray[index]]) {
                    continue;
                }
                break;
            }
        }
        for (let i = upArray[rightArray[index]]; i > -1; i = upArray[rightArray[i]]) {
            if (values[i] != '') {
                if (values[i] == '♝' || values[i] == '♛') {
                    return true;
                } else if (values[i] == '♔' && i == upArray[rightArray[index]]) {
                    continue;
                }
                break;
            }
        }
        for (let i = downArray[leftArray[index]]; i > -1; i = downArray[leftArray[i]]) {
            if (values[i] != '') {
                if (values[i] == '♝' || values[i] == '♛') {
                    return true;
                } else if (values[i] == '♔' && i == downArray[leftArray[index]]) {
                    continue;
                }
                break;
            }
        }
        if (values[upArray[index]] == '♚') {
            return true;
        }
        if (values[downArray[index]] == '♚') {
            return true;
        }
        if (values[leftArray[index]] == '♚') {
            return true;
        }
        if (values[rightArray[index]] == '♚') {
            return true;
        }
        if (values[downArray[leftArray[index]]] == '♚') {
            return true;
        }
        if (values[downArray[rightArray[index]]] == '♚') {
            return true;
        }
        if (values[upArray[leftArray[index]]] == '♚' || values[upArray[leftArray[index]]] == '♟') {
            return true;
        }
        if (values[upArray[rightArray[index]]] == '♚' || values[upArray[rightArray[index]]] == '♟') {
            return true;
        }
        if (values[upArray[leftArray[leftArray[index]]]] == '♞') {
            return true;
        }
        if (values[downArray[leftArray[leftArray[index]]]] == '♞') {
            return true;
        }
        if (values[upArray[upArray[leftArray[index]]]] == '♞') {
            return true;
        }
        if (values[downArray[downArray[leftArray[index]]]] == '♞') {
            return true;
        }
        if (values[upArray[rightArray[rightArray[index]]]] == '♞') {
            return true;
        }
        if (values[downArray[rightArray[rightArray[index]]]] == '♞') {
            return true;
        }
        if (values[upArray[upArray[rightArray[index]]]] == '♞') {
            return true;
        }
        if (values[downArray[downArray[rightArray[index]]]] == '♞') {
            return true;
        }
        return false;
    }

    const checkForCheckBlack = (index) => {
        for (let i = upArray[index]; i > -1; i = upArray[i]) {
            if (values[i] != '') {
                if (values[i] == '♖' || values[i] == '♕') {
                    return true;
                } else if (values[i] == '♚' && i == upArray[index]) {
                    continue;
                }
                break;
            }
        }
        for (let i = downArray[index]; i > -1; i = downArray[i]) {
            if (values[i] != '') {
                if (values[i] == '♖' || values[i] == '♕') {
                    return true;
                } else if (values[i] == '♚' && i == downArray[index]) {
                    continue;
                }
                break;
            }
        }
        for (let i = leftArray[index]; i > -1; i = leftArray[i]) {
            if (values[i] != '') {
                if (values[i] == '♖' || values[i] == '♕') {
                    return true;
                } else if (values[i] == '♚' && i == leftArray[index]) {
                    continue;
                }
                break;
            }
        }
        for (let i = rightArray[index]; i > -1; i = rightArray[i]) {
            if (values[i] != '') {
                if (values[i] == '♖' || values[i] == '♕') {
                    return true;
                } else if (values[i] == '♚' && i == rightArray[index]) {
                    continue;
                }
                break;
            }
        }
        for (let i = upArray[leftArray[index]]; i > -1; i = upArray[leftArray[i]]) {
            if (values[i] != '') {
                if (values[i] == '♗' || values[i] == '♕') {
                    return true;
                } else if (values[i] == '♚' && i == upArray[leftArray[index]]) {
                    continue;
                }
                break;
            }
        }
        for (let i = downArray[rightArray[index]]; i > -1; i = downArray[rightArray[i]]) {
            if (values[i] != '') {
                if (values[i] == '♗' || values[i] == '♕') {
                    return true;
                } else if (values[i] == '♚' && i == downArray[rightArray[index]]) {
                    continue;
                }
                break;
            }
        }
        for (let i = upArray[rightArray[index]]; i > -1; i = upArray[rightArray[i]]) {
            if (values[i] != '') {
                if (values[i] == '♗' || values[i] == '♕') {
                    return true;
                } else if (values[i] == '♚' && i == upArray[rightArray[index]]) {
                    continue;
                }
                break;
            }
        }
        for (let i = downArray[leftArray[index]]; i > -1; i = downArray[leftArray[i]]) {
            if (values[i] != '') {
                if (values[i] == '♗' || values[i] == '♕') {
                    return true;
                } else if (values[i] == '♚' && i == downArray[leftArray[index]]) {
                    continue;
                }
                break;
            }
        }
        if (values[upArray[index]] == '♔') {
            return true;
        }
        if (values[downArray[index]] == '♔') {
            return true;
        }
        if (values[leftArray[index]] == '♔') {
            return true;
        }
        if (values[rightArray[index]] == '♔') {
            return true;
        }
        if (values[upArray[leftArray[index]]] == '♔') {
            return true;
        }
        if (values[upArray[rightArray[index]]] == '♔') {
            return true;
        }
        if (values[downArray[leftArray[index]]] == '♔' || values[downArray[leftArray[index]]] == '♙') {
            return true;
        }
        if (values[downArray[rightArray[index]]] == '♔' || values[downArray[rightArray[index]]] == '♙') {
            return true;
        }
        if (values[upArray[leftArray[leftArray[index]]]] == '♘') {
            return true;
        }
        if (values[downArray[leftArray[leftArray[index]]]] == '♘') {
            return true;
        }
        if (values[upArray[upArray[leftArray[index]]]] == '♘') {
            return true;
        }
        if (values[downArray[downArray[leftArray[index]]]] == '♘') {
            return true;
        }
        if (values[upArray[rightArray[rightArray[index]]]] == '♘') {
            return true;
        }
        if (values[downArray[rightArray[rightArray[index]]]] == '♘') {
            return true;
        }
        if (values[upArray[upArray[rightArray[index]]]] == '♘') {
            return true;
        }
        if (values[downArray[downArray[rightArray[index]]]] == '♘') {
            return true;
        }
        return false;
    }

    const checkForDiscoverCheckWhite = (index) => {
        // check for black rooks, bishops and queens that will check white king if a white piece moves
        var discoverArray = [];
        var disca = -1;
        for (let i = upArray[index]; i > -1; i = upArray[i]) {
            if (values[i] != '') {
                if (whitePieces(values[i])) {
                    if (disca == -1) {
                        disca = i;
                        continue;
                    }
                    break;
                } else if (disca > -1) {
                    if (values[i] == '♜' || values[i] == '♛') {
                        discoverArray.push({ direction: 'up', piece: disca });
                        break;
                    }
                    break;
                }
                break;
            }
        }
        var discb = -1;
        for (let i = downArray[index]; i > -1; i = downArray[i]) {
            if (values[i] != '') {
                if (whitePieces(values[i])) {
                    if (discb == -1) {
                        discb = i;
                        continue;
                    }
                    break;
                } else if (discb > -1) {
                    if (values[i] == '♜' || values[i] == '♛') {
                        discoverArray.push({ direction: 'down', piece: discb });
                        break;
                    }
                    break;
                }
                break;
            }
        }
        var discc = -1;
        for (let i = leftArray[index]; i > -1; i = leftArray[i]) {
            if (values[i] != '') {
                if (whitePieces(values[i])) {
                    if (discc == -1) {
                        discc = i;
                        continue;
                    }
                    break;
                } else if (discc > -1) {
                    if (values[i] == '♜' || values[i] == '♛') {
                        discoverArray.push({ direction: 'left', piece: discc });
                        break;
                    }
                    break;
                }
                break;
            }
        }
        var discd = -1;
        for (let i = rightArray[index]; i > -1; i = rightArray[i]) {
            if (values[i] != '') {
                if (whitePieces(values[i])) {
                    if (discd == -1) {
                        discd = i;
                        continue;
                    }
                    break;
                } else if (discd > -1) {
                    if (values[i] == '♜' || values[i] == '♛') {
                        discoverArray.push({ direction: 'right', piece: discd });
                        break;
                    }
                    break;
                }
                break;
            }
        }
        var disce = -1;
        for (let i = upArray[leftArray[index]]; i > -1; i = upArray[leftArray[i]]) {
            if (values[i] != '') {
                if (whitePieces(values[i])) {
                    if (disce == -1) {
                        disce = i;
                        continue;
                    }
                    break;
                } else if (disce > -1) {
                    if (values[i] == '♝' || values[i] == '♛') {
                        discoverArray.push({ direction: 'up-left', piece: disce });
                        break;
                    }
                    break;
                }
                break;
            }
        }
        var discf = -1;
        for (let i = downArray[rightArray[index]]; i > -1; i = downArray[rightArray[i]]) {
            if (values[i] != '') {
                if (whitePieces(values[i])) {
                    if (discf == -1) {
                        discf = i;
                        continue;
                    }
                    break;
                } else if (discf > -1) {
                    if (values[i] == '♝' || values[i] == '♛') {
                        discoverArray.push({ direction: 'down-right', piece: discf });
                        break;
                    }
                    break;
                }
                break;
            }
        }
        var discg = -1;
        for (let i = upArray[rightArray[index]]; i > -1; i = upArray[rightArray[i]]) {
            if (values[i] != '') {
                if (whitePieces(values[i])) {
                    if (discg == -1) {
                        discg = i;
                        continue;
                    }
                    break;
                } else if (discg > -1) {
                    if (values[i] == '♝' || values[i] == '♛') {
                        discoverArray.push({ direction: 'up-right', piece: discg });
                        break;
                    }
                    break;
                }
                break;
            }
        }
        var disch = -1;
        for (let i = downArray[leftArray[index]]; i > -1; i = downArray[leftArray[i]]) {
            if (values[i] != '') {
                if (whitePieces(values[i])) {
                    if (disch == -1) {
                        disch = i;
                        continue;
                    }
                    break;
                } else if (disch > -1) {
                    if (values[i] == '♝' || values[i] == '♛') {
                        discoverArray.push({ direction: 'down-left', piece: disch });
                        break;
                    }
                    break;
                }
                break;
            }
        }
        return discoverArray;
    }

    const checkForDiscoverCheckBlack = (index) => {
        // check for white rooks, bishops and queens that will check black king if a black piece moves
        var discoverArray = [];
        var disca = -1;
        for (let i = upArray[index]; i > -1; i = upArray[i]) {
            if (values[i] != '') {
                if (blackPieces(values[i])) {
                    if (disca == -1) {
                        disca = i;
                        continue;
                    }
                    break;
                } else if (disca > -1) {
                    if (values[i] == '♖' || values[i] == '♕') {
                        discoverArray.push({ direction: 'up', piece: disca });
                        break;
                    }
                    break;
                }
                break;
            }
        }
        var discb = -1;
        for (let i = downArray[index]; i > -1; i = downArray[i]) {
            if (values[i] != '') {
                if (blackPieces(values[i])) {
                    if (discb == -1) {
                        discb = i;
                        continue;
                    }
                    break;
                } else if (discb > -1) {
                    if (values[i] == '♖' || values[i] == '♕') {
                        discoverArray.push({ direction: 'down', piece: discb });
                        break;
                    }
                    break;
                }
                break;
            }
        }
        var discc = -1;
        for (let i = leftArray[index]; i > -1; i = leftArray[i]) {
            if (values[i] != '') {
                if (blackPieces(values[i])) {
                    if (discc == -1) {
                        discc = i;
                        continue;
                    }
                    break;
                } else if (discc > -1) {
                    if (values[i] == '♖' || values[i] == '♕') {
                        discoverArray.push({ direction: 'left', piece: discc });
                        break;
                    }
                    break;
                }
                break;
            }
        }
        var discd = -1;
        for (let i = rightArray[index]; i > -1; i = rightArray[i]) {
            if (values[i] != '') {
                if (blackPieces(values[i])) {
                    if (discd == -1) {
                        discd = i;
                        continue;
                    }
                    break;
                } else if (discd > -1) {
                    if (values[i] == '♖' || values[i] == '♕') {
                        discoverArray.push({ direction: 'right', piece: discd });
                        break;
                    }
                    break;
                }
                break;
            }
        }
        var disce = -1;
        for (let i = upArray[leftArray[index]]; i > -1; i = upArray[leftArray[i]]) {
            if (values[i] != '') {
                if (blackPieces(values[i])) {
                    if (disce == -1) {
                        disce = i;
                        continue;
                    }
                    break;
                } else if (disce > -1) {
                    if (values[i] == '♗' || values[i] == '♕') {
                        discoverArray.push({ direction: 'up-left', piece: disce });
                        break;
                    }
                    break;
                }
                break;
            }
        }
        var discf = -1;
        for (let i = downArray[rightArray[index]]; i > -1; i = downArray[rightArray[i]]) {
            if (values[i] != '') {
                if (blackPieces(values[i])) {
                    if (discf == -1) {
                        discf = i;
                        continue;
                    }
                    break;
                } else if (discf > -1) {
                    if (values[i] == '♗' || values[i] == '♕') {
                        discoverArray.push({ direction: 'down-right', piece: discf });
                        break;
                    }
                    break;
                }
                break;
            }
        }
        var discg = -1;
        for (let i = upArray[rightArray[index]]; i > -1; i = upArray[rightArray[i]]) {
            if (values[i] != '') {
                if (blackPieces(values[i])) {
                    if (discg == -1) {
                        discg = i;
                        continue;
                    }
                    break;
                } else if (discg > -1) {
                    if (values[i] == '♗' || values[i] == '♕') {
                        discoverArray.push({ direction: 'up-right', piece: discg });
                        break;
                    }
                    break;
                }
                break;
            }
        }
        var disch = -1;
        for (let i = downArray[leftArray[index]]; i > -1; i = downArray[leftArray[i]]) {
            if (values[i] != '') {
                if (blackPieces(values[i])) {
                    if (disch == -1) {
                        disch = i;
                        continue;
                    }
                    break;
                } else if (disch > -1) {
                    if (values[i] == '♗' || values[i] == '♕') {
                        discoverArray.push({ direction: 'down-left', piece: disch });
                        break;
                    }
                    break;
                }
                break;
            }
        }
        return discoverArray;
    }

    const checkArray = (index, colour) => {
        var checkArray = [];
        if (colour == 'Black') {
            for (let i = upArray[index]; i > -1; i = upArray[i]) {
                if (values[i] != '') {
                    if (values[i] == '♖' || values[i] == '♕') {
                        checkArray.push({ index: i, piece: values[i] });
                        break;
                    }
                    break;
                }
            }
            for (let i = downArray[index]; i > -1; i = downArray[i]) {
                if (values[i] != '') {
                    if (values[i] == '♖' || values[i] == '♕') {
                        checkArray.push({ index: i, piece: values[i] });
                        break;
                    }
                    break;
                }
            }
            for (let i = leftArray[index]; i > -1; i = leftArray[i]) {
                if (values[i] != '') {
                    if (values[i] == '♖' || values[i] == '♕') {
                        checkArray.push({ index: i, piece: values[i] });
                        break;
                    }
                    break;
                }
            }
            for (let i = rightArray[index]; i > -1; i = rightArray[i]) {
                if (values[i] != '') {
                    if (values[i] == '♖' || values[i] == '♕') {
                        checkArray.push({ index: i, piece: values[i] });
                        break;
                    }
                    break;
                }
            }
            for (let i = upArray[leftArray[index]]; i > -1; i = upArray[leftArray[i]]) {
                if (values[i] != '') {
                    if (values[i] == '♗' || values[i] == '♕') {
                        checkArray.push({ index: i, piece: values[i] });
                        break;
                    }
                    break;
                }
            }
            for (let i = downArray[rightArray[index]]; i > -1; i = downArray[rightArray[i]]) {
                if (values[i] != '') {
                    if (values[i] == '♗' || values[i] == '♕') {
                        checkArray.push({ index: i, piece: values[i] });
                        break;
                    }
                    break;
                }
            }
            for (let i = upArray[rightArray[index]]; i > -1; i = upArray[rightArray[i]]) {
                if (values[i] != '') {
                    if (values[i] == '♗' || values[i] == '♕') {
                        checkArray.push({ index: i, piece: values[i] });
                        break;
                    }
                    break;
                }
            }
            for (let i = downArray[leftArray[index]]; i > -1; i = downArray[leftArray[i]]) {
                if (values[i] != '') {
                    if (values[i] == '♗' || values[i] == '♕') {
                        checkArray.push({ index: i, piece: values[i] });
                        break;
                    }
                    break;
                }
            }
            if (values[downArray[leftArray[index]]] == '♙') {
                checkArray.push({ index: downArray[leftArray[index]], piece: '♙' });
            }
            if (values[downArray[rightArray[index]]] == '♙') {
                checkArray.push({ index: downArray[rightArray[index]], piece: '♙' });
            }
            if (values[upArray[leftArray[leftArray[index]]]] == '♘') {
                checkArray.push({ index: upArray[leftArray[leftArray[index]]], piece: '♘' });
            }
            if (values[downArray[leftArray[leftArray[index]]]] == '♘') {
                checkArray.push({ index: downArray[leftArray[leftArray[index]]], piece: '♘' });
            }
            if (values[upArray[upArray[leftArray[index]]]] == '♘') {
                checkArray.push({ index: upArray[upArray[leftArray[index]]], piece: '♘' });
            }
            if (values[downArray[downArray[leftArray[index]]]] == '♘') {
                checkArray.push({ index: downArray[downArray[leftArray[index]]], piece: '♘' });
            }
            if (values[upArray[rightArray[rightArray[index]]]] == '♘') {
                checkArray.push({ index: upArray[rightArray[rightArray[index]]], piece: '♘' });
            }
            if (values[downArray[rightArray[rightArray[index]]]] == '♘') {
                checkArray.push({ index: downArray[rightArray[rightArray[index]]], piece: '♘' });
            }
            if (values[upArray[upArray[rightArray[index]]]] == '♘') {
                checkArray.push({ index: upArray[upArray[rightArray[index]]], piece: '♘' });
            }
            if (values[downArray[downArray[rightArray[index]]]] == '♘') {
                checkArray.push({ index: downArray[downArray[rightArray[index]]], piece: '♘' });
            }
        } else if (colour == 'White') {
            for (let i = upArray[index]; i > -1; i = upArray[i]) {
                if (values[i] != '') {
                    if (values[i] == '♜' || values[i] == '♛') {
                        checkArray.push({ index: i, piece: values[i] });
                        break;
                    }
                    break;
                }
            }
            for (let i = downArray[index]; i > -1; i = downArray[i]) {
                if (values[i] != '') {
                    if (values[i] == '♜' || values[i] == '♛') {
                        checkArray.push({ index: i, piece: values[i] });
                        break;
                    }
                    break;
                }
            }
            for (let i = leftArray[index]; i > -1; i = leftArray[i]) {
                if (values[i] != '') {
                    if (values[i] == '♜' || values[i] == '♛') {
                        checkArray.push({ index: i, piece: values[i] });
                        break;
                    }
                    break;
                }
            }
            for (let i = rightArray[index]; i > -1; i = rightArray[i]) {
                if (values[i] != '') {
                    if (values[i] == '♜' || values[i] == '♛') {
                        checkArray.push({ index: i, piece: values[i] });
                        break;
                    }
                    break;
                }
            }
            for (let i = upArray[leftArray[index]]; i > -1; i = upArray[leftArray[i]]) {
                if (values[i] != '') {
                    if (values[i] == '♝' || values[i] == '♛') {
                        checkArray.push({ index: i, piece: values[i] });
                        break;
                    }
                    break;
                }
            }
            for (let i = downArray[rightArray[index]]; i > -1; i = downArray[rightArray[i]]) {
                if (values[i] != '') {
                    if (values[i] == '♝' || values[i] == '♛') {
                        checkArray.push({ index: i, piece: values[i] });
                        break;
                    }
                    break;
                }
            }
            for (let i = upArray[rightArray[index]]; i > -1; i = upArray[rightArray[i]]) {
                if (values[i] != '') {
                    if (values[i] == '♝' || values[i] == '♛') {
                        checkArray.push({ index: i, piece: values[i] });
                        break;
                    }
                    break;
                }
            }
            for (let i = downArray[leftArray[index]]; i > -1; i = downArray[leftArray[i]]) {
                if (values[i] != '') {
                    if (values[i] == '♝' || values[i] == '♛') {
                        checkArray.push({ index: i, piece: values[i] });
                        break;
                    }
                    break;
                }
            }
            if (values[upArray[leftArray[index]]] == '♟') {
                checkArray.push({ index: upArray[leftArray[index]], piece: '♟' });
            }
            if (values[upArray[rightArray[index]]] == '♟') {
                checkArray.push({ index: upArray[rightArray[index]], piece: '♟' });
            }
            if (values[upArray[leftArray[leftArray[index]]]] == '♞') {
                checkArray.push({ index: upArray[leftArray[leftArray[index]]], piece: '♞' });
            }
            if (values[downArray[leftArray[leftArray[index]]]] == '♞') {
                checkArray.push({ index: downArray[leftArray[leftArray[index]]], piece: '♞' });
            }
            if (values[upArray[upArray[leftArray[index]]]] == '♞') {
                checkArray.push({ index: upArray[upArray[leftArray[index]]], piece: '♞' });
            }
            if (values[downArray[downArray[leftArray[index]]]] == '♞') {
                checkArray.push({ index: downArray[downArray[leftArray[index]]], piece: '♞' });
            }
            if (values[upArray[rightArray[rightArray[index]]]] == '♞') {
                checkArray.push({ index: upArray[rightArray[rightArray[index]]], piece: '♞' });
            }
            if (values[downArray[rightArray[rightArray[index]]]] == '♞') {
                checkArray.push({ index: downArray[rightArray[rightArray[index]]], piece: '♞' });
            }
            if (values[upArray[upArray[rightArray[index]]]] == '♞') {
                checkArray.push({ index: upArray[upArray[rightArray[index]]], piece: '♞' });
            }
            if (values[downArray[downArray[rightArray[index]]]] == '♞') {
                checkArray.push({ index: downArray[downArray[rightArray[index]]], piece: '♞' });
            }
        }
        return checkArray;
    }

    const checkForCastle = (kingIndex, rookIndex) => {
        if (kingIndex == 60 && !selected.moved[0]) {
            // white king
            if (rookIndex == 56 && !selected.moved[2]) {
                // left rook
                if (values[59] == '' && values[58] == '' && values[57] == '' && !checkForCheckWhite(60) && !checkForCheckWhite(59) && !checkForCheckWhite(58)) {
                    return true;
                }
            } else if (rookIndex == 63 && !selected.moved[3]) {
                // right rook
                if (values[61] == '' && values[62] == '' && !checkForCheckWhite(60) && !checkForCheckWhite(61) && !checkForCheckWhite(62)) {
                    return true;
                }
            }
        } else if (kingIndex == 4 && !selected.moved[1]) {
            // black king
            if (rookIndex == 0 && !selected.moved[4]) {
                // left rook
                if (values[3] == '' && values[2] == '' && values[1] == '' && !checkForCheckBlack(4) && !checkForCheckBlack(3) && !checkForCheckBlack(2)) {
                    return true;
                }
            } else if (rookIndex == 7 && !selected.moved[5]) {
                // right rook
                if (values[5] == '' && values[6] == '' && !checkForCheckBlack(4) && !checkForCheckBlack(5) && !checkForCheckBlack(6)) {
                    return true;
                }
            }
        }
        return false;
    }

    const whiteKingMovement = (array, index) => {
        if (values[upArray[index]] == '' || blackPieces(values[upArray[index]])) {
            if (!checkForCheckWhite(upArray[index])) {
                array.push(upArray[index]);
            }
        }
        if (values[downArray[index]] == '' || blackPieces(values[downArray[index]])) {
            if (!checkForCheckWhite(downArray[index])) {
                array.push(downArray[index]);
            }
        }
        if (values[leftArray[index]] == '' || blackPieces(values[leftArray[index]])) {
            if (!checkForCheckWhite(leftArray[index])) {
                array.push(leftArray[index]);
            }
        }
        if (values[rightArray[index]] == '' || blackPieces(values[rightArray[index]])) {
            if (!checkForCheckWhite(rightArray[index])) {
                array.push(rightArray[index]);
            }
        }
        if (values[upArray[leftArray[index]]] == '' || blackPieces(values[upArray[leftArray[index]]])) {
            if (!checkForCheckWhite(upArray[leftArray[index]])) {
                array.push(upArray[leftArray[index]]);
            }
        }
        if (values[downArray[leftArray[index]]] == '' || blackPieces(values[downArray[leftArray[index]]])) {
            if (!checkForCheckWhite(downArray[leftArray[index]])) {
                array.push(downArray[leftArray[index]]);
            }
        }
        if (values[upArray[rightArray[index]]] == '' || blackPieces(values[upArray[rightArray[index]]])) {
            if (!checkForCheckWhite(upArray[rightArray[index]])) {
                array.push(upArray[rightArray[index]]);
            }
        }
        if (values[downArray[rightArray[index]]] == '' || blackPieces(values[downArray[rightArray[index]]])) {
            if (!checkForCheckWhite(downArray[rightArray[index]])) {
                array.push(downArray[rightArray[index]]);
            }
        }
    }

    const blackKingMovement = (array, index) => {
        if (values[upArray[index]] == '' || whitePieces(values[upArray[index]])) {
            if (!checkForCheckBlack(upArray[index])) {
                array.push(upArray[index]);
            }
        }
        if (values[downArray[index]] == '' || whitePieces(values[downArray[index]])) {
            if (!checkForCheckBlack(downArray[index])) {
                array.push(downArray[index]);
            }
        }
        if (values[leftArray[index]] == '' || whitePieces(values[leftArray[index]])) {
            if (!checkForCheckBlack(leftArray[index])) {
                array.push(leftArray[index]);
            }
        }
        if (values[rightArray[index]] == '' || whitePieces(values[rightArray[index]])) {
            if (!checkForCheckBlack(rightArray[index])) {
                array.push(rightArray[index]);
            }
        }
        if (values[upArray[leftArray[index]]] == '' || whitePieces(values[upArray[leftArray[index]]])) {
            if (!checkForCheckBlack(upArray[leftArray[index]])) {
                array.push(upArray[leftArray[index]]);
            }
        }
        if (values[downArray[leftArray[index]]] == '' || whitePieces(values[downArray[leftArray[index]]])) {
            if (!checkForCheckBlack(downArray[leftArray[index]])) {
                array.push(downArray[leftArray[index]]);
            }
        }
        if (values[upArray[rightArray[index]]] == '' || whitePieces(values[upArray[rightArray[index]]])) {
            if (!checkForCheckBlack(upArray[rightArray[index]])) {
                array.push(upArray[rightArray[index]]);
            }
        }
        if (values[downArray[rightArray[index]]] == '' || whitePieces(values[downArray[rightArray[index]]])) {
            if (!checkForCheckBlack(downArray[rightArray[index]])) {
                array.push(downArray[rightArray[index]]);
            }
        }
    }

    const checkForMovement = (index) => {
        var moveArray = [];
        moveArray.push(index);
        var discDir = '';
        if (player == 'White') {
            if (values[index] == '♔') {
                var checkIndex = index;
            } else {
                var checkIndex = values.findIndex(value => value == '♔');
            }
            var discoverArray = checkForDiscoverCheckWhite(checkIndex);
        } else {
            if (values[index] == '♚') {
                var checkIndex = index;
            } else {
                var checkIndex = values.findIndex(value => value == '♚');
            }
            var discoverArray = checkForDiscoverCheckBlack(checkIndex);
        }
        if (discoverArray.some(val => (index == val.piece))) {
            discDir = discoverArray.find(val => (index == val.piece)).direction;
        }
        var checkArr = checkArray(checkIndex, player);
        if (checkArr.length > 1) {
            switch (values[index]) {
                // White King Movement
                case '♔':
                    whiteKingMovement(moveArray, index);
                    break;
                // Black King Movement
                case '♚':
                    blackKingMovement(moveArray, index);
                    break;
                default:
                    break;
            }
        } else if (checkArr.length == 1) {
            var uncheckArray = [];
            switch (checkArr[0].piece) {
                case '♕':
                case '♛':
                    if (Math.floor(checkArr[0].index / 8) == Math.floor(checkIndex / 8)) {
                        // same rank
                        if (checkArr[0].index > checkIndex) {
                            for (let i = checkArr[0].index; i > checkIndex; i--) {
                                uncheckArray.push(i);
                            }
                        } else if (checkArr[0].index < checkIndex) {
                            for (let i = checkArr[0].index; i < checkIndex; i++) {
                                uncheckArray.push(i);
                            }
                        }
                    } else if (checkArr[0].index % 8 == checkIndex % 8) {
                        // same file
                        if (checkArr[0].index > checkIndex) {
                            for (let i = checkArr[0].index; i > checkIndex; i -= 8) {
                                uncheckArray.push(i);
                            }
                        } else if (checkArr[0].index < checkIndex) {
                            for (let i = checkArr[0].index; i < checkIndex; i += 8) {
                                uncheckArray.push(i);
                            }
                        }
                    } else if (checkArr[0].index % 9 == checkIndex % 9) {
                        if (checkArr[0].index > checkIndex) {
                            for (let i = checkArr[0].index; i > checkIndex; i -= 9) {
                                uncheckArray.push(i);
                            }
                        } else if (checkArr[0].index < checkIndex) {
                            for (let i = checkArr[0].index; i < checkIndex; i += 9) {
                                uncheckArray.push(i);
                            }
                        }
                    } else if (checkArr[0].index % 7 == checkIndex % 7) {
                        if (checkArr[0].index > checkIndex) {
                            for (let i = checkArr[0].index; i > checkIndex; i -= 7) {
                                uncheckArray.push(i);
                            }
                        } else if (checkArr[0].index < checkIndex) {
                            for (let i = checkArr[0].index; i < checkIndex; i += 7) {
                                uncheckArray.push(i);
                            }
                        }
                    }
                    break;
                case '♗':
                case '♝':
                    if (checkArr[0].index % 9 == checkIndex % 9) {
                        if (checkArr[0].index > checkIndex) {
                            for (let i = checkArr[0].index; i > checkIndex; i -= 9) {
                                uncheckArray.push(i);
                            }
                        } else if (checkArr[0].index < checkIndex) {
                            for (let i = checkArr[0].index; i < checkIndex; i += 9) {
                                uncheckArray.push(i);
                            }
                        }
                    } else if (checkArr[0].index % 7 == checkIndex % 7) {
                        if (checkArr[0].index > checkIndex) {
                            for (let i = checkArr[0].index; i > checkIndex; i -= 7) {
                                uncheckArray.push(i);
                            }
                        } else if (checkArr[0].index < checkIndex) {
                            for (let i = checkArr[0].index; i < checkIndex; i += 7) {
                                uncheckArray.push(i);
                            }
                        }
                    }
                    break;
                case '♖':
                case '♜':
                    if (Math.floor(checkArr[0].index / 8) == Math.floor(checkIndex / 8)) {
                        // same rank
                        if (checkArr[0].index > checkIndex) {
                            for (let i = checkArr[0].index; i > checkIndex; i--) {
                                uncheckArray.push(i);
                            }
                        } else if (checkArr[0].index < checkIndex) {
                            for (let i = checkArr[0].index; i < checkIndex; i++) {
                                uncheckArray.push(i);
                            }
                        }
                    } else if (checkArr[0].index % 8 == checkIndex % 8) {
                        // same file
                        if (checkArr[0].index > checkIndex) {
                            for (let i = checkArr[0].index; i > checkIndex; i -= 8) {
                                uncheckArray.push(i);
                            }
                        } else if (checkArr[0].index < checkIndex) {
                            for (let i = checkArr[0].index; i < checkIndex; i += 8) {
                                uncheckArray.push(i);
                            }
                        }
                    }
                    break;
                case '♘':
                case '♞':
                case '♙':
                case '♟':
                    uncheckArray.push(checkArr[0].index);
                    break;
                default:
                    break;
            }
            switch (values[index]) {
                // White Pawn Movement
                case '♙':
                    if (discDir == 'up-right' || discDir == 'down-left' || discDir == '') {
                        if (uncheckArray.some(val => (upArray[rightArray[index]] == val)) && values[upArray[rightArray[index]]] != '') {
                            moveArray.push(upArray[rightArray[index]]);
                        }
                    }
                    if (discDir == 'up-left' || discDir == 'down-right' || discDir == '') {
                        if (uncheckArray.some(val => (upArray[leftArray[index]] == val)) && values[upArray[leftArray[index]]] != '') {
                            moveArray.push(upArray[leftArray[index]]);
                        }
                    }
                    if (discDir == 'up' || discDir == 'down' || discDir == '') {
                        if (uncheckArray.some(val => (upArray[index] == val)) && values[upArray[index]] == '') {
                            moveArray.push(upArray[index]);
                        }
                        if (Math.floor(index / 8) == 6 && values[upArray[index]] == '') {
                            if (uncheckArray.some(val => (upArray[upArray[index]] == val)) && values[upArray[upArray[index]]] == '') {
                                moveArray.push(upArray[upArray[index]]);
                            }
                        }
                    }
                    break;
                // Black Pawn Movement
                case '♟':
                    if (discDir == 'up-right' || discDir == 'down-left' || discDir == '') {
                        if (uncheckArray.some(val => (downArray[leftArray[index]] == val)) && values[downArray[leftArray[index]]] != '') {
                            moveArray.push(downArray[leftArray[index]]);
                        }
                    }
                    if (discDir == 'up-left' || discDir == 'down-right' || discDir == '') {
                        if (uncheckArray.some(val => (downArray[rightArray[index]] == val)) && values[downArray[rightArray[index]]] != '') {
                            moveArray.push(downArray[rightArray[index]]);
                        }
                    }
                    if (discDir == 'up' || discDir == 'down' || discDir == '') {
                        if (uncheckArray.some(val => (downArray[index] == val)) && values[downArray[index]] == '') {
                            moveArray.push(downArray[index]);
                        }
                        if (Math.floor(index / 8) == 1 && values[downArray[index]] == '') {
                            if (uncheckArray.some(val => (downArray[downArray[index]] == val)) && values[downArray[downArray[index]]] == '') {
                                moveArray.push(downArray[downArray[index]]);
                            }
                        }
                    }
                    break;
                // Rook Movement
                case '♖':
                case '♜':
                    if (discDir == 'up' || discDir == 'down' || discDir == '') {
                        for (let i = upArray[index]; i > -1; i = upArray[i]) {
                            if (uncheckArray.some(val => (i == val))) {
                                moveArray.push(i);
                            } else if (values[i] == '') {
                                continue;
                            } else {
                                break;
                            }
                        }
                        for (let i = downArray[index]; i > -1; i = downArray[i]) {
                            if (uncheckArray.some(val => (i == val))) {
                                moveArray.push(i);
                            } else if (values[i] == '') {
                                continue;
                            } else {
                                break;
                            }
                        }
                    }
                    if (discDir == 'left' || discDir == 'right' || discDir == '') {
                        for (let i = leftArray[index]; i > -1; i = leftArray[i]) {
                            if (uncheckArray.some(val => (i == val))) {
                                moveArray.push(i);
                            } else if (values[i] == '') {
                                continue;
                            } else {
                                break;
                            }
                        }
                        for (let i = rightArray[index]; i > -1; i = rightArray[i]) {
                            if (uncheckArray.some(val => (i == val))) {
                                moveArray.push(i);
                            } else if (values[i] == '') {
                                continue;
                            } else {
                                break;
                            }
                        }
                    }
                    break;
                // Knight Movement
                case '♘':
                case '♞':
                    if (discDir == '') {
                        if (uncheckArray.some(val => (upArray[leftArray[leftArray[index]]] == val))) {
                            moveArray.push(upArray[leftArray[leftArray[index]]]);
                        }
                        if (uncheckArray.some(val => (downArray[leftArray[leftArray[index]]] == val))) {
                            moveArray.push(downArray[leftArray[leftArray[index]]]);
                        }
                        if (uncheckArray.some(val => (upArray[upArray[leftArray[index]]] == val))) {
                            moveArray.push(upArray[upArray[leftArray[index]]]);
                        }
                        if (uncheckArray.some(val => (downArray[downArray[leftArray[index]]] == val))) {
                            moveArray.push(downArray[downArray[leftArray[index]]]);
                        }
                        if (uncheckArray.some(val => (upArray[rightArray[rightArray[index]]] == val))) {
                            moveArray.push(upArray[rightArray[rightArray[index]]]);
                        }
                        if (uncheckArray.some(val => (downArray[rightArray[rightArray[index]]] == val))) {
                            moveArray.push(downArray[rightArray[rightArray[index]]]);
                        }
                        if (uncheckArray.some(val => (upArray[upArray[rightArray[index]]] == val))) {
                            moveArray.push(upArray[upArray[rightArray[index]]]);
                        }
                        if (uncheckArray.some(val => (downArray[downArray[rightArray[index]]] == val))) {
                            moveArray.push(downArray[downArray[rightArray[index]]]);
                        }
                    }
                    break;
                // Bishop Movement
                case '♗':
                case '♝':
                    if (discDir == 'up-left' || discDir == 'down-right' || discDir == '') {
                        for (let i = upArray[leftArray[index]]; i > -1; i = upArray[leftArray[i]]) {
                            if (uncheckArray.some(val => (i == val))) {
                                moveArray.push(i);
                            } else if (values[i] == '') {
                                continue;
                            } else {
                                break;
                            }
                        }
                        for (let i = downArray[rightArray[index]]; i > -1; i = downArray[rightArray[i]]) {
                            if (uncheckArray.some(val => (i == val))) {
                                moveArray.push(i);
                            } else if (values[i] == '') {
                                continue;
                            } else {
                                break;
                            }
                        }
                    }
                    if (discDir == 'up-right' || discDir == 'down-left' || discDir == '') {
                        for (let i = upArray[rightArray[index]]; i > -1; i = upArray[rightArray[i]]) {
                            if (uncheckArray.some(val => (i == val))) {
                                moveArray.push(i);
                            } else if (values[i] == '') {
                                continue;
                            } else {
                                break;
                            }
                        }
                        for (let i = downArray[leftArray[index]]; i > -1; i = downArray[leftArray[i]]) {
                            if (uncheckArray.some(val => (i == val))) {
                                moveArray.push(i);
                            } else if (values[i] == '') {
                                continue;
                            } else {
                                break;
                            }
                        }
                    }
                    break;
                // Queen Movement
                case '♕':
                case '♛':
                    if (discDir == 'up' || discDir == 'down' || discDir == '') {
                        for (let i = upArray[index]; i > -1; i = upArray[i]) {
                            if (uncheckArray.some(val => (i == val))) {
                                moveArray.push(i);
                            } else if (values[i] == '') {
                                continue;
                            } else {
                                break;
                            }
                        }
                        for (let i = downArray[index]; i > -1; i = downArray[i]) {
                            if (uncheckArray.some(val => (i == val))) {
                                moveArray.push(i);
                            } else if (values[i] == '') {
                                continue;
                            } else {
                                break;
                            }
                        }
                    }
                    if (discDir == 'left' || discDir == 'right' || discDir == '') {
                        for (let i = leftArray[index]; i > -1; i = leftArray[i]) {
                            if (uncheckArray.some(val => (i == val))) {
                                moveArray.push(i);
                            } else if (values[i] == '') {
                                continue;
                            } else {
                                break;
                            }
                        }
                        for (let i = rightArray[index]; i > -1; i = rightArray[i]) {
                            if (uncheckArray.some(val => (i == val))) {
                                moveArray.push(i);
                            } else if (values[i] == '') {
                                continue;
                            } else {
                                break;
                            }
                        }
                    }
                    if (discDir == 'up-left' || discDir == 'down-right' || discDir == '') {
                        for (let i = upArray[leftArray[index]]; i > -1; i = upArray[leftArray[i]]) {
                            if (uncheckArray.some(val => (i == val))) {
                                moveArray.push(i);
                            } else if (values[i] == '') {
                                continue;
                            } else {
                                break;
                            }
                        }
                        for (let i = downArray[rightArray[index]]; i > -1; i = downArray[rightArray[i]]) {
                            if (uncheckArray.some(val => (i == val))) {
                                moveArray.push(i);
                            } else if (values[i] == '') {
                                continue;
                            } else {
                                break;
                            }
                        }
                    }
                    if (discDir == 'up-right' || discDir == 'down-left' || discDir == '') {
                        for (let i = upArray[rightArray[index]]; i > -1; i = upArray[rightArray[i]]) {
                            if (uncheckArray.some(val => (i == val))) {
                                moveArray.push(i);
                            } else if (values[i] == '') {
                                continue;
                            } else {
                                break;
                            }
                        }
                        for (let i = downArray[leftArray[index]]; i > -1; i = downArray[leftArray[i]]) {
                            if (uncheckArray.some(val => (i == val))) {
                                moveArray.push(i);
                            } else if (values[i] == '') {
                                continue;
                            } else {
                                break;
                            }
                        }
                    }
                    break;
                // White King Movement
                case '♔':
                    whiteKingMovement(moveArray, index);
                    break;
                // Black King Movement
                case '♚':
                    blackKingMovement(moveArray, index);
                    break;
                default:
                    break;
            }
        } else {
            switch (values[index]) {
                // White Pawn Movement
                case '♙':
                    if (discDir == 'up-right' || discDir == 'down-left' || discDir == '') {
                        if (blackPieces(values[upArray[rightArray[index]]])) {
                            moveArray.push(upArray[rightArray[index]]);
                        }
                    }
                    if (discDir == 'up-left' || discDir == 'down-right' || discDir == '') {
                        if (blackPieces(values[upArray[leftArray[index]]])) {
                            moveArray.push(upArray[leftArray[index]]);
                        }
                    }
                    if (discDir == 'up' || discDir == 'down' || discDir == '') {
                        if (values[upArray[index]] == '') {
                            moveArray.push(upArray[index]);
                            if (Math.floor(index / 8) == 6 && values[upArray[upArray[index]]] == '') {
                                moveArray.push(upArray[upArray[index]]);
                            }
                        }
                    }
                    break;
                // Black Pawn Movement
                case '♟':
                    if (discDir == 'up-right' || discDir == 'down-left' || discDir == '') {
                        if (whitePieces(values[downArray[leftArray[index]]])) {
                            moveArray.push(downArray[leftArray[index]]);
                        }
                    }
                    if (discDir == 'up-left' || discDir == 'down-right' || discDir == '') {
                        if (whitePieces(values[downArray[rightArray[index]]])) {
                            moveArray.push(downArray[rightArray[index]]);
                        }
                    }
                    if (discDir == 'up' || discDir == 'down' || discDir == '') {
                        if (values[downArray[index]] == '') {
                            moveArray.push(downArray[index]);
                            if (Math.floor(index / 8) == 1 && values[downArray[downArray[index]]] == '') {
                                moveArray.push(downArray[downArray[index]]);
                            }
                        }
                    }
                    break;
                // White Rook Movement
                case '♖':
                    if (discDir == 'up' || discDir == 'down' || discDir == '') {
                        for (let i = upArray[index]; i > -1; i = upArray[i]) {
                            if (values[i] == '') {
                                moveArray.push(i);
                            } else {
                                if (blackPieces(values[i])) {
                                    moveArray.push(i);
                                }
                                break;
                            }
                        }
                        for (let i = downArray[index]; i > -1; i = downArray[i]) {
                            if (values[i] == '') {
                                moveArray.push(i);
                            } else {
                                if (blackPieces(values[i])) {
                                    moveArray.push(i);
                                }
                                break;
                            }
                        }
                    }
                    if (discDir == 'left' || discDir == 'right' || discDir == '') {
                        for (let i = leftArray[index]; i > -1; i = leftArray[i]) {
                            if (values[i] == '') {
                                moveArray.push(i);
                            } else {
                                if (blackPieces(values[i])) {
                                    moveArray.push(i);
                                }
                                break;
                            }
                        }
                        for (let i = rightArray[index]; i > -1; i = rightArray[i]) {
                            if (values[i] == '') {
                                moveArray.push(i);
                            } else {
                                if (blackPieces(values[i])) {
                                    moveArray.push(i);
                                }
                                break;
                            }
                        }
                    }
                    break;
                // Black Rook Movement
                case '♜':
                    if (discDir == 'up' || discDir == 'down' || discDir == '') {
                        for (let i = upArray[index]; i > -1; i = upArray[i]) {
                            if (values[i] == '') {
                                moveArray.push(i);
                            } else {
                                if (whitePieces(values[i])) {
                                    moveArray.push(i);
                                }
                                break;
                            }
                        }
                        for (let i = downArray[index]; i > -1; i = downArray[i]) {
                            if (values[i] == '') {
                                moveArray.push(i);
                            } else {
                                if (whitePieces(values[i])) {
                                    moveArray.push(i);
                                }
                                break;
                            }
                        }
                    }
                    if (discDir == 'left' || discDir == 'right' || discDir == '') {
                        for (let i = leftArray[index]; i > -1; i = leftArray[i]) {
                            if (values[i] == '') {
                                moveArray.push(i);
                            } else {
                                if (whitePieces(values[i])) {
                                    moveArray.push(i);
                                }
                                break;
                            }
                        }
                        for (let i = rightArray[index]; i > -1; i = rightArray[i]) {
                            if (values[i] == '') {
                                moveArray.push(i);
                            } else {
                                if (whitePieces(values[i])) {
                                    moveArray.push(i);
                                }
                                break;
                            }
                        }
                    }
                    break;
                // White Knight Movement
                case '♘':
                    if (discDir == '') {
                        if (values[upArray[leftArray[leftArray[index]]]] == '' || blackPieces(values[upArray[leftArray[leftArray[index]]]])) {
                            moveArray.push(upArray[leftArray[leftArray[index]]]);
                        }
                        if (values[downArray[leftArray[leftArray[index]]]] == '' || blackPieces(values[downArray[leftArray[leftArray[index]]]])) {
                            moveArray.push(downArray[leftArray[leftArray[index]]]);
                        }
                        if (values[upArray[upArray[leftArray[index]]]] == '' || blackPieces(values[upArray[upArray[leftArray[index]]]])) {
                            moveArray.push(upArray[upArray[leftArray[index]]]);
                        }
                        if (values[downArray[downArray[leftArray[index]]]] == '' || blackPieces(values[downArray[downArray[leftArray[index]]]])) {
                            moveArray.push(downArray[downArray[leftArray[index]]]);
                        }
                        if (values[upArray[rightArray[rightArray[index]]]] == '' || blackPieces(values[upArray[rightArray[rightArray[index]]]])) {
                            moveArray.push(upArray[rightArray[rightArray[index]]]);
                        }
                        if (values[downArray[rightArray[rightArray[index]]]] == '' || blackPieces(values[downArray[rightArray[rightArray[index]]]])) {
                            moveArray.push(downArray[rightArray[rightArray[index]]]);
                        }
                        if (values[upArray[upArray[rightArray[index]]]] == '' || blackPieces(values[upArray[upArray[rightArray[index]]]])) {
                            moveArray.push(upArray[upArray[rightArray[index]]]);
                        }
                        if (values[downArray[downArray[rightArray[index]]]] == '' || blackPieces(values[downArray[downArray[rightArray[index]]]])) {
                            moveArray.push(downArray[downArray[rightArray[index]]]);
                        }
                    }
                    break;
                // Black Knight Movement
                case '♞':
                    if (discDir == '') {
                        if (values[upArray[leftArray[leftArray[index]]]] == '' || whitePieces(values[upArray[leftArray[leftArray[index]]]])) {
                            moveArray.push(upArray[leftArray[leftArray[index]]]);
                        }
                        if (values[downArray[leftArray[leftArray[index]]]] == '' || whitePieces(values[downArray[leftArray[leftArray[index]]]])) {
                            moveArray.push(downArray[leftArray[leftArray[index]]]);
                        }
                        if (values[upArray[upArray[leftArray[index]]]] == '' || whitePieces(values[upArray[upArray[leftArray[index]]]])) {
                            moveArray.push(upArray[upArray[leftArray[index]]]);
                        }
                        if (values[downArray[downArray[leftArray[index]]]] == '' || whitePieces(values[downArray[downArray[leftArray[index]]]])) {
                            moveArray.push(downArray[downArray[leftArray[index]]]);
                        }
                        if (values[upArray[rightArray[rightArray[index]]]] == '' || whitePieces(values[upArray[rightArray[rightArray[index]]]])) {
                            moveArray.push(upArray[rightArray[rightArray[index]]]);
                        }
                        if (values[downArray[rightArray[rightArray[index]]]] == '' || whitePieces(values[downArray[rightArray[rightArray[index]]]])) {
                            moveArray.push(downArray[rightArray[rightArray[index]]]);
                        }
                        if (values[upArray[upArray[rightArray[index]]]] == '' || whitePieces(values[upArray[upArray[rightArray[index]]]])) {
                            moveArray.push(upArray[upArray[rightArray[index]]]);
                        }
                        if (values[downArray[downArray[rightArray[index]]]] == '' || whitePieces(values[downArray[downArray[rightArray[index]]]])) {
                            moveArray.push(downArray[downArray[rightArray[index]]]);
                        }
                    }
                    break;
                // White Bishop Movement
                case '♗':
                    if (discDir == 'up-left' || discDir == 'down-right' || discDir == '') {
                        for (let i = upArray[leftArray[index]]; i > -1; i = upArray[leftArray[i]]) {
                            if (values[i] == '') {
                                moveArray.push(i);
                            } else {
                                if (blackPieces(values[i])) {
                                    moveArray.push(i);
                                }
                                break;
                            }
                        }
                        for (let i = downArray[rightArray[index]]; i > -1; i = downArray[rightArray[i]]) {
                            if (values[i] == '') {
                                moveArray.push(i);
                            } else {
                                if (blackPieces(values[i])) {
                                    moveArray.push(i);
                                }
                                break;
                            }
                        }
                    }
                    if (discDir == 'up-right' || discDir == 'down-left' || discDir == '') {
                        for (let i = upArray[rightArray[index]]; i > -1; i = upArray[rightArray[i]]) {
                            if (values[i] == '') {
                                moveArray.push(i);
                            } else {
                                if (blackPieces(values[i])) {
                                    moveArray.push(i);
                                }
                                break;
                            }
                        }
                        for (let i = downArray[leftArray[index]]; i > -1; i = downArray[leftArray[i]]) {
                            if (values[i] == '') {
                                moveArray.push(i);
                            } else {
                                if (blackPieces(values[i])) {
                                    moveArray.push(i);
                                }
                                break;
                            }
                        }
                    }
                    break;
                // Black Bishop Movement
                case '♝':
                    if (discDir == 'up-left' || discDir == 'down-right' || discDir == '') {
                        for (let i = upArray[leftArray[index]]; i > -1; i = upArray[leftArray[i]]) {
                            if (values[i] == '') {
                                moveArray.push(i);
                            } else {
                                if (whitePieces(values[i])) {
                                    moveArray.push(i);
                                }
                                break;
                            }
                        }
                        for (let i = downArray[rightArray[index]]; i > -1; i = downArray[rightArray[i]]) {
                            if (values[i] == '') {
                                moveArray.push(i);
                            } else {
                                if (whitePieces(values[i])) {
                                    moveArray.push(i);
                                }
                                break;
                            }
                        }
                    }
                    if (discDir == 'up-right' || discDir == 'down-left' || discDir == '') {
                        for (let i = upArray[rightArray[index]]; i > -1; i = upArray[rightArray[i]]) {
                            if (values[i] == '') {
                                moveArray.push(i);
                            } else {
                                if (whitePieces(values[i])) {
                                    moveArray.push(i);
                                }
                                break;
                            }
                        }
                        for (let i = downArray[leftArray[index]]; i > -1; i = downArray[leftArray[i]]) {
                            if (values[i] == '') {
                                moveArray.push(i);
                            } else {
                                if (whitePieces(values[i])) {
                                    moveArray.push(i);
                                }
                                break;
                            }
                        }
                    }
                    break;
                // White Queen Movement
                case '♕':
                    if (discDir == 'up' || discDir == 'down' || discDir == '') {
                        for (let i = upArray[index]; i > -1; i = upArray[i]) {
                            if (values[i] == '') {
                                moveArray.push(i);
                            } else {
                                if (blackPieces(values[i])) {
                                    moveArray.push(i);
                                }
                                break;
                            }
                        }
                        for (let i = downArray[index]; i > -1; i = downArray[i]) {
                            if (values[i] == '') {
                                moveArray.push(i);
                            } else {
                                if (blackPieces(values[i])) {
                                    moveArray.push(i);
                                }
                                break;
                            }
                        }
                    }
                    if (discDir == 'left' || discDir == 'right' || discDir == '') {
                        for (let i = leftArray[index]; i > -1; i = leftArray[i]) {
                            if (values[i] == '') {
                                moveArray.push(i);
                            } else {
                                if (blackPieces(values[i])) {
                                    moveArray.push(i);
                                }
                                break;
                            }
                        }
                        for (let i = rightArray[index]; i > -1; i = rightArray[i]) {
                            if (values[i] == '') {
                                moveArray.push(i);
                            } else {
                                if (blackPieces(values[i])) {
                                    moveArray.push(i);
                                }
                                break;
                            }
                        }
                    }
                    if (discDir == 'up-left' || discDir == 'down-right' || discDir == '') {
                        for (let i = upArray[leftArray[index]]; i > -1; i = upArray[leftArray[i]]) {
                            if (values[i] == '') {
                                moveArray.push(i);
                            } else {
                                if (blackPieces(values[i])) {
                                    moveArray.push(i);
                                }
                                break;
                            }
                        }
                        for (let i = downArray[rightArray[index]]; i > -1; i = downArray[rightArray[i]]) {
                            if (values[i] == '') {
                                moveArray.push(i);
                            } else {
                                if (blackPieces(values[i])) {
                                    moveArray.push(i);
                                }
                                break;
                            }
                        }
                    }
                    if (discDir == 'up-right' || discDir == 'down-left' || discDir == '') {
                        for (let i = upArray[rightArray[index]]; i > -1; i = upArray[rightArray[i]]) {
                            if (values[i] == '') {
                                moveArray.push(i);
                            } else {
                                if (blackPieces(values[i])) {
                                    moveArray.push(i);
                                }
                                break;
                            }
                        }
                        for (let i = downArray[leftArray[index]]; i > -1; i = downArray[leftArray[i]]) {
                            if (values[i] == '') {
                                moveArray.push(i);
                            } else {
                                if (blackPieces(values[i])) {
                                    moveArray.push(i);
                                }
                                break;
                            }
                        }
                    }
                    break;
                // Black Queen Movement
                case '♛':
                    if (discDir == 'up' || discDir == 'down' || discDir == '') {
                        for (let i = upArray[index]; i > -1; i = upArray[i]) {
                            if (values[i] == '') {
                                moveArray.push(i);
                            } else {
                                if (whitePieces(values[i])) {
                                    moveArray.push(i);
                                }
                                break;
                            }
                        }
                        for (let i = downArray[index]; i > -1; i = downArray[i]) {
                            if (values[i] == '') {
                                moveArray.push(i);
                            } else {
                                if (whitePieces(values[i])) {
                                    moveArray.push(i);
                                }
                                break;
                            }
                        }
                    }
                    if (discDir == 'left' || discDir == 'right' || discDir == '') {
                        for (let i = leftArray[index]; i > -1; i = leftArray[i]) {
                            if (values[i] == '') {
                                moveArray.push(i);
                            } else {
                                if (whitePieces(values[i])) {
                                    moveArray.push(i);
                                }
                                break;
                            }
                        }
                        for (let i = rightArray[index]; i > -1; i = rightArray[i]) {
                            if (values[i] == '') {
                                moveArray.push(i);
                            } else {
                                if (whitePieces(values[i])) {
                                    moveArray.push(i);
                                }
                                break;
                            }
                        }
                    }
                    if (discDir == 'up-left' || discDir == 'down-right' || discDir == '') {
                        for (let i = upArray[leftArray[index]]; i > -1; i = upArray[leftArray[i]]) {
                            if (values[i] == '') {
                                moveArray.push(i);
                            } else {
                                if (whitePieces(values[i])) {
                                    moveArray.push(i);
                                }
                                break;
                            }
                        }
                        for (let i = downArray[rightArray[index]]; i > -1; i = downArray[rightArray[i]]) {
                            if (values[i] == '') {
                                moveArray.push(i);
                            } else {
                                if (whitePieces(values[i])) {
                                    moveArray.push(i);
                                }
                                break;
                            }
                        }
                    }
                    if (discDir == 'up-right' || discDir == 'down-left' || discDir == '') {
                        for (let i = upArray[rightArray[index]]; i > -1; i = upArray[rightArray[i]]) {
                            if (values[i] == '') {
                                moveArray.push(i);
                            } else {
                                if (whitePieces(values[i])) {
                                    moveArray.push(i);
                                }
                                break;
                            }
                        }
                        for (let i = downArray[leftArray[index]]; i > -1; i = downArray[leftArray[i]]) {
                            if (values[i] == '') {
                                moveArray.push(i);
                            } else {
                                if (whitePieces(values[i])) {
                                    moveArray.push(i);
                                }
                                break;
                            }
                        }
                    }
                    break;
                // White King Movement
                case '♔':
                    whiteKingMovement(moveArray, index);
                    break;
                // Black King Movement
                case '♚':
                    blackKingMovement(moveArray, index);
                    break;
                default:
                    break;
            }
        }
        return moveArray;
    }

    const checkForReps = () => {
        var whiteKing = values.findIndex(value => value == '♔');
        var blackKing = values.findIndex(value => value == '♚');
        var whiteQueens = [];
        values.forEach((value, index) => { if (value == '♕' && !whiteQueens.some(val => index == val)) { whiteQueens.push(index); } });
        var blackQueens = [];
        values.forEach((value, index) => { if (value == '♛' && !blackQueens.some(val => index == val)) { blackQueens.push(index); } });
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
        values.forEach((value, index) => { if (value == '♙' && !whitePawns.some(val => index == val)) { whitePawns.push(index); } });
        var blackPawns = [];
        values.forEach((value, index) => { if (value == '♟' && !blackPawns.some(val => index == val)) { blackPawns.push(index); } });
        var boardState = 'whiteKing:' + whiteKing.toString() + ';blackKing:' + blackKing.toString() + ';whiteQueens:' + whiteQueens.toString() + ';blackQueens:' + blackQueens.toString() + ';whiteBishops:' + whiteBishops.toString() + ';blackBishops:' + blackBishops.toString() +
            ';whiteKnights:' + whiteKnights.toString() + ';blackKnights:' + blackKnights.toString() + ';whiteRooks:' + whiteRooks.toString() + ';blackRooks:' + blackRooks.toString() + ';whitePawns:' + whitePawns.toString() + ';blackPawns:' + blackPawns.toString() +
            ';player:' + player.toString() + ';castle:' + selected.moved.toString() + ';passant:' + selected.passant.toString();
        var ind = repetitions.findIndex(value => value.boardState == boardState);
        if (ind != -1) {
            if (repetitions[ind].repeats == '4') {
                console.log('Draw by 5-fold repetition rule');
                setWin('Draw');
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

    const checkForCheck = () => {
        var whiteIndex = values.findIndex(value => value == '♔');
        var blackIndex = values.findIndex(value => value == '♚');
        var whiteCheck = checkForCheckWhite(whiteIndex);
        var blackCheck = checkForCheckBlack(blackIndex);
        if (whiteCheck || blackCheck) {
            setWin('Check');
        }
        if (!whiteCheck && !blackCheck) {
            setWin('');
        }
    }

    const checkForMate = () => {
        var blocked = checkForBlocked();
        var spliced = values.slice();
        for (let i = 0; i < blocked.length; i++) {
            spliced.splice(blocked[i] - i, 1);
        }
        if (player == 'White' && spliced.every(value => value != '♔' && value != '♕' && value != '♗' && value != '♘' && value != '♖' && value != '♙')) {
            if (win == 'Check') {
                console.log('Black wins by checkmate');
                setWin('Black');
                return;
            } else {
                console.log('Black draws by stalemate');
                setWin('Draw');
            }
        }
        if (player == 'Black' && spliced.every(value => value != '♚' && value != '♛' && value != '♝' && value != '♞' && value != '♜' && value != '♟')) {
            if (win == 'Check') {
                console.log('White wins by checkmate');
                setWin('White');
                return;
            } else {
                console.log('White draws by stalemate');
                setWin('Draw');
            }
        }
        if (values.every(value => value != '♕' && value != '♗' && value != '♘' && value != '♖' && value != '♙' && value != '♛' && value != '♝' && value != '♞' && value != '♜' && value != '♟')) {
            console.log('Draw by dead position (King against King)');
            setWin('Draw');
        } else if (values.every(value => value != '♕' && value != '♘' && value != '♖' && value != '♙' && value != '♛' && value != '♝' && value != '♞' && value != '♜' && value != '♟')) {
            var a = values.findIndex(value => value == '♗');
            var b = values.findLastIndex(value => value == '♗');
            if (a == b) {
                console.log('Draw by dead position (White King and Bishop against Black King)');
                setWin('Draw');
            }
        } else if (values.every(value => value != '♕' && value != '♗' && value != '♘' && value != '♖' && value != '♙' && value != '♛' && value != '♞' && value != '♜' && value != '♟')) {
            var a = values.findIndex(value => value == '♝');
            var b = values.findLastIndex(value => value == '♝');
            if (a == b) {
                console.log('Draw by dead position (Black King and Bishop against White King)');
                setWin('Draw');
            }
        } else if (values.every(value => value != '♕' && value != '♗' && value != '♖' && value != '♙' && value != '♛' && value != '♝' && value != '♞' && value != '♜' && value != '♟')) {
            var a = values.findIndex(value => value == '♘');
            var b = values.findLastIndex(value => value == '♘');
            if (a == b) {
                console.log('Draw by dead position (White King and Knight against Black King)');
                setWin('Draw');
            }
        } else if (values.every(value => value != '♕' && value != '♗' && value != '♘' && value != '♖' && value != '♙' && value != '♛' && value != '♝' && value != '♜' && value != '♟')) {
            var a = values.findIndex(value => value == '♞');
            var b = values.findLastIndex(value => value == '♞');
            if (a == b) {
                console.log('Draw by dead position (Black King and Knight against White King)');
                setWin('Draw');
            }
        } else if (values.every(value => value != '♕' && value != '♘' && value != '♖' && value != '♙' && value != '♛' && value != '♞' && value != '♜' && value != '♟')) {
            var a = values.findIndex(value => value == '♗');
            var b = values.findLastIndex(value => value == '♗');
            var c = values.findIndex(value => value == '♝');
            var d = values.findLastIndex(value => value == '♝');
            if (a == b && c == d) {
                if (((a % 2 != 1) && (Math.floor(a / 8) % 2 != 1)) || ((a % 2 == 1) && (Math.floor(a / 8) % 2 == 1))) {
                    if (((c % 2 != 1) && (Math.floor(c / 8) % 2 != 1)) || ((c % 2 == 1) && (Math.floor(c / 8) % 2 == 1))) {
                        console.log('Draw by dead position (King and Bishop on white square against King and Bishop on white square)');
                        setWin('Draw');
                    }
                } else {
                    if (!(((c % 2 != 1) && (Math.floor(c / 8) % 2 != 1)) || ((c % 2 == 1) && (Math.floor(c / 8) % 2 == 1)))) {
                        console.log('Draw by dead position (King and Bishop on black square against King and Bishop on black square)');
                        setWin('Draw');
                    }
                }
            }
        }
        if (count >= 100) {
            console.log('Draw by 50-Move Rule');
            setWin('Draw');
        }
    }

    return (
        <div className="app3">
            <div aria-live="polite">
                {((win == '') ? (player + "'s turn") : ((win == 'Draw') ? 'Draw' : ((win == 'Check') ? (player + ' is in check') : ('Winner is ' + win))))}
            </div>
            <div className="board3">
                {values.map((value, index) => (<Cell id={index} value={value} win={win} player={player} selected={selected} setCount={setCount}
                    setPlayer={() => playerModifier(setPlayer)} setArray={arrayModifier} setSelected={setSelected} checkForMovement={checkForMovement} checkForCastle={checkForCastle} />))}
            </div>
            <button onClick={reset}>Reset</button>
        </div>
    );
} 
