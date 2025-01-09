import React, { useEffect, useState } from "react";

import "./styles.css";

const Cell = (props) => {
    const { id, selected, value, win, player, setPlayer, setArray, setSelected, checkForKing } = props;

    const handleClick = () => {
        if (selected.value) {
            // Cancel Move
            if (id == selected.id) {
                setSelected({ id: -1, value: false, king: selected.king, jumpArray: selected.jumpArray, jumped: false, blockedArray: selected.blockedArray });
            }
            // Jump Move
            else if (selected.jumpArray.some(val => (id == val.jump))) {
                setArray(id, selected.king ? (player == '⛂' ? '⛃' : '⛁') : player);
                setArray(selected.id, '');
                setArray(selected.jumpArray.find(val => (id == val.jump)).eat, '');
                setSelected({ id: id, value: false, king: selected.king, jumpArray: [], jumped: true, blockedArray: selected.blockedArray });
            }
            // Normal Move
            else {
                setPlayer();
                setArray(selected.id, '');
                setArray(id, selected.king ? (player == '⛂' ? '⛃' : '⛁') : player);
                setSelected({ id: selected.id, value: false, king: selected.king, jumpArray: selected.jumpArray, jumped: false, blockedArray: selected.blockedArray });
            }
            // Set Black King
            if (id < 8 && player == '⛂') {
                setArray(id, '⛃');
            }
            // Set White King
            if (id > 55 && player == '⛀') {
                setArray(id, '⛁');
            }
        } else {
            setSelected({ id: id, value: true, king: checkForKing(id), jumpArray: selected.jumpArray, jumped: false, blockedArray: selected.blockedArray });
        }
    }

    const checkerboard = ((id % 2 != 1) && (Math.floor(id / 8) % 2 != 1)) || ((id % 2 == 1) && (Math.floor(id / 8) % 2 == 1));
    const blackSelect = (selected.value && player == '⛂' && (id != selected.id && id != selected.id - 9 && id != selected.id - 7));
    const whiteSelect = (selected.value && player == '⛀' && (id != selected.id && id != selected.id + 9 && id != selected.id + 7));
    const blackKingSelect = selected.value && player == '⛂' && selected.king &&
        (id != selected.id && id != selected.id + 9 && id != selected.id + 7 && id != selected.id - 9 && id != selected.id - 7);
    const whiteKingSelect = selected.value && player == '⛀' && selected.king &&
        (id != selected.id && id != selected.id - 9 && id != selected.id - 7 && id != selected.id + 9 && id != selected.id + 7);
    const singleColour = (!selected.value && (player == '⛂' ? (value != '⛂' && value != '⛃') : (value != '⛀' && value != '⛁'))) ||
        (selected.value && id != selected.id && value != '');
    const noFlops = selected.blockedArray.some(val => (id == val));
    const jumpersOnly = selected.jumpArray.length > 0
        ? ((!selected.value && !selected.jumpArray.some(val => (id == val.piece))) ||
            (selected.value && id != selected.id && !selected.jumpArray.some(val => (selected.id == val.piece && id == val.jump))))
        : (selected.king ? (blackKingSelect || whiteKingSelect || singleColour || noFlops) : (blackSelect || whiteSelect || singleColour || noFlops));

    return <button className={"cell2" + (checkerboard ? "white" : "black")} onClick={handleClick}
        disabled={jumpersOnly || (win != '')}>{value}</button>;
};

