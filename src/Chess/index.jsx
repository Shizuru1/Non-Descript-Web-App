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
    const blackCastle = (checkForCastle(4, 0) ? id != 2 : true) && (checkForCastle(4, 7) ? id != 6 : true);
    const whiteCastle = (checkForCastle(60, 56) ? id != 58 : true) && (checkForCastle(60, 63) ? id != 62 : true);
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
        for (let i = 1; i <= Math.floor(index / 8); i++) {
            if (values[index - (8 * i)] != '') {
                if (i == 1 && values[index - (8 * i)] == '♔') {
                    continue;
                }
                if (values[index - (8 * i)] == '♜' || values[index - (8 * i)] == '♛') {
                    return true;
                } else {
                    break;
                }
            }
        }
        for (let i = 1; i < 8 - Math.floor(index / 8); i++) {
            if (values[index + (8 * i)] != '') {
                if (i == 1 && values[index + (8 * i)] == '♔') {
                    continue;
                }
                if (values[index + (8 * i)] == '♜' || values[index + (8 * i)] == '♛') {
                    return true;
                } else {
                    break;
                }
            }
        }
        for (let i = 1; i <= (index % 8); i++) {
            if (values[index - i] != '') {
                if (i == 1 && values[index - i] == '♔') {
                    continue;
                }
                if (values[index - i] == '♜' || values[index - i] == '♛') {
                    return true;
                } else {
                    break;
                }
            }
        }
        for (let i = 1; i < 8 - (index % 8); i++) {
            if (values[index + i] != '') {
                if (i == 1 && values[index + i] == '♔') {
                    continue;
                }
                if (values[index + i] == '♜' || values[index + i] == '♛') {
                    return true;
                } else {
                    break;
                }
            }
        }
        if (index % 8 > 0) {
            if (index % 8 > 1) {
                if (values[index - 10] == '♞') {
                    return true;
                }
                if (values[index + 6] == '♞') {
                    return true;
                }
            }
            if (values[index - 17] == '♞') {
                return true;
            }
            if (values[index + 15] == '♞') {
                return true;
            }
        }
        if (index % 8 < 7) {
            if (index % 8 < 6) {
                if (values[index - 6] == '♞') {
                    return true;
                }
                if (values[index + 10] == '♞') {
                    return true;
                }
            }
            if (values[index - 15] == '♞') {
                return true;
            }
            if (values[index + 17] == '♞') {
                return true;
            }
        }
        for (let i = 1; i <= (index % 8); i++) {
            if (values[index - (9 * i)] != '') {
                if (i == 1 && values[index - (9 * i)] == '♔') {
                    continue;
                }
                if (values[index - (9 * i)] == '♝' || values[index - (9 * i)] == '♛') {
                    return true;
                } else {
                    break;
                }
            }
        }
        for (let i = 1; i < 8 - (index % 8); i++) {
            if (values[index + (9 * i)] != '') {
                if (i == 1 && values[index + (9 * i)] == '♔') {
                    continue;
                }
                if (values[index + (9 * i)] == '♝' || values[index + (9 * i)] == '♛') {
                    return true;
                } else {
                    break;
                }
            }
        }
        for (let i = 1; i < 8 - (index % 8); i++) {
            if (values[index - (7 * i)] != '') {
                if (i == 1 && values[index - (7 * i)] == '♔') {
                    continue;
                }
                if (values[index - (7 * i)] == '♝' || values[index - (7 * i)] == '♛') {
                    return true;
                } else {
                    break;
                }
            }
        }
        for (let i = 1; i <= (index % 8); i++) {
            if (values[index + (7 * i)] != '') {
                if (i == 1 && values[index + (7 * i)] == '♔') {
                    continue;
                }
                if (values[index + (7 * i)] == '♝' || values[index + (7 * i)] == '♛') {
                    return true;
                } else {
                    break;
                }
            }
        }
        if (values[index - 8] == '♚') {
            return true;
        }
        if (values[index + 8] == '♚') {
            return true;
        }
        if (index % 8 > 0) {
            if (values[index - 1] == '♚') {
                return true;
            }
            if (values[index - 9] == '♚' || values[index - 9] == '♟') {
                return true;
            }
            if (values[index + 7] == '♚') {
                return true;
            }
        }
        if (index % 8 < 7) {
            if (values[index + 1] == '♚') {
                return true;
            }
            if (values[index - 7] == '♚' || values[index - 7] == '♟') {
                return true;
            }
            if (values[index + 9] == '♚') {
                return true;
            }
        }
        return false;
    }

    const checkForCheckBlack = (index) => {
        for (let i = 1; i <= Math.floor(index / 8); i++) {
            if (values[index - (8 * i)] != '') {
                if (i == 1 && values[index - (8 * i)] == '♚') {
                    continue;
                }
                if (values[index - (8 * i)] == '♖' || values[index - (8 * i)] == '♕') {
                    return true;
                } else {
                    break;
                }
            }
        }
        for (let i = 1; i < 8 - Math.floor(index / 8); i++) {
            if (values[index + (8 * i)] != '') {
                if (i == 1 && values[index + (8 * i)] == '♚') {
                    continue;
                }
                if (values[index + (8 * i)] == '♖' || values[index + (8 * i)] == '♕') {
                    return true;
                } else {
                    break;
                }
            }
        }
        for (let i = 1; i <= (index % 8); i++) {
            if (values[index - i] != '') {
                if (i == 1 && values[index - i] == '♚') {
                    continue;
                }
                if (values[index - i] == '♖' || values[index - i] == '♕') {
                    return true;
                } else {
                    break;
                }
            }
        }
        for (let i = 1; i < 8 - (index % 8); i++) {
            if (values[index + i] != '') {
                if (i == 1 && values[index + i] == '♚') {
                    continue;
                }
                if (values[index + i] == '♖' || values[index + i] == '♕') {
                    return true;
                } else {
                    break;
                }
            }
        }
        if (index % 8 > 0) {
            if (index % 8 > 1) {
                if (values[index - 10] == '♘') {
                    return true;
                }
                if (values[index + 6] == '♘') {
                    return true;
                }
            }
            if (values[index - 17] == '♘') {
                return true;
            }
            if (values[index + 15] == '♘') {
                return true;
            }
        }
        if (index % 8 < 7) {
            if (index % 8 < 6) {
                if (values[index - 6] == '♘') {
                    return true;
                }
                if (values[index + 10] == '♘') {
                    return true;
                }
            }
            if (values[index - 15] == '♘') {
                return true;
            }
            if (values[index + 17] == '♘') {
                return true;
            }
        }
        for (let i = 1; i <= (index % 8); i++) {
            if (values[index - (9 * i)] != '') {
                if (i == 1 && values[index - (9 * i)] == '♚') {
                    continue;
                }
                if (values[index - (9 * i)] == '♗' || values[index - (9 * i)] == '♕') {
                    return true;
                } else {
                    break;
                }
            }
        }
        for (let i = 1; i < 8 - (index % 8); i++) {
            if (values[index + (9 * i)] != '') {
                if (i == 1 && values[index + (9 * i)] == '♚') {
                    continue;
                }
                if (values[index + (9 * i)] == '♗' || values[index + (9 * i)] == '♕') {
                    return true;
                } else {
                    break;
                }
            }
        }
        for (let i = 1; i < 8 - (index % 8); i++) {
            if (values[index - (7 * i)] != '') {
                if (i == 1 && values[index - (7 * i)] == '♚') {
                    continue;
                }
                if (values[index - (7 * i)] == '♗' || values[index - (7 * i)] == '♕') {
                    return true;
                } else {
                    break;
                }
            }
        }
        for (let i = 1; i <= (index % 8); i++) {
            if (values[index + (7 * i)] != '') {
                if (i == 1 && values[index + (7 * i)] == '♚') {
                    continue;
                }
                if (values[index + (7 * i)] == '♗' || values[index + (7 * i)] == '♕') {
                    return true;
                } else {
                    break;
                }
            }
        }
        if (values[index - 8] == '♔') {
            return true;
        }
        if (values[index + 8] == '♔') {
            return true;
        }
        if (index % 8 > 0) {
            if (values[index - 1] == '♔') {
                return true;
            }
            if (values[index - 9] == '♔') {
                return true;
            }
            if (values[index + 7] == '♔' || values[index + 7] == '♙') {
                return true;
            }
        }
        if (index % 8 < 7) {
            if (values[index + 1] == '♔') {
                return true;
            }
            if (values[index - 7] == '♔') {
                return true;
            }
            if (values[index + 9] == '♔' || values[index + 9] == '♙') {
                return true;
            }
        }
        return false;
    }

    const checkForDiscoverCheckWhite = (index) => {
        // check for black rooks, bishops and queens that will check white king if a white piece moves
        var discoverArray = [];
        var disca = '';
        for (let i = 1; i <= Math.floor(index / 8); i++) {
            if (values[index - (8 * i)] != '') {
                if (values[index - (8 * i)] == '♙' || values[index - (8 * i)] == '♖' || values[index - (8 * i)] == '♘' || values[index - (8 * i)] == '♗' || values[index - (8 * i)] == '♕') {
                    if (disca.length > 0) {
                        break;
                    } else {
                        disca = values[index - (8 * i)];
                        var aa = index - (8 * i);
                    }
                } else if (disca.length > 0) {
                    if (values[index - (8 * i)] == '♜' || values[index - (8 * i)] == '♛') {
                        discoverArray.push({ direction: 'up', piece: aa });
                        break;
                    } else {
                        break;
                    }
                } else {
                    break;
                }
            }
        }
        var discb = '';
        for (let i = 1; i < 8 - Math.floor(index / 8); i++) {
            if (values[index + (8 * i)] != '') {
                if (values[index + (8 * i)] == '♙' || values[index + (8 * i)] == '♖' || values[index + (8 * i)] == '♘' || values[index + (8 * i)] == '♗' || values[index + (8 * i)] == '♕') {
                    if (discb.length > 0) {
                        break;
                    } else {
                        discb = values[index + (8 * i)];
                        var bb = index + (8 * i);
                    }
                } else if (discb.length > 0) {
                    if (values[index + (8 * i)] == '♜' || values[index + (8 * i)] == '♛') {
                        discoverArray.push({ direction: 'down', piece: bb });
                        break;
                    } else {
                        break;
                    }
                } else {
                    break;
                }
            }
        }
        var discc = '';
        for (let i = 1; i <= (index % 8); i++) {
            if (values[index - i] != '') {
                if (values[index - i] == '♙' || values[index - i] == '♖' || values[index - i] == '♘' || values[index - i] == '♗' || values[index - i] == '♕') {
                    if (discc.length > 0) {
                        break;
                    } else {
                        discc = values[index - i];
                        var cc = index - i;
                    }
                } else if (discc.length > 0) {
                    if (values[index - i] == '♜' || values[index - i] == '♛') {
                        discoverArray.push({ direction: 'left', piece: cc });
                        break;
                    } else {
                        break;
                    }
                } else {
                    break;
                }
            }
        }
        var discd = '';
        for (let i = 1; i < 8 - (index % 8); i++) {
            if (values[index + i] != '') {
                if (values[index + i] == '♙' || values[index + i] == '♖' || values[index + i] == '♘' || values[index + i] == '♗' || values[index + i] == '♕') {
                    if (discd.length > 0) {
                        break;
                    } else {
                        discd = values[index + i];
                        var dd = index + i;
                    }
                } else if (discd.length > 0) {
                    if (values[index + i] == '♜' || values[index + i] == '♛') {
                        discoverArray.push({ direction: 'right', piece: dd });
                        break;
                    } else {
                        break;
                    }
                } else {
                    break;
                }
            }
        }
        var disce = '';
        for (let i = 1; i <= (index % 8); i++) {
            if (values[index - (9 * i)] != '') {
                if (values[index - (9 * i)] == '♙' || values[index - (9 * i)] == '♖' || values[index - (9 * i)] == '♘' || values[index - (9 * i)] == '♗' || values[index - (9 * i)] == '♕') {
                    if (disce.length > 0) {
                        break;
                    } else {
                        disce = values[index - (9 * i)];
                        var ee = index - (9 * i);
                    }
                } else if (disce.length > 0) {
                    if (values[index - (9 * i)] == '♝' || values[index - (9 * i)] == '♛') {
                        discoverArray.push({ direction: 'up-left', piece: ee });
                        break;
                    } else {
                        break;
                    }
                } else {
                    break;
                }
            }
        }
        var discf = '';
        for (let i = 1; i < 8 - (index % 8); i++) {
            if (values[index + (9 * i)] != '') {
                if (values[index + (9 * i)] == '♙' || values[index + (9 * i)] == '♖' || values[index + (9 * i)] == '♘' || values[index + (9 * i)] == '♗' || values[index + (9 * i)] == '♕') {
                    if (discf.length > 0) {
                        break;
                    } else {
                        discf = values[index + (9 * i)];
                        var ff = index - (9 * i);
                    }
                } else if (discf.length > 0) {
                    if (values[index + (9 * i)] == '♝' || values[index + (9 * i)] == '♛') {
                        discoverArray.push({ direction: 'down-right', piece: ff });
                        break;
                    } else {
                        break;
                    }
                } else {
                    break;
                }
            }
        }
        var discg = '';
        for (let i = 1; i < 8 - (index % 8); i++) {
            if (values[index - (7 * i)] != '') {
                if (values[index - (7 * i)] == '♙' || values[index - (7 * i)] == '♖' || values[index - (7 * i)] == '♘' || values[index - (7 * i)] == '♗' || values[index - (7 * i)] == '♕') {
                    if (discg.length > 0) {
                        break;
                    } else {
                        discg = values[index - (7 * i)];
                        var gg = index - (7 * i);
                    }
                } else if (discg.length > 0) {
                    if (values[index - (7 * i)] == '♝' || values[index - (7 * i)] == '♛') {
                        discoverArray.push({ direction: 'up-right', piece: gg });
                        break;
                    } else {
                        break;
                    }
                } else {
                    break;
                }
            }
        }
        var disch = '';
        for (let i = 1; i <= (index % 8); i++) {
            if (values[index + (7 * i)] != '') {
                if (values[index + (7 * i)] == '♙' || values[index + (7 * i)] == '♖' || values[index + (7 * i)] == '♘' || values[index + (7 * i)] == '♗' || values[index + (7 * i)] == '♕') {
                    if (disch.length > 0) {
                        break;
                    } else {
                        disch = values[index + (7 * i)];
                        var hh = index + (7 * i)
                    }
                } else if (disch.length > 0) {
                    if (values[index + (7 * i)] == '♝' || values[index + (7 * i)] == '♛') {
                        discoverArray.push({ direction: 'down-left', piece: hh });
                        break;
                    } else {
                        break;
                    }
                } else {
                    break;
                }
            }
        }
        return discoverArray;
    }

    const checkForDiscoverCheckBlack = (index) => {
        // check for white rooks, bishops and queens that will check black king if a black piece moves
        var discoverArray = [];
        var disca = '';
        for (let i = 1; i <= Math.floor(index / 8); i++) {
            if (values[index - (8 * i)] != '') {
                if (values[index - (8 * i)] == '♟' || values[index - (8 * i)] == '♜' || values[index - (8 * i)] == '♞' || values[index - (8 * i)] == '♝' || values[index - (8 * i)] == '♛') {
                    if (disca.length > 0) {
                        break;
                    } else {
                        disca = values[index - (8 * i)];
                        var aa = index - (8 * i);
                    }
                } else if (disca.length > 0) {
                    if (values[index - (8 * i)] == '♖' || values[index - (8 * i)] == '♕') {
                        discoverArray.push({ direction: 'up', piece: aa });
                        break;
                    } else {
                        break;
                    }
                } else {
                    break;
                }
            }
        }
        var discb = '';
        for (let i = 1; i < 8 - Math.floor(index / 8); i++) {
            if (values[index + (8 * i)] != '') {
                if (values[index + (8 * i)] == '♟' || values[index + (8 * i)] == '♜' || values[index + (8 * i)] == '♞' || values[index + (8 * i)] == '♝' || values[index + (8 * i)] == '♛') {
                    if (discb.length > 0) {
                        break;
                    } else {
                        discb = values[index + (8 * i)];
                        var bb = index + (8 * i);
                    }
                } else if (discb.length > 0) {
                    if (values[index + (8 * i)] == '♖' || values[index + (8 * i)] == '♕') {
                        discoverArray.push({ direction: 'down', piece: bb });
                        break;
                    } else {
                        break;
                    }
                } else {
                    break;
                }
            }
        }
        var discc = '';
        for (let i = 1; i <= (index % 8); i++) {
            if (values[index - i] != '') {
                if (values[index - i] == '♟' || values[index - i] == '♜' || values[index - i] == '♞' || values[index - i] == '♝' || values[index - i] == '♛') {
                    if (discc.length > 0) {
                        break;
                    } else {
                        discc = values[index - i];
                        var cc = index - i;
                    }
                } else if (discc.length > 0) {
                    if (values[index - i] == '♖' || values[index - i] == '♕') {
                        discoverArray.push({ direction: 'left', piece: cc });
                        break;
                    } else {
                        break;
                    }
                } else {
                    break;
                }
            }
        }
        var discd = '';
        for (let i = 1; i < 8 - (index % 8); i++) {
            if (values[index + i] != '') {
                if (values[index + i] == '♟' || values[index + i] == '♜' || values[index + i] == '♞' || values[index + i] == '♝' || values[index + i] == '♛') {
                    if (discd.length > 0) {
                        break;
                    } else {
                        discd = values[index + i];
                        var dd = index + i;
                    }
                } else if (discd.length > 0) {
                    if (values[index + i] == '♖' || values[index + i] == '♕') {
                        discoverArray.push({ direction: 'right', piece: dd });
                        break;
                    } else {
                        break;
                    }
                } else {
                    break;
                }
            }
        }
        var disce = '';
        for (let i = 1; i <= (index % 8); i++) {
            if (values[index - (9 * i)] != '') {
                if (values[index - (9 * i)] == '♟' || values[index - (9 * i)] == '♜' || values[index - (9 * i)] == '♞' || values[index - (9 * i)] == '♝' || values[index - (9 * i)] == '♛') {
                    if (disce.length > 0) {
                        break;
                    } else {
                        disce = values[index - (9 * i)];
                        var ee = index - (9 * i);
                    }
                } else if (disce.length > 0) {
                    if (values[index - (9 * i)] == '♗' || values[index - (9 * i)] == '♕') {
                        discoverArray.push({ direction: 'up-left', piece: ee });
                        break;
                    } else {
                        break;
                    }
                } else {
                    break;
                }
            }
        }
        var discf = '';
        for (let i = 1; i < 8 - (index % 8); i++) {
            if (values[index + (9 * i)] != '') {
                if (values[index + (9 * i)] == '♟' || values[index + (9 * i)] == '♜' || values[index + (9 * i)] == '♞' || values[index + (9 * i)] == '♝' || values[index + (9 * i)] == '♛') {
                    if (discf.length > 0) {
                        break;
                    } else {
                        discf = values[index + (9 * i)];
                        var ff = index + (9 * i);
                    }
                } else if (discf.length > 0) {
                    if (values[index + (9 * i)] == '♗' || values[index + (9 * i)] == '♕') {
                        discoverArray.push({ direction: 'down-right', piece: ff });
                        break;
                    } else {
                        break;
                    }
                } else {
                    break;
                }
            }
        }
        var discg = '';
        for (let i = 1; i < 8 - (index % 8); i++) {
            if (values[index - (7 * i)] != '') {
                if (values[index - (7 * i)] == '♟' || values[index - (7 * i)] == '♜' || values[index - (7 * i)] == '♞' || values[index - (7 * i)] == '♝' || values[index - (7 * i)] == '♛') {
                    if (discg.length > 0) {
                        break;
                    } else {
                        discg = values[index - (7 * i)];
                        var gg = index - (7 * i);
                    }
                } else if (discg.length > 0) {
                    if (values[index - (7 * i)] == '♗' || values[index - (7 * i)] == '♕') {
                        discoverArray.push({ direction: 'up-right', piece: gg });
                        break;
                    } else {
                        break;
                    }
                } else {
                    break;
                }
            }
        }
        var disch = '';
        for (let i = 1; i <= (index % 8); i++) {
            if (values[index + (7 * i)] != '') {
                if (values[index + (7 * i)] == '♟' || values[index + (7 * i)] == '♜' || values[index + (7 * i)] == '♞' || values[index + (7 * i)] == '♝' || values[index + (7 * i)] == '♛') {
                    if (disch.length > 0) {
                        break;
                    } else {
                        disch = values[index + (7 * i)];
                        var hh = index + (7 * i);
                    }
                } else if (disch.length > 0) {
                    if (values[index + (7 * i)] == '♗' || values[index + (7 * i)] == '♕') {
                        discoverArray.push({ direction: 'down-left', piece: hh });
                        break;
                    } else {
                        break;
                    }
                } else {
                    break;
                }
            }
        }
        return discoverArray;
    }

    const checkArray = (index, colour) => {
        var checkArray = [];
        if (colour == 'Black') {
            for (let i = 1; i <= Math.floor(index / 8); i++) {
                if (values[index - (8 * i)] != '') {
                    if (values[index - (8 * i)] == '♖' || values[index - (8 * i)] == '♕') {
                        checkArray.push({ index: index - (8 * i), piece: values[index - (8 * i)] });
                        break;
                    } else {
                        break;
                    }
                }
            }
            for (let i = 1; i < 8 - Math.floor(index / 8); i++) {
                if (values[index + (8 * i)] != '') {
                    if (values[index + (8 * i)] == '♖' || values[index + (8 * i)] == '♕') {
                        checkArray.push({ index: index + (8 * i), piece: values[index + (8 * i)] });
                        break;
                    } else {
                        break;
                    }
                }
            }
            for (let i = 1; i <= (index % 8); i++) {
                if (values[index - i] != '') {
                    if (values[index - i] == '♖' || values[index - i] == '♕') {
                        checkArray.push({ index: index - i, piece: values[index - i] });
                        break;
                    } else {
                        break;
                    }
                }
            }
            for (let i = 1; i < 8 - (index % 8); i++) {
                if (values[index + i] != '') {
                    if (values[index + i] == '♖' || values[index + i] == '♕') {
                        checkArray.push({ index: index + i, piece: values[index + i] });
                        break;
                    } else {
                        break;
                    }
                }
            }
            if (index % 8 > 0) {
                if (index % 8 > 1) {
                    if (values[index - 10] == '♘') {
                        checkArray.push({ index: index - 10, piece: '♘' });
                    }
                    if (values[index + 6] == '♘') {
                        checkArray.push({ index: index + 6, piece: '♘' });
                    }
                }
                if (values[index - 17] == '♘') {
                    checkArray.push({ index: index - 17, piece: '♘' });
                }
                if (values[index + 15] == '♘') {
                    checkArray.push({ index: index + 15, piece: '♘' });
                }
                if (values[index + 7] == '♙') {
                    checkArray.push({ index: index + 7, piece: '♙' });
                }
            }
            if (index % 8 < 7) {
                if (index % 8 < 6) {
                    if (values[index - 6] == '♘') {
                        checkArray.push({ index: index - 6, piece: '♘' });
                    }
                    if (values[index + 10] == '♘') {
                        checkArray.push({ index: index + 10, piece: '♘' });
                    }
                }
                if (values[index - 15] == '♘') {
                    checkArray.push({ index: index - 15, piece: '♘' });
                }
                if (values[index + 17] == '♘') {
                    checkArray.push({ index: index + 17, piece: '♘' });
                }
                if (values[index + 9] == '♙') {
                    checkArray.push({ index: index + 9, piece: '♙' });
                }
            }
            for (let i = 1; i <= (index % 8); i++) {
                if (values[index - (9 * i)] != '') {
                    if (values[index - (9 * i)] == '♗' || values[index - (9 * i)] == '♕') {
                        checkArray.push({ index: index - (9 * i), piece: values[index - (9 * i)] });
                        break;
                    } else {
                        break;
                    }
                }
            }
            for (let i = 1; i < 8 - (index % 8); i++) {
                if (values[index + (9 * i)] != '') {
                    if (values[index + (9 * i)] == '♗' || values[index + (9 * i)] == '♕') {
                        checkArray.push({ index: index + (9 * i), piece: values[index + (9 * i)] });
                        break;
                    } else {
                        break;
                    }
                }
            }
            for (let i = 1; i < 8 - (index % 8); i++) {
                if (values[index - (7 * i)] != '') {
                    if (values[index - (7 * i)] == '♗' || values[index - (7 * i)] == '♕') {
                        checkArray.push({ index: index - (7 * i), piece: values[index - (7 * i)] });
                        break;
                    } else {
                        break;
                    }
                }
            }
            for (let i = 1; i <= (index % 8); i++) {
                if (values[index + (7 * i)] != '') {
                    if (values[index + (7 * i)] == '♗' || values[index + (7 * i)] == '♕') {
                        checkArray.push({ index: index + (7 * i), piece: values[index + (7 * i)] });
                        break;
                    } else {
                        break;
                    }
                }
            }
        } else if (colour == 'White') {
            for (let i = 1; i <= Math.floor(index / 8); i++) {
                if (values[index - (8 * i)] != '') {
                    if (values[index - (8 * i)] == '♜' || values[index - (8 * i)] == '♛') {
                        checkArray.push({ index: index - (8 * i), piece: values[index - (8 * i)] });
                        break;
                    } else {
                        break;
                    }
                }
            }
            for (let i = 1; i < 8 - Math.floor(index / 8); i++) {
                if (values[index + (8 * i)] != '') {
                    if (values[index + (8 * i)] == '♜' || values[index + (8 * i)] == '♛') {
                        checkArray.push({ index: index + (8 * i), piece: values[index + (8 * i)] });
                        break;
                    } else {
                        break;
                    }
                }
            }
            for (let i = 1; i <= (index % 8); i++) {
                if (values[index - i] != '') {
                    if (values[index - i] == '♜' || values[index - i] == '♛') {
                        checkArray.push({ index: index - i, piece: values[index - i] });
                        break;
                    } else {
                        break;
                    }
                }
            }
            for (let i = 1; i < 8 - (index % 8); i++) {
                if (values[index + i] != '') {
                    if (values[index + i] == '♜' || values[index + i] == '♛') {
                        checkArray.push({ index: index + i, piece: values[index + i] });
                        break;
                    } else {
                        break;
                    }
                }
            }
            if (index % 8 > 0) {
                if (index % 8 > 1) {
                    if (values[index - 10] == '♞') {
                        checkArray.push({ index: index - 10, piece: '♞' });
                    }
                    if (values[index + 6] == '♞') {
                        checkArray.push({ index: index + 6, piece: '♞' });
                    }
                }
                if (values[index - 17] == '♞') {
                    checkArray.push({ index: index - 17, piece: '♞' });
                }
                if (values[index + 15] == '♞') {
                    checkArray.push({ index: index + 15, piece: '♞' });
                }
                if (values[index - 9] == '♟') {
                    checkArray.push({ index: index - 9, piece: '♟' });
                }
            }
            if (index % 8 < 7) {
                if (index % 8 < 6) {
                    if (values[index - 6] == '♞') {
                        checkArray.push({ index: index - 6, piece: '♞' });
                    }
                    if (values[index + 10] == '♞') {
                        checkArray.push({ index: index + 10, piece: '♞' });
                    }
                }
                if (values[index - 15] == '♞') {
                    checkArray.push({ index: index - 15, piece: '♞' });
                }
                if (values[index + 17] == '♞') {
                    checkArray.push({ index: index + 17, piece: '♞' });
                }
                if (values[index - 7] == '♟') {
                    checkArray.push({ index: index - 7, piece: '♟' });
                }
            }
            for (let i = 1; i <= (index % 8); i++) {
                if (values[index - (9 * i)] != '') {
                    if (values[index - (9 * i)] == '♝' || values[index - (9 * i)] == '♛') {
                        checkArray.push({ index: index - (9 * i), piece: values[index - (9 * i)] });
                        break;
                    } else {
                        break;
                    }
                }
            }
            for (let i = 1; i < 8 - (index % 8); i++) {
                if (values[index + (9 * i)] != '') {
                    if (values[index + (9 * i)] == '♝' || values[index + (9 * i)] == '♛') {
                        checkArray.push({ index: index + (9 * i), piece: values[index + (9 * i)] });
                        break;
                    } else {
                        break;
                    }
                }
            }
            for (let i = 1; i < 8 - (index % 8); i++) {
                if (values[index - (7 * i)] != '') {
                    if (values[index - (7 * i)] == '♝' || values[index - (7 * i)] == '♛') {
                        checkArray.push({ index: index - (7 * i), piece: values[index - (7 * i)] });
                        break;
                    } else {
                        break;
                    }
                }
            }
            for (let i = 1; i <= (index % 8); i++) {
                if (values[index + (7 * i)] != '') {
                    if (values[index + (7 * i)] == '♝' || values[index + (7 * i)] == '♛') {
                        checkArray.push({ index: index + (7 * i), piece: values[index + (7 * i)] });
                        break;
                    } else {
                        break;
                    }
                }
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
                    if (values[index - 8] == '' || values[index - 8] == '♟' || values[index - 8] == '♜' || values[index - 8] == '♞' || values[index - 8] == '♝' || values[index - 8] == '♛' || values[index - 8] == '♚') {
                        if (!checkForCheckWhite(index - 8)) {
                            moveArray.push(index - 8);
                        }
                    }
                    if (values[index + 8] == '' || values[index + 8] == '♟' || values[index + 8] == '♜' || values[index + 8] == '♞' || values[index + 8] == '♝' || values[index + 8] == '♛' || values[index + 8] == '♚') {
                        if (!checkForCheckWhite(index + 8)) {
                            moveArray.push(index + 8);
                        }
                    }
                    if (index % 8 > 0) {
                        if (values[index - 1] == '' || values[index - 1] == '♟' || values[index - 1] == '♜' || values[index - 1] == '♞' || values[index - 1] == '♝' || values[index - 1] == '♛' || values[index - 1] == '♚') {
                            if (!checkForCheckWhite(index - 1)) {
                                moveArray.push(index - 1);
                            }
                        }
                        if (values[index - 9] == '' || values[index - 9] == '♟' || values[index - 9] == '♜' || values[index - 9] == '♞' || values[index - 9] == '♝' || values[index - 9] == '♛' || values[index - 9] == '♚') {
                            if (!checkForCheckWhite(index - 9)) {
                                moveArray.push(index - 9);
                            }
                        }
                        if (values[index + 7] == '' || values[index + 7] == '♟' || values[index + 7] == '♜' || values[index + 7] == '♞' || values[index + 7] == '♝' || values[index + 7] == '♛' || values[index + 7] == '♚') {
                            if (!checkForCheckWhite(index + 7)) {
                                moveArray.push(index + 7);
                            }
                        }
                    }
                    if (index % 8 < 7) {
                        if (values[index + 1] == '' || values[index + 1] == '♟' || values[index + 1] == '♜' || values[index + 1] == '♞' || values[index + 1] == '♝' || values[index + 1] == '♛' || values[index + 1] == '♚') {
                            if (!checkForCheckWhite(index + 1)) {
                                moveArray.push(index + 1);
                            }
                        }
                        if (values[index - 7] == '' || values[index - 7] == '♟' || values[index - 7] == '♜' || values[index - 7] == '♞' || values[index - 7] == '♝' || values[index - 7] == '♛' || values[index - 7] == '♚') {
                            if (!checkForCheckWhite(index - 7)) {
                                moveArray.push(index - 7);
                            }
                        }
                        if (values[index + 9] == '' || values[index + 9] == '♟' || values[index + 9] == '♜' || values[index + 9] == '♞' || values[index + 9] == '♝' || values[index + 9] == '♛' || values[index + 9] == '♚') {
                            if (!checkForCheckWhite(index + 9)) {
                                moveArray.push(index + 9);
                            }
                        }
                    }
                    break;
                // Black King Movement
                case '♚':
                    if (values[index - 8] == '' || values[index - 8] == '♙' || values[index - 8] == '♖' || values[index - 8] == '♘' || values[index - 8] == '♗' || values[index - 8] == '♕' || values[index - 8] == '♔') {
                        if (!checkForCheckBlack(index - 8)) {
                            moveArray.push(index - 8);
                        }
                    }
                    if (values[index + 8] == '' || values[index + 8] == '♙' || values[index + 8] == '♖' || values[index + 8] == '♘' || values[index + 8] == '♗' || values[index + 8] == '♕' || values[index + 8] == '♔') {
                        if (!checkForCheckBlack(index + 8)) {
                            moveArray.push(index + 8);
                        }
                    }
                    if (index % 8 > 0) {
                        if (values[index - 1] == '' || values[index - 1] == '♙' || values[index - 1] == '♖' || values[index - 1] == '♘' || values[index - 1] == '♗' || values[index - 1] == '♕' || values[index - 1] == '♔') {
                            if (!checkForCheckBlack(index - 1)) {
                                moveArray.push(index - 1);
                            }
                        }
                        if (values[index - 9] == '' || values[index - 9] == '♙' || values[index - 9] == '♖' || values[index - 9] == '♘' || values[index - 9] == '♗' || values[index - 9] == '♕' || values[index - 9] == '♔') {
                            if (!checkForCheckBlack(index - 9)) {
                                moveArray.push(index - 9);
                            }
                        }
                        if (values[index + 7] == '' || values[index + 7] == '♙' || values[index + 7] == '♖' || values[index + 7] == '♘' || values[index + 7] == '♗' || values[index + 7] == '♕' || values[index + 7] == '♔') {
                            if (!checkForCheckBlack(index + 7)) {
                                moveArray.push(index + 7);
                            }
                        }
                    }
                    if (index % 8 < 7) {
                        if (values[index + 1] == '' || values[index + 1] == '♙' || values[index + 1] == '♖' || values[index + 1] == '♘' || values[index + 1] == '♗' || values[index + 1] == '♕' || values[index + 1] == '♔') {
                            if (!checkForCheckBlack(index + 1)) {
                                moveArray.push(index + 1);
                            }
                        }
                        if (values[index - 7] == '' || values[index - 7] == '♙' || values[index - 7] == '♖' || values[index - 7] == '♘' || values[index - 7] == '♗' || values[index - 7] == '♕' || values[index - 7] == '♔') {
                            if (!checkForCheckBlack(index - 7)) {
                                moveArray.push(index - 7);
                            }
                        }
                        if (values[index + 9] == '' || values[index + 9] == '♙' || values[index + 9] == '♖' || values[index + 9] == '♘' || values[index + 9] == '♗' || values[index + 9] == '♕' || values[index + 9] == '♔') {
                            if (!checkForCheckBlack(index + 9)) {
                                moveArray.push(index + 9);
                            }
                        }
                    }
                    break;
                default:
                    break;
            }
        } else if (checkArr.length == 1) {
            var uncheckArray = [];
            switch (checkArr[0].piece) {
                case '♕':
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
                    uncheckArray.push(checkArr[0].index);
                    break;
                case '♞':
                    uncheckArray.push(checkArr[0].index);
                    break;
                case '♙':
                    uncheckArray.push(checkArr[0].index);
                    break;
                case '♟':
                    uncheckArray.push(checkArr[0].index);
                    break;
                default:
                    break;
            }
            switch (values[index]) {
                // White Pawn Movement
                case '♙':
                    if (index % 8 < 7) {
                        if (discDir == 'up-right' || discDir == 'down-left' || discDir == '') {
                            if (values[index - 7] != '' && uncheckArray.some(val => (index - 7 == val))) {
                                moveArray.push(index - 7);
                            }
                        }
                    }
                    if (index % 8 > 0) {
                        if (discDir == 'up-left' || discDir == 'down-right' || discDir == '') {
                            if (values[index - 9] != '' && uncheckArray.some(val => (index - 9 == val))) {
                                moveArray.push(index - 9);
                            }
                        }
                    }
                    if (discDir == 'up' || discDir == 'down' || discDir == '') {
                        if (values[index - 8] == '' && uncheckArray.some(val => (index - 8 == val))) {
                            moveArray.push(index - 8);
                        }
                        if (values[index - 8] == '' && Math.floor(index / 8) == 6) {
                            if (values[index - 16] == '' && uncheckArray.some(val => (index - 16 == val))) {
                                moveArray.push(index - 16);
                            }
                        }
                    }
                    break;
                // Black Pawn Movement
                case '♟':
                    if (index % 8 > 0) {
                        if (discDir == 'up-right' || discDir == 'down-left' || discDir == '') {
                            if (values[index + 7] != '' && uncheckArray.some(val => (index + 7 == val))) {
                                moveArray.push(index + 7);
                            }
                        }
                    }
                    if (index % 8 < 7) {
                        if (discDir == 'up-left' || discDir == 'down-right' || discDir == '') {
                            if (values[index + 9] != '' && uncheckArray.some(val => (index + 9 == val))) {
                                moveArray.push(index + 9);
                            }
                        }
                    }
                    if (discDir == 'up' || discDir == 'down' || discDir == '') {
                        if (values[index + 8] == '' && uncheckArray.some(val => (index + 8 == val))) {
                            moveArray.push(index + 8);
                        }
                        if (values[index + 8] == '' && Math.floor(index / 8) == 1) {
                            if (values[index + 16] == '' && uncheckArray.some(val => (index + 9 == val))) {
                                moveArray.push(index + 16);
                            }
                        }
                    }
                    break;
                // White Rook Movement
                case '♖':
                    if (discDir == 'up' || discDir == 'down' || discDir == '') {
                        for (let i = 1; i <= Math.floor(index / 8); i++) {
                            if (uncheckArray.some(val => (index - (8 * i) == val))) {
                                moveArray.push(index - (8 * i));
                            } else if (values[index - (8 * i)] == '') {
                                continue;
                            } else {
                                break;
                            }
                        }
                        for (let i = 1; i < 8 - Math.floor(index / 8); i++) {
                            if (uncheckArray.some(val => (index + (8 * i) == val))) {
                                moveArray.push(index + (8 * i));
                            } else if (values[index + (8 * i)] == '') {
                                continue;
                            } else {
                                break;
                            }
                        }
                    }
                    if (discDir == 'left' || discDir == 'right' || discDir == '') {
                        for (let i = 1; i <= (index % 8); i++) {
                            if (uncheckArray.some(val => (index - i == val))) {
                                moveArray.push(index - i);
                            } else if (values[index - i] == '') {
                                continue;
                            } else {
                                break;
                            }
                        }
                        for (let i = 1; i < 8 - (index % 8); i++) {
                            if (uncheckArray.some(val => (index + i == val))) {
                                moveArray.push(index + i);
                            } else if (values[index + i] == '') {
                                continue;
                            } else {
                                break;
                            }
                        }
                    }
                    break;
                // Black Rook Movement
                case '♜':
                    if (discDir == 'up' || discDir == 'down' || discDir == '') {
                        for (let i = 1; i <= Math.floor(index / 8); i++) {
                            if (uncheckArray.some(val => (index - (8 * i) == val))) {
                                moveArray.push(index - (8 * i));
                            } else if (values[index - (8 * i)] == '') {
                                continue;
                            } else {
                                break;
                            }
                        }
                        for (let i = 1; i < 8 - Math.floor(index / 8); i++) {
                            if (uncheckArray.some(val => (index + (8 * i) == val))) {
                                moveArray.push(index + (8 * i));
                            } else if (values[index + (8 * i)] == '') {
                                continue;
                            } else {
                                break;
                            }
                        }
                    }
                    if (discDir == 'left' || discDir == 'right' || discDir == '') {
                        for (let i = 1; i <= (index % 8); i++) {
                            if (uncheckArray.some(val => (index - i == val))) {
                                moveArray.push(index - i);
                            } else if (values[index - i] == '') {
                                continue;
                            } else {
                                break;
                            }
                        }
                        for (let i = 1; i < 8 - (index % 8); i++) {
                            if (uncheckArray.some(val => (index + i == val))) {
                                moveArray.push(index + i);
                            } else if (values[index + i] == '') {
                                continue;
                            } else {
                                break;
                            }
                        }
                    }
                    break;
                // White Knight Movement
                case '♘':
                    if (discDir == '') {
                        if (index % 8 > 0) {
                            if (index % 8 > 1) {
                                if (uncheckArray.some(val => (index - 10 == val))) {
                                    moveArray.push(index - 10);
                                }
                                if (uncheckArray.some(val => (index + 6 == val))) {
                                    moveArray.push(index + 6);
                                }
                            }
                            if (uncheckArray.some(val => (index - 17 == val))) {
                                moveArray.push(index - 17);
                            }
                            if (uncheckArray.some(val => (index + 15 == val))) {
                                moveArray.push(index + 15);
                            }
                        }
                        if (index % 8 < 7) {
                            if (index % 8 < 6) {
                                if (uncheckArray.some(val => (index - 6 == val))) {
                                    moveArray.push(index - 6);
                                }
                                if (uncheckArray.some(val => (index + 10 == val))) {
                                    moveArray.push(index + 10);
                                }
                            }
                            if (uncheckArray.some(val => (index - 15 == val))) {
                                moveArray.push(index - 15);
                            }
                            if (uncheckArray.some(val => (index + 17 == val))) {
                                moveArray.push(index + 17);
                            }
                        }
                    }
                    break;
                // Black Knight Movement
                case '♞':
                    if (discDir == '') {
                        if (index % 8 > 0) {
                            if (index % 8 > 1) {
                                if (uncheckArray.some(val => (index - 10 == val))) {
                                    moveArray.push(index - 10);
                                }
                                if (uncheckArray.some(val => (index + 6 == val))) {
                                    moveArray.push(index + 6);
                                }
                            }
                            if (uncheckArray.some(val => (index - 17 == val))) {
                                moveArray.push(index - 17);
                            }
                            if (uncheckArray.some(val => (index + 15 == val))) {
                                moveArray.push(index + 15);
                            }
                        }
                        if (index % 8 < 7) {
                            if (index % 8 < 6) {
                                if (uncheckArray.some(val => (index - 6 == val))) {
                                    moveArray.push(index - 6);
                                }
                                if (uncheckArray.some(val => (index + 10 == val))) {
                                    moveArray.push(index + 10);
                                }
                            }
                            if (uncheckArray.some(val => (index - 15 == val))) {
                                moveArray.push(index - 15);
                            }
                            if (uncheckArray.some(val => (index + 17 == val))) {
                                moveArray.push(index + 17);
                            }
                        }
                    }
                    break;
                // White Bishop Movement
                case '♗':
                    if (discDir == 'up-left' || discDir == 'down-right' || discDir == '') {
                        for (let i = 1; i <= (index % 8); i++) {
                            if (uncheckArray.some(val => (index - (9 * i) == val))) {
                                moveArray.push(index - (9 * i));
                            } else if (values[index - (9 * i)] == '') {
                                continue;
                            } else {
                                break;
                            }
                        }
                        for (let i = 1; i < 8 - (index % 8); i++) {
                            if (uncheckArray.some(val => (index + (9 * i) == val))) {
                                moveArray.push(index + (9 * i));
                            } else if (values[index + (9 * i)] == '') {
                                continue;
                            } else {
                                break;
                            }
                        }
                    }
                    if (discDir == 'up-right' || discDir == 'down-left' || discDir == '') {
                        for (let i = 1; i < 8 - (index % 8); i++) {
                            if (uncheckArray.some(val => (index - (7 * i) == val))) {
                                moveArray.push(index - (7 * i));
                            } else if (values[index - (7 * i)] == '') {
                                continue;
                            } else {
                                break;
                            }
                        }
                        for (let i = 1; i <= (index % 8); i++) {
                            if (uncheckArray.some(val => (index + (7 * i) == val))) {
                                moveArray.push(index + (7 * i));
                            } else if (values[index + (7 * i)] == '') {
                                continue;
                            } else {
                                break;
                            }
                        }
                    }
                    break;
                // Black Bishop Movement
                case '♝':
                    if (discDir == 'up-left' || discDir == 'down-right' || discDir == '') {
                        for (let i = 1; i <= (index % 8); i++) {
                            if (uncheckArray.some(val => (index - (9 * i) == val))) {
                                moveArray.push(index - (9 * i));
                            } else if (values[index - (9 * i)] == '') {
                                continue;
                            } else {
                                break;
                            }
                        }
                        for (let i = 1; i < 8 - (index % 8); i++) {
                            if (uncheckArray.some(val => (index + (9 * i) == val))) {
                                moveArray.push(index + (9 * i));
                            } else if (values[index + (9 * i)] == '') {
                                continue;
                            } else {
                                break;
                            }
                        }
                    }
                    if (discDir == 'up-right' || discDir == 'down-left' || discDir == '') {
                        for (let i = 1; i < 8 - (index % 8); i++) {
                            if (uncheckArray.some(val => (index - (7 * i) == val))) {
                                moveArray.push(index - (7 * i));
                            } else if (values[index - (7 * i)] == '') {
                                continue;
                            } else {
                                break;
                            }
                        }
                        for (let i = 1; i <= (index % 8); i++) {
                            if (uncheckArray.some(val => (index + (7 * i) == val))) {
                                moveArray.push(index + (7 * i));
                            } else if (values[index + (7 * i)] == '') {
                                continue;
                            } else {
                                break;
                            }
                        }
                    }
                    break;
                // White Queen Movement
                case '♕':
                    if (discDir == 'up' || discDir == 'down' || discDir == '') {
                        for (let i = 1; i <= Math.floor(index / 8); i++) {
                            if (uncheckArray.some(val => (index - (8 * i) == val))) {
                                moveArray.push(index - (8 * i));
                            } else if (values[index - (8 * i)] == '') {
                                continue;
                            } else {
                                break;
                            }
                        }
                        for (let i = 1; i < 8 - Math.floor(index / 8); i++) {
                            if (uncheckArray.some(val => (index + (8 * i) == val))) {
                                moveArray.push(index + (8 * i));
                            } else if (values[index + (8 * i)] == '') {
                                continue;
                            } else {
                                break;
                            }
                        }
                    }
                    if (discDir == 'left' || discDir == 'right' || discDir == '') {
                        for (let i = 1; i <= (index % 8); i++) {
                            if (uncheckArray.some(val => (index - i == val))) {
                                moveArray.push(index - i);
                            } else if (values[index - i] == '') {
                                continue;
                            } else {
                                break;
                            }
                        }
                        for (let i = 1; i < 8 - (index % 8); i++) {
                            if (uncheckArray.some(val => (index + i == val))) {
                                moveArray.push(index + i);
                            } else if (values[index + i] == '') {
                                continue;
                            } else {
                                break;
                            }
                        }
                    }
                    if (discDir == 'up-left' || discDir == 'down-right' || discDir == '') {
                        for (let i = 1; i <= (index % 8); i++) {
                            if (uncheckArray.some(val => (index - (9 * i) == val))) {
                                moveArray.push(index - (9 * i));
                            } else if (values[index - (9 * i)] == '') {
                                continue;
                            } else {
                                break;
                            }
                        }
                        for (let i = 1; i < 8 - (index % 8); i++) {
                            if (uncheckArray.some(val => (index + (9 * i) == val))) {
                                moveArray.push(index + (9 * i));
                            } else if (values[index + (9 * i)] == '') {
                                continue;
                            } else {
                                break;
                            }
                        }
                    }
                    if (discDir == 'up-right' || discDir == 'down-left' || discDir == '') {
                        for (let i = 1; i < 8 - (index % 8); i++) {
                            if (uncheckArray.some(val => (index - (7 * i) == val))) {
                                moveArray.push(index - (7 * i));
                            } else if (values[index - (7 * i)] == '') {
                                continue;
                            } else {
                                break;
                            }
                        }
                        for (let i = 1; i <= (index % 8); i++) {
                            if (uncheckArray.some(val => (index + (7 * i) == val))) {
                                moveArray.push(index + (7 * i));
                            } else if (values[index + (7 * i)] == '') {
                                continue;
                            } else {
                                break;
                            }
                        }
                    }
                    break;
                // Black Queen Movement
                case '♛':
                    if (discDir == 'up' || discDir == 'down' || discDir == '') {
                        for (let i = 1; i <= Math.floor(index / 8); i++) {
                            if (uncheckArray.some(val => (index - (8 * i) == val))) {
                                moveArray.push(index - (8 * i));
                            } else if (values[index - (8 * i)] == '') {
                                continue;
                            } else {
                                break;
                            }
                        }
                        for (let i = 1; i < 8 - Math.floor(index / 8); i++) {
                            if (uncheckArray.some(val => (index + (8 * i) == val))) {
                                moveArray.push(index + (8 * i));
                            } else if (values[index + (8 * i)] == '') {
                                continue;
                            } else {
                                break;
                            }
                        }
                    }
                    if (discDir == 'left' || discDir == 'right' || discDir == '') {
                        for (let i = 1; i <= (index % 8); i++) {
                            if (uncheckArray.some(val => (index - i == val))) {
                                moveArray.push(index - i);
                            } else if (values[index - i] == '') {
                                continue;
                            } else {
                                break;
                            }
                        }
                        for (let i = 1; i < 8 - (index % 8); i++) {
                            if (uncheckArray.some(val => (index + i == val))) {
                                moveArray.push(index + i);
                            } else if (values[index + i] == '') {
                                continue;
                            } else {
                                break;
                            }
                        }
                    }
                    if (discDir == 'up-left' || discDir == 'down-right' || discDir == '') {
                        for (let i = 1; i <= (index % 8); i++) {
                            if (uncheckArray.some(val => (index - (9 * i) == val))) {
                                moveArray.push(index - (9 * i));
                            } else if (values[index - (9 * i)] == '') {
                                continue;
                            } else {
                                break;
                            }
                        }
                        for (let i = 1; i < 8 - (index % 8); i++) {
                            if (uncheckArray.some(val => (index + (9 * i) == val))) {
                                moveArray.push(index + (9 * i));
                            } else if (values[index + (9 * i)] == '') {
                                continue;
                            } else {
                                break;
                            }
                        }
                    }
                    if (discDir == 'up-right' || discDir == 'down-left' || discDir == '') {
                        for (let i = 1; i < 8 - (index % 8); i++) {
                            if (uncheckArray.some(val => (index - (7 * i) == val))) {
                                moveArray.push(index - (7 * i));
                            } else if (values[index - (7 * i)] == '') {
                                continue;
                            } else {
                                break;
                            }
                        }
                        for (let i = 1; i <= (index % 8); i++) {
                            if (uncheckArray.some(val => (index + (7 * i) == val))) {
                                moveArray.push(index + (7 * i));
                            } else if (values[index + (7 * i)] == '') {
                                continue;
                            } else {
                                break;
                            }
                        }
                    }
                    break;
                // White King Movement
                case '♔':
                    if (values[index - 8] == '' || values[index - 8] == '♟' || values[index - 8] == '♜' || values[index - 8] == '♞' || values[index - 8] == '♝' || values[index - 8] == '♛' || values[index - 8] == '♚') {
                        if (!checkForCheckWhite(index - 8)) {
                            moveArray.push(index - 8);
                        }
                    }
                    if (values[index + 8] == '' || values[index + 8] == '♟' || values[index + 8] == '♜' || values[index + 8] == '♞' || values[index + 8] == '♝' || values[index + 8] == '♛' || values[index + 8] == '♚') {
                        if (!checkForCheckWhite(index + 8)) {
                            moveArray.push(index + 8);
                        }
                    }
                    if (index % 8 > 0) {
                        if (values[index - 1] == '' || values[index - 1] == '♟' || values[index - 1] == '♜' || values[index - 1] == '♞' || values[index - 1] == '♝' || values[index - 1] == '♛' || values[index - 1] == '♚') {
                            if (!checkForCheckWhite(index - 1)) {
                                moveArray.push(index - 1);
                            }
                        }
                        if (values[index - 9] == '' || values[index - 9] == '♟' || values[index - 9] == '♜' || values[index - 9] == '♞' || values[index - 9] == '♝' || values[index - 9] == '♛' || values[index - 9] == '♚') {
                            if (!checkForCheckWhite(index - 9)) {
                                moveArray.push(index - 9);
                            }
                        }
                        if (values[index + 7] == '' || values[index + 7] == '♟' || values[index + 7] == '♜' || values[index + 7] == '♞' || values[index + 7] == '♝' || values[index + 7] == '♛' || values[index + 7] == '♚') {
                            if (!checkForCheckWhite(index + 7)) {
                                moveArray.push(index + 7);
                            }
                        }
                    }
                    if (index % 8 < 7) {
                        if (values[index + 1] == '' || values[index + 1] == '♟' || values[index + 1] == '♜' || values[index + 1] == '♞' || values[index + 1] == '♝' || values[index + 1] == '♛' || values[index + 1] == '♚') {
                            if (!checkForCheckWhite(index + 1)) {
                                moveArray.push(index + 1);
                            }
                        }
                        if (values[index - 7] == '' || values[index - 7] == '♟' || values[index - 7] == '♜' || values[index - 7] == '♞' || values[index - 7] == '♝' || values[index - 7] == '♛' || values[index - 7] == '♚') {
                            if (!checkForCheckWhite(index - 7)) {
                                moveArray.push(index - 7);
                            }
                        }
                        if (values[index + 9] == '' || values[index + 9] == '♟' || values[index + 9] == '♜' || values[index + 9] == '♞' || values[index + 9] == '♝' || values[index + 9] == '♛' || values[index + 9] == '♚') {
                            if (!checkForCheckWhite(index + 9)) {
                                moveArray.push(index + 9);
                            }
                        }
                    }
                    break;
                // Black King Movement
                case '♚':
                    if (values[index - 8] == '' || values[index - 8] == '♙' || values[index - 8] == '♖' || values[index - 8] == '♘' || values[index - 8] == '♗' || values[index - 8] == '♕' || values[index - 8] == '♔') {
                        if (!checkForCheckBlack(index - 8)) {
                            moveArray.push(index - 8);
                        }
                    }
                    if (values[index + 8] == '' || values[index + 8] == '♙' || values[index + 8] == '♖' || values[index + 8] == '♘' || values[index + 8] == '♗' || values[index + 8] == '♕' || values[index + 8] == '♔') {
                        if (!checkForCheckBlack(index + 8)) {
                            moveArray.push(index + 8);
                        }
                    }
                    if (index % 8 > 0) {
                        if (values[index - 1] == '' || values[index - 1] == '♙' || values[index - 1] == '♖' || values[index - 1] == '♘' || values[index - 1] == '♗' || values[index - 1] == '♕' || values[index - 1] == '♔') {
                            if (!checkForCheckBlack(index - 1)) {
                                moveArray.push(index - 1);
                            }
                        }
                        if (values[index - 9] == '' || values[index - 9] == '♙' || values[index - 9] == '♖' || values[index - 9] == '♘' || values[index - 9] == '♗' || values[index - 9] == '♕' || values[index - 9] == '♔') {
                            if (!checkForCheckBlack(index - 9)) {
                                moveArray.push(index - 9);
                            }
                        }
                        if (values[index + 7] == '' || values[index + 7] == '♙' || values[index + 7] == '♖' || values[index + 7] == '♘' || values[index + 7] == '♗' || values[index + 7] == '♕' || values[index + 7] == '♔') {
                            if (!checkForCheckBlack(index + 7)) {
                                moveArray.push(index + 7);
                            }
                        }
                    }
                    if (index % 8 < 7) {
                        if (values[index + 1] == '' || values[index + 1] == '♙' || values[index + 1] == '♖' || values[index + 1] == '♘' || values[index + 1] == '♗' || values[index + 1] == '♕' || values[index + 1] == '♔') {
                            if (!checkForCheckBlack(index + 1)) {
                                moveArray.push(index + 1);
                            }
                        }
                        if (values[index - 7] == '' || values[index - 7] == '♙' || values[index - 7] == '♖' || values[index - 7] == '♘' || values[index - 7] == '♗' || values[index - 7] == '♕' || values[index - 7] == '♔') {
                            if (!checkForCheckBlack(index - 7)) {
                                moveArray.push(index - 7);
                            }
                        }
                        if (values[index + 9] == '' || values[index + 9] == '♙' || values[index + 9] == '♖' || values[index + 9] == '♘' || values[index + 9] == '♗' || values[index + 9] == '♕' || values[index + 9] == '♔') {
                            if (!checkForCheckBlack(index + 9)) {
                                moveArray.push(index + 9);
                            }
                        }
                    }
                    break;
                default:
                    break;
            }
        } else {
            switch (values[index]) {
                // White Pawn Movement
                case '♙':
                    if (index % 8 < 7) {
                        if (discDir == 'up-right' || discDir == 'down-left' || discDir == '') {
                            if (values[index - 7] != '' && values[index - 7] != '♙' && values[index - 7] != '♖' && values[index - 7] != '♘' && values[index - 7] != '♗' && values[index - 7] != '♕' && values[index - 7] != '♔') {
                                moveArray.push(index - 7);
                            }
                        }
                    }
                    if (index % 8 > 0) {
                        if (discDir == 'up-left' || discDir == 'down-right' || discDir == '') {
                            if (values[index - 9] != '' && values[index - 9] != '♙' && values[index - 9] != '♖' && values[index - 9] != '♘' && values[index - 9] != '♗' && values[index - 9] != '♕' && values[index - 9] != '♔') {
                                moveArray.push(index - 9);
                            }
                        }
                    }
                    if (discDir == 'up' || discDir == 'down' || discDir == '') {
                        if (values[index - 8] == '') {
                            moveArray.push(index - 8);
                            if (Math.floor(index / 8) == 6 && values[index - 16] == '') {
                                moveArray.push(index - 16);
                            }
                        }
                    }
                    break;
                // Black Pawn Movement
                case '♟':
                    if (index % 8 > 0) {
                        if (discDir == 'up-right' || discDir == 'down-left' || discDir == '') {
                            if (values[index + 7] != '' && values[index + 7] != '♟' && values[index + 7] != '♜' && values[index + 7] != '♞' && values[index + 7] != '♝' && values[index + 7] != '♛' && values[index + 7] != '♚') {
                                moveArray.push(index + 7);
                            }
                        }
                    }
                    if (index % 8 < 7) {
                        if (discDir == 'up-left' || discDir == 'down-right' || discDir == '') {
                            if (values[index + 9] != '' && values[index + 9] != '♟' && values[index + 9] != '♜' && values[index + 9] != '♞' && values[index + 9] != '♝' && values[index + 9] != '♛' && values[index + 9] != '♚') {
                                moveArray.push(index + 9);
                            }
                        }
                    }
                    if (discDir == 'up' || discDir == 'down' || discDir == '') {
                        if (values[index + 8] == '') {
                            moveArray.push(index + 8);
                            if (Math.floor(index / 8) == 1 && values[index + 16] == '') {
                                moveArray.push(index + 16);
                            }
                        }
                    }
                    break;
                // White Rook Movement
                case '♖':
                    if (discDir == 'up' || discDir == 'down' || discDir == '') {
                        for (let i = 1; i <= Math.floor(index / 8); i++) {
                            if (values[index - (8 * i)] == '') {
                                moveArray.push(index - (8 * i));
                            } else {
                                if (values[index - (8 * i)] == '♟' || values[index - (8 * i)] == '♜' || values[index - (8 * i)] == '♞' || values[index - (8 * i)] == '♝' || values[index - (8 * i)] == '♛' || values[index - (8 * i)] == '♚') {
                                    moveArray.push(index - (8 * i));
                                }
                                break;
                            }
                        }
                        for (let i = 1; i < 8 - Math.floor(index / 8); i++) {
                            if (values[index + (8 * i)] == '') {
                                moveArray.push(index + (8 * i));
                            } else {
                                if (values[index + (8 * i)] == '♟' || values[index + (8 * i)] == '♜' || values[index + (8 * i)] == '♞' || values[index + (8 * i)] == '♝' || values[index + (8 * i)] == '♛' || values[index + (8 * i)] == '♚') {
                                    moveArray.push(index + (8 * i));
                                }
                                break;
                            }
                        }
                    }
                    if (discDir == 'left' || discDir == 'right' || discDir == '') {
                        for (let i = 1; i <= (index % 8); i++) {
                            if (values[index - i] == '') {
                                moveArray.push(index - i);
                            } else {
                                if (values[index - i] == '♟' || values[index - i] == '♜' || values[index - i] == '♞' || values[index - i] == '♝' || values[index - i] == '♛' || values[index - i] == '♚') {
                                    moveArray.push(index - i);
                                }
                                break;
                            }
                        }
                        for (let i = 1; i < 8 - (index % 8); i++) {
                            if (values[index + i] == '') {
                                moveArray.push(index + i);
                            } else {
                                if (values[index + i] == '♟' || values[index + i] == '♜' || values[index + i] == '♞' || values[index + i] == '♝' || values[index + i] == '♛' || values[index + i] == '♚') {
                                    moveArray.push(index + i);
                                }
                                break;
                            }
                        }
                    }
                    break;
                // Black Rook Movement
                case '♜':
                    if (discDir == 'up' || discDir == 'down' || discDir == '') {
                        for (let i = 1; i <= Math.floor(index / 8); i++) {
                            if (values[index - (8 * i)] == '') {
                                moveArray.push(index - (8 * i));
                            } else {
                                if (values[index - (8 * i)] == '♙' || values[index - (8 * i)] == '♖' || values[index - (8 * i)] == '♘' || values[index - (8 * i)] == '♗' || values[index - (8 * i)] == '♕' || values[index - (8 * i)] == '♔') {
                                    moveArray.push(index - (8 * i));
                                }
                                break;
                            }
                        }
                        for (let i = 1; i < 8 - Math.floor(index / 8); i++) {
                            if (values[index + (8 * i)] == '') {
                                moveArray.push(index + (8 * i));
                            } else {
                                if (values[index + (8 * i)] == '♙' || values[index + (8 * i)] == '♖' || values[index + (8 * i)] == '♘' || values[index + (8 * i)] == '♗' || values[index + (8 * i)] == '♕' || values[index + (8 * i)] == '♔') {
                                    moveArray.push(index + (8 * i));
                                }
                                break;
                            }
                        }
                    }
                    if (discDir == 'left' || discDir == 'right' || discDir == '') {
                        for (let i = 1; i <= (index % 8); i++) {
                            if (values[index - i] == '') {
                                moveArray.push(index - i);
                            } else {
                                if (values[index - i] == '♙' || values[index - i] == '♖' || values[index - i] == '♘' || values[index - i] == '♗' || values[index - i] == '♕' || values[index - i] == '♔') {
                                    moveArray.push(index - i);
                                }
                                break;
                            }
                        }
                        for (let i = 1; i < 8 - (index % 8); i++) {
                            if (values[index + i] == '') {
                                moveArray.push(index + i);
                            } else {
                                if (values[index + i] == '♙' || values[index + i] == '♖' || values[index + i] == '♘' || values[index + i] == '♗' || values[index + i] == '♕' || values[index + i] == '♔') {
                                    moveArray.push(index + i);
                                }
                                break;
                            }
                        }
                    }
                    break;
                // White Knight Movement
                case '♘':
                    if (discDir == '') {
                        if (index % 8 > 0) {
                            if (index % 8 > 1) {
                                if (index >= 10) {
                                    if (values[index - 10] != '♙' && values[index - 10] != '♖' && values[index - 10] != '♘' && values[index - 10] != '♗' && values[index - 10] != '♕' && values[index - 10] != '♔') {
                                        moveArray.push(index - 10);
                                    }
                                }
                                if (index <= 57) {
                                    if (values[index + 6] != '♙' && values[index + 6] != '♖' && values[index + 6] != '♘' && values[index + 6] != '♗' && values[index + 6] != '♕' && values[index + 6] != '♔') {
                                        moveArray.push(index + 6);
                                    }
                                }
                            }
                            if (index >= 17) {
                                if (values[index - 17] != '♙' && values[index - 17] != '♖' && values[index - 17] != '♘' && values[index - 17] != '♗' && values[index - 17] != '♕' && values[index - 17] != '♔') {
                                    moveArray.push(index - 17);
                                }
                            }
                            if (index <= 48) {
                                if (values[index + 15] != '♙' && values[index + 15] != '♖' && values[index + 15] != '♘' && values[index + 15] != '♗' && values[index + 15] != '♕' && values[index + 15] != '♔') {
                                    moveArray.push(index + 15);
                                }
                            }
                        }
                        if (index % 8 < 7) {
                            if (index % 8 < 6) {
                                if (index >= 6) {
                                    if (values[index - 6] != '♙' && values[index - 6] != '♖' && values[index - 6] != '♘' && values[index - 6] != '♗' && values[index - 6] != '♕' && values[index - 6] != '♔') {
                                        moveArray.push(index - 6);
                                    }
                                }
                                if (index <= 53) {
                                    if (values[index + 10] != '♙' && values[index + 10] != '♖' && values[index + 10] != '♘' && values[index + 10] != '♗' && values[index + 10] != '♕' && values[index + 10] != '♔') {
                                        moveArray.push(index + 10);
                                    }
                                }
                            }
                            if (index >= 15) {
                                if (values[index - 15] != '♙' && values[index - 15] != '♖' && values[index - 15] != '♘' && values[index - 15] != '♗' && values[index - 15] != '♕' && values[index - 15] != '♔') {
                                    moveArray.push(index - 15);
                                }
                            }
                            if (index <= 46) {
                                if (values[index + 17] != '♙' && values[index + 17] != '♖' && values[index + 17] != '♘' && values[index + 17] != '♗' && values[index + 17] != '♕' && values[index + 17] != '♔') {
                                    moveArray.push(index + 17);
                                }
                            }
                        }
                    }
                    break;
                // Black Knight Movement
                case '♞':
                    if (discDir == '') {
                        if (index % 8 > 0) {
                            if (index % 8 > 1) {
                                if (index >= 10) {
                                    if (values[index - 10] != '♟' && values[index - 10] != '♜' && values[index - 10] != '♞' && values[index - 10] != '♝' && values[index - 10] != '♛' && values[index - 10] != '♚') {
                                        moveArray.push(index - 10);
                                    }
                                }
                                if (index <= 57) {
                                    if (values[index + 6] != '♟' && values[index + 6] != '♜' && values[index + 6] != '♞' && values[index + 6] != '♝' && values[index + 6] != '♛' && values[index + 6] != '♚') {
                                        moveArray.push(index + 6);
                                    }
                                }
                            }
                            if (index >= 17) {
                                if (values[index - 17] != '♟' && values[index - 17] != '♜' && values[index - 17] != '♞' && values[index - 17] != '♝' && values[index - 17] != '♛' && values[index - 17] != '♚') {
                                    moveArray.push(index - 17);
                                }
                            }
                            if (index <= 48) {
                                if (values[index + 15] != '♟' && values[index + 15] != '♜' && values[index + 15] != '♞' && values[index + 15] != '♝' && values[index + 15] != '♛' && values[index + 15] != '♚') {
                                    moveArray.push(index + 15);
                                }
                            }
                        }
                        if (index % 8 < 7) {
                            if (index % 8 < 6) {
                                if (index >= 6) {
                                    if (values[index - 6] != '♟' && values[index - 6] != '♜' && values[index - 6] != '♞' && values[index - 6] != '♝' && values[index - 6] != '♛' && values[index - 6] != '♚') {
                                        moveArray.push(index - 6);
                                    }
                                }
                                if (index <= 53) {
                                    if (values[index + 10] != '♟' && values[index + 10] != '♜' && values[index + 10] != '♞' && values[index + 10] != '♝' && values[index + 10] != '♛' && values[index + 10] != '♚') {
                                        moveArray.push(index + 10);
                                    }
                                }
                            }
                            if (index >= 15) {
                                if (values[index - 15] != '♟' && values[index - 15] != '♜' && values[index - 15] != '♞' && values[index - 15] != '♝' && values[index - 15] != '♛' && values[index - 15] != '♚') {
                                    moveArray.push(index - 15);
                                }
                            }
                            if (index <= 46) {
                                if (values[index + 17] != '♟' && values[index + 17] != '♜' && values[index + 17] != '♞' && values[index + 17] != '♝' && values[index + 17] != '♛' && values[index + 17] != '♚') {
                                    moveArray.push(index + 17);
                                }
                            }
                        }
                    }
                    break;
                // White Bishop Movement
                case '♗':
                    if (discDir == 'up-left' || discDir == 'down-right' || discDir == '') {
                        for (let i = 1; i <= (index % 8); i++) {
                            if (values[index - (9 * i)] == '') {
                                moveArray.push(index - (9 * i));
                            } else {
                                if (values[index - (9 * i)] == '♟' || values[index - (9 * i)] == '♜' || values[index - (9 * i)] == '♞' || values[index - (9 * i)] == '♝' || values[index - (9 * i)] == '♛' || values[index - (9 * i)] == '♚') {
                                    moveArray.push(index - (9 * i));
                                }
                                break;
                            }
                        }
                        for (let i = 1; i < 8 - (index % 8); i++) {
                            if (values[index + (9 * i)] == '') {
                                moveArray.push(index + (9 * i));
                            } else {
                                if (values[index + (9 * i)] == '♟' || values[index + (9 * i)] == '♜' || values[index + (9 * i)] == '♞' || values[index + (9 * i)] == '♝' || values[index + (9 * i)] == '♛' || values[index + (9 * i)] == '♚') {
                                    moveArray.push(index + (9 * i));
                                }
                                break;
                            }
                        }
                    }
                    if (discDir == 'up-right' || discDir == 'down-left' || discDir == '') {
                        for (let i = 1; i < 8 - (index % 8); i++) {
                            if (values[index - (7 * i)] == '') {
                                moveArray.push(index - (7 * i));
                            } else {
                                if (values[index - (7 * i)] == '♟' || values[index - (7 * i)] == '♜' || values[index - (7 * i)] == '♞' || values[index - (7 * i)] == '♝' || values[index - (7 * i)] == '♛' || values[index - (7 * i)] == '♚') {
                                    moveArray.push(index - (7 * i));
                                }
                                break;
                            }
                        }
                        for (let i = 1; i <= (index % 8); i++) {
                            if (values[index + (7 * i)] == '') {
                                moveArray.push(index + (7 * i));
                            } else {
                                if (values[index + (7 * i)] == '♟' || values[index + (7 * i)] == '♜' || values[index + (7 * i)] == '♞' || values[index + (7 * i)] == '♝' || values[index + (7 * i)] == '♛' || values[index + (7 * i)] == '♚') {
                                    moveArray.push(index + (7 * i));
                                }
                                break;
                            }
                        }
                    }
                    break;
                // Black Bishop Movement
                case '♝':
                    if (discDir == 'up-left' || discDir == 'down-right' || discDir == '') {
                        for (let i = 1; i <= (index % 8); i++) {
                            if (values[index - (9 * i)] == '') {
                                moveArray.push(index - (9 * i));
                            } else {
                                if (values[index - (9 * i)] == '♙' || values[index - (9 * i)] == '♖' || values[index - (9 * i)] == '♘' || values[index - (9 * i)] == '♗' || values[index - (9 * i)] == '♕' || values[index - (9 * i)] == '♔') {
                                    moveArray.push(index - (9 * i));
                                }
                                break;
                            }
                        }
                        for (let i = 1; i < 8 - (index % 8); i++) {
                            if (values[index + (9 * i)] == '') {
                                moveArray.push(index + (9 * i));
                            } else {
                                if (values[index + (9 * i)] == '♙' || values[index + (9 * i)] == '♖' || values[index + (9 * i)] == '♘' || values[index + (9 * i)] == '♗' || values[index + (9 * i)] == '♕' || values[index + (9 * i)] == '♔') {
                                    moveArray.push(index + (9 * i));
                                }
                                break;
                            }
                        }
                    }
                    if (discDir == 'up-right' || discDir == 'down-left' || discDir == '') {
                        for (let i = 1; i < 8 - (index % 8); i++) {
                            if (values[index - (7 * i)] == '') {
                                moveArray.push(index - (7 * i));
                            } else {
                                if (values[index - (7 * i)] == '♙' || values[index - (7 * i)] == '♖' || values[index - (7 * i)] == '♘' || values[index - (7 * i)] == '♗' || values[index - (7 * i)] == '♕' || values[index - (7 * i)] == '♔') {
                                    moveArray.push(index - (7 * i));
                                }
                                break;
                            }
                        }
                        for (let i = 1; i <= (index % 8); i++) {
                            if (values[index + (7 * i)] == '') {
                                moveArray.push(index + (7 * i));
                            } else {
                                if (values[index + (7 * i)] == '♙' || values[index + (7 * i)] == '♖' || values[index + (7 * i)] == '♘' || values[index + (7 * i)] == '♗' || values[index + (7 * i)] == '♕' || values[index + (7 * i)] == '♔') {
                                    moveArray.push(index + (7 * i));
                                }
                                break;
                            }
                        }
                    }
                    break;
                // White Queen Movement
                case '♕':
                    if (discDir == 'up' || discDir == 'down' || discDir == '') {
                        for (let i = 1; i <= Math.floor(index / 8); i++) {
                            if (values[index - (8 * i)] == '') {
                                moveArray.push(index - (8 * i));
                            } else {
                                if (values[index - (8 * i)] == '♟' || values[index - (8 * i)] == '♜' || values[index - (8 * i)] == '♞' || values[index - (8 * i)] == '♝' || values[index - (8 * i)] == '♛' || values[index - (8 * i)] == '♚') {
                                    moveArray.push(index - (8 * i));
                                }
                                break;
                            }
                        }
                        for (let i = 1; i < 8 - Math.floor(index / 8); i++) {
                            if (values[index + (8 * i)] == '') {
                                moveArray.push(index + (8 * i));
                            } else {
                                if (values[index + (8 * i)] == '♟' || values[index + (8 * i)] == '♜' || values[index + (8 * i)] == '♞' || values[index + (8 * i)] == '♝' || values[index + (8 * i)] == '♛' || values[index + (8 * i)] == '♚') {
                                    moveArray.push(index + (8 * i));
                                }
                                break;
                            }
                        }
                    }
                    if (discDir == 'left' || discDir == 'right' || discDir == '') {
                        for (let i = 1; i <= (index % 8); i++) {
                            if (values[index - i] == '') {
                                moveArray.push(index - i);
                            } else {
                                if (values[index - i] == '♟' || values[index - i] == '♜' || values[index - i] == '♞' || values[index - i] == '♝' || values[index - i] == '♛' || values[index - i] == '♚') {
                                    moveArray.push(index - i);
                                }
                                break;
                            }
                        }
                        for (let i = 1; i < 8 - (index % 8); i++) {
                            if (values[index + i] == '') {
                                moveArray.push(index + i);
                            } else {
                                if (values[index + i] == '♟' || values[index + i] == '♜' || values[index + i] == '♞' || values[index + i] == '♝' || values[index + i] == '♛' || values[index + i] == '♚') {
                                    moveArray.push(index + i);
                                }
                                break;
                            }
                        }
                    }
                    if (discDir == 'up-left' || discDir == 'down-right' || discDir == '') {
                        for (let i = 1; i <= (index % 8); i++) {
                            if (values[index - (9 * i)] == '') {
                                moveArray.push(index - (9 * i));
                            } else {
                                if (values[index - (9 * i)] == '♟' || values[index - (9 * i)] == '♜' || values[index - (9 * i)] == '♞' || values[index - (9 * i)] == '♝' || values[index - (9 * i)] == '♛' || values[index - (9 * i)] == '♚') {
                                    moveArray.push(index - (9 * i));
                                }
                                break;
                            }
                        }
                        for (let i = 1; i < 8 - (index % 8); i++) {
                            if (values[index + (9 * i)] == '') {
                                moveArray.push(index + (9 * i));
                            } else {
                                if (values[index + (9 * i)] == '♟' || values[index + (9 * i)] == '♜' || values[index + (9 * i)] == '♞' || values[index + (9 * i)] == '♝' || values[index + (9 * i)] == '♛' || values[index + (9 * i)] == '♚') {
                                    moveArray.push(index + (9 * i));
                                }
                                break;
                            }
                        }
                    }
                    if (discDir == 'up-right' || discDir == 'down-left' || discDir == '') {
                        for (let i = 1; i < 8 - (index % 8); i++) {
                            if (values[index - (7 * i)] == '') {
                                moveArray.push(index - (7 * i));
                            } else {
                                if (values[index - (7 * i)] == '♟' || values[index - (7 * i)] == '♜' || values[index - (7 * i)] == '♞' || values[index - (7 * i)] == '♝' || values[index - (7 * i)] == '♛' || values[index - (7 * i)] == '♚') {
                                    moveArray.push(index - (7 * i));
                                }
                                break;
                            }
                        }
                        for (let i = 1; i <= (index % 8); i++) {
                            if (values[index + (7 * i)] == '') {
                                moveArray.push(index + (7 * i));
                            } else {
                                if (values[index + (7 * i)] == '♟' || values[index + (7 * i)] == '♜' || values[index + (7 * i)] == '♞' || values[index + (7 * i)] == '♝' || values[index + (7 * i)] == '♛' || values[index + (7 * i)] == '♚') {
                                    moveArray.push(index + (7 * i));
                                }
                                break;
                            }
                        }
                    }
                    break;
                // Black Queen Movement
                case '♛':
                    if (discDir == 'up' || discDir == 'down' || discDir == '') {
                        for (let i = 1; i <= Math.floor(index / 8); i++) {
                            if (values[index - (8 * i)] == '') {
                                moveArray.push(index - (8 * i));
                            } else {
                                if (values[index - (8 * i)] == '♙' || values[index - (8 * i)] == '♖' || values[index - (8 * i)] == '♘' || values[index - (8 * i)] == '♗' || values[index - (8 * i)] == '♕' || values[index - (8 * i)] == '♔') {
                                    moveArray.push(index - (8 * i));
                                }
                                break;
                            }
                        }
                        for (let i = 1; i < 8 - Math.floor(index / 8); i++) {
                            if (values[index + (8 * i)] == '') {
                                moveArray.push(index + (8 * i));
                            } else {
                                if (values[index + (8 * i)] == '♙' || values[index + (8 * i)] == '♖' || values[index + (8 * i)] == '♘' || values[index + (8 * i)] == '♗' || values[index + (8 * i)] == '♕' || values[index + (8 * i)] == '♔') {
                                    moveArray.push(index + (8 * i));
                                }
                                break;
                            }
                        }
                    }
                    if (discDir == 'left' || discDir == 'right' || discDir == '') {
                        for (let i = 1; i <= (index % 8); i++) {
                            if (values[index - i] == '') {
                                moveArray.push(index - i);
                            } else {
                                if (values[index - i] == '♙' || values[index - i] == '♖' || values[index - i] == '♘' || values[index - i] == '♗' || values[index - i] == '♕' || values[index - i] == '♔') {
                                    moveArray.push(index - i);
                                }
                                break;
                            }
                        }
                        for (let i = 1; i < 8 - (index % 8); i++) {
                            if (values[index + i] == '') {
                                moveArray.push(index + i);
                            } else {
                                if (values[index + i] == '♙' || values[index + i] == '♖' || values[index + i] == '♘' || values[index + i] == '♗' || values[index + i] == '♕' || values[index + i] == '♔') {
                                    moveArray.push(index + i);
                                }
                                break;
                            }
                        }
                    }
                    if (discDir == 'up-left' || discDir == 'down-right' || discDir == '') {
                        for (let i = 1; i <= (index % 8); i++) {
                            if (values[index - (9 * i)] == '') {
                                moveArray.push(index - (9 * i));
                            } else {
                                if (values[index - (9 * i)] == '♙' || values[index - (9 * i)] == '♖' || values[index - (9 * i)] == '♘' || values[index - (9 * i)] == '♗' || values[index - (9 * i)] == '♕' || values[index - (9 * i)] == '♔') {
                                    moveArray.push(index - (9 * i));
                                }
                                break;
                            }
                        }
                        for (let i = 1; i < 8 - (index % 8); i++) {
                            if (values[index + (9 * i)] == '') {
                                moveArray.push(index + (9 * i));
                            } else {
                                if (values[index + (9 * i)] == '♙' || values[index + (9 * i)] == '♖' || values[index + (9 * i)] == '♘' || values[index + (9 * i)] == '♗' || values[index + (9 * i)] == '♕' || values[index + (9 * i)] == '♔') {
                                    moveArray.push(index + (9 * i));
                                }
                                break;
                            }
                        }
                    }
                    if (discDir == 'up-right' || discDir == 'down-left' || discDir == '') {
                        for (let i = 1; i < 8 - (index % 8); i++) {
                            if (values[index - (7 * i)] == '') {
                                moveArray.push(index - (7 * i));
                            } else {
                                if (values[index - (7 * i)] == '♙' || values[index - (7 * i)] == '♖' || values[index - (7 * i)] == '♘' || values[index - (7 * i)] == '♗' || values[index - (7 * i)] == '♕' || values[index - (7 * i)] == '♔') {
                                    moveArray.push(index - (7 * i));
                                }
                                break;
                            }
                        }
                        for (let i = 1; i <= (index % 8); i++) {
                            if (values[index + (7 * i)] == '') {
                                moveArray.push(index + (7 * i));
                            } else {
                                if (values[index + (7 * i)] == '♙' || values[index + (7 * i)] == '♖' || values[index + (7 * i)] == '♘' || values[index + (7 * i)] == '♗' || values[index + (7 * i)] == '♕' || values[index + (7 * i)] == '♔') {
                                    moveArray.push(index + (7 * i));
                                }
                                break;
                            }
                        }
                    }
                    break;
                // White King Movement
                case '♔':
                    if (values[index - 8] == '' || values[index - 8] == '♟' || values[index - 8] == '♜' || values[index - 8] == '♞' || values[index - 8] == '♝' || values[index - 8] == '♛' || values[index - 8] == '♚') {
                        if (!checkForCheckWhite(index - 8)) {
                            moveArray.push(index - 8);
                        }
                    }
                    if (values[index + 8] == '' || values[index + 8] == '♟' || values[index + 8] == '♜' || values[index + 8] == '♞' || values[index + 8] == '♝' || values[index + 8] == '♛' || values[index + 8] == '♚') {
                        if (!checkForCheckWhite(index + 8)) {
                            moveArray.push(index + 8);
                        }
                    }
                    if (index % 8 > 0) {
                        if (values[index - 1] == '' || values[index - 1] == '♟' || values[index - 1] == '♜' || values[index - 1] == '♞' || values[index - 1] == '♝' || values[index - 1] == '♛' || values[index - 1] == '♚') {
                            if (!checkForCheckWhite(index - 1)) {
                                moveArray.push(index - 1);
                            }
                        }
                        if (values[index - 9] == '' || values[index - 9] == '♟' || values[index - 9] == '♜' || values[index - 9] == '♞' || values[index - 9] == '♝' || values[index - 9] == '♛' || values[index - 9] == '♚') {
                            if (!checkForCheckWhite(index - 9)) {
                                moveArray.push(index - 9);
                            }
                        }
                        if (values[index + 7] == '' || values[index + 7] == '♟' || values[index + 7] == '♜' || values[index + 7] == '♞' || values[index + 7] == '♝' || values[index + 7] == '♛' || values[index + 7] == '♚') {
                            if (!checkForCheckWhite(index + 7)) {
                                moveArray.push(index + 7);
                            }
                        }
                    }
                    if (index % 8 < 7) {
                        if (values[index + 1] == '' || values[index + 1] == '♟' || values[index + 1] == '♜' || values[index + 1] == '♞' || values[index + 1] == '♝' || values[index + 1] == '♛' || values[index + 1] == '♚') {
                            if (!checkForCheckWhite(index + 1)) {
                                moveArray.push(index + 1);
                            }
                        }
                        if (values[index - 7] == '' || values[index - 7] == '♟' || values[index - 7] == '♜' || values[index - 7] == '♞' || values[index - 7] == '♝' || values[index - 7] == '♛' || values[index - 7] == '♚') {
                            if (!checkForCheckWhite(index - 7)) {
                                moveArray.push(index - 7);
                            }
                        }
                        if (values[index + 9] == '' || values[index + 9] == '♟' || values[index + 9] == '♜' || values[index + 9] == '♞' || values[index + 9] == '♝' || values[index + 9] == '♛' || values[index + 9] == '♚') {
                            if (!checkForCheckWhite(index + 9)) {
                                moveArray.push(index + 9);
                            }
                        }
                    }
                    break;
                // Black King Movement
                case '♚':
                    if (values[index - 8] == '' || values[index - 8] == '♙' || values[index - 8] == '♖' || values[index - 8] == '♘' || values[index - 8] == '♗' || values[index - 8] == '♕' || values[index - 8] == '♔') {
                        if (!checkForCheckBlack(index - 8)) {
                            moveArray.push(index - 8);
                        }
                    }
                    if (values[index + 8] == '' || values[index + 8] == '♙' || values[index + 8] == '♖' || values[index + 8] == '♘' || values[index + 8] == '♗' || values[index + 8] == '♕' || values[index + 8] == '♔') {
                        if (!checkForCheckBlack(index + 8)) {
                            moveArray.push(index + 8);
                        }
                    }
                    if (index % 8 > 0) {
                        if (values[index - 1] == '' || values[index - 1] == '♙' || values[index - 1] == '♖' || values[index - 1] == '♘' || values[index - 1] == '♗' || values[index - 1] == '♕' || values[index - 1] == '♔') {
                            if (!checkForCheckBlack(index - 1)) {
                                moveArray.push(index - 1);
                            }
                        }
                        if (values[index - 9] == '' || values[index - 9] == '♙' || values[index - 9] == '♖' || values[index - 9] == '♘' || values[index - 9] == '♗' || values[index - 9] == '♕' || values[index - 9] == '♔') {
                            if (!checkForCheckBlack(index - 9)) {
                                moveArray.push(index - 9);
                            }
                        }
                        if (values[index + 7] == '' || values[index + 7] == '♙' || values[index + 7] == '♖' || values[index + 7] == '♘' || values[index + 7] == '♗' || values[index + 7] == '♕' || values[index + 7] == '♔') {
                            if (!checkForCheckBlack(index + 7)) {
                                moveArray.push(index + 7);
                            }
                        }
                    }
                    if (index % 8 < 7) {
                        if (values[index + 1] == '' || values[index + 1] == '♙' || values[index + 1] == '♖' || values[index + 1] == '♘' || values[index + 1] == '♗' || values[index + 1] == '♕' || values[index + 1] == '♔') {
                            if (!checkForCheckBlack(index + 1)) {
                                moveArray.push(index + 1);
                            }
                        }
                        if (values[index - 7] == '' || values[index - 7] == '♙' || values[index - 7] == '♖' || values[index - 7] == '♘' || values[index - 7] == '♗' || values[index - 7] == '♕' || values[index - 7] == '♔') {
                            if (!checkForCheckBlack(index - 7)) {
                                moveArray.push(index - 7);
                            }
                        }
                        if (values[index + 9] == '' || values[index + 9] == '♙' || values[index + 9] == '♖' || values[index + 9] == '♘' || values[index + 9] == '♗' || values[index + 9] == '♕' || values[index + 9] == '♔') {
                            if (!checkForCheckBlack(index + 9)) {
                                moveArray.push(index + 9);
                            }
                        }
                    }
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
        var aa = values.findIndex(value => value == '♗');
        var bb = values.findLastIndex(value => value == '♗');
        if (aa == bb && aa != -1) {
            whiteBishops.push(aa);
        } else if (aa != -1) {
            whiteBishops.push(aa);
            whiteBishops.push(bb);
        }
        var blackBishops = [];
        var cc = values.findIndex(value => value == '♝');
        var dd = values.findLastIndex(value => value == '♝');
        if (cc == dd && cc != -1) {
            blackBishops.push(cc);
        } else if (cc != -1) {
            blackBishops.push(cc);
            blackBishops.push(dd);
        }
        var whiteKnights = [];
        var ee = values.findIndex(value => value == '♘');
        var ff = values.findLastIndex(value => value == '♘');
        if (ee == ff && ee != -1) {
            whiteKnights.push(ee);
        } else if (ee != -1) {
            whiteKnights.push(ee);
            whiteKnights.push(ff);
        }
        var blackKnights = [];
        var gg = values.findIndex(value => value == '♞');
        var hh = values.findLastIndex(value => value == '♞');
        if (gg == hh && gg != -1) {
            blackKnights.push(gg);
        } else if (gg != -1) {
            blackKnights.push(gg);
            blackKnights.push(hh);
        }
        var whiteRooks = [];
        var ii = values.findIndex(value => value == '♖');
        var jj = values.findLastIndex(value => value == '♖');
        if (ii == jj && ii != -1) {
            whiteRooks.push(ii);
        } else if (ii != -1) {
            whiteRooks.push(ii);
            whiteRooks.push(jj);
        }
        var blackRooks = [];
        var kk = values.findIndex(value => value == '♜');
        var ll = values.findLastIndex(value => value == '♜');
        if (kk == ll && kk != -1) {
            blackRooks.push(kk);
        } else if (kk != -1) {
            blackRooks.push(kk);
            blackRooks.push(ll);
        }
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
