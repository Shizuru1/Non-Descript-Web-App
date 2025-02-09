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
                if (selected.piece == '♚' && !moves[0]) {
                    moves[0] = true;
                } else if (selected.piece == '♔' && !moves[1]) {
                    moves[1] = true;
                } else if (selected.piece == '🨀' && !moves[2]) {
                    moves[2] = true;
                } else if (selected.piece == '♜') {
                    if (selected.id == 0 && !moves[3]) {
                        moves[3] = true;
                    } else if (selected.id == 56 && !moves[4]) {
                        moves[4] = true;
                    }
                } else if (selected.piece == '♖') {
                    if (selected.id == 88 && !moves[5]) {
                        moves[5] = true;
                    } else if (selected.id == 95 && !moves[6]) {
                        moves[6] = true;
                    }
                } else if (selected.piece == '🨂') {
                    if (selected.id == 63 && !moves[7]) {
                        moves[7] = true;
                    } else if (selected.id == 7 && !moves[8]) {
                        moves[8] = true;
                    }
                }
                if (value == '♜') {
                    if (id == 0 && !moves[3]) {
                        moves[3] = true;
                    } else if (id == 56 && !moves[4]) {
                        moves[4] = true;
                    }
                } else if (value == '♖') {
                    if (id == 88 && !moves[5]) {
                        moves[5] = true;
                    } else if (id == 95 && !moves[6]) {
                        moves[6] = true;
                    }
                } else if (value == '🨂') {
                    if (id == 63 && !moves[7]) {
                        moves[7] = true;
                    } else if (id == 7 && !moves[8]) {
                        moves[8] = true;
                    }
                }
                if ((selected.piece == '♔' || selected.piece == '♚' || selected.piece == '🨀') && (Math.abs(id - selected.id) == 2 || Math.abs(id - selected.id) == 16)) {
                    if (id == 16) {
                        setArray(0, '');
                        setArray(24, '♜');
                    } else if (id == 48) {
                        setArray(56, '');
                        setArray(40, '♜');
                    } else if (id == 90) {
                        setArray(88, '');
                        setArray(91, '♖');
                    } else if (id == 94) {
                        setArray(95, '');
                        setArray(93, '♖');
                    } else if (id == 15) {
                        setArray(7, '');
                        setArray(23, '🨂');
                    } else if (id == 47) {
                        setArray(63, '');
                        setArray(39, '🨂');
                    }
                }
                var passant = selected.id;
                if ((selected.piece == '♙' || selected.piece == '♟' || selected.piece == '🨅') && (Math.abs(id - selected.id) == 16 || Math.abs(id - selected.id) == 2)) {
                    if (id > 63) {
                        passant -= 8;
                    } else {
                        if (id % 8 == 4) {
                            passant--;
                        } else if (id % 8 == 3) {
                            passant++;
                        }
                    }
                } else {
                    passant = -1;
                }
                if ((selected.piece == '♙' || selected.piece == '♟' || selected.piece == '🨅') && (Math.abs(id - selected.id) == 7 || Math.abs(id - selected.id) == 9) && value == '') {
                    if (Math.floor(id / 8) == 9) {
                        setArray(id - 8, '');
                    } else if (id < 64 && id % 8 == 2) {
                        setArray(id++, '');
                    } else if (id < 64 && id % 8 == 5) {
                        setArray(id--, '');
                    }
                }
                if (value == '' && selected.piece != '♙' && selected.piece != '♟' && selected.piece != '🨅') {
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
            if (((id < 64 && id % 8 == 0) || (id < 64 && id % 8 == 7)) && selected.piece == '♙') {
                setArray(id, '♕');
            }
            // Upgrade Black Pawn to Queen
            if (((id < 64 && id % 8 == 7) || id > 87) && selected.piece == '♟') {
                setArray(id, '♛');
            }
            // Upgrade Bichrome Pawn to Queen
            if (((id < 64 && id % 8 == 0) || id > 87) && selected.piece == '🨅') {
                setArray(id, '🨁');
            }
        } else {
            setSelected({ id: id, value: true, piece: value, blockedArray: selected.blockedArray, moved: selected.moved, passant: selected.passant });
        }
    }

    const blackSelect = player == 'Black' && value != '♟' && value != '♜' && value != '♞' && value != '♝' && value != '♛' && value != '♚';
    const whiteSelect = player == 'White' && value != '♙' && value != '♖' && value != '♘' && value != '♗' && value != '♕' && value != '♔';
    const bichromeSelect = player == 'Bichrome' && value != '🨅' && value != '🨂' && value != '🨄' && value != '🨃' && value != '🨁' && value != '🨀';
    const blackCastle = selected.piece == '♚' ? (checkForCastle(32, 0) ? id != 16 : true) && (checkForCastle(32, 56) ? id != 48 : true) : true;
    const whiteCastle = selected.piece == '♔' ? (checkForCastle(92, 88) ? id != 90 : true) && (checkForCastle(92, 95) ? id != 94 : true) : true;
    const bichromeCastle = selected.piece == '🨀' ? (checkForCastle(31, 7) ? id != 15 : true) && (checkForCastle(31, 63) ? id != 47 : true) : true;
    const blackPassant = id > 63 ? (id != selected.passant || id != selected.id + 7) && (id != selected.passant || id != selected.id + 9) :
        (id != selected.passant || id != selected.id - 7) && (id != selected.passant || id != selected.id + 9);
    const whitePassant = id % 8 > 3 ? (id != selected.passant || id != selected.id - 7) && (id != selected.passant || id != selected.id + 9) :
        (id != selected.passant || id != selected.id + 7) && (id != selected.passant || id != selected.id - 9);
    const bichromePassant = id > 63 ? (id != selected.passant || id != selected.id + 7) && (id != selected.passant || id != selected.id + 9) :
        (id != selected.passant || id != selected.id + 7) && (id != selected.passant || id != selected.id - 9);
    const select = !selected.value && (selected.blockedArray.some(val => (id == val)) || (blackSelect || whiteSelect || bichromeSelect));
    const movement = selected.value && (!checkForMovement(selected.id).some(val => (id == val)) &&
        (player == 'Black' ? (selected.piece == '♟' ? blackPassant : blackCastle) : (player == 'White' ? (selected.piece == '♙' ? whitePassant : whiteCastle) : (selected.piece == '🨅' ? bichromePassant : bichromeCastle))));
    const noWin = win != '' && win != 'Check';

    return <button className={"celll" + id.toString()} onClick={handleClick}
        disabled={select || movement || noWin}>{value}</button>;
};