export default function App() {
    const [player, setPlayer] = useState('⛂'); // whose turn
    const [win, setWin] = useState(''); // win state
    const initArray = ['', '⛀', '', '⛀', '', '⛀', '', '⛀',
        '⛀', '', '⛀', '', '⛀', '', '⛀', '',
        '', '⛀', '', '⛀', '', '⛀', '', '⛀',
        '', '', '', '', '', '', '', '',
        '', '', '', '', '', '', '', '',
        '⛂', '', '⛂', '', '⛂', '', '⛂', '',
        '', '⛂', '', '⛂', '', '⛂', '', '⛂',
        '⛂', '', '⛂', '', '⛂', '', '⛂', ''];
    const [values, setValues] = useState(initArray); // board state
    const [selected, setSelected] = useState({ id: -1, value: false, king: false, jumpArray: [], jumped: false, blockedArray: [] }); // trigger move state upon piece selection

    useEffect(() => {
        checkForJump();
        checkForWin();
    }, [values]);

    const arrayModifier = (id, newVal) => {
        setValues(values => values.map((value, index) => (index == id ? newVal : value)));
    }

    const playerModifier = (func) => {
        (player == '⛂') ? func('⛀') : func('⛂');
    }

    const reset = () => {
        setValues(initArray);
        setPlayer('⛂');
        setWin('');
        setSelected({ id: -1, value: false, king: false, jumpArray: [], jumped: false, blockedArray: [] });
    }

    const noJumpRightBlack = [23, 30, 39, 46, 55, 62]; // index > 16
    const noJumpLeftBlack = [24, 33, 40, 49, 56]; //  index > 18
    const noJumpLeftWhite = [1, 8, 17, 24, 33, 40]; // index < 47
    const noJumpRightWhite = [7, 14, 23, 30, 39]; // index < 45

    const jumpStats = (jumpArray, pieceIndex, eatIndex, jumpIndex) => {
        jumpArray.push({ piece: pieceIndex, eat: eatIndex, jump: jumpIndex });
    }

    const checkForJump = () => {
        var jumpArray = new Array();
        var blockedArray = new Array();
        if (player == '⛂') {
            values.forEach((value, index, array) => {
                // Black Soldier
                if (value == '⛂') {
                    var jumpM = false;
                    // Right
                    if (index > 16 && noJumpRightBlack.every(id => index != id)) {
                        if ((array[index - 7] == '⛀' || array[index - 7] == '⛁') && array[index - 14] == '') {
                            jumpStats(jumpArray, index, index - 7, index - 14);
                            jumpM = true;
                        }
                    }
                    // Left
                    if (index > 18 && noJumpLeftBlack.every(id => index != id)) {
                        if ((array[index - 9] == '⛀' || array[index - 9] == '⛁') && array[index - 18] == '') {
                            jumpStats(jumpArray, index, index - 9, index - 18);
                            jumpM = true;
                        }
                    }
                    // Check which pieces can move
                    if (!jumpM) {
                        var leftM = true;
                        var rightM = true;
                        // Left Column can't move left
                        if (index % 8 == 0) {
                            leftM = false;
                        }
                        // Right Column can't move right
                        else if (index % 8 == 7) {
                            rightM = false;
                        }
                        // If it reached here, there are no jumps
                        // Check if there is a piece blocking left
                        if (leftM) {
                            if (array[index - 9] != '') {
                                leftM = false;
                            }
                        }
                        // Check if there is a piece blocking right
                        if (rightM) {
                            if (array[index - 7] != '') {
                                rightM = false;
                            }
                        }
                        // If blocked, add to blocked array
                        if (!leftM && !rightM) {
                            blockedArray.push(index);
                        }
                    }
                }
                // Black King
                if (value == '⛃') {
                    var jumpM = false;
                    // Right
                    if (index > 16 && noJumpRightBlack.every(id => index != id)) {
                        if ((array[index - 7] == '⛀' || array[index - 7] == '⛁') && array[index - 14] == '') {
                            jumpStats(jumpArray, index, index - 7, index - 14);
                            jumpM = true;
                        }
                    }
                    // Left
                    if (index > 18 && noJumpLeftBlack.every(id => index != id)) {
                        if ((array[index - 9] == '⛀' || array[index - 9] == '⛁') && array[index - 18] == '') {
                            jumpStats(jumpArray, index, index - 9, index - 18);
                            jumpM = true;
                        }
                    }
                    // BLeft
                    if (index < 47 && noJumpLeftWhite.every(id => index != id)) {
                        if ((array[index + 7] == '⛀' || array[index + 7] == '⛁') && array[index + 14] == '') {
                            jumpStats(jumpArray, index, index + 7, index + 14);
                            jumpM = true;
                        }
                    }
                    // BRight
                    if (index < 45 && noJumpRightWhite.every(id => index != id)) {
                        if ((array[index + 9] == '⛀' || array[index + 9] == '⛁') && array[index + 18] == '') {
                            jumpStats(jumpArray, index, index + 9, index + 18);
                            jumpM = true;
                        }
                    }
                    // Check which pieces can move
                    if (!jumpM) {
                        var upLeftM = true;
                        var upRightM = true;
                        var downLeftM = true;
                        var downRightM = true;
                        // Left Column can't move left
                        if (index % 8 == 0) {
                            upLeftM = false;
                            downLeftM = false;
                        }
                        // Right Column can't move right
                        else if (index % 8 == 7) {
                            upRightM = false;
                            downRightM = false;
                        }
                        // Top Row can't move up
                        if (index < 8) {
                            upLeftM = false;
                            upRightM = false;
                        }
                        // Bottom Row can't move down
                        else if (index > 55) {
                            downLeftM = false;
                            downRightM = false;
                        }
                        // If it reached here, there are no jumps
                        // Check if there is a piece blocking up left
                        if (upLeftM) {
                            if (array[index - 9] != '') {
                                upLeftM = false;
                            }
                        }
                        // Check if there is a piece blocking up right
                        if (upRightM) {
                            if (array[index - 7] != '') {
                                upRightM = false;
                            }
                        }
                        // Check if there is a piece blocking down left
                        if (downLeftM) {
                            if (array[index + 7] != '') {
                                downLeftM = false;
                            }
                        }
                        // Check if there is a piece blocking down right
                        if (downRightM) {
                            if (array[index + 9] != '') {
                                downRightM = false;
                            }
                        }
                        // If blocked, add to blocked array
                        if (!upLeftM && !upRightM && !downLeftM && !downRightM) {
                            blockedArray.push(index);
                        }
                    }
                }
            });
        } else if (player == '⛀') {
            values.forEach((value, index, array) => {
                // White Soldier
                if (value == '⛀') {
                    var jumpM = false;
                    // Left
                    if (index < 47 && noJumpLeftWhite.every(id => index != id)) {
                        if ((array[index + 7] == '⛂' || array[index + 7] == '⛃') && array[index + 14] == '') {
                            jumpStats(jumpArray, index, index + 7, index + 14);
                            jumpM = true;
                        }
                    }
                    // Right
                    if (index < 45 && noJumpRightWhite.every(id => index != id)) {
                        if ((array[index + 9] == '⛂' || array[index + 9] == '⛃') && array[index + 18] == '') {
                            jumpStats(jumpArray, index, index + 9, index + 18);
                            jumpM = true;
                        }
                    }
                    // Check which pieces can move
                    if (!jumpM) {
                        var leftM = true;
                        var rightM = true;
                        // Left Column can't move left
                        if (index % 8 == 0) {
                            leftM = false;
                        }
                        // Right Column can't move right
                        else if (index % 8 == 7) {
                            rightM = false;
                        }
                        // If it reached here, there are no jumps
                        // Check if there is a piece blocking left
                        if (leftM) {
                            if (array[index + 7] != '') {
                                leftM = false;
                            }
                        }
                        // Check if there is a piece blocking right
                        if (rightM) {
                            if (array[index + 9] != '') {
                                rightM = false;
                            }
                        }
                        // If blocked, add to blocked array
                        if (!leftM && !rightM) {
                            blockedArray.push(index);
                        }
                    }
                }
                // White King
                if (value == '⛁') {
                    // Left
                    if (index < 47 && noJumpLeftWhite.every(id => index != id)) {
                        if ((array[index + 7] == '⛂' || array[index + 7] == '⛃') && array[index + 14] == '') {
                            jumpStats(jumpArray, index, index + 7, index + 14);
                        }
                    }
                    // Right
                    if (index < 45 && noJumpRightWhite.every(id => index != id)) {
                        if ((array[index + 9] == '⛂' || array[index + 9] == '⛃') && array[index + 18] == '') {
                            jumpStats(jumpArray, index, index + 9, index + 18);
                        }
                    }
                    // BRight
                    if (index > 16 && noJumpRightBlack.every(id => index != id)) {
                        if ((array[index - 7] == '⛂' || array[index - 7] == '⛃') && array[index - 14] == '') {
                            jumpStats(jumpArray, index, index - 7, index - 14);
                        }
                    }
                    // BLeft
                    if (index > 18 && noJumpLeftBlack.every(id => index != id)) {
                        if ((array[index - 9] == '⛂' || array[index - 9] == '⛃') && array[index - 18] == '') {
                            jumpStats(jumpArray, index, index - 9, index - 18);
                        }
                    }
                    // Check which pieces can move
                    if (!jumpM) {
                        var upLeftM = true;
                        var upRightM = true;
                        var downLeftM = true;
                        var downRightM = true;
                        // Left Column can't move left
                        if (index % 8 == 0) {
                            upLeftM = false;
                            downLeftM = false;
                        }
                        // Right Column can't move right
                        else if (index % 8 == 7) {
                            upRightM = false;
                            downRightM = false;
                        }
                        // Top Row can't move up
                        if (index < 8) {
                            upLeftM = false;
                            upRightM = false;
                        }
                        // Bottom Row can't move down
                        else if (index > 55) {
                            downLeftM = false;
                            downRightM = false;
                        }
                        // If it reached here, there are no jumps
                        // Check if there is a piece blocking up left
                        if (upLeftM) {
                            if (array[index - 9] != '') {
                                upLeftM = false;
                            }
                        }
                        // Check if there is a piece blocking up right
                        if (upRightM) {
                            if (array[index - 7] != '') {
                                upRightM = false;
                            }
                        }
                        // Check if there is a piece blocking down left
                        if (downLeftM) {
                            if (array[index + 7] != '') {
                                downLeftM = false;
                            }
                        }
                        // Check if there is a piece blocking down right
                        if (downRightM) {
                            if (array[index + 9] != '') {
                                downRightM = false;
                            }
                        }
                        // If blocked, add to blocked array
                        if (!upLeftM && !upRightM && !downLeftM && !downRightM) {
                            blockedArray.push(index);
                        }
                    }
                }
            });
        }
        // Double Jump
        if (selected.jumped == true && jumpArray.some(val => (selected.id == val.piece))) {
            setSelected({ id: selected.id, value: true, king: checkForKing(selected.id), jumpArray: jumpArray, jumped: false, blockedArray: blockedArray });
        }
        // No Double Jump
        else if (selected.jumped == true) {
            setSelected({ id: selected.id, value: false, king: checkForKing(selected.id), jumpArray: jumpArray, jumped: false, blockedArray: blockedArray });
            arrayModifier(0, '');
            playerModifier(setPlayer);
        }
        // No Jump
        else {
            setSelected({ id: selected.id, value: selected.value, king: selected.king, jumpArray: jumpArray, jumped: false, blockedArray: blockedArray });
        }
    }

    const checkForKing = (index) => {
        if (values[index] == '⛃' || values[index] == '⛁') {
            return true;
        } else {
            return false;
        }
    }

    const checkForWin = () => {
        if (values.every(value => value != '⛀' && value != '⛁')) {
            setWin('Black');
        }
        if (values.every(value => value != '⛂' && value != '⛃')) {
            setWin('White');
        }
    }

    return (
        <div className="app2">
            <div aria-live="polite">
                {((win == '') ? ((player == '⛂' ? 'Black' : 'White') + "'s turn") : ((win == 'draw') ? 'Draw' : ('Winner is ' + win)))}
            </div>
            <div className="board2">
                {values.map((value, index) => (<Cell id={index} value={value} win={win} player={player} selected={selected}
                    setPlayer={() => playerModifier(setPlayer)} setArray={arrayModifier} setSelected={setSelected} checkForKing={checkForKing} />))}
            </div>
            <button onClick={reset}>Reset</button>
        </div>
    );
}
