import React, { useEffect, useState } from "react";

import "./styles.css";

const Cell = (props) => {
    const { id, selected, value, win, player, setPlayer, setArray, setSelected, checkForMovement, checkForCastle } = props;

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

    useEffect(() => {
        checkForWin();
        checkForBlocked();
    }, [values]);

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
    }

    const checkForFreeWhite = (index) => {
        values.forEach((value, id) => {
            if (value == '♟' || value == '♜' || value == '♞' || value == '♝' || value == '♛' || value == '♚') {
                var a = checkForMovement(id);
                if (a.some(val => index == val)) {
                    return false;
                }
            }
        });
        return true;
    }

    const checkForFreeBlack = (index) => {
        values.forEach((value, id) => {
            if (value == '♙' || value == '♖' || value == '♘' || value == '♗' || value == '♕' || value == '♔') {
                var a = checkForMovement(id);
                if (a.some(val => index == val)) {
                    return false;
                }
            }
        });
        return true;
    }

    const checkForCastle = (kingIndex, rookIndex) => {
        if (kingIndex == 60 && !selected.moved[0]) {
            // white king
            if (rookIndex == 56 && !selected.moved[2]) {
                // left rook
                if (values[59] == '' && values[58] == '' && values[57] == '' && checkForFreeWhite(60) && checkForFreeWhite(59) && checkForFreeWhite(58)) {
                    return true;
                }
            } else if (rookIndex == 63 && !selected.moved[3]) {
                // right rook
                if (values[61] == '' && values[62] == '' && checkForFreeWhite(60) && checkForFreeWhite(61) && checkForFreeWhite(62)) {
                    return true;
                }
            }
        } else if (kingIndex == 4 && !selected.moved[1]) {
            // black king
            if (rookIndex == 0 && !selected.moved[4]) {
                // left rook
                if (values[3] == '' && values[2] == '' && values[1] == '' && checkForFreeBlack(4) && checkForFreeBlack(3) && checkForFreeBlack(2)) {
                    return true;
                }
            } else if (rookIndex == 7 && !selected.moved[5]) {
                // right rook
                if (values[5] == '' && values[6] == '' && checkForFreeBlack(4) && checkForFreeBlack(5) && checkForFreeBlack(6)) {
                    return true;
                }
            }
        }
        return false;
    }

    const checkForMovement = (index) => {
        var moveArray = [];
        moveArray.push(index);
        switch (values[index]) {
            // White Pawn Movement
            case '♙':
                if (index % 8 < 7) {
                    if (values[index - 7] != '' && values[index - 7] != '♙' && values[index - 7] != '♖' && values[index - 7] != '♘' && values[index - 7] != '♗' && values[index - 7] != '♕' && values[index - 7] != '♔') {
                        moveArray.push(index - 7);
                    }
                }
                if (index % 8 > 0) {
                    if (values[index - 9] != '' && values[index - 9] != '♙' && values[index - 9] != '♖' && values[index - 9] != '♘' && values[index - 9] != '♗' && values[index - 9] != '♕' && values[index - 9] != '♔') {
                        moveArray.push(index - 9);
                    }
                }
                if (values[index - 8] == '') {
                    moveArray.push(index - 8);
                    if (Math.floor(index / 8) == 6 && values[index - 16] == '') {
                        moveArray.push(index - 16);
                    }
                }
                break;
            // Black Pawn Movement
            case '♟':
                if (index % 8 > 0) {
                    if (values[index + 7] != '' && values[index + 7] != '♟' && values[index + 7] != '♜' && values[index + 7] != '♞' && values[index + 7] != '♝' && values[index + 7] != '♛' && values[index + 7] != '♚') {
                        moveArray.push(index + 7);
                    }
                }
                if (index % 8 < 7) {
                    if (values[index + 9] != '' && values[index + 9] != '♟' && values[index + 9] != '♜' && values[index + 9] != '♞' && values[index + 9] != '♝' && values[index + 9] != '♛' && values[index + 9] != '♚') {
                        moveArray.push(index + 9);
                    }
                }
                if (values[index + 8] == '') {
                    moveArray.push(index + 8);
                    if (Math.floor(index / 8) == 1 && values[index + 16] == '') {
                        moveArray.push(index + 16);
                    }
                }
                break;
            // White Rook Movement
            case '♖':
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
                break;
            // Black Rook Movement
            case '♜':
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
                break;
            // White Knight Movement
            case '♘':
                if (index % 8 > 0) {
                    if (index % 8 > 1) {
                        if (values[index - 10] != '♙' && values[index - 10] != '♖' && values[index - 10] != '♘' && values[index - 10] != '♗' && values[index - 10] != '♕' && values[index - 10] != '♔') {
                            moveArray.push(index - 10);
                        }
                        if (values[index + 6] != '♙' && values[index + 6] != '♖' && values[index + 6] != '♘' && values[index + 6] != '♗' && values[index + 6] != '♕' && values[index + 6] != '♔') {
                            moveArray.push(index + 6);
                        }
                    }
                    if (values[index - 17] != '♙' && values[index - 17] != '♖' && values[index - 17] != '♘' && values[index - 17] != '♗' && values[index - 17] != '♕' && values[index - 17] != '♔') {
                        moveArray.push(index - 17);
                    }
                    if (values[index + 15] != '♙' && values[index + 15] != '♖' && values[index + 15] != '♘' && values[index + 15] != '♗' && values[index + 15] != '♕' && values[index + 15] != '♔') {
                        moveArray.push(index + 15);
                    }
                }
                if (index % 8 < 7) {
                    if (index % 8 < 6) {
                        if (values[index - 6] != '♙' && values[index - 6] != '♖' && values[index - 6] != '♘' && values[index - 6] != '♗' && values[index - 6] != '♕' && values[index - 6] != '♔') {
                            moveArray.push(index - 6);
                        }
                        if (values[index + 10] != '♙' && values[index + 10] != '♖' && values[index + 10] != '♘' && values[index + 10] != '♗' && values[index + 10] != '♕' && values[index + 10] != '♔') {
                            moveArray.push(index + 10);
                        }
                    }
                    if (values[index - 15] != '♙' && values[index - 15] != '♖' && values[index - 15] != '♘' && values[index - 15] != '♗' && values[index - 15] != '♕' && values[index - 15] != '♔') {
                        moveArray.push(index - 15);
                    }
                    if (values[index + 17] != '♙' && values[index + 17] != '♖' && values[index + 17] != '♘' && values[index + 17] != '♗' && values[index + 17] != '♕' && values[index + 17] != '♔') {
                        moveArray.push(index + 17);
                    }
                }
                break;
            // Black Knight Movement
            case '♞':
                if (index % 8 > 0) {
                    if (index % 8 > 1) {
                        if (values[index - 10] != '♟' && values[index - 10] != '♜' && values[index - 10] != '♞' && values[index - 10] != '♝' && values[index - 10] != '♛' && values[index - 10] != '♚') {
                            moveArray.push(index - 10);
                        }
                        if (values[index + 6] != '♟' && values[index + 6] != '♜' && values[index + 6] != '♞' && values[index + 6] != '♝' && values[index + 6] != '♛' && values[index + 6] != '♚') {
                            moveArray.push(index + 6);
                        }
                    }
                    if (values[index - 17] != '♟' && values[index - 17] != '♜' && values[index - 17] != '♞' && values[index - 17] != '♝' && values[index - 17] != '♛' && values[index - 17] != '♚') {
                        moveArray.push(index - 17);
                    }
                    if (values[index + 15] != '♟' && values[index + 15] != '♜' && values[index + 15] != '♞' && values[index + 15] != '♝' && values[index + 15] != '♛' && values[index + 15] != '♚') {
                        moveArray.push(index + 15);
                    }
                }
                if (index % 8 < 7) {
                    if (index % 8 < 6) {
                        if (values[index - 6] != '♟' && values[index - 6] != '♜' && values[index - 6] != '♞' && values[index - 6] != '♝' && values[index - 6] != '♛' && values[index - 6] != '♚') {
                            moveArray.push(index - 6);
                        }
                        if (values[index + 10] != '♟' && values[index + 10] != '♜' && values[index + 10] != '♞' && values[index + 10] != '♝' && values[index + 10] != '♛' && values[index + 10] != '♚') {
                            moveArray.push(index + 10);
                        }
                    }
                    if (values[index - 15] != '♟' && values[index - 15] != '♜' && values[index - 15] != '♞' && values[index - 15] != '♝' && values[index - 15] != '♛' && values[index - 15] != '♚') {
                        moveArray.push(index - 15);
                    }
                    if (values[index + 17] != '♟' && values[index + 17] != '♜' && values[index + 17] != '♞' && values[index + 17] != '♝' && values[index + 17] != '♛' && values[index + 17] != '♚') {
                        moveArray.push(index + 17);
                    }
                }
                break;
            // White Bishop Movement
            case '♗':
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
                break;
            // Black Bishop Movement
            case '♝':
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
                break;
            // White Queen Movement
            case '♕':
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
                break;
            // Black Queen Movement
            case '♛':
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
                break;
            // White King Movement
            case '♔':
                if (values[index - 8] == '' || values[index - 8] == '♟' || values[index - 8] == '♜' || values[index - 8] == '♞' || values[index - 8] == '♝' || values[index - 8] == '♛' || values[index - 8] == '♚') {
                    moveArray.push(index - 8);
                }
                if (values[index + 8] == '' || values[index + 8] == '♟' || values[index + 8] == '♜' || values[index + 8] == '♞' || values[index + 8] == '♝' || values[index + 8] == '♛' || values[index + 8] == '♚') {
                    moveArray.push(index + 8);
                }
                if (values[index - 1] == '' || values[index - 1] == '♟' || values[index - 1] == '♜' || values[index - 1] == '♞' || values[index - 1] == '♝' || values[index - 1] == '♛' || values[index - 1] == '♚') {
                    moveArray.push(index - 1);
                }
                if (values[index + 1] == '' || values[index + 1] == '♟' || values[index + 1] == '♜' || values[index + 1] == '♞' || values[index + 1] == '♝' || values[index + 1] == '♛' || values[index + 1] == '♚') {
                    moveArray.push(index + 1);
                }
                if (values[index - 9] == '' || values[index - 9] == '♟' || values[index - 9] == '♜' || values[index - 9] == '♞' || values[index - 9] == '♝' || values[index - 9] == '♛' || values[index - 9] == '♚') {
                    moveArray.push(index - 9);
                }
                if (values[index + 9] == '' || values[index + 9] == '♟' || values[index + 9] == '♜' || values[index + 9] == '♞' || values[index + 9] == '♝' || values[index + 9] == '♛' || values[index + 9] == '♚') {
                    moveArray.push(index + 9);
                }
                if (values[index - 7] == '' || values[index - 7] == '♟' || values[index - 7] == '♜' || values[index - 7] == '♞' || values[index - 7] == '♝' || values[index - 7] == '♛' || values[index - 7] == '♚') {
                    moveArray.push(index - 7);
                }
                if (values[index + 7] == '' || values[index + 7] == '♟' || values[index + 7] == '♜' || values[index + 7] == '♞' || values[index + 7] == '♝' || values[index + 7] == '♛' || values[index + 7] == '♚') {
                    moveArray.push(index + 7);
                }
                break;
            // Black King Movement
            case '♚':
                if (values[index - 8] == '' || values[index - 8] == '♙' || values[index - 8] == '♖' || values[index - 8] == '♘' || values[index - 8] == '♗' || values[index - 8] == '♕' || values[index - 8] == '♔') {
                    moveArray.push(index - 8);
                }
                if (values[index + 8] == '' || values[index + 8] == '♙' || values[index + 8] == '♖' || values[index + 8] == '♘' || values[index + 8] == '♗' || values[index + 8] == '♕' || values[index + 8] == '♔') {
                    moveArray.push(index + 8);
                }
                if (values[index - 1] == '' || values[index - 1] == '♙' || values[index - 1] == '♖' || values[index - 1] == '♘' || values[index - 1] == '♗' || values[index - 1] == '♕' || values[index - 1] == '♔') {
                    moveArray.push(index - 1);
                }
                if (values[index + 1] == '' || values[index + 1] == '♙' || values[index + 1] == '♖' || values[index + 1] == '♘' || values[index + 1] == '♗' || values[index + 1] == '♕' || values[index + 1] == '♔') {
                    moveArray.push(index + 1);
                }
                if (values[index - 9] == '' || values[index - 9] == '♙' || values[index - 9] == '♖' || values[index - 9] == '♘' || values[index - 9] == '♗' || values[index - 9] == '♕' || values[index - 9] == '♔') {
                    moveArray.push(index - 9);
                }
                if (values[index + 9] == '' || values[index + 9] == '♙' || values[index + 9] == '♖' || values[index + 9] == '♘' || values[index + 9] == '♗' || values[index + 9] == '♕' || values[index + 9] == '♔') {
                    moveArray.push(index + 9);
                }
                if (values[index - 7] == '' || values[index - 7] == '♙' || values[index - 7] == '♖' || values[index - 7] == '♘' || values[index - 7] == '♗' || values[index - 7] == '♕' || values[index - 7] == '♔') {
                    moveArray.push(index - 7);
                }
                if (values[index + 7] == '' || values[index + 7] == '♙' || values[index + 7] == '♖' || values[index + 7] == '♘' || values[index + 7] == '♗' || values[index + 7] == '♕' || values[index + 7] == '♔') {
                    moveArray.push(index + 7);
                }
                break;
            default:
                break;
        }
        return moveArray;
    }

    const checkForWin = () => {
        if (values.every(value => value != '♔')) {
            setWin('Black');
        }
        if (values.every(value => value != '♚')) {
            setWin('White');
        }
        var whiteIndex = values.findIndex(value => value == '♔');
        var blackIndex = values.findIndex(value => value == '♚');
        if (!checkForFreeWhite(whiteIndex)) {
            setWin('Check');
        }
        if (!checkForFreeBlack(blackIndex)) {
            setWin('Check');
        }
    }

    return (
        <div className="app3">
            <div aria-live="polite">
                {((win == '') ? (player + "'s turn") : ((win == 'Draw') ? 'Draw' : ((win == 'Check') ? (player + ' is in check') : ('Winner is ' + win))))}
            </div>
            <div className="board3">
                {values.map((value, index) => (<Cell id={index} value={value} win={win} player={player} selected={selected}
                    setPlayer={() => playerModifier(setPlayer)} setArray={arrayModifier} setSelected={setSelected} checkForMovement={checkForMovement} checkForCastle={checkForCastle} />))}
            </div>
            <button onClick={reset}>Reset</button>
        </div>
    );
} 