export default function App() {
    const [player, setPlayer] = useState('White'); // whose turn
    const [win, setWin] = useState(''); // win state
    const initArray = ['♜', '♟', '', '', '', '', '🨅', '🨂',
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
        '♖', '♘', '♗', '♕', '♔', '♗', '♘', '♖'];
    const [values, setValues] = useState(initArray); // board state
    const [selected, setSelected] = useState({ id: -1, value: false, piece: '', blockedArray: [], moved: [false, false, false, false, false, false, false, false, false], passant: -1 }); // trigger move state upon piece selection
    const [count, setCount] = useState(0); // count for fifty move rule
    const [repetitions, setRepetitions] = useState([]); // count for fivefold repetition rule
    const [firstOut, setFirstOut] = useState('');

    useEffect(() => {
        checkForCheck();
        checkForReps();
    }, [values]);

    useEffect(() => {
        checkForMate();
    }, [repetitions]);

    const upArray = [-1, 0, 1, 2, 3, 4, 5, 6,
        -1, 8, 9, 10, 11, 12, 13, 14,
        -1, 16, 17, 18, 19, 20, 21, 22,
        -1, 24, 25, 26, 27, 28, 29, 30,
        -1, 32, 33, 34, 37, 38, 39, -1,
        -1, 40, 41, 42, 45, 46, 47, -1,
        -1, 48, 49, 50, 53, 54, 55, -1,
        -1, 56, 57, 58, 61, 62, 63, -1,
        59, 51, 43, 35, 36, 44, 52, 60,
        64, 65, 66, 67, 68, 69, 70, 71,
        72, 73, 74, 75, 76, 77, 78, 79,
        80, 81, 82, 83, 84, 85, 86, 87];

    const downArray = [1, 2, 3, 4, 5, 6, 7, -1,
        9, 10, 11, 12, 13, 14, 15, -1,
        17, 18, 19, 20, 21, 22, 23, -1,
        25, 26, 27, 28, 29, 30, 31, -1,
        33, 34, 35, 67, 68, 36, 37, 38,
        41, 42, 43, 66, 69, 44, 45, 46,
        49, 50, 51, 65, 70, 52, 53, 54,
        57, 58, 59, 64, 71, 60, 61, 62,
        72, 73, 74, 75, 76, 77, 78, 79,
        80, 81, 82, 83, 84, 85, 86, 87,
        88, 89, 90, 91, 92, 93, 94, 95,
        -1, -1, -1, -1, -1, -1, -1, -1];

    const upAltArray = [1, 2, 3, 4, 5, 6, 7, -1,
        9, 10, 11, 12, 13, 14, 15, -1,
        17, 18, 19, 20, 21, 22, 23, -1,
        25, 26, 27, 28, 29, 30, 31, -1,
        -1, 32, 33, 34, 37, 38, 39, -1,
        -1, 40, 41, 42, 45, 46, 47, -1,
        -1, 48, 49, 50, 53, 54, 55, -1,
        -1, 56, 57, 58, 61, 62, 63, -1,
        59, 51, 43, 35, 36, 44, 52, 60,
        64, 65, 66, 67, 68, 69, 70, 71,
        72, 73, 74, 75, 76, 77, 78, 79,
        80, 81, 82, 83, 84, 85, 86, 87];

    const downAltArray = [-1, 0, 1, 2, 3, 4, 5, 6,
        -1, 8, 9, 10, 11, 12, 13, 14,
        -1, 16, 17, 18, 19, 20, 21, 22,
        -1, 24, 25, 26, 27, 28, 29, 30,
        33, 34, 35, 67, 68, 36, 37, 38,
        41, 42, 43, 66, 69, 44, 45, 46,
        49, 50, 51, 65, 70, 52, 53, 54,
        57, 58, 59, 64, 71, 60, 61, 62,
        72, 73, 74, 75, 76, 77, 78, 79,
        80, 81, 82, 83, 84, 85, 86, 87,
        88, 89, 90, 91, 92, 93, 94, 95,
        -1, -1, -1, -1, -1, -1, -1, -1];

    const leftArray = [8, 9, 10, 11, -1, -1, -1, -1,
        16, 17, 18, 19, 4, 5, 6, 7,
        24, 25, 26, 27, 12, 13, 14, 15,
        32, 33, 34, 35, 20, 21, 22, 23,
        40, 41, 42, 43, 28, 29, 30, 31,
        48, 49, 50, 51, 36, 37, 38, 39,
        56, 57, 58, 59, 44, 45, 46, 47,
        -1, -1, -1, -1, 52, 53, 54, 55,
        -1, 64, 65, 66, 67, 68, 69, 70,
        -1, 72, 73, 74, 75, 76, 77, 78,
        -1, 80, 81, 82, 83, 84, 85, 86,
        -1, 88, 89, 90, 91, 92, 93, 94];

    const rightArray = [-1, -1, -1, -1, 12, 13, 14, 15,
        0, 1, 2, 3, 20, 21, 22, 23,
        8, 9, 10, 11, 28, 29, 30, 31,
        16, 17, 18, 19, 36, 37, 38, 39,
        24, 25, 26, 27, 44, 45, 46, 47,
        32, 33, 34, 35, 52, 53, 54, 55,
        40, 41, 42, 43, 60, 61, 62, 63,
        48, 49, 50, 51, -1, -1, -1, -1,
        65, 66, 67, 68, 69, 70, 71, -1,
        73, 74, 75, 76, 77, 78, 79, -1,
        81, 82, 83, 84, 85, 86, 87, -1,
        89, 90, 91, 92, 93, 94, 95, -1];

    const upLeftArray = [-1, 8, 9, 10, 11, 12, 13, -1,
        -1, 16, 17, 18, 19, 20, -1, -1,
        -1, 24, 25, 26, 27, -1, 15, -1,
        -1, 32, 33, 34, -1, 22, 23, -1,
        -1, 40, 41, -1, 29, 30, 31, -1,
        -1, 48, -1, 67, 37, 38, 39, -1,
        -1, -1, 43, 66, 45, 46, 47, -1,
        -1, 50, 51, 65, 53, 54, 55, -1,
        73, 74, 75, 76, -1, 36, 44, 52,
        81, 82, 83, 84, 85, -1, 69, 70,
        89, 90, 91, 92, 93, 94, -1, 78,
        -1, -1, -1, -1, -1, -1, -1, -1];

    const downRightArray = [-1, -1, -1, -1, -1, -1, -1, -1,
        1, 2, 3, 4, 5, 6, -1, 22,
        9, 10, 11, 12, 13, -1, 29, 30,
        17, 18, 19, 20, -1, 36, 37, 38,
        25, 26, 27, -1, 69, 44, 45, 46,
        33, 34, -1, 50, 70, 52, 53, 54,
        41, -1, 57, 58, 71, 60, 61, 62,
        -1, -1, -1, -1, -1, -1, -1, -1,
        -1, 59, 51, 43, -1, 78, 79, -1,
        -1, 64, 65, 66, 67, -1, 87, -1,
        -1, 72, 73, 74, 75, 76, -1, -1,
        -1, 80, 81, 82, 83, 84, 85, -1];

    const upRightArray = [-1, -1, -1, -1, -1, -1, -1, -1,
        17, -1, 1, 2, 3, 4, 5, 6,
        25, 26, -1, 10, 11, 12, 13, 14,
        33, 34, 35, -1, 19, 20, 21, 22,
        41, 42, 43, 66, -1, 28, 29, 30,
        49, 50, 51, 65, 53, -1, 37, 38,
        57, 58, 59, 64, 61, 62, -1, 46,
        -1, -1, -1, -1, -1, -1, -1, -1,
        -1, 72, 73, -1, 44, 52, 60, -1,
        -1, 80, -1, 68, 69, 70, 71, -1,
        -1, -1, 75, 76, 77, 78, 79, -1,
        -1, 82, 83, 84, 85, 86, 87, -1];

    const downLeftArray = [-1, 10, 11, 12, 13, 14, 15, -1,
        -1, -1, 19, 20, 21, 22, 23, -1,
        -1, 8, -1, 28, 29, 30, 31, -1,
        -1, 16, 17, -1, 37, 38, 39, -1,
        -1, 24, 25, 26, -1, 46, 47, -1,
        -1, 32, 33, 34, 68, -1, 55, -1,
        -1, 40, 41, 42, 69, 44, -1, -1,
        -1, 48, 49, 50, 70, 52, 53, -1,
        51, 43, 35, -1, 75, 76, 77, 78,
        65, 66, -1, 82, 83, 84, 85, 86,
        73, -1, 89, 90, 91, 92, 93, 94,
        -1, -1, -1, -1, -1, -1, -1, -1];

    const aArray = [7, 14, 21, 28];

    const bArray = [56, 49, 42, 35];

    const cArray = [95, 86, 77, 68];

    const dArray = [0, 9, 18, 27];

    const eArray = [63, 54, 45, 36];

    const fArray = [88, 81, 74, 67];

    const abArray = [14, 21, 28, 35, 42, 49, 56];

    const acArray = [14, 21, 28, 68, 77, 86, 95];

    const baArray = [49, 42, 35, 28, 21, 14, 7];

    const bcArray = [49, 42, 35, 68, 77, 86, 95];

    const caArray = [86, 77, 68, 28, 21, 14, 7];

    const cbArray = [86, 77, 68, 35, 42, 49, 56];

    const deArray = [9, 18, 27, 36, 45, 54, 63];

    const dfArray = [9, 18, 27, 67, 74, 81, 88];

    const edArray = [54, 45, 36, 27, 18, 9, 0];

    const efArray = [54, 45, 36, 67, 74, 81, 88];

    const fdArray = [81, 74, 67, 27, 18, 9, 0];

    const feArray = [81, 74, 67, 36, 45, 54, 63];

    const horizontalArray = [0, 0, 0, 0, 0, 0, 0, 0,
        1, 1, 1, 1, 1, 1, 1, 1,
        2, 2, 2, 2, 2, 2, 2, 2,
        3, 3, 3, 3, 3, 3, 3, 3,
        4, 4, 4, 4, 8, 8, 8, 8,
        5, 5, 5, 5, 9, 9, 9, 9,
        6, 6, 6, 6, 10, 10, 10, 10,
        7, 7, 7, 7, 11, 11, 11, 11,
        7, 6, 5, 4, 8, 9, 10, 11,
        7, 6, 5, 4, 8, 9, 10, 11,
        7, 6, 5, 4, 8, 9, 10, 11,
        7, 6, 5, 4, 8, 9, 10, 11];

    const verticalArray = [0, 1, 2, 3, 4, 5, 6, 7,
        0, 1, 2, 3, 4, 5, 6, 7,
        0, 1, 2, 3, 4, 5, 6, 7,
        0, 1, 2, 3, 4, 5, 6, 7,
        0, 1, 2, 3, 4, 5, 6, 7,
        0, 1, 2, 3, 4, 5, 6, 7,
        0, 1, 2, 3, 4, 5, 6, 7,
        0, 1, 2, 3, 4, 5, 6, 7,
        8, 8, 8, 8, 8, 8, 8, 8,
        9, 9, 9, 9, 9, 9, 9, 9,
        10, 10, 10, 10, 10, 10, 10, 10,
        11, 11, 11, 11, 11, 11, 11, 11];

    const diagonalArrayA = [0, 1, 2, 3, 4, 5, 6, 7,
        1, 2, 3, 4, 5, 6, 7, 8,
        2, 3, 4, 5, 6, 7, 8, 9,
        3, 4, 5, 6, 7, 8, 9, 10,
        4, 5, 6, 7, 8, 9, 10, 11,
        5, 6, 7, 15, 9, 10, 11, 12,
        6, 7, 15, 16, 10, 11, 12, 13,
        7, 15, 16, 17, 11, 12, 13, 14,
        18, 17, 16, 15, 7, 8, 9, 10,
        19, 18, 17, 16, 15, 7, 8, 9,
        20, 19, 18, 17, 16, 15, 7, 8,
        21, 20, 19, 18, 17, 16, 15, 7];

    const diagonalArrayB = [7, 8, 9, 10, 11, 12, 13, 14,
        6, 7, 8, 9, 10, 11, 12, 13,
        5, 6, 7, 8, 9, 10, 11, 12,
        4, 5, 6, 7, 8, 9, 10, 11,
        3, 4, 5, 6, 7, 8, 9, 10,
        2, 3, 4, 5, 15, 7, 8, 9,
        1, 2, 3, 4, 16, 15, 7, 8,
        0, 1, 2, 3, 17, 16, 15, 7,
        4, 5, 6, 7, 15, 16, 17, 18,
        5, 6, 7, 15, 16, 17, 18, 19,
        6, 7, 15, 16, 17, 18, 19, 20,
        7, 15, 16, 17, 18, 19, 20, 21];

    const whitePieces = (piece) => {
        return piece == '♙' || piece == '♖' || piece == '♘' || piece == '♗' || piece == '♕';
    }

    const blackPieces = (piece) => {
        return piece == '♟' || piece == '♜' || piece == '♞' || piece == '♝' || piece == '♛';
    }

    const bichromePieces = (piece) => {
        return piece == '🨅' || piece == '🨂' || piece == '🨄' || piece == '🨃' || piece == '🨁';
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

    const checkForDistanceCheck = (index, array, small1, small2, queen1, queen2, king) => {
        for (let i = array[index]; i > -1; i = array[i]) {
            if (values[i] != '') {
                if (values[i] == small1 || values[i] == queen1 || values[i] == small2 || values[i] == queen2) {
                    return true;
                } else if (values[i] == king && i == array[index]) {
                    continue;
                }
                break;
            }
        }
        return false;
    }

    const checkForRookCheck = (index, small1, small2, queen1, queen2, king) => {
        if (checkForDistanceCheck(index, upArray, small1, small2, queen1, queen2, king) ||
            checkForDistanceCheck(index, downArray, small1, small2, queen1, queen2, king) ||
            checkForDistanceCheck(index, leftArray, small1, small2, queen1, queen2, king) ||
            checkForDistanceCheck(index, rightArray, small1, small2, queen1, queen2, king)) {
            return true;
        }
    }

    const checkForBishopThreeWay = (index, array1, array2, small1, small2, queen1, queen2, king) => {
        for (let i = index++; i < 7; i++) {
            if (values[array1[i]] != '') {
                if (values[array1[i]] == small1 || values[array1[i]] == queen1 || values[array1[i]] == small2 || values[array1[i]] == queen2) {
                    return true;
                } else if (values[array1[i]] == king && i == index + 1) {
                    continue;
                }
                break;
            }
        }
        for (let i = index--; i > -1; i--) {
            if (values[array1[i]] != '') {
                if (values[array1[i]] == small1 || values[array1[i]] == queen1 || values[array1[i]] == small2 || values[array1[i]] == queen2) {
                    return true;
                } else if (values[array1[i]] == king && i == index - 1) {
                    continue;
                }
                break;
            }
        }
        for (let i = index++; i < 7; i++) {
            if (values[array2[i]] != '') {
                if (values[array2[i]] == small1 || values[array2[i]] == queen1 || values[array2[i]] == small2 || values[array2[i]] == queen2) {
                    return true;
                } else if (values[array2[i]] == king && i == index + 1) {
                    continue;
                }
                break;
            }
        }
        for (let i = index--; i > -1; i--) {
            if (values[array2[i]] != '') {
                if (values[array2[i]] == small1 || values[array2[i]] == queen1 || values[array2[i]] == small2 || values[array2[i]] == queen2) {
                    return true;
                } else if (values[array2[i]] == king && i == index - 1) {
                    continue;
                }
                break;
            }
        }
        return false;
    }

    const checkForBishopCheck = (index, small1, small2, queen1, queen2, king) => {
        var aaa = aArray.findIndex(value => value == index);
        var bbb = bArray.findIndex(value => value == index);
        var ccc = cArray.findIndex(value => value == index);
        var ddd = dArray.findIndex(value => value == index);
        var eee = eArray.findIndex(value => value == index);
        var fff = fArray.findIndex(value => value == index);
        if (aaa == -1 && bbb == -1 && ccc == -1) {
            if (checkForDistanceCheck(index, upLeftArray, small1, small2, queen1, queen2, king) ||
                checkForDistanceCheck(index, downRightArray, small1, small2, queen1, queen2, king)) {
                return true;
            }
        } else if (aaa != -1) {
            if (checkForBishopThreeWay(index, abArray, acArray, small1, small2, queen1, queen2, king)) {
                return true;
            }
        } else if (bbb != -1) {
            if (checkForBishopThreeWay(index, baArray, bcArray, small1, small2, queen1, queen2, king)) {
                return true;
            }
        } else if (ccc != -1) {
            if (checkForBishopThreeWay(index, caArray, cbArray, small1, small2, queen1, queen2, king)) {
                return true;
            }
        }
        if (ddd == -1 && eee == -1 && fff == -1) {
            if (checkForDistanceCheck(index, upRightArray, small1, small2, queen1, queen2, king) ||
                checkForDistanceCheck(index, downLeftArray, small1, small2, queen1, queen2, king)) {
                return true;
            }
        } else if (ddd != -1) {
            if (checkForBishopThreeWay(index, deArray, dfArray, small1, small2, queen1, queen2, king)) {
                return true;
            }
        } else if (eee != -1) {
            if (checkForBishopThreeWay(index, edArray, efArray, small1, small2, queen1, queen2, king)) {
                return true;
            }
        } else if (fff != -1) {
            if (checkForBishopThreeWay(index, fdArray, feArray, small1, small2, queen1, queen2, king)) {
                return true;
            }
        }
        return false;
    }

    const arrayModifier = (id, newVal) => {
        setValues(values => values.map((value, index) => (index == id ? newVal : value)));
    }

    const playerModifier = (func) => {
        (firstOut == '') ? ((player == 'White') ? func('Black') : ((player == 'Black') ? func('Bichrome') : func('White'))) :
            ((firstOut == 'White') ? ((player == 'Black') ? func('Bichrome') : func('Black')) :
                ((firstOut == 'Black' ? ((player == 'White') ? func('Bichrome') : func('White')) :
                    ((player == 'White') ? func('Black') : func('White')))));
    }

    const reset = () => {
        setValues(initArray);
        setPlayer('White');
        setWin('');
        setSelected({ id: -1, value: false, piece: '', blockedArray: [], moved: [false, false, false, false, false, false, false, false, false], passant: -1 });
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
        if (checkForRookCheck(index, '♜', '🨂', '♛', '🨁', '♔')) {
            return true;
        }
        if (checkForBishopCheck(index, '♝', '🨃', '♛', '🨁', '♔')) {
            return true;
        }
        if (values[upArray[index]] == '♚' || values[upArray[index]] == '🨀') {
            return true;
        }
        if (values[downArray[index]] == '♚' || values[downArray[index]] == '🨀') {
            return true;
        }
        if (values[leftArray[index]] == '♚' || values[leftArray[index]] == '🨀') {
            return true;
        }
        if (values[rightArray[index]] == '♚' || values[rightArray[index]] == '🨀') {
            return true;
        }
        if (values[downArray[leftArray[index]]] == '♚' || values[downArray[leftArray[index]]] == '🨀') {
            return true;
        }
        if (values[downArray[rightArray[index]]] == '♚' || values[downArray[rightArray[index]]] == '🨀') {
            return true;
        }
        if (values[upArray[leftArray[index]]] == '♚' || values[upArray[leftArray[index]]] == '🨀' || values[upArray[leftArray[index]]] == '♟') {
            return true;
        }
        if (values[upArray[rightArray[index]]] == '♚' || values[upArray[rightArray[index]]] == '🨀' || values[upArray[rightArray[index]]] == '♟') {
            return true;
        }
        if (values[upAltArray[leftArray[index]]] == '🨅') {
            return true;
        }
        if (values[upAltArray[rightArray[index]]] == '🨅') {
            return true;
        }
        if (values[upArray[leftArray[leftArray[index]]]] == '♞' || values[upArray[leftArray[leftArray[index]]]] == '🨄') {
            return true;
        }
        if (values[downArray[leftArray[leftArray[index]]]] == '♞' || values[downArray[leftArray[leftArray[index]]]] == '🨄') {
            return true;
        }
        if (values[upArray[upArray[leftArray[index]]]] == '♞' || values[upArray[upArray[leftArray[index]]]] == '🨄') {
            return true;
        }
        if (values[downArray[downArray[leftArray[index]]]] == '♞' || values[downArray[downArray[leftArray[index]]]] == '🨄') {
            return true;
        }
        if (values[upArray[rightArray[rightArray[index]]]] == '♞' || values[upArray[rightArray[rightArray[index]]]] == '🨄') {
            return true;
        }
        if (values[downArray[rightArray[rightArray[index]]]] == '♞' || values[downArray[rightArray[rightArray[index]]]] == '🨄') {
            return true;
        }
        if (values[upArray[upArray[rightArray[index]]]] == '♞' || values[upArray[upArray[rightArray[index]]]] == '🨄') {
            return true;
        }
        if (values[downArray[downArray[rightArray[index]]]] == '♞' || values[downArray[downArray[rightArray[index]]]] == '🨄') {
            return true;
        }
        return false;
    }

    const checkForCheckBlack = (index) => {
        if (checkForRookCheck(index, '♖', '🨂', '♕', '🨁', '♚')) {
            return true;
        }
        if (checkForBishopCheck(index, '♗', '🨃', '♕', '🨁', '♚')) {
            return true;
        }
        if (values[upArray[index]] == '♔' || values[upArray[index]] == '🨀') {
            return true;
        }
        if (values[downArray[index]] == '♔' || values[downArray[index]] == '🨀') {
            return true;
        }
        if (values[leftArray[index]] == '♔' || values[leftArray[index]] == '🨀') {
            return true;
        }
        if (values[rightArray[index]] == '♔' || values[rightArray[index]] == '🨀') {
            return true;
        }
        if (values[upArray[leftArray[index]]] == '♔' || values[upArray[leftArray[index]]] == '🨀') {
            return true;
        }
        if (values[upArray[rightArray[index]]] == '♔' || values[upArray[rightArray[index]]] == '🨀') {
            return true;
        }
        if (values[downArray[leftArray[index]]] == '♔' || values[downArray[leftArray[index]]] == '🨀' || values[downArray[leftArray[index]]] == '♙') {
            return true;
        }
        if (values[downArray[rightArray[index]]] == '♔' || values[downArray[rightArray[index]]] == '🨀' || values[downArray[rightArray[index]]] == '♙') {
            return true;
        }
        if (values[upAltArray[leftArray[index]]] == '🨅') {
            return true;
        }
        if (values[upAltArray[rightArray[index]]] == '🨅') {
            return true;
        }
        if (values[upArray[leftArray[leftArray[index]]]] == '♘' || values[upArray[leftArray[leftArray[index]]]] == '🨄') {
            return true;
        }
        if (values[downArray[leftArray[leftArray[index]]]] == '♘' || values[downArray[leftArray[leftArray[index]]]] == '🨄') {
            return true;
        }
        if (values[upArray[upArray[leftArray[index]]]] == '♘' || values[upArray[upArray[leftArray[index]]]] == '🨄') {
            return true;
        }
        if (values[downArray[downArray[leftArray[index]]]] == '♘' || values[downArray[downArray[leftArray[index]]]] == '🨄') {
            return true;
        }
        if (values[upArray[rightArray[rightArray[index]]]] == '♘' || values[upArray[rightArray[rightArray[index]]]] == '🨄') {
            return true;
        }
        if (values[downArray[rightArray[rightArray[index]]]] == '♘' || values[downArray[rightArray[rightArray[index]]]] == '🨄') {
            return true;
        }
        if (values[upArray[upArray[rightArray[index]]]] == '♘' || values[upArray[upArray[rightArray[index]]]] == '🨄') {
            return true;
        }
        if (values[downArray[downArray[rightArray[index]]]] == '♘' || values[downArray[downArray[rightArray[index]]]] == '🨄') {
            return true;
        }
        return false;
    }

    const checkForCheckBichrome = (index) => {
        if (checkForRookCheck(index, '♖', '♜', '♕', '♛', '🨀')) {
            return true;
        }
        if (checkForBishopCheck(index, '♗', '♝', '♕', '♛', '🨀')) {
            return true;
        }
        if (values[upArray[index]] == '♔' || values[upArray[index]] == '♚') {
            return true;
        }
        if (values[downArray[index]] == '♔' || values[downArray[index]] == '♚') {
            return true;
        }
        if (values[leftArray[index]] == '♔' || values[leftArray[index]] == '♚') {
            return true;
        }
        if (values[rightArray[index]] == '♔' || values[rightArray[index]] == '♚') {
            return true;
        }
        if (values[upArray[leftArray[index]]] == '♔' || values[upArray[leftArray[index]]] == '♚') {
            return true;
        }
        if (values[upArray[rightArray[index]]] == '♔' || values[upArray[rightArray[index]]] == '♚') {
            return true;
        }
        if (values[downArray[leftArray[index]]] == '♔' || values[downArray[leftArray[index]]] == '♚' || values[downArray[leftArray[index]]] == '♙' || values[downArray[leftArray[index]]] == '♟') {
            return true;
        }
        if (values[downArray[rightArray[index]]] == '♔' || values[downArray[rightArray[index]]] == '♚' || values[downArray[rightArray[index]]] == '♙' || values[downArray[rightArray[index]]] == '♟') {
            return true;
        }
        if (values[upArray[leftArray[leftArray[index]]]] == '♘' || values[upArray[leftArray[leftArray[index]]]] == '♞') {
            return true;
        }
        if (values[downArray[leftArray[leftArray[index]]]] == '♘' || values[downArray[leftArray[leftArray[index]]]] == '♞') {
            return true;
        }
        if (values[upArray[upArray[leftArray[index]]]] == '♘' || values[upArray[upArray[leftArray[index]]]] == '♞') {
            return true;
        }
        if (values[downArray[downArray[leftArray[index]]]] == '♘' || values[downArray[downArray[leftArray[index]]]] == '♞') {
            return true;
        }
        if (values[upArray[rightArray[rightArray[index]]]] == '♘' || values[upArray[rightArray[rightArray[index]]]] == '♞') {
            return true;
        }
        if (values[downArray[rightArray[rightArray[index]]]] == '♘' || values[downArray[rightArray[rightArray[index]]]] == '♞') {
            return true;
        }
        if (values[upArray[upArray[rightArray[index]]]] == '♘' || values[upArray[upArray[rightArray[index]]]] == '♞') {
            return true;
        }
        if (values[downArray[downArray[rightArray[index]]]] == '♘' || values[downArray[downArray[rightArray[index]]]] == '♞') {
            return true;
        }
        return false;
    }

    const checkForDiscoverCheckBase = (index, direction, array, discArray, small1, small2, queen1, queen2) => {
        var disc = -1;
        for (let i = array[index]; i > -1; i = array[i]) {
            if (values[i] != '') {
                if (whitePieces(values[i])) {
                    if (disc == -1) {
                        disc = i;
                    }
                    break;
                } else if (disc > -1) {
                    if (values[i] == small1 || values[i] == queen1 || values[i] == small2 || values[i] == queen2) {
                        discArray.push({ direction: direction, piece: disc });
                        break;
                    }
                    break;
                }
                break;
            }
        }
    }

    const checkForDiscoverThreeWay = (index, direction, array1, array2, small1, small2, queen1, queen2, king) => {
        for (let i = index++; i < 7; i++) {
            if (values[array1[i]] != '') {
                if (whitePieces(values[array1[i]])) {
                    if (disc == -1) {
                        disc = i;
                    }
                    break;
                } else if (disc > -1) {
                    if (values[array1[i]] == small1 || values[array1[i]] == queen1 || values[array1[i]] == small2 || values[array1[i]] == queen2) {
                        discArray.push({ direction: direction, piece: disc });
                        break;
                    }
                    break;
                }
                break;
            }
        }
        for (let i = index--; i > -1; i--) {
            if (values[array1[i]] != '') {
                if (whitePieces(values[array1[i]])) {
                    if (disc == -1) {
                        disc = i;
                    }
                    break;
                } else if (disc > -1) {
                    if (values[array1[i]] == small1 || values[array1[i]] == queen1 || values[array1[i]] == small2 || values[array1[i]] == queen2) {
                        discArray.push({ direction: direction, piece: disc });
                        break;
                    }
                    break;
                }
                break;
            }
        }
        for (let i = index++; i < 7; i++) {
            if (values[array2[i]] != '') {
                if (whitePieces(values[array2[i]])) {
                    if (disc == -1) {
                        disc = i;
                    }
                    break;
                } else if (disc > -1) {
                    if (values[array2[i]] == small1 || values[array2[i]] == queen1 || values[array2[i]] == small2 || values[array2[i]] == queen2) {
                        discArray.push({ direction: direction, piece: disc });
                        break;
                    }
                    break;
                }
                break;
            }
        }
        for (let i = index--; i > -1; i--) {
            if (values[array2[i]] != '') {
                if (whitePieces(values[array2[i]])) {
                    if (disc == -1) {
                        disc = i;
                    }
                    break;
                } else if (disc > -1) {
                    if (values[array2[i]] == small1 || values[array2[i]] == queen1 || values[array2[i]] == small2 || values[array2[i]] == queen2) {
                        discArray.push({ direction: direction, piece: disc });
                        break;
                    }
                    break;
                }
                break;
            }
        }
        return false;
    }

    const checkForDiscoverCheckWhite = (index) => {
        // check for black rooks, bishops and queens that will check white king if a white piece moves
        var discoverArray = [];
        checkForDiscoverCheckBase(index, 'up', upArray, discoverArray, '♜', '🨂', '♛', '🨁');
        checkForDiscoverCheckBase(index, 'down', downArray, discoverArray, '♜', '🨂', '♛', '🨁');
        checkForDiscoverCheckBase(index, 'left', leftArray, discoverArray, '♜', '🨂', '♛', '🨁');
        checkForDiscoverCheckBase(index, 'right', rightArray, discoverArray, '♜', '🨂', '♛', '🨁');
        var aaa = aArray.findIndex(value => value == index);
        var bbb = bArray.findIndex(value => value == index);
        var ccc = cArray.findIndex(value => value == index);
        var ddd = dArray.findIndex(value => value == index);
        var eee = eArray.findIndex(value => value == index);
        var fff = fArray.findIndex(value => value == index);
        if (aaa == -1 && bbb == -1 && ccc == -1) {
            checkForDiscoverCheckBase(index, 'up-left', upLeftArray, discoverArray, '♝', '🨃', '♛', '🨁');
            checkForDiscoverCheckBase(index, 'down-right', downRightArray, discoverArray, '♝', '🨃', '♛', '🨁');
        } else if (aaa != -1) {
            checkForDiscoverThreeWay(index, 'a', abArray, acArray, '♝', '🨃', '♛', '🨁');
        } else if (bbb != -1) {
            checkForDiscoverThreeWay(index, 'b', baArray, bcArray, '♝', '🨃', '♛', '🨁');
        } else if (ccc != -1) {
            checkForDiscoverThreeWay(index, 'c', caArray, cbArray, '♝', '🨃', '♛', '🨁');
        }
        if (ddd == -1 && eee == -1 && fff == -1) {
            checkForDiscoverCheckBase(index, 'up-right', upRightArray, discoverArray, '♝', '🨃', '♛', '🨁');
            checkForDiscoverCheckBase(index, 'down-left', downLeftArray, discoverArray, '♝', '🨃', '♛', '🨁');
        } else if (ddd != -1) {
            checkForDiscoverThreeWay(index, 'd', deArray, dfArray, '♝', '🨃', '♛', '🨁');
        } else if (eee != -1) {
            checkForDiscoverThreeWay(index, 'e', edArray, efArray, '♝', '🨃', '♛', '🨁');
        } else if (fff != -1) {
            checkForDiscoverThreeWay(index, 'f', fdArray, feArray, '♝', '🨃', '♛', '🨁');
        }
        return discoverArray;
    }

    const checkForDiscoverCheckBlack = (index) => {
        // check for white rooks, bishops and queens that will check black king if a black piece moves
        var discoverArray = [];
        checkForDiscoverCheckBase(index, 'up', upArray, discoverArray, '♖', '🨂', '♕', '🨁');
        checkForDiscoverCheckBase(index, 'down', downArray, discoverArray, '♖', '🨂', '♕', '🨁');
        checkForDiscoverCheckBase(index, 'left', leftArray, discoverArray, '♖', '🨂', '♕', '🨁');
        checkForDiscoverCheckBase(index, 'right', rightArray, discoverArray, '♖', '🨂', '♕', '🨁');
        var aaa = aArray.findIndex(value => value == index);
        var bbb = bArray.findIndex(value => value == index);
        var ccc = cArray.findIndex(value => value == index);
        var ddd = dArray.findIndex(value => value == index);
        var eee = eArray.findIndex(value => value == index);
        var fff = fArray.findIndex(value => value == index);
        if (aaa == -1 && bbb == -1 && ccc == -1) {
            checkForDiscoverCheckBase(index, 'up-left', upLeftArray, discoverArray, '♗', '🨃', '♕', '🨁');
            checkForDiscoverCheckBase(index, 'down-right', downRightArray, discoverArray, '♗', '🨃', '♕', '🨁');
        } else if (aaa != -1) {
            checkForDiscoverThreeWay(index, 'a', abArray, acArray, '♗', '🨃', '♕', '🨁');
        } else if (bbb != -1) {
            checkForDiscoverThreeWay(index, 'b', baArray, bcArray, '♗', '🨃', '♕', '🨁');
        } else if (ccc != -1) {
            checkForDiscoverThreeWay(index, 'c', caArray, cbArray, '♗', '🨃', '♕', '🨁');
        }
        if (ddd == -1 && eee == -1 && fff == -1) {
            checkForDiscoverCheckBase(index, 'up-right', upRightArray, discoverArray, '♗', '🨃', '♕', '🨁');
            checkForDiscoverCheckBase(index, 'down-left', downLeftArray, discoverArray, '♗', '🨃', '♕', '🨁');
        } else if (ddd != -1) {
            checkForDiscoverThreeWay(index, 'd', deArray, dfArray, '♗', '🨃', '♕', '🨁');
        } else if (eee != -1) {
            checkForDiscoverThreeWay(index, 'e', edArray, efArray, '♗', '🨃', '♕', '🨁');
        } else if (fff != -1) {
            checkForDiscoverThreeWay(index, 'f', fdArray, feArray, '♗', '🨃', '♕', '🨁');
        }
        return discoverArray;
    }

    const checkForDiscoverCheckBichrome = (index) => {
        // check for white rooks, bishops and queens that will check black king if a black piece moves
        var discoverArray = [];
        checkForDiscoverCheckBase(index, 'up', upArray, discoverArray, '♖', '♜', '♕', '♛');
        checkForDiscoverCheckBase(index, 'down', downArray, discoverArray, '♖', '♜', '♕', '♛');
        checkForDiscoverCheckBase(index, 'left', leftArray, discoverArray, '♖', '♜', '♕', '♛');
        checkForDiscoverCheckBase(index, 'right', rightArray, discoverArray, '♖', '♜', '♕', '♛');
        var aaa = aArray.findIndex(value => value == index);
        var bbb = bArray.findIndex(value => value == index);
        var ccc = cArray.findIndex(value => value == index);
        var ddd = dArray.findIndex(value => value == index);
        var eee = eArray.findIndex(value => value == index);
        var fff = fArray.findIndex(value => value == index);
        if (aaa == -1 && bbb == -1 && ccc == -1) {
            checkForDiscoverCheckBase(index, 'up-left', upLeftArray, discoverArray, '♗', '♝', '♕', '♛');
            checkForDiscoverCheckBase(index, 'down-right', downRightArray, discoverArray, '♗', '♝', '♕', '♛');
        } else if (aaa != -1) {
            checkForDiscoverThreeWay(index, 'a', abArray, acArray, '♗', '♝', '♕', '♛');
        } else if (bbb != -1) {
            checkForDiscoverThreeWay(index, 'b', baArray, bcArray, '♗', '♝', '♕', '♛');
        } else if (ccc != -1) {
            checkForDiscoverThreeWay(index, 'c', caArray, cbArray, '♗', '♝', '♕', '♛');
        }
        if (ddd == -1 && eee == -1 && fff == -1) {
            checkForDiscoverCheckBase(index, 'up-right', upRightArray, discoverArray, '♗', '♝', '♕', '♛');
            checkForDiscoverCheckBase(index, 'down-left', downLeftArray, discoverArray, '♗', '♝', '♕', '♛');
        } else if (ddd != -1) {
            checkForDiscoverThreeWay(index, 'd', deArray, dfArray, '♗', '♝', '♕', '♛');
        } else if (eee != -1) {
            checkForDiscoverThreeWay(index, 'e', edArray, efArray, '♗', '♝', '♕', '♛');
        } else if (fff != -1) {
            checkForDiscoverThreeWay(index, 'f', fdArray, feArray, '♗', '♝', '♕', '♛');
        }
        return discoverArray;
    }

    const checkForDistanceCheckOutput = (index, array, outArray, small1, small2, queen1, queen2) => {
        for (let i = array[index]; i > -1; i = array[i]) {
            if (values[i] != '') {
                if (values[i] == small1 || values[i] == queen1 || values[i] == small2 || values[i] == queen2) {
                    outArray.push({ index: i, piece: values[i] });
                    break;
                }
                break;
            }
        }
    }

    const checkForRookCheckOutput = (index, array, small1, small2, queen1, queen2) => {
        checkForDistanceCheckOutput(index, upArray, array, small1, small2, queen1, queen2);
        checkForDistanceCheckOutput(index, downArray, array, small1, small2, queen1, queen2);
        checkForDistanceCheckOutput(index, leftArray, array, small1, small2, queen1, queen2);
        checkForDistanceCheckOutput(index, rightArray, array, small1, small2, queen1, queen2);
    }

    const checkForBishopThreeWayOutput = (index, array1, array2, outArray, small1, small2, queen1, queen2) => {
        for (let i = index++; i < 7; i++) {
            if (values[array1[i]] != '') {
                if (values[array1[i]] == small1 || values[array1[i]] == queen1 || values[array1[i]] == small2 || values[array1[i]] == queen2) {
                    outArray.push({ index: array1[i], piece: values[array1[i]] });
                    break;
                }
                break;
            }
        }
        for (let i = index--; i > -1; i--) {
            if (values[array1[i]] != '') {
                if (values[array1[i]] == small1 || values[array1[i]] == queen1 || values[array1[i]] == small2 || values[array1[i]] == queen2) {
                    outArray.push({ index: array1[i], piece: values[array1[i]] });
                    break;
                }
                break;
            }
        }
        for (let i = index++; i < 7; i++) {
            if (values[array2[i]] != '') {
                if (values[array2[i]] == small1 || values[array2[i]] == queen1 || values[array2[i]] == small2 || values[array2[i]] == queen2) {
                    outArray.push({ index: array2[i], piece: values[array2[i]] });
                    break;
                }
                break;
            }
        }
        for (let i = index--; i > -1; i--) {
            if (values[array2[i]] != '') {
                if (values[array2[i]] == small1 || values[array2[i]] == queen1 || values[array2[i]] == small2 || values[array2[i]] == queen2) {
                    outArray.push({ index: array2[i], piece: values[array2[i]] });
                    break;
                }
                break;
            }
        }
    }

    const checkForBishopCheckOutput = (index, array, small1, small2, queen1, queen2) => {
        var aaa = aArray.findIndex(value => value == index);
        var bbb = bArray.findIndex(value => value == index);
        var ccc = cArray.findIndex(value => value == index);
        var ddd = dArray.findIndex(value => value == index);
        var eee = eArray.findIndex(value => value == index);
        var fff = fArray.findIndex(value => value == index);
        if (aaa == -1 && bbb == -1 && ccc == -1) {
            checkForDistanceCheckOutput(index, upLeftArray, array, small1, small2, queen1, queen2);
            checkForDistanceCheckOutput(index, downRightArray, array, small1, small2, queen1, queen2);
        } else if (aaa != -1) {
            checkForBishopThreeWayOutput(index, abArray, acArray, array, small1, small2, queen1, queen2);
        } else if (bbb != -1) {
            checkForBishopThreeWayOutput(index, baArray, bcArray, array, small1, small2, queen1, queen2);
        } else if (ccc != -1) {
            checkForBishopThreeWayOutput(index, caArray, cbArray, array, small1, small2, queen1, queen2);
        }
        if (ddd == -1 && eee == -1 && fff == -1) {
            checkForDistanceCheckOutput(index, upRightArray, array, small1, small2, queen1, queen2);
            checkForDistanceCheckOutput(index, downLeftArray, array, small1, small2, queen1, queen2);
        } else if (ddd != -1) {
            checkForBishopThreeWayOutput(index, deArray, dfArray, array, small1, small2, queen1, queen2);
        } else if (eee != -1) {
            checkForBishopThreeWayOutput(index, edArray, efArray, array, small1, small2, queen1, queen2);
        } else if (fff != -1) {
            checkForBishopThreeWayOutput(index, fdArray, feArray, array, small1, small2, queen1, queen2);
        }
    }

    const checkArray = (index, colour) => {
        var checkArray = [];
        if (colour == 'Black') {
            checkForRookCheckOutput(index, checkArray, '♖', '🨂', '♕', '🨁');
            checkForBishopCheckOutput(index, checkArray, '♗', '🨃', '♕', '🨁');
            if (values[downArray[leftArray[index]]] == '♙') {
                checkArray.push({ index: downArray[leftArray[index]], piece: '♙' });
            }
            if (values[downArray[rightArray[index]]] == '♙') {
                checkArray.push({ index: downArray[rightArray[index]], piece: '♙' });
            }
            if (values[upAltArray[leftArray[index]]] == '🨅') {
                checkArray.push({ index: upAltArray[leftArray[index]], piece: '🨅' });
            }
            if (values[upAltArray[rightArray[index]]] == '🨅') {
                checkArray.push({ index: upAltArray[rightArray[index]], piece: '🨅' });
            }
            if (values[upArray[leftArray[leftArray[index]]]] == '♘' || values[upArray[leftArray[leftArray[index]]]] == '🨄') {
                checkArray.push({ index: upArray[leftArray[leftArray[index]]], piece: values[upArray[leftArray[leftArray[index]]]] });
            }
            if (values[downArray[leftArray[leftArray[index]]]] == '♘' || values[downArray[leftArray[leftArray[index]]]] == '🨄') {
                checkArray.push({ index: downArray[leftArray[leftArray[index]]], piece: values[downArray[leftArray[leftArray[index]]]] });
            }
            if (values[upArray[upArray[leftArray[index]]]] == '♘' || values[upArray[upArray[leftArray[index]]]] == '🨄') {
                checkArray.push({ index: upArray[upArray[leftArray[index]]], piece: values[upArray[upArray[leftArray[index]]]] });
            }
            if (values[downArray[downArray[leftArray[index]]]] == '♘' || values[downArray[downArray[leftArray[index]]]] == '🨄') {
                checkArray.push({ index: downArray[downArray[leftArray[index]]], piece: values[downArray[downArray[leftArray[index]]]] });
            }
            if (values[upArray[rightArray[rightArray[index]]]] == '♘' || values[upArray[rightArray[rightArray[index]]]] == '🨄') {
                checkArray.push({ index: upArray[rightArray[rightArray[index]]], piece: values[upArray[rightArray[rightArray[index]]]] });
            }
            if (values[downArray[rightArray[rightArray[index]]]] == '♘' || values[downArray[rightArray[rightArray[index]]]] == '🨄') {
                checkArray.push({ index: downArray[rightArray[rightArray[index]]], piece: values[downArray[rightArray[rightArray[index]]]] });
            }
            if (values[upArray[upArray[rightArray[index]]]] == '♘' || values[upArray[upArray[rightArray[index]]]] == '🨄') {
                checkArray.push({ index: upArray[upArray[rightArray[index]]], piece: values[upArray[upArray[rightArray[index]]]] });
            }
            if (values[downArray[downArray[rightArray[index]]]] == '♘' || values[downArray[downArray[rightArray[index]]]] == '🨄') {
                checkArray.push({ index: downArray[downArray[rightArray[index]]], piece: values[downArray[downArray[rightArray[index]]]] });
            }
        } else if (colour == 'White') {
            checkForRookCheckOutput(index, checkArray, '♜', '🨂', '♛', '🨁');
            checkForBishopCheckOutput(index, checkArray, '♝', '🨃', '♛', '🨁');
            if (values[upArray[leftArray[index]]] == '♟') {
                checkArray.push({ index: upArray[leftArray[index]], piece: '♟' });
            }
            if (values[upArray[rightArray[index]]] == '♟') {
                checkArray.push({ index: upArray[rightArray[index]], piece: '♟' });
            }
            if (values[upAltArray[leftArray[index]]] == '🨅') {
                checkArray.push({ index: upAltArray[leftArray[index]], piece: '🨅' });
            }
            if (values[upAltArray[rightArray[index]]] == '🨅') {
                checkArray.push({ index: upAltArray[rightArray[index]], piece: '🨅' });
            }
            if (values[upArray[leftArray[leftArray[index]]]] == '♞' || values[upArray[leftArray[leftArray[index]]]] == '🨄') {
                checkArray.push({ index: upArray[leftArray[leftArray[index]]], piece: values[upArray[leftArray[leftArray[index]]]] });
            }
            if (values[downArray[leftArray[leftArray[index]]]] == '♞' || values[downArray[leftArray[leftArray[index]]]] == '🨄') {
                checkArray.push({ index: downArray[leftArray[leftArray[index]]], piece: values[downArray[leftArray[leftArray[index]]]] });
            }
            if (values[upArray[upArray[leftArray[index]]]] == '♞' || values[upArray[upArray[leftArray[index]]]] == '🨄') {
                checkArray.push({ index: upArray[upArray[leftArray[index]]], piece: values[upArray[upArray[leftArray[index]]]] });
            }
            if (values[downArray[downArray[leftArray[index]]]] == '♞' || values[downArray[downArray[leftArray[index]]]] == '🨄') {
                checkArray.push({ index: downArray[downArray[leftArray[index]]], piece: values[downArray[downArray[leftArray[index]]]] });
            }
            if (values[upArray[rightArray[rightArray[index]]]] == '♞' || values[upArray[rightArray[rightArray[index]]]] == '🨄') {
                checkArray.push({ index: upArray[rightArray[rightArray[index]]], piece: values[upArray[rightArray[rightArray[index]]]] });
            }
            if (values[downArray[rightArray[rightArray[index]]]] == '♞' || values[downArray[rightArray[rightArray[index]]]] == '🨄') {
                checkArray.push({ index: downArray[rightArray[rightArray[index]]], piece: values[downArray[rightArray[rightArray[index]]]] });
            }
            if (values[upArray[upArray[rightArray[index]]]] == '♞' || values[upArray[upArray[rightArray[index]]]] == '🨄') {
                checkArray.push({ index: upArray[upArray[rightArray[index]]], piece: values[upArray[upArray[rightArray[index]]]] });
            }
            if (values[downArray[downArray[rightArray[index]]]] == '♞' || values[downArray[downArray[rightArray[index]]]] == '🨄') {
                checkArray.push({ index: downArray[downArray[rightArray[index]]], piece: values[downArray[downArray[rightArray[index]]]] });
            }
        } else if (colour == 'Bichrome') {
            checkForRookCheckOutput(index, checkArray, '♖', '♜', '♕', '♛');
            checkForBishopCheckOutput(index, checkArray, '♗', '♝', '♕', '♛');
            if (values[downArray[leftArray[index]]] == '♙' || values[downArray[leftArray[index]]] == '♟') {
                checkArray.push({ index: upArray[leftArray[index]], piece: values[downArray[leftArray[index]]] });
            }
            if (values[downArray[rightArray[index]]] == '♙' || values[downArray[rightArray[index]]] == '♟') {
                checkArray.push({ index: upArray[rightArray[index]], piece: values[downArray[rightArray[index]]] });
            }
            if (values[upArray[leftArray[leftArray[index]]]] == '♘' || values[upArray[leftArray[leftArray[index]]]] == '♞') {
                checkArray.push({ index: upArray[leftArray[leftArray[index]]], piece: values[upArray[leftArray[leftArray[index]]]] });
            }
            if (values[downArray[leftArray[leftArray[index]]]] == '♘' || values[downArray[leftArray[leftArray[index]]]] == '♞') {
                checkArray.push({ index: downArray[leftArray[leftArray[index]]], piece: values[downArray[leftArray[leftArray[index]]]] });
            }
            if (values[upArray[upArray[leftArray[index]]]] == '♘' || values[upArray[upArray[leftArray[index]]]] == '♞') {
                checkArray.push({ index: upArray[upArray[leftArray[index]]], piece: values[upArray[upArray[leftArray[index]]]] });
            }
            if (values[downArray[downArray[leftArray[index]]]] == '♘' || values[downArray[downArray[leftArray[index]]]] == '♞') {
                checkArray.push({ index: downArray[downArray[leftArray[index]]], piece: values[downArray[downArray[leftArray[index]]]] });
            }
            if (values[upArray[rightArray[rightArray[index]]]] == '♘' || values[upArray[rightArray[rightArray[index]]]] == '♞') {
                checkArray.push({ index: upArray[rightArray[rightArray[index]]], piece: values[upArray[rightArray[rightArray[index]]]] });
            }
            if (values[downArray[rightArray[rightArray[index]]]] == '♘' || values[downArray[rightArray[rightArray[index]]]] == '♞') {
                checkArray.push({ index: downArray[rightArray[rightArray[index]]], piece: values[downArray[rightArray[rightArray[index]]]] });
            }
            if (values[upArray[upArray[rightArray[index]]]] == '♘' || values[upArray[upArray[rightArray[index]]]] == '♞') {
                checkArray.push({ index: upArray[upArray[rightArray[index]]], piece: values[upArray[upArray[rightArray[index]]]] });
            }
            if (values[downArray[downArray[rightArray[index]]]] == '♘' || values[downArray[downArray[rightArray[index]]]] == '♞') {
                checkArray.push({ index: downArray[downArray[rightArray[index]]], piece: values[downArray[downArray[rightArray[index]]]] });
            }
        }
        return checkArray;
    }

    const checkForCastle = (kingIndex, rookIndex) => {
        if (kingIndex == 32 && !selected.moved[0]) {
            // black king
            if (rookIndex == 0 && !selected.moved[3]) {
                // left rook
                if (values[24] == '' && values[16] == '' && values[8] == '' && !checkForCheckWhite(32) && !checkForCheckWhite(24) && !checkForCheckWhite(16)) {
                    return true;
                }
            } else if (rookIndex == 56 && !selected.moved[4]) {
                // right rook
                if (values[40] == '' && values[48] == '' && !checkForCheckWhite(32) && !checkForCheckWhite(40) && !checkForCheckWhite(48)) {
                    return true;
                }
            }
        } else if (kingIndex == 92 && !selected.moved[1]) {
            // white king
            if (rookIndex == 88 && !selected.moved[5]) {
                // left rook
                if (values[91] == '' && values[90] == '' && values[89] == '' && !checkForCheckBlack(92) && !checkForCheckBlack(91) && !checkForCheckBlack(90)) {
                    return true;
                }
            } else if (rookIndex == 95 && !selected.moved[6]) {
                // right rook
                if (values[93] == '' && values[94] == '' && !checkForCheckBlack(92) && !checkForCheckBlack(93) && !checkForCheckBlack(94)) {
                    return true;
                }
            }
        } else if (kingIndex == 31 && !selected.moved[2]) {
            // bichrome king
            if (rookIndex == 63 && !selected.moved[7]) {
                // left rook
                if (values[39] == '' && values[47] == '' && values[55] == '' && !checkForCheckBlack(31) && !checkForCheckBlack(39) && !checkForCheckBlack(47)) {
                    return true;
                }
            } else if (rookIndex == 7 && !selected.moved[8]) {
                // right rook
                if (values[23] == '' && values[15] == '' && !checkForCheckBlack(31) && !checkForCheckBlack(23) && !checkForCheckBlack(15)) {
                    return true;
                }
            }
        }
        return false;
    }

    const whiteKingMovement = (array, index) => {
        if (values[upArray[index]] == '' || blackPieces(values[upArray[index]]) || bichromePieces(values[upArray[index]])) {
            if (!checkForCheckWhite(upArray[index])) {
                array.push(upArray[index]);
            }
        }
        if (values[downArray[index]] == '' || blackPieces(values[downArray[index]]) || bichromePieces(values[downArray[index]])) {
            if (!checkForCheckWhite(downArray[index])) {
                array.push(downArray[index]);
            }
        }
        if (values[leftArray[index]] == '' || blackPieces(values[leftArray[index]]) || bichromePieces(values[leftArray[index]])) {
            if (!checkForCheckWhite(leftArray[index])) {
                array.push(leftArray[index]);
            }
        }
        if (values[rightArray[index]] == '' || blackPieces(values[rightArray[index]]) || bichromePieces(values[rightArray[index]])) {
            if (!checkForCheckWhite(rightArray[index])) {
                array.push(rightArray[index]);
            }
        }
        if (values[upArray[leftArray[index]]] == '' || blackPieces(values[upArray[leftArray[index]]]) || bichromePieces(values[upArray[leftArray[index]]])) {
            if (!checkForCheckWhite(upArray[leftArray[index]])) {
                array.push(upArray[leftArray[index]]);
            }
        }
        if (values[downArray[leftArray[index]]] == '' || blackPieces(values[downArray[leftArray[index]]]) || bichromePieces(values[downArray[leftArray[index]]])) {
            if (!checkForCheckWhite(downArray[leftArray[index]])) {
                array.push(downArray[leftArray[index]]);
            }
        }
        if (values[upArray[rightArray[index]]] == '' || blackPieces(values[upArray[rightArray[index]]]) || bichromePieces(values[upArray[rightArray[index]]])) {
            if (!checkForCheckWhite(upArray[rightArray[index]])) {
                array.push(upArray[rightArray[index]]);
            }
        }
        if (values[downArray[rightArray[index]]] == '' || blackPieces(values[downArray[rightArray[index]]]) || bichromePieces(values[downArray[rightArray[index]]])) {
            if (!checkForCheckWhite(downArray[rightArray[index]])) {
                array.push(downArray[rightArray[index]]);
            }
        }
    }

    const blackKingMovement = (array, index) => {
        if (values[upArray[index]] == '' || whitePieces(values[upArray[index]]) || bichromePieces(values[upArray[index]])) {
            if (!checkForCheckBlack(upArray[index])) {
                array.push(upArray[index]);
            }
        }
        if (values[downArray[index]] == '' || whitePieces(values[downArray[index]]) || bichromePieces(values[downArray[index]])) {
            if (!checkForCheckBlack(downArray[index])) {
                array.push(downArray[index]);
            }
        }
        if (values[leftArray[index]] == '' || whitePieces(values[leftArray[index]]) || bichromePieces(values[leftArray[index]])) {
            if (!checkForCheckBlack(leftArray[index])) {
                array.push(leftArray[index]);
            }
        }
        if (values[rightArray[index]] == '' || whitePieces(values[rightArray[index]]) || bichromePieces(values[rightArray[index]])) {
            if (!checkForCheckBlack(rightArray[index])) {
                array.push(rightArray[index]);
            }
        }
        if (values[upArray[leftArray[index]]] == '' || whitePieces(values[upArray[leftArray[index]]]) || bichromePieces(values[upArray[leftArray[index]]])) {
            if (!checkForCheckBlack(upArray[leftArray[index]])) {
                array.push(upArray[leftArray[index]]);
            }
        }
        if (values[downArray[leftArray[index]]] == '' || whitePieces(values[downArray[leftArray[index]]]) || bichromePieces(values[downArray[leftArray[index]]])) {
            if (!checkForCheckBlack(downArray[leftArray[index]])) {
                array.push(downArray[leftArray[index]]);
            }
        }
        if (values[upArray[rightArray[index]]] == '' || whitePieces(values[upArray[rightArray[index]]]) || bichromePieces(values[upArray[rightArray[index]]])) {
            if (!checkForCheckBlack(upArray[rightArray[index]])) {
                array.push(upArray[rightArray[index]]);
            }
        }
        if (values[downArray[rightArray[index]]] == '' || whitePieces(values[downArray[rightArray[index]]]) || bichromePieces(values[downArray[rightArray[index]]])) {
            if (!checkForCheckBlack(downArray[rightArray[index]])) {
                array.push(downArray[rightArray[index]]);
            }
        }
    }

    const bichromeKingMovement = (array, index) => {
        if (values[upArray[index]] == '' || whitePieces(values[upArray[index]]) || blackPieces(values[upArray[index]])) {
            if (!checkForCheckBichrome(upArray[index])) {
                array.push(upArray[index]);
            }
        }
        if (values[downArray[index]] == '' || whitePieces(values[downArray[index]]) || blackPieces(values[downArray[index]])) {
            if (!checkForCheckBichrome(downArray[index])) {
                array.push(downArray[index]);
            }
        }
        if (values[leftArray[index]] == '' || whitePieces(values[leftArray[index]]) || blackPieces(values[leftArray[index]])) {
            if (!checkForCheckBichrome(leftArray[index])) {
                array.push(leftArray[index]);
            }
        }
        if (values[rightArray[index]] == '' || whitePieces(values[rightArray[index]]) || blackPieces(values[rightArray[index]])) {
            if (!checkForCheckBichrome(rightArray[index])) {
                array.push(rightArray[index]);
            }
        }
        if (values[upArray[leftArray[index]]] == '' || whitePieces(values[upArray[leftArray[index]]]) || blackPieces(values[upArray[leftArray[index]]])) {
            if (!checkForCheckBichrome(upArray[leftArray[index]])) {
                array.push(upArray[leftArray[index]]);
            }
        }
        if (values[downArray[leftArray[index]]] == '' || whitePieces(values[downArray[leftArray[index]]]) || blackPieces(values[downArray[leftArray[index]]])) {
            if (!checkForCheckBichrome(downArray[leftArray[index]])) {
                array.push(downArray[leftArray[index]]);
            }
        }
        if (values[upArray[rightArray[index]]] == '' || whitePieces(values[upArray[rightArray[index]]]) || blackPieces(values[upArray[rightArray[index]]])) {
            if (!checkForCheckBichrome(upArray[rightArray[index]])) {
                array.push(upArray[rightArray[index]]);
            }
        }
        if (values[downArray[rightArray[index]]] == '' || whitePieces(values[downArray[rightArray[index]]]) || blackPieces(values[downArray[rightArray[index]]])) {
            if (!checkForCheckBichrome(downArray[rightArray[index]])) {
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
        } else if (player == 'Black') {
            if (values[index] == '♚') {
                var checkIndex = index;
            } else {
                var checkIndex = values.findIndex(value => value == '♚');
            }
            var discoverArray = checkForDiscoverCheckBlack(checkIndex);
        } else {
            if (values[index] == '🨀') {
                var checkIndex = index;
            } else {
                var checkIndex = values.findIndex(value => value == '🨀');
            }
            var discoverArray = checkForDiscoverCheckBichrome(checkIndex);
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
                // Bichrome King Movement
                case '🨀':
                    bichromeKingMovement(moveArray, index);
                    break;
                default:
                    break;
            }
        } else if (checkArr.length == 1) {
            var uncheckArray = [];
            switch (checkArr[0].piece) {
                case '♕':
                case '♛':
                case '🨁':
                    if (horizontalArray[checkArr[0].index] == horizontalArray[checkIndex]) {
                        // same rank
                        if (checkArr[0].index > checkIndex) {
                            for (let i = checkArr[0].index; i > checkIndex; i = leftArray[i]) {
                                uncheckArray.push(i);
                            }
                        } else if (checkArr[0].index < checkIndex) {
                            for (let i = checkArr[0].index; i < checkIndex; i = rightArray[i]) {
                                uncheckArray.push(i);
                            }
                        }
                    } else if (verticalArray[checkArr[0].index] == verticalArray[checkIndex]) {
                        // same file
                        if (checkArr[0].index > checkIndex) {
                            for (let i = checkArr[0].index; i > checkIndex; i = upArray[i]) {
                                uncheckArray.push(i);
                            }
                        } else if (checkArr[0].index < checkIndex) {
                            for (let i = checkArr[0].index; i < checkIndex; i = downArray[i]) {
                                uncheckArray.push(i);
                            }
                        }
                    } else if (diagonalArrayA[checkArr[0].index] == diagonalArrayA[checkIndex]) {
                        if (checkArr[0].index > checkIndex) {
                            for (let i = checkArr[0].index; i > checkIndex; i = upLeftArray[i]) {
                                uncheckArray.push(i);
                            }
                        } else if (checkArr[0].index < checkIndex) {
                            for (let i = checkArr[0].index; i < checkIndex; i = downRightArray[i]) {
                                uncheckArray.push(i);
                            }
                        }
                    } else if (diagonalArrayB[checkArr[0].index] == diagonalArrayB[checkIndex]) {
                        if (checkArr[0].index > checkIndex) {
                            for (let i = checkArr[0].index; i > checkIndex; i = upRightArray[i]) {
                                uncheckArray.push(i);
                            }
                        } else if (checkArr[0].index < checkIndex) {
                            for (let i = checkArr[0].index; i < checkIndex; i = downLeftArray[i]) {
                                uncheckArray.push(i);
                            }
                        }
                    }
                    break;
                case '♗':
                case '♝':
                case '🨃':
                    if (diagonalArrayA[checkArr[0].index] == diagonalArrayA[checkIndex]) {
                        if (checkArr[0].index > checkIndex) {
                            for (let i = checkArr[0].index; i > checkIndex; i = upLeftArray[i]) {
                                uncheckArray.push(i);
                            }
                        } else if (checkArr[0].index < checkIndex) {
                            for (let i = checkArr[0].index; i < checkIndex; i = downRightArray[i]) {
                                uncheckArray.push(i);
                            }
                        }
                    } else if (diagonalArrayB[checkArr[0].index] == diagonalArrayB[checkIndex]) {
                        if (checkArr[0].index > checkIndex) {
                            for (let i = checkArr[0].index; i > checkIndex; i = upRightArray[i]) {
                                uncheckArray.push(i);
                            }
                        } else if (checkArr[0].index < checkIndex) {
                            for (let i = checkArr[0].index; i < checkIndex; i = downLeftArray[i]) {
                                uncheckArray.push(i);
                            }
                        }
                    }
                    break;
                case '♖':
                case '♜':
                case '🨂':
                    if (horizontalArray[checkArr[0].index] == horizontalArray[checkIndex]) {
                        // same rank
                        if (checkArr[0].index > checkIndex) {
                            for (let i = checkArr[0].index; i > checkIndex; i = leftArray[i]) {
                                uncheckArray.push(i);
                            }
                        } else if (checkArr[0].index < checkIndex) {
                            for (let i = checkArr[0].index; i < checkIndex; i = rightArray[i]) {
                                uncheckArray.push(i);
                            }
                        }
                    } else if (verticalArray[checkArr[0].index] == verticalArray[checkIndex]) {
                        // same file
                        if (checkArr[0].index > checkIndex) {
                            for (let i = checkArr[0].index; i > checkIndex; i = upArray[i]) {
                                uncheckArray.push(i);
                            }
                        } else if (checkArr[0].index < checkIndex) {
                            for (let i = checkArr[0].index; i < checkIndex; i = downArray[i]) {
                                uncheckArray.push(i);
                            }
                        }
                    }
                    break;
                case '♘':
                case '♞':
                case '🨄':
                case '♙':
                case '♟':
                case '🨅':
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
                        if (Math.floor(index / 8) == 10 && values[upArray[index]] == '') {
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
                        if (index < 64 && index % 8 == 1 && values[downArray[index]] == '') {
                            if (uncheckArray.some(val => (downArray[downArray[index]] == val)) && values[downArray[downArray[index]]] == '') {
                                moveArray.push(downArray[downArray[index]]);
                            }
                        }
                    }
                    break;
                // Bichrome Pawn Movement
                case '🨅':
                    if ((index > 31 && (discDir == 'up-right' || discDir == 'down-left' || discDir == '')) || (index < 32 && (discDir == 'up-left' || discDir == 'down-right' || discDir == ''))) {
                        if (uncheckArray.some(val => (downAltArray[leftArray[index]] == val)) && values[downAltArray[leftArray[index]]] != '') {
                            moveArray.push(downAltArray[leftArray[index]]);
                        }
                    }
                    if ((index > 31 && (discDir == 'up-left' || discDir == 'down-right' || discDir == '')) || (index < 32 && (discDir == 'up-right' || discDir == 'down-left' || discDir == ''))) {
                        if (uncheckArray.some(val => (downAltArray[rightArray[index]] == val)) && values[downAltArray[rightArray[index]]] != '') {
                            moveArray.push(downAltArray[rightArray[index]]);
                        }
                    }
                    if (discDir == 'up' || discDir == 'down' || discDir == '') {
                        if (uncheckArray.some(val => (downAltArray[index] == val)) && values[downAltArray[index]] == '') {
                            moveArray.push(downAltArray[index]);
                        }
                        if (index < 64 && index % 8 == 6 && values[downAltArray[index]] == '') {
                            if (uncheckArray.some(val => (downAltArray[downAltArray[index]] == val)) && values[downAltArray[downAltArray[index]]] == '') {
                                moveArray.push(downAltArray[downAltArray[index]]);
                            }
                        }
                    }
                    break;
                // Rook Movement
                case '♖':
                case '♜':
                case '🨂':
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
                case '🨄':
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
                case '🨃':
                    if (discDir == 'up-left' || discDir == 'down-right' || discDir == '') {
                        for (let i = upLeftArray[index]; i > -1; i = upLeftArray[i]) {
                            if (uncheckArray.some(val => (i == val))) {
                                moveArray.push(i);
                            } else if (values[i] == '') {
                                continue;
                            } else {
                                break;
                            }
                        }
                        for (let i = downRightArray[index]; i > -1; i = downRightArray[i]) {
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
                        for (let i = upRightArray[index]; i > -1; i = upRightArray[i]) {
                            if (uncheckArray.some(val => (i == val))) {
                                moveArray.push(i);
                            } else if (values[i] == '') {
                                continue;
                            } else {
                                break;
                            }
                        }
                        for (let i = downLeftArray[index]; i > -1; i = downLeftArray[i]) {
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
                case '🨁':
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
                        for (let i = upLeftArray[index]; i > -1; i = upLeftArray[i]) {
                            if (uncheckArray.some(val => (i == val))) {
                                moveArray.push(i);
                            } else if (values[i] == '') {
                                continue;
                            } else {
                                break;
                            }
                        }
                        for (let i = downRightArray[index]; i > -1; i = downRightArray[i]) {
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
                        for (let i = upRightArray[index]; i > -1; i = upRightArray[i]) {
                            if (uncheckArray.some(val => (i == val))) {
                                moveArray.push(i);
                            } else if (values[i] == '') {
                                continue;
                            } else {
                                break;
                            }
                        }
                        for (let i = downLeftArray[index]; i > -1; i = downLeftArray[i]) {
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
                // Bichrome King Movement
                case '🨀':
                    bichromeKingMovement(moveArray, index);
                    break;
                default:
                    break;
            }
        } else {
            switch (values[index]) {
                // White Pawn Movement
                case '♙':
                    if (discDir == 'up-right' || discDir == 'down-left' || discDir == '') {
                        if (blackPieces(values[upArray[rightArray[index]]]) || bichromePieces(values[upArray[rightArray[index]]])) {
                            moveArray.push(upArray[rightArray[index]]);
                        }
                    }
                    if (discDir == 'up-left' || discDir == 'down-right' || discDir == '') {
                        if (blackPieces(values[upArray[leftArray[index]]]) || bichromePieces(values[upArray[leftArray[index]]])) {
                            moveArray.push(upArray[leftArray[index]]);
                        }
                    }
                    if (discDir == 'up' || discDir == 'down' || discDir == '') {
                        if (values[upArray[index]] == '') {
                            moveArray.push(upArray[index]);
                            if (Math.floor(index / 8) == 10 && values[upArray[upArray[index]]] == '') {
                                moveArray.push(upArray[upArray[index]]);
                            }
                        }
                    }
                    break;
                // Black Pawn Movement
                case '♟':
                    if (discDir == 'up-right' || discDir == 'down-left' || discDir == '') {
                        if (whitePieces(values[downArray[leftArray[index]]]) || bichromePieces(values[downArray[leftArray[index]]])) {
                            moveArray.push(downArray[leftArray[index]]);
                        }
                    }
                    if (discDir == 'up-left' || discDir == 'down-right' || discDir == '') {
                        if (whitePieces(values[downArray[rightArray[index]]]) || bichromePieces(values[downArray[rightArray[index]]])) {
                            moveArray.push(downArray[rightArray[index]]);
                        }
                    }
                    if (discDir == 'up' || discDir == 'down' || discDir == '') {
                        if (values[downArray[index]] == '') {
                            moveArray.push(downArray[index]);
                            if (index < 64 && index % 8 == 1 && values[downArray[downArray[index]]] == '') {
                                moveArray.push(downArray[downArray[index]]);
                            }
                        }
                    }
                    break;
                // Bichrome Pawn Movement
                case '🨅':
                    if ((index > 31 && (discDir == 'up-right' || discDir == 'down-left' || discDir == '')) || (index < 32 && (discDir == 'up-left' || discDir == 'down-right' || discDir == ''))) {
                        if (whitePieces(values[downAltArray[leftArray[index]]]) || blackPieces(values[downAltArray[leftArray[index]]])) {
                            moveArray.push(downAltArray[leftArray[index]]);
                        }
                    }
                    if ((index > 31 && (discDir == 'up-left' || discDir == 'down-right' || discDir == '')) || (index < 32 && (discDir == 'up-right' || discDir == 'down-left' || discDir == ''))) {
                        if (whitePieces(values[downAltArray[rightArray[index]]]) || blackPieces(values[downAltArray[rightArray[index]]])) {
                            moveArray.push(downAltArray[rightArray[index]]);
                        }
                    }
                    if (discDir == 'up' || discDir == 'down' || discDir == '') {
                        if (values[downAltArray[index]] == '') {
                            moveArray.push(downAltArray[index]);
                            if (index < 64 && index % 8 == 6 && values[downAltArray[downAltArray[index]]] == '') {
                                moveArray.push(downAltArray[downAltArray[index]]);
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
                                if (blackPieces(values[i]) || bichromePieces(values[i])) {
                                    moveArray.push(i);
                                }
                                break;
                            }
                        }
                        for (let i = downArray[index]; i > -1; i = downArray[i]) {
                            if (values[i] == '') {
                                moveArray.push(i);
                            } else {
                                if (blackPieces(values[i]) || bichromePieces(values[i])) {
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
                                if (blackPieces(values[i]) || bichromePieces(values[i])) {
                                    moveArray.push(i);
                                }
                                break;
                            }
                        }
                        for (let i = rightArray[index]; i > -1; i = rightArray[i]) {
                            if (values[i] == '') {
                                moveArray.push(i);
                            } else {
                                if (blackPieces(values[i]) || bichromePieces(values[i])) {
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
                                if (whitePieces(values[i]) || bichromePieces(values[i])) {
                                    moveArray.push(i);
                                }
                                break;
                            }
                        }
                        for (let i = downArray[index]; i > -1; i = downArray[i]) {
                            if (values[i] == '') {
                                moveArray.push(i);
                            } else {
                                if (whitePieces(values[i]) || bichromePieces(values[i])) {
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
                                if (whitePieces(values[i]) || bichromePieces(values[i])) {
                                    moveArray.push(i);
                                }
                                break;
                            }
                        }
                        for (let i = rightArray[index]; i > -1; i = rightArray[i]) {
                            if (values[i] == '') {
                                moveArray.push(i);
                            } else {
                                if (whitePieces(values[i]) || bichromePieces(values[i])) {
                                    moveArray.push(i);
                                }
                                break;
                            }
                        }
                    }
                    break;
                // Bichrome Rook Movement
                case '🨂':
                    if (discDir == 'up' || discDir == 'down' || discDir == '') {
                        for (let i = upArray[index]; i > -1; i = upArray[i]) {
                            if (values[i] == '') {
                                moveArray.push(i);
                            } else {
                                if (whitePieces(values[i]) || blackPieces(values[i])) {
                                    moveArray.push(i);
                                }
                                break;
                            }
                        }
                        for (let i = downArray[index]; i > -1; i = downArray[i]) {
                            if (values[i] == '') {
                                moveArray.push(i);
                            } else {
                                if (whitePieces(values[i]) || blackPieces(values[i])) {
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
                                if (whitePieces(values[i]) || blackPieces(values[i])) {
                                    moveArray.push(i);
                                }
                                break;
                            }
                        }
                        for (let i = rightArray[index]; i > -1; i = rightArray[i]) {
                            if (values[i] == '') {
                                moveArray.push(i);
                            } else {
                                if (whitePieces(values[i]) || blackPieces(values[i])) {
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
                        if (values[upArray[leftArray[leftArray[index]]]] == '' || blackPieces(values[upArray[leftArray[leftArray[index]]]]) || bichromePieces(values[upArray[leftArray[leftArray[index]]]])) {
                            moveArray.push(upArray[leftArray[leftArray[index]]]);
                        }
                        if (values[downArray[leftArray[leftArray[index]]]] == '' || blackPieces(values[downArray[leftArray[leftArray[index]]]]) || bichromePieces(values[downArray[leftArray[leftArray[index]]]])) {
                            moveArray.push(downArray[leftArray[leftArray[index]]]);
                        }
                        if (values[upArray[upArray[leftArray[index]]]] == '' || blackPieces(values[upArray[upArray[leftArray[index]]]]) || bichromePieces(values[upArray[upArray[leftArray[index]]]])) {
                            moveArray.push(upArray[upArray[leftArray[index]]]);
                        }
                        if (values[downArray[downArray[leftArray[index]]]] == '' || blackPieces(values[downArray[downArray[leftArray[index]]]]) || bichromePieces(values[downArray[downArray[leftArray[index]]]])) {
                            moveArray.push(downArray[downArray[leftArray[index]]]);
                        }
                        if (values[upArray[rightArray[rightArray[index]]]] == '' || blackPieces(values[upArray[rightArray[rightArray[index]]]]) || bichromePieces(values[upArray[rightArray[rightArray[index]]]])) {
                            moveArray.push(upArray[rightArray[rightArray[index]]]);
                        }
                        if (values[downArray[rightArray[rightArray[index]]]] == '' || blackPieces(values[downArray[rightArray[rightArray[index]]]]) || bichromePieces(values[downArray[rightArray[rightArray[index]]]])) {
                            moveArray.push(downArray[rightArray[rightArray[index]]]);
                        }
                        if (values[upArray[upArray[rightArray[index]]]] == '' || blackPieces(values[upArray[upArray[rightArray[index]]]]) || bichromePieces(values[upArray[upArray[rightArray[index]]]])) {
                            moveArray.push(upArray[upArray[rightArray[index]]]);
                        }
                        if (values[downArray[downArray[rightArray[index]]]] == '' || blackPieces(values[downArray[downArray[rightArray[index]]]]) || bichromePieces(values[downArray[downArray[rightArray[index]]]])) {
                            moveArray.push(downArray[downArray[rightArray[index]]]);
                        }
                    }
                    break;
                // Black Knight Movement
                case '♞':
                    if (discDir == '') {
                        if (values[upArray[leftArray[leftArray[index]]]] == '' || whitePieces(values[upArray[leftArray[leftArray[index]]]]) || bichromePieces(values[upArray[leftArray[leftArray[index]]]])) {
                            moveArray.push(upArray[leftArray[leftArray[index]]]);
                        }
                        if (values[downArray[leftArray[leftArray[index]]]] == '' || whitePieces(values[downArray[leftArray[leftArray[index]]]]) || bichromePieces(values[downArray[leftArray[leftArray[index]]]])) {
                            moveArray.push(downArray[leftArray[leftArray[index]]]);
                        }
                        if (values[upArray[upArray[leftArray[index]]]] == '' || whitePieces(values[upArray[upArray[leftArray[index]]]]) || bichromePieces(values[upArray[upArray[leftArray[index]]]])) {
                            moveArray.push(upArray[upArray[leftArray[index]]]);
                        }
                        if (values[downArray[downArray[leftArray[index]]]] == '' || whitePieces(values[downArray[downArray[leftArray[index]]]]) || bichromePieces(values[downArray[downArray[leftArray[index]]]])) {
                            moveArray.push(downArray[downArray[leftArray[index]]]);
                        }
                        if (values[upArray[rightArray[rightArray[index]]]] == '' || whitePieces(values[upArray[rightArray[rightArray[index]]]]) || bichromePieces(values[upArray[rightArray[rightArray[index]]]])) {
                            moveArray.push(upArray[rightArray[rightArray[index]]]);
                        }
                        if (values[downArray[rightArray[rightArray[index]]]] == '' || whitePieces(values[downArray[rightArray[rightArray[index]]]]) || bichromePieces(values[downArray[rightArray[rightArray[index]]]])) {
                            moveArray.push(downArray[rightArray[rightArray[index]]]);
                        }
                        if (values[upArray[upArray[rightArray[index]]]] == '' || whitePieces(values[upArray[upArray[rightArray[index]]]]) || bichromePieces(values[upArray[upArray[rightArray[index]]]])) {
                            moveArray.push(upArray[upArray[rightArray[index]]]);
                        }
                        if (values[downArray[downArray[rightArray[index]]]] == '' || whitePieces(values[downArray[downArray[rightArray[index]]]]) || bichromePieces(values[downArray[downArray[rightArray[index]]]])) {
                            moveArray.push(downArray[downArray[rightArray[index]]]);
                        }
                    }
                    break;
                // Bichrome Knight Movement
                case '🨄':
                    if (discDir == '') {
                        if (values[upArray[leftArray[leftArray[index]]]] == '' || whitePieces(values[upArray[leftArray[leftArray[index]]]]) || blackPieces(values[upArray[leftArray[leftArray[index]]]])) {
                            moveArray.push(upArray[leftArray[leftArray[index]]]);
                        }
                        if (values[downArray[leftArray[leftArray[index]]]] == '' || whitePieces(values[downArray[leftArray[leftArray[index]]]]) || blackPieces(values[downArray[leftArray[leftArray[index]]]])) {
                            moveArray.push(downArray[leftArray[leftArray[index]]]);
                        }
                        if (values[upArray[upArray[leftArray[index]]]] == '' || whitePieces(values[upArray[upArray[leftArray[index]]]]) || blackPieces(values[upArray[upArray[leftArray[index]]]])) {
                            moveArray.push(upArray[upArray[leftArray[index]]]);
                        }
                        if (values[downArray[downArray[leftArray[index]]]] == '' || whitePieces(values[downArray[downArray[leftArray[index]]]]) || blackPieces(values[downArray[downArray[leftArray[index]]]])) {
                            moveArray.push(downArray[downArray[leftArray[index]]]);
                        }
                        if (values[upArray[rightArray[rightArray[index]]]] == '' || whitePieces(values[upArray[rightArray[rightArray[index]]]]) || blackPieces(values[upArray[rightArray[rightArray[index]]]])) {
                            moveArray.push(upArray[rightArray[rightArray[index]]]);
                        }
                        if (values[downArray[rightArray[rightArray[index]]]] == '' || whitePieces(values[downArray[rightArray[rightArray[index]]]]) || blackPieces(values[downArray[rightArray[rightArray[index]]]])) {
                            moveArray.push(downArray[rightArray[rightArray[index]]]);
                        }
                        if (values[upArray[upArray[rightArray[index]]]] == '' || whitePieces(values[upArray[upArray[rightArray[index]]]]) || blackPieces(values[upArray[upArray[rightArray[index]]]])) {
                            moveArray.push(upArray[upArray[rightArray[index]]]);
                        }
                        if (values[downArray[downArray[rightArray[index]]]] == '' || whitePieces(values[downArray[downArray[rightArray[index]]]]) || blackPieces(values[downArray[downArray[rightArray[index]]]])) {
                            moveArray.push(downArray[downArray[rightArray[index]]]);
                        }
                    }
                    break;
                // White Bishop Movement
                case '♗':
                    if (discDir == 'up-left' || discDir == 'down-right' || discDir == '') {
                        for (let i = upLeftArray[index]; i > -1; i = upLeftArray[i]) {
                            if (values[i] == '') {
                                moveArray.push(i);
                            } else {
                                if (blackPieces(values[i]) || bichromePieces(values[i])) {
                                    moveArray.push(i);
                                }
                                break;
                            }
                        }
                        for (let i = downRightArray[index]; i > -1; i = downRightArray[i]) {
                            if (values[i] == '') {
                                moveArray.push(i);
                            } else {
                                if (blackPieces(values[i]) || bichromePieces(values[i])) {
                                    moveArray.push(i);
                                }
                                break;
                            }
                        }
                    }
                    if (discDir == 'up-right' || discDir == 'down-left' || discDir == '') {
                        for (let i = upRightArray[index]; i > -1; i = upRightArray[i]) {
                            if (values[i] == '') {
                                moveArray.push(i);
                            } else {
                                if (blackPieces(values[i]) || bichromePieces(values[i])) {
                                    moveArray.push(i);
                                }
                                break;
                            }
                        }
                        for (let i = downLeftArray[index]; i > -1; i = downLeftArray[i]) {
                            if (values[i] == '') {
                                moveArray.push(i);
                            } else {
                                if (blackPieces(values[i]) || bichromePieces(values[i])) {
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
                        for (let i = upLeftArray[index]; i > -1; i = upLeftArray[i]) {
                            if (values[i] == '') {
                                moveArray.push(i);
                            } else {
                                if (whitePieces(values[i]) || bichromePieces(values[i])) {
                                    moveArray.push(i);
                                }
                                break;
                            }
                        }
                        for (let i = downRightArray[index]; i > -1; i = downRightArray[i]) {
                            if (values[i] == '') {
                                moveArray.push(i);
                            } else {
                                if (whitePieces(values[i]) || bichromePieces(values[i])) {
                                    moveArray.push(i);
                                }
                                break;
                            }
                        }
                    }
                    if (discDir == 'up-right' || discDir == 'down-left' || discDir == '') {
                        for (let i = upRightArray[index]; i > -1; i = upRightArray[i]) {
                            if (values[i] == '') {
                                moveArray.push(i);
                            } else {
                                if (whitePieces(values[i]) || bichromePieces(values[i])) {
                                    moveArray.push(i);
                                }
                                break;
                            }
                        }
                        for (let i = downLeftArray[index]; i > -1; i = downLeftArray[i]) {
                            if (values[i] == '') {
                                moveArray.push(i);
                            } else {
                                if (whitePieces(values[i]) || bichromePieces(values[i])) {
                                    moveArray.push(i);
                                }
                                break;
                            }
                        }
                    }
                    break;
                // Bichrome Bishop Movement
                case '🨃':
                    if (discDir == 'up-left' || discDir == 'down-right' || discDir == '') {
                        for (let i = upLeftArray[index]; i > -1; i = upLeftArray[i]) {
                            if (values[i] == '') {
                                moveArray.push(i);
                            } else {
                                if (whitePieces(values[i]) || blackPieces(values[i])) {
                                    moveArray.push(i);
                                }
                                break;
                            }
                        }
                        for (let i = downRightArray[index]; i > -1; i = downRightArray[i]) {
                            if (values[i] == '') {
                                moveArray.push(i);
                            } else {
                                if (whitePieces(values[i]) || blackPieces(values[i])) {
                                    moveArray.push(i);
                                }
                                break;
                            }
                        }
                    }
                    if (discDir == 'up-right' || discDir == 'down-left' || discDir == '') {
                        for (let i = upRightArray[index]; i > -1; i = upRightArray[i]) {
                            if (values[i] == '') {
                                moveArray.push(i);
                            } else {
                                if (whitePieces(values[i]) || blackPieces(values[i])) {
                                    moveArray.push(i);
                                }
                                break;
                            }
                        }
                        for (let i = downLeftArray[index]; i > -1; i = downLeftArray[i]) {
                            if (values[i] == '') {
                                moveArray.push(i);
                            } else {
                                if (whitePieces(values[i]) || blackPieces(values[i])) {
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
                                if (blackPieces(values[i]) || bichromePieces(values[i])) {
                                    moveArray.push(i);
                                }
                                break;
                            }
                        }
                        for (let i = downArray[index]; i > -1; i = downArray[i]) {
                            if (values[i] == '') {
                                moveArray.push(i);
                            } else {
                                if (blackPieces(values[i]) || bichromePieces(values[i])) {
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
                                if (blackPieces(values[i]) || bichromePieces(values[i])) {
                                    moveArray.push(i);
                                }
                                break;
                            }
                        }
                        for (let i = rightArray[index]; i > -1; i = rightArray[i]) {
                            if (values[i] == '') {
                                moveArray.push(i);
                            } else {
                                if (blackPieces(values[i]) || bichromePieces(values[i])) {
                                    moveArray.push(i);
                                }
                                break;
                            }
                        }
                    }
                    if (discDir == 'up-left' || discDir == 'down-right' || discDir == '') {
                        for (let i = upLeftArray[index]; i > -1; i = upLeftArray[i]) {
                            if (values[i] == '') {
                                moveArray.push(i);
                            } else {
                                if (blackPieces(values[i]) || bichromePieces(values[i])) {
                                    moveArray.push(i);
                                }
                                break;
                            }
                        }
                        for (let i = downRightArray[index]; i > -1; i = downRightArray[i]) {
                            if (values[i] == '') {
                                moveArray.push(i);
                            } else {
                                if (blackPieces(values[i]) || bichromePieces(values[i])) {
                                    moveArray.push(i);
                                }
                                break;
                            }
                        }
                    }
                    if (discDir == 'up-right' || discDir == 'down-left' || discDir == '') {
                        for (let i = upRightArray[index]; i > -1; i = upRightArray[i]) {
                            if (values[i] == '') {
                                moveArray.push(i);
                            } else {
                                if (blackPieces(values[i]) || bichromePieces(values[i])) {
                                    moveArray.push(i);
                                }
                                break;
                            }
                        }
                        for (let i = downLeftArray[index]; i > -1; i = downLeftArray[i]) {
                            if (values[i] == '') {
                                moveArray.push(i);
                            } else {
                                if (blackPieces(values[i]) || bichromePieces(values[i])) {
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
                                if (whitePieces(values[i]) || bichromePieces(values[i])) {
                                    moveArray.push(i);
                                }
                                break;
                            }
                        }
                        for (let i = downArray[index]; i > -1; i = downArray[i]) {
                            if (values[i] == '') {
                                moveArray.push(i);
                            } else {
                                if (whitePieces(values[i]) || bichromePieces(values[i])) {
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
                                if (whitePieces(values[i]) || bichromePieces(values[i])) {
                                    moveArray.push(i);
                                }
                                break;
                            }
                        }
                        for (let i = rightArray[index]; i > -1; i = rightArray[i]) {
                            if (values[i] == '') {
                                moveArray.push(i);
                            } else {
                                if (whitePieces(values[i]) || bichromePieces(values[i])) {
                                    moveArray.push(i);
                                }
                                break;
                            }
                        }
                    }
                    if (discDir == 'up-left' || discDir == 'down-right' || discDir == '') {
                        for (let i = upLeftArray[index]; i > -1; i = upLeftArray[i]) {
                            if (values[i] == '') {
                                moveArray.push(i);
                            } else {
                                if (whitePieces(values[i]) || bichromePieces(values[i])) {
                                    moveArray.push(i);
                                }
                                break;
                            }
                        }
                        for (let i = downRightArray[index]; i > -1; i = downRightArray[i]) {
                            if (values[i] == '') {
                                moveArray.push(i);
                            } else {
                                if (whitePieces(values[i]) || bichromePieces(values[i])) {
                                    moveArray.push(i);
                                }
                                break;
                            }
                        }
                    }
                    if (discDir == 'up-right' || discDir == 'down-left' || discDir == '') {
                        for (let i = upRightArray[index]; i > -1; i = upRightArray[i]) {
                            if (values[i] == '') {
                                moveArray.push(i);
                            } else {
                                if (whitePieces(values[i]) || bichromePieces(values[i])) {
                                    moveArray.push(i);
                                }
                                break;
                            }
                        }
                        for (let i = downLeftArray[index]; i > -1; i = downLeftArray[i]) {
                            if (values[i] == '') {
                                moveArray.push(i);
                            } else {
                                if (whitePieces(values[i]) || bichromePieces(values[i])) {
                                    moveArray.push(i);
                                }
                                break;
                            }
                        }
                    }
                    break;
                // Bichrome Queen Movement
                case '🨁':
                    if (discDir == 'up' || discDir == 'down' || discDir == '') {
                        for (let i = upArray[index]; i > -1; i = upArray[i]) {
                            if (values[i] == '') {
                                moveArray.push(i);
                            } else {
                                if (whitePieces(values[i]) || blackPieces(values[i])) {
                                    moveArray.push(i);
                                }
                                break;
                            }
                        }
                        for (let i = downArray[index]; i > -1; i = downArray[i]) {
                            if (values[i] == '') {
                                moveArray.push(i);
                            } else {
                                if (whitePieces(values[i]) || blackPieces(values[i])) {
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
                                if (whitePieces(values[i]) || blackPieces(values[i])) {
                                    moveArray.push(i);
                                }
                                break;
                            }
                        }
                        for (let i = rightArray[index]; i > -1; i = rightArray[i]) {
                            if (values[i] == '') {
                                moveArray.push(i);
                            } else {
                                if (whitePieces(values[i]) || blackPieces(values[i])) {
                                    moveArray.push(i);
                                }
                                break;
                            }
                        }
                    }
                    if (discDir == 'up-left' || discDir == 'down-right' || discDir == '') {
                        for (let i = upLeftArray[index]; i > -1; i = upLeftArray[i]) {
                            if (values[i] == '') {
                                moveArray.push(i);
                            } else {
                                if (whitePieces(values[i]) || blackPieces(values[i])) {
                                    moveArray.push(i);
                                }
                                break;
                            }
                        }
                        for (let i = downRightArray[index]; i > -1; i = downRightArray[i]) {
                            if (values[i] == '') {
                                moveArray.push(i);
                            } else {
                                if (whitePieces(values[i]) || blackPieces(values[i])) {
                                    moveArray.push(i);
                                }
                                break;
                            }
                        }
                    }
                    if (discDir == 'up-right' || discDir == 'down-left' || discDir == '') {
                        for (let i = upRightArray[index]; i > -1; i = upRightArray[i]) {
                            if (values[i] == '') {
                                moveArray.push(i);
                            } else {
                                if (whitePieces(values[i]) || blackPieces(values[i])) {
                                    moveArray.push(i);
                                }
                                break;
                            }
                        }
                        for (let i = downLeftArray[index]; i > -1; i = downLeftArray[i]) {
                            if (values[i] == '') {
                                moveArray.push(i);
                            } else {
                                if (whitePieces(values[i]) || blackPieces(values[i])) {
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
                // Bichrome King Movement
                case '🨀':
                    bichromeKingMovement(moveArray, index);
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
        var bichromeKing = values.findIndex(value => value == '🨀');
        var whiteQueens = [];
        values.forEach((value, index) => { if (value == '♕' && !whiteQueens.some(val => index == val)) { whiteQueens.push(index); } });
        var blackQueens = [];
        values.forEach((value, index) => { if (value == '♛' && !blackQueens.some(val => index == val)) { blackQueens.push(index); } });
        var bichromeQueens = [];
        values.forEach((value, index) => { if (value == '🨁' && !bichromeQueens.some(val => index == val)) { bichromeQueens.push(index); } });
        var whiteBishops = [];
        checkForPiece('♗', whiteBishops);
        var blackBishops = [];
        checkForPiece('♝', blackBishops);
        var bichromeBishops = [];
        checkForPiece('🨃', bichromeBishops);
        var whiteKnights = [];
        checkForPiece('♘', whiteKnights);
        var blackKnights = [];
        checkForPiece('♞', blackKnights);
        var bichromeKnights = [];
        checkForPiece('🨄', bichromeKnights);
        var whiteRooks = [];
        checkForPiece('♖', whiteRooks);
        var blackRooks = [];
        checkForPiece('♜', blackRooks);
        var bichromeRooks = [];
        checkForPiece('🨂', bichromeRooks);
        var whitePawns = [];
        values.forEach((value, index) => { if (value == '♙' && !whitePawns.some(val => index == val)) { whitePawns.push(index); } });
        var blackPawns = [];
        values.forEach((value, index) => { if (value == '♟' && !blackPawns.some(val => index == val)) { blackPawns.push(index); } });
        var bichromePawns = [];
        values.forEach((value, index) => { if (value == '🨅' && !bichromePawns.some(val => index == val)) { bichromePawns.push(index); } });
        var boardState = 'whiteKing:' + whiteKing.toString() + ';blackKing:' + blackKing.toString() + ';bichromeKing:' + bichromeKing.toString() + ';whiteQueens:' + whiteQueens.toString() + ';blackQueens:' + blackQueens.toString() + ';bichromeQueens:' + bichromeQueens.toString() +
            ';whiteBishops:' + whiteBishops.toString() + ';blackBishops:' + blackBishops.toString() + ';bichromeBishops:' + bichromeBishops.toString() + ';whiteKnights:' + whiteKnights.toString() + ';blackKnights:' + blackKnights.toString() + ';bichromeKnights:' + bichromeKnights.toString() +
            ';whiteRooks:' + whiteRooks.toString() + ';blackRooks:' + blackRooks.toString() + ';bichromeRooks:' + bichromeRooks.toString() + ';whitePawns:' + whitePawns.toString() + ';blackPawns:' + blackPawns.toString() + ';bichromePawns:' + bichromePawns.toString() +
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
        var whiteIndex = false;
        var whiteCheck = false;
        var blackIndex = false;
        var blackCheck = false;
        var bichromeIndex = false;
        var bichromeCheck = false;
        if (player == 'White') {
            whiteIndex = values.findIndex(value => value == '♔');
            whiteCheck = checkForCheckWhite(whiteIndex);
        } else if (player == 'Black') {
            blackIndex = values.findIndex(value => value == '♚');
            blackCheck = checkForCheckBlack(blackIndex);
        } else if (player == 'Bichrome') {
            bichromeIndex = values.findIndex(value => value == '🨀');
            bichromeCheck = checkForCheckBichrome(bichromeIndex);
        }
        if (whiteCheck || blackCheck || bichromeCheck) {
            setWin('Check');
        }
        if (!whiteCheck && !blackCheck && !bichromeCheck) {
            setWin('');
        }
    }

    const checkForMate = () => {
        var blocked = checkForBlocked();
        var copy = values.slice();
        var spliced = values.slice();
        for (let i = 0; i < blocked.length; i++) {
            spliced.splice(blocked[i] - i, 1);
        }
        if (player == 'White' && spliced.every(value => value != '♔' && value != '♕' && value != '♗' && value != '♘' && value != '♖' && value != '♙')) {
            if (win == 'Check') {
                console.log('White loses by checkmate');
                if (firstOut == '') {
                    setFirstOut('White');
                    playerModifier(setPlayer);
                    setWin('');
                    values.forEach((value, index) => { if (whitePieces(value) || value == '♔') { copy[index] = '' } });
                    setValues(copy);
                } else {
                    setWin(firstOut == 'Black' ? 'Bichrome' : 'Black');
                    return;
                }
            } else {
                console.log('White loses by stalemate');
                if (firstOut == '') {
                    setFirstOut('White');
                    playerModifier(setPlayer);
                    setWin('');
                    values.forEach((value, index) => { if (whitePieces(value) || value == '♔') { copy[index] = '' } });
                    setValues(copy);
                } else {
                    setWin(firstOut == 'Black' ? 'Bichrome' : 'Black');
                    return;
                }
            }
        }
        if (player == 'Black' && spliced.every(value => value != '♚' && value != '♛' && value != '♝' && value != '♞' && value != '♜' && value != '♟')) {
            if (win == 'Check') {
                console.log('Black loses by checkmate');
                if (firstOut == '') {
                    setFirstOut('Black');
                    playerModifier(setPlayer);
                    setWin('');
                    values.forEach((value, index) => { if (blackPieces(value) || value == '♚') { copy[index] = '' } });
                    setValues(copy);
                } else {
                    setWin(firstOut == 'White' ? 'Bichrome' : 'White');
                    return;
                }
            } else {
                console.log('Black loses by stalemate');
                if (firstOut == '') {
                    setFirstOut('Black');
                    playerModifier(setPlayer);
                    setWin('');
                    values.forEach((value, index) => { if (blackPieces(value) || value == '♚') { copy[index] = '' } });
                    setValues(copy);
                } else {
                    setWin(firstOut == 'White' ? 'Bichrome' : 'White');
                    return;
                }
            }
        }
        if (player == 'Bichrome' && spliced.every(value => value != '🨀' && value != '🨁' && value != '🨃' && value != '🨄' && value != '🨂' && value != '🨅')) {
            if (win == 'Check') {
                console.log('Bichrome loses by checkmate');
                if (firstOut == '') {
                    setFirstOut('Bichrome');
                    playerModifier(setPlayer);
                    setWin('');
                    values.forEach((value, index) => { if (bichromePieces(value) || value == '🨀') { copy[index] = '' } });
                    setValues(copy);
                } else {
                    setWin(firstOut == 'Black' ? 'White' : 'Black');
                    return;
                }
            } else {
                console.log('Bichrome loses by stalemate');
                if (firstOut == '') {
                    setFirstOut('Bichrome');
                    playerModifier(setPlayer);
                    setWin('');
                    values.forEach((value, index) => { if (bichromePieces(value) || value == '🨀') { copy[index] = '' } });
                    setValues(copy);
                } else {
                    setWin(firstOut == 'Black' ? 'White' : 'Black');
                    return;
                }
            }
        }
        if (count >= 150) {
            console.log('Draw by 50-Move Rule');
            setWin('Draw');
        }
    }

    return (
        <div className="app5">
            <div aria-live="polite">
                {((win == '') ? (player + "'s turn") : ((win == 'Draw') ? 'Draw' : ((win == 'Check') ? (player + ' is in check') : ('Winner is ' + win))))}
            </div>
            <div className="board5">
                {values.map((value, index) => (<Cell id={index} value={value} win={win} player={player} selected={selected} setCount={setCount}
                    setPlayer={() => playerModifier(setPlayer)} setArray={arrayModifier} setSelected={setSelected} checkForMovement={checkForMovement} checkForCastle={checkForCastle} />))}
            </div>
            <button onClick={reset}>Reset</button>
        </div>
    );
} 
