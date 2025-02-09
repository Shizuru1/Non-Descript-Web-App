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
                if (selected.piece == '♖' || selected.piece == '♜') {
                    if (id % 8 == selected.id % 8) {
                        // same file
                        if (id > selected.id) {
                            for (let i = selected.id + 8; i < id; i += 8) {
                                setArray(i, '');
                            }
                        } else if (id < selected.id) {
                            for (let i = id + 8; i < selected.id; i += 8) {
                                setArray(i, '');
                            }
                        }
                    } else if (Math.floor(id / 8) == Math.floor(selected.id / 8)) {
                        // same rank
                        if (id > selected.id) {
                            for (let i = selected.id + 1; i < id; i ++) {
                                setArray(i, '');
                            }
                        } else if (id < selected.id) {
                            for (let i = id + 1; i < selected.id; i++) {
                                setArray(i, '');
                            }
                        }
                    }
                }
                setPlayer();
                setArray(selected.id, '');
                setArray(id, selected.piece);
                setSelected({ id: selected.id, value: false, piece: selected.piece, blockedArray: selected.blockedArray });
            }
            // Upgrade White Soldier to General
            if (id < 8 && selected.piece == '♙') {
                setArray(id, '🨣');
            }
            // Upgrade Black Soldier to General
            if (id > 55 && selected.piece == '♟') {
                setArray(id, '🨩');
            }
        } else {
            setSelected({ id: id, value: true, piece: value, blockedArray: selected.blockedArray });
        }
    }

    const checkerboard = ((id % 2 != 1) && (Math.floor(id / 8) % 2 != 1)) || ((id % 2 == 1) && (Math.floor(id / 8) % 2 == 1));
    const blackSelect = player == 'Black' && value != '♟' && value != '🨩' && value != '♜' && value != '♞' && value != '🨼' && value != '🨒' && value != '♛' && value != '♚';
    const whiteSelect = player == 'White' && value != '♙' && value != '🨣' && value != '♖' && value != '♘' && value != '🨶' && value != '🨌' && value != '♕' && value != '♔';
    const select = !selected.value && (selected.blockedArray.some(val => (id == val)) || (blackSelect || whiteSelect));
    const movement = selected.value && !checkForMovement(selected.id).some(val => (id == val));
    const noWin = win != '' && win != 'Check';

    return <button className={"cell4" + (checkerboard ? "white" : "black")} onClick={handleClick}
        disabled={select || movement || noWin}>{value}</button>;
};

