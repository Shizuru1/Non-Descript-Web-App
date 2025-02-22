import React, { useEffect, useState } from "react";

import "./styles.css";

const Cell = (props) => {
    const { id, selected, value, win, player, setCount, setPlayer, setArray, setSelected, checkForMovement } = props;

    const handleClick = () => {
        if (selected.value) {
            // Cancel Move
            if (id == selected.id) {
                setSelected({ id: -1, value: false, piece: selected.piece, blockedArray: selected.blockedArray });
            }
            // Normal Move
            else {
                if (value == '' && selected.piece != '♙' && selected.piece != '♟') {
                    setCount(prev => prev + 1);
                } else {
                    setCount(0);
                }
                setPlayer();
                setArray(selected.id, '');
                setArray(id, selected.piece);
                setSelected({ id: selected.id, value: false, piece: selected.piece, blockedArray: selected.blockedArray });
            }
            // Upgrade White Pawn to Queen
            if (id < 5 && selected.piece == '♙') {
                setArray(id, '♕');
            }
            // Upgrade Black Pawn to Queen
            if (id > 119 && selected.piece == '♟') {
                setArray(id, '♛');
            }
        } else {
            setSelected({ id: id, value: true, piece: value, blockedArray: selected.blockedArray });
        }
    }

    const checkerboard = ((id % 2 == 0) && (Math.floor(id / 5) % 2 == 0)) || ((id % 2 == 0) && (Math.floor(id / 5) % 2 == 1));
    const jump = Math.floor(id / 5) % 5 == 4;
    const blackSelect = player == 'Black' && value != '♟' && value != '♜' && value != '♞' && value != '♝' && value != '🨨' && value != '♛' && value != '♚';
    const whiteSelect = player == 'White' && value != '♙' && value != '♖' && value != '♘' && value != '♗' && value != '🨢' && value != '♕' && value != '♔';
    const select = !selected.value && (selected.blockedArray.some(val => (id == val)) || (blackSelect || whiteSelect));
    const movement = selected.value && !checkForMovement(selected.id).some(val => (id == val));
    const noWin = win != '' && win != 'Check';

    return <button className={"cell6" + (checkerboard ? "white" : "black") + (jump ? "jump" : "")} onClick={handleClick}
        disabled={select || movement || noWin}>{value}</button>;
};

