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
        for (let i = 1; i <= Math.floor(index / 8); i++) {
            if (values[index - (8 * i)] != '') {
                if (i == 1 && values[index - (8 * i)] == '♔') {
                    continue;
                }
                if (values[index - (8 * i)] == '♜' || values[index - (8 * i)] == '♛') {
                    if (values[index - (8 * i)] == '♛' && !blockera) {
                        return true;
                    } else if (values[index - (8 * i)] == '♜') {
                        return true;
                    }
                    break;
                } else {
                    if (values[index - (8 * i)] == '♚') {
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
        for (let i = 1; i < 8 - Math.floor(index / 8); i++) {
            if (values[index + (8 * i)] != '') {
                if (i == 1 && values[index + (8 * i)] == '♔') {
                    continue;
                }
                if (values[index + (8 * i)] == '♜' || values[index + (8 * i)] == '♛') {
                    if (values[index + (8 * i)] == '♛' && !blockerb) {
                        return true;
                    } else if (values[index + (8 * i)] == '♜') {
                        return true;
                    }
                    break;
                } else {
                    if (values[index + (8 * i)] == '♚') {
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
        for (let i = 1; i <= (index % 8); i++) {
            if (values[index - i] != '') {
                if (i == 1 && values[index - i] == '♔') {
                    continue;
                }
                if (values[index - i] == '♜' || values[index - i] == '♛') {
                    if (values[index - i] == '♛' && !blockerc) {
                        return true;
                    } else if (values[index - i] == '♜') {
                        return true;
                    }
                    break;
                } else {
                    if (values[index - i] == '♚') {
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
        for (let i = 1; i < 8 - (index % 8); i++) {
            if (values[index + i] != '') {
                if (i == 1 && values[index + i] == '♔') {
                    continue;
                }
                if (values[index + i] == '♜' || values[index + i] == '♛') {
                    if (values[index + i] == '♛' && !blockerd) {
                        return true;
                    } else if (values[index + i] == '♜') {
                        return true;
                    }
                    break;
                } else {
                    if (values[index + i] == '♚') {
                        break;
                    } else if (!blockerd) {
                        blockerd = true;
                        continue;
                    }
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
                if (values[index - (9 * i)] == '🨼' || values[index - (9 * i)] == '🨒' || values[index - (9 * i)] == '♛') {
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
                if (values[index + (9 * i)] == '🨼' || values[index + (9 * i)] == '🨒' || values[index + (9 * i)] == '♛') {
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
                if (values[index - (7 * i)] == '🨼' || values[index - (7 * i)] == '🨒' || values[index - (7 * i)] == '♛') {
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
                if (values[index + (7 * i)] == '🨼' || values[index + (7 * i)] == '🨒' || values[index + (7 * i)] == '♛') {
                    return true;
                } else {
                    break;
                }
            }
        }
        if (values[index - 8] == '♚' || values[index - 8] == '🨒') {
            return true;
        }
        if (values[index + 8] == '♚' || values[index + 8] == '🨒') {
            return true;
        }
        if (index % 8 > 0) {
            if (values[index - 1] == '♚' || values[index - 1] == '🨒') {
                return true;
            }
            if (values[index - 9] == '♚' || values[index - 9] == '♟') {
                return true;
            }
            if (values[index + 7] == '♚' || values[index + 7] == '🨩') {
                return true;
            }
        }
        if (index % 8 < 7) {
            if (values[index + 1] == '♚' || values[index + 1] == '🨒') {
                return true;
            }
            if (values[index - 7] == '♚' || values[index - 7] == '♟') {
                return true;
            }
            if (values[index + 9] == '♚' || values[index + 9] == '🨩') {
                return true;
            }
        }
        return false;
    }

    const checkForCheckBlack = (index) => {
        var blockera = false;
        for (let i = 1; i <= Math.floor(index / 8); i++) {
            if (values[index - (8 * i)] != '') {
                if (i == 1 && values[index - (8 * i)] == '♚') {
                    continue;
                }
                if (values[index - (8 * i)] == '♖' || values[index - (8 * i)] == '♕') {
                    if (values[index - (8 * i)] == '♕' && !blockera) {
                        return true;
                    } else if (values[index - (8 * i)] == '♖') {
                        return true;
                    }
                    break;
                } else {
                    if (values[index - (8 * i)] == '♔') {
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
        for (let i = 1; i < 8 - Math.floor(index / 8); i++) {
            if (values[index + (8 * i)] != '') {
                if (i == 1 && values[index + (8 * i)] == '♚') {
                    continue;
                }
                if (values[index + (8 * i)] == '♖' || values[index + (8 * i)] == '♕') {
                    if (values[index + (8 * i)] == '♕' && !blockerb) {
                        return true;
                    } else if (values[index + (8 * i)] == '♖') {
                        return true;
                    }
                    break;
                } else {
                    if (values[index + (8 * i)] == '♔') {
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
        for (let i = 1; i <= (index % 8); i++) {
            if (values[index - i] != '') {
                if (i == 1 && values[index - i] == '♚') {
                    continue;
                }
                if (values[index - i] == '♖' || values[index - i] == '♕') {
                    if (values[index - i] == '♕' && !blockerc) {
                        return true;
                    } else if (values[index - i] == '♖') {
                        return true;
                    }
                    break;
                } else {
                    if (values[index - i] == '♔') {
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
        for (let i = 1; i < 8 - (index % 8); i++) {
            if (values[index + i] != '') {
                if (i == 1 && values[index + i] == '♚') {
                    continue;
                }
                if (values[index + i] == '♖' || values[index + i] == '♕') {
                    if (values[index + i] == '♕' && !blockerd) {
                        return true;
                    } else if (values[index + i] == '♖') {
                        return true;
                    }
                    break;
                } else {
                    if (values[index + i] == '♔') {
                        break;
                    } else if (!blockerd) {
                        blockerd = true;
                        continue;
                    }
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
                if (values[index - (9 * i)] == '🨶' || values[index - (9 * i)] == '🨌' || values[index - (9 * i)] == '♕') {
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
                if (values[index + (9 * i)] == '🨶' || values[index + (9 * i)] == '🨌' || values[index + (9 * i)] == '♕') {
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
                if (values[index - (7 * i)] == '🨶' || values[index - (7 * i)] == '🨌' || values[index - (7 * i)] == '♕') {
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
                if (values[index + (7 * i)] == '🨶' || values[index + (7 * i)] == '🨌' || values[index + (7 * i)] == '♕') {
                    return true;
                } else {
                    break;
                }
            }
        }
        if (values[index - 8] == '♔' || values[index - 8] == '🨌') {
            return true;
        }
        if (values[index + 8] == '♔' || values[index + 8] == '🨌') {
            return true;
        }
        if (index % 8 > 0) {
            if (values[index - 1] == '♔' || values[index - 1] == '🨌') {
                return true;
            }
            if (values[index - 9] == '♔' || values[index - 9] == '🨣') {
                return true;
            }
            if (values[index + 7] == '♔' || values[index + 7] == '♙') {
                return true;
            }
        }
        if (index % 8 < 7) {
            if (values[index + 1] == '♔' || values[index + 1] == '🨌') {
                return true;
            }
            if (values[index - 7] == '♔' || values[index - 7] == '🨣') {
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
                if (values[index - (8 * i)] != '♔' && values[index - (8 * i)] != '♚') {
                    if (values[index - (8 * i)] == '♙' || values[index - (8 * i)] == '🨣' || values[index - (8 * i)] == '♖' || values[index - (8 * i)] == '♘' || values[index - (8 * i)] == '🨶' || values[index - (8 * i)] == '🨌' || values[index - (8 * i)] == '♕') {
                        if (disca == '') {
                            disca = '♛';
                            var aa = index - (8 * i);
                            var ii = index - (8 * i);
                        } else if (disca == '♛' || disca == '♜') {
                            disca = '♜♜';
                            var ii = index - (8 * i);
                        } else {
                            break;
                        }
                    } else if (values[index - (8 * i)] == '♛') {
                        if (disca == '♛') {
                            disca = '♜♜';
                            discoverArray.push({ direction: 'up', piece: aa });
                        } else if (disca == '') {
                            disca = '♜';
                        } else {
                            break;
                        }
                    } else if (values[index - (8 * i)] == '♜') {
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
        for (let i = 1; i < 8 - Math.floor(index / 8); i++) {
            if (values[index + (8 * i)] != '') {
                if (values[index + (8 * i)] != '♔' && values[index + (8 * i)] != '♚') {
                    if (values[index + (8 * i)] == '♙' || values[index + (8 * i)] == '🨣' || values[index + (8 * i)] == '♖' || values[index + (8 * i)] == '♘' || values[index + (8 * i)] == '🨶' || values[index + (8 * i)] == '🨌' || values[index + (8 * i)] == '♕') {
                        if (discb == '') {
                            discb = '♛';
                            var bb = index + (8 * i);
                            var jj = index + (8 * i);
                        } else if (discb == '♛' || discb == '♜') {
                            discb = '♜♜';
                            var jj = index + (8 * i);
                        } else {
                            break;
                        }
                    } else if (values[index + (8 * i)] == '♛') {
                        if (discb == '♛') {
                            discb = '♜♜';
                            discoverArray.push({ direction: 'up', piece: bb });
                        } else if (discb == '') {
                            discb = '♜';
                        } else {
                            break;
                        }
                    } else if (values[index + (8 * i)] == '♜') {
                        if (discb == '♜♜') {
                            discoverArray.push({ direction: 'up', piece: jj });
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
        for (let i = 1; i <= (index % 8); i++) {
            if (values[index - i] != '') {
                if (values[index - i] != '♔' && values[index - i] != '♚') {
                    if (values[index - i] == '♙' || values[index - i] == '🨣' || values[index - i] == '♖' || values[index - i] == '♘' || values[index - i] == '🨶' || values[index - i] == '🨌' || values[index - i] == '♕') {
                        if (discc == '') {
                            discc = '♛';
                            var cc = index - i;
                            var kk = index - i;
                        } else if (discc == '♛' || discc == '♜') {
                            discc = '♜♜';
                            var kk = index - i;
                        } else {
                            break;
                        }
                    } else if (values[index - i] == '♛') {
                        if (discc == '♛') {
                            discc = '♜♜';
                            discoverArray.push({ direction: 'up', piece: cc });
                        } else if (discc == '') {
                            discc = '♜';
                        } else {
                            break;
                        }
                    } else if (values[index - i] == '♜') {
                        if (discc == '♜♜') {
                            discoverArray.push({ direction: 'up', piece: kk });
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
        for (let i = 1; i < 8 - (index % 8); i++) {
            if (values[index + i] != '') {
                if (values[index + i] != '♔' && values[index + i] != '♚') {
                    if (values[index + i] == '♙' || values[index + i] == '🨣' || values[index + i] == '♖' || values[index + i] == '♘' || values[index + i] == '🨶' || values[index + i] == '🨌' || values[index + i] == '♕') {
                        if (discd == '') {
                            discd = '♛';
                            var dd = index + i;
                            var ll = index + i;
                        } else if (discd == '♛' || discd == '♜') {
                            discd = '♜♜';
                            var ll = index + i;
                        } else {
                            break;
                        }
                    } else if (values[index + i] == '♛') {
                        if (discd == '♛') {
                            discd = '♜♜';
                            discoverArray.push({ direction: 'up', piece: dd });
                        } else if (discd == '') {
                            discd = '♜';
                        } else {
                            break;
                        }
                    } else if (values[index + i] == '♜') {
                        if (discd == '♜♜') {
                            discoverArray.push({ direction: 'up', piece: ll });
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
        var disce = '';
        for (let i = 1; i <= (index % 8); i++) {
            if (values[index - (9 * i)] != '') {
                if (values[index - (9 * i)] == '♙' || values[index - (9 * i)] == '🨣' || values[index - (9 * i)] == '♖' || values[index - (9 * i)] == '♘' || values[index - (9 * i)] == '🨶' || values[index - (9 * i)] == '🨌' || values[index - (9 * i)] == '♕') {
                    if (disce.length > 0) {
                        break;
                    } else {
                        disce = values[index - (9 * i)];
                        var ee = index - (9 * i);
                    }
                } else if (disce.length > 0) {
                    if (values[index - (9 * i)] == '🨼' || values[index - (9 * i)] == '🨒' || values[index - (9 * i)] == '♛') {
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
                if (values[index + (9 * i)] == '♙' || values[index + (9 * i)] == '🨣' || values[index + (9 * i)] == '♖' || values[index + (9 * i)] == '♘' || values[index + (9 * i)] == '🨶' || values[index + (9 * i)] == '🨌' || values[index + (9 * i)] == '♕') {
                    if (discf.length > 0) {
                        break;
                    } else {
                        discf = values[index + (9 * i)];
                        var ff = index + (9 * i);
                    }
                } else if (discf.length > 0) {
                    if (values[index + (9 * i)] == '🨼' || values[index + (9 * i)] == '🨒' || values[index + (9 * i)] == '♛') {
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
                if (values[index - (7 * i)] == '♙' || values[index - (7 * i)] == '🨣' || values[index - (7 * i)] == '♖' || values[index - (7 * i)] == '♘' || values[index - (7 * i)] == '🨶' || values[index - (7 * i)] == '🨌' || values[index - (7 * i)] == '♕') {
                    if (discg.length > 0) {
                        break;
                    } else {
                        discg = values[index - (7 * i)];
                        var gg = index - (7 * i);
                    }
                } else if (discg.length > 0) {
                    if (values[index - (7 * i)] == '🨼' || values[index - (7 * i)] == '🨒' || values[index - (7 * i)] == '♛') {
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
                if (values[index + (7 * i)] == '♙' || values[index + (7 * i)] == '🨣' || values[index + (7 * i)] == '♖' || values[index + (7 * i)] == '♘' || values[index + (7 * i)] == '🨶' || values[index + (7 * i)] == '🨌' || values[index + (7 * i)] == '♕') {
                    if (disch.length > 0) {
                        break;
                    } else {
                        disch = values[index + (7 * i)];
                        var hh = index + (7 * i);
                    }
                } else if (disch.length > 0) {
                    if (values[index + (7 * i)] == '🨼' || values[index + (7 * i)] == '🨒' || values[index + (7 * i)] == '♛') {
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
                if (values[index - (8 * i)] != '♔' && values[index - (8 * i)] != '♚') {
                    if (values[index - (8 * i)] == '♟' || values[index - (8 * i)] == '🨩' || values[index - (8 * i)] == '♜' || values[index - (8 * i)] == '♞' || values[index - (8 * i)] == '🨼' || values[index - (8 * i)] == '🨒' || values[index - (8 * i)] == '♛') {
                        if (disca == '') {
                            disca = '♕';
                            var aa = index - (8 * i);
                            var ii = index - (8 * i);
                        } else if (disca == '♕' || disca == '♖') {
                            disca = '♖♖';
                            var ii = index - (8 * i);
                        } else {
                            break;
                        }
                    } else if (values[index - (8 * i)] == '♕') {
                        if (disca == '♕') {
                            disca = '♖♖';
                            discoverArray.push({ direction: 'up', piece: aa });
                        } else if (disca == '') {
                            disca = '♖';
                        } else {
                            break;
                        }
                    } else if (values[index - (8 * i)] == '♖') {
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
        for (let i = 1; i < 8 - Math.floor(index / 8); i++) {
            if (values[index + (8 * i)] != '') {
                if (values[index + (8 * i)] != '♔' && values[index + (8 * i)] != '♚') {
                    if (values[index + (8 * i)] == '♟' || values[index + (8 * i)] == '🨩' || values[index + (8 * i)] == '♜' || values[index + (8 * i)] == '♞' || values[index + (8 * i)] == '🨼' || values[index + (8 * i)] == '🨒' || values[index + (8 * i)] == '♛') {
                        if (discb == '') {
                            discb = '♕';
                            var bb = index + (8 * i);
                            var jj = index + (8 * i);
                        } else if (discb == '♕' || discb == '♖') {
                            discb = '♖♖';
                            var jj = index + (8 * i);
                        } else {
                            break;
                        }
                    } else if (values[index + (8 * i)] == '♕') {
                        if (discb == '♕') {
                            discb = '♖♖';
                            discoverArray.push({ direction: 'up', piece: bb });
                        } else if (discb == '') {
                            discb = '♖';
                        } else {
                            break;
                        }
                    } else if (values[index + (8 * i)] == '♖') {
                        if (discb == '♖♖') {
                            discoverArray.push({ direction: 'up', piece: jj });
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
        for (let i = 1; i <= (index % 8); i++) {
            if (values[index - i] != '') {
                if (values[index - i] != '♔' && values[index - i] != '♚') {
                    if (values[index - i] == '♟' || values[index - i] == '🨩' || values[index - i] == '♜' || values[index - i] == '♞' || values[index - i] == '🨼' || values[index - i] == '🨒' || values[index - i] == '♛') {
                        if (discc == '') {
                            discc = '♕';
                            var cc = index - i;
                            var kk = index - i;
                        } else if (discc == '♕' || discc == '♖') {
                            discc = '♖♖';
                            var kk = index - i;
                        } else {
                            break;
                        }
                    } else if (values[index - i] == '♕') {
                        if (discc == '♕') {
                            discc = '♖♖';
                            discoverArray.push({ direction: 'up', piece: cc });
                        } else if (discc == '') {
                            discc = '♖';
                        } else {
                            break;
                        }
                    } else if (values[index - i] == '♖') {
                        if (discc == '♖♖') {
                            discoverArray.push({ direction: 'up', piece: kk });
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
        for (let i = 1; i < 8 - (index % 8); i++) {
            if (values[index + i] != '') {
                if (values[index + i] != '♔' && values[index + i] != '♚') {
                    if (values[index + i] == '♟' || values[index + i] == '🨩' || values[index + i] == '♜' || values[index + i] == '♞' || values[index + i] == '🨼' || values[index + i] == '🨒' || values[index + i] == '♛') {
                        if (discd == '') {
                            discd = '♕';
                            var dd = index + i;
                            var ll = index + i;
                        } else if (discd == '♕' || discd == '♖') {
                            discd = '♖♖';
                            var ll = index + i;
                        } else {
                            break;
                        }
                    } else if (values[index + i] == '♕') {
                        if (discd == '♕') {
                            discd = '♖♖';
                            discoverArray.push({ direction: 'up', piece: dd });
                        } else if (discd == '') {
                            discd = '♖';
                        } else {
                            break;
                        }
                    } else if (values[index + i] == '♖') {
                        if (discd == '♖♖') {
                            discoverArray.push({ direction: 'up', piece: ll });
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
        var disce = '';
        for (let i = 1; i <= (index % 8); i++) {
            if (values[index - (9 * i)] != '') {
                if (values[index - (9 * i)] == '♟' || values[index - (9 * i)] == '🨩' || values[index - (9 * i)] == '♜' || values[index - (9 * i)] == '♞' || values[index - (9 * i)] == '🨼' || values[index - (9 * i)] == '🨒' || values[index - (9 * i)] == '♛') {
                    if (disce.length > 0) {
                        break;
                    } else {
                        disce = values[index - (9 * i)];
                        var ee = index - (9 * i);
                    }
                } else if (disce.length > 0) {
                    if (values[index - (9 * i)] == '🨶' || values[index - (9 * i)] == '🨌' || values[index - (9 * i)] == '♕') {
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
                if (values[index + (9 * i)] == '♟' || values[index + (9 * i)] == '🨩' || values[index + (9 * i)] == '♜' || values[index + (9 * i)] == '♞' || values[index + (9 * i)] == '🨼' || values[index + (9 * i)] == '🨒' || values[index + (9 * i)] == '♛') {
                    if (discf.length > 0) {
                        break;
                    } else {
                        discf = values[index + (9 * i)];
                        var ff = index + (9 * i);
                    }
                } else if (discf.length > 0) {
                    if (values[index + (9 * i)] == '🨶' || values[index + (9 * i)] == '🨌' || values[index + (9 * i)] == '♕') {
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
                if (values[index - (7 * i)] == '♟' || values[index - (7 * i)] == '🨩' || values[index - (7 * i)] == '♜' || values[index - (7 * i)] == '♞' || values[index - (7 * i)] == '🨼' || values[index - (7 * i)] == '🨒' || values[index - (7 * i)] == '♛') {
                    if (discg.length > 0) {
                        break;
                    } else {
                        discg = values[index - (7 * i)];
                        var gg = index - (7 * i);
                    }
                } else if (discg.length > 0) {
                    if (values[index - (7 * i)] == '🨶' || values[index - (7 * i)] == '🨌' || values[index - (7 * i)] == '♕') {
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
                if (values[index + (7 * i)] == '♟' || values[index + (7 * i)] == '🨩' || values[index + (7 * i)] == '♜' || values[index + (7 * i)] == '♞' || values[index + (7 * i)] == '🨼' || values[index + (7 * i)] == '🨒' || values[index + (7 * i)] == '♛') {
                    if (disch.length > 0) {
                        break;
                    } else {
                        disch = values[index + (7 * i)];
                        var hh = index + (7 * i);
                    }
                } else if (disch.length > 0) {
                    if (values[index + (7 * i)] == '🨶' || values[index + (7 * i)] == '🨌' || values[index + (7 * i)] == '♕') {
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
            var blockera = false;
            for (let i = 1; i <= Math.floor(index / 8); i++) {
                if (values[index - (8 * i)] != '') {
                    if (blockera) {
                        if (values[index - (8 * i)] == '♖') {
                            checkArray.push({ index: index - (8 * i), piece: '♖' });
                        }
                    } else {
                        if (values[index - (8 * i)] == '♖') {
                            blockera = true;
                            checkArray.push({ index: index - (8 * i), piece: '♖' });
                        } else if (values[index - (8 * i)] == '♕') {
                            blockera = true;
                            checkArray.push({ index: index - (8 * i), piece: '♕' });
                        } else if (values[index - (8 * i)] != '♔') {
                            blockera = true;
                        } else {
                            break;
                        }
                    }
                }
            }
            var blockerb = false;
            for (let i = 1; i < 8 - Math.floor(index / 8); i++) {
                if (values[index + (8 * i)] != '') {
                    if (blockerb) {
                        if (values[index + (8 * i)] == '♖') {
                            checkArray.push({ index: index + (8 * i), piece: '♖' });
                        }
                    } else {
                        if (values[index + (8 * i)] == '♖') {
                            blockerb = true;
                            checkArray.push({ index: index + (8 * i), piece: '♖' });
                        } else if (values[index + (8 * i)] == '♕') {
                            blockerb = true;
                            checkArray.push({ index: index + (8 * i), piece: '♕' });
                        } else if (values[index + (8 * i)] != '♔') {
                            blockerb = true;
                        } else {
                            break;
                        }
                    }
                }
            }
            var blockerc = false;
            for (let i = 1; i <= (index % 8); i++) {
                if (values[index - i] != '') {
                    if (blockerc) {
                        if (values[index - i] == '♖') {
                            checkArray.push({ index: index - i, piece: '♖' });
                        }
                    } else {
                        if (values[index - i] == '♖') {
                            blockerc = true;
                            checkArray.push({ index: index - i, piece: '♖' });
                        } else if (values[index - i] == '♕') {
                            blockerc = true;
                            checkArray.push({ index: index - i, piece: '♕' });
                        } else if (values[index - i] != '♔') {
                            blockerc = true;
                        } else {
                            break;
                        }
                    }
                }
            }
            var blockerd = false;
            for (let i = 1; i < 8 - (index % 8); i++) {
                if (values[index + i] != '') {
                    if (blockerd) {
                        if (values[index + i] == '♖') {
                            checkArray.push({ index: index + i, piece: '♖' });
                        }
                    } else {
                        if (values[index + i] == '♖') {
                            blockerd = true;
                            checkArray.push({ index: index + i, piece: '♖' });
                        } else if (values[index + i] == '♕') {
                            blockerd = true;
                            checkArray.push({ index: index + i, piece: '♕' });
                        } else if (values[index + i] != '♔') {
                            blockerd = true;
                        } else {
                            break;
                        }
                    }
                }
            }
            if (index % 8 > 0) {
                if (index % 8 > 1) {
                    if (values[index - 10] == '♘' || values[index - 10] == '♕') {
                        checkArray.push({ index: index - 10, piece: values[index - 10] });
                    }
                    if (values[index + 6] == '♘' || values[index + 6] == '♕') {
                        checkArray.push({ index: index + 6, piece: values[index + 6] });
                    }
                }
                if (values[index - 17] == '♘' || values[index - 17] == '♕') {
                    checkArray.push({ index: index - 17, piece: values[index - 17] });
                }
                if (values[index + 15] == '♘' || values[index + 15] == '♕') {
                    checkArray.push({ index: index + 15, piece: values[index + 15] });
                }
                if (values[index + 7] == '♙' || values[index + 7] == '🨣') {
                    checkArray.push({ index: index + 7, piece: values[index + 7] });
                }
                if (values[index - 9] == '🨣') {
                    checkArray.push({ index: index - 9, piece: '🨣' });
                }
                if (values[index - 1] == '🨌') {
                    checkArray.push({ index: index - 1, piece: '🨌' });
                }
            }
            if (index % 8 < 7) {
                if (index % 8 < 6) {
                    if (values[index - 6] == '♘' || values[index - 6] == '♕') {
                        checkArray.push({ index: index - 6, piece: values[index - 6] });
                    }
                    if (values[index + 10] == '♘' || values[index + 10] == '♕') {
                        checkArray.push({ index: index + 10, piece: values[index + 10] });
                    }
                }
                if (values[index - 15] == '♘' || values[index - 15] == '♕') {
                    checkArray.push({ index: index - 15, piece: values[index - 15] });
                }
                if (values[index + 17] == '♘' || values[index + 17] == '♕') {
                    checkArray.push({ index: index + 17, piece: values[index + 17] });
                }
                if (values[index + 9] == '♙' || values[index + 9] == '🨣') {
                    checkArray.push({ index: index + 9, piece: values[index + 9] });
                }
                if (values[index - 7] == '🨣') {
                    checkArray.push({ index: index - 7, piece: '🨣' });
                }
                if (values[index + 1] == '🨌') {
                    checkArray.push({ index: index + 1, piece: '🨌' });
                }
            }
            if (values[index - 8] == '🨌') {
                checkArray.push({ index: index - 8, piece: '🨌' });
            }
            if (values[index + 8] == '🨌') {
                checkArray.push({ index: index + 8, piece: '🨌' });
            }
            for (let i = 1; i <= (index % 8); i++) {
                if (values[index - (9 * i)] != '') {
                    if (values[index - (9 * i)] == '🨶' || values[index - (9 * i)] == '🨌' || values[index - (9 * i)] == '♕') {
                        checkArray.push({ index: index - (9 * i), piece: values[index - (9 * i)] });
                        break;
                    } else {
                        break;
                    }
                }
            }
            for (let i = 1; i < 8 - (index % 8); i++) {
                if (values[index + (9 * i)] != '') {
                    if (values[index + (9 * i)] == '🨶' || values[index + (9 * i)] == '🨌' || values[index + (9 * i)] == '♕') {
                        checkArray.push({ index: index + (9 * i), piece: values[index + (9 * i)] });
                        break;
                    } else {
                        break;
                    }
                }
            }
            for (let i = 1; i < 8 - (index % 8); i++) {
                if (values[index - (7 * i)] != '') {
                    if (values[index - (7 * i)] == '🨶' || values[index - (7 * i)] == '🨌' || values[index - (7 * i)] == '♕') {
                        checkArray.push({ index: index - (7 * i), piece: values[index - (7 * i)] });
                        break;
                    } else {
                        break;
                    }
                }
            }
            for (let i = 1; i <= (index % 8); i++) {
                if (values[index + (7 * i)] != '') {
                    if (values[index + (7 * i)] == '🨶' || values[index + (7 * i)] == '🨌' || values[index + (7 * i)] == '♕') {
                        checkArray.push({ index: index + (7 * i), piece: values[index + (7 * i)] });
                        break;
                    } else {
                        break;
                    }
                }
            }
        } else if (colour == 'White') {
            var blockera = false;
            for (let i = 1; i <= Math.floor(index / 8); i++) {
                if (values[index - (8 * i)] != '') {
                    if (blockera) {
                        if (values[index - (8 * i)] == '♜') {
                            checkArray.push({ index: index - (8 * i), piece: '♜' });
                        }
                    } else {
                        if (values[index - (8 * i)] == '♜') {
                            blockera = true;
                            checkArray.push({ index: index - (8 * i), piece: '♜' });
                        } else if (values[index - (8 * i)] == '♛') {
                            blockera = true;
                            checkArray.push({ index: index - (8 * i), piece: '♛' });
                        } else if (values[index - (8 * i)] != '♚') {
                            blockera = true;
                        } else {
                            break;
                        }
                    }
                }
            }
            var blockerb = false;
            for (let i = 1; i < 8 - Math.floor(index / 8); i++) {
                if (values[index + (8 * i)] != '') {
                    if (blockerb) {
                        if (values[index + (8 * i)] == '♜') {
                            checkArray.push({ index: index + (8 * i), piece: '♜' });
                        }
                    } else {
                        if (values[index + (8 * i)] == '♜') {
                            blockerb = true;
                            checkArray.push({ index: index + (8 * i), piece: '♜' });
                        } else if (values[index + (8 * i)] == '♛') {
                            blockerb = true;
                            checkArray.push({ index: index + (8 * i), piece: '♛' });
                        } else if (values[index + (8 * i)] != '♚') {
                            blockerb = true;
                        } else {
                            break;
                        }
                    }
                }
            }
            var blockerc = false;
            for (let i = 1; i <= (index % 8); i++) {
                if (values[index - i] != '') {
                    if (blockerc) {
                        if (values[index - i] == '♜') {
                            checkArray.push({ index: index - i, piece: '♜' });
                        }
                    } else {
                        if (values[index - i] == '♜') {
                            blockerc = true;
                            checkArray.push({ index: index - i, piece: '♜' });
                        } else if (values[index - i] == '♛') {
                            blockerc = true;
                            checkArray.push({ index: index - i, piece: '♛' });
                        } else if (values[index - i] != '♚') {
                            blockerc = true;
                        } else {
                            break;
                        }
                    }
                }
            }
            var blockerd = false;
            for (let i = 1; i < 8 - (index % 8); i++) {
                if (values[index + i] != '') {
                    if (blockerd) {
                        if (values[index + i] == '♜') {
                            checkArray.push({ index: index + i, piece: '♜' });
                        }
                    } else {
                        if (values[index + i] == '♜') {
                            blockerd = true;
                            checkArray.push({ index: index + i, piece: '♜' });
                        } else if (values[index + i] == '♛') {
                            blockerd = true;
                            checkArray.push({ index: index + i, piece: '♛' });
                        } else if (values[index + i] != '♚') {
                            blockerd = true;
                        } else {
                            break;
                        }
                    }
                }
            }
            if (index % 8 > 0) {
                if (index % 8 > 1) {
                    if (values[index - 10] == '♞' || values[index - 10] == '♛') {
                        checkArray.push({ index: index - 10, piece: values[index - 10] });
                    }
                    if (values[index + 6] == '♞' || values[index + 6] == '♛') {
                        checkArray.push({ index: index + 6, piece: values[index + 6] });
                    }
                }
                if (values[index - 17] == '♞' || values[index - 17] == '♛') {
                    checkArray.push({ index: index - 17, piece: values[index - 17] });
                }
                if (values[index + 15] == '♞' || values[index + 15] == '♛') {
                    checkArray.push({ index: index + 15, piece: values[index + 15] });
                }
                if (values[index + 7] == '♟' || values[index + 7] == '🨩') {
                    checkArray.push({ index: index + 7, piece: values[index + 7] });
                }
                if (values[index - 9] == '🨩') {
                    checkArray.push({ index: index - 9, piece: '🨩' });
                }
                if (values[index - 1] == '🨒') {
                    checkArray.push({ index: index - 1, piece: '🨒' });
                }
            }
            if (index % 8 < 7) {
                if (index % 8 < 6) {
                    if (values[index - 6] == '♞' || values[index - 6] == '♛') {
                        checkArray.push({ index: index - 6, piece: values[index - 6] });
                    }
                    if (values[index + 10] == '♞' || values[index + 10] == '♛') {
                        checkArray.push({ index: index + 10, piece: values[index + 10] });
                    }
                }
                if (values[index - 15] == '♞' || values[index - 15] == '♛') {
                    checkArray.push({ index: index - 15, piece: values[index - 15] });
                }
                if (values[index + 17] == '♞' || values[index + 17] == '♛') {
                    checkArray.push({ index: index + 17, piece: values[index + 17] });
                }
                if (values[index + 9] == '♟' || values[index + 9] == '🨩') {
                    checkArray.push({ index: index + 9, piece: values[index + 9] });
                }
                if (values[index - 7] == '🨩') {
                    checkArray.push({ index: index - 7, piece: '🨩' });
                }
                if (values[index + 1] == '🨒') {
                    checkArray.push({ index: index + 1, piece: '🨒' });
                }
            }
            if (values[index - 8] == '🨒') {
                checkArray.push({ index: index - 8, piece: '🨒' });
            }
            if (values[index + 8] == '🨒') {
                checkArray.push({ index: index + 8, piece: '🨒' });
            }
            for (let i = 1; i <= (index % 8); i++) {
                if (values[index - (9 * i)] != '') {
                    if (values[index - (9 * i)] == '🨼' || values[index - (9 * i)] == '🨒' || values[index - (9 * i)] == '♛') {
                        checkArray.push({ index: index - (9 * i), piece: values[index - (9 * i)] });
                        break;
                    } else {
                        break;
                    }
                }
            }
            for (let i = 1; i < 8 - (index % 8); i++) {
                if (values[index + (9 * i)] != '') {
                    if (values[index + (9 * i)] == '🨼' || values[index + (9 * i)] == '🨒' || values[index + (9 * i)] == '♛') {
                        checkArray.push({ index: index + (9 * i), piece: values[index + (9 * i)] });
                        break;
                    } else {
                        break;
                    }
                }
            }
            for (let i = 1; i < 8 - (index % 8); i++) {
                if (values[index - (7 * i)] != '') {
                    if (values[index - (7 * i)] == '🨼' || values[index - (7 * i)] == '🨒' || values[index - (7 * i)] == '♛') {
                        checkArray.push({ index: index - (7 * i), piece: values[index - (7 * i)] });
                        break;
                    } else {
                        break;
                    }
                }
            }
            for (let i = 1; i <= (index % 8); i++) {
                if (values[index + (7 * i)] != '') {
                    if (values[index + (7 * i)] == '🨼' || values[index + (7 * i)] == '🨒' || values[index + (7 * i)] == '♛') {
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
                    if (values[index - 8] == '') {
                        if (!checkForCheckWhite(index - 8)) {
                            moveArray.push(index - 8);
                        }
                    }
                    if (values[index + 8] == '') {
                        if (!checkForCheckWhite(index + 8)) {
                            moveArray.push(index + 8);
                        }
                    }
                    if (index % 8 > 0) {
                        if (values[index - 1] == '') {
                            if (!checkForCheckWhite(index - 1)) {
                                moveArray.push(index - 1);
                            }
                        }
                        if (values[index - 9] == '') {
                            if (!checkForCheckWhite(index - 9)) {
                                moveArray.push(index - 9);
                            }
                        }
                        if (values[index + 7] == '') {
                            if (!checkForCheckWhite(index + 7)) {
                                moveArray.push(index + 7);
                            }
                        }
                    }
                    if (index % 8 < 7) {
                        if (values[index + 1] == '') {
                            if (!checkForCheckWhite(index + 1)) {
                                moveArray.push(index + 1);
                            }
                        }
                        if (values[index - 7] == '') {
                            if (!checkForCheckWhite(index - 7)) {
                                moveArray.push(index - 7);
                            }
                        }
                        if (values[index + 9] == '') {
                            if (!checkForCheckWhite(index + 9)) {
                                moveArray.push(index + 9);
                            }
                        }
                    }
                    break;
                // Black King Movement
                case '♚':
                    if (values[index - 8] == '') {
                        if (!checkForCheckBlack(index - 8)) {
                            moveArray.push(index - 8);
                        }
                    }
                    if (values[index + 8] == '') {
                        if (!checkForCheckBlack(index + 8)) {
                            moveArray.push(index + 8);
                        }
                    }
                    if (index % 8 > 0) {
                        if (values[index - 1] == '') {
                            if (!checkForCheckBlack(index - 1)) {
                                moveArray.push(index - 1);
                            }
                        }
                        if (values[index - 9] == '') {
                            if (!checkForCheckBlack(index - 9)) {
                                moveArray.push(index - 9);
                            }
                        }
                        if (values[index + 7] == '') {
                            if (!checkForCheckBlack(index + 7)) {
                                moveArray.push(index + 7);
                            }
                        }
                    }
                    if (index % 8 < 7) {
                        if (values[index + 1] == '') {
                            if (!checkForCheckBlack(index + 1)) {
                                moveArray.push(index + 1);
                            }
                        }
                        if (values[index - 7] == '') {
                            if (!checkForCheckBlack(index - 7)) {
                                moveArray.push(index - 7);
                            }
                        }
                        if (values[index + 9] == '') {
                            if (!checkForCheckBlack(index + 9)) {
                                moveArray.push(index + 9);
                            }
                        }
                    }
                default:
                    break;
            }
        } else if (checkArr.length == 1 || sameAsMage) {
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
                    } else {
                        uncheckArray.push(checkArr[0].index);
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
                    } else {
                        uncheckArray.push(checkArr[0].index);
                    }
                    break;
                case '🨶':
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
                                } else if (values[i] == '♙' || values[i] == '🨣' || values[i] == '♖' || values[i] == '♘' || values[i] == '🨶' || values[i] == '🨌' || values[i] == '♕') {
                                    blocker = true;
                                    uncheckArray.push(i);
                                } else if (values[i] == '♟' || values[i] == '🨩' || values[i] == '♜' || values[i] == '♞' || values[i] == '🨼' || values[i] == '🨒' || values[i] == '♛') {
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
                                } else if (values[i] == '♙' || values[i] == '🨣' || values[i] == '♖' || values[i] == '♘' || values[i] == '🨶' || values[i] == '🨌' || values[i] == '♕') {
                                    blocker = true;
                                    uncheckArray.push(i);
                                } else if (values[i] == '♟' || values[i] == '🨩' || values[i] == '♜' || values[i] == '♞' || values[i] == '🨼' || values[i] == '🨒' || values[i] == '♛') {
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
                                } else if (values[i] == '♙' || values[i] == '🨣' || values[i] == '♖' || values[i] == '♘' || values[i] == '🨶' || values[i] == '🨌' || values[i] == '♕') {
                                    blocker = true;
                                    uncheckArray.push(i);
                                } else if (values[i] == '♟' || values[i] == '🨩' || values[i] == '♜' || values[i] == '♞' || values[i] == '🨼' || values[i] == '🨒' || values[i] == '♛') {
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
                                } else if (values[i] == '♙' || values[i] == '🨣' || values[i] == '♖' || values[i] == '♘' || values[i] == '🨶' || values[i] == '🨌' || values[i] == '♕') {
                                    blocker = true;
                                    uncheckArray.push(i);
                                } else if (values[i] == '♟' || values[i] == '🨩' || values[i] == '♜' || values[i] == '♞' || values[i] == '🨼' || values[i] == '🨒' || values[i] == '♛') {
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
                                } else if (values[i] == '♙' || values[i] == '🨣' || values[i] == '♖' || values[i] == '♘' || values[i] == '🨶' || values[i] == '🨌' || values[i] == '♕') {
                                    blocker = true;
                                } else if (values[i] == '♟' || values[i] == '🨩' || values[i] == '♜' || values[i] == '♞' || values[i] == '🨼' || values[i] == '🨒' || values[i] == '♛') {
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
                                } else if (values[i] == '♙' || values[i] == '🨣' || values[i] == '♖' || values[i] == '♘' || values[i] == '🨶' || values[i] == '🨌' || values[i] == '♕') {
                                    blocker = true;
                                } else if (values[i] == '♟' || values[i] == '🨩' || values[i] == '♜' || values[i] == '♞' || values[i] == '🨼' || values[i] == '🨒' || values[i] == '♛') {
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
                                } else if (values[i] == '♙' || values[i] == '🨣' || values[i] == '♖' || values[i] == '♘' || values[i] == '🨶' || values[i] == '🨌' || values[i] == '♕') {
                                    blocker = true;
                                } else if (values[i] == '♟' || values[i] == '🨩' || values[i] == '♜' || values[i] == '♞' || values[i] == '🨼' || values[i] == '🨒' || values[i] == '♛') {
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
                                } else if (values[i] == '♙' || values[i] == '🨣' || values[i] == '♖' || values[i] == '♘' || values[i] == '🨶' || values[i] == '🨌' || values[i] == '♕') {
                                    blocker = true;
                                } else if (values[i] == '♟' || values[i] == '🨩' || values[i] == '♜' || values[i] == '♞' || values[i] == '🨼' || values[i] == '🨒' || values[i] == '♛') {
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
                    uncheckArray.push(checkArr[0].index);
                    break;
                case '♞':
                    uncheckArray.push(checkArr[0].index);
                    break;
                case '🨣':
                    uncheckArray.push(checkArr[0].index);
                    break;
                case '🨩':
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
                // White Soldier Movement
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
                        for (let i = 1; i <= Math.floor(index / 8); i++) {
                            if (values[index - (8 * i)] == '' && uncheckArray.some(val => (index - (8 * i) == val))) {
                                moveArray.push(index - (8 * i));
                            } else if (values[index - (8 * i)] == '') {
                                continue;
                            } else {
                                break;
                            }
                        }
                    }
                    break;
                // Black Soldier Movement
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
                        for (let i = 1; i < 8 - Math.floor(index / 8); i++) {
                            if (values[index + (8 * i)] == '' && uncheckArray.some(val => (index + (8 * i) == val))) {
                                moveArray.push(index + (8 * i));
                            } else if (values[index + (8 * i)] == '') {
                                continue;
                            } else {
                                break;
                            }
                        }
                    }
                    break;
                // White General Movement
                case '🨣':
                    if (index % 8 < 7) {
                        if (discDir == 'up-right' || discDir == 'down-left' || discDir == '') {
                            if (values[index - 7] != '' && uncheckArray.some(val => (index - 7 == val))) {
                                moveArray.push(index - 7);
                            }
                        }
                        if (discDir == 'up-left' || discDir == 'down-right' || discDir == '') {
                            if (values[index + 9] != '' && uncheckArray.some(val => (index + 9 == val))) {
                                moveArray.push(index + 9);
                            }
                        }
                    }
                    if (index % 8 > 0) {
                        if (discDir == 'up-left' || discDir == 'down-right' || discDir == '') {
                            if (values[index - 9] != '' && uncheckArray.some(val => (index - 9 == val))) {
                                moveArray.push(index - 9);
                            }
                        }
                        if (discDir == 'up-right' || discDir == 'down-left' || discDir == '') {
                            if (values[index + 7] != '' && uncheckArray.some(val => (index + 7 == val))) {
                                moveArray.push(index + 7);
                            }
                        }
                    }
                    if (discDir == 'up' || discDir == 'down' || discDir == '') {
                        for (let i = 1; i <= Math.floor(index / 8); i++) {
                            if (values[index - (8 * i)] == '' && uncheckArray.some(val => (index - (8 * i) == val))) {
                                moveArray.push(index - (8 * i));
                            } else if (values[index - (8 * i)] == '') {
                                continue;
                            } else {
                                break;
                            }
                        }
                        for (let i = 1; i < 8 - Math.floor(index / 8); i++) {
                            if (values[index + (8 * i)] == '' && uncheckArray.some(val => (index + (8 * i) == val))) {
                                moveArray.push(index + (8 * i));
                            } else if (values[index + (8 * i)] == '') {
                                continue;
                            } else {
                                break;
                            }
                        }
                    }
                    break;
                // Black General Movement
                case '🨩':
                    if (index % 8 > 0) {
                        if (discDir == 'up-left' || discDir == 'down-right' || discDir == '') {
                            if (values[index - 9] != '' && uncheckArray.some(val => (index - 9 == val))) {
                                moveArray.push(index - 9);
                            }
                        }
                        if (discDir == 'up-right' || discDir == 'down-left' || discDir == '') {
                            if (values[index + 7] != '' && uncheckArray.some(val => (index + 7 == val))) {
                                moveArray.push(index + 7);
                            }
                        }
                    }
                    if (index % 8 < 7) {
                        if (discDir == 'up-right' || discDir == 'down-left' || discDir == '') {
                            if (values[index - 7] != '' && uncheckArray.some(val => (index - 7 == val))) {
                                moveArray.push(index - 7);
                            }
                        }
                        if (discDir == 'up-left' || discDir == 'down-right' || discDir == '') {
                            if (values[index + 9] != '' && uncheckArray.some(val => (index + 9 == val))) {
                                moveArray.push(index + 9);
                            }
                        }
                    }
                    if (discDir == 'up' || discDir == 'down' || discDir == '') {
                        for (let i = 1; i <= Math.floor(index / 8); i++) {
                            if (values[index - (8 * i)] == '' && uncheckArray.some(val => (index - (8 * i) == val))) {
                                moveArray.push(index - (8 * i));
                            } else if (values[index - (8 * i)] == '') {
                                continue;
                            } else {
                                break;
                            }
                        }
                        for (let i = 1; i < 8 - Math.floor(index / 8); i++) {
                            if (values[index + (8 * i)] == '' && uncheckArray.some(val => (index + (8 * i) == val))) {
                                moveArray.push(index + (8 * i));
                            } else if (values[index + (8 * i)] == '') {
                                continue;
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
                        for (let i = 1; i <= Math.floor(index / 8); i++) {
                            if (uncheckArray.some(val => (index - (8 * i) == val))) {
                                moveArray.push(index - (8 * i));
                            } else if (values[index - (8 * i)] == '') {
                                continue;
                            } else if (values[index - (8 * i)] != '' && values[index - (8 * i)] != '♔' && !blockera) {
                                blockera = true;
                                continue;
                            } else {
                                break;
                            }
                        }
                        var blockerb = false;
                        for (let i = 1; i < 8 - Math.floor(index / 8); i++) {
                            if (uncheckArray.some(val => (index + (8 * i) == val))) {
                                moveArray.push(index + (8 * i));
                            } else if (values[index + (8 * i)] == '') {
                                continue;
                            } else if (values[index + (8 * i)] != '' && values[index + (8 * i)] != '♔' && !blockerb) {
                                blockerb = true;
                                continue;
                            } else {
                                break;
                            }
                        }
                    }
                    if (discDir == 'left' || discDir == 'right' || discDir == '') {
                        var blockerc = false;
                        for (let i = 1; i <= (index % 8); i++) {
                            if (uncheckArray.some(val => (index - i == val))) {
                                moveArray.push(index - i);
                            } else if (values[index - i] == '') {
                                continue;
                            } else if (values[index - i] != '' && values[index - i] != '♔' && !blockerc) {
                                blockerc = true;
                                continue;
                            } else {
                                break;
                            }
                        }
                        var blockerd = false;
                        for (let i = 1; i < 8 - (index % 8); i++) {
                            if (uncheckArray.some(val => (index + i == val))) {
                                moveArray.push(index + i);
                            } else if (values[index + i] == '') {
                                continue;
                            } else if (values[index + i] != '' && values[index + i] != '♔' && !blockerd) {
                                blockerd = true;
                                continue;
                            } else {
                                break;
                            }
                        }
                    }
                    break;
                // Black Mage Movement
                case '♜':
                    if (discDir == 'up' || discDir == 'down' || discDir == '') {
                        var blockera = false;
                        for (let i = 1; i <= Math.floor(index / 8); i++) {
                            if (uncheckArray.some(val => (index - (8 * i) == val))) {
                                moveArray.push(index - (8 * i));
                            } else if (values[index - (8 * i)] == '') {
                                continue;
                            } else if (values[index - (8 * i)] != '' && values[index - (8 * i)] != '♚' && !blockera) {
                                blockera = true;
                                continue;
                            } else {
                                break;
                            }
                        }
                        var blockerb = false;
                        for (let i = 1; i < 8 - Math.floor(index / 8); i++) {
                            if (uncheckArray.some(val => (index + (8 * i) == val))) {
                                moveArray.push(index + (8 * i));
                            } else if (values[index + (8 * i)] == '') {
                                continue;
                            } else if (values[index + (8 * i)] != '' && values[index + (8 * i)] != '♚' && !blockerb) {
                                blockerb = true;
                                continue;
                            } else {
                                break;
                            }
                        }
                    }
                    if (discDir == 'left' || discDir == 'right' || discDir == '') {
                        var blockerc = false;
                        for (let i = 1; i <= (index % 8); i++) {
                            if (uncheckArray.some(val => (index - i == val))) {
                                moveArray.push(index - i);
                            } else if (values[index - i] == '') {
                                continue;
                            } else if (values[index - i] != '' && values[index - i] != '♚' && !blockerc) {
                                blockerc = true;
                                continue;
                            } else {
                                break;
                            }
                        }
                        var blockerd = false;
                        for (let i = 1; i < 8 - (index % 8); i++) {
                            if (uncheckArray.some(val => (index + i == val))) {
                                moveArray.push(index + i);
                            } else if (values[index + i] == '') {
                                continue;
                            } else if (values[index + i] != '' && values[index + i] != '♚' && !blockerd) {
                                blockerd = true;
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
                            switch (index % 8) {
                                case 0:
                                    switch (ind) {
                                        case index - 15:
                                        case index + 17:
                                            if (uncheckArray.some(val => (ind == val))) {
                                                moveArray.push(ind);
                                            }
                                            break;
                                        case index - 6:
                                        case index + 10:
                                            if (uncheckArray.some(val => (ind == val))) {
                                                moveArray.push(ind);
                                            }
                                            break;
                                        default:
                                            if (value == '' && uncheckArray.some(val => (ind == val))) {
                                                moveArray.push(ind);
                                            }
                                            break;
                                    }
                                    break;
                                case 1:
                                    switch (ind) {
                                        case index - 17:
                                        case index + 15:
                                            if (uncheckArray.some(val => (ind == val))) {
                                                moveArray.push(ind);
                                            }
                                            break;
                                        case index - 15:
                                        case index + 17:
                                            if (uncheckArray.some(val => (ind == val))) {
                                                moveArray.push(ind);
                                            }
                                            break;
                                        case index - 6:
                                        case index + 10:
                                            if (uncheckArray.some(val => (ind == val))) {
                                                moveArray.push(ind);
                                            }
                                            break;
                                        default:
                                            if (value == '' && uncheckArray.some(val => (ind == val))) {
                                                moveArray.push(ind);
                                            }
                                            break;
                                    }
                                    break;
                                case 2:
                                case 3:
                                case 4:
                                case 5:
                                    switch (ind) {
                                        case index - 17:
                                        case index + 15:
                                            if (uncheckArray.some(val => (ind == val))) {
                                                moveArray.push(ind);
                                            }
                                            break;
                                        case index - 15:
                                        case index + 17:
                                            if (uncheckArray.some(val => (ind == val))) {
                                                moveArray.push(ind);
                                            }
                                            break;
                                        case index - 10:
                                        case index + 6:
                                            if (uncheckArray.some(val => (ind == val))) {
                                                moveArray.push(ind);
                                            }
                                            break;
                                        case index - 6:
                                        case index + 10:
                                            if (uncheckArray.some(val => (ind == val))) {
                                                moveArray.push(ind);
                                            }
                                            break;
                                        default:
                                            if (value == '' && uncheckArray.some(val => (ind == val))) {
                                                moveArray.push(ind);
                                            }
                                            break;
                                    }
                                    break;
                                case 6:
                                    switch (ind) {
                                        case index - 17:
                                        case index + 15:
                                            if (uncheckArray.some(val => (ind == val))) {
                                                moveArray.push(ind);
                                            }
                                            break;
                                        case index - 15:
                                        case index + 17:
                                            if (uncheckArray.some(val => (ind == val))) {
                                                moveArray.push(ind);
                                            }
                                            break;
                                        case index - 10:
                                        case index + 6:
                                            if (uncheckArray.some(val => (ind == val))) {
                                                moveArray.push(ind);
                                            }
                                            break;
                                        default:
                                            if (value == '' && uncheckArray.some(val => (ind == val))) {
                                                moveArray.push(ind);
                                            }
                                            break;
                                    }
                                    break;
                                case 7:
                                    switch (ind) {
                                        case index - 17:
                                        case index + 15:
                                            if (uncheckArray.some(val => (ind == val))) {
                                                moveArray.push(ind);
                                            }
                                            break;
                                        case index - 10:
                                        case index + 6:
                                            if (uncheckArray.some(val => (ind == val))) {
                                                moveArray.push(ind);
                                            }
                                            break;
                                        default:
                                            if (value == '' && uncheckArray.some(val => (ind == val))) {
                                                moveArray.push(ind);
                                            }
                                            break;
                                    }
                                    break;
                                default:
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
                            switch (index % 8) {
                                case 0:
                                    switch (ind) {
                                        case index - 15:
                                        case index + 17:
                                            if (uncheckArray.some(val => (ind == val))) {
                                                moveArray.push(ind);
                                            }
                                            break;
                                        case index - 6:
                                        case index + 10:
                                            if (uncheckArray.some(val => (ind == val))) {
                                                moveArray.push(ind);
                                            }
                                            break;
                                        default:
                                            if (value == '' && uncheckArray.some(val => (ind == val))) {
                                                moveArray.push(ind);
                                            }
                                            break;
                                    }
                                    break;
                                case 1:
                                    switch (ind) {
                                        case index - 17:
                                        case index + 15:
                                            if (uncheckArray.some(val => (ind == val))) {
                                                moveArray.push(ind);
                                            }
                                            break;
                                        case index - 15:
                                        case index + 17:
                                            if (uncheckArray.some(val => (ind == val))) {
                                                moveArray.push(ind);
                                            }
                                            break;
                                        case index - 6:
                                        case index + 10:
                                            if (uncheckArray.some(val => (ind == val))) {
                                                moveArray.push(ind);
                                            }
                                            break;
                                        default:
                                            if (value == '' && uncheckArray.some(val => (ind == val))) {
                                                moveArray.push(ind);
                                            }
                                            break;
                                    }
                                    break;
                                case 2:
                                case 3:
                                case 4:
                                case 5:
                                    switch (ind) {
                                        case index - 17:
                                        case index + 15:
                                            if (uncheckArray.some(val => (ind == val))) {
                                                moveArray.push(ind);
                                            }
                                            break;
                                        case index - 15:
                                        case index + 17:
                                            if (uncheckArray.some(val => (ind == val))) {
                                                moveArray.push(ind);
                                            }
                                            break;
                                        case index - 10:
                                        case index + 6:
                                            if (uncheckArray.some(val => (ind == val))) {
                                                moveArray.push(ind);
                                            }
                                            break;
                                        case index - 6:
                                        case index + 10:
                                            if (uncheckArray.some(val => (ind == val))) {
                                                moveArray.push(ind);
                                            }
                                            break;
                                        default:
                                            if (value == '' && uncheckArray.some(val => (ind == val))) {
                                                moveArray.push(ind);
                                            }
                                            break;
                                    }
                                    break;
                                case 6:
                                    switch (ind) {
                                        case index - 17:
                                        case index + 15:
                                            if (uncheckArray.some(val => (ind == val))) {
                                                moveArray.push(ind);
                                            }
                                            break;
                                        case index - 15:
                                        case index + 17:
                                            if (uncheckArray.some(val => (ind == val))) {
                                                moveArray.push(ind);
                                            }
                                            break;
                                        case index - 10:
                                        case index + 6:
                                            if (uncheckArray.some(val => (ind == val))) {
                                                moveArray.push(ind);
                                            }
                                            break;
                                        default:
                                            if (value == '' && uncheckArray.some(val => (ind == val))) {
                                                moveArray.push(ind);
                                            }
                                            break;
                                    }
                                    break;
                                case 7:
                                    switch (ind) {
                                        case index - 17:
                                        case index + 15:
                                            if (uncheckArray.some(val => (ind == val))) {
                                                moveArray.push(ind);
                                            }
                                            break;
                                        case index - 10:
                                        case index + 6:
                                            if (uncheckArray.some(val => (ind == val))) {
                                                moveArray.push(ind);
                                            }
                                            break;
                                        default:
                                            if (value == '' && uncheckArray.some(val => (ind == val))) {
                                                moveArray.push(ind);
                                            }
                                            break;
                                    }
                                    break;
                                default:
                                    break;
                            }
                        });
                    }
                    break;
                // White Bodyguard Movement
                case '🨶':
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
                    if (discDir == 'up' || discDir == '') {
                        if (uncheckArray.some(val => (checkIndex - 8 == val))) {
                            moveArray.push(checkIndex - 8);
                        }
                    }
                    if (discDir == 'down' || discDir == '') {
                        if (uncheckArray.some(val => (checkIndex + 8 == val))) {
                            moveArray.push(checkIndex + 8);
                        }
                    }
                    if (discDir == 'left' || discDir == '') {
                        if (checkIndex % 8 >= 1) {
                            if (uncheckArray.some(val => (checkIndex - 1 == val))) {
                                moveArray.push(checkIndex - 1);
                            }
                        }
                    }
                    if (discDir == 'right' || discDir == '') {
                        if (checkIndex % 8 <= 6) {
                            if (uncheckArray.some(val => (checkIndex + 1 == val))) {
                                moveArray.push(checkIndex + 1);
                            }
                        }
                    }
                    if (discDir == 'up-left' || discDir == '') {
                        if (checkIndex % 8 >= 1) {
                            if (uncheckArray.some(val => (checkIndex - 9 == val))) {
                                moveArray.push(checkIndex - 9);
                            }
                        }
                    }
                    if (discDir == 'down-right' || discDir == '') {
                        if (checkIndex % 8 <= 6) {
                            if (uncheckArray.some(val => (checkIndex + 9 == val))) {
                                moveArray.push(checkIndex + 9);
                            }
                        }
                    }
                    if (discDir == 'up-right' || discDir == '') {
                        if (checkIndex % 8 <= 6) {
                            if (uncheckArray.some(val => (checkIndex - 7 == val))) {
                                moveArray.push(checkIndex - 7);
                            }
                        }
                    }
                    if (discDir == 'down-left' || discDir == '') {
                        if (checkIndex % 8 >= 1) {
                            if (uncheckArray.some(val => (checkIndex + 7 == val))) {
                                moveArray.push(checkIndex + 7);
                            }
                        }
                    }
                    break;
                // Black Bodyguard Movement
                case '🨼':
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
                    if (discDir == 'up' || discDir == '') {
                        if (uncheckArray.some(val => (checkIndex - 8 == val))) {
                            moveArray.push(checkIndex - 8);
                        }
                    }
                    if (discDir == 'down' || discDir == '') {
                        if (uncheckArray.some(val => (checkIndex + 8 == val))) {
                            moveArray.push(checkIndex + 8);
                        }
                    }
                    if (discDir == 'left' || discDir == '') {
                        if (checkIndex % 8 >= 1) {
                            if (uncheckArray.some(val => (checkIndex - 1 == val))) {
                                moveArray.push(checkIndex - 1);
                            }
                        }
                    }
                    if (discDir == 'right' || discDir == '') {
                        if (checkIndex % 8 <= 6) {
                            if (uncheckArray.some(val => (checkIndex + 1 == val))) {
                                moveArray.push(checkIndex + 1);
                            }
                        }
                    }
                    if (discDir == 'up-left' || discDir == '') {
                        if (checkIndex % 8 >= 1) {
                            if (uncheckArray.some(val => (checkIndex - 9 == val))) {
                                moveArray.push(checkIndex - 9);
                            }
                        }
                    }
                    if (discDir == 'down-right' || discDir == '') {
                        if (checkIndex % 8 <= 6) {
                            if (uncheckArray.some(val => (checkIndex + 9 == val))) {
                                moveArray.push(checkIndex + 9);
                            }
                        }
                    }
                    if (discDir == 'up-right' || discDir == '') {
                        if (checkIndex % 8 <= 6) {
                            if (uncheckArray.some(val => (checkIndex - 7 == val))) {
                                moveArray.push(checkIndex - 7);
                            }
                        }
                    }
                    if (discDir == 'down-left' || discDir == '') {
                        if (checkIndex % 8 >= 1) {
                            if (uncheckArray.some(val => (checkIndex + 7 == val))) {
                                moveArray.push(checkIndex + 7);
                            }
                        }
                    }
                    break;
                // White Advisor Movement
                case '🨌':
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
                    if (discDir == 'up' || discDir == 'down' || discDir == '') {
                        if (uncheckArray.some(val => (index - 8 == val))) {
                            moveArray.push(index - 8);
                        }
                        if (uncheckArray.some(val => (index + 8 == val))) {
                            moveArray.push(index + 8);
                        }
                    }
                    if (discDir == 'left' || discDir == 'right' || discDir == '') {
                        if (index % 8 >= 1) {
                            if (uncheckArray.some(val => (index - 1 == val))) {
                                moveArray.push(index - 1);
                            }
                        }
                        if (index % 8 <= 6) {
                            if (uncheckArray.some(val => (index + 1 == val))) {
                                moveArray.push(index + 1);
                            }
                        }
                    }
                    break;
                // Black Advisor Movement
                case '🨒':
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
                    if (discDir == 'up' || discDir == 'down' || discDir == '') {
                        if (uncheckArray.some(val => (index - 8 == val))) {
                            moveArray.push(index - 8);
                        }
                        if (uncheckArray.some(val => (index + 8 == val))) {
                            moveArray.push(index + 8);
                        }
                    }
                    if (discDir == 'left' || discDir == 'right' || discDir == '') {
                        if (index % 8 >= 1) {
                            if (uncheckArray.some(val => (index - 1 == val))) {
                                moveArray.push(index - 1);
                            }
                        }
                        if (index % 8 <= 6) {
                            if (uncheckArray.some(val => (index + 1 == val))) {
                                moveArray.push(index + 1);
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
                // White King Movement
                case '♔':
                    if (values[index - 8] == '') {
                        if (!checkForCheckWhite(index - 8)) {
                            moveArray.push(index - 8);
                        }
                    }
                    if (values[index + 8] == '') {
                        if (!checkForCheckWhite(index + 8)) {
                            moveArray.push(index + 8);
                        }
                    }
                    if (index % 8 > 0) {
                        if (values[index - 1] == '') {
                            if (!checkForCheckWhite(index - 1)) {
                                moveArray.push(index - 1);
                            }
                        }
                        if (values[index - 9] == '') {
                            if (!checkForCheckWhite(index - 9)) {
                                moveArray.push(index - 9);
                            }
                        }
                        if (values[index + 7] == '') {
                            if (!checkForCheckWhite(index + 7)) {
                                moveArray.push(index + 7);
                            }
                        }
                    }
                    if (index % 8 < 7) {
                        if (values[index + 1] == '') {
                            if (!checkForCheckWhite(index + 1)) {
                                moveArray.push(index + 1);
                            }
                        }
                        if (values[index - 7] == '') {
                            if (!checkForCheckWhite(index - 7)) {
                                moveArray.push(index - 7);
                            }
                        }
                        if (values[index + 9] == '') {
                            if (!checkForCheckWhite(index + 9)) {
                                moveArray.push(index + 9);
                            }
                        }
                    }
                    break;
                // Black King Movement
                case '♚':
                    if (values[index - 8] == '') {
                        if (!checkForCheckBlack(index - 8)) {
                            moveArray.push(index - 8);
                        }
                    }
                    if (values[index + 8] == '') {
                        if (!checkForCheckBlack(index + 8)) {
                            moveArray.push(index + 8);
                        }
                    }
                    if (index % 8 > 0) {
                        if (values[index - 1] == '') {
                            if (!checkForCheckBlack(index - 1)) {
                                moveArray.push(index - 1);
                            }
                        }
                        if (values[index - 9] == '') {
                            if (!checkForCheckBlack(index - 9)) {
                                moveArray.push(index - 9);
                            }
                        }
                        if (values[index + 7] == '') {
                            if (!checkForCheckBlack(index + 7)) {
                                moveArray.push(index + 7);
                            }
                        }
                    }
                    if (index % 8 < 7) {
                        if (values[index + 1] == '') {
                            if (!checkForCheckBlack(index + 1)) {
                                moveArray.push(index + 1);
                            }
                        }
                        if (values[index - 7] == '') {
                            if (!checkForCheckBlack(index - 7)) {
                                moveArray.push(index - 7);
                            }
                        }
                        if (values[index + 9] == '') {
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
                // White Soldier Movement
                case '♙':
                    if (index % 8 < 7) {
                        if (discDir == 'up-right' || discDir == 'down-left' || discDir == '') {
                            if (values[index - 7] != '' && values[index - 7] != '♙' && values[index - 7] != '🨣' && values[index - 7] != '♖' && values[index - 7] != '♘' && values[index - 7] != '🨶' && values[index - 7] != '🨌' && values[index - 7] != '♕' && values[index - 7] != '♔') {
                                moveArray.push(index - 7);
                            }
                        }
                    }
                    if (index % 8 > 0) {
                        if (discDir == 'up-left' || discDir == 'down-right' || discDir == '') {
                            if (values[index - 9] != '' && values[index - 9] != '♙' && values[index - 9] != '🨣' && values[index - 9] != '♖' && values[index - 9] != '♘' && values[index - 9] != '🨶' && values[index - 9] != '🨌' && values[index - 9] != '♕' && values[index - 9] != '♔') {
                                moveArray.push(index - 9);
                            }
                        }
                    }
                    if (discDir == 'up' || discDir == 'down' || discDir == '') {
                        for (let i = 1; i <= Math.floor(index / 8); i++) {
                            if (values[index - (8 * i)] == '') {
                                moveArray.push(index - (8 * i));
                            } else {
                                break;
                            }
                        }
                    }
                    break;
                // Black Soldier Movement
                case '♟':
                    if (index % 8 > 0) {
                        if (discDir == 'up-right' || discDir == 'down-left' || discDir == '') {
                            if (values[index + 7] != '' && values[index + 7] != '♟' && values[index + 7] != '🨩' && values[index + 7] != '♜' && values[index + 7] != '♞' && values[index + 7] != '🨼' && values[index + 7] != '🨒' && values[index + 7] != '♛' && values[index + 7] != '♚') {
                                moveArray.push(index + 7);
                            }
                        }
                    }
                    if (index % 8 < 7) {
                        if (discDir == 'up-left' || discDir == 'down-right' || discDir == '') {
                            if (values[index + 9] != '' && values[index + 9] != '♟' && values[index + 9] != '🨩' && values[index + 9] != '♜' && values[index + 9] != '♞' && values[index + 9] != '🨼' && values[index + 9] != '🨒' && values[index + 9] != '♛' && values[index + 9] != '♚') {
                                moveArray.push(index + 9);
                            }
                        }
                    }
                    if (discDir == 'up' || discDir == 'down' || discDir == '') {
                        for (let i = 1; i < 8 - Math.floor(index / 8); i++) {
                            if (values[index + (8 * i)] == '') {
                                moveArray.push(index + (8 * i));
                            } else {
                                break;
                            }
                        }
                    }
                    break;
                // White General Movement
                case '🨣':
                    if (index % 8 < 7) {
                        if (discDir == 'up-right' || discDir == 'down-left' || discDir == '') {
                            if (values[index - 7] != '' && values[index - 7] != '♙' && values[index - 7] != '🨣' && values[index - 7] != '♖' && values[index - 7] != '♘' && values[index - 7] != '🨶' && values[index - 7] != '🨌' && values[index - 7] != '♕' && values[index - 7] != '♔') {
                                moveArray.push(index - 7);
                            }
                        }
                        if (discDir == 'up-left' || discDir == 'down-right' || discDir == '') {
                            if (values[index + 9] != '' && values[index + 9] != '♙' && values[index + 9] != '🨣' && values[index + 9] != '♖' && values[index + 9] != '♘' && values[index + 9] != '🨶' && values[index + 9] != '🨌' && values[index + 9] != '♕' && values[index + 9] != '♔') {
                                moveArray.push(index + 9);
                            }
                        }
                    }
                    if (index % 8 > 0) {
                        if (discDir == 'up-left' || discDir == 'down-right' || discDir == '') {
                            if (values[index - 9] != '' && values[index - 9] != '♙' && values[index - 9] != '🨣' && values[index - 9] != '♖' && values[index - 9] != '♘' && values[index - 9] != '🨶' && values[index - 9] != '🨌' && values[index - 9] != '♕' && values[index - 9] != '♔') {
                                moveArray.push(index - 9);
                            }
                        }
                        if (discDir == 'up-right' || discDir == 'down-left' || discDir == '') {
                            if (values[index + 7] != '' && values[index + 7] != '♙' && values[index + 7] != '🨣' && values[index + 7] != '♖' && values[index + 7] != '♘' && values[index + 7] != '🨶' && values[index + 7] != '🨌' && values[index + 7] != '♕' && values[index + 7] != '♔') {
                                moveArray.push(index + 7);
                            }
                        }
                    }
                    if (discDir == 'up' || discDir == 'down' || discDir == '') {
                        for (let i = 1; i <= Math.floor(index / 8); i++) {
                            if (values[index - (8 * i)] == '') {
                                moveArray.push(index - (8 * i));
                            } else {
                                break;
                            }
                        }
                        for (let i = 1; i < 8 - Math.floor(index / 8); i++) {
                            if (values[index + (8 * i)] == '') {
                                moveArray.push(index + (8 * i));
                            } else {
                                break;
                            }
                        }
                    }
                    break;
                // Black General Movement
                case '🨩':
                    if (index % 8 < 7) {
                        if (discDir == 'up-right' || discDir == 'down-left' || discDir == '') {
                            if (values[index - 7] != '' && values[index - 7] != '♟' && values[index - 7] != '🨩' && values[index - 7] != '♜' && values[index - 7] != '♞' && values[index - 7] != '🨼' && values[index - 7] != '🨒' && values[index - 7] != '♛' && values[index - 7] != '♚') {
                                moveArray.push(index - 7);
                            }
                        }
                        if (discDir == 'up-left' || discDir == 'down-right' || discDir == '') {
                            if (values[index + 9] != '' && values[index + 9] != '♟' && values[index + 9] != '🨩' && values[index + 9] != '♜' && values[index + 9] != '♞' && values[index + 9] != '🨼' && values[index + 9] != '🨒' && values[index + 9] != '♛' && values[index + 9] != '♚') {
                                moveArray.push(index + 9);
                            }
                        }
                    }
                    if (index % 8 > 0) {
                        if (discDir == 'up-left' || discDir == 'down-right' || discDir == '') {
                            if (values[index - 9] != '' && values[index - 9] != '♟' && values[index - 9] != '🨩' && values[index - 9] != '♜' && values[index - 9] != '♞' && values[index - 9] != '🨼' && values[index - 9] != '🨒' && values[index - 9] != '♛' && values[index - 9] != '♚') {
                                moveArray.push(index - 9);
                            }
                        }
                        if (discDir == 'up-right' || discDir == 'down-left' || discDir == '') {
                            if (values[index + 7] != '' && values[index + 7] != '♟' && values[index + 7] != '🨩' && values[index + 7] != '♜' && values[index + 7] != '♞' && values[index + 7] != '🨼' && values[index + 7] != '🨒' && values[index + 7] != '♛' && values[index + 7] != '♚') {
                                moveArray.push(index + 7);
                            }
                        }
                    }
                    if (discDir == 'up' || discDir == 'down' || discDir == '') {
                        for (let i = 1; i <= Math.floor(index / 8); i++) {
                            if (values[index - (8 * i)] == '') {
                                moveArray.push(index - (8 * i));
                            } else {
                                break;
                            }
                        }
                        for (let i = 1; i < 8 - Math.floor(index / 8); i++) {
                            if (values[index + (8 * i)] == '') {
                                moveArray.push(index + (8 * i));
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
                        for (let i = 1; i <= Math.floor(index / 8); i++) {
                            if (values[index - (8 * i)] == '') {
                                moveArray.push(index - (8 * i));
                                continue;
                            } else if (values[index - (8 * i)] != '' && values[index - (8 * i)] != '♔' && !blockera) {
                                blockera = true;
                                moveArray.push(index - (8 * i));
                                continue;
                            } else if (values[index - (8 * i)] != '♔') {
                                moveArray.push(index - (8 * i));
                                break;
                            } else {
                                break;
                            }
                        }
                        var blockerb = false;
                        for (let i = 1; i < 8 - Math.floor(index / 8); i++) {
                            if (values[index + (8 * i)] == '') {
                                moveArray.push(index + (8 * i));
                                continue;
                            } else if (values[index + (8 * i)] != '' && values[index + (8 * i)] != '♔' && !blockerb) {
                                blockerb = true;
                                moveArray.push(index + (8 * i));
                                continue;
                            } else if (values[index + (8 * i)] != '♔') {
                                moveArray.push(index + (8 * i));
                                break;
                            } else {
                                break;
                            }
                        }
                    }
                    if (discDir == 'left' || discDir == 'right' || discDir == '') {
                        var blockerc = false;
                        for (let i = 1; i <= (index % 8); i++) {
                            if (values[index - i] == '') {
                                moveArray.push(index - i);
                                continue;
                            } else if (values[index - i] != '' && values[index - i] != '♔' && !blockerc) {
                                blockerc = true;
                                moveArray.push(index - i);
                                continue;
                            } else if (values[index - i] != '♔') {
                                moveArray.push(index - i);
                                break;
                            } else {
                                break;
                            }
                        }
                        var blockerd = false;
                        for (let i = 1; i < 8 - (index % 8); i++) {
                            if (values[index + i] == '') {
                                moveArray.push(index + i);
                                continue;
                            } else if (values[index + i] != '' && values[index + i] != '♔' && !blockerd) {
                                blockerd = true;
                                moveArray.push(index + i);
                                continue;
                            } else if (values[index + i] != '♔') {
                                moveArray.push(index + i);
                                break;
                            } else {
                                break;
                            }
                        }
                    }
                    break;
                // Black Mage Movement
                case '♜':
                    if (discDir == 'up' || discDir == 'down' || discDir == '') {
                        var blockera = false;
                        for (let i = 1; i <= Math.floor(index / 8); i++) {
                            if (values[index - (8 * i)] == '') {
                                moveArray.push(index - (8 * i));
                                continue;
                            } else if (values[index - (8 * i)] != '' && values[index - (8 * i)] != '♚' && !blockera) {
                                blockera = true;
                                moveArray.push(index - (8 * i));
                                continue;
                            } else if (values[index - (8 * i)] != '♚') {
                                moveArray.push(index - (8 * i));
                                break;
                            } else {
                                break;
                            }
                        }
                        var blockerb = false;
                        for (let i = 1; i < 8 - Math.floor(index / 8); i++) {
                            if (values[index + (8 * i)] == '') {
                                moveArray.push(index + (8 * i));
                                continue;
                            } else if (values[index + (8 * i)] != '' && values[index + (8 * i)] != '♚' && !blockerb) {
                                blockerb = true;
                                moveArray.push(index + (8 * i));
                                continue;
                            } else if (values[index + (8 * i)] != '♚') {
                                moveArray.push(index + (8 * i));
                                break;
                            } else {
                                break;
                            }
                        }
                    }
                    if (discDir == 'left' || discDir == 'right' || discDir == '') {
                        var blockerc = false;
                        for (let i = 1; i <= (index % 8); i++) {
                            if (values[index - i] == '') {
                                moveArray.push(index - i);
                                continue;
                            } else if (values[index - i] != '' && values[index - i] != '♚' && !blockerc) {
                                blockerc = true;
                                moveArray.push(index - i);
                                continue;
                            } else if (values[index - i] != '♚') {
                                moveArray.push(index - i);
                                break;
                            } else {
                                break;
                            }
                        }
                        var blockerd = false;
                        for (let i = 1; i < 8 - (index % 8); i++) {
                            if (values[index + i] == '') {
                                moveArray.push(index + i);
                                continue;
                            } else if (values[index + i] != '' && values[index + i] != '♚' && !blockerd) {
                                blockerd = true;
                                moveArray.push(index + i);
                                continue;
                            } else if (values[index + i] != '♚') {
                                moveArray.push(index + i);
                                break;
                            } else {
                                break;
                            }
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
                            switch (index % 8) {
                                case 0:
                                    switch (ind) {
                                        case index - 15:
                                        case index + 17:
                                            if (value != '♙' && value != '🨣' && value != '♖' && value != '♘' && value != '🨶' && value != '🨌' && value != '♕' && value != '♔') {
                                                moveArray.push(ind);
                                            }
                                            break;
                                        case index - 6:
                                        case index + 10:
                                            if (value != '♙' && value != '🨣' && value != '♖' && value != '♘' && value != '🨶' && value != '🨌' && value != '♕' && value != '♔') {
                                                moveArray.push(ind);
                                            }
                                            break;
                                        default:
                                            if (value == '') {
                                                moveArray.push(ind);
                                            }
                                            break;
                                    }
                                    break;
                                case 1:
                                    switch (ind) {
                                        case index - 17:
                                        case index + 15:
                                            if (value != '♙' && value != '🨣' && value != '♖' && value != '♘' && value != '🨶' && value != '🨌' && value != '♕' && value != '♔') {
                                                moveArray.push(ind);
                                            }
                                            break;
                                        case index - 15:
                                        case index + 17:
                                            if (value != '♙' && value != '🨣' && value != '♖' && value != '♘' && value != '🨶' && value != '🨌' && value != '♕' && value != '♔') {
                                                moveArray.push(ind);
                                            }
                                            break;
                                        case index - 6:
                                        case index + 10:
                                            if (value != '♙' && value != '🨣' && value != '♖' && value != '♘' && value != '🨶' && value != '🨌' && value != '♕' && value != '♔') {
                                                moveArray.push(ind);
                                            }
                                            break;
                                        default:
                                            if (value == '') {
                                                moveArray.push(ind);
                                            }
                                            break;
                                    }
                                    break;
                                case 2:
                                case 3:
                                case 4:
                                case 5:
                                    switch (ind) {
                                        case index - 17:
                                        case index + 15:
                                            if (value != '♙' && value != '🨣' && value != '♖' && value != '♘' && value != '🨶' && value != '🨌' && value != '♕' && value != '♔') {
                                                moveArray.push(ind);
                                            }
                                            break;
                                        case index - 15:
                                        case index + 17:
                                            if (value != '♙' && value != '🨣' && value != '♖' && value != '♘' && value != '🨶' && value != '🨌' && value != '♕' && value != '♔') {
                                                moveArray.push(ind);
                                            }
                                            break;
                                        case index - 10:
                                        case index + 6:
                                            if (value != '♙' && value != '🨣' && value != '♖' && value != '♘' && value != '🨶' && value != '🨌' && value != '♕' && value != '♔') {
                                                moveArray.push(ind);
                                            }
                                            break;
                                        case index - 6:
                                        case index + 10:
                                            if (value != '♙' && value != '🨣' && value != '♖' && value != '♘' && value != '🨶' && value != '🨌' && value != '♕' && value != '♔') {
                                                moveArray.push(ind);
                                            }
                                            break;
                                        default:
                                            if (value == '') {
                                                moveArray.push(ind);
                                            }
                                            break;
                                    }
                                    break;
                                case 6:
                                    switch (ind) {
                                        case index - 17:
                                        case index + 15:
                                            if (value != '♙' && value != '🨣' && value != '♖' && value != '♘' && value != '🨶' && value != '🨌' && value != '♕' && value != '♔') {
                                                moveArray.push(ind);
                                            }
                                            break;
                                        case index - 15:
                                        case index + 17:
                                            if (value != '♙' && value != '🨣' && value != '♖' && value != '♘' && value != '🨶' && value != '🨌' && value != '♕' && value != '♔') {
                                                moveArray.push(ind);
                                            }
                                            break;
                                        case index - 10:
                                        case index + 6:
                                            if (value != '♙' && value != '🨣' && value != '♖' && value != '♘' && value != '🨶' && value != '🨌' && value != '♕' && value != '♔') {
                                                moveArray.push(ind);
                                            }
                                            break;
                                        default:
                                            if (value == '') {
                                                moveArray.push(ind);
                                            }
                                            break;
                                    }
                                    break;
                                case 7:
                                    switch (ind) {
                                        case index - 17:
                                        case index + 15:
                                            if (value != '♙' && value != '🨣' && value != '♖' && value != '♘' && value != '🨶' && value != '🨌' && value != '♕' && value != '♔') {
                                                moveArray.push(ind);
                                            }
                                            break;
                                        case index - 10:
                                        case index + 6:
                                            if (value != '♙' && value != '🨣' && value != '♖' && value != '♘' && value != '🨶' && value != '🨌' && value != '♕' && value != '♔') {
                                                moveArray.push(ind);
                                            }
                                            break;
                                        default:
                                            if (value == '') {
                                                moveArray.push(ind);
                                            }
                                            break;
                                    }
                                    break;
                                default:
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
                            switch (index % 8) {
                                case 0:
                                    switch (ind) {
                                        case index - 15:
                                        case index + 17:
                                            if (value != '♟' && value != '🨩' && value != '♜' && value != '♞' && value != '🨼' && value != '🨒' && value != '♛' && value != '♚') {
                                                moveArray.push(ind);
                                            }
                                            break;
                                        case index - 6:
                                        case index + 10:
                                            if (value != '♟' && value != '🨩' && value != '♜' && value != '♞' && value != '🨼' && value != '🨒' && value != '♛' && value != '♚') {
                                                moveArray.push(ind);
                                            }
                                            break;
                                        default:
                                            if (value == '') {
                                                moveArray.push(ind);
                                            }
                                            break;
                                    }
                                    break;
                                case 1:
                                    switch (ind) {
                                        case index - 17:
                                        case index + 15:
                                            if (value != '♟' && value != '🨩' && value != '♜' && value != '♞' && value != '🨼' && value != '🨒' && value != '♛' && value != '♚') {
                                                moveArray.push(ind);
                                            }
                                            break;
                                        case index - 15:
                                        case index + 17:
                                            if (value != '♟' && value != '🨩' && value != '♜' && value != '♞' && value != '🨼' && value != '🨒' && value != '♛' && value != '♚') {
                                                moveArray.push(ind);
                                            }
                                            break;
                                        case index - 6:
                                        case index + 10:
                                            if (value != '♟' && value != '🨩' && value != '♜' && value != '♞' && value != '🨼' && value != '🨒' && value != '♛' && value != '♚') {
                                                moveArray.push(ind);
                                            }
                                            break;
                                        default:
                                            if (value == '') {
                                                moveArray.push(ind);
                                            }
                                            break;
                                    }
                                    break;
                                case 2:
                                case 3:
                                case 4:
                                case 5:
                                    switch (ind) {
                                        case index - 17:
                                        case index + 15:
                                            if (value != '♟' && value != '🨩' && value != '♜' && value != '♞' && value != '🨼' && value != '🨒' && value != '♛' && value != '♚') {
                                                moveArray.push(ind);
                                            }
                                            break;
                                        case index - 15:
                                        case index + 17:
                                            if (value != '♟' && value != '🨩' && value != '♜' && value != '♞' && value != '🨼' && value != '🨒' && value != '♛' && value != '♚') {
                                                moveArray.push(ind);
                                            }
                                            break;
                                        case index - 10:
                                        case index + 6:
                                            if (value != '♟' && value != '🨩' && value != '♜' && value != '♞' && value != '🨼' && value != '🨒' && value != '♛' && value != '♚') {
                                                moveArray.push(ind);
                                            }
                                            break;
                                        case index - 6:
                                        case index + 10:
                                            if (value != '♟' && value != '🨩' && value != '♜' && value != '♞' && value != '🨼' && value != '🨒' && value != '♛' && value != '♚') {
                                                moveArray.push(ind);
                                            }
                                            break;
                                        default:
                                            if (value == '') {
                                                moveArray.push(ind);
                                            }
                                            break;
                                    }
                                    break;
                                case 6:
                                    switch (ind) {
                                        case index - 17:
                                        case index + 15:
                                            if (value != '♟' && value != '🨩' && value != '♜' && value != '♞' && value != '🨼' && value != '🨒' && value != '♛' && value != '♚') {
                                                moveArray.push(ind);
                                            }
                                            break;
                                        case index - 15:
                                        case index + 17:
                                            if (value != '♟' && value != '🨩' && value != '♜' && value != '♞' && value != '🨼' && value != '🨒' && value != '♛' && value != '♚') {
                                                moveArray.push(ind);
                                            }
                                            break;
                                        case index - 10:
                                        case index + 6:
                                            if (value != '♟' && value != '🨩' && value != '♜' && value != '♞' && value != '🨼' && value != '🨒' && value != '♛' && value != '♚') {
                                                moveArray.push(ind);
                                            }
                                            break;
                                        default:
                                            if (value == '') {
                                                moveArray.push(ind);
                                            }
                                            break;
                                    }
                                    break;
                                case 7:
                                    switch (ind) {
                                        case index - 17:
                                        case index + 15:
                                            if (value != '♟' && value != '🨩' && value != '♜' && value != '♞' && value != '🨼' && value != '🨒' && value != '♛' && value != '♚') {
                                                moveArray.push(ind);
                                            }
                                            break;
                                        case index - 10:
                                        case index + 6:
                                            if (value != '♟' && value != '🨩' && value != '♜' && value != '♞' && value != '🨼' && value != '🨒' && value != '♛' && value != '♚') {
                                                moveArray.push(ind);
                                            }
                                            break;
                                        default:
                                            if (value == '') {
                                                moveArray.push(ind);
                                            }
                                            break;
                                    }
                                    break;
                                default:
                                    break;
                            }
                        });
                    }
                    break;
                // White Bodyguard Movement
                case '🨶':
                    if (discDir == 'up-left' || discDir == 'down-right' || discDir == '') {
                        for (let i = 1; i <= (index % 8); i++) {
                            if (values[index - (9 * i)] == '') {
                                moveArray.push(index - (9 * i));
                            } else {
                                if (values[index - (9 * i)] == '♟' || values[index - (9 * i)] == '🨩' || values[index - (9 * i)] == '♜' || values[index - (9 * i)] == '♞' || values[index - (9 * i)] == '🨼' || values[index - (9 * i)] == '🨒' || values[index - (9 * i)] == '♛' || values[index - (9 * i)] == '♚') {
                                    moveArray.push(index - (9 * i));
                                }
                                break;
                            }
                        }
                        for (let i = 1; i < 8 - (index % 8); i++) {
                            if (values[index + (9 * i)] == '') {
                                moveArray.push(index + (9 * i));
                            } else {
                                if (values[index + (9 * i)] == '♟' || values[index + (9 * i)] == '🨩' || values[index + (9 * i)] == '♜' || values[index + (9 * i)] == '♞' || values[index + (9 * i)] == '🨼' || values[index + (9 * i)] == '🨒' || values[index + (9 * i)] == '♛' || values[index + (9 * i)] == '♚') {
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
                                if (values[index - (7 * i)] == '♟' || values[index - (7 * i)] == '🨩' || values[index - (7 * i)] == '♜' || values[index - (7 * i)] == '♞' || values[index - (7 * i)] == '🨼' || values[index - (7 * i)] == '🨒' || values[index - (7 * i)] == '♛' || values[index - (7 * i)] == '♚') {
                                    moveArray.push(index - (7 * i));
                                }
                                break;
                            }
                        }
                        for (let i = 1; i <= (index % 8); i++) {
                            if (values[index + (7 * i)] == '') {
                                moveArray.push(index + (7 * i));
                            } else {
                                if (values[index + (7 * i)] == '♟' || values[index + (7 * i)] == '🨩' || values[index + (7 * i)] == '♜' || values[index + (7 * i)] == '♞' || values[index + (7 * i)] == '🨼' || values[index + (7 * i)] == '🨒' || values[index + (7 * i)] == '♛' || values[index + (7 * i)] == '♚') {
                                    moveArray.push(index + (7 * i));
                                }
                                break;
                            }
                        }
                    }
                    if (discDir == 'up' || discDir == '') {
                        if (checkIndex >= 8) {
                            if (values[checkIndex - 8] != '♙' && values[checkIndex - 8] != '🨣' && values[checkIndex - 8] != '♖' && values[checkIndex - 8] != '♘' && values[checkIndex - 8] != '🨶' && values[checkIndex - 8] != '🨌' && values[checkIndex - 8] != '♕') {
                                moveArray.push(values[checkIndex - 8]);
                            }
                        }
                    }
                    if (discDir == 'down' || discDir == '') {
                        if (checkIndex <= 55) {
                            if (values[checkIndex + 8] != '♙' && values[checkIndex + 8] != '🨣' && values[checkIndex + 8] != '♖' && values[checkIndex + 8] != '♘' && values[checkIndex + 8] != '🨶' && values[checkIndex + 8] != '🨌' && values[checkIndex + 8] != '♕') {
                                moveArray.push(values[checkIndex + 8]);
                            }
                        }
                    }
                    if (discDir == 'left' || discDir == '') {
                        if (checkIndex >= 1) {
                            if (checkIndex % 8 >= 1) {
                                if (values[checkIndex - 1] != '♙' && values[checkIndex - 1] != '🨣' && values[checkIndex - 1] != '♖' && values[checkIndex - 1] != '♘' && values[checkIndex - 1] != '🨶' && values[checkIndex - 1] != '🨌' && values[checkIndex - 1] != '♕') {
                                    moveArray.push(values[checkIndex - 1]);
                                }
                            }
                        }
                    }
                    if (discDir == 'right' || discDir == '') {
                        if (checkIndex <= 62) {
                            if (checkIndex % 8 <= 6) {
                                if (values[checkIndex + 1] != '♙' && values[checkIndex + 1] != '🨣' && values[checkIndex + 1] != '♖' && values[checkIndex + 1] != '♘' && values[checkIndex + 1] != '🨶' && values[checkIndex + 1] != '🨌' && values[checkIndex + 1] != '♕') {
                                    moveArray.push(values[checkIndex + 1]);
                                }
                            }
                        }
                    }
                    if (discDir == 'up-left' || discDir == '') {
                        if (checkIndex >= 9) {
                            if (checkIndex % 8 >= 1) {
                                if (values[checkIndex - 9] != '♙' && values[checkIndex - 9] != '🨣' && values[checkIndex - 9] != '♖' && values[checkIndex - 9] != '♘' && values[checkIndex - 9] != '🨶' && values[checkIndex - 9] != '🨌' && values[checkIndex - 9] != '♕') {
                                    moveArray.push(values[checkIndex - 9]);
                                }
                            }
                        }
                    }
                    if (discDir == 'down-right' || discDir == '') {
                        if (checkIndex <= 54) {
                            if (checkIndex % 8 <= 6) {
                                if (values[checkIndex + 9] != '♙' && values[checkIndex + 9] != '🨣' && values[checkIndex + 9] != '♖' && values[checkIndex + 9] != '♘' && values[checkIndex + 9] != '🨶' && values[checkIndex + 9] != '🨌' && values[checkIndex + 9] != '♕') {
                                    moveArray.push(values[checkIndex + 9]);
                                }
                            }
                        }
                    }
                    if (discDir == 'up-right' || discDir == '') {
                        if (checkIndex >= 7) {
                            if (checkIndex % 8 <= 6) {
                                if (values[checkIndex - 7] != '♙' && values[checkIndex - 7] != '🨣' && values[checkIndex - 7] != '♖' && values[checkIndex - 7] != '♘' && values[checkIndex - 7] != '🨶' && values[checkIndex - 7] != '🨌' && values[checkIndex - 7] != '♕') {
                                    moveArray.push(values[checkIndex - 7]);
                                }
                            }
                        }
                    }
                    if (discDir == 'down-left' || discDir == '') {
                        if (checkIndex <= 56) {
                            if (checkIndex % 8 >= 1) {
                                if (values[checkIndex + 7] != '♙' && values[checkIndex + 7] != '🨣' && values[checkIndex + 7] != '♖' && values[checkIndex + 7] != '♘' && values[checkIndex + 7] != '🨶' && values[checkIndex + 7] != '🨌' && values[checkIndex + 7] != '♕') {
                                    moveArray.push(values[checkIndex + 7]);
                                }
                            }
                        }
                    }
                    break;
                // Black Bodyguard Movement
                case '🨼':
                    if (discDir == 'up-left' || discDir == 'down-right' || discDir == '') {
                        for (let i = 1; i <= (index % 8); i++) {
                            if (values[index - (9 * i)] == '') {
                                moveArray.push(index - (9 * i));
                            } else {
                                if (values[index - (9 * i)] == '♙' || values[index - (9 * i)] == '🨣' || values[index - (9 * i)] == '♖' || values[index - (9 * i)] == '♘' || values[index - (9 * i)] == '🨶' || values[index - (9 * i)] == '🨌' || values[index - (9 * i)] == '♕' || values[index - (9 * i)] == '♔') {
                                    moveArray.push(index - (9 * i));
                                }
                                break;
                            }
                        }
                        for (let i = 1; i < 8 - (index % 8); i++) {
                            if (values[index + (9 * i)] == '') {
                                moveArray.push(index + (9 * i));
                            } else {
                                if (values[index + (9 * i)] == '♙' || values[index + (9 * i)] == '🨣' || values[index + (9 * i)] == '♖' || values[index + (9 * i)] == '♘' || values[index + (9 * i)] == '🨶' || values[index + (9 * i)] == '🨌' || values[index + (9 * i)] == '♕' || values[index + (9 * i)] == '♔') {
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
                                if (values[index - (7 * i)] == '♙' || values[index - (7 * i)] == '🨣' || values[index - (7 * i)] == '♖' || values[index - (7 * i)] == '♘' || values[index - (7 * i)] == '🨌' || values[index - (7 * i)] == '🨶' || values[index - (7 * i)] == '♕' || values[index - (7 * i)] == '♔') {
                                    moveArray.push(index - (7 * i));
                                }
                                break;
                            }
                        }
                        for (let i = 1; i <= (index % 8); i++) {
                            if (values[index + (7 * i)] == '') {
                                moveArray.push(index + (7 * i));
                            } else {
                                if (values[index + (7 * i)] == '♙' || values[index + (7 * i)] == '🨣' || values[index + (7 * i)] == '♖' || values[index + (7 * i)] == '♘' || values[index + (7 * i)] == '🨌' || values[index + (7 * i)] == '🨶' || values[index + (7 * i)] == '♕' || values[index + (7 * i)] == '♔') {
                                    moveArray.push(index + (7 * i));
                                }
                                break;
                            }
                        }
                    }
                    if (discDir == 'up' || discDir == '') {
                        if (checkIndex >= 8) {
                            if (values[checkIndex - 8] != '♟' && values[checkIndex - 8] != '🨩' && values[checkIndex - 8] != '♜' && values[checkIndex - 8] != '♞' && values[checkIndex - 8] != '🨼' && values[checkIndex - 8] != '🨒' && values[checkIndex - 8] != '♛') {
                                moveArray.push(values[checkIndex - 8]);
                            }
                        }
                    }
                    if (discDir == 'down' || discDir == '') {
                        if (checkIndex <= 55) {
                            if (values[checkIndex + 8] != '♟' && values[checkIndex + 8] != '🨩' && values[checkIndex + 8] != '♜' && values[checkIndex + 8] != '♞' && values[checkIndex + 8] != '🨼' && values[checkIndex + 8] != '🨒' && values[checkIndex + 8] != '♛') {
                                moveArray.push(values[checkIndex + 8]);
                            }
                        }
                    }
                    if (discDir == 'left' || discDir == '') {
                        if (checkIndex >= 1) {
                            if (checkIndex % 8 >= 1) {
                                if (values[checkIndex - 1] != '♟' && values[checkIndex - 1] != '🨩' && values[checkIndex - 1] != '♜' && values[checkIndex - 1] != '♞' && values[checkIndex - 1] != '🨼' && values[checkIndex - 1] != '🨒' && values[checkIndex - 1] != '♛') {
                                    moveArray.push(values[checkIndex - 1]);
                                }
                            }
                        }
                    }
                    if (discDir == 'right' || discDir == '') {
                        if (checkIndex <= 62) {
                            if (checkIndex % 8 <= 6) {
                                if (values[checkIndex + 1] != '♟' && values[checkIndex + 1] != '🨩' && values[checkIndex + 1] != '♜' && values[checkIndex + 1] != '♞' && values[checkIndex + 1] != '🨼' && values[checkIndex + 1] != '🨒' && values[checkIndex + 1] != '♛') {
                                    moveArray.push(values[checkIndex + 1]);
                                }
                            }
                        }
                    }
                    if (discDir == 'up-left' || discDir == '') {
                        if (checkIndex >= 9) {
                            if (checkIndex % 8 >= 1) {
                                if (values[checkIndex - 9] != '♟' && values[checkIndex - 9] != '🨩' && values[checkIndex - 9] != '♜' && values[checkIndex - 9] != '♞' && values[checkIndex - 9] != '🨼' && values[checkIndex - 9] != '🨒' && values[checkIndex - 9] != '♛') {
                                    moveArray.push(values[checkIndex - 9]);
                                }
                            }
                        }
                    }
                    if (discDir == 'down-right' || discDir == '') {
                        if (checkIndex <= 54) {
                            if (checkIndex % 8 <= 6) {
                                if (values[checkIndex + 9] != '♟' && values[checkIndex + 9] != '🨩' && values[checkIndex + 9] != '♜' && values[checkIndex + 9] != '♞' && values[checkIndex + 9] != '🨼' && values[checkIndex + 9] != '🨒' && values[checkIndex + 9] != '♛') {
                                    moveArray.push(values[checkIndex + 9]);
                                }
                            }
                        }
                    }
                    if (discDir == 'up-right' || discDir == '') {
                        if (checkIndex >= 7) {
                            if (checkIndex % 8 <= 6) {
                                if (values[checkIndex - 7] != '♟' && values[checkIndex - 7] != '🨩' && values[checkIndex - 7] != '♜' && values[checkIndex - 7] != '♞' && values[checkIndex - 7] != '🨼' && values[checkIndex - 7] != '🨒' && values[checkIndex - 7] != '♛') {
                                    moveArray.push(values[checkIndex - 7]);
                                }
                            }
                        }
                    }
                    if (discDir == 'down-left' || discDir == '') {
                        if (checkIndex <= 56) {
                            if (checkIndex % 8 >= 1) {
                                if (values[checkIndex + 7] != '♟' && values[checkIndex + 7] != '🨩' && values[checkIndex + 7] != '♜' && values[checkIndex + 7] != '♞' && values[checkIndex + 7] != '🨼' && values[checkIndex + 7] != '🨒' && values[checkIndex + 7] != '♛') {
                                    moveArray.push(values[checkIndex + 7]);
                                }
                            }
                        }
                    }
                    break;
                // White Advisor Movement
                case '🨌':
                    if (discDir == 'up-left' || discDir == 'down-right' || discDir == '') {
                        for (let i = 1; i <= (index % 8); i++) {
                            if (values[index - (9 * i)] == '') {
                                moveArray.push(index - (9 * i));
                            } else {
                                if (values[index - (9 * i)] == '♟' || values[index - (9 * i)] == '🨩' || values[index - (9 * i)] == '♜' || values[index - (9 * i)] == '♞' || values[index - (9 * i)] == '🨼' || values[index - (9 * i)] == '🨒' || values[index - (9 * i)] == '♛' || values[index - (9 * i)] == '♚') {
                                    moveArray.push(index - (9 * i));
                                }
                                break;
                            }
                        }
                        for (let i = 1; i < 8 - (index % 8); i++) {
                            if (values[index + (9 * i)] == '') {
                                moveArray.push(index + (9 * i));
                            } else {
                                if (values[index + (9 * i)] == '♟' || values[index + (9 * i)] == '🨩' || values[index + (9 * i)] == '♜' || values[index + (9 * i)] == '♞' || values[index + (9 * i)] == '🨼' || values[index + (9 * i)] == '🨒' || values[index + (9 * i)] == '♛' || values[index + (9 * i)] == '♚') {
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
                                if (values[index - (7 * i)] == '♟' || values[index - (7 * i)] == '🨩' || values[index - (7 * i)] == '♜' || values[index - (7 * i)] == '♞' || values[index - (7 * i)] == '🨼' || values[index - (7 * i)] == '🨒' || values[index - (7 * i)] == '♛' || values[index - (7 * i)] == '♚') {
                                    moveArray.push(index - (7 * i));
                                }
                                break;
                            }
                        }
                        for (let i = 1; i <= (index % 8); i++) {
                            if (values[index + (7 * i)] == '') {
                                moveArray.push(index + (7 * i));
                            } else {
                                if (values[index + (7 * i)] == '♟' || values[index + (7 * i)] == '🨩' || values[index + (7 * i)] == '♜' || values[index + (7 * i)] == '♞' || values[index + (7 * i)] == '🨼' || values[index + (7 * i)] == '🨒' || values[index + (7 * i)] == '♛' || values[index + (7 * i)] == '♚') {
                                    moveArray.push(index + (7 * i));
                                }
                                break;
                            }
                        }
                    }
                    if (discDir == 'up' || discDir == 'down' || discDir == '') {
                        if (index >= 8) {
                            if (values[index - 8] != '♙' && values[index - 8] != '🨣' && values[index - 8] != '♖' && values[index - 8] != '♘' && values[index - 8] != '🨶' && values[index - 8] != '🨌' && values[index - 8] != '♕' && values[index - 8] != '♔') {
                                moveArray.push(index - 8);
                            }
                        }
                        if (index <= 55) {
                            if (values[index + 8] != '♙' && values[index + 8] != '🨣' && values[index + 8] != '♖' && values[index + 8] != '♘' && values[index + 8] != '🨶' && values[index + 8] != '🨌' && values[index + 8] != '♕' && values[index + 8] != '♔') {
                                moveArray.push(index + 8);
                            }
                        }
                    }
                    if (discDir == 'left' || discDir == 'right' || discDir == '') {
                        if (index >= 1) {
                            if (index % 8 >= 1) {
                                if (values[index - 1] != '♙' && values[index - 1] != '🨣' && values[index - 1] != '♖' && values[index - 1] != '♘' && values[index - 1] != '🨶' && values[index - 1] != '🨌' && values[index - 1] != '♕' && values[index - 1] != '♔') {
                                    moveArray.push(index - 1);
                                }
                            }
                        }
                        if (index <= 62) {
                            if (index % 8 <= 6) {
                                if (values[index + 1] != '♙' && values[index + 1] != '🨣' && values[index + 1] != '♖' && values[index + 1] != '♘' && values[index + 1] != '🨶' && values[index + 1] != '🨌' && values[index + 1] != '♕' && values[index + 1] != '♔') {
                                    moveArray.push(index + 1);
                                }
                            }
                        }
                    }
                    break;
                // Black Advisor Movement
                case '🨒':
                    if (discDir == 'up-left' || discDir == 'down-right' || discDir == '') {
                        for (let i = 1; i <= (index % 8); i++) {
                            if (values[index - (9 * i)] == '') {
                                moveArray.push(index - (9 * i));
                            } else {
                                if (values[index - (9 * i)] == '♙' || values[index - (9 * i)] == '🨣' || values[index - (9 * i)] == '♖' || values[index - (9 * i)] == '♘' || values[index - (9 * i)] == '🨶' || values[index - (9 * i)] == '🨌' || values[index - (9 * i)] == '♕' || values[index - (9 * i)] == '♔') {
                                    moveArray.push(index - (9 * i));
                                }
                                break;
                            }
                        }
                        for (let i = 1; i < 8 - (index % 8); i++) {
                            if (values[index + (9 * i)] == '') {
                                moveArray.push(index + (9 * i));
                            } else {
                                if (values[index + (9 * i)] == '♙' || values[index + (9 * i)] == '🨣' || values[index + (9 * i)] == '♖' || values[index + (9 * i)] == '♘' || values[index + (9 * i)] == '🨶' || values[index + (9 * i)] == '🨌' || values[index + (9 * i)] == '♕' || values[index + (9 * i)] == '♔') {
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
                                if (values[index - (7 * i)] == '♙' || values[index - (7 * i)] == '🨣' || values[index - (7 * i)] == '♖' || values[index - (7 * i)] == '♘' || values[index - (7 * i)] == '🨶' || values[index - (7 * i)] == '🨌' || values[index - (7 * i)] == '♕' || values[index - (7 * i)] == '♔') {
                                    moveArray.push(index - (7 * i));
                                }
                                break;
                            }
                        }
                        for (let i = 1; i <= (index % 8); i++) {
                            if (values[index + (7 * i)] == '') {
                                moveArray.push(index + (7 * i));
                            } else {
                                if (values[index + (7 * i)] == '♙' || values[index + (7 * i)] == '🨣' || values[index + (7 * i)] == '♖' || values[index + (7 * i)] == '♘' || values[index + (7 * i)] == '🨶' || values[index + (7 * i)] == '🨌' || values[index + (7 * i)] == '♕' || values[index + (7 * i)] == '♔') {
                                    moveArray.push(index + (7 * i));
                                }
                                break;
                            }
                        }
                    }
                    if (discDir == 'up' || discDir == 'down' || discDir == '') {
                        if (index >= 8) {
                            if (values[index - 8] != '♟' && values[index - 8] != '🨩' && values[index - 8] != '♜' && values[index - 8] != '♞' && values[index - 8] != '🨼' && values[index - 8] != '🨒' && values[index - 8] != '♛' && values[index - 8] != '♚') {
                                moveArray.push(index - 8);
                            }
                        }
                        if (index <= 55) {
                            if (values[index + 8] != '♟' && values[index + 8] != '🨩' && values[index + 8] != '♜' && values[index + 8] != '♞' && values[index + 8] != '🨼' && values[index + 8] != '🨒' && values[index + 8] != '♛' && values[index + 8] != '♚') {
                                moveArray.push(index + 8);
                            }
                        }
                    }
                    if (discDir == 'left' || discDir == 'right' || discDir == '') {
                        if (index >= 1) {
                            if (index % 8 >= 1) {
                                if (values[index - 1] != '♟' && values[index - 1] != '🨩' && values[index - 1] != '♜' && values[index - 1] != '♞' && values[index - 1] != '🨼' && values[index - 1] != '🨒' && values[index - 1] != '♛' && values[index - 1] != '♚') {
                                    moveArray.push(index - 1);
                                }
                            }
                        }
                        if (index <= 62) {
                            if (index % 8 <= 6) {
                                if (values[index + 1] != '♟' && values[index + 1] != '🨩' && values[index + 1] != '♜' && values[index + 1] != '♞' && values[index + 1] != '🨼' && values[index + 1] != '🨒' && values[index + 1] != '♛' && values[index + 1] != '♚') {
                                    moveArray.push(index + 1);
                                }
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
                                if (values[index - (8 * i)] == '♟' || values[index - (8 * i)] == '🨩' || values[index - (8 * i)] == '♜' || values[index - (8 * i)] == '♞' || values[index - (8 * i)] == '🨼' || values[index - (8 * i)] == '🨒' || values[index - (8 * i)] == '♛' || values[index - (8 * i)] == '♚') {
                                    moveArray.push(index - (8 * i));
                                }
                                break;
                            }
                        }
                        for (let i = 1; i < 8 - Math.floor(index / 8); i++) {
                            if (values[index + (8 * i)] == '') {
                                moveArray.push(index + (8 * i));
                            } else {
                                if (values[index + (8 * i)] == '♟' || values[index + (8 * i)] == '🨩' || values[index + (8 * i)] == '♜' || values[index + (8 * i)] == '♞' || values[index + (8 * i)] == '🨼' || values[index + (8 * i)] == '🨒' || values[index + (8 * i)] == '♛' || values[index + (8 * i)] == '♚') {
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
                                if (values[index - i] == '♟' || values[index - i] == '🨩' || values[index - i] == '♜' || values[index - i] == '♞' || values[index - i] == '🨼' || values[index - i] == '🨒' || values[index - i] == '♛' || values[index - i] == '♚') {
                                    moveArray.push(index - i);
                                }
                                break;
                            }
                        }
                        for (let i = 1; i < 8 - (index % 8); i++) {
                            if (values[index + i] == '') {
                                moveArray.push(index + i);
                            } else {
                                if (values[index + i] == '♟' || values[index + i] == '🨩' || values[index + i] == '♜' || values[index + i] == '♞' || values[index + i] == '🨼' || values[index + i] == '🨒' || values[index + i] == '♛' || values[index + i] == '♚') {
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
                                if (values[index - (9 * i)] == '♟' || values[index - (9 * i)] == '🨩' || values[index - (9 * i)] == '♜' || values[index - (9 * i)] == '♞' || values[index - (9 * i)] == '🨼' || values[index - (9 * i)] == '🨒' || values[index - (9 * i)] == '♛' || values[index - (9 * i)] == '♚') {
                                    moveArray.push(index - (9 * i));
                                }
                                break;
                            }
                        }
                        for (let i = 1; i < 8 - (index % 8); i++) {
                            if (values[index + (9 * i)] == '') {
                                moveArray.push(index + (9 * i));
                            } else {
                                if (values[index + (9 * i)] == '♟' || values[index + (9 * i)] == '🨩' || values[index + (9 * i)] == '♜' || values[index + (9 * i)] == '♞' || values[index + (9 * i)] == '🨼' || values[index + (9 * i)] == '🨒' || values[index + (9 * i)] == '♛' || values[index + (9 * i)] == '♚') {
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
                                if (values[index - (7 * i)] == '♟' || values[index - (7 * i)] == '🨩' || values[index - (7 * i)] == '♜' || values[index - (7 * i)] == '♞' || values[index - (7 * i)] == '🨼' || values[index - (7 * i)] == '🨒' || values[index - (7 * i)] == '♛' || values[index - (7 * i)] == '♚') {
                                    moveArray.push(index - (7 * i));
                                }
                                break;
                            }
                        }
                        for (let i = 1; i <= (index % 8); i++) {
                            if (values[index + (7 * i)] == '') {
                                moveArray.push(index + (7 * i));
                            } else {
                                if (values[index + (7 * i)] == '♟' || values[index + (7 * i)] == '🨩' || values[index + (7 * i)] == '♜' || values[index + (7 * i)] == '♞' || values[index + (7 * i)] == '🨼' || values[index + (7 * i)] == '🨒' || values[index + (7 * i)] == '♛' || values[index + (7 * i)] == '♚') {
                                    moveArray.push(index + (7 * i));
                                }
                                break;
                            }
                        }
                    }
                    if (discDir == '') {
                        if (index % 8 > 0) {
                            if (index % 8 > 1) {
                                if (index >= 10) {
                                    if (values[index - 10] != '♙' && values[index - 10] != '🨣' && values[index - 10] != '♖' && values[index - 10] != '♘' && values[index - 10] != '🨶' && values[index - 10] != '🨌' && values[index - 10] != '♕' && values[index - 10] != '♔') {
                                        moveArray.push(index - 10);
                                    }
                                }
                                if (index <= 57) {
                                    if (values[index + 6] != '♙' && values[index + 6] != '🨣' && values[index + 6] != '♖' && values[index + 6] != '♘' && values[index + 6] != '🨶' && values[index + 6] != '🨌' && values[index + 6] != '♕' && values[index + 6] != '♔') {
                                        moveArray.push(index + 6);
                                    }
                                }
                            }
                            if (index >= 17) {
                                if (values[index - 17] != '♙' && values[index - 17] != '🨣' && values[index - 17] != '♖' && values[index - 17] != '♘' && values[index - 17] != '🨶' && values[index - 17] != '🨌' && values[index - 17] != '♕' && values[index - 17] != '♔') {
                                    moveArray.push(index - 17);
                                }
                            }
                            if (index <= 48) {
                                if (values[index + 15] != '♙' && values[index + 15] != '🨣' && values[index + 15] != '♖' && values[index + 15] != '♘' && values[index + 15] != '🨶' && values[index + 15] != '🨌' && values[index + 15] != '♕' && values[index + 15] != '♔') {
                                    moveArray.push(index + 15);
                                }
                            }
                        }
                        if (index % 8 < 7) {
                            if (index % 8 < 6) {
                                if (index >= 6) {
                                    if (values[index - 6] != '♙' && values[index - 6] != '🨣' && values[index - 6] != '♖' && values[index - 6] != '♘' && values[index - 6] != '🨶' && values[index - 6] != '🨌' && values[index - 6] != '♕' && values[index - 6] != '♔') {
                                        moveArray.push(index - 6);
                                    }
                                }
                                if (index <= 53) {
                                    if (values[index + 10] != '♙' && values[index + 10] != '🨣' && values[index + 10] != '♖' && values[index + 10] != '♘' && values[index + 10] != '🨶' && values[index + 10] != '🨌' && values[index + 10] != '♕' && values[index + 10] != '♔') {
                                        moveArray.push(index + 10);
                                    }
                                }
                            }
                            if (index >= 15) {
                                if (values[index - 15] != '♙' && values[index - 15] != '🨣' && values[index - 15] != '♖' && values[index - 15] != '♘' && values[index - 15] != '🨶' && values[index - 15] != '🨌' && values[index - 15] != '♕' && values[index - 15] != '♔') {
                                    moveArray.push(index - 15);
                                }
                            }
                            if (index <= 46) {
                                if (values[index + 17] != '♙' && values[index + 17] != '🨣' && values[index + 17] != '♖' && values[index + 17] != '♘' && values[index + 17] != '🨶' && values[index + 17] != '🨌' && values[index + 17] != '♕' && values[index + 17] != '♔') {
                                    moveArray.push(index + 17);
                                }
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
                                if (values[index - (8 * i)] == '♙' || values[index - (8 * i)] == '🨣' || values[index - (8 * i)] == '♖' || values[index - (8 * i)] == '♘' || values[index - (8 * i)] == '🨶' || values[index - (8 * i)] == '🨌' || values[index - (8 * i)] == '♕' || values[index - (8 * i)] == '♔') {
                                    moveArray.push(index - (8 * i));
                                }
                                break;
                            }
                        }
                        for (let i = 1; i < 8 - Math.floor(index / 8); i++) {
                            if (values[index + (8 * i)] == '') {
                                moveArray.push(index + (8 * i));
                            } else {
                                if (values[index + (8 * i)] == '♙' || values[index + (8 * i)] == '🨣' || values[index + (8 * i)] == '♖' || values[index + (8 * i)] == '♘' || values[index + (8 * i)] == '🨶' || values[index + (8 * i)] == '🨌' || values[index + (8 * i)] == '♕' || values[index + (8 * i)] == '♔') {
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
                                if (values[index - i] == '♙' || values[index - i] == '🨣' || values[index - i] == '♖' || values[index - i] == '♘' || values[index - i] == '🨶' || values[index - i] == '🨌' || values[index - i] == '♕' || values[index - i] == '♔') {
                                    moveArray.push(index - i);
                                }
                                break;
                            }
                        }
                        for (let i = 1; i < 8 - (index % 8); i++) {
                            if (values[index + i] == '') {
                                moveArray.push(index + i);
                            } else {
                                if (values[index + i] == '♙' || values[index + i] == '🨣' || values[index + i] == '♖' || values[index + i] == '♘' || values[index + i] == '🨶' || values[index + i] == '🨌' || values[index + i] == '♕' || values[index + i] == '♔') {
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
                                if (values[index - (9 * i)] == '♙' || values[index - (9 * i)] == '🨣' || values[index - (9 * i)] == '♖' || values[index - (9 * i)] == '♘' || values[index - (9 * i)] == '🨶' || values[index - (9 * i)] == '🨌' || values[index - (9 * i)] == '♕' || values[index - (9 * i)] == '♔') {
                                    moveArray.push(index - (9 * i));
                                }
                                break;
                            }
                        }
                        for (let i = 1; i < 8 - (index % 8); i++) {
                            if (values[index + (9 * i)] == '') {
                                moveArray.push(index + (9 * i));
                            } else {
                                if (values[index + (9 * i)] == '♙' || values[index + (9 * i)] == '🨣' || values[index + (9 * i)] == '♖' || values[index + (9 * i)] == '♘' || values[index + (9 * i)] == '🨶' || values[index + (9 * i)] == '🨌' || values[index + (9 * i)] == '♕' || values[index + (9 * i)] == '♔') {
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
                                if (values[index - (7 * i)] == '♙' || values[index - (7 * i)] == '🨣' || values[index - (7 * i)] == '♖' || values[index - (7 * i)] == '♘' || values[index - (7 * i)] == '🨶' || values[index - (7 * i)] == '🨌' || values[index - (7 * i)] == '♕' || values[index - (7 * i)] == '♔') {
                                    moveArray.push(index - (7 * i));
                                }
                                break;
                            }
                        }
                        for (let i = 1; i <= (index % 8); i++) {
                            if (values[index + (7 * i)] == '') {
                                moveArray.push(index + (7 * i));
                            } else {
                                if (values[index + (7 * i)] == '♙' || values[index + (7 * i)] == '🨣' || values[index + (7 * i)] == '♖' || values[index + (7 * i)] == '♘' || values[index + (7 * i)] == '🨶' || values[index + (7 * i)] == '🨌' || values[index + (7 * i)] == '♕' || values[index + (7 * i)] == '♔') {
                                    moveArray.push(index + (7 * i));
                                }
                                break;
                            }
                        }
                    }
                    if (discDir == '') {
                        if (index % 8 > 0) {
                            if (index % 8 > 1) {
                                if (index >= 10) {
                                    if (values[index - 10] != '♟' && values[index - 10] != '🨩' && values[index - 10] != '♜' && values[index - 10] != '♞' && values[index - 10] != '🨼' && values[index - 10] != '🨒' && values[index - 10] != '♛' && values[index - 10] != '♚') {
                                        moveArray.push(index - 10);
                                    }
                                }
                                if (index <= 57) {
                                    if (values[index + 6] != '♟' && values[index + 6] != '🨩' && values[index + 6] != '♜' && values[index + 6] != '♞' && values[index + 6] != '🨼' && values[index + 6] != '🨒' && values[index + 6] != '♛' && values[index + 6] != '♚') {
                                        moveArray.push(index + 6);
                                    }
                                }
                            }
                            if (index >= 17) {
                                if (values[index - 17] != '♟' && values[index - 17] != '🨩' && values[index - 17] != '♜' && values[index - 17] != '♞' && values[index - 17] != '🨼' && values[index - 17] != '🨒' && values[index - 17] != '♛' && values[index - 17] != '♚') {
                                    moveArray.push(index - 17);
                                }
                            }
                            if (index <= 48) {
                                if (values[index + 15] != '♟' && values[index + 15] != '🨩' && values[index + 15] != '♜' && values[index + 15] != '♞' && values[index + 15] != '🨼' && values[index + 15] != '🨒' && values[index + 15] != '♛' && values[index + 15] != '♚') {
                                    moveArray.push(index + 15);
                                }
                            }
                        }
                        if (index % 8 < 7) {
                            if (index % 8 < 6) {
                                if (index >= 6) {
                                    if (values[index - 6] != '♟' && values[index - 6] != '🨩' && values[index - 6] != '♜' && values[index - 6] != '♞' && values[index - 6] != '🨼' && values[index - 6] != '🨒' && values[index - 6] != '♛' && values[index - 6] != '♚') {
                                        moveArray.push(index - 6);
                                    }
                                }
                                if (index <= 53) {
                                    if (values[index + 10] != '♟' && values[index + 10] != '🨩' && values[index + 10] != '♜' && values[index + 10] != '♞' && values[index + 10] != '🨼' && values[index + 10] != '🨒' && values[index + 10] != '♛' && values[index + 10] != '♚') {
                                        moveArray.push(index + 10);
                                    }
                                }
                            }
                            if (index >= 15) {
                                if (values[index - 15] != '♟' && values[index - 15] != '🨩' && values[index - 15] != '♜' && values[index - 15] != '♞' && values[index - 15] != '🨼' && values[index - 15] != '🨒' && values[index - 15] != '♛' && values[index - 15] != '♚') {
                                    moveArray.push(index - 15);
                                }
                            }
                            if (index <= 46) {
                                if (values[index + 17] != '♟' && values[index + 17] != '🨩' && values[index + 17] != '♜' && values[index + 17] != '♞' && values[index + 17] != '🨼' && values[index + 17] != '🨒' && values[index + 17] != '♛' && values[index + 17] != '♚') {
                                    moveArray.push(index + 17);
                                }
                            }
                        }
                    }
                    break;
                // White King Movement
                case '♔':
                    values.forEach((value, ind) => {
                        switch (ind) {
                            case index - 8:
                            case index + 8:
                                if (value == '♟' || value == '🨩' || value == '♜' || value == '♞' || value == '🨼' || value == '🨒' || value == '♛' || value == '♚') {
                                    if (!checkForCheckWhite(ind)) {
                                        moveArray.push(ind);
                                    }
                                }
                                break;
                            case index - 1:
                            case index - 9:
                            case index + 7:
                                if (index % 8 > 0) {
                                    if (value == '♟' || value == '🨩' || value == '♜' || value == '♞' || value == '🨼' || value == '🨒' || value == '♛' || value == '♚') {
                                        if (!checkForCheckWhite(ind)) {
                                            moveArray.push(ind);
                                        }
                                    }
                                }
                                break;
                            case index + 1:
                            case index - 7:
                            case index + 9:
                                if (index % 8 < 7) {
                                    if (value == '♟' || value == '🨩' || value == '♜' || value == '♞' || value == '🨼' || value == '🨒' || value == '♛' || value == '♚') {
                                        if (!checkForCheckWhite(ind)) {
                                            moveArray.push(ind);
                                        }
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
                            case index - 8:
                            case index + 8:
                                if (value == '♙' || value == '🨣' || value == '♖' || value == '♘' || value == '🨶' || value == '🨌' || value == '♕' || value == '♔') {
                                    if (!checkForCheckBlack(ind)) {
                                        moveArray.push(ind);
                                    }
                                }
                                break;
                            case index - 1:
                            case index - 9:
                            case index + 7:
                                if (index % 8 > 0) {
                                    if (value == '♙' || value == '🨣' || value == '♖' || value == '♘' || value == '🨶' || value == '🨌' || value == '♕' || value == '♔') {
                                        if (!checkForCheckBlack(ind)) {
                                            moveArray.push(ind);
                                        }
                                    }
                                }
                                break;
                            case index + 1:
                            case index - 7:
                            case index + 9:
                                if (index % 8 < 7) {
                                    if (value == '♙' || value == '🨣' || value == '♖' || value == '♘' || value == '🨶' || value == '🨌' || value == '♕' || value == '♔') {
                                        if (!checkForCheckBlack(ind)) {
                                            moveArray.push(ind);
                                        }
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
        var aa = values.findIndex(value => value == '♘');
        var bb = values.findLastIndex(value => value == '♘');
        if (aa == bb && aa != -1) {
            whiteKnights.push(aa);
        } else if (aa != -1) {
            whiteKnights.push(aa);
            whiteKnights.push(bb);
        }
        var blackKnights = [];
        var cc = values.findIndex(value => value == '♞');
        var dd = values.findLastIndex(value => value == '♞');
        if (cc == dd && cc != -1) {
            blackKnights.push(cc);
        } else if (cc != -1) {
            blackKnights.push(cc);
            blackKnights.push(dd);
        }
        var whiteMages = [];
        var ee = values.findIndex(value => value == '♖');
        var ff = values.findLastIndex(value => value == '♖');
        if (ee == ff && ee != -1) {
            whiteMages.push(ee);
        } else if (ee != -1) {
            whiteMages.push(ee);
            whiteMages.push(ff);
        }
        var blackMages = [];
        var gg = values.findIndex(value => value == '♜');
        var hh = values.findLastIndex(value => value == '♜');
        if (gg == hh && gg != -1) {
            blackMages.push(gg);
        } else if (gg != -1) {
            blackMages.push(gg);
            blackMages.push(hh);
        }
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