export default function App() {
    const [player, setPlayer] = useState('White'); // whose turn
    const [win, setWin] = useState(''); // win state
    const initArray = ['♜', '♞', '🨼', '♛', '♚', '🨒', '♞', '♜',
        '♟', '♟', '♟', '♟', '♟', '♟', '♟', '♟',
        '', '', '', '', '', '', '', '',
        '', '', '', '', '', '', '', '',
        '', '', '', '', '', '', '', '',
        '', '', '', '', '', '', '', '',
        '♙', '♙', '♙', '♙', '♙', '♙', '♙', '♙',
        '♖', '♘', '🨶', '♕', '♔', '🨌', '♘', '♖'];
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
        return piece == '♙' || piece == '🨣' || piece == '♖' || piece == '♘' || piece == '🨶' || piece == '🨌' || piece == '♕';
    }

    const blackPieces = (piece) => {
        return piece == '♟' || piece == '🨩' || piece == '♜' || piece == '♞' || piece == '🨼' || piece == '🨒' || piece == '♛';
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
        var blockera = false;
        for (let i = upArray[index]; i > -1; i = upArray[i]) {
            if (values[i] != '') {
                if (values[i] == '♜' || values[i] == '♛') {
                    if (values[i] == '♛' && !blockera) {
                        return true;
                    } else if (values[i] == '♜') {
                        return true;
                    }
                    break;
                } else if (values[i] == '♔' && i == upArray[index]) {
                    continue;
                } else {
                    if (values[i] == '♚') {
                        break;
                    } else if (!blockera) {
                        blockera = true;
                        continue;
                    }
                    break;
                }
            }
        }
        var blockerb = false;
        for (let i = downArray[index]; i > -1; i = downArray[i]) {
            if (values[i] != '') {
                if (values[i] == '♜' || values[i] == '♛') {
                    if (values[i] == '♛' && !blockerb) {
                        return true;
                    } else if (values[i] == '♜') {
                        return true;
                    }
                    break;
                } else if (values[i] == '♔' && i == downArray[index]) {
                    continue;
                } else {
                    if (values[i] == '♚') {
                        break;
                    } else if (!blockerb) {
                        blockerb = true;
                        continue;
                    }
                    break;
                }
            }
        }
        var blockerc = false;
        for (let i = leftArray[index]; i > -1; i = leftArray[i]) {
            if (values[i] != '') {
                if (values[i] == '♜' || values[i] == '♛') {
                    if (values[i] == '♛' && !blockerc) {
                        return true;
                    } else if (values[i] == '♜') {
                        return true;
                    }
                    break;
                } else if (values[i] == '♔' && i == leftArray[index]) {
                    continue;
                } else {
                    if (values[i] == '♚') {
                        break;
                    } else if (!blockerc) {
                        blockerc = true;
                        continue;
                    }
                    break;
                }
            }
        }
        var blockerd = false;
        for (let i = rightArray[index]; i > -1; i = rightArray[i]) {
            if (values[i] != '') {
                if (values[i] == '♜' || values[i] == '♛') {
                    if (values[i] == '♛' && !blockerd) {
                        return true;
                    } else if (values[i] == '♜') {
                        return true;
                    }
                    break;
                } else if (values[i] == '♔' && i == rightArray[index]) {
                    continue;
                } else {
                    if (values[i] == '♚') {
                        break;
                    } else if (!blockerd) {
                        blockerd = true;
                        continue;
                    }
                    break;
                }
            }
        }
        for (let i = upArray[leftArray[index]]; i > -1; i = upArray[leftArray[i]]) {
            if (values[i] != '') {
                if (values[i] == '🨼' || values[i] == '🨒' || values[i] == '♛') {
                    return true;
                } else if (values[i] == '♔' && i == upArray[leftArray[index]]) {
                    continue;
                }
                break;
            }
        }
        for (let i = downArray[rightArray[index]]; i > -1; i = downArray[rightArray[i]]) {
            if (values[i] != '') {
                if (values[i] == '🨼' || values[i] == '🨒' || values[i] == '♛') {
                    return true;
                } else if (values[i] == '♔' && i == downArray[rightArray[index]]) {
                    continue;
                }
                break;
            }
        }
        for (let i = upArray[rightArray[index]]; i > -1; i = upArray[rightArray[i]]) {
            if (values[i] != '') {
                if (values[i] == '🨼' || values[i] == '🨒' || values[i] == '♛') {
                    return true;
                } else if (values[i] == '♔' && i == upArray[rightArray[index]]) {
                    continue;
                }
                break;
            }
        }
        for (let i = downArray[leftArray[index]]; i > -1; i = downArray[leftArray[i]]) {
            if (values[i] != '') {
                if (values[i] == '🨼' || values[i] == '🨒' || values[i] == '♛') {
                    return true;
                } else if (values[i] == '♔' && i == downArray[leftArray[index]]) {
                    continue;
                }
                break;
            }
        }
        if (values[upArray[index]] == '♚' || values[upArray[index]] == '🨒') {
            return true;
        }
        if (values[downArray[index]] == '♚' || values[downArray[index]] == '🨒') {
            return true;
        }
        if (values[leftArray[index]] == '♚' || values[leftArray[index]] == '🨒') {
            return true;
        }
        if (values[rightArray[index]] == '♚' || values[rightArray[index]] == '🨒') {
            return true;
        }
        if (values[upArray[leftArray[index]]] == '♚' || values[upArray[leftArray[index]]] == '♟') {
            return true;
        }
        if (values[upArray[rightArray[index]]] == '♚' || values[upArray[rightArray[index]]] == '♟') {
            return true;
        }
        if (values[downArray[leftArray[index]]] == '♚' || values[downArray[leftArray[index]]] == '🨩') {
            return true;
        }
        if (values[downArray[rightArray[index]]] == '♚' || values[downArray[rightArray[index]]] == '🨩') {
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
        var blockera = false;
        for (let i = upArray[index]; i > -1; i = upArray[i]) {
            if (values[i] != '') {
                if (values[i] == '♖' || values[i] == '♕') {
                    if (values[i] == '♕' && !blockera) {
                        return true;
                    } else if (values[i] == '♖') {
                        return true;
                    }
                    break;
                } else if (values[i] == '♚' && i == upArray[index]) {
                    continue;
                } else {
                    if (values[i] == '♔') {
                        break;
                    } else if (!blockera) {
                        blockera = true;
                        continue;
                    }
                    break;
                }
            }
        }
        var blockerb = false;
        for (let i = downArray[index]; i > -1; i = downArray[i]) {
            if (values[i] != '') {
                if (values[i] == '♖' || values[i] == '♕') {
                    if (values[i] == '♕' && !blockerb) {
                        return true;
                    } else if (values[i] == '♖') {
                        return true;
                    }
                    break;
                } else if (values[i] == '♚' && i == downArray[index]) {
                    continue;
                } else {
                    if (values[i] == '♔') {
                        break;
                    } else if (!blockerb) {
                        blockerb = true;
                        continue;
                    }
                    break;
                }
            }
        }
        var blockerc = false;
        for (let i = leftArray[index]; i > -1; i = leftArray[i]) {
            if (values[i] != '') {
                if (values[i] == '♖' || values[i] == '♕') {
                    if (values[i] == '♕' && !blockerc) {
                        return true;
                    } else if (values[i] == '♖') {
                        return true;
                    }
                    break;
                } else if (values[i] == '♚' && i == leftArray[index]) {
                    continue;
                } else {
                    if (values[i] == '♔') {
                        break;
                    } else if (!blockerc) {
                        blockerc = true;
                        continue;
                    }
                    break;
                }
            }
        }
        var blockerd = false;
        for (let i = rightArray[index]; i > -1; i = rightArray[i]) {
            if (values[i] != '') {
                if (values[i] == '♖' || values[i] == '♕') {
                    if (values[i] == '♕' && !blockerd) {
                        return true;
                    } else if (values[i] == '♖') {
                        return true;
                    }
                    break;
                } else if (values[i] == '♚' && i == rightArray[index]) {
                    continue;
                } else {
                    if (values[i] == '♔') {
                        break;
                    } else if (!blockerd) {
                        blockerd = true;
                        continue;
                    }
                    break;
                }
            }
        }
        for (let i = upArray[leftArray[index]]; i > -1; i = upArray[leftArray[i]]) {
            if (values[i] != '') {
                if (values[i] == '🨶' || values[i] == '🨌' || values[i] == '♕') {
                    return true;
                } else if (values[i] == '♚' && i == upArray[leftArray[index]]) {
                    continue;
                }
                break;
            }
        }
        for (let i = downArray[rightArray[index]]; i > -1; i = downArray[rightArray[i]]) {
            if (values[i] != '') {
                if (values[i] == '🨶' || values[i] == '🨌' || values[i] == '♕') {
                    return true;
                } else if (values[i] == '♚' && i == downArray[rightArray[index]]) {
                    continue;
                }
                break;
            }
        }
        for (let i = upArray[rightArray[index]]; i > -1; i = upArray[rightArray[i]]) {
            if (values[i] != '') {
                if (values[i] == '🨶' || values[i] == '🨌' || values[i] == '♕') {
                    return true;
                } else if (values[i] == '♚' && i == upArray[rightArray[index]]) {
                    continue;
                }
                break;
            }
        }
        for (let i = downArray[leftArray[index]]; i > -1; i = downArray[leftArray[i]]) {
            if (values[i] != '') {
                if (values[i] == '🨶' || values[i] == '🨌' || values[i] == '♕') {
                    return true;
                } else if (values[i] == '♚' && i == downArray[leftArray[index]]) {
                    continue;
                }
                break;
            }
        }
        if (values[upArray[index]] == '♔' || values[upArray[index]] == '🨌') {
            return true;
        }
        if (values[downArray[index]] == '♔' || values[downArray[index]] == '🨌') {
            return true;
        }
        if (values[leftArray[index]] == '♔' || values[leftArray[index]] == '🨌') {
            return true;
        }
        if (values[rightArray[index]] == '♔' || values[rightArray[index]] == '🨌') {
            return true;
        }
        if (values[downArray[leftArray[index]]] == '♔' || values[downArray[leftArray[index]]] == '♙') {
            return true;
        }
        if (values[downArray[rightArray[index]]] == '♔' || values[downArray[rightArray[index]]] == '♙') {
            return true;
        }
        if (values[upArray[leftArray[index]]] == '♔' || values[upArray[leftArray[index]]] == '🨣') {
            return true;
        }
        if (values[upArray[rightArray[index]]] == '♔' || values[upArray[rightArray[index]]] == '🨣') {
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
        var disca = '';
        for (let i = upArray[index]; i > -1; i = upArray[i]) {
            if (values[i] != '') {
                if (values[i] != '♔' && values[i] != '♚') {
                    if (whitePieces(values[i])) {
                        if (disca == '') {
                            disca = '♛';
                            var aa = i;
                            var ii = i;
                        } else if (disca == '♛' || disca == '♜') {
                            disca = '♜♜';
                            var ii = i;
                        } else {
                            break;
                        }
                    } else if (values[i] == '♛') {
                        if (disca == '♛') {
                            disca = '♜♜';
                            discoverArray.push({ direction: 'up', piece: aa });
                        } else if (disca == '') {
                            disca = '♜';
                        } else {
                            break;
                        }
                    } else if (values[i] == '♜') {
                        if (disca == '♜♜') {
                            discoverArray.push({ direction: 'up', piece: ii });
                            break;
                        } else if (disca == '') {
                            disca = '♜';
                        } else if (disca == '♛') {
                            disca = '♜♜';
                        } else {
                            break;
                        }
                    } else {
                        if (disca == '') {
                            disca = '♜';
                        } else if (disca == '♛') {
                            disca = '♜♜';
                        } else {
                            break;
                        }
                    }
                }
                else {
                    break;
                }
            }
        }
        var discb = '';
        for (let i = downArray[index]; i > -1; i = downArray[i]) {
            if (values[i] != '') {
                if (values[i] != '♔' && values[i] != '♚') {
                    if (whitePieces(values[i])) {
                        if (discb == '') {
                            discb = '♛';
                            var bb = i;
                            var jj = i;
                        } else if (discb == '♛' || discb == '♜') {
                            discb = '♜♜';
                            var jj = i;
                        } else {
                            break;
                        }
                    } else if (values[i] == '♛') {
                        if (discb == '♛') {
                            discb = '♜♜';
                            discoverArray.push({ direction: 'down', piece: bb });
                        } else if (discb == '') {
                            discb = '♜';
                        } else {
                            break;
                        }
                    } else if (values[i] == '♜') {
                        if (discb == '♜♜') {
                            discoverArray.push({ direction: 'down', piece: jj });
                            break;
                        } else if (discb == '') {
                            discb = '♜';
                        } else if (discb == '♛') {
                            discb = '♜♜';
                        } else {
                            break;
                        }
                    } else {
                        if (discb == '') {
                            discb = '♜';
                        } else if (discb == '♛') {
                            discb = '♜♜';
                        } else {
                            break;
                        }
                    }
                }
                else {
                    break;
                }
            }
        }
        var discc = '';
        for (let i = leftArray[index]; i > -1; i = leftArray[i]) {
            if (values[i] != '') {
                if (values[i] != '♔' && values[i] != '♚') {
                    if (whitePieces(values[i])) {
                        if (discc == '') {
                            discc = '♛';
                            var cc = i;
                            var kk = i;
                        } else if (discc == '♛' || discc == '♜') {
                            discc = '♜♜';
                            var kk = i;
                        } else {
                            break;
                        }
                    } else if (values[i] == '♛') {
                        if (discc == '♛') {
                            discc = '♜♜';
                            discoverArray.push({ direction: 'left', piece: cc });
                        } else if (discc == '') {
                            discc = '♜';
                        } else {
                            break;
                        }
                    } else if (values[i] == '♜') {
                        if (discc == '♜♜') {
                            discoverArray.push({ direction: 'left', piece: kk });
                            break;
                        } else if (discc == '') {
                            discc = '♜';
                        } else if (discc == '♛') {
                            discc = '♜♜';
                        } else {
                            break;
                        }
                    } else {
                        if (discc == '') {
                            discc = '♜';
                        } else if (discc == '♛') {
                            discc = '♜♜';
                        } else {
                            break;
                        }
                    }
                }
                else {
                    break;
                }
            }
        }
        var discd = '';
        for (let i = rightArray[index]; i > -1; i = rightArray[i]) {
            if (values[i] != '') {
                if (values[i] != '♔' && values[i] != '♚') {
                    if (whitePieces(values[i])) {
                        if (discd == '') {
                            discd = '♛';
                            var dd = i;
                            var ll = i;
                        } else if (discd == '♛' || discd == '♜') {
                            discd = '♜♜';
                            var ll = i;
                        } else {
                            break;
                        }
                    } else if (values[i] == '♛') {
                        if (discd == '♛') {
                            discd = '♜♜';
                            discoverArray.push({ direction: 'right', piece: dd });
                        } else if (discd == '') {
                            discd = '♜';
                        } else {
                            break;
                        }
                    } else if (values[i] == '♜') {
                        if (discd == '♜♜') {
                            discoverArray.push({ direction: 'right', piece: ll });
                            break;
                        } else if (discd == '') {
                            discd = '♜';
                        } else if (discd == '♛') {
                            discd = '♜♜';
                        } else {
                            break;
                        }
                    } else {
                        if (discd == '') {
                            discd = '♜';
                        } else if (discd == '♛') {
                            discd = '♜♜';
                        } else {
                            break;
                        }
                    }
                }
                else {
                    break;
                }
            }
        }
        var disce = -1;
        for (let i = upArray[leftArray[index]]; i > -1; i = upArray[leftArray[i]]) {
            if (values[i] != '') {
                if (whitePieces(values[i])) {
                    if (disce == -1) {
                        disce = i;
                    }
                    break;
                } else if (disce > -1) {
                    if (values[i] == '🨼' || values[i] == '🨒' || values[i] == '♛') {
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
                    }
                    break;
                } else if (discf > -1) {
                    if (values[i] == '🨼' || values[i] == '🨒' || values[i] == '♛') {
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
                    }
                    break;
                } else if (discg > -1) {
                    if (values[i] == '🨼' || values[i] == '🨒' || values[i] == '♛') {
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
                    }
                    break;
                } else if (disch > -1) {
                    if (values[i] == '🨼' || values[i] == '🨒' || values[i] == '♛') {
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
        var disca = '';
        for (let i = upArray[index]; i > -1; i = upArray[i]) {
            if (values[i] != '') {
                if (values[i] != '♔' && values[i] != '♚') {
                    if (blackPieces(values[i])) {
                        if (disca == '') {
                            disca = '♕';
                            var aa = i;
                            var ii = i;
                        } else if (disca == '♕' || disca == '♖') {
                            disca = '♖♖';
                            var ii = i;
                        } else {
                            break;
                        }
                    } else if (values[i] == '♕') {
                        if (disca == '♕') {
                            disca = '♖♖';
                            discoverArray.push({ direction: 'up', piece: aa });
                        } else if (disca == '') {
                            disca = '♖';
                        } else {
                            break;
                        }
                    } else if (values[i] == '♖') {
                        if (disca == '♖♖') {
                            discoverArray.push({ direction: 'up', piece: ii });
                            break;
                        } else if (disca == '') {
                            disca = '♖';
                        } else if (disca == '♕') {
                            disca = '♖♖';
                        } else {
                            break;
                        }
                    } else {
                        if (disca == '') {
                            disca = '♖';
                        } else if (disca == '♕') {
                            disca = '♖♖';
                        } else {
                            break;
                        }
                    }
                }
                else {
                    break;
                }
            }
        }
        var discb = '';
        for (let i = downArray[index]; i > -1; i = downArray[i]) {
            if (values[i] != '') {
                if (values[i] != '♔' && values[i] != '♚') {
                    if (blackPieces(values[i])) {
                        if (discb == '') {
                            discb = '♕';
                            var bb = i;
                            var jj = i;
                        } else if (discb == '♕' || discb == '♖') {
                            discb = '♖♖';
                            var jj = i;
                        } else {
                            break;
                        }
                    } else if (values[i] == '♕') {
                        if (discb == '♕') {
                            discb = '♖♖';
                            discoverArray.push({ direction: 'down', piece: bb });
                        } else if (discb == '') {
                            discb = '♖';
                        } else {
                            break;
                        }
                    } else if (values[i] == '♖') {
                        if (discb == '♖♖') {
                            discoverArray.push({ direction: 'down', piece: jj });
                            break;
                        } else if (discb == '') {
                            discb = '♖';
                        } else if (discb == '♕') {
                            discb = '♖♖';
                        } else {
                            break;
                        }
                    } else {
                        if (discb == '') {
                            discb = '♖';
                        } else if (discb == '♕') {
                            discb = '♖♖';
                        } else {
                            break;
                        }
                    }
                }
                else {
                    break;
                }
            }
        }
        var discc = '';
        for (let i = leftArray[index]; i > -1; i = leftArray[i]) {
            if (values[i] != '') {
                if (values[i] != '♔' && values[i] != '♚') {
                    if (blackPieces(values[i])) {
                        if (discc == '') {
                            discc = '♕';
                            var cc = i;
                            var kk = i;
                        } else if (discc == '♕' || discc == '♖') {
                            discc = '♖♖';
                            var kk = i;
                        } else {
                            break;
                        }
                    } else if (values[i] == '♕') {
                        if (discc == '♕') {
                            discc = '♖♖';
                            discoverArray.push({ direction: 'left', piece: cc });
                        } else if (discc == '') {
                            discc = '♖';
                        } else {
                            break;
                        }
                    } else if (values[i] == '♖') {
                        if (discc == '♖♖') {
                            discoverArray.push({ direction: 'left', piece: kk });
                            break;
                        } else if (discc == '') {
                            discc = '♖';
                        } else if (discc == '♕') {
                            discc = '♖♖';
                        } else {
                            break;
                        }
                    } else {
                        if (discc == '') {
                            discc = '♖';
                        } else if (discc == '♕') {
                            discc = '♖♖';
                        } else {
                            break;
                        }
                    }
                }
                else {
                    break;
                }
            }
        }
        var discd = '';
        for (let i = rightArray[index]; i > -1; i = rightArray[i]) {
            if (values[i] != '') {
                if (values[i] != '♔' && values[i] != '♚') {
                    if (blackPieces(values[i])) {
                        if (discd == '') {
                            discd = '♕';
                            var dd = i;
                            var ll = i;
                        } else if (discd == '♕' || discd == '♖') {
                            discd = '♖♖';
                            var ll = i;
                        } else {
                            break;
                        }
                    } else if (values[i] == '♕') {
                        if (discd == '♕') {
                            discd = '♖♖';
                            discoverArray.push({ direction: 'right', piece: dd });
                        } else if (discd == '') {
                            discd = '♖';
                        } else {
                            break;
                        }
                    } else if (values[i] == '♖') {
                        if (discd == '♖♖') {
                            discoverArray.push({ direction: 'right', piece: ll });
                            break;
                        } else if (discd == '') {
                            discd = '♖';
                        } else if (discd == '♕') {
                            discd = '♖♖';
                        } else {
                            break;
                        }
                    } else {
                        if (discd == '') {
                            discd = '♖';
                        } else if (discd == '♕') {
                            discd = '♖♖';
                        } else {
                            break;
                        }
                    }
                }
                else {
                    break;
                }
            }
        }
        var disce = -1;
        for (let i = upArray[leftArray[index]]; i > -1; i = upArray[leftArray[i]]) {
            if (values[i] != '') {
                if (blackPieces(values[i])) {
                    if (disce == -1) {
                        disce = i;
                    }
                    break;
                } else if (disce > -1) {
                    if (values[i] == '🨶' || values[i] == '🨌' || values[i] == '♕') {
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
                    }
                    break;
                } else if (discf > -1) {
                    if (values[i] == '🨶' || values[i] == '🨌' || values[i] == '♕') {
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
                    }
                    break;
                } else if (discg > -1) {
                    if (values[i] == '🨶' || values[i] == '🨌' || values[i] == '♕') {
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
                    }
                    break;
                } else if (disch > -1) {
                    if (values[i] == '🨶' || values[i] == '🨌' || values[i] == '♕') {
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
            var blockera = false;
            for (let i = upArray[index]; i > -1; i = upArray[i]) {
                if (values[i] != '') {
                    if (blockera) {
                        if (values[i] == '♖') {
                            checkArray.push({ index: i, piece: '♖' });
                        }
                    } else {
                        if (values[i] == '♖') {
                            blockera = true;
                            checkArray.push({ index: i, piece: '♖' });
                        } else if (values[i] == '♕') {
                            blockera = true;
                            checkArray.push({ index: i, piece: '♕' });
                        } else if (values[i] != '♔') {
                            blockera = true;
                        } else {
                            break;
                        }
                    }
                }
            }
            var blockerb = false;
            for (let i = downArray[index]; i > -1; i = downArray[i]) {
                if (values[i] != '') {
                    if (blockerb) {
                        if (values[i] == '♖') {
                            checkArray.push({ index: i, piece: '♖' });
                        }
                    } else {
                        if (values[i] == '♖') {
                            blockerb = true;
                            checkArray.push({ index: i, piece: '♖' });
                        } else if (values[i] == '♕') {
                            blockerb = true;
                            checkArray.push({ index: i, piece: '♕' });
                        } else if (values[i] != '♔') {
                            blockerb = true;
                        } else {
                            break;
                        }
                    }
                }
            }
            var blockerc = false;
            for (let i = leftArray[index]; i > -1; i = leftArray[i]) {
                if (values[i] != '') {
                    if (blockerc) {
                        if (values[i] == '♖') {
                            checkArray.push({ index: i, piece: '♖' });
                        }
                    } else {
                        if (values[i] == '♖') {
                            blockerc = true;
                            checkArray.push({ index: i, piece: '♖' });
                        } else if (values[i] == '♕') {
                            blockerc = true;
                            checkArray.push({ index: i, piece: '♕' });
                        } else if (values[i] != '♔') {
                            blockerc = true;
                        } else {
                            break;
                        }
                    }
                }
            }
            var blockerd = false;
            for (let i = rightArray[index]; i > -1; i = rightArray[i]) {
                if (values[i] != '') {
                    if (blockerd) {
                        if (values[i] == '♖') {
                            checkArray.push({ index: i, piece: '♖' });
                        }
                    } else {
                        if (values[i] == '♖') {
                            blockerd = true;
                            checkArray.push({ index: i, piece: '♖' });
                        } else if (values[i] == '♕') {
                            blockerd = true;
                            checkArray.push({ index: i, piece: '♕' });
                        } else if (values[i] != '♔') {
                            blockerd = true;
                        } else {
                            break;
                        }
                    }
                }
            }
            for (let i = upArray[leftArray[index]]; i > -1; i = upArray[leftArray[i]]) {
                if (values[i] != '') {
                    if (values[i] == '🨶' || values[i] == '🨌' || values[i] == '♕') {
                        checkArray.push({ index: i, piece: values[i] });
                        break;
                    }
                    break;
                }
            }
            for (let i = downArray[rightArray[index]]; i > -1; i = downArray[rightArray[i]]) {
                if (values[i] != '') {
                    if (values[i] == '🨶' || values[i] == '🨌' || values[i] == '♕') {
                        checkArray.push({ index: i, piece: values[i] });
                        break;
                    }
                    break;
                }
            }
            for (let i = upArray[rightArray[index]]; i > -1; i = upArray[rightArray[i]]) {
                if (values[i] != '') {
                    if (values[i] == '🨶' || values[i] == '🨌' || values[i] == '♕') {
                        checkArray.push({ index: i, piece: values[i] });
                        break;
                    }
                    break;
                }
            }
            for (let i = downArray[leftArray[index]]; i > -1; i = downArray[leftArray[i]]) {
                if (values[i] != '') {
                    if (values[i] == '🨶' || values[i] == '🨌' || values[i] == '♕') {
                        checkArray.push({ index: i, piece: values[i] });
                        break;
                    }
                    break;
                }
            }
            if (values[upArray[index]] == '🨌') {
                checkArray.push({ index: upArray[index], piece: '🨌' });
            }
            if (values[downArray[index]] == '🨌') {
                checkArray.push({ index: downArray[index], piece: '🨌' });
            }
            if (values[rightArray[index]] == '🨌') {
                checkArray.push({ index: rightArray[index], piece: '🨌' });
            }
            if (values[leftArray[index]] == '🨌') {
                checkArray.push({ index: leftArray[index], piece: '🨌' });
            }
            if (values[upArray[leftArray[index]]] == '🨣') {
                checkArray.push({ index: upArray[leftArray[index]], piece: '🨣' });
            }
            if (values[upArray[rightArray[index]]] == '🨣') {
                checkArray.push({ index: upArray[rightArray[index]], piece: '🨣' });
            }
            if (values[downArray[leftArray[index]]] == '♙' || values[downArray[leftArray[index]]] == '🨣') {
                checkArray.push({ index: downArray[leftArray[index]], piece: values[downArray[leftArray[index]]] });
            }
            if (values[downArray[rightArray[index]]] == '♙' || values[downArray[rightArray[index]]] == '🨣') {
                checkArray.push({ index: downArray[rightArray[index]], piece: values[downArray[rightArray[index]]] });
            }
            if (values[upArray[leftArray[leftArray[index]]]] == '♘' || values[upArray[leftArray[leftArray[index]]]] == '♕') {
                checkArray.push({ index: upArray[leftArray[leftArray[index]]], piece: values[upArray[leftArray[leftArray[index]]]] });
            }
            if (values[downArray[leftArray[leftArray[index]]]] == '♘' || values[downArray[leftArray[leftArray[index]]]] == '♕') {
                checkArray.push({ index: downArray[leftArray[leftArray[index]]], piece: values[downArray[leftArray[leftArray[index]]]] });
            }
            if (values[upArray[upArray[leftArray[index]]]] == '♘' || values[upArray[upArray[leftArray[index]]]] == '♕') {
                checkArray.push({ index: upArray[upArray[leftArray[index]]], piece: values[upArray[upArray[leftArray[index]]]] });
            }
            if (values[downArray[downArray[leftArray[index]]]] == '♘' || values[downArray[downArray[leftArray[index]]]] == '♕') {
                checkArray.push({ index: downArray[downArray[leftArray[index]]], piece: values[downArray[downArray[leftArray[index]]]] });
            }
            if (values[upArray[rightArray[rightArray[index]]]] == '♘' || values[upArray[rightArray[rightArray[index]]]] == '♕') {
                checkArray.push({ index: upArray[rightArray[rightArray[index]]], piece: values[upArray[rightArray[rightArray[index]]]] });
            }
            if (values[downArray[rightArray[rightArray[index]]]] == '♘' || values[downArray[rightArray[rightArray[index]]]] == '♕') {
                checkArray.push({ index: downArray[rightArray[rightArray[index]]], piece: values[downArray[rightArray[rightArray[index]]]] });
            }
            if (values[upArray[upArray[rightArray[index]]]] == '♘' || values[upArray[upArray[rightArray[index]]]] == '♕') {
                checkArray.push({ index: upArray[upArray[rightArray[index]]], piece: values[upArray[upArray[rightArray[index]]]] });
            }
            if (values[downArray[downArray[rightArray[index]]]] == '♘' || values[downArray[downArray[rightArray[index]]]] == '♕') {
                checkArray.push({ index: downArray[downArray[rightArray[index]]], piece: values[downArray[downArray[rightArray[index]]]] });
            }
        } else if (colour == 'White') {
            var blockera = false;
            for (let i = upArray[index]; i > -1; i = upArray[i]) {
                if (values[i] != '') {
                    if (blockera) {
                        if (values[i] == '♜') {
                            checkArray.push({ index: i, piece: '♜' });
                        }
                    } else {
                        if (values[i] == '♜') {
                            blockera = true;
                            checkArray.push({ index: i, piece: '♜' });
                        } else if (values[i] == '♛') {
                            blockera = true;
                            checkArray.push({ index: i, piece: '♛' });
                        } else if (values[i] != '♚') {
                            blockera = true;
                        } else {
                            break;
                        }
                    }
                }
            }
            var blockerb = false;
            for (let i = downArray[index]; i > -1; i = downArray[i]) {
                if (values[i] != '') {
                    if (blockerb) {
                        if (values[i] == '♜') {
                            checkArray.push({ index: i, piece: '♜' });
                        }
                    } else {
                        if (values[i] == '♜') {
                            blockerb = true;
                            checkArray.push({ index: i, piece: '♜' });
                        } else if (values[i] == '♛') {
                            blockerb = true;
                            checkArray.push({ index: i, piece: '♛' });
                        } else if (values[i] != '♚') {
                            blockerb = true;
                        } else {
                            break;
                        }
                    }
                }
            }
            var blockerc = false;
            for (let i = leftArray[index]; i > -1; i = leftArray[i]) {
                if (values[i] != '') {
                    if (blockerc) {
                        if (values[i] == '♜') {
                            checkArray.push({ index: i, piece: '♜' });
                        }
                    } else {
                        if (values[i] == '♜') {
                            blockerc = true;
                            checkArray.push({ index: i, piece: '♜' });
                        } else if (values[i] == '♛') {
                            blockerc = true;
                            checkArray.push({ index: i, piece: '♛' });
                        } else if (values[i] != '♚') {
                            blockerc = true;
                        } else {
                            break;
                        }
                    }
                }
            }
            var blockerd = false;
            for (let i = rightArray[index]; i > -1; i = rightArray[i]) {
                if (values[i] != '') {
                    if (blockerd) {
                        if (values[i] == '♜') {
                            checkArray.push({ index: i, piece: '♜' });
                        }
                    } else {
                        if (values[i] == '♜') {
                            blockerd = true;
                            checkArray.push({ index: i, piece: '♜' });
                        } else if (values[i] == '♛') {
                            blockerd = true;
                            checkArray.push({ index: i, piece: '♛' });
                        } else if (values[i] != '♚') {
                            blockerd = true;
                        } else {
                            break;
                        }
                    }
                }
            }
            for (let i = upArray[leftArray[index]]; i > -1; i = upArray[leftArray[i]]) {
                if (values[i] != '') {
                    if (values[i] == '🨼' || values[i] == '🨒' || values[i] == '♛') {
                        checkArray.push({ index: i, piece: values[i] });
                        break;
                    }
                    break;
                }
            }
            for (let i = downArray[rightArray[index]]; i > -1; i = downArray[rightArray[i]]) {
                if (values[i] != '') {
                    if (values[i] == '🨼' || values[i] == '🨒' || values[i] == '♛') {
                        checkArray.push({ index: i, piece: values[i] });
                        break;
                    }
                    break;
                }
            }
            for (let i = upArray[rightArray[index]]; i > -1; i = upArray[rightArray[i]]) {
                if (values[i] != '') {
                    if (values[i] == '🨼' || values[i] == '🨒' || values[i] == '♛') {
                        checkArray.push({ index: i, piece: values[i] });
                        break;
                    }
                    break;
                }
            }
            for (let i = downArray[leftArray[index]]; i > -1; i = downArray[leftArray[i]]) {
                if (values[i] != '') {
                    if (values[i] == '🨼' || values[i] == '🨒' || values[i] == '♛') {
                        checkArray.push({ index: i, piece: values[i] });
                        break;
                    }
                    break;
                }
            }
            if (values[upArray[index]] == '🨒') {
                checkArray.push({ index: upArray[index], piece: '🨒' });
            }
            if (values[downArray[index]] == '🨒') {
                checkArray.push({ index: downArray[index], piece: '🨒' });
            }
            if (values[rightArray[index]] == '🨒') {
                checkArray.push({ index: rightArray[index], piece: '🨒' });
            }
            if (values[leftArray[index]] == '🨒') {
                checkArray.push({ index: leftArray[index], piece: '🨒' });
            }
            if (values[downArray[leftArray[index]]] == '🨩') {
                checkArray.push({ index: downArray[leftArray[index]], piece: '🨩' });
            }
            if (values[downArray[rightArray[index]]] == '🨩') {
                checkArray.push({ index: downArray[rightArray[index]], piece: '🨩' });
            }
            if (values[upArray[leftArray[index]]] == '♟' || values[upArray[leftArray[index]]] == '🨩') {
                checkArray.push({ index: upArray[leftArray[index]], piece: values[upArray[leftArray[index]]] });
            }
            if (values[upArray[rightArray[index]]] == '♟' || values[upArray[rightArray[index]]] == '🨩') {
                checkArray.push({ index: upArray[rightArray[index]], piece: values[upArray[rightArray[index]]] });
            }
            if (values[upArray[leftArray[leftArray[index]]]] == '♞' || values[upArray[leftArray[leftArray[index]]]] == '♛') {
                checkArray.push({ index: upArray[leftArray[leftArray[index]]], piece: values[upArray[leftArray[leftArray[index]]]] });
            }
            if (values[downArray[leftArray[leftArray[index]]]] == '♞' || values[downArray[leftArray[leftArray[index]]]] == '♛') {
                checkArray.push({ index: downArray[leftArray[leftArray[index]]], piece: values[downArray[leftArray[leftArray[index]]]] });
            }
            if (values[upArray[upArray[leftArray[index]]]] == '♞' || values[upArray[upArray[leftArray[index]]]] == '♛') {
                checkArray.push({ index: upArray[upArray[leftArray[index]]], piece: values[upArray[upArray[leftArray[index]]]] });
            }
            if (values[downArray[downArray[leftArray[index]]]] == '♞' || values[downArray[downArray[leftArray[index]]]] == '♛') {
                checkArray.push({ index: downArray[downArray[leftArray[index]]], piece: values[downArray[downArray[leftArray[index]]]] });
            }
            if (values[upArray[rightArray[rightArray[index]]]] == '♞' || values[upArray[rightArray[rightArray[index]]]] == '♛') {
                checkArray.push({ index: upArray[rightArray[rightArray[index]]], piece: values[upArray[rightArray[rightArray[index]]]] });
            }
            if (values[downArray[rightArray[rightArray[index]]]] == '♞' || values[downArray[rightArray[rightArray[index]]]] == '♛') {
                checkArray.push({ index: downArray[rightArray[rightArray[index]]], piece: values[downArray[rightArray[rightArray[index]]]] });
            }
            if (values[upArray[upArray[rightArray[index]]]] == '♞' || values[upArray[upArray[rightArray[index]]]] == '♛') {
                checkArray.push({ index: upArray[upArray[rightArray[index]]], piece: values[upArray[upArray[rightArray[index]]]] });
            }
            if (values[downArray[downArray[rightArray[index]]]] == '♞' || values[downArray[downArray[rightArray[index]]]] == '♛') {
                checkArray.push({ index: downArray[downArray[rightArray[index]]], piece: values[downArray[downArray[rightArray[index]]]] });
            }
        }
        return checkArray;
    }

    const whiteKingMovement = (array, index) => {
        if (values[upArray[index]] == '') {
            if (!checkForCheckWhite(upArray[index])) {
                array.push(upArray[index]);
            }
        }
        if (values[downArray[index]] == '') {
            if (!checkForCheckWhite(downArray[index])) {
                array.push(downArray[index]);
            }
        }
        if (values[leftArray[index]] == '') {
            if (!checkForCheckWhite(leftArray[index])) {
                array.push(leftArray[index]);
            }
        }
        if (values[rightArray[index]] == '') {
            if (!checkForCheckWhite(rightArray[index])) {
                array.push(rightArray[index]);
            }
        }
        if (values[upArray[leftArray[index]]] == '') {
            if (!checkForCheckWhite(upArray[leftArray[index]])) {
                array.push(upArray[leftArray[index]]);
            }
        }
        if (values[downArray[leftArray[index]]] == '') {
            if (!checkForCheckWhite(downArray[leftArray[index]])) {
                array.push(downArray[leftArray[index]]);
            }
        }
        if (values[upArray[rightArray[index]]] == '') {
            if (!checkForCheckWhite(upArray[rightArray[index]])) {
                array.push(upArray[rightArray[index]]);
            }
        }
        if (values[downArray[rightArray[index]]] == '') {
            if (!checkForCheckWhite(downArray[rightArray[index]])) {
                array.push(downArray[rightArray[index]]);
            }
        }
    }

    const blackKingMovement = (array, index) => {
        if (values[upArray[index]] == '') {
            if (!checkForCheckBlack(upArray[index])) {
                array.push(upArray[index]);
            }
        }
        if (values[downArray[index]] == '') {
            if (!checkForCheckBlack(downArray[index])) {
                array.push(downArray[index]);
            }
        }
        if (values[leftArray[index]] == '') {
            if (!checkForCheckBlack(leftArray[index])) {
                array.push(leftArray[index]);
            }
        }
        if (values[rightArray[index]] == '') {
            if (!checkForCheckBlack(rightArray[index])) {
                array.push(rightArray[index]);
            }
        }
        if (values[upArray[leftArray[index]]] == '') {
            if (!checkForCheckBlack(upArray[leftArray[index]])) {
                array.push(upArray[leftArray[index]]);
            }
        }
        if (values[downArray[leftArray[index]]] == '') {
            if (!checkForCheckBlack(downArray[leftArray[index]])) {
                array.push(downArray[leftArray[index]]);
            }
        }
        if (values[upArray[rightArray[index]]] == '') {
            if (!checkForCheckBlack(upArray[rightArray[index]])) {
                array.push(upArray[rightArray[index]]);
            }
        }
        if (values[downArray[rightArray[index]]] == '') {
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
        var sameAsMage = false;
        if (checkArr.length == 2) {
            if (player == 'White') {
                var mageCheck = checkArr.findIndex(value => value.piece == '♜');
                if (mageCheck != -1) {
                    if (checkArr[Math.abs(mageCheck - 1)].piece == '♜' || checkArr[Math.abs(mageCheck - 1)].piece == '♛' || checkArr[Math.abs(mageCheck - 1)].piece == '🨒') {
                        if (checkArr[Math.abs(mageCheck - 1)].index % 8 == checkArr[mageCheck].index % 8 || Math.floor(checkArr[Math.abs(mageCheck - 1)].index / 8) == Math.floor(checkArr[mageCheck].index / 8)) {
                            sameAsMage = true;
                        }
                    }
                }
            } else {
                var mageCheck = checkArr.findIndex(value => value.piece == '♖');
                if (mageCheck != -1) {
                    if (checkArr[Math.abs(mageCheck - 1)].piece == '♖' || checkArr[Math.abs(mageCheck - 1)].piece == '♕' || checkArr[Math.abs(mageCheck - 1)].piece == '🨌') {
                        if (checkArr[Math.abs(mageCheck - 1)].index % 8 == checkArr[mageCheck].index % 8 || Math.floor(checkArr[Math.abs(mageCheck - 1)].index / 8) == Math.floor(checkArr[mageCheck].index / 8)) {
                            sameAsMage = true;
                        }
                    }
                }
            }
        }
        if (checkArr.length > 1 && !sameAsMage) {
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
        } else if (checkArr.length == 1 || sameAsMage) {
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
                    } else {
                        uncheckArray.push(checkArr[0].index);
                    }
                    break;
                case '🨶':
                case '🨼':
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
                case '🨌':
                case '🨒':
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
                    } else {
                        uncheckArray.push(checkArr[0].index);
                    }
                    break;
                case '♖':
                    if (Math.floor(checkArr[0].index / 8) == Math.floor(checkIndex / 8)) {
                        // same rank
                        if (checkArr[0].index > checkIndex) {
                            var blocker = false;
                            for (let i = checkArr[0].index; i > checkIndex; i--) {
                                if (i == checkArr[0].index) {
                                    uncheckArray.push(i);
                                } else if (whitePieces(values[i])) {
                                    blocker = true;
                                    uncheckArray.push(i);
                                } else if (blackPieces(values[i])) {
                                    blocker = true;
                                } else if (values[i] == '') {
                                    uncheckArray.push(i);
                                }
                            }
                            if (!blocker) {
                                uncheckArray = [];
                                uncheckArray.push(checkArr[0].index)
                            }
                        } else if (checkArr[0].index < checkIndex) {
                            var blocker = false;
                            for (let i = checkArr[0].index; i < checkIndex; i++) {
                                if (i == checkArr[0].index) {
                                    uncheckArray.push(i);
                                } else if (whitePieces(values[i])) {
                                    blocker = true;
                                    uncheckArray.push(i);
                                } else if (blackPieces(values[i])) {
                                    blocker = true;
                                } else if (values[i] == '') {
                                    uncheckArray.push(i);
                                }
                            }
                            if (!blocker) {
                                uncheckArray = [];
                                uncheckArray.push(checkArr[0].index)
                            }
                        }
                    } else if (checkArr[0].index % 8 == checkIndex % 8) {
                        // same file
                        if (checkArr[0].index > checkIndex) {
                            var blocker = false;
                            for (let i = checkArr[0].index; i > checkIndex; i -= 8) {
                                if (i == checkArr[0].index) {
                                    uncheckArray.push(i);
                                } else if (whitePieces(values[i])) {
                                    blocker = true;
                                    uncheckArray.push(i);
                                } else if (blackPieces(values[i])) {
                                    blocker = true;
                                } else if (values[i] == '') {
                                    uncheckArray.push(i);
                                }
                            }
                            if (!blocker) {
                                uncheckArray = [];
                                uncheckArray.push(checkArr[0].index)
                            }
                        } else if (checkArr[0].index < checkIndex) {
                            var blocker = false;
                            for (let i = checkArr[0].index; i < checkIndex; i += 8) {
                                if (i == checkArr[0].index) {
                                    uncheckArray.push(i);
                                } else if (whitePieces(values[i])) {
                                    blocker = true;
                                    uncheckArray.push(i);
                                } else if (blackPieces(values[i])) {
                                    blocker = true;
                                } else if (values[i] == '') {
                                    uncheckArray.push(i);
                                }
                            }
                            if (!blocker) {
                                uncheckArray = [];
                                uncheckArray.push(checkArr[0].index)
                            }
                        }
                    }
                    break;
                case '♜':
                    if (Math.floor(checkArr[0].index / 8) == Math.floor(checkIndex / 8)) {
                        // same rank
                        if (checkArr[0].index > checkIndex) {
                            var blocker = false;
                            for (let i = checkArr[0].index; i > checkIndex; i--) {
                                if (i == checkArr[0].index) {
                                    uncheckArray.push(i);
                                } else if (whitePieces(values[i])) {
                                    blocker = true;
                                } else if (blackPieces(values[i])) {
                                    blocker = true;
                                    uncheckArray.push(i);
                                } else if (values[i] == '') {
                                    uncheckArray.push(i);
                                }
                            }
                            if (!blocker) {
                                uncheckArray = [];
                                uncheckArray.push(checkArr[0].index)
                            }
                        } else if (checkArr[0].index < checkIndex) {
                            var blocker = false;
                            for (let i = checkArr[0].index; i < checkIndex; i++) {
                                if (i == checkArr[0].index) {
                                    uncheckArray.push(i);
                                } else if (whitePieces(values[i])) {
                                    blocker = true;
                                } else if (blackPieces(values[i])) {
                                    blocker = true;
                                    uncheckArray.push(i);
                                } else if (values[i] == '') {
                                    uncheckArray.push(i);
                                }
                            }
                            if (!blocker) {
                                uncheckArray = [];
                                uncheckArray.push(checkArr[0].index)
                            }
                        }
                    } else if (checkArr[0].index % 8 == checkIndex % 8) {
                        // same file
                        if (checkArr[0].index > checkIndex) {
                            var blocker = false;
                            for (let i = checkArr[0].index; i > checkIndex; i -= 8) {
                                if (i == checkArr[0].index) {
                                    uncheckArray.push(i);
                                } else if (whitePieces(values[i])) {
                                    blocker = true;
                                } else if (blackPieces(values[i])) {
                                    blocker = true;
                                    uncheckArray.push(i);
                                } else if (values[i] == '') {
                                    uncheckArray.push(i);
                                }
                            }
                            if (!blocker) {
                                uncheckArray = [];
                                uncheckArray.push(checkArr[0].index)
                            }
                        } else if (checkArr[0].index < checkIndex) {
                            var blocker = false;
                            for (let i = checkArr[0].index; i < checkIndex; i += 8) {
                                if (i == checkArr[0].index) {
                                    uncheckArray.push(i);
                                } else if (whitePieces(values[i])) {
                                    blocker = true;
                                } else if (blackPieces(values[i])) {
                                    blocker = true;
                                    uncheckArray.push(i);
                                } else if (values[i] == '') {
                                    uncheckArray.push(i);
                                }
                            }
                            if (!blocker) {
                                uncheckArray = [];
                                uncheckArray.push(checkArr[0].index)
                            }
                        }
                    }
                    break;
                case '♘':
                case '♞':
                case '🨣':
                case '🨩':
                case '♙':
                case '♟':
                    uncheckArray.push(checkArr[0].index);
                    break;
                default:
                    break;
            }
            switch (values[index]) {
                // White Soldier Movement
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
                        for (let i = upArray[index]; i > -1; i = upArray[i]) {
                            if (uncheckArray.some(val => (i == val)) && values[i] == '') {
                                moveArray.push(i);
                                continue;
                            } else if (values[i] == '') {
                                continue;
                            }
                            break;
                        }
                    }
                    break;
                // Black Soldier Movement
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
                        for (let i = downArray[index]; i > -1; i = downArray[i]) {
                            if (uncheckArray.some(val => (i == val)) && values[i] == '') {
                                moveArray.push(i);
                                continue;
                            } else if (values[i] == '') {
                                continue;
                            }
                            break;
                        }
                    }
                    break;
                // General Movement
                case '🨣':
                case '🨩':
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
                        for (let i = upArray[index]; i > -1; i = upArray[i]) {
                            if (uncheckArray.some(val => (i == val)) && values[i] == '') {
                                moveArray.push(i);
                                continue;
                            } else if (values[i] == '') {
                                continue;
                            }
                            break;
                        }
                        for (let i = downArray[index]; i > -1; i = downArray[i]) {
                            if (uncheckArray.some(val => (i == val)) && values[i] == '') {
                                moveArray.push(i);
                                continue;
                            } else if (values[i] == '') {
                                continue;
                            }
                            break;
                        }
                    }
                    break;
                // White Mage Movement
                case '♖':
                    if (discDir == 'up' || discDir == 'down' || discDir == '') {
                        var blockera = false;
                        for (let i = upArray[index]; i > -1; i = upArray[i]) {
                            if (uncheckArray.some(val => (i == val))) {
                                moveArray.push(i);
                                continue;
                            } else if (values[i] == '') {
                                continue;
                            } else if (values[i] != '' && values[i] != '♔' && !blockera) {
                                blockera = true;
                                continue;
                            }
                            break;
                        }
                        var blockerb = false;
                        for (let i = downArray[index]; i > -1; i = downArray[i]) {
                            if (uncheckArray.some(val => (i == val))) {
                                moveArray.push(i);
                                continue;
                            } else if (values[i] == '') {
                                continue;
                            } else if (values[i] != '' && values[i] != '♔' && !blockerb) {
                                blockerb = true;
                                continue;
                            }
                            break;
                        }
                    }
                    if (discDir == 'left' || discDir == 'right' || discDir == '') {
                        var blockerc = false;
                        for (let i = leftArray[index]; i > -1; i = leftArray[i]) {
                            if (uncheckArray.some(val => (i == val))) {
                                moveArray.push(i);
                                continue;
                            } else if (values[i] == '') {
                                continue;
                            } else if (values[i] != '' && values[i] != '♔' && !blockerc) {
                                blockerc = true;
                                continue;
                            }
                            break;
                        }
                        var blockerd = false;
                        for (let i = rightArray[index]; i > -1; i = rightArray[i]) {
                            if (uncheckArray.some(val => (i == val))) {
                                moveArray.push(i);
                                continue;
                            } else if (values[i] == '') {
                                continue;
                            } else if (values[i] != '' && values[i] != '♔' && !blockerd) {
                                blockerd = true;
                                continue;
                            }
                            break;
                        }
                    }
                    break;
                // Black Mage Movement
                case '♜':
                    if (discDir == 'up' || discDir == 'down' || discDir == '') {
                        var blockera = false;
                        for (let i = upArray[index]; i > -1; i = upArray[i]) {
                            if (uncheckArray.some(val => (i == val))) {
                                moveArray.push(i);
                                continue;
                            } else if (values[i] == '') {
                                continue;
                            } else if (values[i] != '' && values[i] != '♚' && !blockera) {
                                blockera = true;
                                continue;
                            }
                            break;
                        }
                        var blockerb = false;
                        for (let i = downArray[index]; i > -1; i = downArray[i]) {
                            if (uncheckArray.some(val => (i == val))) {
                                moveArray.push(i);
                                continue;
                            } else if (values[i] == '') {
                                continue;
                            } else if (values[i] != '' && values[i] != '♚' && !blockerb) {
                                blockerb = true;
                                continue;
                            }
                            break;
                        }
                    }
                    if (discDir == 'left' || discDir == 'right' || discDir == '') {
                        var blockerc = false;
                        for (let i = leftArray[index]; i > -1; i = leftArray[i]) {
                            if (uncheckArray.some(val => (i == val))) {
                                moveArray.push(i);
                                continue;
                            } else if (values[i] == '') {
                                continue;
                            } else if (values[i] != '' && values[i] != '♚' && !blockerc) {
                                blockerc = true;
                                continue;
                            }
                            break;
                        }
                        var blockerd = false;
                        for (let i = rightArray[index]; i > -1; i = rightArray[i]) {
                            if (uncheckArray.some(val => (i == val))) {
                                moveArray.push(i);
                                continue;
                            } else if (values[i] == '') {
                                continue;
                            } else if (values[i] != '' && values[i] != '♚' && !blockerd) {
                                blockerd = true;
                                continue;
                            }
                            break;
                        }
                    }
                    break;
                // Knight Movement
                case '♘':
                case '♞':
                    if (discDir == '') {
                        values.forEach((value, ind) => {
                            if (ind % 8 == index % 8) {
                                return;
                            }
                            if (Math.floor(ind / 8) == Math.floor(index / 8)) {
                                return;
                            }
                            if (ind % 7 == index % 7 && ind % 8 > index % 8 && Math.floor(ind / 8) < Math.floor(index / 8)) {
                                return;
                            }
                            if (ind % 7 == index % 7 && ind % 8 < index % 8 && Math.floor(ind / 8) > Math.floor(index / 8)) {
                                return;
                            }
                            if (ind % 9 == index % 9 && ind % 8 < index % 8 && Math.floor(ind / 8) < Math.floor(index / 8)) {
                                return;
                            }
                            if (ind % 9 == index % 9 && ind % 8 > index % 8 && Math.floor(ind / 8) > Math.floor(index / 8)) {
                                return;
                            }
                            switch (ind) {
                                case upArray[leftArray[leftArray[index]]]:
                                case downArray[leftArray[leftArray[index]]]:
                                case upArray[upArray[leftArray[index]]]:
                                case downArray[downArray[leftArray[index]]]:
                                case upArray[rightArray[rightArray[index]]]:
                                case downArray[rightArray[rightArray[index]]]:
                                case upArray[upArray[rightArray[index]]]:
                                case downArray[downArray[rightArray[index]]]:
                                    if (uncheckArray.some(val => (ind == val))) {
                                        moveArray.push(ind);
                                    }
                                    break;
                                default:
                                    if (uncheckArray.some(val => (ind == val)) && value == '') {
                                        moveArray.push(ind);
                                    }
                                    break;
                            }
                        });
                    }
                    break;
                // Bodyguard Movement
                case '🨶':
                case '🨼':
                    if (discDir == 'up-left' || discDir == 'down-right' || discDir == '') {
                        for (let i = upArray[leftArray[index]]; i > -1; i = upArray[leftArray[i]]) {
                            if (uncheckArray.some(val => (i == val))) {
                                moveArray.push(i);
                                continue;
                            } else if (values[i] == '') {
                                continue;
                            }
                            break;
                        }
                        for (let i = downArray[rightArray[index]]; i > -1; i = downArray[rightArray[i]]) {
                            if (uncheckArray.some(val => (i == val))) {
                                moveArray.push(i);
                                continue;
                            } else if (values[i] == '') {
                                continue;
                            }
                            break;
                        }
                    }
                    if (discDir == 'up-right' || discDir == 'down-left' || discDir == '') {
                        for (let i = upArray[rightArray[index]]; i > -1; i = upArray[rightArray[i]]) {
                            if (uncheckArray.some(val => (i == val))) {
                                moveArray.push(i);
                                continue;
                            } else if (values[i] == '') {
                                continue;
                            }
                            break;
                        }
                        for (let i = downArray[leftArray[index]]; i > -1; i = downArray[leftArray[i]]) {
                            if (uncheckArray.some(val => (i == val))) {
                                moveArray.push(i);
                                continue;
                            } else if (values[i] == '') {
                                continue;
                            }
                            break;
                        }
                    }
                    if (discDir == 'up' || discDir == '') {
                        if (uncheckArray.some(val => (upArray[checkIndex] == val))) {
                            moveArray.push(upArray[checkIndex]);
                        }
                    }
                    if (discDir == 'down' || discDir == '') {
                        if (uncheckArray.some(val => (downArray[checkIndex] == val))) {
                            moveArray.push(downArray[checkIndex]);
                        }
                    }
                    if (discDir == 'left' || discDir == '') {
                        if (uncheckArray.some(val => (leftArray[checkIndex] == val))) {
                            moveArray.push(leftArray[checkIndex]);
                        }
                    }
                    if (discDir == 'right' || discDir == '') {
                        if (uncheckArray.some(val => (rightArray[checkIndex] == val))) {
                            moveArray.push(rightArray[checkIndex]);
                        }
                    }
                    if (discDir == 'up-left' || discDir == '') {
                        if (uncheckArray.some(val => (upArray[leftArray[checkIndex]] == val))) {
                            moveArray.push(upArray[leftArray[checkIndex]]);
                        }
                    }
                    if (discDir == 'down-right' || discDir == '') {
                        if (uncheckArray.some(val => (downArray[rightArray[checkIndex]] == val))) {
                            moveArray.push(downArray[rightArray[checkIndex]]);
                        }
                    }
                    if (discDir == 'up-right' || discDir == '') {
                        if (uncheckArray.some(val => (upArray[rightArray[checkIndex]] == val))) {
                            moveArray.push(upArray[rightArray[checkIndex]]);
                        }
                    }
                    if (discDir == 'down-left' || discDir == '') {
                        if (uncheckArray.some(val => (downArray[leftArray[checkIndex]] == val))) {
                            moveArray.push(downArray[leftArray[checkIndex]]);
                        }
                    }
                    break;
                // Advisor Movement
                case '🨌':
                case '🨒':
                    if (discDir == 'up-left' || discDir == 'down-right' || discDir == '') {
                        for (let i = upArray[leftArray[index]]; i > -1; i = upArray[leftArray[i]]) {
                            if (uncheckArray.some(val => (i == val))) {
                                moveArray.push(i);
                                continue;
                            } else if (values[i] == '') {
                                continue;
                            }
                            break;
                        }
                        for (let i = downArray[rightArray[index]]; i > -1; i = downArray[rightArray[i]]) {
                            if (uncheckArray.some(val => (i == val))) {
                                moveArray.push(i);
                                continue;
                            } else if (values[i] == '') {
                                continue;
                            }
                            break;
                        }
                    }
                    if (discDir == 'up-right' || discDir == 'down-left' || discDir == '') {
                        for (let i = upArray[rightArray[index]]; i > -1; i = upArray[rightArray[i]]) {
                            if (uncheckArray.some(val => (i == val))) {
                                moveArray.push(i);
                                continue;
                            } else if (values[i] == '') {
                                continue;
                            }
                            break;
                        }
                        for (let i = downArray[leftArray[index]]; i > -1; i = downArray[leftArray[i]]) {
                            if (uncheckArray.some(val => (i == val))) {
                                moveArray.push(i);
                                continue;
                            } else if (values[i] == '') {
                                continue;
                            }
                            break;
                        }
                    }
                    if (discDir == 'up' || discDir == 'down' || discDir == '') {
                        if (uncheckArray.some(val => (upArray[index] == val))) {
                            moveArray.push(upArray[index]);
                        }
                        if (uncheckArray.some(val => (downArray[index] == val))) {
                            moveArray.push(downArray[index]);
                        }
                    }
                    if (discDir == 'left' || discDir == 'right' || discDir == '') {
                        if (uncheckArray.some(val => (leftArray[index] == val))) {
                            moveArray.push(leftArray[index]);
                        }
                        if (uncheckArray.some(val => (rightArray[index] == val))) {
                            moveArray.push(rightArray[index]);
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
                // White Soldier Movement
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
                        for (let i = upArray[index]; i > -1; i = upArray[i]) {
                            if (values[i] == '') {
                                moveArray.push(i);
                            } else {
                                break;
                            }
                        }
                    }
                    break;
                // Black Soldier Movement
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
                        for (let i = downArray[index]; i > -1; i = downArray[i]) {
                            if (values[i] == '') {
                                moveArray.push(i);
                            } else {
                                break;
                            }
                        }
                    }
                    break;
                // White General Movement
                case '🨣':
                    if (discDir == 'up-right' || discDir == 'down-left' || discDir == '') {
                        if (blackPieces(values[upArray[rightArray[index]]])) {
                            moveArray.push(upArray[rightArray[index]]);
                        }
                        if (blackPieces(values[downArray[leftArray[index]]])) {
                            moveArray.push(downArray[leftArray[index]]);
                        }
                    }
                    if (discDir == 'up-left' || discDir == 'down-right' || discDir == '') {
                        if (blackPieces(values[upArray[leftArray[index]]])) {
                            moveArray.push(upArray[leftArray[index]]);
                        }
                        if (blackPieces(values[downArray[rightArray[index]]])) {
                            moveArray.push(downArray[rightArray[index]]);
                        }
                    }
                    if (discDir == 'up' || discDir == 'down' || discDir == '') {
                        for (let i = upArray[index]; i > -1; i = upArray[i]) {
                            if (values[i] == '') {
                                moveArray.push(i);
                            } else {
                                break;
                            }
                        }
                        for (let i = downArray[index]; i > -1; i = downArray[i]) {
                            if (values[i] == '') {
                                moveArray.push(i);
                            } else {
                                break;
                            }
                        }
                    }
                    break;
                // Black General Movement
                case '🨩':
                    if (discDir == 'up-right' || discDir == 'down-left' || discDir == '') {
                        if (whitePieces(values[upArray[rightArray[index]]])) {
                            moveArray.push(upArray[rightArray[index]]);
                        }
                        if (whitePieces(values[downArray[leftArray[index]]])) {
                            moveArray.push(downArray[leftArray[index]]);
                        }
                    }
                    if (discDir == 'up-left' || discDir == 'down-right' || discDir == '') {
                        if (whitePieces(values[upArray[leftArray[index]]])) {
                            moveArray.push(upArray[leftArray[index]]);
                        }
                        if (whitePieces(values[downArray[rightArray[index]]])) {
                            moveArray.push(downArray[rightArray[index]]);
                        }
                    }
                    if (discDir == 'up' || discDir == 'down' || discDir == '') {
                        for (let i = upArray[index]; i > -1; i = upArray[i]) {
                            if (values[i] == '') {
                                moveArray.push(i);
                            } else {
                                break;
                            }
                        }
                        for (let i = downArray[index]; i > -1; i = downArray[i]) {
                            if (values[i] == '') {
                                moveArray.push(i);
                            } else {
                                break;
                            }
                        }
                    }
                    break;
                // White Mage Movement
                case '♖':
                    if (discDir == 'up' || discDir == 'down' || discDir == '') {
                        var blockera = false;
                        for (let i = upArray[index]; i > -1; i = upArray[i]) {
                            if (values[i] == '') {
                                moveArray.push(i);
                                continue;
                            } else if (values[i] != '' && values[i] != '♔' && !blockera) {
                                blockera = true;
                                moveArray.push(i);
                                continue;
                            } else if (values[i] != '♔') {
                                moveArray.push(i);
                                break;
                            }
                            break;
                        }
                        var blockerb = false;
                        for (let i = downArray[index]; i > -1; i = downArray[i]) {
                            if (values[i] == '') {
                                moveArray.push(i);
                                continue;
                            } else if (values[i] != '' && values[i] != '♔' && !blockerb) {
                                blockerb = true;
                                moveArray.push(i);
                                continue;
                            } else if (values[i] != '♔') {
                                moveArray.push(i);
                                break;
                            }
                            break;
                        }
                    }
                    if (discDir == 'left' || discDir == 'right' || discDir == '') {
                        var blockerc = false;
                        for (let i = leftArray[index]; i > -1; i = leftArray[i]) {
                            if (values[i] == '') {
                                moveArray.push(i);
                                continue;
                            } else if (values[i] != '' && values[i] != '♔' && !blockerc) {
                                blockerc = true;
                                moveArray.push(i);
                                continue;
                            } else if (values[i] != '♔') {
                                moveArray.push(i);
                                break;
                            }
                            break;
                        }
                        var blockerd = false;
                        for (let i = rightArray[index]; i > -1; i = rightArray[i]) {
                            if (values[i] == '') {
                                moveArray.push(i);
                                continue;
                            } else if (values[i] != '' && values[i] != '♔' && !blockerd) {
                                blockerd = true;
                                moveArray.push(i);
                                continue;
                            } else if (values[i] != '♔') {
                                moveArray.push(i);
                                break;
                            }
                            break;
                        }
                    }
                    break;
                // Black Mage Movement
                case '♜':
                    if (discDir == 'up' || discDir == 'down' || discDir == '') {
                        var blockera = false;
                        for (let i = upArray[index]; i > -1; i = upArray[i]) {
                            if (values[i] == '') {
                                moveArray.push(i);
                                continue;
                            } else if (values[i] != '' && values[i] != '♚' && !blockera) {
                                blockera = true;
                                moveArray.push(i);
                                continue;
                            } else if (values[i] != '♚') {
                                moveArray.push(i);
                                break;
                            }
                            break;
                        }
                        var blockerb = false;
                        for (let i = downArray[index]; i > -1; i = downArray[i]) {
                            if (values[i] == '') {
                                moveArray.push(i);
                                continue;
                            } else if (values[i] != '' && values[i] != '♚' && !blockerb) {
                                blockerb = true;
                                moveArray.push(i);
                                continue;
                            } else if (values[i] != '♚') {
                                moveArray.push(i);
                                break;
                            }
                            break;
                        }
                    }
                    if (discDir == 'left' || discDir == 'right' || discDir == '') {
                        var blockerc = false;
                        for (let i = leftArray[index]; i > -1; i = leftArray[i]) {
                            if (values[i] == '') {
                                moveArray.push(i);
                                continue;
                            } else if (values[i] != '' && values[i] != '♚' && !blockerc) {
                                blockerc = true;
                                moveArray.push(i);
                                continue;
                            } else if (values[i] != '♚') {
                                moveArray.push(i);
                                break;
                            }
                            break;
                        }
                        var blockerd = false;
                        for (let i = rightArray[index]; i > -1; i = rightArray[i]) {
                            if (values[i] == '') {
                                moveArray.push(i);
                                continue;
                            } else if (values[i] != '' && values[i] != '♚' && !blockerd) {
                                blockerd = true;
                                moveArray.push(i);
                                continue;
                            } else if (values[i] != '♚') {
                                moveArray.push(i);
                                break;
                            }
                            break;
                        }
                    }
                    break;
                // White Knight Movement
                case '♘':
                    if (discDir == '') {
                        values.forEach((value, ind) => {
                            if (ind % 8 == index % 8) {
                                return;
                            }
                            if (Math.floor(ind / 8) == Math.floor(index / 8)) {
                                return;
                            }
                            if (ind % 7 == index % 7 && ind % 8 > index % 8 && Math.floor(ind / 8) < Math.floor(index / 8)) {
                                return;
                            }
                            if (ind % 7 == index % 7 && ind % 8 < index % 8 && Math.floor(ind / 8) > Math.floor(index / 8)) {
                                return;
                            }
                            if (ind % 9 == index % 9 && ind % 8 < index % 8 && Math.floor(ind / 8) < Math.floor(index / 8)) {
                                return;
                            }
                            if (ind % 9 == index % 9 && ind % 8 > index % 8 && Math.floor(ind / 8) > Math.floor(index / 8)) {
                                return;
                            }
                            switch (ind) {
                                case upArray[leftArray[leftArray[index]]]:
                                case downArray[leftArray[leftArray[index]]]:
                                case upArray[upArray[leftArray[index]]]:
                                case downArray[downArray[leftArray[index]]]:
                                case upArray[rightArray[rightArray[index]]]:
                                case downArray[rightArray[rightArray[index]]]:
                                case upArray[upArray[rightArray[index]]]:
                                case downArray[downArray[rightArray[index]]]:
                                    if (value == '' || blackPieces(value)) {
                                        moveArray.push(ind);
                                    }
                                    break;
                                default:
                                    if (value == '') {
                                        moveArray.push(ind);
                                    }
                                    break;
                            }
                        });
                    }
                    break;
                // Black Knight Movement
                case '♞':
                    if (discDir == '') {
                        values.forEach((value, ind) => {
                            if (ind % 8 == index % 8) {
                                return;
                            }
                            if (Math.floor(ind / 8) == Math.floor(index / 8)) {
                                return;
                            }
                            if (ind % 7 == index % 7 && ind % 8 > index % 8 && Math.floor(ind / 8) < Math.floor(index / 8)) {
                                return;
                            }
                            if (ind % 7 == index % 7 && ind % 8 < index % 8 && Math.floor(ind / 8) > Math.floor(index / 8)) {
                                return;
                            }
                            if (ind % 9 == index % 9 && ind % 8 < index % 8 && Math.floor(ind / 8) < Math.floor(index / 8)) {
                                return;
                            }
                            if (ind % 9 == index % 9 && ind % 8 > index % 8 && Math.floor(ind / 8) > Math.floor(index / 8)) {
                                return;
                            }
                            switch (ind) {
                                case upArray[leftArray[leftArray[index]]]:
                                case downArray[leftArray[leftArray[index]]]:
                                case upArray[upArray[leftArray[index]]]:
                                case downArray[downArray[leftArray[index]]]:
                                case upArray[rightArray[rightArray[index]]]:
                                case downArray[rightArray[rightArray[index]]]:
                                case upArray[upArray[rightArray[index]]]:
                                case downArray[downArray[rightArray[index]]]:
                                    if (value == '' || whitePieces(value)) {
                                        moveArray.push(ind);
                                    }
                                    break;
                                default:
                                    if (value == '') {
                                        moveArray.push(ind);
                                    }
                                    break;
                            }
                        });
                    }
                    break;
                // White Bodyguard Movement
                case '🨶':
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
                    if (discDir == 'up' || discDir == '') {
                        if (values[upArray[checkIndex]] == '' || blackPieces(values[upArray[checkIndex]])) {
                            moveArray.push(upArray[checkIndex]);
                        }
                    }
                    if (discDir == 'down' || discDir == '') {
                        if (values[downArray[checkIndex]] == '' || blackPieces(values[downArray[checkIndex]])) {
                            moveArray.push(downArray[checkIndex]);
                        }
                    }
                    if (discDir == 'left' || discDir == '') {
                        if (values[leftArray[checkIndex]] == '' || blackPieces(values[leftArray[checkIndex]])) {
                            moveArray.push(leftArray[checkIndex]);
                        }
                    }
                    if (discDir == 'right' || discDir == '') {
                        if (values[rightArray[checkIndex]] == '' || blackPieces(values[rightArray[checkIndex]])) {
                            moveArray.push(rightArray[checkIndex]);
                        }
                    }
                    if (discDir == 'up-left' || discDir == '') {
                        if (values[upArray[leftArray[checkIndex]]] == '' || blackPieces(values[upArray[leftArray[checkIndex]]])) {
                            moveArray.push(upArray[leftArray[checkIndex]]);
                        }
                    }
                    if (discDir == 'down-right' || discDir == '') {
                        if (values[downArray[rightArray[checkIndex]]] == '' || blackPieces(values[downArray[rightArray[checkIndex]]])) {
                            moveArray.push(downArray[rightArray[checkIndex]]);
                        }
                    }
                    if (discDir == 'up-right' || discDir == '') {
                        if (values[upArray[rightArray[checkIndex]]] == '' || blackPieces(values[upArray[rightArray[checkIndex]]])) {
                            moveArray.push(upArray[rightArray[checkIndex]]);
                        }
                    }
                    if (discDir == 'down-left' || discDir == '') {
                        if (values[downArray[leftArray[checkIndex]]] == '' || blackPieces(values[downArray[leftArray[checkIndex]]])) {
                            moveArray.push(downArray[leftArray[checkIndex]]);
                        }
                    }
                    break;
                // Black Bodyguard Movement
                case '🨼':
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
                    if (discDir == 'up' || discDir == '') {
                        if (values[upArray[checkIndex]] == '' || whitePieces(values[upArray[checkIndex]])) {
                            moveArray.push(upArray[checkIndex]);
                        }
                    }
                    if (discDir == 'down' || discDir == '') {
                        if (values[downArray[checkIndex]] == '' || whitePieces(values[downArray[checkIndex]])) {
                            moveArray.push(downArray[checkIndex]);
                        }
                    }
                    if (discDir == 'left' || discDir == '') {
                        if (values[leftArray[checkIndex]] == '' || whitePieces(values[leftArray[checkIndex]])) {
                            moveArray.push(leftArray[checkIndex]);
                        }
                    }
                    if (discDir == 'right' || discDir == '') {
                        if (values[rightArray[checkIndex]] == '' || whitePieces(values[rightArray[checkIndex]])) {
                            moveArray.push(rightArray[checkIndex]);
                        }
                    }
                    if (discDir == 'up-left' || discDir == '') {
                        if (values[upArray[leftArray[checkIndex]]] == '' || whitePieces(values[upArray[leftArray[checkIndex]]])) {
                            moveArray.push(upArray[leftArray[checkIndex]]);
                        }
                    }
                    if (discDir == 'down-right' || discDir == '') {
                        if (values[downArray[rightArray[checkIndex]]] == '' || whitePieces(values[downArray[rightArray[checkIndex]]])) {
                            moveArray.push(downArray[rightArray[checkIndex]]);
                        }
                    }
                    if (discDir == 'up-right' || discDir == '') {
                        if (values[upArray[rightArray[checkIndex]]] == '' || whitePieces(values[upArray[rightArray[checkIndex]]])) {
                            moveArray.push(upArray[rightArray[checkIndex]]);
                        }
                    }
                    if (discDir == 'down-left' || discDir == '') {
                        if (values[downArray[leftArray[checkIndex]]] == '' || whitePieces(values[downArray[leftArray[checkIndex]]])) {
                            moveArray.push(downArray[leftArray[checkIndex]]);
                        }
                    }
                    break;
                // White Advisor Movement
                case '🨌':
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
                    if (discDir == 'up' || discDir == 'down' || discDir == '') {
                        if (values[upArray[index]] == '' || blackPieces(values[upArray[index]])) {
                            moveArray.push(upArray[index]);
                        }
                        if (values[downArray[index]] == '' || blackPieces(values[downArray[index]])) {
                            moveArray.push(downArray[index]);
                        }
                    }
                    if (discDir == 'left' || discDir == 'right' || discDir == '') {
                        if (values[leftArray[index]] == '' || blackPieces(values[leftArray[index]])) {
                            moveArray.push(leftArray[index]);
                        }
                        if (values[rightArray[index]] == '' || blackPieces(values[rightArray[index]])) {
                            moveArray.push(rightArray[index]);
                        }
                    }
                    break;
                // Black Advisor Movement
                case '🨒':
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
                    if (discDir == 'up' || discDir == 'down' || discDir == '') {
                        if (values[upArray[index]] == '' || whitePieces(values[upArray[index]])) {
                            moveArray.push(upArray[index]);
                        }
                        if (values[downArray[index]] == '' || whitePieces(values[downArray[index]])) {
                            moveArray.push(downArray[index]);
                        }
                    }
                    if (discDir == 'left' || discDir == 'right' || discDir == '') {
                        if (values[leftArray[index]] == '' || whitePieces(values[leftArray[index]])) {
                            moveArray.push(leftArray[index]);
                        }
                        if (values[rightArray[index]] == '' || whitePieces(values[rightArray[index]])) {
                            moveArray.push(rightArray[index]);
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
                // White King Movement
                case '♔':
                    values.forEach((value, ind) => {
                        switch (ind) {
                            case upArray[index]:
                            case downArray[index]:
                            case leftArray[index]:
                            case rightArray[index]:
                            case upArray[leftArray[index]]:
                            case downArray[leftArray[index]]:
                            case upArray[rightArray[index]]:
                            case downArray[rightArray[index]]:
                                if (blackPieces(value)) {
                                    if (!checkForCheckWhite(ind)) {
                                        moveArray.push(ind);
                                    }
                                }
                                break;
                            default:
                                if (value == '') {
                                    if (!checkForCheckWhite(ind)) {
                                        moveArray.push(ind);
                                    }
                                }
                                break;
                        }
                    });
                    break;
                // Black King Movement
                case '♚':
                    values.forEach((value, ind) => {
                        switch (ind) {
                            case upArray[index]:
                            case downArray[index]:
                            case leftArray[index]:
                            case rightArray[index]:
                            case upArray[leftArray[index]]:
                            case downArray[leftArray[index]]:
                            case upArray[rightArray[index]]:
                            case downArray[rightArray[index]]:
                                if (whitePieces(value)) {
                                    if (!checkForCheckBlack(ind)) {
                                        moveArray.push(ind);
                                    }
                                }
                                break;
                            default:
                                if (value == '') {
                                    if (!checkForCheckBlack(ind)) {
                                        moveArray.push(ind);
                                    }
                                }
                                break;
                        }
                    });
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
        var whiteBodyguard = values.findIndex(value => value == '🨶');
        var blackBodyguard = values.findIndex(value => value == '🨼');
        var whiteAdvisor = values.findIndex(value => value == '🨌');
        var blackAdvisor = values.findIndex(value => value == '🨒');
        var whiteKnights = [];
        checkForPiece('♘', whiteKnights);
        var blackKnights = [];
        checkForPiece('♞', blackKnights);
        var whiteMages = [];
        checkForPiece('♖', whiteMages);
        var blackMages = [];
        checkForPiece('♜', blackMages);
        var whiteGenerals = [];
        values.forEach((value, index) => { if (value == '🨣' && !whiteGenerals.some(val => index == val)) { whiteGenerals.push(index); } });
        var blackGenerals = [];
        values.forEach((value, index) => { if (value == '🨩' && !blackGenerals.some(val => index == val)) { blackGenerals.push(index); } });
        var whiteSoldiers = [];
        values.forEach((value, index) => { if (value == '♙' && !whiteSoldiers.some(val => index == val)) { whiteSoldiers.push(index); } });
        var blackSoldiers = [];
        values.forEach((value, index) => { if (value == '♟' && !blackSoldiers.some(val => index == val)) { blackSoldiers.push(index); } });
        var boardState = 'whiteKing:' + whiteKing.toString() + ';blackKing:' + blackKing.toString() + ';whiteQueens:' + whiteQueens.toString() + ';blackQueens:' + blackQueens.toString() + ';whiteBodyguard:' + whiteBodyguard.toString() + ';blackBodyguard:' + blackBodyguard.toString() +
            ';whiteAdvisor:' + whiteAdvisor.toString() + ';blackAdvisor:' + blackAdvisor.toString() + ';whiteKnights:' + whiteKnights.toString() + ';blackKnights:' + blackKnights.toString() + ';whiteMages:' + whiteMages.toString() + ';blackMages:' + blackMages.toString() +
            ';whiteGenerals:' + whiteGenerals.toString() + ';blackGenerals:' + blackGenerals.toString() + ';whiteSoldiers:' + whiteSoldiers.toString() + ';blackSoldiers:' + blackSoldiers.toString() + ';player:' + player.toString();
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
        if (player == 'White' && spliced.every(value => value != '♔' && value != '♕' && value != '🨶' && value != '🨌' && value != '♘' && value != '♖' && value != '🨣' && value != '♙')) {
            if (win == 'Check') {
                console.log('Black wins by checkmate');
                setWin('Black');
                return;
            } else {
                console.log('Black draws by stalemate');
                setWin('Draw');
            }
        }
        if (player == 'Black' && spliced.every(value => value != '♚' && value != '♛' && value != '🨼' && value != '🨒' && value != '♞' && value != '♜' && value != '🨩' && value != '♟')) {
            if (win == 'Check') {
                console.log('White wins by checkmate');
                setWin('White');
                return;
            } else {
                console.log('White draws by stalemate');
                setWin('Draw');
            }
        }
        if (values.every(value => value != '♕' && value != '🨶' && value != '🨌' && value != '♘' && value != '♖' && value != '🨣' && value != '♙' &&
            value != '♛' && value != '🨼' && value != '🨒' && value != '♞' && value != '♜' && value != '🨩' && value != '♟')) {
            console.log('Draw by dead position (King against King)');
            setWin('Draw');
        }
        if (count >= 100) {
            console.log('Draw by 50-Move Rule');
            setWin('Draw');
        }
    }

    return (
        <div className="app4">
            <div aria-live="polite">
                {((win == '') ? (player + "'s turn") : ((win == 'Draw') ? 'Draw' : ((win == 'Check') ? (player + ' is in check') : ('Winner is ' + win))))}
            </div>
            <div className="board4">
                {values.map((value, index) => (<Cell id={index} value={value} win={win} player={player} selected={selected} setCount={setCount}
                    setPlayer={() => playerModifier(setPlayer)} setArray={arrayModifier} setSelected={setSelected} checkForMovement={checkForMovement} />))}
            </div>
            <button onClick={reset}>Reset</button>
        </div>
    );
} 