export default function App() {
    const [player, setPlayer] = useState('White'); // whose turn
    const [win, setWin] = useState(''); // win state
    const initArray = ['♜', '♞', '♚', '♞', '♜',
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
        '♖', '♘', '♔', '♘', '♖'];
    const [values, setValues] = useState(initArray); // board state
    const [selected, setSelected] = useState({ id: -1, value: false, piece: '', blockedArray: [] }); // trigger move state upon piece selection
    const [count, setCount] = useState(0); // count for fifty move rule
    const [repetitions, setRepetitions] = useState([]); // count for fivefold repetition rule

    useEffect(() => {
        checkForCheck();
        checkForReps();
    }, [values]);

    useEffect(() => {
        checkForMate();
    }, [repetitions]);

    const frontArray = [-1, -1, -1, -1, -1,
        0, 1, 2, 3, 4,
        5, 6, 7, 8, 9,
        10, 11, 12, 13, 14,
        15, 16, 17, 18, 19,
        -1, -1, -1, -1, -1,
        25, 26, 27, 28, 29,
        30, 31, 32, 33, 34,
        35, 36, 37, 38, 39,
        40, 41, 42, 43, 44,
        -1, -1, -1, -1, -1,
        50, 51, 52, 53, 54,
        55, 56, 57, 58, 59,
        60, 61, 62, 63, 64,
        65, 66, 67, 68, 69,
        -1, -1, -1, -1, -1,
        75, 76, 77, 78, 79,
        80, 81, 82, 83, 84,
        85, 86, 87, 88, 89,
        90, 91, 92, 93, 94,
        -1, -1, -1, -1, -1,
        100, 101, 102, 103, 104,
        105, 106, 107, 108, 109,
        110, 111, 112, 113, 114,
        115, 116, 117, 118, 119];

    const backArray = [5, 6, 7, 8, 9,
        10, 11, 12, 13, 14,
        15, 16, 17, 18, 19,
        20, 21, 22, 23, 24,
        -1, -1, -1, -1, -1,
        30, 31, 32, 33, 34,
        35, 36, 37, 38, 39,
        40, 41, 42, 43, 44,
        45, 46, 47, 48, 49,
        -1, -1, -1, -1, -1,
        55, 56, 57, 58, 59,
        60, 61, 62, 63, 64,
        65, 66, 67, 68, 69,
        70, 71, 72, 73, 74,
        -1, -1, -1, -1, -1,
        80, 81, 82, 83, 84,
        85, 86, 87, 88, 89,
        90, 91, 92, 93, 94,
        95, 96, 97, 98, 99,
        -1, -1, -1, -1, -1,
        105, 106, 107, 108, 109,
        110, 111, 112, 113, 114,
        115, 116, 117, 118, 119,
        120, 121, 122, 123, 124,
        -1, -1, -1, -1, -1];

    const leftArray = [-1, 0, 1, 2, 3,
        -1, 5, 6, 7, 8,
        -1, 10, 11, 12, 13,
        -1, 15, 16, 17, 18,
        -1, 20, 21, 22, 23,
        -1, 25, 26, 27, 28,
        -1, 30, 31, 32, 33,
        -1, 35, 36, 37, 38,
        -1, 40, 41, 42, 43,
        -1, 45, 46, 47, 48,
        -1, 50, 51, 52, 53,
        -1, 55, 56, 57, 58,
        -1, 60, 61, 62, 63,
        -1, 65, 66, 67, 68,
        -1, 70, 71, 72, 73,
        -1, 75, 76, 77, 78,
        -1, 80, 81, 82, 83,
        -1, 85, 86, 87, 88,
        -1, 90, 91, 92, 93,
        -1, 95, 96, 97, 98,
        -1, 100, 101, 102, 103,
        -1, 105, 106, 107, 108,
        -1, 110, 111, 112, 113,
        -1, 115, 116, 117, 118,
        -1, 120, 121, 122, 123];

    const rightArray = [1, 2, 3, 4, -1,
        6, 7, 8, 9, -1,
        11, 12, 13, 14, -1,
        16, 17, 18, 19, -1,
        21, 22, 23, 24, -1,
        26, 27, 28, 29, -1,
        31, 32, 33, 34, -1,
        36, 37, 38, 39, -1,
        41, 42, 43, 44, -1,
        46, 47, 48, 49, -1,
        51, 52, 53, 54, -1,
        56, 57, 58, 59, -1,
        61, 62, 63, 64, -1,
        66, 67, 68, 69, -1,
        71, 72, 73, 74, -1,
        76, 77, 78, 79, -1,
        81, 82, 83, 84, -1,
        86, 87, 88, 89, -1,
        91, 92, 93, 94, -1,
        96, 97, 98, 99, -1,
        101, 102, 103, 104, -1,
        106, 107, 108, 109, -1,
        111, 112, 113, 114, -1,
        116, 117, 118, 119, -1,
        121, 122, 123, 124, -1];

    const upArray = [-1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1,
        0, 1, 2, 3, 4,
        5, 6, 7, 8, 9,
        10, 11, 12, 13, 14,
        15, 16, 17, 18, 19,
        20, 21, 22, 23, 24,
        25, 26, 27, 28, 29,
        30, 31, 32, 33, 34,
        35, 36, 37, 38, 39,
        40, 41, 42, 43, 44,
        45, 46, 47, 48, 49,
        50, 51, 52, 53, 54,
        55, 56, 57, 58, 59,
        60, 61, 62, 63, 64,
        65, 66, 67, 68, 69,
        70, 71, 72, 73, 74,
        75, 76, 77, 78, 79,
        80, 81, 82, 83, 84,
        85, 86, 87, 88, 89,
        90, 91, 92, 93, 94,
        95, 96, 97, 98, 99];

    const downArray = [25, 26, 27, 28, 29,
        30, 31, 32, 33, 34,
        35, 36, 37, 38, 39,
        40, 41, 42, 43, 44,
        45, 46, 47, 48, 49,
        50, 51, 52, 53, 54,
        55, 56, 57, 58, 59,
        60, 61, 62, 63, 64,
        65, 66, 67, 68, 69,
        70, 71, 72, 73, 74,
        75, 76, 77, 78, 79,
        80, 81, 82, 83, 84,
        85, 86, 87, 88, 89,
        90, 91, 92, 93, 94,
        95, 96, 97, 98, 99,
        100, 101, 102, 103, 104,
        105, 106, 107, 108, 109,
        110, 111, 112, 113, 114,
        115, 116, 117, 118, 119,
        120, 121, 122, 123, 124,
        -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1];

    const rookArray1 = [0, 0, 0, 0, 0,
        1, 1, 1, 1, 1,
        2, 2, 2, 2, 2,
        3, 3, 3, 3, 3,
        4, 4, 4, 4, 4,
        5, 5, 5, 5, 5,
        6, 6, 6, 6, 6,
        7, 7, 7, 7, 7,
        8, 8, 8, 8, 8,
        9, 9, 9, 9, 9,
        10, 10, 10, 10, 10,
        11, 11, 11, 11, 11,
        12, 12, 12, 12, 12,
        13, 13, 13, 13, 13,
        14, 14, 14, 14, 14,
        15, 15, 15, 15, 15,
        16, 16, 16, 16, 16,
        17, 17, 17, 17, 17,
        18, 18, 18, 18, 18,
        19, 19, 19, 19, 19,
        20, 20, 20, 20, 20,
        21, 21, 21, 21, 21,
        22, 22, 22, 22, 22,
        23, 23, 23, 23, 23,
        24, 24, 24, 24, 24];

    const rookArray2 = [0, 1, 2, 3, 4,
        0, 1, 2, 3, 4,
        0, 1, 2, 3, 4,
        0, 1, 2, 3, 4,
        0, 1, 2, 3, 4,
        5, 6, 7, 8, 9,
        5, 6, 7, 8, 9,
        5, 6, 7, 8, 9,
        5, 6, 7, 8, 9,
        5, 6, 7, 8, 9,
        10, 11, 12, 13, 14,
        10, 11, 12, 13, 14,
        10, 11, 12, 13, 14,
        10, 11, 12, 13, 14,
        10, 11, 12, 13, 14,
        15, 16, 17, 18, 19,
        15, 16, 17, 18, 19,
        15, 16, 17, 18, 19,
        15, 16, 17, 18, 19,
        15, 16, 17, 18, 19,
        20, 21, 22, 23, 24,
        20, 21, 22, 23, 24,
        20, 21, 22, 23, 24,
        20, 21, 22, 23, 24,
        20, 21, 22, 23, 24];

    const rookArray3 = [0, 1, 2, 3, 4,
        5, 6, 7, 8, 9,
        10, 11, 12, 13, 14,
        15, 16, 17, 18, 19,
        20, 21, 22, 23, 24,
        0, 1, 2, 3, 4,
        5, 6, 7, 8, 9,
        10, 11, 12, 13, 14,
        15, 16, 17, 18, 19,
        20, 21, 22, 23, 24,
        0, 1, 2, 3, 4,
        5, 6, 7, 8, 9,
        10, 11, 12, 13, 14,
        15, 16, 17, 18, 19,
        20, 21, 22, 23, 24,
        0, 1, 2, 3, 4,
        5, 6, 7, 8, 9,
        10, 11, 12, 13, 14,
        15, 16, 17, 18, 19,
        0, 1, 2, 3, 4,
        5, 6, 7, 8, 9,
        10, 11, 12, 13, 14,
        15, 16, 17, 18, 19,
        20, 21, 22, 23, 24];

    const bishopArray1 = [0, 1, 2, 3, 4,
        1, 2, 3, 4, 5,
        2, 3, 4, 5, 6,
        3, 4, 5, 6, 7,
        4, 5, 6, 7, 8,
        9, 10, 11, 12, 13,
        10, 11, 12, 13, 14,
        11, 12, 13, 14, 15,
        12, 13, 14, 15, 16,
        13, 14, 15, 16, 17,
        18, 19, 20, 21, 22,
        19, 20, 21, 22, 23,
        20, 21, 22, 23, 24,
        21, 22, 23, 24, 25,
        22, 23, 24, 25, 26,
        27, 28, 29, 30, 31,
        28, 29, 30, 31, 32,
        29, 30, 31, 32, 33,
        30, 31, 32, 33, 34,
        31, 32, 33, 34, 35,
        36, 37, 38, 39, 40,
        37, 38, 39, 40, 41,
        38, 39, 40, 41, 42,
        39, 40, 41, 42, 43,
        40, 41, 42, 43, 44];

    const bishopArray2 = [4, 3, 2, 1, 0,
        5, 4, 3, 2, 1,
        6, 5, 4, 3, 2,
        7, 6, 5, 4, 3,
        8, 7, 6, 5, 4,
        13, 12, 11, 10, 9,
        14, 13, 12, 11, 10,
        15, 14, 13, 12, 11,
        16, 15, 14, 13, 12,
        17, 16, 15, 14, 13,
        22, 21, 20, 19, 18,
        23, 22, 21, 20, 19,
        24, 23, 22, 21, 20,
        25, 24, 23, 22, 21,
        26, 25, 24, 23, 22,
        31, 30, 29, 28, 27,
        32, 31, 30, 29, 28,
        33, 32, 31, 30, 29,
        34, 33, 32, 31, 30,
        35, 34, 33, 32, 31,
        40, 39, 38, 37, 36,
        41, 40, 39, 38, 37,
        42, 41, 40, 39, 38,
        43, 42, 41, 40, 39,
        44, 43, 42, 41, 40];

    const bishopArray3 = [0, 1, 2, 3, 4,
        5, 6, 7, 8, 9,
        10, 11, 12, 13, 14,
        15, 16, 17, 18, 19,
        20, 21, 22, 23, 24,
        25, 26, 27, 28, 29,
        0, 1, 2, 3, 4,
        5, 6, 7, 8, 9,
        10, 11, 12, 13, 14,
        15, 16, 17, 18, 19,
        30, 31, 32, 33, 34,
        25, 26, 27, 28, 29,
        0, 1, 2, 3, 4,
        5, 6, 7, 8, 9,
        10, 11, 12, 13, 14,
        35, 36, 37, 38, 39,
        30, 31, 32, 33, 34,
        25, 26, 27, 28, 29,
        0, 1, 2, 3, 4,
        5, 6, 7, 8, 9,
        40, 41, 42, 43, 44,
        35, 36, 37, 38, 39,
        30, 31, 32, 33, 34,
        25, 26, 27, 28, 29,
        0, 1, 2, 3, 4];

    const bishopArray4 = [20, 21, 22, 23, 24,
        15, 16, 17, 18, 19,
        10, 11, 12, 13, 14,
        5, 6, 7, 8, 9,
        0, 1, 2, 3, 4,
        15, 16, 17, 18, 19,
        10, 11, 12, 13, 14,
        5, 6, 7, 8, 9,
        0, 1, 2, 3, 4,
        25, 26, 27, 28, 29,
        10, 11, 12, 13, 14,
        5, 6, 7, 8, 9,
        0, 1, 2, 3, 4,
        25, 26, 27, 28, 29,
        30, 31, 32, 33, 34,
        5, 6, 7, 8, 9,
        0, 1, 2, 3, 4,
        25, 26, 27, 28, 29,
        30, 31, 32, 33, 34,
        35, 36, 37, 38, 39,
        0, 1, 2, 3, 4,
        25, 26, 27, 28, 29,
        30, 31, 32, 33, 34,
        35, 36, 37, 38, 39,
        40, 41, 42, 43, 44];

    const bishopArray5 = [0, 1, 2, 3, 4,
        5, 6, 7, 8, 9,
        10, 11, 12, 13, 14,
        15, 16, 17, 18, 19,
        20, 21, 22, 23, 24,
        25, 0, 1, 2, 3,
        26, 5, 6, 7, 8,
        27, 10, 11, 12, 13,
        28, 15, 16, 17, 18,
        29, 20, 21, 22, 23,
        30, 25, 0, 1, 2,
        31, 26, 5, 6, 7,
        32, 27, 10, 11, 12,
        33, 28, 15, 16, 17,
        34, 29, 20, 21, 22,
        35, 30, 25, 0, 1,
        36, 31, 26, 5, 6,
        37, 32, 27, 10, 11,
        38, 33, 28, 15, 16,
        39, 34, 29, 20, 21,
        40, 35, 30, 25, 0,
        41, 36, 31, 26, 5,
        42, 37, 32, 27, 10,
        43, 38, 33, 28, 15,
        44, 39, 34, 29, 20];

    const bishopArray6 = [4, 3, 2, 1, 0,
        9, 8, 7, 6, 5,
        14, 13, 12, 11, 10,
        19, 18, 17, 16, 15,
        24, 23, 22, 21, 20,
        3, 2, 1, 0, 25,
        8, 7, 6, 5, 26,
        13, 12, 11, 10, 27,
        18, 17, 16, 15, 28,
        23, 22, 21, 20, 29,
        2, 1, 0, 25, 30,
        7, 6, 5, 26, 31,
        12, 11, 10, 27, 32,
        17, 16, 15, 28, 33,
        22, 21, 20, 29, 34,
        1, 0, 25, 30, 35,
        6, 5, 26, 31, 36,
        11, 10, 27, 32, 37,
        16, 15, 28, 33, 38,
        21, 20, 29, 34, 39,
        0, 25, 30, 35, 40,
        5, 26, 31, 36, 41,
        10, 27, 32, 37, 42,
        15, 28, 33, 38, 43,
        20, 39, 34, 39, 44];

    const unicornArray1 = [0, 1, 2, 3, 4,
        5, 6, 7, 8, 9,
        10, 11, 12, 13, 14,
        15, 16, 17, 18, 19,
        20, 21, 22, 23, 24,
        25, 26, 27, 28, 29,
        30, 0, 1, 2, 3,
        31, 5, 6, 7, 8,
        32, 10, 11, 12, 13,
        33, 15, 16, 17, 18,
        34, 35, 36, 37, 38,
        39, 25, 26, 27, 28,
        40, 30, 0, 1, 2,
        41, 31, 5, 6, 7,
        42, 32, 10, 11, 12,
        43, 44, 45, 46, 47,
        48, 34, 35, 36, 37,
        49, 39, 25, 26, 27,
        50, 40, 30, 0, 1,
        51, 41, 31, 5, 6,
        52, 53, 54, 55, 56,
        57, 43, 44, 45, 46,
        58, 48, 34, 35, 36,
        59, 49, 39, 25, 26,
        60, 50, 40, 30, 0];

    const unicornArray2 = [4, 3, 2, 1, 0,
        9, 8, 7, 6, 5,
        14, 13, 12, 11, 10,
        19, 18, 17, 16, 15,
        24, 23, 22, 21, 20,
        29, 28, 27, 26, 25,
        3, 2, 1, 0, 30,
        8, 7, 6, 5, 31,
        13, 12, 11, 10, 32,
        18, 17, 16, 15, 33,
        38, 37, 36, 35, 34,
        28, 27, 26, 25, 39,
        2, 1, 0, 30, 40,
        7, 6, 5, 31, 41,
        12, 11, 10, 32, 42,
        47, 46, 45, 44, 43,
        37, 36, 35, 34, 48,
        27, 26, 25, 39, 49,
        1, 0, 30, 40, 50,
        6, 5, 31, 41, 51,
        56, 55, 54, 53, 52,
        46, 45, 44, 43, 57,
        36, 35, 34, 48, 58,
        26, 25, 39, 49, 59,
        0, 30, 40, 50, 60];

    const unicornArray3 = [20, 21, 22, 23, 24,
        15, 16, 17, 18, 19,
        10, 11, 12, 13, 14,
        5, 6, 7, 8, 9,
        0, 1, 2, 3, 4,
        33, 15, 16, 17, 18,
        32, 10, 11, 12, 13,
        31, 5, 6, 7, 8,
        30, 0, 1, 2, 3,
        25, 26, 27, 28, 29,
        42, 32, 10, 11, 12,
        41, 31, 5, 6, 7,
        40, 30, 0, 1, 2,
        39, 25, 26, 27, 28,
        34, 35, 36, 37, 38,
        51, 41, 31, 5, 6,
        50, 40, 30, 0, 1,
        49, 39, 25, 26, 27,
        48, 34, 35, 36, 37,
        43, 44, 45, 46, 47,
        60, 50, 40, 30, 0,
        59, 49, 39, 25, 26,
        58, 48, 34, 35, 36,
        57, 43, 44, 45, 46,
        52, 53, 54, 55, 56];

    const unicornArray4 = [24, 23, 22, 21, 20,
        19, 18, 17, 16, 15,
        14, 13, 12, 11, 10,
        9, 8, 7, 6, 5,
        4, 3, 2, 1, 0,
        18, 17, 16, 15, 33,
        13, 12, 11, 10, 32,
        8, 7, 6, 5, 31,
        3, 2, 1, 0, 30,
        29, 28, 27, 26, 25,
        12, 11, 10, 32, 42,
        7, 6, 5, 31, 41,
        2, 1, 0, 30, 40,
        28, 27, 26, 25, 39,
        38, 37, 36, 35, 34,
        6, 5, 31, 41, 51,
        1, 0, 30, 40, 50,
        27, 26, 25, 39, 49,
        37, 36, 35, 34, 48,
        47, 46, 45, 44, 43,
        0, 30, 40, 50, 60,
        26, 25, 39, 49, 59,
        36, 35, 34, 48, 58,
        46, 45, 44, 43, 57,
        56, 55, 54, 53, 52];

    const whitePieces = (piece) => {
        return piece == '♙' || piece == '♖' || piece == '♘' || piece == '♗' || piece == '🨢' || piece == '♕';
    }

    const blackPieces = (piece) => {
        return piece == '♟' || piece == '♜' || piece == '♞' || piece == '♝' || piece == '🨨' || piece == '♛';
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
        setSelected({ id: -1, value: false, piece: '', blockedArray: [] });
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
        setSelected({ id: selected.id, value: selected.value, piece: selected.piece, blockedArray: blockedArray });
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
        for (let i = frontArray[index]; i > -1; i = frontArray[i]) {
            if (values[i] != '') {
                if (values[i] == '♜' || values[i] == '♛') {
                    return true;
                } else if (values[i] == '♔' && i == frontArray[index]) {
                    continue;
                }
                break;
            }
        }
        for (let i = backArray[index]; i > -1; i = backArray[i]) {
            if (values[i] != '') {
                if (values[i] == '♜' || values[i] == '♛') {
                    return true;
                } else if (values[i] == '♔' && i == backArray[index]) {
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
        for (let i = frontArray[leftArray[index]]; i > -1; i = frontArray[leftArray[i]]) {
            if (values[i] != '') {
                if (values[i] == '♝' || values[i] == '♛') {
                    return true;
                } else if (values[i] == '♔' && i == frontArray[leftArray[index]]) {
                    continue;
                }
                break;
            }
        }
        for (let i = backArray[rightArray[index]]; i > -1; i = backArray[rightArray[i]]) {
            if (values[i] != '') {
                if (values[i] == '♝' || values[i] == '♛') {
                    return true;
                } else if (values[i] == '♔' && i == backArray[rightArray[index]]) {
                    continue;
                }
                break;
            }
        }
        for (let i = frontArray[rightArray[index]]; i > -1; i = frontArray[rightArray[i]]) {
            if (values[i] != '') {
                if (values[i] == '♝' || values[i] == '♛') {
                    return true;
                } else if (values[i] == '♔' && i == frontArray[rightArray[index]]) {
                    continue;
                }
                break;
            }
        }
        for (let i = backArray[leftArray[index]]; i > -1; i = backArray[leftArray[i]]) {
            if (values[i] != '') {
                if (values[i] == '♝' || values[i] == '♛') {
                    return true;
                } else if (values[i] == '♔' && i == backArray[leftArray[index]]) {
                    continue;
                }
                break;
            }
        }
        for (let i = upArray[frontArray[index]]; i > -1; i = upArray[frontArray[i]]) {
            if (values[i] != '') {
                if (values[i] == '♝' || values[i] == '♛') {
                    return true;
                } else if (values[i] == '♔' && i == upArray[frontArray[index]]) {
                    continue;
                }
                break;
            }
        }
        for (let i = downArray[backArray[index]]; i > -1; i = downArray[backArray[i]]) {
            if (values[i] != '') {
                if (values[i] == '♝' || values[i] == '♛') {
                    return true;
                } else if (values[i] == '♔' && i == downArray[backArray[index]]) {
                    continue;
                }
                break;
            }
        }
        for (let i = upArray[backArray[index]]; i > -1; i = upArray[backArray[i]]) {
            if (values[i] != '') {
                if (values[i] == '♝' || values[i] == '♛') {
                    return true;
                } else if (values[i] == '♔' && i == upArray[backArray[index]]) {
                    continue;
                }
                break;
            }
        }
        for (let i = downArray[frontArray[index]]; i > -1; i = downArray[frontArray[i]]) {
            if (values[i] != '') {
                if (values[i] == '♝' || values[i] == '♛') {
                    return true;
                } else if (values[i] == '♔' && i == downArray[frontArray[index]]) {
                    continue;
                }
                break;
            }
        }
        for (let i = upArray[frontArray[leftArray[index]]]; i > -1; i = upArray[frontArray[leftArray[i]]]) {
            if (values[i] != '') {
                if (values[i] == '🨨' || values[i] == '♛') {
                    return true;
                } else if (values[i] == '♔' && i == upArray[frontArray[leftArray[index]]]) {
                    continue;
                }
                break;
            }
        }
        for (let i = downArray[backArray[leftArray[index]]]; i > -1; i = downArray[backArray[leftArray[i]]]) {
            if (values[i] != '') {
                if (values[i] == '🨨' || values[i] == '♛') {
                    return true;
                } else if (values[i] == '♔' && i == downArray[backArray[leftArray[index]]]) {
                    continue;
                }
                break;
            }
        }
        for (let i = upArray[backArray[leftArray[index]]]; i > -1; i = upArray[backArray[leftArray[i]]]) {
            if (values[i] != '') {
                if (values[i] == '🨨' || values[i] == '♛') {
                    return true;
                } else if (values[i] == '♔' && i == upArray[backArray[leftArray[index]]]) {
                    continue;
                }
                break;
            }
        }
        for (let i = downArray[frontArray[leftArray[index]]]; i > -1; i = downArray[frontArray[leftArray[i]]]) {
            if (values[i] != '') {
                if (values[i] == '🨨' || values[i] == '♛') {
                    return true;
                } else if (values[i] == '♔' && i == downArray[frontArray[leftArray[index]]]) {
                    continue;
                }
                break;
            }
        }
        for (let i = upArray[frontArray[rightArray[index]]]; i > -1; i = upArray[frontArray[rightArray[i]]]) {
            if (values[i] != '') {
                if (values[i] == '🨨' || values[i] == '♛') {
                    return true;
                } else if (values[i] == '♔' && i == upArray[frontArray[rightArray[index]]]) {
                    continue;
                }
                break;
            }
        }
        for (let i = downArray[backArray[rightArray[index]]]; i > -1; i = downArray[backArray[rightArray[i]]]) {
            if (values[i] != '') {
                if (values[i] == '🨨' || values[i] == '♛') {
                    return true;
                } else if (values[i] == '♔' && i == downArray[backArray[rightArray[index]]]) {
                    continue;
                }
                break;
            }
        }
        for (let i = upArray[backArray[rightArray[index]]]; i > -1; i = upArray[backArray[rightArray[i]]]) {
            if (values[i] != '') {
                if (values[i] == '🨨' || values[i] == '♛') {
                    return true;
                } else if (values[i] == '♔' && i == upArray[backArray[rightArray[index]]]) {
                    continue;
                }
                break;
            }
        }
        for (let i = downArray[frontArray[rightArray[index]]]; i > -1; i = downArray[frontArray[rightArray[i]]]) {
            if (values[i] != '') {
                if (values[i] == '🨨' || values[i] == '♛') {
                    return true;
                } else if (values[i] == '♔' && i == downArray[frontArray[rightArray[index]]]) {
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
        if (values[frontArray[index]] == '♚') {
            return true;
        }
        if (values[backArray[index]] == '♚') {
            return true;
        }
        if (values[downArray[leftArray[index]]] == '♚') {
            return true;
        }
        if (values[downArray[rightArray[index]]] == '♚') {
            return true;
        }
        if (values[backArray[leftArray[index]]] == '♚') {
            return true;
        }
        if (values[backArray[rightArray[index]]] == '♚') {
            return true;
        }
        if (values[downArray[frontArray[index]]] == '♚') {
            return true;
        }
        if (values[downArray[backArray[index]]] == '♚') {
            return true;
        }
        if (values[upArray[backArray[index]]] == '♚') {
            return true;
        }
        if (values[frontArray[leftArray[index]]] == '♚' || values[frontArray[leftArray[index]]] == '♟') {
            return true;
        }
        if (values[frontArray[rightArray[index]]] == '♚' || values[frontArray[rightArray[index]]] == '♟') {
            return true;
        }
        if (values[upArray[frontArray[index]]] == '♚' || values[upArray[frontArray[index]]] == '♟') {
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
        if (values[upArray[frontArray[frontArray[index]]]] == '♞') {
            return true;
        }
        if (values[downArray[frontArray[frontArray[index]]]] == '♞') {
            return true;
        }
        if (values[upArray[upArray[frontArray[index]]]] == '♞') {
            return true;
        }
        if (values[downArray[downArray[frontArray[index]]]] == '♞') {
            return true;
        }
        if (values[upArray[backArray[backArray[index]]]] == '♞') {
            return true;
        }
        if (values[downArray[backArray[backArray[index]]]] == '♞') {
            return true;
        }
        if (values[upArray[upArray[backArray[index]]]] == '♞') {
            return true;
        }
        if (values[downArray[downArray[backArray[index]]]] == '♞') {
            return true;
        }
        if (values[frontArray[leftArray[leftArray[index]]]] == '♞') {
            return true;
        }
        if (values[backArray[leftArray[leftArray[index]]]] == '♞') {
            return true;
        }
        if (values[frontArray[frontArray[leftArray[index]]]] == '♞') {
            return true;
        }
        if (values[backArray[backArray[leftArray[index]]]] == '♞') {
            return true;
        }
        if (values[frontArray[rightArray[rightArray[index]]]] == '♞') {
            return true;
        }
        if (values[backArray[rightArray[rightArray[index]]]] == '♞') {
            return true;
        }
        if (values[frontArray[frontArray[rightArray[index]]]] == '♞') {
            return true;
        }
        if (values[backArray[backArray[rightArray[index]]]] == '♞') {
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
        for (let i = frontArray[index]; i > -1; i = frontArray[i]) {
            if (values[i] != '') {
                if (values[i] == '♖' || values[i] == '♕') {
                    return true;
                } else if (values[i] == '♚' && i == frontArray[index]) {
                    continue;
                }
                break;
            }
        }
        for (let i = backArray[index]; i > -1; i = backArray[i]) {
            if (values[i] != '') {
                if (values[i] == '♖' || values[i] == '♕') {
                    return true;
                } else if (values[i] == '♚' && i == backArray[index]) {
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
        for (let i = frontArray[leftArray[index]]; i > -1; i = frontArray[leftArray[i]]) {
            if (values[i] != '') {
                if (values[i] == '♗' || values[i] == '♕') {
                    return true;
                } else if (values[i] == '♚' && i == frontArray[leftArray[index]]) {
                    continue;
                }
                break;
            }
        }
        for (let i = backArray[rightArray[index]]; i > -1; i = backArray[rightArray[i]]) {
            if (values[i] != '') {
                if (values[i] == '♗' || values[i] == '♕') {
                    return true;
                } else if (values[i] == '♚' && i == backArray[rightArray[index]]) {
                    continue;
                }
                break;
            }
        }
        for (let i = frontArray[rightArray[index]]; i > -1; i = frontArray[rightArray[i]]) {
            if (values[i] != '') {
                if (values[i] == '♗' || values[i] == '♕') {
                    return true;
                } else if (values[i] == '♚' && i == frontArray[rightArray[index]]) {
                    continue;
                }
                break;
            }
        }
        for (let i = backArray[leftArray[index]]; i > -1; i = backArray[leftArray[i]]) {
            if (values[i] != '') {
                if (values[i] == '♗' || values[i] == '♕') {
                    return true;
                } else if (values[i] == '♚' && i == backArray[leftArray[index]]) {
                    continue;
                }
                break;
            }
        }
        for (let i = upArray[frontArray[index]]; i > -1; i = upArray[frontArray[i]]) {
            if (values[i] != '') {
                if (values[i] == '♗' || values[i] == '♕') {
                    return true;
                } else if (values[i] == '♚' && i == upArray[frontArray[index]]) {
                    continue;
                }
                break;
            }
        }
        for (let i = downArray[backArray[index]]; i > -1; i = downArray[backArray[i]]) {
            if (values[i] != '') {
                if (values[i] == '♗' || values[i] == '♕') {
                    return true;
                } else if (values[i] == '♚' && i == downArray[backArray[index]]) {
                    continue;
                }
                break;
            }
        }
        for (let i = upArray[backArray[index]]; i > -1; i = upArray[backArray[i]]) {
            if (values[i] != '') {
                if (values[i] == '♗' || values[i] == '♕') {
                    return true;
                } else if (values[i] == '♚' && i == upArray[backArray[index]]) {
                    continue;
                }
                break;
            }
        }
        for (let i = downArray[frontArray[index]]; i > -1; i = downArray[frontArray[i]]) {
            if (values[i] != '') {
                if (values[i] == '♗' || values[i] == '♕') {
                    return true;
                } else if (values[i] == '♚' && i == downArray[frontArray[index]]) {
                    continue;
                }
                break;
            }
        }
        for (let i = upArray[frontArray[leftArray[index]]]; i > -1; i = upArray[frontArray[leftArray[i]]]) {
            if (values[i] != '') {
                if (values[i] == '🨢' || values[i] == '♕') {
                    return true;
                } else if (values[i] == '♚' && i == upArray[frontArray[leftArray[index]]]) {
                    continue;
                }
                break;
            }
        }
        for (let i = downArray[backArray[leftArray[index]]]; i > -1; i = downArray[backArray[leftArray[i]]]) {
            if (values[i] != '') {
                if (values[i] == '🨢' || values[i] == '♕') {
                    return true;
                } else if (values[i] == '♚' && i == downArray[backArray[leftArray[index]]]) {
                    continue;
                }
                break;
            }
        }
        for (let i = upArray[backArray[leftArray[index]]]; i > -1; i = upArray[backArray[leftArray[i]]]) {
            if (values[i] != '') {
                if (values[i] == '🨢' || values[i] == '♕') {
                    return true;
                } else if (values[i] == '♚' && i == upArray[backArray[leftArray[index]]]) {
                    continue;
                }
                break;
            }
        }
        for (let i = downArray[frontArray[leftArray[index]]]; i > -1; i = downArray[frontArray[leftArray[i]]]) {
            if (values[i] != '') {
                if (values[i] == '🨢' || values[i] == '♕') {
                    return true;
                } else if (values[i] == '♚' && i == downArray[frontArray[leftArray[index]]]) {
                    continue;
                }
                break;
            }
        }
        for (let i = upArray[frontArray[rightArray[index]]]; i > -1; i = upArray[frontArray[rightArray[i]]]) {
            if (values[i] != '') {
                if (values[i] == '🨢' || values[i] == '♕') {
                    return true;
                } else if (values[i] == '♚' && i == upArray[frontArray[rightArray[index]]]) {
                    continue;
                }
                break;
            }
        }
        for (let i = downArray[backArray[rightArray[index]]]; i > -1; i = downArray[backArray[rightArray[i]]]) {
            if (values[i] != '') {
                if (values[i] == '🨢' || values[i] == '♕') {
                    return true;
                } else if (values[i] == '♚' && i == downArray[backArray[rightArray[index]]]) {
                    continue;
                }
                break;
            }
        }
        for (let i = upArray[backArray[rightArray[index]]]; i > -1; i = upArray[backArray[rightArray[i]]]) {
            if (values[i] != '') {
                if (values[i] == '🨢' || values[i] == '♕') {
                    return true;
                } else if (values[i] == '♚' && i == upArray[backArray[rightArray[index]]]) {
                    continue;
                }
                break;
            }
        }
        for (let i = downArray[frontArray[rightArray[index]]]; i > -1; i = downArray[frontArray[rightArray[i]]]) {
            if (values[i] != '') {
                if (values[i] == '🨢' || values[i] == '♕') {
                    return true;
                } else if (values[i] == '♚' && i == downArray[frontArray[rightArray[index]]]) {
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
        if (values[frontArray[index]] == '♔') {
            return true;
        }
        if (values[backArray[index]] == '♔') {
            return true;
        }
        if (values[upArray[leftArray[index]]] == '♔') {
            return true;
        }
        if (values[upArray[rightArray[index]]] == '♔') {
            return true;
        }
        if (values[frontArray[leftArray[index]]] == '♔') {
            return true;
        }
        if (values[frontArray[rightArray[index]]] == '♔') {
            return true;
        }
        if (values[upArray[frontArray[index]]] == '♔') {
            return true;
        }
        if (values[upArray[backArray[index]]] == '♔') {
            return true;
        }
        if (values[downArray[frontArray[index]]] == '♔') {
            return true;
        }
        if (values[backArray[leftArray[index]]] == '♔' || values[backArray[leftArray[index]]] == '♙') {
            return true;
        }
        if (values[backArray[rightArray[index]]] == '♔' || values[backArray[rightArray[index]]] == '♙') {
            return true;
        }
        if (values[downArray[backArray[index]]] == '♔' || values[downArray[backArray[index]]] == '♙') {
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
        if (values[upArray[frontArray[frontArray[index]]]] == '♘') {
            return true;
        }
        if (values[downArray[frontArray[frontArray[index]]]] == '♘') {
            return true;
        }
        if (values[upArray[upArray[frontArray[index]]]] == '♘') {
            return true;
        }
        if (values[downArray[downArray[frontArray[index]]]] == '♘') {
            return true;
        }
        if (values[upArray[backArray[backArray[index]]]] == '♘') {
            return true;
        }
        if (values[downArray[backArray[backArray[index]]]] == '♘') {
            return true;
        }
        if (values[upArray[upArray[backArray[index]]]] == '♘') {
            return true;
        }
        if (values[downArray[downArray[backArray[index]]]] == '♘') {
            return true;
        }
        if (values[frontArray[leftArray[leftArray[index]]]] == '♘') {
            return true;
        }
        if (values[backArray[leftArray[leftArray[index]]]] == '♘') {
            return true;
        }
        if (values[frontArray[frontArray[leftArray[index]]]] == '♘') {
            return true;
        }
        if (values[backArray[backArray[leftArray[index]]]] == '♘') {
            return true;
        }
        if (values[frontArray[rightArray[rightArray[index]]]] == '♘') {
            return true;
        }
        if (values[backArray[rightArray[rightArray[index]]]] == '♘') {
            return true;
        }
        if (values[frontArray[frontArray[rightArray[index]]]] == '♘') {
            return true;
        }
        if (values[backArray[backArray[rightArray[index]]]] == '♘') {
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
        for (let i = frontArray[index]; i > -1; i = frontArray[i]) {
            if (values[i] != '') {
                if (whitePieces(values[i])) {
                    if (disce == -1) {
                        disce = i;
                        continue;
                    }
                    break;
                } else if (disce > -1) {
                    if (values[i] == '♜' || values[i] == '♛') {
                        discoverArray.push({ direction: 'front', piece: disce });
                        break;
                    }
                    break;
                }
                break;
            }
        }
        var discf = -1;
        for (let i = backArray[index]; i > -1; i = backArray[i]) {
            if (values[i] != '') {
                if (whitePieces(values[i])) {
                    if (discf == -1) {
                        discf = i;
                        continue;
                    }
                    break;
                } else if (discf > -1) {
                    if (values[i] == '♜' || values[i] == '♛') {
                        discoverArray.push({ direction: 'back', piece: discf });
                        break;
                    }
                    break;
                }
                break;
            }
        }
        var discg = -1;
        for (let i = upArray[leftArray[index]]; i > -1; i = upArray[leftArray[i]]) {
            if (values[i] != '') {
                if (whitePieces(values[i])) {
                    if (discg == -1) {
                        discg = i;
                        continue;
                    }
                    break;
                } else if (discg > -1) {
                    if (values[i] == '♝' || values[i] == '♛') {
                        discoverArray.push({ direction: 'up-left', piece: discg });
                        break;
                    }
                    break;
                }
                break;
            }
        }
        var disch = -1;
        for (let i = downArray[rightArray[index]]; i > -1; i = downArray[rightArray[i]]) {
            if (values[i] != '') {
                if (whitePieces(values[i])) {
                    if (disch == -1) {
                        disch = i;
                        continue;
                    }
                    break;
                } else if (disch > -1) {
                    if (values[i] == '♝' || values[i] == '♛') {
                        discoverArray.push({ direction: 'down-right', piece: disch });
                        break;
                    }
                    break;
                }
                break;
            }
        }
        var disci = -1;
        for (let i = upArray[rightArray[index]]; i > -1; i = upArray[rightArray[i]]) {
            if (values[i] != '') {
                if (whitePieces(values[i])) {
                    if (disci == -1) {
                        disci = i;
                        continue;
                    }
                    break;
                } else if (disci > -1) {
                    if (values[i] == '♝' || values[i] == '♛') {
                        discoverArray.push({ direction: 'up-right', piece: disci });
                        break;
                    }
                    break;
                }
                break;
            }
        }
        var discj = -1;
        for (let i = downArray[leftArray[index]]; i > -1; i = downArray[leftArray[i]]) {
            if (values[i] != '') {
                if (whitePieces(values[i])) {
                    if (discj == -1) {
                        discj = i;
                        continue;
                    }
                    break;
                } else if (discj > -1) {
                    if (values[i] == '♝' || values[i] == '♛') {
                        discoverArray.push({ direction: 'down-left', piece: discj });
                        break;
                    }
                    break;
                }
                break;
            }
        }
        var disck = -1;
        for (let i = upArray[frontArray[index]]; i > -1; i = upArray[frontArray[i]]) {
            if (values[i] != '') {
                if (whitePieces(values[i])) {
                    if (disck == -1) {
                        disck = i;
                        continue;
                    }
                    break;
                } else if (disck > -1) {
                    if (values[i] == '♝' || values[i] == '♛') {
                        discoverArray.push({ direction: 'up-front', piece: disck });
                        break;
                    }
                    break;
                }
                break;
            }
        }
        var discl = -1;
        for (let i = downArray[backArray[index]]; i > -1; i = downArray[backArray[i]]) {
            if (values[i] != '') {
                if (whitePieces(values[i])) {
                    if (discl == -1) {
                        discl = i;
                        continue;
                    }
                    break;
                } else if (discl > -1) {
                    if (values[i] == '♝' || values[i] == '♛') {
                        discoverArray.push({ direction: 'down-back', piece: discl });
                        break;
                    }
                    break;
                }
                break;
            }
        }
        var discm = -1;
        for (let i = upArray[backArray[index]]; i > -1; i = upArray[backArray[i]]) {
            if (values[i] != '') {
                if (whitePieces(values[i])) {
                    if (discm == -1) {
                        discm = i;
                        continue;
                    }
                    break;
                } else if (discm > -1) {
                    if (values[i] == '♝' || values[i] == '♛') {
                        discoverArray.push({ direction: 'up-back', piece: discm });
                        break;
                    }
                    break;
                }
                break;
            }
        }
        var discn = -1;
        for (let i = downArray[frontArray[index]]; i > -1; i = downArray[frontArray[i]]) {
            if (values[i] != '') {
                if (whitePieces(values[i])) {
                    if (discn == -1) {
                        discn = i;
                        continue;
                    }
                    break;
                } else if (discn > -1) {
                    if (values[i] == '♝' || values[i] == '♛') {
                        discoverArray.push({ direction: 'down-front', piece: discn });
                        break;
                    }
                    break;
                }
                break;
            }
        }
        var disco = -1;
        for (let i = frontArray[leftArray[index]]; i > -1; i = frontArray[leftArray[i]]) {
            if (values[i] != '') {
                if (whitePieces(values[i])) {
                    if (disco == -1) {
                        disco = i;
                        continue;
                    }
                    break;
                } else if (disco > -1) {
                    if (values[i] == '♝' || values[i] == '♛') {
                        discoverArray.push({ direction: 'front-left', piece: disco });
                        break;
                    }
                    break;
                }
                break;
            }
        }
        var discp = -1;
        for (let i = backArray[rightArray[index]]; i > -1; i = backArray[rightArray[i]]) {
            if (values[i] != '') {
                if (whitePieces(values[i])) {
                    if (discp == -1) {
                        discp = i;
                        continue;
                    }
                    break;
                } else if (discp > -1) {
                    if (values[i] == '♝' || values[i] == '♛') {
                        discoverArray.push({ direction: 'back-right', piece: discp });
                        break;
                    }
                    break;
                }
                break;
            }
        }
        var discq = -1;
        for (let i = frontArray[rightArray[index]]; i > -1; i = frontArray[rightArray[i]]) {
            if (values[i] != '') {
                if (whitePieces(values[i])) {
                    if (discq == -1) {
                        discq = i;
                        continue;
                    }
                    break;
                } else if (discq > -1) {
                    if (values[i] == '♝' || values[i] == '♛') {
                        discoverArray.push({ direction: 'front-right', piece: discq });
                        break;
                    }
                    break;
                }
                break;
            }
        }
        var discr = -1;
        for (let i = backArray[leftArray[index]]; i > -1; i = backArray[leftArray[i]]) {
            if (values[i] != '') {
                if (whitePieces(values[i])) {
                    if (discr == -1) {
                        discr = i;
                        continue;
                    }
                    break;
                } else if (discr > -1) {
                    if (values[i] == '♝' || values[i] == '♛') {
                        discoverArray.push({ direction: 'back-left', piece: discr });
                        break;
                    }
                    break;
                }
                break;
            }
        }
        var discs = -1;
        for (let i = upArray[frontArray[leftArray[index]]]; i > -1; i = upArray[frontArray[leftArray[i]]]) {
            if (values[i] != '') {
                if (whitePieces(values[i])) {
                    if (discs == -1) {
                        discs = i;
                        continue;
                    }
                    break;
                } else if (discs > -1) {
                    if (values[i] == '🨨' || values[i] == '♛') {
                        discoverArray.push({ direction: 'up-front-left', piece: discs });
                        break;
                    }
                    break;
                }
                break;
            }
        }
        var disct = -1;
        for (let i = downArray[frontArray[rightArray[index]]]; i > -1; i = downArray[frontArray[rightArray[i]]]) {
            if (values[i] != '') {
                if (whitePieces(values[i])) {
                    if (disct == -1) {
                        disct = i;
                        continue;
                    }
                    break;
                } else if (disct > -1) {
                    if (values[i] == '🨨' || values[i] == '♛') {
                        discoverArray.push({ direction: 'down-front-right', piece: disct });
                        break;
                    }
                    break;
                }
                break;
            }
        }
        var discu = -1;
        for (let i = upArray[frontArray[rightArray[index]]]; i > -1; i = upArray[frontArray[rightArray[i]]]) {
            if (values[i] != '') {
                if (whitePieces(values[i])) {
                    if (discu == -1) {
                        discu = i;
                        continue;
                    }
                    break;
                } else if (discu > -1) {
                    if (values[i] == '🨨' || values[i] == '♛') {
                        discoverArray.push({ direction: 'up-front-right', piece: discu });
                        break;
                    }
                    break;
                }
                break;
            }
        }
        var discv = -1;
        for (let i = downArray[frontArray[leftArray[index]]]; i > -1; i = downArray[frontArray[leftArray[i]]]) {
            if (values[i] != '') {
                if (whitePieces(values[i])) {
                    if (discv == -1) {
                        discv = i;
                        continue;
                    }
                    break;
                } else if (discv > -1) {
                    if (values[i] == '🨨' || values[i] == '♛') {
                        discoverArray.push({ direction: 'down-front-left', piece: discv });
                        break;
                    }
                    break;
                }
                break;
            }
        }
        var discw = -1;
        for (let i = upArray[backArray[leftArray[index]]]; i > -1; i = upArray[backArray[leftArray[i]]]) {
            if (values[i] != '') {
                if (whitePieces(values[i])) {
                    if (discw == -1) {
                        discw = i;
                        continue;
                    }
                    break;
                } else if (discw > -1) {
                    if (values[i] == '🨨' || values[i] == '♛') {
                        discoverArray.push({ direction: 'up-back-left', piece: discw });
                        break;
                    }
                    break;
                }
                break;
            }
        }
        var discx = -1;
        for (let i = downArray[backArray[rightArray[index]]]; i > -1; i = downArray[backArray[rightArray[i]]]) {
            if (values[i] != '') {
                if (whitePieces(values[i])) {
                    if (discx == -1) {
                        discx = i;
                        continue;
                    }
                    break;
                } else if (discx > -1) {
                    if (values[i] == '🨨' || values[i] == '♛') {
                        discoverArray.push({ direction: 'down-back-right', piece: discx });
                        break;
                    }
                    break;
                }
                break;
            }
        }
        var discy = -1;
        for (let i = upArray[backArray[rightArray[index]]]; i > -1; i = upArray[backArray[rightArray[i]]]) {
            if (values[i] != '') {
                if (whitePieces(values[i])) {
                    if (discy == -1) {
                        discy = i;
                        continue;
                    }
                    break;
                } else if (discy > -1) {
                    if (values[i] == '🨨' || values[i] == '♛') {
                        discoverArray.push({ direction: 'up-back-right', piece: discy });
                        break;
                    }
                    break;
                }
                break;
            }
        }
        var discz = -1;
        for (let i = downArray[backArray[leftArray[index]]]; i > -1; i = downArray[backArray[leftArray[i]]]) {
            if (values[i] != '') {
                if (whitePieces(values[i])) {
                    if (discz == -1) {
                        discz = i;
                        continue;
                    }
                    break;
                } else if (discz > -1) {
                    if (values[i] == '🨨' || values[i] == '♛') {
                        discoverArray.push({ direction: 'down-back-left', piece: discz });
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
        for (let i = frontArray[index]; i > -1; i = frontArray[i]) {
            if (values[i] != '') {
                if (blackPieces(values[i])) {
                    if (disce == -1) {
                        disce = i;
                        continue;
                    }
                    break;
                } else if (disce > -1) {
                    if (values[i] == '♖' || values[i] == '♕') {
                        discoverArray.push({ direction: 'front', piece: disce });
                        break;
                    }
                    break;
                }
                break;
            }
        }
        var discf = -1;
        for (let i = backArray[index]; i > -1; i = backArray[i]) {
            if (values[i] != '') {
                if (blackPieces(values[i])) {
                    if (discf == -1) {
                        discf = i;
                        continue;
                    }
                    break;
                } else if (discf > -1) {
                    if (values[i] == '♖' || values[i] == '♕') {
                        discoverArray.push({ direction: 'back', piece: discf });
                        break;
                    }
                    break;
                }
                break;
            }
        }
        var discg = -1;
        for (let i = upArray[leftArray[index]]; i > -1; i = upArray[leftArray[i]]) {
            if (values[i] != '') {
                if (blackPieces(values[i])) {
                    if (discg == -1) {
                        discg = i;
                        continue;
                    }
                    break;
                } else if (discg > -1) {
                    if (values[i] == '♗' || values[i] == '♕') {
                        discoverArray.push({ direction: 'up-left', piece: discg });
                        break;
                    }
                    break;
                }
                break;
            }
        }
        var disch = -1;
        for (let i = downArray[rightArray[index]]; i > -1; i = downArray[rightArray[i]]) {
            if (values[i] != '') {
                if (blackPieces(values[i])) {
                    if (disch == -1) {
                        disch = i;
                        continue;
                    }
                    break;
                } else if (disch > -1) {
                    if (values[i] == '♗' || values[i] == '♕') {
                        discoverArray.push({ direction: 'down-right', piece: disch });
                        break;
                    }
                    break;
                }
                break;
            }
        }
        var disci = -1;
        for (let i = upArray[rightArray[index]]; i > -1; i = upArray[rightArray[i]]) {
            if (values[i] != '') {
                if (blackPieces(values[i])) {
                    if (disci == -1) {
                        disci = i;
                        continue;
                    }
                    break;
                } else if (disci > -1) {
                    if (values[i] == '♗' || values[i] == '♕') {
                        discoverArray.push({ direction: 'up-right', piece: disci });
                        break;
                    }
                    break;
                }
                break;
            }
        }
        var discj = -1;
        for (let i = downArray[leftArray[index]]; i > -1; i = downArray[leftArray[i]]) {
            if (values[i] != '') {
                if (blackPieces(values[i])) {
                    if (discj == -1) {
                        discj = i;
                        continue;
                    }
                    break;
                } else if (discj > -1) {
                    if (values[i] == '♗' || values[i] == '♕') {
                        discoverArray.push({ direction: 'down-left', piece: discj });
                        break;
                    }
                    break;
                }
                break;
            }
        }
        var disck = -1;
        for (let i = upArray[frontArray[index]]; i > -1; i = upArray[frontArray[i]]) {
            if (values[i] != '') {
                if (blackPieces(values[i])) {
                    if (disck == -1) {
                        disck = i;
                        continue;
                    }
                    break;
                } else if (disck > -1) {
                    if (values[i] == '♗' || values[i] == '♕') {
                        discoverArray.push({ direction: 'up-front', piece: disck });
                        break;
                    }
                    break;
                }
                break;
            }
        }
        var discl = -1;
        for (let i = downArray[backArray[index]]; i > -1; i = downArray[backArray[i]]) {
            if (values[i] != '') {
                if (blackPieces(values[i])) {
                    if (discl == -1) {
                        discl = i;
                        continue;
                    }
                    break;
                } else if (discl > -1) {
                    if (values[i] == '♗' || values[i] == '♕') {
                        discoverArray.push({ direction: 'down-back', piece: discl });
                        break;
                    }
                    break;
                }
                break;
            }
        }
        var discm = -1;
        for (let i = upArray[backArray[index]]; i > -1; i = upArray[backArray[i]]) {
            if (values[i] != '') {
                if (blackPieces(values[i])) {
                    if (discm == -1) {
                        discm = i;
                        continue;
                    }
                    break;
                } else if (discm > -1) {
                    if (values[i] == '♗' || values[i] == '♕') {
                        discoverArray.push({ direction: 'up-back', piece: discm });
                        break;
                    }
                    break;
                }
                break;
            }
        }
        var discn = -1;
        for (let i = downArray[frontArray[index]]; i > -1; i = downArray[frontArray[i]]) {
            if (values[i] != '') {
                if (blackPieces(values[i])) {
                    if (discn == -1) {
                        discn = i;
                        continue;
                    }
                    break;
                } else if (discn > -1) {
                    if (values[i] == '♗' || values[i] == '♕') {
                        discoverArray.push({ direction: 'down-front', piece: discn });
                        break;
                    }
                    break;
                }
                break;
            }
        }
        var disco = -1;
        for (let i = frontArray[leftArray[index]]; i > -1; i = frontArray[leftArray[i]]) {
            if (values[i] != '') {
                if (blackPieces(values[i])) {
                    if (disco == -1) {
                        disco = i;
                        continue;
                    }
                    break;
                } else if (disco > -1) {
                    if (values[i] == '♗' || values[i] == '♕') {
                        discoverArray.push({ direction: 'front-left', piece: disco });
                        break;
                    }
                    break;
                }
                break;
            }
        }
        var discp = -1;
        for (let i = backArray[rightArray[index]]; i > -1; i = backArray[rightArray[i]]) {
            if (values[i] != '') {
                if (blackPieces(values[i])) {
                    if (discp == -1) {
                        discp = i;
                        continue;
                    }
                    break;
                } else if (discp > -1) {
                    if (values[i] == '♗' || values[i] == '♕') {
                        discoverArray.push({ direction: 'back-right', piece: discp });
                        break;
                    }
                    break;
                }
                break;
            }
        }
        var discq = -1;
        for (let i = frontArray[rightArray[index]]; i > -1; i = frontArray[rightArray[i]]) {
            if (values[i] != '') {
                if (blackPieces(values[i])) {
                    if (discq == -1) {
                        discq = i;
                        continue;
                    }
                    break;
                } else if (discq > -1) {
                    if (values[i] == '♗' || values[i] == '♕') {
                        discoverArray.push({ direction: 'front-right', piece: discq });
                        break;
                    }
                    break;
                }
                break;
            }
        }
        var discr = -1;
        for (let i = backArray[leftArray[index]]; i > -1; i = backArray[leftArray[i]]) {
            if (values[i] != '') {
                if (blackPieces(values[i])) {
                    if (discr == -1) {
                        discr = i;
                        continue;
                    }
                    break;
                } else if (discr > -1) {
                    if (values[i] == '♗' || values[i] == '♕') {
                        discoverArray.push({ direction: 'back-left', piece: discr });
                        break;
                    }
                    break;
                }
                break;
            }
        }
        var discs = -1;
        for (let i = upArray[frontArray[leftArray[index]]]; i > -1; i = upArray[frontArray[leftArray[i]]]) {
            if (values[i] != '') {
                if (blackPieces(values[i])) {
                    if (discs == -1) {
                        discs = i;
                        continue;
                    }
                    break;
                } else if (discs > -1) {
                    if (values[i] == '🨢' || values[i] == '♕') {
                        discoverArray.push({ direction: 'up-front-left', piece: discs });
                        break;
                    }
                    break;
                }
                break;
            }
        }
        var disct = -1;
        for (let i = downArray[frontArray[rightArray[index]]]; i > -1; i = downArray[frontArray[rightArray[i]]]) {
            if (values[i] != '') {
                if (blackPieces(values[i])) {
                    if (disct == -1) {
                        disct = i;
                        continue;
                    }
                    break;
                } else if (disct > -1) {
                    if (values[i] == '🨢' || values[i] == '♕') {
                        discoverArray.push({ direction: 'down-front-right', piece: disct });
                        break;
                    }
                    break;
                }
                break;
            }
        }
        var discu = -1;
        for (let i = upArray[frontArray[rightArray[index]]]; i > -1; i = upArray[frontArray[rightArray[i]]]) {
            if (values[i] != '') {
                if (blackPieces(values[i])) {
                    if (discu == -1) {
                        discu = i;
                        continue;
                    }
                    break;
                } else if (discu > -1) {
                    if (values[i] == '🨢' || values[i] == '♕') {
                        discoverArray.push({ direction: 'up-front-right', piece: discu });
                        break;
                    }
                    break;
                }
                break;
            }
        }
        var discv = -1;
        for (let i = downArray[frontArray[leftArray[index]]]; i > -1; i = downArray[frontArray[leftArray[i]]]) {
            if (values[i] != '') {
                if (blackPieces(values[i])) {
                    if (discv == -1) {
                        discv = i;
                        continue;
                    }
                    break;
                } else if (discv > -1) {
                    if (values[i] == '🨢' || values[i] == '♕') {
                        discoverArray.push({ direction: 'down-front-left', piece: discv });
                        break;
                    }
                    break;
                }
                break;
            }
        }
        var discw = -1;
        for (let i = upArray[backArray[leftArray[index]]]; i > -1; i = upArray[backArray[leftArray[i]]]) {
            if (values[i] != '') {
                if (blackPieces(values[i])) {
                    if (discw == -1) {
                        discw = i;
                        continue;
                    }
                    break;
                } else if (discw > -1) {
                    if (values[i] == '🨢' || values[i] == '♕') {
                        discoverArray.push({ direction: 'up-back-left', piece: discw });
                        break;
                    }
                    break;
                }
                break;
            }
        }
        var discx = -1;
        for (let i = downArray[backArray[rightArray[index]]]; i > -1; i = downArray[backArray[rightArray[i]]]) {
            if (values[i] != '') {
                if (blackPieces(values[i])) {
                    if (discx == -1) {
                        discx = i;
                        continue;
                    }
                    break;
                } else if (discx > -1) {
                    if (values[i] == '🨢' || values[i] == '♕') {
                        discoverArray.push({ direction: 'down-back-right', piece: discx });
                        break;
                    }
                    break;
                }
                break;
            }
        }
        var discy = -1;
        for (let i = upArray[backArray[rightArray[index]]]; i > -1; i = upArray[backArray[rightArray[i]]]) {
            if (values[i] != '') {
                if (blackPieces(values[i])) {
                    if (discy == -1) {
                        discy = i;
                        continue;
                    }
                    break;
                } else if (discy > -1) {
                    if (values[i] == '🨢' || values[i] == '♕') {
                        discoverArray.push({ direction: 'up-back-right', piece: discy });
                        break;
                    }
                    break;
                }
                break;
            }
        }
        var discz = -1;
        for (let i = downArray[backArray[leftArray[index]]]; i > -1; i = downArray[backArray[leftArray[i]]]) {
            if (values[i] != '') {
                if (blackPieces(values[i])) {
                    if (discz == -1) {
                        discz = i;
                        continue;
                    }
                    break;
                } else if (discz > -1) {
                    if (values[i] == '🨢' || values[i] == '♕') {
                        discoverArray.push({ direction: 'down-back-left', piece: discz });
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
            for (let i = frontArray[index]; i > -1; i = frontArray[i]) {
                if (values[i] != '') {
                    if (values[i] == '♖' || values[i] == '♕') {
                        checkArray.push({ index: i, piece: values[i] });
                        break;
                    }
                    break;
                }
            }
            for (let i = backArray[index]; i > -1; i = backArray[i]) {
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
            for (let i = upArray[frontArray[index]]; i > -1; i = upArray[frontArray[i]]) {
                if (values[i] != '') {
                    if (values[i] == '♗' || values[i] == '♕') {
                        checkArray.push({ index: i, piece: values[i] });
                        break;
                    }
                    break;
                }
            }
            for (let i = downArray[backArray[index]]; i > -1; i = downArray[backArray[i]]) {
                if (values[i] != '') {
                    if (values[i] == '♗' || values[i] == '♕') {
                        checkArray.push({ index: i, piece: values[i] });
                        break;
                    }
                    break;
                }
            }
            for (let i = upArray[backArray[index]]; i > -1; i = upArray[backArray[i]]) {
                if (values[i] != '') {
                    if (values[i] == '♗' || values[i] == '♕') {
                        checkArray.push({ index: i, piece: values[i] });
                        break;
                    }
                    break;
                }
            }
            for (let i = downArray[frontArray[index]]; i > -1; i = downArray[frontArray[i]]) {
                if (values[i] != '') {
                    if (values[i] == '♗' || values[i] == '♕') {
                        checkArray.push({ index: i, piece: values[i] });
                        break;
                    }
                    break;
                }
            }
            for (let i = frontArray[leftArray[index]]; i > -1; i = frontArray[leftArray[i]]) {
                if (values[i] != '') {
                    if (values[i] == '♗' || values[i] == '♕') {
                        checkArray.push({ index: i, piece: values[i] });
                        break;
                    }
                    break;
                }
            }
            for (let i = backArray[rightArray[index]]; i > -1; i = backArray[rightArray[i]]) {
                if (values[i] != '') {
                    if (values[i] == '♗' || values[i] == '♕') {
                        checkArray.push({ index: i, piece: values[i] });
                        break;
                    }
                    break;
                }
            }
            for (let i = frontArray[rightArray[index]]; i > -1; i = frontArray[rightArray[i]]) {
                if (values[i] != '') {
                    if (values[i] == '♗' || values[i] == '♕') {
                        checkArray.push({ index: i, piece: values[i] });
                        break;
                    }
                    break;
                }
            }
            for (let i = backArray[leftArray[index]]; i > -1; i = backArray[leftArray[i]]) {
                if (values[i] != '') {
                    if (values[i] == '♗' || values[i] == '♕') {
                        checkArray.push({ index: i, piece: values[i] });
                        break;
                    }
                    break;
                }
            }
            for (let i = upArray[frontArray[leftArray[index]]]; i > -1; i = upArray[frontArray[leftArray[i]]]) {
                if (values[i] != '') {
                    if (values[i] == '🨢' || values[i] == '♕') {
                        checkArray.push({ index: i, piece: values[i] });
                        break;
                    }
                    break;
                }
            }
            for (let i = downArray[frontArray[rightArray[index]]]; i > -1; i = downArray[frontArray[rightArray[i]]]) {
                if (values[i] != '') {
                    if (values[i] == '🨢' || values[i] == '♕') {
                        checkArray.push({ index: i, piece: values[i] });
                        break;
                    }
                    break;
                }
            }
            for (let i = upArray[frontArray[rightArray[index]]]; i > -1; i = upArray[frontArray[rightArray[i]]]) {
                if (values[i] != '') {
                    if (values[i] == '🨢' || values[i] == '♕') {
                        checkArray.push({ index: i, piece: values[i] });
                        break;
                    }
                    break;
                }
            }
            for (let i = downArray[frontArray[leftArray[index]]]; i > -1; i = downArray[frontArray[leftArray[i]]]) {
                if (values[i] != '') {
                    if (values[i] == '🨢' || values[i] == '♕') {
                        checkArray.push({ index: i, piece: values[i] });
                        break;
                    }
                    break;
                }
            }
            for (let i = upArray[backArray[leftArray[index]]]; i > -1; i = upArray[backArray[leftArray[i]]]) {
                if (values[i] != '') {
                    if (values[i] == '🨢' || values[i] == '♕') {
                        checkArray.push({ index: i, piece: values[i] });
                        break;
                    }
                    break;
                }
            }
            for (let i = downArray[backArray[rightArray[index]]]; i > -1; i = downArray[backArray[rightArray[i]]]) {
                if (values[i] != '') {
                    if (values[i] == '🨢' || values[i] == '♕') {
                        checkArray.push({ index: i, piece: values[i] });
                        break;
                    }
                    break;
                }
            }
            for (let i = upArray[backArray[rightArray[index]]]; i > -1; i = upArray[backArray[rightArray[i]]]) {
                if (values[i] != '') {
                    if (values[i] == '🨢' || values[i] == '♕') {
                        checkArray.push({ index: i, piece: values[i] });
                        break;
                    }
                    break;
                }
            }
            for (let i = downArray[backArray[leftArray[index]]]; i > -1; i = downArray[backArray[leftArray[i]]]) {
                if (values[i] != '') {
                    if (values[i] == '🨢' || values[i] == '♕') {
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
            if (values[downArray[backArray[index]]] == '♙') {
                checkArray.push({ index: downArray[backArray[index]], piece: '♙' });
            }
            if (values[backArray[leftArray[index]]] == '♙') {
                checkArray.push({ index: backArray[leftArray[index]], piece: '♙' });
            }
            if (values[backArray[rightArray[index]]] == '♙') {
                checkArray.push({ index: backArray[rightArray[index]], piece: '♙' });
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
            if (values[upArray[frontArray[frontArray[index]]]] == '♘') {
                checkArray.push({ index: upArray[frontArray[frontArray[index]]], piece: '♘' });
            }
            if (values[downArray[frontArray[frontArray[index]]]] == '♘') {
                checkArray.push({ index: downArray[frontArray[frontArray[index]]], piece: '♘' });
            }
            if (values[upArray[upArray[frontArray[index]]]] == '♘') {
                checkArray.push({ index: upArray[upArray[frontArray[index]]], piece: '♘' });
            }
            if (values[downArray[downArray[frontArray[index]]]] == '♘') {
                checkArray.push({ index: downArray[downArray[frontArray[index]]], piece: '♘' });
            }
            if (values[upArray[backArray[backArray[index]]]] == '♘') {
                checkArray.push({ index: upArray[backArray[backArray[index]]], piece: '♘' });
            }
            if (values[downArray[backArray[backArray[index]]]] == '♘') {
                checkArray.push({ index: downArray[backArray[backArray[index]]], piece: '♘' });
            }
            if (values[upArray[upArray[backArray[index]]]] == '♘') {
                checkArray.push({ index: upArray[upArray[backArray[index]]], piece: '♘' });
            }
            if (values[downArray[downArray[backArray[index]]]] == '♘') {
                checkArray.push({ index: downArray[downArray[backArray[index]]], piece: '♘' });
            }
            if (values[frontArray[leftArray[leftArray[index]]]] == '♘') {
                checkArray.push({ index: frontArray[leftArray[leftArray[index]]], piece: '♘' });
            }
            if (values[backArray[leftArray[leftArray[index]]]] == '♘') {
                checkArray.push({ index: backArray[leftArray[leftArray[index]]], piece: '♘' });
            }
            if (values[frontArray[frontArray[leftArray[index]]]] == '♘') {
                checkArray.push({ index: frontArray[frontArray[leftArray[index]]], piece: '♘' });
            }
            if (values[backArray[backArray[leftArray[index]]]] == '♘') {
                checkArray.push({ index: backArray[backArray[leftArray[index]]], piece: '♘' });
            }
            if (values[frontArray[rightArray[rightArray[index]]]] == '♘') {
                checkArray.push({ index: frontArray[rightArray[rightArray[index]]], piece: '♘' });
            }
            if (values[backArray[rightArray[rightArray[index]]]] == '♘') {
                checkArray.push({ index: backArray[rightArray[rightArray[index]]], piece: '♘' });
            }
            if (values[frontArray[frontArray[rightArray[index]]]] == '♘') {
                checkArray.push({ index: frontArray[frontArray[rightArray[index]]], piece: '♘' });
            }
            if (values[backArray[backArray[rightArray[index]]]] == '♘') {
                checkArray.push({ index: backArray[backArray[rightArray[index]]], piece: '♘' });
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
            for (let i = frontArray[index]; i > -1; i = frontArray[i]) {
                if (values[i] != '') {
                    if (values[i] == '♜' || values[i] == '♛') {
                        checkArray.push({ index: i, piece: values[i] });
                        break;
                    }
                    break;
                }
            }
            for (let i = backArray[index]; i > -1; i = backArray[i]) {
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
            for (let i = upArray[frontArray[index]]; i > -1; i = upArray[frontArray[i]]) {
                if (values[i] != '') {
                    if (values[i] == '♝' || values[i] == '♛') {
                        checkArray.push({ index: i, piece: values[i] });
                        break;
                    }
                    break;
                }
            }
            for (let i = downArray[backArray[index]]; i > -1; i = downArray[backArray[i]]) {
                if (values[i] != '') {
                    if (values[i] == '♝' || values[i] == '♛') {
                        checkArray.push({ index: i, piece: values[i] });
                        break;
                    }
                    break;
                }
            }
            for (let i = upArray[backArray[index]]; i > -1; i = upArray[backArray[i]]) {
                if (values[i] != '') {
                    if (values[i] == '♝' || values[i] == '♛') {
                        checkArray.push({ index: i, piece: values[i] });
                        break;
                    }
                    break;
                }
            }
            for (let i = downArray[frontArray[index]]; i > -1; i = downArray[frontArray[i]]) {
                if (values[i] != '') {
                    if (values[i] == '♝' || values[i] == '♛') {
                        checkArray.push({ index: i, piece: values[i] });
                        break;
                    }
                    break;
                }
            }
            for (let i = frontArray[leftArray[index]]; i > -1; i = frontArray[leftArray[i]]) {
                if (values[i] != '') {
                    if (values[i] == '♝' || values[i] == '♛') {
                        checkArray.push({ index: i, piece: values[i] });
                        break;
                    }
                    break;
                }
            }
            for (let i = backArray[rightArray[index]]; i > -1; i = backArray[rightArray[i]]) {
                if (values[i] != '') {
                    if (values[i] == '♝' || values[i] == '♛') {
                        checkArray.push({ index: i, piece: values[i] });
                        break;
                    }
                    break;
                }
            }
            for (let i = frontArray[rightArray[index]]; i > -1; i = frontArray[rightArray[i]]) {
                if (values[i] != '') {
                    if (values[i] == '♝' || values[i] == '♛') {
                        checkArray.push({ index: i, piece: values[i] });
                        break;
                    }
                    break;
                }
            }
            for (let i = backArray[leftArray[index]]; i > -1; i = backArray[leftArray[i]]) {
                if (values[i] != '') {
                    if (values[i] == '♝' || values[i] == '♛') {
                        checkArray.push({ index: i, piece: values[i] });
                        break;
                    }
                    break;
                }
            }
            for (let i = upArray[frontArray[leftArray[index]]]; i > -1; i = upArray[frontArray[leftArray[i]]]) {
                if (values[i] != '') {
                    if (values[i] == '🨨' || values[i] == '♛') {
                        checkArray.push({ index: i, piece: values[i] });
                        break;
                    }
                    break;
                }
            }
            for (let i = downArray[frontArray[rightArray[index]]]; i > -1; i = downArray[frontArray[rightArray[i]]]) {
                if (values[i] != '') {
                    if (values[i] == '🨨' || values[i] == '♛') {
                        checkArray.push({ index: i, piece: values[i] });
                        break;
                    }
                    break;
                }
            }
            for (let i = upArray[frontArray[rightArray[index]]]; i > -1; i = upArray[frontArray[rightArray[i]]]) {
                if (values[i] != '') {
                    if (values[i] == '🨨' || values[i] == '♛') {
                        checkArray.push({ index: i, piece: values[i] });
                        break;
                    }
                    break;
                }
            }
            for (let i = downArray[frontArray[leftArray[index]]]; i > -1; i = downArray[frontArray[leftArray[i]]]) {
                if (values[i] != '') {
                    if (values[i] == '🨨' || values[i] == '♛') {
                        checkArray.push({ index: i, piece: values[i] });
                        break;
                    }
                    break;
                }
            }
            for (let i = upArray[backArray[leftArray[index]]]; i > -1; i = upArray[backArray[leftArray[i]]]) {
                if (values[i] != '') {
                    if (values[i] == '🨨' || values[i] == '♛') {
                        checkArray.push({ index: i, piece: values[i] });
                        break;
                    }
                    break;
                }
            }
            for (let i = downArray[backArray[rightArray[index]]]; i > -1; i = downArray[backArray[rightArray[i]]]) {
                if (values[i] != '') {
                    if (values[i] == '🨨' || values[i] == '♛') {
                        checkArray.push({ index: i, piece: values[i] });
                        break;
                    }
                    break;
                }
            }
            for (let i = upArray[backArray[rightArray[index]]]; i > -1; i = upArray[backArray[rightArray[i]]]) {
                if (values[i] != '') {
                    if (values[i] == '🨨' || values[i] == '♛') {
                        checkArray.push({ index: i, piece: values[i] });
                        break;
                    }
                    break;
                }
            }
            for (let i = downArray[backArray[leftArray[index]]]; i > -1; i = downArray[backArray[leftArray[i]]]) {
                if (values[i] != '') {
                    if (values[i] == '🨨' || values[i] == '♛') {
                        checkArray.push({ index: i, piece: values[i] });
                        break;
                    }
                    break;
                }
            }
            if (values[downArray[leftArray[index]]] == '♟') {
                checkArray.push({ index: downArray[leftArray[index]], piece: '♟' });
            }
            if (values[downArray[rightArray[index]]] == '♟') {
                checkArray.push({ index: downArray[rightArray[index]], piece: '♟' });
            }
            if (values[downArray[backArray[index]]] == '♟') {
                checkArray.push({ index: downArray[backArray[index]], piece: '♟' });
            }
            if (values[backArray[leftArray[index]]] == '♟') {
                checkArray.push({ index: backArray[leftArray[index]], piece: '♟' });
            }
            if (values[backArray[rightArray[index]]] == '♟') {
                checkArray.push({ index: backArray[rightArray[index]], piece: '♟' });
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
            if (values[upArray[frontArray[frontArray[index]]]] == '♞') {
                checkArray.push({ index: upArray[frontArray[frontArray[index]]], piece: '♞' });
            }
            if (values[downArray[frontArray[frontArray[index]]]] == '♞') {
                checkArray.push({ index: downArray[frontArray[frontArray[index]]], piece: '♞' });
            }
            if (values[upArray[upArray[frontArray[index]]]] == '♞') {
                checkArray.push({ index: upArray[upArray[frontArray[index]]], piece: '♞' });
            }
            if (values[downArray[downArray[frontArray[index]]]] == '♞') {
                checkArray.push({ index: downArray[downArray[frontArray[index]]], piece: '♞' });
            }
            if (values[upArray[backArray[backArray[index]]]] == '♞') {
                checkArray.push({ index: upArray[backArray[backArray[index]]], piece: '♞' });
            }
            if (values[downArray[backArray[backArray[index]]]] == '♞') {
                checkArray.push({ index: downArray[backArray[backArray[index]]], piece: '♞' });
            }
            if (values[upArray[upArray[backArray[index]]]] == '♞') {
                checkArray.push({ index: upArray[upArray[backArray[index]]], piece: '♞' });
            }
            if (values[downArray[downArray[backArray[index]]]] == '♞') {
                checkArray.push({ index: downArray[downArray[backArray[index]]], piece: '♞' });
            }
            if (values[frontArray[leftArray[leftArray[index]]]] == '♞') {
                checkArray.push({ index: frontArray[leftArray[leftArray[index]]], piece: '♞' });
            }
            if (values[backArray[leftArray[leftArray[index]]]] == '♞') {
                checkArray.push({ index: backArray[leftArray[leftArray[index]]], piece: '♞' });
            }
            if (values[frontArray[frontArray[leftArray[index]]]] == '♞') {
                checkArray.push({ index: frontArray[frontArray[leftArray[index]]], piece: '♞' });
            }
            if (values[backArray[backArray[leftArray[index]]]] == '♞') {
                checkArray.push({ index: backArray[backArray[leftArray[index]]], piece: '♞' });
            }
            if (values[frontArray[rightArray[rightArray[index]]]] == '♞') {
                checkArray.push({ index: frontArray[rightArray[rightArray[index]]], piece: '♞' });
            }
            if (values[backArray[rightArray[rightArray[index]]]] == '♞') {
                checkArray.push({ index: backArray[rightArray[rightArray[index]]], piece: '♞' });
            }
            if (values[frontArray[frontArray[rightArray[index]]]] == '♞') {
                checkArray.push({ index: frontArray[frontArray[rightArray[index]]], piece: '♞' });
            }
            if (values[backArray[backArray[rightArray[index]]]] == '♞') {
                checkArray.push({ index: backArray[backArray[rightArray[index]]], piece: '♞' });
            }
        }
        return checkArray;
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
        if (values[frontArray[index]] == '' || blackPieces(values[frontArray[index]])) {
            if (!checkForCheckWhite(frontArray[index])) {
                array.push(frontArray[index]);
            }
        }
        if (values[backArray[index]] == '' || blackPieces(values[backArray[index]])) {
            if (!checkForCheckWhite(backArray[index])) {
                array.push(backArray[index]);
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
        if (values[upArray[frontArray[index]]] == '' || blackPieces(values[upArray[frontArray[index]]])) {
            if (!checkForCheckWhite(upArray[frontArray[index]])) {
                array.push(upArray[frontArray[index]]);
            }
        }
        if (values[downArray[frontArray[index]]] == '' || blackPieces(values[downArray[frontArray[index]]])) {
            if (!checkForCheckWhite(downArray[frontArray[index]])) {
                array.push(downArray[frontArray[index]]);
            }
        }
        if (values[upArray[backArray[index]]] == '' || blackPieces(values[upArray[backArray[index]]])) {
            if (!checkForCheckWhite(upArray[backArray[index]])) {
                array.push(upArray[backArray[index]]);
            }
        }
        if (values[downArray[backArray[index]]] == '' || blackPieces(values[downArray[backArray[index]]])) {
            if (!checkForCheckWhite(downArray[backArray[index]])) {
                array.push(downArray[backArray[index]]);
            }
        }
        if (values[frontArray[leftArray[index]]] == '' || blackPieces(values[frontArray[leftArray[index]]])) {
            if (!checkForCheckWhite(frontArray[leftArray[index]])) {
                array.push(frontArray[leftArray[index]]);
            }
        }
        if (values[backArray[leftArray[index]]] == '' || blackPieces(values[backArray[leftArray[index]]])) {
            if (!checkForCheckWhite(backArray[leftArray[index]])) {
                array.push(backArray[leftArray[index]]);
            }
        }
        if (values[frontArray[rightArray[index]]] == '' || blackPieces(values[frontArray[rightArray[index]]])) {
            if (!checkForCheckWhite(frontArray[rightArray[index]])) {
                array.push(frontArray[rightArray[index]]);
            }
        }
        if (values[backArray[rightArray[index]]] == '' || blackPieces(values[backArray[rightArray[index]]])) {
            if (!checkForCheckWhite(backArray[rightArray[index]])) {
                array.push(backArray[rightArray[index]]);
            }
        }
        if (values[upArray[frontArray[leftArray[index]]]] == '' || blackPieces(values[upArray[frontArray[leftArray[index]]]])) {
            if (!checkForCheckWhite(upArray[frontArray[leftArray[index]]])) {
                array.push(upArray[frontArray[leftArray[index]]]);
            }
        }
        if (values[downArray[frontArray[leftArray[index]]]] == '' || blackPieces(values[downArray[frontArray[leftArray[index]]]])) {
            if (!checkForCheckWhite(downArray[frontArray[leftArray[index]]])) {
                array.push(downArray[frontArray[leftArray[index]]]);
            }
        }
        if (values[upArray[frontArray[rightArray[index]]]] == '' || blackPieces(values[upArray[frontArray[rightArray[index]]]])) {
            if (!checkForCheckWhite(upArray[frontArray[rightArray[index]]])) {
                array.push(upArray[frontArray[rightArray[index]]]);
            }
        }
        if (values[downArray[frontArray[rightArray[index]]]] == '' || blackPieces(values[downArray[frontArray[rightArray[index]]]])) {
            if (!checkForCheckWhite(downArray[frontArray[rightArray[index]]])) {
                array.push(downArray[frontArray[rightArray[index]]]);
            }
        }
        if (values[upArray[backArray[leftArray[index]]]] == '' || blackPieces(values[upArray[backArray[leftArray[index]]]])) {
            if (!checkForCheckWhite(upArray[backArray[leftArray[index]]])) {
                array.push(upArray[backArray[leftArray[index]]]);
            }
        }
        if (values[downArray[backArray[leftArray[index]]]] == '' || blackPieces(values[downArray[backArray[leftArray[index]]]])) {
            if (!checkForCheckWhite(downArray[backArray[leftArray[index]]])) {
                array.push(downArray[backArray[leftArray[index]]]);
            }
        }
        if (values[upArray[backArray[rightArray[index]]]] == '' || blackPieces(values[upArray[backArray[rightArray[index]]]])) {
            if (!checkForCheckWhite(upArray[backArray[rightArray[index]]])) {
                array.push(upArray[backArray[rightArray[index]]]);
            }
        }
        if (values[downArray[backArray[rightArray[index]]]] == '' || blackPieces(values[downArray[backArray[rightArray[index]]]])) {
            if (!checkForCheckWhite(downArray[backArray[rightArray[index]]])) {
                array.push(downArray[backArray[rightArray[index]]]);
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
        if (values[frontArray[index]] == '' || whitePieces(values[frontArray[index]])) {
            if (!checkForCheckBlack(frontArray[index])) {
                array.push(frontArray[index]);
            }
        }
        if (values[backArray[index]] == '' || whitePieces(values[backArray[index]])) {
            if (!checkForCheckBlack(backArray[index])) {
                array.push(backArray[index]);
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
        if (values[upArray[frontArray[index]]] == '' || whitePieces(values[upArray[frontArray[index]]])) {
            if (!checkForCheckBlack(upArray[frontArray[index]])) {
                array.push(upArray[frontArray[index]]);
            }
        }
        if (values[downArray[frontArray[index]]] == '' || whitePieces(values[downArray[frontArray[index]]])) {
            if (!checkForCheckBlack(downArray[frontArray[index]])) {
                array.push(downArray[frontArray[index]]);
            }
        }
        if (values[upArray[backArray[index]]] == '' || whitePieces(values[upArray[backArray[index]]])) {
            if (!checkForCheckBlack(upArray[backArray[index]])) {
                array.push(upArray[backArray[index]]);
            }
        }
        if (values[downArray[backArray[index]]] == '' || whitePieces(values[downArray[backArray[index]]])) {
            if (!checkForCheckBlack(downArray[backArray[index]])) {
                array.push(downArray[backArray[index]]);
            }
        }
        if (values[frontArray[leftArray[index]]] == '' || whitePieces(values[frontArray[leftArray[index]]])) {
            if (!checkForCheckBlack(frontArray[leftArray[index]])) {
                array.push(frontArray[leftArray[index]]);
            }
        }
        if (values[backArray[leftArray[index]]] == '' || whitePieces(values[backArray[leftArray[index]]])) {
            if (!checkForCheckBlack(backArray[leftArray[index]])) {
                array.push(backArray[leftArray[index]]);
            }
        }
        if (values[frontArray[rightArray[index]]] == '' || whitePieces(values[frontArray[rightArray[index]]])) {
            if (!checkForCheckBlack(frontArray[rightArray[index]])) {
                array.push(frontArray[rightArray[index]]);
            }
        }
        if (values[backArray[rightArray[index]]] == '' || whitePieces(values[backArray[rightArray[index]]])) {
            if (!checkForCheckBlack(backArray[rightArray[index]])) {
                array.push(backArray[rightArray[index]]);
            }
        }
        if (values[upArray[frontArray[leftArray[index]]]] == '' || whitePieces(values[upArray[frontArray[leftArray[index]]]])) {
            if (!checkForCheckBlack(upArray[frontArray[leftArray[index]]])) {
                array.push(upArray[frontArray[leftArray[index]]]);
            }
        }
        if (values[downArray[frontArray[leftArray[index]]]] == '' || whitePieces(values[downArray[frontArray[leftArray[index]]]])) {
            if (!checkForCheckBlack(downArray[frontArray[leftArray[index]]])) {
                array.push(downArray[frontArray[leftArray[index]]]);
            }
        }
        if (values[upArray[frontArray[rightArray[index]]]] == '' || whitePieces(values[upArray[frontArray[rightArray[index]]]])) {
            if (!checkForCheckBlack(upArray[frontArray[rightArray[index]]])) {
                array.push(upArray[frontArray[rightArray[index]]]);
            }
        }
        if (values[downArray[frontArray[rightArray[index]]]] == '' || whitePieces(values[downArray[frontArray[rightArray[index]]]])) {
            if (!checkForCheckBlack(downArray[frontArray[rightArray[index]]])) {
                array.push(downArray[frontArray[rightArray[index]]]);
            }
        }
        if (values[upArray[backArray[leftArray[index]]]] == '' || whitePieces(values[upArray[backArray[leftArray[index]]]])) {
            if (!checkForCheckBlack(upArray[backArray[leftArray[index]]])) {
                array.push(upArray[backArray[leftArray[index]]]);
            }
        }
        if (values[downArray[backArray[leftArray[index]]]] == '' || whitePieces(values[downArray[backArray[leftArray[index]]]])) {
            if (!checkForCheckBlack(downArray[backArray[leftArray[index]]])) {
                array.push(downArray[backArray[leftArray[index]]]);
            }
        }
        if (values[upArray[backArray[rightArray[index]]]] == '' || whitePieces(values[upArray[backArray[rightArray[index]]]])) {
            if (!checkForCheckBlack(upArray[backArray[rightArray[index]]])) {
                array.push(upArray[backArray[rightArray[index]]]);
            }
        }
        if (values[downArray[backArray[rightArray[index]]]] == '' || whitePieces(values[downArray[backArray[rightArray[index]]]])) {
            if (!checkForCheckBlack(downArray[backArray[rightArray[index]]])) {
                array.push(downArray[backArray[rightArray[index]]]);
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
                    if (rookArray1[checkArr[0].index] == rookArray1[checkIndex]) {
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
                    } else if (rookArray2[checkArr[0].index] == rookArray2[checkIndex]) {
                        // same file
                        if (checkArr[0].index > checkIndex) {
                            for (let i = checkArr[0].index; i > checkIndex; i = frontArray[i]) {
                                uncheckArray.push(i);
                            }
                        } else if (checkArr[0].index < checkIndex) {
                            for (let i = checkArr[0].index; i < checkIndex; i = backArray[i]) {
                                uncheckArray.push(i);
                            }
                        }
                    } else if (rookArray3[checkArr[0].index] == rookArray3[checkIndex]) {
                        if (checkArr[0].index > checkIndex) {
                            for (let i = checkArr[0].index; i > checkIndex; i = upArray[i]) {
                                uncheckArray.push(i);
                            }
                        } else if (checkArr[0].index < checkIndex) {
                            for (let i = checkArr[0].index; i < checkIndex; i = downArray[i]) {
                                uncheckArray.push(i);
                            }
                        }
                    } else if (bishopArray1[checkArr[0].index] == bishopArray1[checkIndex]) {
                        if (checkArr[0].index > checkIndex) {
                            for (let i = checkArr[0].index; i > checkIndex; i = frontArray[rightArray[i]]) {
                                uncheckArray.push(i);
                            }
                        } else if (checkArr[0].index < checkIndex) {
                            for (let i = checkArr[0].index; i < checkIndex; i = backArray[leftArray[i]]) {
                                uncheckArray.push(i);
                            }
                        }
                    } else if (bishopArray2[checkArr[0].index] == bishopArray2[checkIndex]) {
                        if (checkArr[0].index > checkIndex) {
                            for (let i = checkArr[0].index; i > checkIndex; i = frontArray[leftArray[i]]) {
                                uncheckArray.push(i);
                            }
                        } else if (checkArr[0].index < checkIndex) {
                            for (let i = checkArr[0].index; i < checkIndex; i = backArray[rightArray[i]]) {
                                uncheckArray.push(i);
                            }
                        }
                    } else if (bishopArray3[checkArr[0].index] == bishopArray3[checkIndex]) {
                        if (checkArr[0].index > checkIndex) {
                            for (let i = checkArr[0].index; i > checkIndex; i = upArray[frontArray[i]]) {
                                uncheckArray.push(i);
                            }
                        } else if (checkArr[0].index < checkIndex) {
                            for (let i = checkArr[0].index; i < checkIndex; i = downArray[backArray[i]]) {
                                uncheckArray.push(i);
                            }
                        }
                    } else if (bishopArray4[checkArr[0].index] == bishopArray4[checkIndex]) {
                        if (checkArr[0].index > checkIndex) {
                            for (let i = checkArr[0].index; i > checkIndex; i = upArray[backArray[i]]) {
                                uncheckArray.push(i);
                            }
                        } else if (checkArr[0].index < checkIndex) {
                            for (let i = checkArr[0].index; i < checkIndex; i = downArray[frontArray[i]]) {
                                uncheckArray.push(i);
                            }
                        }
                    } else if (bishopArray5[checkArr[0].index] == bishopArray5[checkIndex]) {
                        if (checkArr[0].index > checkIndex) {
                            for (let i = checkArr[0].index; i > checkIndex; i = upArray[rightArray[i]]) {
                                uncheckArray.push(i);
                            }
                        } else if (checkArr[0].index < checkIndex) {
                            for (let i = checkArr[0].index; i < checkIndex; i = downArray[leftArray[i]]) {
                                uncheckArray.push(i);
                            }
                        }
                    } else if (bishopArray6[checkArr[0].index] == bishopArray6[checkIndex]) {
                        if (checkArr[0].index > checkIndex) {
                            for (let i = checkArr[0].index; i > checkIndex; i = upArray[leftArray[i]]) {
                                uncheckArray.push(i);
                            }
                        } else if (checkArr[0].index < checkIndex) {
                            for (let i = checkArr[0].index; i < checkIndex; i = downArray[rightArray[i]]) {
                                uncheckArray.push(i);
                            }
                        }
                    } else if (unicornArray1[checkArr[0].index] == unicornArray1[checkIndex]) {
                        if (checkArr[0].index > checkIndex) {
                            for (let i = checkArr[0].index; i > checkIndex; i = upArray[frontArray[leftArray[i]]]) {
                                uncheckArray.push(i);
                            }
                        } else if (checkArr[0].index < checkIndex) {
                            for (let i = checkArr[0].index; i < checkIndex; i = downArray[backArray[rightArray[i]]]) {
                                uncheckArray.push(i);
                            }
                        }
                    } else if (unicornArray2[checkArr[0].index] == unicornArray2[checkIndex]) {
                        if (checkArr[0].index > checkIndex) {
                            for (let i = checkArr[0].index; i > checkIndex; i = upArray[frontArray[rightArray[i]]]) {
                                uncheckArray.push(i);
                            }
                        } else if (checkArr[0].index < checkIndex) {
                            for (let i = checkArr[0].index; i < checkIndex; i = downArray[backArray[leftArray[i]]]) {
                                uncheckArray.push(i);
                            }
                        }
                    } else if (unicornArray3[checkArr[0].index] == unicornArray3[checkIndex]) {
                        if (checkArr[0].index > checkIndex) {
                            for (let i = checkArr[0].index; i > checkIndex; i = upArray[backArray[leftArray[i]]]) {
                                uncheckArray.push(i);
                            }
                        } else if (checkArr[0].index < checkIndex) {
                            for (let i = checkArr[0].index; i < checkIndex; i = downArray[frontArray[rightArray[i]]]) {
                                uncheckArray.push(i);
                            }
                        }
                    } else if (unicornArray4[checkArr[0].index] == unicornArray4[checkIndex]) {
                        if (checkArr[0].index > checkIndex) {
                            for (let i = checkArr[0].index; i > checkIndex; i = upArray[backArray[rightArray[i]]]) {
                                uncheckArray.push(i);
                            }
                        } else if (checkArr[0].index < checkIndex) {
                            for (let i = checkArr[0].index; i < checkIndex; i = downArray[frontArray[leftArray[i]]]) {
                                uncheckArray.push(i);
                            }
                        }
                    }
                    break;
                case '🨢':
                case '🨨':
                    if (unicornArray1[checkArr[0].index] == unicornArray1[checkIndex]) {
                        if (checkArr[0].index > checkIndex) {
                            for (let i = checkArr[0].index; i > checkIndex; i = upArray[frontArray[leftArray[i]]]) {
                                uncheckArray.push(i);
                            }
                        } else if (checkArr[0].index < checkIndex) {
                            for (let i = checkArr[0].index; i < checkIndex; i = downArray[backArray[rightArray[i]]]) {
                                uncheckArray.push(i);
                            }
                        }
                    } else if (unicornArray2[checkArr[0].index] == unicornArray2[checkIndex]) {
                        if (checkArr[0].index > checkIndex) {
                            for (let i = checkArr[0].index; i > checkIndex; i = upArray[frontArray[rightArray[i]]]) {
                                uncheckArray.push(i);
                            }
                        } else if (checkArr[0].index < checkIndex) {
                            for (let i = checkArr[0].index; i < checkIndex; i = downArray[backArray[leftArray[i]]]) {
                                uncheckArray.push(i);
                            }
                        }
                    } else if (unicornArray3[checkArr[0].index] == unicornArray3[checkIndex]) {
                        if (checkArr[0].index > checkIndex) {
                            for (let i = checkArr[0].index; i > checkIndex; i = upArray[backArray[leftArray[i]]]) {
                                uncheckArray.push(i);
                            }
                        } else if (checkArr[0].index < checkIndex) {
                            for (let i = checkArr[0].index; i < checkIndex; i = downArray[frontArray[rightArray[i]]]) {
                                uncheckArray.push(i);
                            }
                        }
                    } else if (unicornArray4[checkArr[0].index] == unicornArray4[checkIndex]) {
                        if (checkArr[0].index > checkIndex) {
                            for (let i = checkArr[0].index; i > checkIndex; i = upArray[backArray[rightArray[i]]]) {
                                uncheckArray.push(i);
                            }
                        } else if (checkArr[0].index < checkIndex) {
                            for (let i = checkArr[0].index; i < checkIndex; i = downArray[frontArray[leftArray[i]]]) {
                                uncheckArray.push(i);
                            }
                        }
                    }
                    break;
                case '♗':
                case '♝':
                    if (bishopArray1[checkArr[0].index] == bishopArray1[checkIndex]) {
                        if (checkArr[0].index > checkIndex) {
                            for (let i = checkArr[0].index; i > checkIndex; i = frontArray[rightArray[i]]) {
                                uncheckArray.push(i);
                            }
                        } else if (checkArr[0].index < checkIndex) {
                            for (let i = checkArr[0].index; i < checkIndex; i = backArray[leftArray[i]]) {
                                uncheckArray.push(i);
                            }
                        }
                    } else if (bishopArray2[checkArr[0].index] == bishopArray2[checkIndex]) {
                        if (checkArr[0].index > checkIndex) {
                            for (let i = checkArr[0].index; i > checkIndex; i = frontArray[leftArray[i]]) {
                                uncheckArray.push(i);
                            }
                        } else if (checkArr[0].index < checkIndex) {
                            for (let i = checkArr[0].index; i < checkIndex; i = backArray[rightArray[i]]) {
                                uncheckArray.push(i);
                            }
                        }
                    } else if (bishopArray3[checkArr[0].index] == bishopArray3[checkIndex]) {
                        if (checkArr[0].index > checkIndex) {
                            for (let i = checkArr[0].index; i > checkIndex; i = upArray[frontArray[i]]) {
                                uncheckArray.push(i);
                            }
                        } else if (checkArr[0].index < checkIndex) {
                            for (let i = checkArr[0].index; i < checkIndex; i = downArray[backArray[i]]) {
                                uncheckArray.push(i);
                            }
                        }
                    } else if (bishopArray4[checkArr[0].index] == bishopArray4[checkIndex]) {
                        if (checkArr[0].index > checkIndex) {
                            for (let i = checkArr[0].index; i > checkIndex; i = upArray[backArray[i]]) {
                                uncheckArray.push(i);
                            }
                        } else if (checkArr[0].index < checkIndex) {
                            for (let i = checkArr[0].index; i < checkIndex; i = downArray[frontArray[i]]) {
                                uncheckArray.push(i);
                            }
                        }
                    } else if (bishopArray5[checkArr[0].index] == bishopArray5[checkIndex]) {
                        if (checkArr[0].index > checkIndex) {
                            for (let i = checkArr[0].index; i > checkIndex; i = upArray[rightArray[i]]) {
                                uncheckArray.push(i);
                            }
                        } else if (checkArr[0].index < checkIndex) {
                            for (let i = checkArr[0].index; i < checkIndex; i = downArray[leftArray[i]]) {
                                uncheckArray.push(i);
                            }
                        }
                    } else if (bishopArray6[checkArr[0].index] == bishopArray6[checkIndex]) {
                        if (checkArr[0].index > checkIndex) {
                            for (let i = checkArr[0].index; i > checkIndex; i = upArray[leftArray[i]]) {
                                uncheckArray.push(i);
                            }
                        } else if (checkArr[0].index < checkIndex) {
                            for (let i = checkArr[0].index; i < checkIndex; i = downArray[rightArray[i]]) {
                                uncheckArray.push(i);
                            }
                        }
                    }
                    break;
                case '♖':
                case '♜':
                    if (rookArray1[checkArr[0].index] == rookArray1[checkIndex]) {
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
                    } else if (rookArray2[checkArr[0].index] == rookArray2[checkIndex]) {
                        // same file
                        if (checkArr[0].index > checkIndex) {
                            for (let i = checkArr[0].index; i > checkIndex; i = frontArray[i]) {
                                uncheckArray.push(i);
                            }
                        } else if (checkArr[0].index < checkIndex) {
                            for (let i = checkArr[0].index; i < checkIndex; i = backArray[i]) {
                                uncheckArray.push(i);
                            }
                        }
                    } else if (rookArray3[checkArr[0].index] == rookArray3[checkIndex]) {
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
                    if (discDir == 'up-front' || discDir == 'down-back' || discDir == '') {
                        if (uncheckArray.some(val => (upArray[frontArray[index]] == val)) && values[upArray[frontArray[index]]] != '') {
                            moveArray.push(upArray[frontArray[index]]);
                        }
                    }
                    if (discDir == 'front-right' || discDir == 'back-left' || discDir == '') {
                        if (uncheckArray.some(val => (frontArray[rightArray[index]] == val)) && values[frontArray[rightArray[index]]] != '') {
                            moveArray.push(frontArray[rightArray[index]]);
                        }
                    }
                    if (discDir == 'front-left' || discDir == 'back-right' || discDir == '') {
                        if (uncheckArray.some(val => (frontArray[leftArray[index]] == val)) && values[frontArray[leftArray[index]]] != '') {
                            moveArray.push(frontArray[leftArray[index]]);
                        }
                    }
                    if (discDir == 'up' || discDir == 'down' || discDir == '') {
                        if (uncheckArray.some(val => (upArray[index] == val)) && values[upArray[index]] == '') {
                            moveArray.push(upArray[index]);
                        }
                    }
                    if (discDir == 'front' || discDir == 'back' || discDir == '') {
                        if (uncheckArray.some(val => (frontArray[index] == val)) && values[frontArray[index]] == '') {
                            moveArray.push(frontArray[index]);
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
                    if (discDir == 'up-front' || discDir == 'down-back' || discDir == '') {
                        if (uncheckArray.some(val => (downArray[backArray[index]] == val)) && values[downArray[backArray[index]]] != '') {
                            moveArray.push(downArray[backArray[index]]);
                        }
                    }
                    if (discDir == 'front-right' || discDir == 'back-left' || discDir == '') {
                        if (uncheckArray.some(val => (backArray[leftArray[index]] == val)) && values[backArray[leftArray[index]]] != '') {
                            moveArray.push(backArray[leftArray[index]]);
                        }
                    }
                    if (discDir == 'front-left' || discDir == 'back-right' || discDir == '') {
                        if (uncheckArray.some(val => (backArray[rightArray[index]] == val)) && values[backArray[rightArray[index]]] != '') {
                            moveArray.push(backArray[rightArray[index]]);
                        }
                    }
                    if (discDir == 'up' || discDir == 'down' || discDir == '') {
                        if (uncheckArray.some(val => (downArray[index] == val)) && values[downArray[index]] == '') {
                            moveArray.push(downArray[index]);
                        }
                    }
                    if (discDir == 'front' || discDir == 'back' || discDir == '') {
                        if (uncheckArray.some(val => (backArray[index] == val)) && values[backArray[index]] == '') {
                            moveArray.push(backArray[index]);
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
                    if (discDir == 'front' || discDir == 'back' || discDir == '') {
                        for (let i = frontArray[index]; i > -1; i = frontArray[i]) {
                            if (uncheckArray.some(val => (i == val))) {
                                moveArray.push(i);
                            } else if (values[i] == '') {
                                continue;
                            } else {
                                break;
                            }
                        }
                        for (let i = backArray[index]; i > -1; i = backArray[i]) {
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
                        if (uncheckArray.some(val => (upArray[frontArray[frontArray[index]]] == val))) {
                            moveArray.push(upArray[frontArray[frontArray[index]]]);
                        }
                        if (uncheckArray.some(val => (downArray[frontArray[frontArray[index]]] == val))) {
                            moveArray.push(downArray[frontArray[frontArray[index]]]);
                        }
                        if (uncheckArray.some(val => (upArray[upArray[frontArray[index]]] == val))) {
                            moveArray.push(upArray[upArray[frontArray[index]]]);
                        }
                        if (uncheckArray.some(val => (downArray[downArray[frontArray[index]]] == val))) {
                            moveArray.push(downArray[downArray[frontArray[index]]]);
                        }
                        if (uncheckArray.some(val => (upArray[backArray[backArray[index]]] == val))) {
                            moveArray.push(upArray[backArray[backArray[index]]]);
                        }
                        if (uncheckArray.some(val => (downArray[backArray[backArray[index]]] == val))) {
                            moveArray.push(downArray[backArray[backArray[index]]]);
                        }
                        if (uncheckArray.some(val => (upArray[upArray[backArray[index]]] == val))) {
                            moveArray.push(upArray[upArray[backArray[index]]]);
                        }
                        if (uncheckArray.some(val => (downArray[downArray[backArray[index]]] == val))) {
                            moveArray.push(downArray[downArray[backArray[index]]]);
                        }
                        if (uncheckArray.some(val => (frontArray[leftArray[leftArray[index]]] == val))) {
                            moveArray.push(frontArray[leftArray[leftArray[index]]]);
                        }
                        if (uncheckArray.some(val => (backArray[leftArray[leftArray[index]]] == val))) {
                            moveArray.push(backArray[leftArray[leftArray[index]]]);
                        }
                        if (uncheckArray.some(val => (frontArray[frontArray[leftArray[index]]] == val))) {
                            moveArray.push(frontArray[frontArray[leftArray[index]]]);
                        }
                        if (uncheckArray.some(val => (backArray[backArray[leftArray[index]]] == val))) {
                            moveArray.push(backArray[backArray[leftArray[index]]]);
                        }
                        if (uncheckArray.some(val => (frontArray[rightArray[rightArray[index]]] == val))) {
                            moveArray.push(frontArray[rightArray[rightArray[index]]]);
                        }
                        if (uncheckArray.some(val => (backArray[rightArray[rightArray[index]]] == val))) {
                            moveArray.push(backArray[rightArray[rightArray[index]]]);
                        }
                        if (uncheckArray.some(val => (frontArray[frontArray[rightArray[index]]] == val))) {
                            moveArray.push(frontArray[frontArray[rightArray[index]]]);
                        }
                        if (uncheckArray.some(val => (backArray[backArray[rightArray[index]]] == val))) {
                            moveArray.push(backArray[backArray[rightArray[index]]]);
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
                    if (discDir == 'up-front' || discDir == 'down-back' || discDir == '') {
                        for (let i = upArray[frontArray[index]]; i > -1; i = upArray[frontArray[i]]) {
                            if (uncheckArray.some(val => (i == val))) {
                                moveArray.push(i);
                            } else if (values[i] == '') {
                                continue;
                            } else {
                                break;
                            }
                        }
                        for (let i = downArray[backArray[index]]; i > -1; i = downArray[backArray[i]]) {
                            if (uncheckArray.some(val => (i == val))) {
                                moveArray.push(i);
                            } else if (values[i] == '') {
                                continue;
                            } else {
                                break;
                            }
                        }
                    }
                    if (discDir == 'up-back' || discDir == 'down-front' || discDir == '') {
                        for (let i = upArray[backArray[index]]; i > -1; i = upArray[backArray[i]]) {
                            if (uncheckArray.some(val => (i == val))) {
                                moveArray.push(i);
                            } else if (values[i] == '') {
                                continue;
                            } else {
                                break;
                            }
                        }
                        for (let i = downArray[frontArray[index]]; i > -1; i = downArray[frontArray[i]]) {
                            if (uncheckArray.some(val => (i == val))) {
                                moveArray.push(i);
                            } else if (values[i] == '') {
                                continue;
                            } else {
                                break;
                            }
                        }
                    }
                    if (discDir == 'front-left' || discDir == 'back-right' || discDir == '') {
                        for (let i = frontArray[leftArray[index]]; i > -1; i = frontArray[leftArray[i]]) {
                            if (uncheckArray.some(val => (i == val))) {
                                moveArray.push(i);
                            } else if (values[i] == '') {
                                continue;
                            } else {
                                break;
                            }
                        }
                        for (let i = backArray[rightArray[index]]; i > -1; i = backArray[rightArray[i]]) {
                            if (uncheckArray.some(val => (i == val))) {
                                moveArray.push(i);
                            } else if (values[i] == '') {
                                continue;
                            } else {
                                break;
                            }
                        }
                    }
                    if (discDir == 'front-right' || discDir == 'back-left' || discDir == '') {
                        for (let i = frontArray[rightArray[index]]; i > -1; i = frontArray[rightArray[i]]) {
                            if (uncheckArray.some(val => (i == val))) {
                                moveArray.push(i);
                            } else if (values[i] == '') {
                                continue;
                            } else {
                                break;
                            }
                        }
                        for (let i = backArray[leftArray[index]]; i > -1; i = backArray[leftArray[i]]) {
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
                // Unicorn Movement
                case '🨢':
                case '🨨':
                    if (discDir == 'up-front-left' || discDir == 'down-back-right' || discDir == '') {
                        for (let i = upArray[frontArray[leftArray[index]]]; i > -1; i = upArray[frontArray[leftArray[i]]]) {
                            if (uncheckArray.some(val => (i == val))) {
                                moveArray.push(i);
                            } else if (values[i] == '') {
                                continue;
                            } else {
                                break;
                            }
                        }
                        for (let i = downArray[backArray[rightArray[index]]]; i > -1; i = downArray[backArray[rightArray[i]]]) {
                            if (uncheckArray.some(val => (i == val))) {
                                moveArray.push(i);
                            } else if (values[i] == '') {
                                continue;
                            } else {
                                break;
                            }
                        }
                    }
                    if (discDir == 'up-front-right' || discDir == 'down-back-left' || discDir == '') {
                        for (let i = upArray[frontArray[rightArray[index]]]; i > -1; i = upArray[frontArray[rightArray[i]]]) {
                            if (uncheckArray.some(val => (i == val))) {
                                moveArray.push(i);
                            } else if (values[i] == '') {
                                continue;
                            } else {
                                break;
                            }
                        }
                        for (let i = downArray[backArray[leftArray[index]]]; i > -1; i = downArray[backArray[leftArray[i]]]) {
                            if (uncheckArray.some(val => (i == val))) {
                                moveArray.push(i);
                            } else if (values[i] == '') {
                                continue;
                            } else {
                                break;
                            }
                        }
                    }
                    if (discDir == 'up-back-left' || discDir == 'down-front-right' || discDir == '') {
                        for (let i = upArray[backArray[leftArray[index]]]; i > -1; i = upArray[backArray[leftArray[i]]]) {
                            if (uncheckArray.some(val => (i == val))) {
                                moveArray.push(i);
                            } else if (values[i] == '') {
                                continue;
                            } else {
                                break;
                            }
                        }
                        for (let i = downArray[frontArray[rightArray[index]]]; i > -1; i = downArray[frontArray[rightArray[i]]]) {
                            if (uncheckArray.some(val => (i == val))) {
                                moveArray.push(i);
                            } else if (values[i] == '') {
                                continue;
                            } else {
                                break;
                            }
                        }
                    }
                    if (discDir == 'up-back-right' || discDir == 'down-front-left' || discDir == '') {
                        for (let i = upArray[backArray[rightArray[index]]]; i > -1; i = upArray[backArray[rightArray[i]]]) {
                            if (uncheckArray.some(val => (i == val))) {
                                moveArray.push(i);
                            } else if (values[i] == '') {
                                continue;
                            } else {
                                break;
                            }
                        }
                        for (let i = downArray[frontArray[leftArray[index]]]; i > -1; i = downArray[frontArray[leftArray[i]]]) {
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
                    if (discDir == 'front' || discDir == 'back' || discDir == '') {
                        for (let i = frontArray[index]; i > -1; i = frontArray[i]) {
                            if (uncheckArray.some(val => (i == val))) {
                                moveArray.push(i);
                            } else if (values[i] == '') {
                                continue;
                            } else {
                                break;
                            }
                        }
                        for (let i = backArray[index]; i > -1; i = backArray[i]) {
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
                    if (discDir == 'up-front' || discDir == 'down-back' || discDir == '') {
                        for (let i = upArray[frontArray[index]]; i > -1; i = upArray[frontArray[i]]) {
                            if (uncheckArray.some(val => (i == val))) {
                                moveArray.push(i);
                            } else if (values[i] == '') {
                                continue;
                            } else {
                                break;
                            }
                        }
                        for (let i = downArray[backArray[index]]; i > -1; i = downArray[backArray[i]]) {
                            if (uncheckArray.some(val => (i == val))) {
                                moveArray.push(i);
                            } else if (values[i] == '') {
                                continue;
                            } else {
                                break;
                            }
                        }
                    }
                    if (discDir == 'up-back' || discDir == 'down-front' || discDir == '') {
                        for (let i = upArray[backArray[index]]; i > -1; i = upArray[backArray[i]]) {
                            if (uncheckArray.some(val => (i == val))) {
                                moveArray.push(i);
                            } else if (values[i] == '') {
                                continue;
                            } else {
                                break;
                            }
                        }
                        for (let i = downArray[frontArray[index]]; i > -1; i = downArray[frontArray[i]]) {
                            if (uncheckArray.some(val => (i == val))) {
                                moveArray.push(i);
                            } else if (values[i] == '') {
                                continue;
                            } else {
                                break;
                            }
                        }
                    }
                    if (discDir == 'front-left' || discDir == 'back-right' || discDir == '') {
                        for (let i = frontArray[leftArray[index]]; i > -1; i = frontArray[leftArray[i]]) {
                            if (uncheckArray.some(val => (i == val))) {
                                moveArray.push(i);
                            } else if (values[i] == '') {
                                continue;
                            } else {
                                break;
                            }
                        }
                        for (let i = backArray[rightArray[index]]; i > -1; i = backArray[rightArray[i]]) {
                            if (uncheckArray.some(val => (i == val))) {
                                moveArray.push(i);
                            } else if (values[i] == '') {
                                continue;
                            } else {
                                break;
                            }
                        }
                    }
                    if (discDir == 'front-right' || discDir == 'back-left' || discDir == '') {
                        for (let i = frontArray[rightArray[index]]; i > -1; i = frontArray[rightArray[i]]) {
                            if (uncheckArray.some(val => (i == val))) {
                                moveArray.push(i);
                            } else if (values[i] == '') {
                                continue;
                            } else {
                                break;
                            }
                        }
                        for (let i = backArray[leftArray[index]]; i > -1; i = backArray[leftArray[i]]) {
                            if (uncheckArray.some(val => (i == val))) {
                                moveArray.push(i);
                            } else if (values[i] == '') {
                                continue;
                            } else {
                                break;
                            }
                        }
                    }
                    if (discDir == 'up-front-left' || discDir == 'down-back-right' || discDir == '') {
                        for (let i = upArray[frontArray[leftArray[index]]]; i > -1; i = upArray[frontArray[leftArray[i]]]) {
                            if (uncheckArray.some(val => (i == val))) {
                                moveArray.push(i);
                            } else if (values[i] == '') {
                                continue;
                            } else {
                                break;
                            }
                        }
                        for (let i = downArray[backArray[rightArray[index]]]; i > -1; i = downArray[backArray[rightArray[i]]]) {
                            if (uncheckArray.some(val => (i == val))) {
                                moveArray.push(i);
                            } else if (values[i] == '') {
                                continue;
                            } else {
                                break;
                            }
                        }
                    }
                    if (discDir == 'up-front-right' || discDir == 'down-back-left' || discDir == '') {
                        for (let i = upArray[frontArray[rightArray[index]]]; i > -1; i = upArray[frontArray[rightArray[i]]]) {
                            if (uncheckArray.some(val => (i == val))) {
                                moveArray.push(i);
                            } else if (values[i] == '') {
                                continue;
                            } else {
                                break;
                            }
                        }
                        for (let i = downArray[backArray[leftArray[index]]]; i > -1; i = downArray[backArray[leftArray[i]]]) {
                            if (uncheckArray.some(val => (i == val))) {
                                moveArray.push(i);
                            } else if (values[i] == '') {
                                continue;
                            } else {
                                break;
                            }
                        }
                    }
                    if (discDir == 'up-back-left' || discDir == 'down-front-right' || discDir == '') {
                        for (let i = upArray[backArray[leftArray[index]]]; i > -1; i = upArray[backArray[leftArray[i]]]) {
                            if (uncheckArray.some(val => (i == val))) {
                                moveArray.push(i);
                            } else if (values[i] == '') {
                                continue;
                            } else {
                                break;
                            }
                        }
                        for (let i = downArray[frontArray[rightArray[index]]]; i > -1; i = downArray[frontArray[rightArray[i]]]) {
                            if (uncheckArray.some(val => (i == val))) {
                                moveArray.push(i);
                            } else if (values[i] == '') {
                                continue;
                            } else {
                                break;
                            }
                        }
                    }
                    if (discDir == 'up-back-right' || discDir == 'down-front-left' || discDir == '') {
                        for (let i = upArray[backArray[rightArray[index]]]; i > -1; i = upArray[backArray[rightArray[i]]]) {
                            if (uncheckArray.some(val => (i == val))) {
                                moveArray.push(i);
                            } else if (values[i] == '') {
                                continue;
                            } else {
                                break;
                            }
                        }
                        for (let i = downArray[frontArray[leftArray[index]]]; i > -1; i = downArray[frontArray[leftArray[i]]]) {
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
                    if (discDir == 'up-front' || discDir == 'down-back' || discDir == '') {
                        if (blackPieces(values[upArray[frontArray[index]]])) {
                            moveArray.push(upArray[frontArray[index]]);
                        }
                    }
                    if (discDir == 'front-right' || discDir == 'back-left' || discDir == '') {
                        if (blackPieces(values[frontArray[rightArray[index]]])) {
                            moveArray.push(frontArray[rightArray[index]]);
                        }
                    }
                    if (discDir == 'front-left' || discDir == 'back-right' || discDir == '') {
                        if (blackPieces(values[frontArray[leftArray[index]]])) {
                            moveArray.push(frontArray[leftArray[index]]);
                        }
                    }
                    if (discDir == 'up' || discDir == 'down' || discDir == '') {
                        if (values[upArray[index]] == '') {
                            moveArray.push(upArray[index]);
                        }
                    }
                    if (discDir == 'front' || discDir == 'back' || discDir == '') {
                        if (values[frontArray[index]] == '') {
                            moveArray.push(frontArray[index]);
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
                    if (discDir == 'up-front' || discDir == 'down-back' || discDir == '') {
                        if (whitePieces(values[downArray[backArray[index]]])) {
                            moveArray.push(downArray[backArray[index]]);
                        }
                    }
                    if (discDir == 'front-right' || discDir == 'back-left' || discDir == '') {
                        if (whitePieces(values[backArray[leftArray[index]]])) {
                            moveArray.push(backArray[leftArray[index]]);
                        }
                    }
                    if (discDir == 'front-left' || discDir == 'back-right' || discDir == '') {
                        if (whitePieces(values[backArray[rightArray[index]]])) {
                            moveArray.push(backArray[rightArray[index]]);
                        }
                    }
                    if (discDir == 'up' || discDir == 'down' || discDir == '') {
                        if (values[downArray[index]] == '') {
                            moveArray.push(downArray[index]);
                        }
                    }
                    if (discDir == 'front' || discDir == 'back' || discDir == '') {
                        if (values[backArray[index]] == '') {
                            moveArray.push(backArray[index]);
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
                    if (discDir == 'front' || discDir == 'back' || discDir == '') {
                        for (let i = frontArray[index]; i > -1; i = frontArray[i]) {
                            if (values[i] == '') {
                                moveArray.push(i);
                            } else {
                                if (blackPieces(values[i])) {
                                    moveArray.push(i);
                                }
                                break;
                            }
                        }
                        for (let i = backArray[index]; i > -1; i = backArray[i]) {
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
                    if (discDir == 'front' || discDir == 'back' || discDir == '') {
                        for (let i = frontArray[index]; i > -1; i = frontArray[i]) {
                            if (values[i] == '') {
                                moveArray.push(i);
                            } else {
                                if (whitePieces(values[i])) {
                                    moveArray.push(i);
                                }
                                break;
                            }
                        }
                        for (let i = backArray[index]; i > -1; i = backArray[i]) {
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
                        if (values[upArray[frontArray[frontArray[index]]]] == '' || blackPieces(values[upArray[frontArray[frontArray[index]]]])) {
                            moveArray.push(upArray[frontArray[frontArray[index]]]);
                        }
                        if (values[downArray[frontArray[frontArray[index]]]] == '' || blackPieces(values[downArray[frontArray[frontArray[index]]]])) {
                            moveArray.push(downArray[frontArray[frontArray[index]]]);
                        }
                        if (values[upArray[upArray[frontArray[index]]]] == '' || blackPieces(values[upArray[upArray[frontArray[index]]]])) {
                            moveArray.push(upArray[upArray[frontArray[index]]]);
                        }
                        if (values[downArray[downArray[frontArray[index]]]] == '' || blackPieces(values[downArray[downArray[frontArray[index]]]])) {
                            moveArray.push(downArray[downArray[frontArray[index]]]);
                        }
                        if (values[upArray[backArray[backArray[index]]]] == '' || blackPieces(values[upArray[backArray[backArray[index]]]])) {
                            moveArray.push(upArray[backArray[backArray[index]]]);
                        }
                        if (values[downArray[backArray[backArray[index]]]] == '' || blackPieces(values[downArray[backArray[backArray[index]]]])) {
                            moveArray.push(downArray[backArray[backArray[index]]]);
                        }
                        if (values[upArray[upArray[backArray[index]]]] == '' || blackPieces(values[upArray[upArray[backArray[index]]]])) {
                            moveArray.push(upArray[upArray[backArray[index]]]);
                        }
                        if (values[downArray[downArray[backArray[index]]]] == '' || blackPieces(values[downArray[downArray[backArray[index]]]])) {
                            moveArray.push(downArray[downArray[backArray[index]]]);
                        }
                        if (values[frontArray[leftArray[leftArray[index]]]] == '' || blackPieces(values[frontArray[leftArray[leftArray[index]]]])) {
                            moveArray.push(frontArray[leftArray[leftArray[index]]]);
                        }
                        if (values[backArray[leftArray[leftArray[index]]]] == '' || blackPieces(values[backArray[leftArray[leftArray[index]]]])) {
                            moveArray.push(backArray[leftArray[leftArray[index]]]);
                        }
                        if (values[frontArray[frontArray[leftArray[index]]]] == '' || blackPieces(values[frontArray[frontArray[leftArray[index]]]])) {
                            moveArray.push(frontArray[frontArray[leftArray[index]]]);
                        }
                        if (values[backArray[backArray[leftArray[index]]]] == '' || blackPieces(values[backArray[backArray[leftArray[index]]]])) {
                            moveArray.push(backArray[backArray[leftArray[index]]]);
                        }
                        if (values[frontArray[rightArray[rightArray[index]]]] == '' || blackPieces(values[frontArray[rightArray[rightArray[index]]]])) {
                            moveArray.push(frontArray[rightArray[rightArray[index]]]);
                        }
                        if (values[backArray[rightArray[rightArray[index]]]] == '' || blackPieces(values[backArray[rightArray[rightArray[index]]]])) {
                            moveArray.push(backArray[rightArray[rightArray[index]]]);
                        }
                        if (values[frontArray[frontArray[rightArray[index]]]] == '' || blackPieces(values[frontArray[frontArray[rightArray[index]]]])) {
                            moveArray.push(frontArray[frontArray[rightArray[index]]]);
                        }
                        if (values[backArray[backArray[rightArray[index]]]] == '' || blackPieces(values[backArray[backArray[rightArray[index]]]])) {
                            moveArray.push(backArray[backArray[rightArray[index]]]);
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
                        if (values[upArray[frontArray[frontArray[index]]]] == '' || whitePieces(values[upArray[frontArray[frontArray[index]]]])) {
                            moveArray.push(upArray[frontArray[frontArray[index]]]);
                        }
                        if (values[downArray[frontArray[frontArray[index]]]] == '' || whitePieces(values[downArray[frontArray[frontArray[index]]]])) {
                            moveArray.push(downArray[frontArray[frontArray[index]]]);
                        }
                        if (values[upArray[upArray[frontArray[index]]]] == '' || whitePieces(values[upArray[upArray[frontArray[index]]]])) {
                            moveArray.push(upArray[upArray[frontArray[index]]]);
                        }
                        if (values[downArray[downArray[frontArray[index]]]] == '' || whitePieces(values[downArray[downArray[frontArray[index]]]])) {
                            moveArray.push(downArray[downArray[frontArray[index]]]);
                        }
                        if (values[upArray[backArray[backArray[index]]]] == '' || whitePieces(values[upArray[backArray[backArray[index]]]])) {
                            moveArray.push(upArray[backArray[backArray[index]]]);
                        }
                        if (values[downArray[backArray[backArray[index]]]] == '' || whitePieces(values[downArray[backArray[backArray[index]]]])) {
                            moveArray.push(downArray[backArray[backArray[index]]]);
                        }
                        if (values[upArray[upArray[backArray[index]]]] == '' || whitePieces(values[upArray[upArray[backArray[index]]]])) {
                            moveArray.push(upArray[upArray[backArray[index]]]);
                        }
                        if (values[downArray[downArray[backArray[index]]]] == '' || whitePieces(values[downArray[downArray[backArray[index]]]])) {
                            moveArray.push(downArray[downArray[backArray[index]]]);
                        }
                        if (values[frontArray[leftArray[leftArray[index]]]] == '' || whitePieces(values[frontArray[leftArray[leftArray[index]]]])) {
                            moveArray.push(frontArray[leftArray[leftArray[index]]]);
                        }
                        if (values[backArray[leftArray[leftArray[index]]]] == '' || whitePieces(values[backArray[leftArray[leftArray[index]]]])) {
                            moveArray.push(backArray[leftArray[leftArray[index]]]);
                        }
                        if (values[frontArray[frontArray[leftArray[index]]]] == '' || whitePieces(values[frontArray[frontArray[leftArray[index]]]])) {
                            moveArray.push(frontArray[frontArray[leftArray[index]]]);
                        }
                        if (values[backArray[backArray[leftArray[index]]]] == '' || whitePieces(values[backArray[backArray[leftArray[index]]]])) {
                            moveArray.push(backArray[backArray[leftArray[index]]]);
                        }
                        if (values[frontArray[rightArray[rightArray[index]]]] == '' || whitePieces(values[frontArray[rightArray[rightArray[index]]]])) {
                            moveArray.push(frontArray[rightArray[rightArray[index]]]);
                        }
                        if (values[backArray[rightArray[rightArray[index]]]] == '' || whitePieces(values[backArray[rightArray[rightArray[index]]]])) {
                            moveArray.push(backArray[rightArray[rightArray[index]]]);
                        }
                        if (values[frontArray[frontArray[rightArray[index]]]] == '' || whitePieces(values[frontArray[frontArray[rightArray[index]]]])) {
                            moveArray.push(frontArray[frontArray[rightArray[index]]]);
                        }
                        if (values[backArray[backArray[rightArray[index]]]] == '' || whitePieces(values[backArray[backArray[rightArray[index]]]])) {
                            moveArray.push(backArray[backArray[rightArray[index]]]);
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
                    if (discDir == 'up-front' || discDir == 'down-back' || discDir == '') {
                        for (let i = upArray[frontArray[index]]; i > -1; i = upArray[frontArray[i]]) {
                            if (values[i] == '') {
                                moveArray.push(i);
                            } else {
                                if (blackPieces(values[i])) {
                                    moveArray.push(i);
                                }
                                break;
                            }
                        }
                        for (let i = downArray[backArray[index]]; i > -1; i = downArray[backArray[i]]) {
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
                    if (discDir == 'up-back' || discDir == 'down-front' || discDir == '') {
                        for (let i = upArray[backArray[index]]; i > -1; i = upArray[backArray[i]]) {
                            if (values[i] == '') {
                                moveArray.push(i);
                            } else {
                                if (blackPieces(values[i])) {
                                    moveArray.push(i);
                                }
                                break;
                            }
                        }
                        for (let i = downArray[frontArray[index]]; i > -1; i = downArray[frontArray[i]]) {
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
                    if (discDir == 'front-left' || discDir == 'back-right' || discDir == '') {
                        for (let i = frontArray[leftArray[index]]; i > -1; i = frontArray[leftArray[i]]) {
                            if (values[i] == '') {
                                moveArray.push(i);
                            } else {
                                if (blackPieces(values[i])) {
                                    moveArray.push(i);
                                }
                                break;
                            }
                        }
                        for (let i = backArray[rightArray[index]]; i > -1; i = backArray[rightArray[i]]) {
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
                    if (discDir == 'front-right' || discDir == 'back-left' || discDir == '') {
                        for (let i = frontArray[rightArray[index]]; i > -1; i = frontArray[rightArray[i]]) {
                            if (values[i] == '') {
                                moveArray.push(i);
                            } else {
                                if (blackPieces(values[i])) {
                                    moveArray.push(i);
                                }
                                break;
                            }
                        }
                        for (let i = backArray[leftArray[index]]; i > -1; i = backArray[leftArray[i]]) {
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
                    if (discDir == 'up-front' || discDir == 'down-back' || discDir == '') {
                        for (let i = upArray[frontArray[index]]; i > -1; i = upArray[frontArray[i]]) {
                            if (values[i] == '') {
                                moveArray.push(i);
                            } else {
                                if (whitePieces(values[i])) {
                                    moveArray.push(i);
                                }
                                break;
                            }
                        }
                        for (let i = downArray[backArray[index]]; i > -1; i = downArray[backArray[i]]) {
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
                    if (discDir == 'up-back' || discDir == 'down-front' || discDir == '') {
                        for (let i = upArray[backArray[index]]; i > -1; i = upArray[backArray[i]]) {
                            if (values[i] == '') {
                                moveArray.push(i);
                            } else {
                                if (whitePieces(values[i])) {
                                    moveArray.push(i);
                                }
                                break;
                            }
                        }
                        for (let i = downArray[frontArray[index]]; i > -1; i = downArray[frontArray[i]]) {
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
                    if (discDir == 'front-left' || discDir == 'back-right' || discDir == '') {
                        for (let i = frontArray[leftArray[index]]; i > -1; i = frontArray[leftArray[i]]) {
                            if (values[i] == '') {
                                moveArray.push(i);
                            } else {
                                if (whitePieces(values[i])) {
                                    moveArray.push(i);
                                }
                                break;
                            }
                        }
                        for (let i = backArray[rightArray[index]]; i > -1; i = backArray[rightArray[i]]) {
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
                    if (discDir == 'front-right' || discDir == 'back-left' || discDir == '') {
                        for (let i = frontArray[rightArray[index]]; i > -1; i = frontArray[rightArray[i]]) {
                            if (values[i] == '') {
                                moveArray.push(i);
                            } else {
                                if (whitePieces(values[i])) {
                                    moveArray.push(i);
                                }
                                break;
                            }
                        }
                        for (let i = backArray[leftArray[index]]; i > -1; i = backArray[leftArray[i]]) {
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
                // White Unicorn Movement
                case '🨢':
                    if (discDir == 'up-front-left' || discDir == 'down-back-right' || discDir == '') {
                        for (let i = upArray[frontArray[leftArray[index]]]; i > -1; i = upArray[frontArray[leftArray[i]]]) {
                            if (values[i] == '') {
                                moveArray.push(i);
                            } else {
                                if (blackPieces(values[i])) {
                                    moveArray.push(i);
                                }
                                break;
                            }
                        }
                        for (let i = downArray[backArray[rightArray[index]]]; i > -1; i = downArray[backArray[rightArray[i]]]) {
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
                    if (discDir == 'up-front-right' || discDir == 'down-back-left' || discDir == '') {
                        for (let i = upArray[frontArray[rightArray[index]]]; i > -1; i = upArray[frontArray[rightArray[i]]]) {
                            if (values[i] == '') {
                                moveArray.push(i);
                            } else {
                                if (blackPieces(values[i])) {
                                    moveArray.push(i);
                                }
                                break;
                            }
                        }
                        for (let i = downArray[backArray[leftArray[index]]]; i > -1; i = downArray[backArray[leftArray[i]]]) {
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
                    if (discDir == 'up-back-left' || discDir == 'down-front-right' || discDir == '') {
                        for (let i = upArray[backArray[leftArray[index]]]; i > -1; i = upArray[backArray[leftArray[i]]]) {
                            if (values[i] == '') {
                                moveArray.push(i);
                            } else {
                                if (blackPieces(values[i])) {
                                    moveArray.push(i);
                                }
                                break;
                            }
                        }
                        for (let i = downArray[frontArray[rightArray[index]]]; i > -1; i = downArray[frontArray[rightArray[i]]]) {
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
                    if (discDir == 'up-back-right' || discDir == 'down-front-left' || discDir == '') {
                        for (let i = upArray[backArray[rightArray[index]]]; i > -1; i = upArray[backArray[rightArray[i]]]) {
                            if (values[i] == '') {
                                moveArray.push(i);
                            } else {
                                if (blackPieces(values[i])) {
                                    moveArray.push(i);
                                }
                                break;
                            }
                        }
                        for (let i = downArray[frontArray[leftArray[index]]]; i > -1; i = downArray[frontArray[leftArray[i]]]) {
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
                // Black Unicorn Movement
                case '🨨':
                    if (discDir == 'up-front-left' || discDir == 'down-back-right' || discDir == '') {
                        for (let i = upArray[frontArray[leftArray[index]]]; i > -1; i = upArray[frontArray[leftArray[i]]]) {
                            if (values[i] == '') {
                                moveArray.push(i);
                            } else {
                                if (whitePieces(values[i])) {
                                    moveArray.push(i);
                                }
                                break;
                            }
                        }
                        for (let i = downArray[backArray[rightArray[index]]]; i > -1; i = downArray[backArray[rightArray[i]]]) {
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
                    if (discDir == 'up-front-right' || discDir == 'down-back-left' || discDir == '') {
                        for (let i = upArray[frontArray[rightArray[index]]]; i > -1; i = upArray[frontArray[rightArray[i]]]) {
                            if (values[i] == '') {
                                moveArray.push(i);
                            } else {
                                if (whitePieces(values[i])) {
                                    moveArray.push(i);
                                }
                                break;
                            }
                        }
                        for (let i = downArray[backArray[leftArray[index]]]; i > -1; i = downArray[backArray[leftArray[i]]]) {
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
                    if (discDir == 'up-back-left' || discDir == 'down-front-right' || discDir == '') {
                        for (let i = upArray[backArray[leftArray[index]]]; i > -1; i = upArray[backArray[leftArray[i]]]) {
                            if (values[i] == '') {
                                moveArray.push(i);
                            } else {
                                if (whitePieces(values[i])) {
                                    moveArray.push(i);
                                }
                                break;
                            }
                        }
                        for (let i = downArray[frontArray[rightArray[index]]]; i > -1; i = downArray[frontArray[rightArray[i]]]) {
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
                    if (discDir == 'up-back-right' || discDir == 'down-front-left' || discDir == '') {
                        for (let i = upArray[backArray[rightArray[index]]]; i > -1; i = upArray[backArray[rightArray[i]]]) {
                            if (values[i] == '') {
                                moveArray.push(i);
                            } else {
                                if (whitePieces(values[i])) {
                                    moveArray.push(i);
                                }
                                break;
                            }
                        }
                        for (let i = downArray[frontArray[leftArray[index]]]; i > -1; i = downArray[frontArray[leftArray[i]]]) {
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
                    if (discDir == 'front' || discDir == 'back' || discDir == '') {
                        for (let i = frontArray[index]; i > -1; i = frontArray[i]) {
                            if (values[i] == '') {
                                moveArray.push(i);
                            } else {
                                if (blackPieces(values[i])) {
                                    moveArray.push(i);
                                }
                                break;
                            }
                        }
                        for (let i = backArray[index]; i > -1; i = backArray[i]) {
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
                    if (discDir == 'up-front' || discDir == 'down-back' || discDir == '') {
                        for (let i = upArray[frontArray[index]]; i > -1; i = upArray[frontArray[i]]) {
                            if (values[i] == '') {
                                moveArray.push(i);
                            } else {
                                if (blackPieces(values[i])) {
                                    moveArray.push(i);
                                }
                                break;
                            }
                        }
                        for (let i = downArray[backArray[index]]; i > -1; i = downArray[backArray[i]]) {
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
                    if (discDir == 'up-back' || discDir == 'down-front' || discDir == '') {
                        for (let i = upArray[backArray[index]]; i > -1; i = upArray[backArray[i]]) {
                            if (values[i] == '') {
                                moveArray.push(i);
                            } else {
                                if (blackPieces(values[i])) {
                                    moveArray.push(i);
                                }
                                break;
                            }
                        }
                        for (let i = downArray[frontArray[index]]; i > -1; i = downArray[frontArray[i]]) {
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
                    if (discDir == 'front-left' || discDir == 'back-right' || discDir == '') {
                        for (let i = frontArray[leftArray[index]]; i > -1; i = frontArray[leftArray[i]]) {
                            if (values[i] == '') {
                                moveArray.push(i);
                            } else {
                                if (blackPieces(values[i])) {
                                    moveArray.push(i);
                                }
                                break;
                            }
                        }
                        for (let i = backArray[rightArray[index]]; i > -1; i = backArray[rightArray[i]]) {
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
                    if (discDir == 'front-right' || discDir == 'back-left' || discDir == '') {
                        for (let i = frontArray[rightArray[index]]; i > -1; i = frontArray[rightArray[i]]) {
                            if (values[i] == '') {
                                moveArray.push(i);
                            } else {
                                if (blackPieces(values[i])) {
                                    moveArray.push(i);
                                }
                                break;
                            }
                        }
                        for (let i = backArray[leftArray[index]]; i > -1; i = backArray[leftArray[i]]) {
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
                    if (discDir == 'up-front-left' || discDir == 'down-back-right' || discDir == '') {
                        for (let i = upArray[frontArray[leftArray[index]]]; i > -1; i = upArray[frontArray[leftArray[i]]]) {
                            if (values[i] == '') {
                                moveArray.push(i);
                            } else {
                                if (blackPieces(values[i])) {
                                    moveArray.push(i);
                                }
                                break;
                            }
                        }
                        for (let i = downArray[backArray[rightArray[index]]]; i > -1; i = downArray[backArray[rightArray[i]]]) {
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
                    if (discDir == 'up-front-right' || discDir == 'down-back-left' || discDir == '') {
                        for (let i = upArray[frontArray[rightArray[index]]]; i > -1; i = upArray[frontArray[rightArray[i]]]) {
                            if (values[i] == '') {
                                moveArray.push(i);
                            } else {
                                if (blackPieces(values[i])) {
                                    moveArray.push(i);
                                }
                                break;
                            }
                        }
                        for (let i = downArray[backArray[leftArray[index]]]; i > -1; i = downArray[backArray[leftArray[i]]]) {
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
                    if (discDir == 'up-back-left' || discDir == 'down-front-right' || discDir == '') {
                        for (let i = upArray[backArray[leftArray[index]]]; i > -1; i = upArray[backArray[leftArray[i]]]) {
                            if (values[i] == '') {
                                moveArray.push(i);
                            } else {
                                if (blackPieces(values[i])) {
                                    moveArray.push(i);
                                }
                                break;
                            }
                        }
                        for (let i = downArray[frontArray[rightArray[index]]]; i > -1; i = downArray[frontArray[rightArray[i]]]) {
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
                    if (discDir == 'up-back-right' || discDir == 'down-front-left' || discDir == '') {
                        for (let i = upArray[backArray[rightArray[index]]]; i > -1; i = upArray[backArray[rightArray[i]]]) {
                            if (values[i] == '') {
                                moveArray.push(i);
                            } else {
                                if (blackPieces(values[i])) {
                                    moveArray.push(i);
                                }
                                break;
                            }
                        }
                        for (let i = downArray[frontArray[leftArray[index]]]; i > -1; i = downArray[frontArray[leftArray[i]]]) {
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
                    if (discDir == 'front' || discDir == 'back' || discDir == '') {
                        for (let i = frontArray[index]; i > -1; i = frontArray[i]) {
                            if (values[i] == '') {
                                moveArray.push(i);
                            } else {
                                if (whitePieces(values[i])) {
                                    moveArray.push(i);
                                }
                                break;
                            }
                        }
                        for (let i = backArray[index]; i > -1; i = backArray[i]) {
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
                    if (discDir == 'up-front' || discDir == 'down-back' || discDir == '') {
                        for (let i = upArray[frontArray[index]]; i > -1; i = upArray[frontArray[i]]) {
                            if (values[i] == '') {
                                moveArray.push(i);
                            } else {
                                if (whitePieces(values[i])) {
                                    moveArray.push(i);
                                }
                                break;
                            }
                        }
                        for (let i = downArray[backArray[index]]; i > -1; i = downArray[backArray[i]]) {
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
                    if (discDir == 'up-back' || discDir == 'down-front' || discDir == '') {
                        for (let i = upArray[backArray[index]]; i > -1; i = upArray[backArray[i]]) {
                            if (values[i] == '') {
                                moveArray.push(i);
                            } else {
                                if (whitePieces(values[i])) {
                                    moveArray.push(i);
                                }
                                break;
                            }
                        }
                        for (let i = downArray[frontArray[index]]; i > -1; i = downArray[frontArray[i]]) {
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
                    if (discDir == 'front-left' || discDir == 'back-right' || discDir == '') {
                        for (let i = frontArray[leftArray[index]]; i > -1; i = frontArray[leftArray[i]]) {
                            if (values[i] == '') {
                                moveArray.push(i);
                            } else {
                                if (whitePieces(values[i])) {
                                    moveArray.push(i);
                                }
                                break;
                            }
                        }
                        for (let i = backArray[rightArray[index]]; i > -1; i = backArray[rightArray[i]]) {
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
                    if (discDir == 'front-right' || discDir == 'back-left' || discDir == '') {
                        for (let i = frontArray[rightArray[index]]; i > -1; i = frontArray[rightArray[i]]) {
                            if (values[i] == '') {
                                moveArray.push(i);
                            } else {
                                if (whitePieces(values[i])) {
                                    moveArray.push(i);
                                }
                                break;
                            }
                        }
                        for (let i = backArray[leftArray[index]]; i > -1; i = backArray[leftArray[i]]) {
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
                    if (discDir == 'up-front-left' || discDir == 'down-back-right' || discDir == '') {
                        for (let i = upArray[frontArray[leftArray[index]]]; i > -1; i = upArray[frontArray[leftArray[i]]]) {
                            if (values[i] == '') {
                                moveArray.push(i);
                            } else {
                                if (whitePieces(values[i])) {
                                    moveArray.push(i);
                                }
                                break;
                            }
                        }
                        for (let i = downArray[backArray[rightArray[index]]]; i > -1; i = downArray[backArray[rightArray[i]]]) {
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
                    if (discDir == 'up-front-right' || discDir == 'down-back-left' || discDir == '') {
                        for (let i = upArray[frontArray[rightArray[index]]]; i > -1; i = upArray[frontArray[rightArray[i]]]) {
                            if (values[i] == '') {
                                moveArray.push(i);
                            } else {
                                if (whitePieces(values[i])) {
                                    moveArray.push(i);
                                }
                                break;
                            }
                        }
                        for (let i = downArray[backArray[leftArray[index]]]; i > -1; i = downArray[backArray[leftArray[i]]]) {
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
                    if (discDir == 'up-back-left' || discDir == 'down-front-right' || discDir == '') {
                        for (let i = upArray[backArray[leftArray[index]]]; i > -1; i = upArray[backArray[leftArray[i]]]) {
                            if (values[i] == '') {
                                moveArray.push(i);
                            } else {
                                if (whitePieces(values[i])) {
                                    moveArray.push(i);
                                }
                                break;
                            }
                        }
                        for (let i = downArray[frontArray[rightArray[index]]]; i > -1; i = downArray[frontArray[rightArray[i]]]) {
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
                    if (discDir == 'up-back-right' || discDir == 'down-front-left' || discDir == '') {
                        for (let i = upArray[backArray[rightArray[index]]]; i > -1; i = upArray[backArray[rightArray[i]]]) {
                            if (values[i] == '') {
                                moveArray.push(i);
                            } else {
                                if (whitePieces(values[i])) {
                                    moveArray.push(i);
                                }
                                break;
                            }
                        }
                        for (let i = downArray[frontArray[leftArray[index]]]; i > -1; i = downArray[frontArray[leftArray[i]]]) {
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
        var whiteUnicorns = [];
        checkForPiece('🨢', whiteUnicorns);
        var blackUnicorns = [];
        checkForPiece('🨨', blackUnicorns);
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
        var boardState = 'whiteKing:' + whiteKing.toString() + ';blackKing:' + blackKing.toString() + ';whiteQueens:' + whiteQueens.toString() + ';blackQueens:' + blackQueens.toString() + ';whiteUnicorns:' + whiteUnicorns.toString() + ';blackUnicorns:' + blackUnicorns.toString() +
            ';whiteBishops:' + whiteBishops.toString() + ';blackBishops:' + blackBishops.toString() + ';whiteKnights:' + whiteKnights.toString() + ';blackKnights:' + blackKnights.toString() + ';whiteRooks:' + whiteRooks.toString() + ';blackRooks:' + blackRooks.toString() +
            ';whitePawns:' + whitePawns.toString() + ';blackPawns:' + blackPawns.toString() + ';player:' + player.toString();
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
        if (player == 'White' && spliced.every(value => value != '♔' && value != '♕' && value != '🨢' && value != '♗' && value != '♘' && value != '♖' && value != '♙')) {
            if (win == 'Check') {
                console.log('Black wins by checkmate');
                setWin('Black');
                return;
            } else {
                console.log('Black draws by stalemate');
                setWin('Draw');
            }
        }
        if (player == 'Black' && spliced.every(value => value != '♚' && value != '♛' && value != '🨨' && value != '♝' && value != '♞' && value != '♜' && value != '♟')) {
            if (win == 'Check') {
                console.log('White wins by checkmate');
                setWin('White');
                return;
            } else {
                console.log('White draws by stalemate');
                setWin('Draw');
            }
        }
        if (values.every(value => value != '♕' && value != '🨢' && value != '♗' && value != '♘' && value != '♖' && value != '♙' && value != '♛' && value != '🨨' && value != '♝' && value != '♞' && value != '♜' && value != '♟')) {
            console.log('Draw by dead position (King against King)');
            setWin('Draw');
        } else if (values.every(value => value != '♕' && value != '🨢' && value != '♘' && value != '♖' && value != '♙' && value != '♛' && value != '🨨' && value != '♝' && value != '♞' && value != '♜' && value != '♟')) {
            var a = values.findIndex(value => value == '♗');
            var b = values.findLastIndex(value => value == '♗');
            if (a == b) {
                console.log('Draw by dead position (White King and Bishop against Black King)');
                setWin('Draw');
            }
        } else if (values.every(value => value != '♕' && value != '🨢' && value != '♗' && value != '♘' && value != '♖' && value != '♙' && value != '♛' && value != '🨨' && value != '♞' && value != '♜' && value != '♟')) {
            var a = values.findIndex(value => value == '♝');
            var b = values.findLastIndex(value => value == '♝');
            if (a == b) {
                console.log('Draw by dead position (Black King and Bishop against White King)');
                setWin('Draw');
            }
        } else if (values.every(value => value != '♕' && value != '🨢' && value != '♗' && value != '♖' && value != '♙' && value != '♛' && value != '🨨' && value != '♝' && value != '♞' && value != '♜' && value != '♟')) {
            var a = values.findIndex(value => value == '♘');
            var b = values.findLastIndex(value => value == '♘');
            if (a == b) {
                console.log('Draw by dead position (White King and Knight against Black King)');
                setWin('Draw');
            }
        } else if (values.every(value => value != '♕' && value != '🨢' && value != '♗' && value != '♘' && value != '♖' && value != '♙' && value != '♛' && value != '🨨' && value != '♝' && value != '♜' && value != '♟')) {
            var a = values.findIndex(value => value == '♞');
            var b = values.findLastIndex(value => value == '♞');
            if (a == b) {
                console.log('Draw by dead position (Black King and Knight against White King)');
                setWin('Draw');
            }
        } else if (values.every(value => value != '♕' && value != '♗' && value != '♘' && value != '♖' && value != '♙' && value != '♛' && value != '🨨' && value != '♝' && value != '♞' && value != '♜' && value != '♟')) {
            var a = values.findIndex(value => value == '🨢');
            var b = values.findLastIndex(value => value == '🨢');
            if (a == b) {
                console.log('Draw by dead position (White King and Unicorn against Black King)');
                setWin('Draw');
            }
        } else if (values.every(value => value != '♕' && value != '🨢' && value != '♗' && value != '♘' && value != '♖' && value != '♙' && value != '♛' && value != '♝' && value != '♞' && value != '♜' && value != '♟')) {
            var a = values.findIndex(value => value == '🨨');
            var b = values.findLastIndex(value => value == '🨨');
            if (a == b) {
                console.log('Draw by dead position (Black King and Unicorn against White King)');
                setWin('Draw');
            }
        } else if (values.every(value => value != '♕' && value != '🨢' && value != '♘' && value != '♖' && value != '♙' && value != '♛' && value != '🨨' && value != '♞' && value != '♜' && value != '♟')) {
            var a = values.findIndex(value => value == '♗');
            var b = values.findLastIndex(value => value == '♗');
            var c = values.findIndex(value => value == '♝');
            var d = values.findLastIndex(value => value == '♝');
            if (a == b && c == d) {
                if (((a % 2 == 0) && (Math.floor(a / 5) % 2 == 0)) || ((a % 2 == 0) && (Math.floor(a / 5) % 2 == 1))) {
                    if (((c % 2 == 0) && (Math.floor(c / 5) % 2 == 0)) || ((c % 2 == 0) && (Math.floor(c / 5) % 2 == 1))) {
                        console.log('Draw by dead position (King and Bishop on white square against King and Bishop on white square)');
                        setWin('Draw');
                    }
                } else {
                    if (!(((c % 2 == 0) && (Math.floor(c / 5) % 2 == 0)) || ((c % 2 == 0) && (Math.floor(c / 5) % 2 == 1)))) {
                        console.log('Draw by dead position (King and Bishop on black square against King and Bishop on black square)');
                        setWin('Draw');
                    }
                }
            }
        } else if (values.every(value => value != '♕' && value != '♗' && value != '♘' && value != '♖' && value != '♙' && value != '♛' && value != '♝' && value != '♞' && value != '♜' && value != '♟')) {
            var a = values.findIndex(value => value == '🨢');
            var b = values.findLastIndex(value => value == '🨢');
            var c = values.findIndex(value => value == '🨨');
            var d = values.findLastIndex(value => value == '🨨');
            if (a == b && c == d) {
                if (((a % 2 == 0) && (Math.floor(a / 5) % 2 == 0)) || ((a % 2 == 0) && (Math.floor(a / 5) % 2 == 1))) {
                    if (((c % 2 == 0) && (Math.floor(c / 5) % 2 == 0)) || ((c % 2 == 0) && (Math.floor(c / 5) % 2 == 1))) {
                        console.log('Draw by dead position (King and Unicorn on white square against King and Unicorn on white square)');
                        setWin('Draw');
                    }
                } else {
                    if (!(((c % 2 == 0) && (Math.floor(c / 5) % 2 == 0)) || ((c % 2 == 0) && (Math.floor(c / 5) % 2 == 1)))) {
                        console.log('Draw by dead position (King and Unicorn on black square against King and Unicorn on black square)');
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
        <div className="app6">
            <div aria-live="polite">
                {((win == '') ? (player + "'s turn") : ((win == 'Draw') ? 'Draw' : ((win == 'Check') ? (player + ' is in check') : ('Winner is ' + win))))}
            </div>
            <div className="board6">
                {values.map((value, index) => (<Cell id={index} value={value} win={win} player={player} selected={selected} setCount={setCount}
                    setPlayer={() => playerModifier(setPlayer)} setArray={arrayModifier} setSelected={setSelected} checkForMovement={checkForMovement} />))}
            </div>
            <button onClick={reset}>Reset</button>
        </div>
    );
} 