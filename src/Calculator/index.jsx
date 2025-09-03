import React, { useEffect, useState } from "react";

import "./styles.css";

const valsa = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'X', 'Ɛ'];
const valsb = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'α', 'β', 'γ', 'δ', 'ε', 'ζ', 'η', 'θ', 'ι', 'κ', 'λ', 'μ', 'ν', 'ξ', 'ο', 'Π', 'ρ', 'ς', 'τ', 'υ', 'φ', 'χ', 'ψ', 'ω'];

const convertInt = (num, base) => {
    var result = '';
    var power = Math.floor(Math.log(num) / Math.log(base));
    var next = num;
    for (let i = power; i >= 0; i--) {
        var digit = Math.floor(next / (base ** i));
        if (result == '' && digit == 0) {
            continue;
        } else {
            if (base < 13) {
                result += valsa[digit];
            } else {
                result += valsb[digit];
            }
            next -= (digit * (base ** i));
        }
    }
    if (result == '') {
        result = '0';
    }
    return result;
}

const convertDec = (num, base) => {
    var result = '';
    var power = Math.floor(Math.log10(num)) + 1;
    var exp = 10 ** power;
    var next = num;
    for (let i = 1; i <= Math.min(power, 15); i++) {
        var frac = (1 / (base ** i)) * exp;
        var digit = Math.floor(next / frac);
        if (base < 13) {
            result += valsa[digit];
        } else {
            result += valsb[digit];
        }
        next -= (digit * frac);
    }
    if (result.endsWith('0')) {
        result = result.slice(0, result.split('').findLastIndex(value => value != '0'));
    }
    return result;
}

const convert = (num, base) => {
    if (num.includes('i')) {
        // complex
        if (num.includes('+')) {
            // a + bi, -a + bi
            if (num.startsWith('-')) {
                // -a + bi
                var nnum = num.split('+')[0].split('-')[1];
                var inum = num.split('+')[0].split('i')[0];
                if (nnum.includes('.')) {
                    if (inum.includes('.')) {
                        // a and b are real
                        return '-' + convertInt(Number.parseInt(nnum.split('.')[0]), base) + '.' + convertDec(Number.parseInt(nnum.split('.')[1]), base) + '+' + convertInt(Number.parseInt(inum.split('.')[0]), base) + '.' + convertDec(Number.parseInt(inum.split('.')[1]), base) + 'i';
                    } else {
                        // a is real, b is integer
                        return '-' + convertInt(Number.parseInt(nnum.split('.')[0]), base) + '.' + convertDec(Number.parseInt(nnum.split('.')[1]), base) + '+' + convertInt(Number.parseInt(inum), base) + 'i';
                    }
                } else if (inum.includes('.')) {
                    // a is integer, b is real
                    return '-' + convertInt(Number.parseInt(nnum), base) + '+' + convertInt(Number.parseInt(inum.split('.')[0]), base) + '.' + convertDec(Number.parseInt(inum.split('.')[1]), base) + 'i';
                } else {
                    //a and b are integers
                    return '-' + convertInt(Number.parseInt(nnum), base) + '+' + convertInt(Number.parseInt(inum), base) + 'i';
                }
            } else {
                // a + bi
                var pnum = num.split('+')[0];
                var inum = num.split('+')[1].split('i')[0];
                if (pnum.includes('.')) {
                    if (inum.includes('.')) {
                        // a and b are real
                        return convertInt(Number.parseInt(pnum.split('.')[0]), base) + '.' + convertDec(Number.parseInt(pnum.split('.')[1]), base) + '+' + convertInt(Number.parseInt(inum.split('.')[0]), base) + '.' + convertDec(Number.parseInt(inum.split('.')[1]), base) + 'i';
                    } else {
                        // a is real, b is integer
                        return convertInt(Number.parseInt(pnum.split('.')[0]), base) + '.' + convertDec(Number.parseInt(pnum.split('.')[1]), base) + '+' + convertInt(Number.parseInt(inum), base) + 'i';
                    }
                } else if (inum.includes('.')) {
                    // a is integer, b is real
                    return convertInt(Number.parseInt(pnum), base) + '+' + convertInt(Number.parseInt(inum.split('.')[0]), base) + '.' + convertDec(Number.parseInt(inum.split('.')[1]), base) + 'i';
                } else {
                    //a and b are integers
                    return convertInt(Number.parseInt(pnum), base) + '+' + convertInt(Number.parseInt(inum), base) + 'i';
                }
            }
        } else if (num.includes('-')) {
            // a - bi, -a - bi, -bi
            if (num.split('-').length > 2) {
                // -a - bi
                var nnum = num.split('-')[1];
                var ninum = num.split('-')[2].split('i')[0];
                if (nnum.includes('.')) {
                    if (ninum.includes('.')) {
                        // a and b are real
                        return '-' + convertInt(Number.parseInt(nnum.split('.')[0]), base) + '.' + convertDec(Number.parseInt(nnum.split('.')[1]), base) + '-' + convertInt(Number.parseInt(ninum.split('.')[0]), base) + '.' + convertDec(Number.parseInt(ninum.split('.')[1]), base) + 'i';
                    } else {
                        // a is real, b is integer
                        return '-' + convertInt(Number.parseInt(nnum.split('.')[0]), base) + '.' + convertDec(Number.parseInt(nnum.split('.')[1]), base) + '-' + convertInt(Number.parseInt(ninum), base) + 'i';
                    }
                } else if (ninum.includes('.')) {
                    // a is integer, b is real
                    return '-' + convertInt(Number.parseInt(nnum), base) + '-' + convertInt(Number.parseInt(ninum.split('.')[0]), base) + '.' + convertDec(Number.parseInt(ninum.split('.')[1]), base) + 'i';
                } else {
                    //a and b are integers
                    return '-' + convertInt(Number.parseInt(nnum), base) + '-' + convertInt(Number.parseInt(ninum), base) + 'i';
                }
            } else if (num.split('-')[0] == '') {
                // -bi
                var ninum = num.split('-')[1].split('i')[0];
                if (ninum.includes('.')) {
                    // real
                    return '-' + convertInt(Number.parseInt(ninum.split('.')[0]), base) + '.' + convertDec(Number.parseInt(ninum.split('.')[1]), base) + 'i';
                } else {
                    // integer
                    return '-' + convertInt(Number.parseInt(ninum), base) + 'i';
                }
            } else {
                // a - bi
                var pnum = num.split('-')[0];
                var ninum = num.split('-')[1].split('i')[0];
                if (pnum.includes('.')) {
                    if (ninum.includes('.')) {
                        // a and b are real
                        return convertInt(Number.parseInt(pnum.split('.')[0]), base) + '.' + convertDec(Number.parseInt(pnum.split('.')[1]), base) + '-' + convertInt(Number.parseInt(ninum.split('.')[0]), base) + '.' + convertDec(Number.parseInt(ninum.split('.')[1]), base) + 'i';
                    } else {
                        // a is real, b is integer
                        return convertInt(Number.parseInt(pnum.split('.')[0]), base) + '.' + convertDec(Number.parseInt(pnum.split('.')[1]), base) + '-' + convertInt(Number.parseInt(ninum), base) + 'i';
                    }
                } else if (ninum.includes('.')) {
                    // a is integer, b is real
                    return convertInt(Number.parseInt(pnum), base) + '-' + convertInt(Number.parseInt(ninum.split('.')[0]), base) + '.' + convertDec(Number.parseInt(ninum.split('.')[1]), base) + 'i';
                } else {
                    //a and b are integers
                    return convertInt(Number.parseInt(pnum), base) + '-' + convertInt(Number.parseInt(ninum), base) + 'i';
                }
            }
        } else {
            // bi
            var inum = num.split('i')[0];
            if (inum.includes('.')) {
                // real
                return convertInt(Number.parseInt(inum.split('.')[0]), base) + '.' + convertDec(Number.parseInt(inum.split('.')[1]), base) + 'i';
            } else {
                // integer
                return convertInt(Number.parseInt(inum), base) + 'i';
            }
        }
    } else {
        if (num.includes('.')) {
            // real
            if (num.includes('-')) {
                var nnum = num.split('-')[1];
                return '-' + convertInt(Number.parseInt(nnum.split('.')[0]), base) + '.' + convertDec(Number.parseInt(nnum.split('.')[1]), base);
            } else {
                return convertInt(Number.parseInt(num.split('.')[0]), base) + '.' + convertDec(Number.parseInt(num.split('.')[1]), base);
            }
        } else {
            // integer
            return convertInt(Number.parseInt(num), base);
        }
    }
}

const binaryRealAdd = (aa, bb, base) => {
    var result = '';
    if (base == 1) {
        for (let i = 0; i < aa.length + bb.length; i++) {
            result += '|';
        }
    } else {
        var beginNumA = 0;
        var beginNumB = 0;
        var rem = 0;
        if (aa.includes('.')) {
            if (bb.includes('.')) {
                var aaDec = aa.findIndex(val => val == '.');
                var bbDec = bb.findIndex(val => val == '.');
                var remDec = aaDec;
                var beginDecA = 0;
                var beginDecB = 0;
                beginNumA = aaDec + 1;
                beginNumB = bbDec + 1;
                if (aaDec > bbDec) {
                    remDec = bbDec;
                    beginDecA = aaDec - bbDec;
                    for (let i = 0; i < beginDecA; i++) {
                        result += aa[i];
                    }
                } else if (bbDec > aaDec) {
                    remDec = aaDec;
                    beginDecB = bbDec - aaDec;
                    for (let i = 0; i < beginDecB; i++) {
                        result += bb[i];
                    }
                }
                for (let i = 0; i < remDec; i++) {
                    if (base < 13) {
                        var mm = valsa.findIndex(val => val == aa[i + beginDecA]);
                        var nn = valsa.findIndex(val => val == bb[i + beginDecB]);
                        var oo = mm + nn + rem;
                        result += valsa[oo % base];
                    } else {
                        var mm = valsb.findIndex(val => val == aa[i + beginDecA]);
                        var nn = valsb.findIndex(val => val == bb[i + beginDecB]);
                        var oo = mm + nn + rem;
                        result += valsb[oo % base];
                    }
                    rem = Math.floor(oo / base);
                }
            } else {
                for (let i = 0; i < aa.findIndex(val => val == '.'); i++) {
                    result += aa[i];
                }
                beginNumA = aa.findIndex(val => val == '.') + 1;
            }
            result += '.';
        } else if (bb.includes('.')) {
            for (let i = 0; i < bb.findIndex(val => val == '.'); i++) {
                result += bb[i];
            }
            beginNumB = bb.findIndex(val => val == '.') + 1;
            result += '.';
        }
        var aaa = aa.slice(beginNumA);
        var bbb = bb.slice(beginNumB);
        for (let i = 0; i < Math.min(aaa.length, bbb.length); i++) {
            if (base < 13) {
                var pp = valsa.findIndex(val => val == aaa[i]);
                var qq = valsa.findIndex(val => val == bbb[i]);
                var rr = pp + qq + rem;
                result += valsa[rr % base];
            } else {
                var pp = valsb.findIndex(val => val == aaa[i]);
                var qq = valsb.findIndex(val => val == bbb[i]);
                var rr = pp + qq + rem;
                result += valsb[rr % base];
            }
            rem = Math.floor(rr / base);
        }
        if (aaa.length > bbb.length) {
            for (let i = bbb.length; i < aaa.length; i++) {
                if (base < 13) {
                    var vv = valsa.findIndex(val => val == aaa[i]);
                    var ww = vv + rem;
                    result += valsa[ww % base];
                } else {
                    var vv = valsb.findIndex(val => val == aaa[i]);
                    var ww = vv + rem;
                    result += valsb[ww % base];
                }
                rem = Math.floor(ww / base);
            }
        } else if (bbb.length > aaa.length) {
            for (let i = aaa.length; i < bbb.length; i++) {
                if (base < 13) {
                    var xx = valsa.findIndex(val => val == bbb[i]);
                    var yy = xx + rem;
                    result += valsa[yy % base];
                } else {
                    var xx = valsb.findIndex(val => val == bbb[i]);
                    var yy = xx + rem;
                    result += valsb[yy % base];
                }
                rem = Math.floor(yy / base);
            }
        }
        if (rem > 0) {
            if (rem > base) {
                for (let i = 0; i < Math.ceil(Math.log(rem) / Math.log(base)); i++) {
                    var zz = rem % base;
                    if (base < 13) {
                        result += valsa[zz];
                    } else {
                        result += valsb[zz];
                    }
                    rem = Math.floor(rem / base);
                }
            } else {
                if (base < 13) {
                    result += valsa[rem];
                } else {
                    result += valsb[rem];
                }
            }
        }
        if (result.includes('.')) {
            while (result.startsWith('0')) {
                result = result.slice(1, result.length);
            }
        }
        if (result.startsWith('.')) {
            result = result.slice(1, result.length);
        }
        while (result.endsWith('0')) {
            if (result.length > 1) {
                result = result.slice(0, result.length - 1);
            }
        }
        if (result.endsWith('.')) {
            result += '0';
        }
    }
    return result.split('').reverse().join('');
}

const binaryRealSubtract = (aa, bb, base) => {
    var result = '';
    if (base == 1) {
        if (aa.length > bb.length) {
            for (let i = 0; i < aa.length - bb.length; i++) {
                result += '|';
            }
        } else if (bb.length > aa.length) {
            result += '-';
            for (let i = 0; i < bb.length - aa.length; i++) {
                result += '|';
            }
        } else {
            return '';
        }
    } else {
        if (aa.length == bb.length) {
            if (aa.every((value, index) => value == bb[index])) {
                return '0';
            }
        }
        var beginNumA = 0;
        var beginNumB = 0;
        var aaLen = aa.length - beginNumA;
        var bbLen = bb.length - beginNumB;
        var rem = 0;
        var neg = false;
        var intg = true;
        if (aa.includes('.')) {
            intg = false;
            if (bb.includes('.')) {
                var aaDec = aa.findIndex(val => val == '.');
                var bbDec = bb.findIndex(val => val == '.');
                var remDec = aaDec;
                var beginDecA = 0;
                var beginDecB = 0;
                beginNumA = aaDec + 1;
                beginNumB = bbDec + 1;
                aaLen = aa.length - beginNumA;
                bbLen = bb.length - beginNumB;
                if (aaLen > bbLen) {
                    neg = false;
                } else if (bbLen > aaLen) {
                    neg = true;
                } else {
                    for (let i = 1; i <= Math.max(aa.length, bb.length); i++) {
                        if (i > aa.length) {
                            neg = true;
                            break;
                        }
                        if (i > bb.length) {
                            neg = false;
                            break;
                        }
                        if (aa[aa.length - i] == '.') {
                            continue;
                        }
                        if (base < 13) {
                            var digA = valsa.findIndex(val => val == aa[aa.length - i]);
                            var digB = valsa.findIndex(val => val == bb[bb.length - i]);
                        } else {
                            var digA = valsb.findIndex(val => val == aa[aa.length - i]);
                            var digB = valsb.findIndex(val => val == bb[bb.length - i]);
                        }
                        if (digA > digB) {
                            neg = false;
                            break;
                        } else if (digB > digA) {
                            neg = true;
                            break;
                        }
                    }
                }
                if (aaDec > bbDec) {
                    remDec = bbDec;
                    beginDecA = aaDec - bbDec;
                    if (neg) {
                        for (let i = 0; i < beginDecA; i++) {
                            if (base < 13) {
                                var cc = valsa.findIndex(val => val == aa[i]);
                                result += valsa[base - rem - cc];
                            } else {
                                var cc = valsb.findIndex(val => val == aa[i]);
                                result += valsb[base - rem - cc];
                            }
                            rem = 1;
                        }
                    } else {
                        for (let i = 0; i < beginDecA; i++) {
                            result += aa[i];
                        }
                    }
                } else if (bbDec > aaDec) {
                    remDec = aaDec;
                    beginDecB = bbDec - aaDec;
                    if (neg) {
                        for (let i = 0; i < beginDecB; i++) {
                            result += bb[i];
                        }
                    } else {
                        for (let i = 0; i < beginDecB; i++) {
                            if (base < 13) {
                                var cc = valsa.findIndex(val => val == bb[i]);
                                result += valsa[base - rem - cc];
                            } else {
                                var cc = valsb.findIndex(val => val == bb[i]);
                                result += valsb[base - rem - cc];
                            }
                            rem = 1;
                        }
                    }
                }
                if (neg) {
                    for (let i = 0; i < remDec; i++) {
                        if (base < 13) {
                            var ff = valsa.findIndex(val => val == aa[i + beginDecA]);
                            var gg = valsa.findIndex(val => val == bb[i + beginDecB]);
                            var hh = gg - ff - rem;
                            if (hh < 0) {
                                rem = Math.ceil(Math.abs(hh) / base);
                                hh += (base * rem);
                            } else {
                                rem = 0;
                            }
                            result += valsa[hh % base];
                        } else {
                            var ff = valsb.findIndex(val => val == aa[i + beginDecA]);
                            var gg = valsb.findIndex(val => val == bb[i + beginDecB]);
                            var hh = gg - ff - rem;
                            if (hh < 0) {
                                rem = Math.ceil(Math.abs(hh) / base);
                                hh += (base * rem);
                            } else {
                                rem = 0;
                            }
                            result += valsb[hh % base];
                        }
                    }
                } else {
                    for (let i = 0; i < remDec; i++) {
                        if (base < 13) {
                            var ff = valsa.findIndex(val => val == aa[i + beginDecA]);
                            var gg = valsa.findIndex(val => val == bb[i + beginDecB]);
                            var hh = ff - gg - rem;
                            if (hh < 0) {
                                rem = Math.ceil(Math.abs(hh) / base);
                                hh += (base * rem);
                            } else {
                                rem = 0;
                            }
                            result += valsa[hh % base];
                        } else {
                            var ff = valsb.findIndex(val => val == aa[i + beginDecA]);
                            var gg = valsb.findIndex(val => val == bb[i + beginDecB]);
                            var hh = ff - gg - rem;
                            if (hh < 0) {
                                rem = Math.ceil(Math.abs(hh) / base);
                                hh += (base * rem);
                            } else {
                                rem = 0;
                            }
                            result += valsb[hh % base];
                        }
                    }
                }
            } else {
                beginNumA = aa.findIndex(val => val == '.') + 1;
                aaLen = aa.length - beginNumA;
                bbLen = bb.length - beginNumB;
                if (aaLen > bbLen) {
                    neg = false;
                } else if (bbLen > aaLen) {
                    neg = true;
                } else {
                    for (let i = 1; i <= Math.max(aa.length, bb.length); i++) {
                        if (i > aa.length) {
                            neg = true;
                            break;
                        }
                        if (i > bb.length) {
                            neg = false;
                            break;
                        }
                        if (aa[aa.length - i] == '.') {
                            continue;
                        }
                        if (base < 13) {
                            var digA = valsa.findIndex(val => val == aa[aa.length - i]);
                            var digB = valsa.findIndex(val => val == bb[bb.length - i]);
                        } else {
                            var digA = valsb.findIndex(val => val == aa[aa.length - i]);
                            var digB = valsb.findIndex(val => val == bb[bb.length - i]);
                        }
                        if (digA > digB) {
                            neg = false;
                            break;
                        } else if (digB > digA) {
                            neg = true;
                            break;
                        }
                    }
                }
                if (neg) {
                    for (let i = 0; i < aa.findIndex(val => val == '.'); i++) {
                        if (base < 13) {
                            var jj = valsa.findIndex(val => val == aa[i]);
                            var kk = 0;
                            var ll = kk - jj - rem;
                            if (ll < 0) {
                                rem = Math.ceil(Math.abs(ll) / base);
                                ll += (base * rem);
                            } else {
                                rem = 0;
                            }
                            result += valsa[ll % base];
                        } else {
                            var jj = valsb.findIndex(val => val == aa[i]);
                            var kk = 0;
                            var ll = kk - jj - rem;
                            if (ll < 0) {
                                rem = Math.ceil(Math.abs(ll) / base);
                                ll += (base * rem);
                            } else {
                                rem = 0;
                            }
                            result += valsb[ll % base];
                        }
                    }
                } else {
                    for (let i = 0; i < aa.findIndex(val => val == '.'); i++) {
                        result += aa[i];
                    }
                }
            }
            result += '.';
        } else if (bb.includes('.')) {
            intg = false;
            beginNumB = bb.findIndex(val => val == '.') + 1;
            aaLen = aa.length - beginNumA;
            bbLen = bb.length - beginNumB;
            if (aaLen > bbLen) {
                neg = false;
            } else if (bbLen > aaLen) {
                neg = true;
            } else {
                for (let i = 1; i <= Math.max(aa.length, bb.length); i++) {
                    if (i > aa.length) {
                        neg = true;
                        break;
                    }
                    if (i > bb.length) {
                        neg = false;
                        break;
                    }
                    if (aa[aa.length - i] == '.') {
                        continue;
                    }
                    if (base < 13) {
                        var digA = valsa.findIndex(val => val == aa[aa.length - i]);
                        var digB = valsa.findIndex(val => val == bb[bb.length - i]);
                    } else {
                        var digA = valsb.findIndex(val => val == aa[aa.length - i]);
                        var digB = valsb.findIndex(val => val == bb[bb.length - i]);
                    }
                    if (digA > digB) {
                        neg = false;
                        break;
                    } else if (digB > digA) {
                        neg = true;
                        break;
                    }
                }
            }
            if (neg) {
                for (let i = 0; i < bb.findIndex(val => val == '.'); i++) {
                    result += bb[i];
                }
            } else {
                for (let i = 0; i < bb.findIndex(val => val == '.'); i++) {
                    if (base < 13) {
                        var jj = 0;
                        var kk = valsa.findIndex(val => val == bb[i]);
                        var ll = jj - kk - rem;
                        if (ll < 0) {
                            rem = Math.ceil(Math.abs(ll) / base);
                            ll += (base * rem);
                        } else {
                            rem = 0;
                        }
                        result += valsa[ll % base];
                    } else {
                        var jj = 0;
                        var kk = valsb.findIndex(val => val == bb[i]);
                        var ll = jj - kk - rem;
                        if (ll < 0) {
                            rem = Math.ceil(Math.abs(ll) / base);
                            ll += (base * rem);
                        } else {
                            rem = 0;
                        }
                        result += valsb[ll % base];
                    }
                }
            }
            result += '.';
        }
        var aaa = aa.slice(beginNumA);
        var bbb = bb.slice(beginNumB);
        if (intg) {
            aaLen = aaa.length;
            bbLen = bbb.length;
            if (aaLen > bbLen) {
                neg = false;
            } else if (bbLen > aaLen) {
                neg = true;
            } else {
                for (let i = 1; i <= aaLen; i++) {
                    if (base < 13) {
                        var digA = valsa.findIndex(val => val == aaa[aaLen - i]);
                        var digB = valsa.findIndex(val => val == bbb[bbLen - i]);
                    } else {
                        var digA = valsb.findIndex(val => val == aaa[aaLen - i]);
                        var digB = valsb.findIndex(val => val == bbb[bbLen - i]);
                    }
                    if (digA > digB) {
                        neg = false;
                        break;
                    } else if (digB > digA) {
                        neg = true;
                        break;
                    }
                }
            }
        }
        if (neg) {
            for (let i = 0; i < Math.min(aaa.length, bbb.length); i++) {
                if (base < 13) {
                    var mm = valsa.findIndex(val => val == aaa[i]);
                    var nn = valsa.findIndex(val => val == bbb[i]);
                    var oo = nn - mm - rem;
                    if (oo < 0) {
                        rem = Math.ceil(Math.abs(oo) / base);
                        oo += (base * rem);
                    } else {
                        rem = 0;
                    }
                    result += valsa[oo % base];
                } else {
                    var mm = valsb.findIndex(val => val == aaa[i]);
                    var nn = valsb.findIndex(val => val == bbb[i]);
                    var oo = nn - mm - rem;
                    if (oo < 0) {
                        rem = Math.ceil(Math.abs(oo) / base);
                        oo += (base * rem);
                    } else {
                        rem = 0;
                    }
                    result += valsb[oo % base];
                }
            }
        } else {
            for (let i = 0; i < Math.min(aaa.length, bbb.length); i++) {
                if (base < 13) {
                    var mm = valsa.findIndex(val => val == aaa[i]);
                    var nn = valsa.findIndex(val => val == bbb[i]);
                    var oo = mm - nn - rem;
                    if (oo < 0) {
                        rem = Math.ceil(Math.abs(oo) / base);
                        oo += (base * rem);
                    } else {
                        rem = 0;
                    }
                    result += valsa[oo % base];
                } else {
                    var mm = valsb.findIndex(val => val == aaa[i]);
                    var nn = valsb.findIndex(val => val == bbb[i]);
                    var oo = mm - nn - rem;
                    if (oo < 0) {
                        rem = Math.ceil(Math.abs(oo) / base);
                        oo += (base * rem);
                    } else {
                        rem = 0;
                    }
                    result += valsb[oo % base];
                }
            }
        }
        if (aaa.length > bbb.length) {
            for (let i = bbb.length; i < aaa.length; i++) {
                if (base < 13) {
                    var pp = valsa.findIndex(val => val == aaa[i]);
                    var qq = pp - rem;
                    if (qq < 0) {
                        rem = Math.ceil(Math.abs(qq) / base);
                        qq += (base * rem);
                    } else {
                        rem = 0;
                    }
                    result += valsa[qq % base];
                } else {
                    var pp = valsb.findIndex(val => val == aaa[i]);
                    var qq = pp - rem;
                    if (qq < 0) {
                        rem = Math.ceil(Math.abs(qq) / base);
                        qq += (base * rem);
                    } else {
                        rem = 0;
                    }
                    result += valsb[qq % base];
                }
            }
        } else if (bbb.length > aaa.length) {
            for (let i = aaa.length; i < bbb.length; i++) {
                if (base < 13) {
                    var pp = valsa.findIndex(val => val == bbb[i]);
                    var qq = pp - rem;
                    if (qq < 0) {
                        rem = Math.ceil(Math.abs(qq) / base);
                        qq += (base * rem);
                    } else {
                        rem = 0;
                    }
                    result += valsa[qq % base];
                } else {
                    var pp = valsb.findIndex(val => val == bbb[i]);
                    var qq = pp - rem;
                    if (qq < 0) {
                        rem = Math.ceil(Math.abs(qq) / base);
                        qq += (base * rem);
                    } else {
                        rem = 0;
                    }
                    result += valsb[qq % base];
                }
            }
        }
        if (result.includes('.')) {
            while (result.startsWith('0')) {
                result = result.slice(1, result.length);
            }
        }
        if (result.startsWith('.')) {
            result = result.slice(1, result.length);
        }
        while (result.endsWith('0')) {
            if (result.length > 1) {
                result = result.slice(0, result.length - 1);
            }
        }
        if (result.endsWith('.')) {
            result += '0';
        }
        if (neg) {
            result += '-';
        }
    }
    return result.split('').reverse().join('');
}

const binaryRealMultiply = (aa, bb, base) => {
    var result = '';
    if (base == 1) {
        for (let i = 0; i < aa.length * bb.length; i++) {
            result += '|';
        }
    } else {
        if (aa.length == 1) {
            if (aa[0] == '0') {
                return '0';
            }
        }
        if (bb.length == 1) {
            if (bb[0] == '0') {
                return '0';
            }
        }
        var rem = 0;
        if (bb.length > aa.length) {
            var cc = bb;
            var dd = aa;
        } else {
            var cc = aa;
            var dd = bb;
        }
        var resultArr = new Array(dd.length).fill('');
        var aaDec = 0;
        var bbDec = 0;
        if (cc.includes('.')) {
            aaDec = cc.findIndex(val => val == '.');
        }
        if (dd.includes('.')) {
            bbDec = dd.findIndex(val => val == '.');
        }
        var k = aaDec + bbDec + 1;
        for (let i = 0; i < dd.length; i++) {
            k -= 1;
            if (dd[i] == '.') {
                k += 1;
                continue;
            }
            for (let h = k; h < 0; h++) {
                resultArr[i] += '0';
            }
            for (let j = 0; j < cc.length; j++) {
                if (cc[j] == '.') {
                    continue;
                }
                if (base < 13) {
                    var ee = valsa.findIndex(val => val == cc[j]);
                    var ff = valsa.findIndex(val => val == dd[i]);
                    var gg = ee * ff + rem;
                    resultArr[i] += valsa[gg % base];
                } else {
                    var ee = valsb.findIndex(val => val == cc[j]);
                    var ff = valsb.findIndex(val => val == dd[i]);
                    var gg = ee * ff + rem;
                    resultArr[i] += valsb[gg % base];
                }
                rem = Math.floor(gg / base);
            }
            var remDec = 0;
            if (rem > 0) {
                remDec = Math.ceil(Math.log(rem) / Math.log(base));
                for (let l = 0; l < remDec; l++) {
                    if (base < 13) {
                        resultArr[i] += valsa[rem % base];
                    } else {
                        resultArr[i] += valsb[rem % base];
                    }
                    rem = Math.floor(rem / base);
                }
                if (remDec == 0) {
                    remDec = 1;
                    resultArr[i] += '1';
                }
                rem = 0;
            }
            if (k >= cc.length + remDec) {
                for (let n = cc.length + remDec; n <= k; n++) {
                    resultArr[i] += '0';
                }
                resultArr[i] += '.0';
            } else if (k > 0) {
                resultArr[i] = resultArr[i].slice(0, k) + '.' + resultArr[i].slice(k, resultArr[i].length);
            }
        }
        for (let i = 0; i < resultArr.length; i++) {
            result = binaryRealAdd(result.split('').reverse(), resultArr[i].split(''), base);
        }
        if (result.length > 17) {
            if (valsa.findIndex(val => val == result.split('')[17]) >= (base / 2)) {
                result = result.slice(0, 17);
                var replc = [];
                var lenLen = result.length;
                for (let i = 0; i < lenLen; i++) {
                    if (result.endsWith('.')) {
                        continue;
                    }
                    if (base < 13) {
                        if (result.endsWith(valsa[base - 1])) {
                            replc.splice(0, 0, '0');
                        } else {
                            replc.splice(0, 0, valsa[valsa.findIndex(val => val == result.split('')[result.length - 1]) + 1]);
                            result = result.slice(0, result.length - 1);
                            break;
                        }
                    } else {
                        if (result.endsWith(valsb[base - 1])) {
                            replc.splice(0, 0, '0');
                        } else {
                            replc.splice(0, 0, valsb[valsb.findIndex(val => val == result.split('')[result.length - 1]) + 1]);
                            result = result.slice(0, result.length - 1);
                            break;
                        }
                    }
                    result = result.slice(0, result.length - 1);
                }
                result = result += replc.join('');
            } else {
                result = result.slice(0, 17);
            }
        }
        while (result.startsWith('0')) {
            result = result.slice(1, result.length);
        }
        if (result.startsWith('.')) {
            result = '0' + result;
        }
    }
    return result;
}

const binaryRealDivide = (aa, bb, base) => {
    var result = '';
    if (base == 1) {
        for (let i = 0; i < Math.floor(aa.length / bb.length); i++) {
            result += '|';
        }
    } else {
        var cc = aa.slice().reverse();
        var last = [];
        for (let i = 0; i < cc.length; i++) {
            if (cc[i] == '.') {
                result += '.';
                continue;
            }
            if (last.includes('.')) {
                var decDec = last.findIndex(val => val == '.');
                last.splice(decDec, 1);
                if (last.length > decDec + 1) {
                    last.splice(decDec + 1, 0, '.');
                }
                if (last[0] == '0') {
                    last.splice(0, 1);
                }
                last = binaryRealAdd(last.reverse(), cc[i], base).split('');
            } else {
                if (last[0] == '0') {
                    last.splice(0, 1, cc[i]);
                } else {
                    last.push(cc[i]);
                }
            }
            for (let j = 0; j < base; j++) {
                var k = binaryRealSubtract(last.reverse(), bb, base);
                if (k.startsWith('-')) {
                    if (base < 13) {
                        result += valsa[j];
                    } else {
                        result += valsb[j];
                    }
                    last = binaryRealSubtract(bb, k.split('-')[1].split('').reverse(), base).split('');
                    break;
                } else if (k == '0') {
                    if (base < 13) {
                        result += valsa[(j + 1) % base];
                    } else {
                        result += valsb[(j + 1) % base];
                    }
                    last = [];
                    break;
                } else {
                    last = k.split('');
                    if (j == base - 1) {
                        var replc = [];
                        var lenLen = result.length;
                        for (let i = 0; i < lenLen; i++) {
                            if (result.endsWith('.')) {
                                continue;
                            }
                            if (base < 13) {
                                if (result.endsWith(valsa[base - 1])) {
                                    replc.splice(0, 0, '0');
                                } else {
                                    replc.splice(0, 0, valsa[valsa.findIndex(val => val == result.split('')[result.length - 1]) + 1]);
                                    result = result.slice(0, result.length - 1);
                                    break;
                                }
                            } else {
                                if (result.endsWith(valsb[base - 1])) {
                                    replc.splice(0, 0, '0');
                                } else {
                                    replc.splice(0, 0, valsb[valsb.findIndex(val => val == result.split('')[result.length - 1]) + 1]);
                                    result = result.slice(0, result.length - 1);
                                    break;
                                }
                            }
                            result = result.slice(0, result.length - 1);
                        }
                        result = result += replc.join('');
                        j = -1;
                    }
                }
            }
        }
        if (last.length > 0) {
            for (let i = 0; i < 18 - cc.length; i++) {
                if (last.length == 0) {
                    break;
                }
                if (last.includes('.')) {
                    var decInd = last.findIndex(val => val == '.');
                    last.splice(decInd, 1);
                    if (last.length > decInd + 1) {
                        last.splice(decInd + 1, 0, '.');
                    }
                    if (last[0] == '0') {
                        last.splice(0, 1);
                    }
                    last = binaryRealAdd(last.reverse(), cc[i], base).split('');
                } else {
                    if (last[0] != '0') {
                        last.push('0');
                    }
                }
                if (!result.includes('.')) {
                    result += '.';
                }
                for (let j = 0; j < base; j++) {
                    var l = binaryRealSubtract(last.reverse(), bb, base);
                    if (l.startsWith('-')) {
                        if (base < 13) {
                            result += valsa[j];
                        } else {
                            result += valsb[j];
                        }
                        last = binaryRealSubtract(bb, l.split('-')[1].split('').reverse(), base).split('');
                        break;
                    } else if (l == '0') {
                        if (base < 13) {
                            result += valsa[(j + 1) % base];
                        } else {
                            result += valsb[(j + 1) % base];
                        }
                        last = [];
                        break;
                    } else {
                        last = l.split('');
                        if (j == base - 1) {
                            var replc = [];
                            var lenLen = result.length;
                            for (let i = 0; i < lenLen; i++) {
                                if (result.endsWith('.')) {
                                    continue;
                                }
                                if (base < 13) {
                                    if (result.endsWith(valsa[base - 1])) {
                                        replc.splice(0, 0, '0');
                                    } else {
                                        replc.splice(0, 0, valsa[valsa.findIndex(val => val == result.split('')[result.length - 1]) + 1]);
                                        result = result.slice(0, result.length - 1);
                                        break;
                                    }
                                } else {
                                    if (result.endsWith(valsb[base - 1])) {
                                        replc.splice(0, 0, '0');
                                    } else {
                                        replc.splice(0, 0, valsb[valsb.findIndex(val => val == result.split('')[result.length - 1]) + 1]);
                                        result = result.slice(0, result.length - 1);
                                        break;
                                    }
                                }
                                result = result.slice(0, result.length - 1);
                            }
                            result = result += replc.join('');
                            j = -1;
                        }
                    }
                }
            }
        }
        if (result.length > 17) {
            if (valsa.findIndex(val => val == result.split('')[result.length - 1]) >= (base / 2)) {
                result = result.slice(0, result.length - 1);
                var replc = [];
                var lenLen = result.length;
                for (let i = 0; i < lenLen; i++) {
                    if (result.endsWith('.')) {
                        continue;
                    }
                    if (base < 13) {
                        if (result.endsWith(valsa[base - 1])) {
                            replc.splice(0, 0, '0');
                        } else {
                            replc.splice(0, 0, valsa[valsa.findIndex(val => val == result.split('')[result.length - 1]) + 1]);
                            result = result.slice(0, result.length - 1);
                            break;
                        }
                    } else {
                        if (result.endsWith(valsb[base - 1])) {
                            replc.splice(0, 0, '0');
                        } else {
                            replc.splice(0, 0, valsb[valsb.findIndex(val => val == result.split('')[result.length - 1]) + 1]);
                            result = result.slice(0, result.length - 1);
                            break;
                        }
                    }
                    result = result.slice(0, result.length - 1);
                }
                result = result += replc.join('');
            } else {
                result = result.slice(0, result.length - 1);
            }
        }
        if (result.includes('.')) {
            while (result.endsWith('0')) {
                result = result.slice(0, result.length - 1);
            }
        }
        if (result.endsWith('.')) {
            result = result.slice(0, result.length - 1);
        }
    }
    while (result.startsWith('0')) {
        result = result.slice(1, result.length);
    }
    if (result.startsWith('.')) {
        result = '0' + result;
    }
    return result;
}

const binaryRealExponentiate = (aa, bb, base) => {
    var result = '';
    if (base == 1) {
        for (let i = 0; i < aa.length ** bb.length; i++) {
            result += '|';
        }
    } else {
        // exponentiate
    }
}

const binaryRealRoot = (aa, bb, base) => {
    var result = '';
    if (base == 1) {
        for (let i = 0; i < Math.floor(aa.length ** (1 / bb.length)); i++) {
            result += '|';
        }
    } else {
        // root
    }
}

const binaryRealLogarithm = (aa, bb, base) => {
    var result = '';
    if (base == 1) {
        for (let i = 0; Math.floor(Math.log(bb.length) / Math.log(aa.length)); i++) {
            result += '|';
        }
    } else {
        // logarithm
    }
}

const binaryRealTetrate = (aa, bb, base) => {
    var result = '';
    if (base == 1) {
        for (let i = 0; i < aa.length ** bb.length; i++) {
            result += '|';
        }
    } else {
        // tetrate
    }
}

const binaryDivMod = (aa, bb, base) => {
    var result = ['', ''];
    var reDiv = binaryRealDivide(aa, bb, base);
    if (reDiv.includes('.')) {
        reDiv = reDiv.slice(0, reDiv.split('').findIndex(val => val == '.'));
    }
    result[0] = reDiv;
    reDiv = binaryRealMultiply(reDiv.split('').reverse(), bb, base);
    result[1] = binaryRealSubtract(aa, reDiv.split('').reverse(), base);
    return result;
}

const binaryDecMod = (aa, bb, base) => {
    var result = ['', ''];
    var reMul = binaryRealMultiply(aa, bb, base);
    if (reMul.includes('.')) {
        result[0] = '0' + reMul.slice(reMul.split('').findIndex(val => val == '.'), reMul.length);
        result[1] = reMul.slice(0, reMul.split('') .findIndex(val => val == '.'));
    } else {
        result[0] = '0';
        result[1] = reMul;
    }
    return result;
}

const truncate = (mem) => {
    var len = mem.length;
    if (mem.endsWith('log')) {
        return mem.slice(0, len - 3);
    } else if (mem.endsWith('^^')) {
        return mem.slice(0, len - 2);
    } else {
        return mem.slice(0, len - 1);
    }
}

const bifurcate = (mem) => {
    var len = mem.length;
    if (mem.endsWith('log')) {
        return [mem.slice(0, len - 3), 'log'];
    } else if (mem.endsWith('^^')) {
        return [mem.slice(0, len - 2), '^^'];
    } else {
        return [mem.slice(0, len - 1), mem.slice(len - 1, len)];
    }
}

const comParse = (re, im, op) => {
    var result = '';
    var nzr = false;
    var nzi = false;
    if (re != '0' && re != '') {
        result += re;
        nzr = true;
    }
    if (im != '0' && im != '') {
        if (im == '1') {
            if (nzr) {
                result += '+';
            }
            result += 'i';
        } else if (im == '-1') {
            result += '-';
            result += 'i';
        } else {
            if (im.startsWith('-')) {
                result += im;
                result += 'i';
            } else {
                if (nzr) {
                    result += '+';
                }
                result += im;
                result += 'i';
            }
        }
        nzi = true;
    }
    if (!nzr && !nzi) {
        result += re;
    }
    result += op;
    return result;
}

const convSyntSngl = (num, mul, base) => {
    if (base == 1) {
        if (mul.length == 2) {
            var rom = '';
            for (let i = 0; i < num.length; i++) {
                rom = binaryRealAdd(rom.split('').reverse(), ['1'], 2);
            }
            return rom;
        }
    }
    if (base == 2) {
        if (mul.length == 1) {
            if (num.includes('.')) {
                var conv = num.slice(num.findIndex(val => val == '.') + 1, num.length);
            } else {
                var conv = num.slice(0, num.length);
            }
            var tally = '';
            while (conv.length > 1 ? true : conv[0] != '0') {
                tally += '|';
                conv = binaryRealSubtract(conv, ['1'], base).split('').reverse();
            }
            return tally;
        }
    }
    if (num.includes('.')) {
        var whl = '';
        var whlBfr = num.slice(num.findIndex(val => val == '.') + 1, num.length);
        while (whlBfr.length > 1 ? true : whlBfr[0] != '0') {
            var whlArr = binaryDivMod(whlBfr, mul, base);
            if (whlArr[1].length > 1) {
                if (base < 12) {
                    whl = valsa[base] + whl;
                } else {
                    whl = valsb[base] + whl;
                }
            } else {
                whl = whlArr[1] + whl;
            }
            whlBfr = whlArr[0].split('').reverse();
        }
        if (whl === '') {
            whl = '0';
        }
        var dec = '';
        var decBfr = num.slice(0, num.findIndex(val => val == '.'));
        while (decBfr.length > 1 ? true : decBfr[0] != '0') {
            var decArr = binaryDecMod(decBfr, mul, base);
            if (decArr[1].length > 1) {
                if (base < 12) {
                    dec += valsa[base];
                } else {
                    dec += valsb[base];
                }
            } else {
                dec += decArr[1];
            }
            decBfr = decArr[0].split('').reverse();
        }
        return whl + '.' + dec;
    } else {
        var nmbr = '';
        var nmbrBfr = num;
        while (nmbrBfr.length > 1 ? true : nmbrBfr[0] != '0') {
            var nmbrArr = binaryDivMod(nmbrBfr, mul, base);
            if (nmbrArr[1].length > 1) {
                if (base < 12) {
                    nmbr = valsa[base] + nmbr;
                } else {
                    nmbr = valsb[base] + nmbr;
                }
            } else {
                if (mul.length > 1) {
                    if (base == 12) {
                        if (valsb.slice(0, 13).includes(nmbrArr[1])) {
                            nmbr = nmbrArr[1] + nmbr;
                        } else {
                            nmbr = valsb[valsa.findIndex(val => val == nmbrArr[1])] + nmbr;
                        }
                    } else {
                        nmbr = nmbrArr[1] + nmbr;
                    }
                } else {
                    if (base == 13) {
                        if (valsa.includes(nmbrArr[1])) {
                            nmbr = nmbrArr[1] + nmbr;
                        } else {
                            nmbr = valsa[valsb.findIndex(val => val == nmbrArr[1])] + nmbr;
                        }
                    } else {
                        nmbr = nmbrArr[1] + nmbr;
                    }
                }
            }
            nmbrBfr = nmbrArr[0].split('').reverse();
        }
        if (nmbr === '') {
            nmbr = '0';
        }
        return nmbr;
    }
}

const convSynt = (num, mult, base, suff) => {
    var mul = mult.split('').reverse();
    if (num.includes('i')) {
        if (num.startsWith('-')) {
            // -c + di, -c - di, -di
            if (num.split('-').length > 2) {
                // -a - bi
                var aa = num.split('-')[1].split('').reverse();
                var bb = num.split('-')[2].split('i')[0].split('').reverse();
                var re = '-' + convSyntSngl(aa, mul, base);
                var im = '-' + convSyntSngl(bb.length == 0 ? ['1'] : bb, mul, base);
                return comParse(re, im, suff);
            } else if (num.split('-')[1].includes('+')) {
                // -a + bi
                var aa = num.split('-')[1].split('+')[0].split('').reverse();
                var bb = num.split('+')[1].split('i')[0].split('').reverse();
                var re = '-' + convSyntSngl(aa, mul, base);
                var im = convSyntSngl(bb.length == 0 ? ['1'] : bb, mul, base);
                return comParse(re, im, suff);
            } else {
                // -bi
                var bb = num.split('-')[1].split('i')[0].split('').reverse();
                var im = '-' + convSyntSngl(bb.length == 0 ? ['1'] : bb, mul, base);
                return comParse(base == 1 ? '' : '0', im, suff);
            }
        } else if (num.includes('-')) {
            // a - bi
            var aa = num.split('-')[0].split('').reverse();
            var bb = num.split('-')[1].split('i')[0].split('').reverse();
            var re = convSyntSngl(aa, mul, base);
            var im = '-' + convSyntSngl(bb.length == 0 ? ['1'] : bb, mul, base)
            return comParse(re, im, suff);
        } else if (num.includes('+')) {
            // a + bi
            var aa = num.split('+')[0].split('').reverse();
            var bb = num.split('+')[1].split('i')[0].split('').reverse();
            var re = convSyntSngl(aa, mul, base);
            var im = convSyntSngl(bb.length == 0 ? ['1'] : bb, mul, base);
            return comParse(re, im, suff);
        } else {
            // bi
            var bb = num.split('i')[0].split('').reverse();
            var im = convSyntSngl(bb.length == 0 ? ['1'] : bb, mul, base);
            return comParse(base == 1 ? '' : '0', im, suff);
        }
    } else {
        if (num.includes('-')) {
            // -a
            var aa = num.split('-')[1].split('').reverse();
            var re = '-' + convSyntSngl(aa, mul, base);
            return comParse(re, base == 1 ? '' : '0', suff);
        } else {
            // a
            var aa = num.split('').reverse();
            var re = convSyntSngl(aa, mul, base);
            return comParse(re, base == 1 ? '' : '0', suff);
        }
    }
}

const Cell = (props) => {
    const { value, setValue, base, setMemory, repeat, setRepeat } = props;

    const handleClick = () => {
        if (repeat) {
            setMemory('')
            setRepeat(false);
        }
        switch (value) {
            case 'π':
                var val = '3.1415926535897932';
                setValue(convert(val, base));
                break;
            case 'e':
                var val = '2.7182818284590452';
                setValue(convert(val, base));
                break;
            case 'i':
                if (repeat) {
                    setValue('i');
                } else {
                    setValue(prev => (prev == '|' || prev == '0' || prev == '1' || prev == '0.' || prev == '1.' || prev == 'i' || prev == '-i') ? 'i' : (prev == '-1' || prev == '-1.') ? '-i' : prev.includes('i') ? prev : prev + 'i');
                }
                break;
            case '.':
                if (repeat) {
                    setValue('0.');
                } else {
                    setValue(prev => prev == '' ? '0.' : prev.includes('.') ? prev : prev == 'i' ? '1.i' : prev == '-i' ? '-1.i' : prev.includes('i') ? prev.split('i')[0] + '.i' : prev + '.');
                }
                break;
            default:
                if (repeat) {
                    setValue(value);
                } else {
                    setValue(prev => prev == '0' ? value : prev.includes('i') ? prev.split('i')[0] + value + 'i' : prev + value);
                }
                break;
        }
    }

    return <button className="cell7" onClick={handleClick}>{value}</button>;
};

const Op = (props) => {
    const { operation, value, setValue, setMemory, repeat, setRepeat } = props;

    const handleClick = () => {
        if (value != '') {
            if (repeat) {
                setMemory(prev => truncate(prev) + operation);
                setRepeat(false);
            } else {
                setMemory(value + operation);
            }
            setValue('');
        }
    }

    return <button className="ops" onClick={handleClick}>{operation}</button>;
};

const Eq = (props) => {
    const { relation, base, value, setValue, setBase, memory, setMemory, setRepeat } = props;

    const handleClick = () => {
        switch (relation) {
            case '=':
                if (memory != '') {
                    if (value == '') {
                        setValue(truncate(memory));
                    } else {
                        switch (memory.split('').reverse()[0]) {
                            case '+':
                                if (memory.includes('i')) {
                                    // complex
                                    if (value.includes('i')) {
                                        // value is imaginary
                                        if (memory.startsWith('-')) {
                                            // -a + bi, -a - bi, -bi
                                            if (memory.split('-').length > 2) {
                                                // -a - bi
                                                var aa = memory.split('-')[1].split('').reverse();
                                                var cc = memory.split('-')[2].split('i')[0].split('').reverse();
                                                if (value.startsWith('-')) {
                                                    // -c + di, -c - di, -di
                                                    if (value.split('-').length > 2) {
                                                        // -c - di
                                                        var bb = value.split('-')[1].split('').reverse();
                                                        var dd = value.split('-')[2].split('i')[0].split('').reverse();
                                                        var re = binaryRealAdd(aa, bb, base);
                                                        var im = binaryRealAdd(cc.length == 0 ? ['1'] : cc, dd.length == 0 ? ['1'] : dd, base);
                                                        setMemory(comParse('-' + re, '-' + im, '+'));
                                                    } else if (value.includes('+')) {
                                                        // -c + di
                                                        var bb = value.split('+')[0].split('-')[1].split('').reverse();
                                                        var dd = value.split('+')[1].split('i')[0].split('').reverse();
                                                        var re = binaryRealAdd(aa, bb, base);
                                                        var im = binaryRealSubtract(dd.length == 0 ? ['1'] : dd, cc.length == 0 ? ['1'] : cc, base);
                                                        setMemory(comParse('-' + re, im, '+'));
                                                    } else {
                                                        // -di
                                                        var dd = value.split('-')[1].split('i')[0].split('').reverse();
                                                        var re = memory.split('-')[1];
                                                        var im = binaryRealAdd(cc.length == 0 ? ['1'] : cc, dd.length == 0 ? ['1'] : dd, base);
                                                        setMemory(comParse('-' + re, '-' + im, '+'));
                                                    }
                                                } else if (value.includes('-')) {
                                                    // c - di
                                                    var bb = value.split('-')[0].split('').reverse();
                                                    var dd = value.split('-')[1].split('i')[0].split('').reverse();
                                                    var re = binaryRealSubtract(bb, aa, base);
                                                    var im = binaryRealAdd(cc.length == 0 ? ['1'] : cc, dd.length == 0 ? ['1'] : dd, base);
                                                    setMemory(comParse(re, '-' + im, '+'));
                                                } else if (value.includes('+')) {
                                                    // c + di
                                                    var bb = value.split('+')[0].split('').reverse();
                                                    var dd = value.split('+')[1].split('i')[0].split('').reverse();
                                                    var re = binaryRealSubtract(bb, aa, base);
                                                    var im = binaryRealSubtract(dd.length == 0 ? ['1'] : dd, cc.length == 0 ? ['1'] : cc, base);
                                                    setMemory(comParse(re, im, '+'));
                                                } else {
                                                    // di
                                                    var dd = value.split('i')[0].split('').reverse();
                                                    var re = memory.split('-')[1];
                                                    var im = binaryRealSubtract(dd.length == 0 ? ['1'] : dd, cc.length == 0 ? ['1'] : cc, base);
                                                    setMemory(comParse('-' + re, im, '+'));
                                                }
                                            } else if (memory.split('+').length > 2) {
                                                // -a + bi
                                                var aa = memory.split('+')[0].split('-')[1].split('').reverse();
                                                var cc = memory.split('+')[1].split('i')[0].split('').reverse();
                                                if (value.startsWith('-')) {
                                                    // -c + di, -c - di, -di
                                                    if (value.split('-').length > 2) {
                                                        // -c - di
                                                        var bb = value.split('-')[1].split('').reverse();
                                                        var dd = value.split('-')[2].split('i')[0].split('').reverse();
                                                        var re = binaryRealAdd(aa, bb, base);
                                                        var im = binaryRealSubtract(cc.length == 0 ? ['1'] : cc, dd.length == 0 ? ['1'] : dd, base);
                                                        setMemory(comParse('-' + re, im, '+'));
                                                    } else if (value.includes('+')) {
                                                        // -c + di
                                                        var bb = value.split('+')[0].split('-')[1].split('').reverse();
                                                        var dd = value.split('+')[1].split('i')[0].split('').reverse();
                                                        var re = binaryRealAdd(aa, bb, base);
                                                        var im = binaryRealAdd(cc.length == 0 ? ['1'] : cc, dd.length == 0 ? ['1'] : dd, base);
                                                        setMemory(comParse('-' + re, im, '+'));
                                                    } else {
                                                        // -di
                                                        var dd = value.split('-')[1].split('i')[0].split('').reverse();
                                                        var re = memory.split('+')[0];
                                                        var im = binaryRealSubtract(cc.length == 0 ? ['1'] : cc, dd.length == 0 ? ['1'] : dd, base);
                                                        setMemory(comParse(re, im, '+'));
                                                    }
                                                } else if (value.includes('-')) {
                                                    // c - di
                                                    var bb = value.split('-')[0].split('').reverse();
                                                    var dd = value.split('-')[1].split('i')[0].split('').reverse();
                                                    var re = binaryRealSubtract(bb, aa, base);
                                                    var im = binaryRealSubtract(cc.length == 0 ? ['1'] : cc, dd.length == 0 ? ['1'] : dd, base)
                                                    setMemory(comParse(re, im, '+'));
                                                } else if (value.includes('+')) {
                                                    // c + di
                                                    var bb = value.split('+')[0].split('').reverse();
                                                    var dd = value.split('+')[1].split('i')[0].split('').reverse();
                                                    var re = binaryRealSubtract(bb, aa, base);
                                                    var im = binaryRealAdd(cc.length == 0 ? ['1'] : cc, dd.length == 0 ? ['1'] : dd, base);
                                                    setMemory(comParse(re, im, '+'));
                                                } else {
                                                    // di
                                                    var dd = value.split('i')[0].split('').reverse();
                                                    var re = memory.split('+')[0];
                                                    var im = binaryRealAdd(cc.length == 0 ? ['1'] : cc, dd.length == 0 ? ['1'] : dd, base);
                                                    setMemory(comParse(re, im, '+'));
                                                }
                                            } else {
                                                // -bi
                                                var aa = memory.split('-')[1].split('i')[0].split('').reverse();
                                                if (value.startsWith('-')) {
                                                    // -c + di, -c - di, -di
                                                    if (value.split('-').length > 2) {
                                                        // -c - di
                                                        var bb = value.split('-')[2].split('i')[0].split('').reverse();
                                                        var re = value.split('-')[1];
                                                        var im = binaryRealAdd(aa.length == 0 ? ['1'] : aa, bb.length == 0 ? ['1'] : bb, base);
                                                        setMemory(comParse('-' + re, '-' + im, '+'));
                                                    } else if (value.includes('+')) {
                                                        // -c + di
                                                        var bb = value.split('+')[1].split('i')[0].split('').reverse();
                                                        var re = value.split('+')[0];
                                                        var im = binaryRealSubtract(bb.length == 0 ? ['1'] : bb, aa.length == 0 ? ['1'] : aa, base);
                                                        setMemory(comParse(re, im, '+'));
                                                    } else {
                                                        // -di
                                                        var bb = value.split('-')[1].split('i')[0].split('').reverse();
                                                        var im = binaryRealAdd(aa.length == 0 ? ['1'] : aa, bb.length == 0 ? ['1'] : bb, base);
                                                        setMemory(comParse(base == 1 ? '' : '0', '-' + im, '+'));
                                                    }
                                                } else if (value.includes('-')) {
                                                    // c - di
                                                    var bb = value.split('-')[1].split('i')[0].split('').reverse();
                                                    var re = value.split('-')[0];
                                                    var im = binaryRealAdd(aa.length == 0 ? ['1'] : aa, bb.length == 0 ? ['1'] : bb, base)
                                                    setMemory(comParse(re, '-' + im, '+'));
                                                } else if (value.includes('+')) {
                                                    // c + di
                                                    var bb = value.split('+')[1].split('i')[0].split('').reverse();
                                                    var re = value.split('+')[0];
                                                    var im = binaryRealSubtract(bb.length == 0 ? ['1'] : bb, aa.length == 0 ? ['1'] : aa, base);
                                                    setMemory(comParse(re, im, '+'));
                                                } else {
                                                    // di
                                                    var bb = value.split('i')[0].split('').reverse();
                                                    var im = binaryRealSubtract(bb.length == 0 ? ['1'] : bb, aa.length == 0 ? ['1'] : aa, base);
                                                    setMemory(comParse(base == 1 ? '' : '0', im, '+'));
                                                }
                                            }
                                        } else if (memory.includes('-')) {
                                            // a - bi
                                            var aa = memory.split('-')[0].split('').reverse();
                                            var cc = memory.split('-')[1].split('i')[0].split('').reverse();
                                            if (value.startsWith('-')) {
                                                // -c + di, -c - di, -di
                                                if (value.split('-').length > 2) {
                                                    // -c - di
                                                    var bb = value.split('-')[1].split('').reverse();
                                                    var dd = value.split('-')[2].split('i')[0].split('').reverse();
                                                    var re = binaryRealSubtract(aa, bb, base);
                                                    var im = binaryRealAdd(cc.length == 0 ? ['1'] : cc, dd.length == 0 ? ['1'] : dd, base);
                                                    setMemory(comParse(re, '-' + im, '+'));
                                                } else if (value.includes('+')) {
                                                    // -c + di
                                                    var bb = value.split('+')[0].split('-')[1].split('').reverse();
                                                    var dd = value.split('+')[1].split('i')[0].split('').reverse();
                                                    var re = binaryRealSubtract(aa, bb, base);
                                                    var im = binaryRealSubtract(dd.length == 0 ? ['1'] : dd, cc.length == 0 ? ['1'] : cc, base);
                                                    setMemory(comParse(re, im, '+'));
                                                } else {
                                                    // -di
                                                    var dd = value.split('-')[1].split('i')[0].split('').reverse();
                                                    var re = memory.split('-')[0];
                                                    var im = binaryRealAdd(cc.length == 0 ? ['1'] : cc, dd.length == 0 ? ['1'] : dd, base);
                                                    setMemory(comParse(re, '-' + im, '+'));
                                                }
                                            } else if (value.includes('-')) {
                                                // c - di
                                                var bb = value.split('-')[0].split('').reverse();
                                                var dd = value.split('-')[1].split('i')[0].split('').reverse();
                                                var re = binaryRealAdd(aa, bb, base);
                                                var im = binaryRealAdd(cc.length == 0 ? ['1'] : cc, dd.length == 0 ? ['1'] : dd, base);
                                                setMemory(comParse(re, '-' + im, '+'));
                                            } else if (value.includes('+')) {
                                                // c + di
                                                var bb = value.split('+')[0].split('').reverse();
                                                var dd = value.split('+')[1].split('i')[0].split('').reverse();
                                                var re = binaryRealAdd(aa, bb, base);
                                                var im = binaryRealSubtract(dd.length == 0 ? ['1'] : dd, cc.length == 0 ? ['1'] : cc, base);
                                                setMemory(comParse(re, im, '+'));
                                            } else {
                                                // di
                                                var dd = value.split('i')[0].split('').reverse();
                                                var re = memory.split('-')[0];
                                                var im = binaryRealSubtract(dd.length == 0 ? ['1'] : dd, cc.length == 0 ? ['1'] : cc, base);
                                                setMemory(comParse(re, im, '+'));
                                            }
                                        } else if (memory.split('+').length > 2) {
                                            // a + bi
                                            var aa = memory.split('+')[0].split('').reverse();
                                            var cc = memory.split('+')[1].split('i')[0].split('').reverse();
                                            if (value.startsWith('-')) {
                                                // -c + di, -c - di, -di
                                                if (value.split('-').length > 2) {
                                                    // -c - di
                                                    var bb = value.split('-')[1].split('').reverse();
                                                    var dd = value.split('-')[2].split('i')[0].split('').reverse();
                                                    var re = binaryRealSubtract(aa, bb, base);
                                                    var im = binaryRealSubtract(cc.length == 0 ? ['1'] : cc, dd.length == 0 ? ['1'] : dd, base);
                                                    setMemory(comParse(re, im, '+'));
                                                } else if (value.includes('+')) {
                                                    // -c + di
                                                    var bb = value.split('+')[0].split('-')[1].split('').reverse();
                                                    var dd = value.split('+')[1].split('i')[0].split('').reverse();
                                                    var re = binaryRealSubtract(aa, bb, base);
                                                    var im = binaryRealAdd(cc.length == 0 ? ['1'] : cc, dd.length == 0 ? ['1'] : dd, base);
                                                    setMemory(comParse(re, im, '+'));
                                                } else {
                                                    // -di
                                                    var dd = value.split('-')[1].split('i')[0].split('').reverse();
                                                    var re = memory.split('+')[0];
                                                    var im = binaryRealSubtract(cc.length == 0 ? ['1'] : cc, dd.length == 0 ? ['1'] : dd, base);
                                                    setMemory(comParse(re, im, '+'));
                                                }
                                            } else if (value.includes('-')) {
                                                // c - di
                                                var bb = value.split('-')[0].split('').reverse();
                                                var dd = value.split('-')[1].split('i')[0].split('').reverse();
                                                var re = binaryRealAdd(aa, bb, base);
                                                var im = binaryRealSubtract(cc.length == 0 ? ['1'] : cc, dd.length == 0 ? ['1'] : dd, base);
                                                setMemory(comParse(re, im, '+'));
                                            } else if (value.includes('+')) {
                                                // c + di
                                                var bb = value.split('+')[0].split('').reverse();
                                                var dd = value.split('+')[1].split('i')[0].split('').reverse();
                                                var re = binaryRealAdd(aa, bb, base);
                                                var im = binaryRealAdd(cc.length == 0 ? ['1'] : cc, dd.length == 0 ? ['1'] : dd, base);
                                                setMemory(comParse(re, im, '+'));
                                            } else {
                                                // di
                                                var dd = value.split('i')[0].split('').reverse();
                                                var re = memory.split('+')[0];
                                                var im = binaryRealAdd(cc.length == 0 ? ['1'] : cc, dd.length == 0 ? ['1'] : dd, base);
                                                setMemory(comParse(re, im, '+'));
                                            }
                                        } else {
                                            // bi
                                            var aa = memory.split('i')[0].split('').reverse();
                                            if (value.startsWith('-')) {
                                                // -c + di, -c - di, -di
                                                if (value.split('-').length > 2) {
                                                    // -c - di
                                                    var bb = value.split('-')[2].split('i')[0].split('').reverse();
                                                    var re = value.split('-')[1];
                                                    var im = binaryRealSubtract(aa.length == 0 ? ['1'] : aa, bb.length == 0 ? ['1'] : bb, base);
                                                    setMemory(comParse('-' + re, im, '+'));
                                                } else if (value.includes('+')) {
                                                    // -c + di
                                                    var bb = value.split('+')[1].split('i')[0].split('').reverse();
                                                    var re = value.split('+')[0];
                                                    var im = binaryRealAdd(aa.length == 0 ? ['1'] : aa, bb.length == 0 ? ['1'] : bb, base);
                                                    setMemory(comParse(re, im, '+'));
                                                } else {
                                                    // -di
                                                    var bb = value.split('-')[1].split('i')[0].split('').reverse();
                                                    var im = binaryRealSubtract(aa.length == 0 ? ['1'] : aa, bb.length == 0 ? ['1'] : bb, base);
                                                    setMemory(comParse(base == 1 ? '' : '0', im, '+'));
                                                }
                                            } else if (value.includes('-')) {
                                                // c - di
                                                var bb = value.split('-')[1].split('i')[0].split('').reverse();
                                                var re = value.split('-')[0];
                                                var im = binaryRealSubtract(aa.length == 0 ? ['1'] : aa, bb.length == 0 ? ['1'] : bb, base);
                                                setMemory(comParse(re, im, '+'));
                                            } else if (value.includes('+')) {
                                                // c + di
                                                var bb = value.split('+')[1].split('i')[0].split('').reverse();
                                                var re = value.split('+')[0];
                                                var im = binaryRealAdd(aa.length == 0 ? ['1'] : aa, bb.length == 0 ? ['1'] : bb, base);
                                                setMemory(comParse(re, im, '+'));
                                            } else {
                                                // di
                                                var bb = value.split('i')[0].split('').reverse();
                                                var im = binaryRealAdd(aa.length == 0 ? ['1'] : aa, bb.length == 0 ? ['1'] : bb, base)
                                                setMemory(comParse(base == 1 ? '' : '0', im, '+'));
                                            }
                                        }
                                    } else {
                                        // value is real
                                        if (memory.startsWith('-')) {
                                            // -a + bi, -a - bi, -bi
                                            if (memory.split('-').length > 2) {
                                                // -a - bi
                                                var aa = memory.split('-')[1].split('').reverse();
                                                if (value.includes('-')) {
                                                    setMemory('-' + binaryRealAdd(aa, value.split('-')[1].split('').reverse(), base) + '-' + memory.split('-')[2]);
                                                } else {
                                                    var bb = value.split('').reverse();
                                                    var re = binaryRealSubtract(bb, aa, base);
                                                    if (re == '0' || re == '') {
                                                        setMemory('-' + memory.split('-')[2]);
                                                    } else {
                                                        setMemory(re + '-' + memory.split('-')[2]);
                                                    }
                                                }
                                            } else if (memory.split('+').length > 2) {
                                                // -a + bi
                                                var aa = memory.split('+')[0].split('-')[1].split('').reverse();
                                                if (value.includes('-')) {
                                                    setMemory('-' + binaryRealAdd(aa, value.split('-')[1].split('').reverse(), base) + '+' + memory.split('+')[1] + '+');
                                                } else {
                                                    var bb = value.split('').reverse();
                                                    var re = binaryRealSubtract(bb, aa, base);
                                                    if (re == '0' || re == '') {
                                                        setMemory(memory.split('+')[1] + '+');
                                                    } else {
                                                        setMemory(re + '+' + memory.split('+')[1] + '+');
                                                    }
                                                }
                                            } else {
                                                // -bi
                                                if (value == '0') {
                                                    setMemory(memory);
                                                } else {
                                                    setMemory(value + memory);
                                                }
                                            }
                                        } else if (memory.includes('-')) {
                                            // a - bi
                                            var aa = memory.split('-')[0].split('').reverse();
                                            if (value.includes('-')) {
                                                var bb = value.split('-')[1].split('').reverse();
                                                var re = binaryRealSubtract(aa, bb, base);
                                                if (re == '0' || re == '') {
                                                    setMemory('-' + memory.split('-')[1]);
                                                } else {
                                                    setMemory(re + '-' + memory.split('-')[1]);
                                                }
                                            } else {
                                                setMemory(binaryRealAdd(aa, value.split('').reverse(), base) + '-' + memory.split('-')[1]);
                                            }
                                        } else if (memory.split('+').length > 2) {
                                            // a + bi
                                            var aa = memory.split('+')[0].split('').reverse();
                                            if (value.includes('-')) {
                                                var bb = value.split('-')[1].split('').reverse();
                                                var re = binaryRealSubtract(aa, bb, base);
                                                if (re == '0' || re == '') {
                                                    setMemory(memory.split('+')[1] + '+');
                                                } else {
                                                    setMemory(re + '+' + memory.split('+')[1] + '+');
                                                }
                                            } else {
                                                setMemory(binaryRealAdd(aa, value.split('').reverse(), base) + '+' + memory.split('+')[1] + '+');
                                            }
                                        } else {
                                            // bi
                                            if (value == '0') {
                                                setMemory(memory);
                                            } else {
                                                setMemory(value + '+' + memory);
                                            }
                                        }
                                    }
                                } else {
                                    if (value.includes('i')) {
                                        if (value.startsWith('-')) {
                                            // -c + di, -c - di, -di
                                            if (value.split('-').length > 2) {
                                                // -c - di
                                                var aa = value.split('-')[1].split('').reverse();
                                                if (memory.includes('-')) {
                                                    // -a - c - di
                                                    setMemory('-' + binaryRealAdd(memory.split('+')[0].split('-')[1].split('').reverse(), aa, base) + '-' + value.split('-')[2] + '+');
                                                } else {
                                                    // a - c - di
                                                    var bb = memory.split('+')[0].split('').reverse();
                                                    var re = binaryRealSubtract(bb, aa, base);
                                                    if (re == '0' || re == '') {
                                                        setMemory('-' + value.split('-')[2] + '+');
                                                    } else {
                                                        setMemory(re + '-' + value.split('-')[2] + '+');
                                                    }
                                                }
                                            } else if (value.split('-')[1].includes('+')) {
                                                // -c + di
                                                var aa = value.split('+')[0].split('-')[1].split('').reverse();
                                                if (memory.includes('-')) {
                                                    // -a - c + di
                                                    setMemory('-' + binaryRealAdd(memory.split('+')[0].split('-')[1].split('').reverse(), aa, base) + '+' + value.split('+')[1] + '+');
                                                } else {
                                                    // a - c + di
                                                    var bb = memory.split('+')[0].split('').reverse();
                                                    var re = binaryRealSubtract(bb, aa, base);
                                                    if (re == '0' || re == '') {
                                                        setMemory(value.split('+')[1] + '+');
                                                    } else {
                                                        setMemory(re + '+' + value.split('+')[1] + '+');
                                                    }
                                                }
                                            } else {
                                                // -di
                                                if (memory == '0+' || memory == '+') {
                                                    setMemory(value + '+');
                                                } else {
                                                    setMemory(memory.split('+')[0] + value + '+');
                                                }
                                            }
                                        } else if (value.includes('-')) {
                                            // c - di
                                            var aa = value.split('-')[0].split('').reverse();
                                            if (memory.includes('-')) {
                                                // -a + c - di
                                                var bb = memory.split('+')[0].split('-')[1].split('').reverse();
                                                var re = binaryRealSubtract(aa, bb, base);
                                                if (re == '0' || re == '') {
                                                    setMemory('-' + value.split('-')[1] + '+');
                                                } else {
                                                    setMemory(re + '-' + value.split('-')[1] + '+');
                                                }
                                            } else {
                                                // a + c - di
                                                setMemory(binaryRealAdd(memory.split('+')[0].split('').reverse(), aa, base) + '-' + value.split('-')[1] + '+');
                                            }
                                        } else if (value.includes('+')) {
                                            // c + di
                                            var aa = value.split('+')[0].split('').reverse();
                                            if (memory.includes('-')) {
                                                // -a + c + di
                                                var bb = memory.split('+')[0].split('-')[1].split('').reverse();
                                                var re = binaryRealSubtract(aa, bb, base);
                                                if (re == '0' || re == '') {
                                                    setMemory(value.split('+')[1] + '+');
                                                } else {
                                                    setMemory(re + '+' + value.split('+')[1] + '+');
                                                }
                                            } else {
                                                // a + c + di
                                                setMemory(binaryRealAdd(memory.split('+')[0].split('').reverse(), aa, base) + '+' + value.split('+')[1] + '+');
                                            }
                                        } else {
                                            // di
                                            if (memory == '0+' || memory == '+') {
                                                setMemory(value + '+');
                                            } else {
                                                setMemory(memory + value + '+');
                                            }
                                        }
                                    } else {
                                        if (memory.includes('-')) {
                                            var aa = memory.split('+')[0].split('-')[1].split('').reverse();
                                            if (value.includes('-')) {
                                                // negative + negative
                                                setMemory('-' + binaryRealAdd(aa, value.split('-')[1].split('').reverse(), base) + '+');
                                            } else {
                                                // negative + positive
                                                setMemory(binaryRealSubtract(value.split('').reverse(), aa, base) + '+');
                                            }
                                        } else {
                                            var aa = memory.split('+')[0].split('').reverse();
                                            if (value.includes('-')) {
                                                // positive + negative
                                                setMemory(binaryRealSubtract(aa, value.split('-')[1].split('').reverse(), base) + '+');
                                            } else {
                                                // positive + positive
                                                setMemory(binaryRealAdd(aa, value.split('').reverse(), base) + '+');
                                            }
                                        }
                                    }
                                }
                                break;
                            case '-':
                                if (memory.includes('i')) {
                                    // complex
                                    if (value.includes('i')) {
                                        // value is imaginary
                                        if (memory.startsWith('-')) {
                                            // -a + bi, -a - bi, -bi
                                            if (memory.split('-').length > 3) {
                                                // -a - bi
                                                var aa = memory.split('-')[1].split('').reverse();
                                                var cc = memory.split('-')[2].split('i')[0].split('').reverse();
                                                if (value.startsWith('-')) {
                                                    // -c + di, -c - di, -di
                                                    if (value.split('-').length > 2) {
                                                        // -c - di
                                                        var bb = value.split('-')[1].split('').reverse();
                                                        var dd = value.split('-')[2].split('i')[0].split('').reverse();
                                                        var re = binaryRealSubtract(bb, aa, base);
                                                        var im = binaryRealSubtract(dd.length == 0 ? ['1'] : dd, cc.length == 0 ? ['1'] : cc, base);
                                                        setMemory(comParse(re, im, '-'));
                                                    } else if (value.includes('+')) {
                                                        // -c + di
                                                        var bb = value.split('+')[0].split('-')[1].split('').reverse();
                                                        var dd = value.split('+')[1].split('i')[0].split('').reverse();
                                                        var re = binaryRealSubtract(bb, aa, base);
                                                        var im = binaryRealAdd(cc.length == 0 ? ['1'] : cc, dd.length == 0 ? ['1'] : dd, base);
                                                        setMemory(comParse(re, '-' + im, '-'));
                                                    } else {
                                                        // -di
                                                        var dd = value.split('-')[1].split('i')[0].split('').reverse();
                                                        var re = memory.split('-')[1];
                                                        var im = binaryRealSubtract(dd.length == 0 ? ['1'] : dd, cc.length == 0 ? ['1'] : cc, base);
                                                        setMemory(comParse('-' + re, im, '-'));
                                                    }
                                                } else if (value.includes('-')) {
                                                    // c - di
                                                    var bb = value.split('-')[0].split('').reverse();
                                                    var dd = value.split('-')[1].split('i')[0].split('').reverse();
                                                    var re = binaryRealAdd(aa, bb, base);
                                                    var im = binaryRealSubtract(dd.length == 0 ? ['1'] : dd, cc.length == 0 ? ['1'] : cc, base);
                                                    setMemory(comParse('-' + re, im, '-'));
                                                } else if (value.includes('+')) {
                                                    // c + di
                                                    var bb = value.split('+')[0].split('').reverse();
                                                    var dd = value.split('+')[1].split('i')[0].split('').reverse();
                                                    var re = binaryRealAdd(aa, bb, base);
                                                    var im = binaryRealAdd(cc.length == 0 ? ['1'] : cc, dd.length == 0 ? ['1'] : dd, base);
                                                    setMemory(comParse('-' + re, '-' + im, '-'));
                                                } else {
                                                    // di
                                                    var dd = value.split('i')[0].split('').reverse();
                                                    var re = memory.split('-')[1];
                                                    var im = binaryRealAdd(cc.length == 0 ? ['1'] : cc, dd.length == 0 ? ['1'] : dd, base);
                                                    setMemory(comParse('-' + re, '-' + im, '-'));
                                                }
                                            } else if (memory.includes('+')) {
                                                // -a + bi
                                                var aa = memory.split('+')[0].split('-')[1].split('').reverse();
                                                var cc = memory.split('+')[1].split('i')[0].split('').reverse();
                                                if (value.startsWith('-')) {
                                                    // -c + di, -c - di, -di
                                                    if (value.split('-').length > 2) {
                                                        // -c - di
                                                        var bb = value.split('-')[1].split('').reverse();
                                                        var dd = value.split('-')[2].split('i')[0].split('').reverse();
                                                        var re = binaryRealSubtract(bb, aa, base);
                                                        var im = binaryRealAdd(cc.length == 0 ? ['1'] : cc, dd.length == 0 ? ['1'] : dd, base);
                                                        setMemory(comParse(re, im, '-'));
                                                    } else if (value.includes('+')) {
                                                        // -c + di
                                                        var bb = value.split('+')[0].split('-')[1].split('').reverse();
                                                        var dd = value.split('+')[1].split('i')[0].split('').reverse();
                                                        var re = binaryRealSubtract(bb, aa, base);
                                                        var im = binaryRealSubtract(cc.length == 0 ? ['1'] : cc, dd.length == 0 ? ['1'] : dd, base);
                                                        setMemory(comParse(re, im, '-'));
                                                    } else {
                                                        // -di
                                                        var dd = value.split('-')[1].split('i')[0].split('').reverse();
                                                        var re = memory.split('+')[0];
                                                        var im = binaryRealAdd(cc.length == 0 ? ['1'] : cc, dd.length == 0 ? ['1'] : dd, base);
                                                        setMemory(comParse(re, im, '-'));
                                                    }
                                                } else if (value.includes('-')) {
                                                    // c - di
                                                    var bb = value.split('-')[0].split('').reverse();
                                                    var dd = value.split('-')[1].split('i')[0].split('').reverse();
                                                    var re = binaryRealAdd(aa, bb, base);
                                                    var im = binaryRealAdd(cc.length == 0 ? ['1'] : cc, dd.length == 0 ? ['1'] : dd, base);
                                                    setMemory(comParse('-' + re, im, '-'));
                                                } else if (value.includes('+')) {
                                                    // c + di
                                                    var bb = value.split('+')[0].split('').reverse();
                                                    var dd = value.split('+')[1].split('i')[0].split('').reverse();
                                                    var re = binaryRealAdd(aa, bb, base);
                                                    var im = binaryRealSubtract(cc.length == 0 ? ['1'] : cc, dd.length == 0 ? ['1'] : dd, base);
                                                    setMemory(comParse('-' + re, im, '-'));
                                                } else {
                                                    // di
                                                    var dd = value.split('i')[0].split('').reverse();
                                                    var re = memory.split('+')[0];
                                                    var im = binaryRealSubtract(cc.length == 0 ? ['1'] : cc, dd.length == 0 ? ['1'] : dd, base);
                                                    setMemory(comParse(re, im, '-'));
                                                }
                                            } else {
                                                // -bi
                                                var aa = memory.split('-')[1].split('i')[0].split('').reverse();
                                                if (value.startsWith('-')) {
                                                    // -c + di, -c - di, -di
                                                    if (value.split('-').length > 2) {
                                                        // -c - di
                                                        var bb = value.split('-')[2].split('i')[0].split('').reverse();
                                                        var re = value.split('-')[1];
                                                        var im = binaryRealSubtract(bb.length == 0 ? ['1'] : bb, aa.length == 0 ? ['1'] : aa, base);
                                                        setMemory(comParse(re, im, '-'));
                                                    } else if (value.includes('+')) {
                                                        // -c + di
                                                        var bb = value.split('+')[1].split('i')[0].split('').reverse();
                                                        var re = value.split('+')[0].split('-')[1];
                                                        var im = binaryRealAdd(aa.length == 0 ? ['1'] : aa, bb.length == 0 ? ['1'] : bb, base);
                                                        setMemory(comParse(re, '-' + im, '-'));
                                                    } else {
                                                        // -di
                                                        var bb = value.split('-')[1].split('i')[0].split('').reverse();
                                                        var im = binaryRealSubtract(bb.length == 0 ? ['1'] : bb, aa.length == 0 ? ['1'] : aa, base)
                                                        setMemory(comParse(base == 1 ? '' : '0', im, '-'));
                                                    }
                                                } else if (value.includes('-')) {
                                                    // c - di
                                                    var bb = value.split('-')[1].split('i')[0].split('').reverse();
                                                    var re = value.split('-')[0];
                                                    var im = binaryRealSubtract(bb.length == 0 ? ['1'] : bb, aa.length == 0 ? ['1'] : aa, base);
                                                    setMemory(comParse('-' + re, im, '-'));
                                                } else if (value.includes('+')) {
                                                    // c + di
                                                    var bb = value.split('+')[1].split('i')[0].split('').reverse();
                                                    var re = value.split('+')[0];
                                                    var im = binaryRealAdd(aa.length == 0 ? ['1'] : aa, bb.length == 0 ? ['1'] : bb, base);
                                                    setMemory(comParse('-' + re, '-' + im, '-'));
                                                } else {
                                                    // di
                                                    var bb = value.split('i')[0].split('').reverse();
                                                    var im = binaryRealAdd(aa.length == 0 ? ['1'] : aa, bb.length == 0 ? ['1'] : bb, base);
                                                    setMemory(comParse(base == 1 ? '' : '0', '-' + im, '-'));
                                                }
                                            }
                                        } else if (memory.split('-').length > 2) {
                                            // a - bi
                                            var aa = memory.split('-')[0].split('').reverse();
                                            var cc = memory.split('-')[1].split('i')[0].split('').reverse();
                                            if (value.startsWith('-')) {
                                                // -c + di, -c - di, -di
                                                if (value.split('-').length > 2) {
                                                    // -c - di
                                                    var bb = value.split('-')[1].split('').reverse();
                                                    var dd = value.split('-')[2].split('i')[0].split('').reverse();
                                                    var re = binaryRealAdd(aa, bb, base);
                                                    var im = binaryRealSubtract(dd.length == 0 ? ['1'] : dd, cc.length == 0 ? ['1'] : cc, base);
                                                    setMemory(comParse(re, im, '-'));
                                                } else if (value.includes('+')) {
                                                    // -c + di
                                                    var bb = value.split('+')[0].split('-')[1].split('').reverse();
                                                    var dd = value.split('+')[1].split('i')[0].split('').reverse();
                                                    var re = binaryRealAdd(aa, bb, base);
                                                    var im = binaryRealAdd(cc.length == 0 ? ['1'] : cc, dd.length == 0 ? ['1'] : dd, base);
                                                    setMemory(comParse(re, '-' + im, '-'));
                                                } else {
                                                    // -di
                                                    var dd = value.split('-')[1].split('i')[0].split('').reverse();
                                                    var re = memory.split('-')[0];
                                                    var im = binaryRealAdd(dd.length == 0 ? ['1'] : dd, cc.length == 0 ? ['1'] : cc, base);
                                                    setMemory(comParse(re, im, '-'));
                                                }
                                            } else if (value.includes('-')) {
                                                // c - di
                                                var bb = value.split('-')[0].split('').reverse();
                                                var dd = value.split('-')[1].split('i')[0].split('').reverse();
                                                var re = binaryRealSubtract(aa, bb, base);
                                                var im = binaryRealSubtract(dd.length == 0 ? ['1'] : dd, cc.length == 0 ? ['1'] : cc, base);
                                                setMemory(comParse(re, im, '-'));
                                            } else if (value.includes('+')) {
                                                // c + di
                                                var bb = value.split('+')[0].split('').reverse();
                                                var dd = value.split('+')[1].split('i')[0].split('').reverse();
                                                var re = binaryRealSubtract(aa, bb, base);
                                                var im = binaryRealAdd(cc.length == 0 ? ['1'] : cc, dd.length == 0 ? ['1'] : dd, base);
                                                setMemory(comParse(re, '-' + im, '-'));
                                            } else {
                                                // di
                                                var dd = value.split('i')[0].split('').reverse();
                                                var re = memory.split('-')[0];
                                                var im = binaryRealAdd(cc.length == 0 ? ['1'] : cc, dd.length == 0 ? ['1'] : dd, base);
                                                setMemory(comParse(re, '-' + im, '-'));
                                            }
                                        } else if (memory.includes('+')) {
                                            // a + bi
                                            var aa = memory.split('+')[0].split('').reverse();
                                            var cc = memory.split('+')[1].split('i')[0].split('').reverse();
                                            if (value.startsWith('-')) {
                                                // -c + di, -c - di, -di
                                                if (value.split('-').length > 2) {
                                                    // -c - di
                                                    var bb = value.split('-')[1].split('').reverse();
                                                    var dd = value.split('-')[2].split('i')[0].split('').reverse();
                                                    var re = binaryRealAdd(aa, bb, base);
                                                    var im = binaryRealAdd(cc.length == 0 ? ['1'] : cc, dd.length == 0 ? ['1'] : dd, base);
                                                    setMemory(comParse(re, im, '-'));
                                                } else if (value.includes('+')) {
                                                    // -c + di
                                                    var bb = value.split('+')[0].split('-')[1].split('').reverse();
                                                    var dd = value.split('+')[1].split('i')[0].split('').reverse();
                                                    var re = binaryRealAdd(aa, bb, base);
                                                    var im = binaryRealSubtract(cc.length == 0 ? ['1'] : cc, dd.length == 0 ? ['1'] : dd, base);
                                                    setMemory(comParse(re, im, '-'));
                                                } else {
                                                    // -di
                                                    var dd = value.split('-')[1].split('i')[0].split('').reverse();
                                                    var re = memory.split('+')[0];
                                                    var im = binaryRealAdd(cc.length == 0 ? ['1'] : cc, dd.length == 0 ? ['1'] : dd, base);
                                                    setMemory(comParse(re, im, '-'));
                                                }
                                            } else if (value.includes('-')) {
                                                // c - di
                                                var bb = value.split('-')[0].split('').reverse();
                                                var dd = value.split('-')[1].split('i')[0].split('').reverse();
                                                var re = binaryRealSubtract(aa, bb, base);
                                                var im = binaryRealAdd(cc.length == 0 ? ['1'] : cc, dd.length == 0 ? ['1'] : dd, base);
                                                setMemory(comParse(re, im, '-'));
                                            } else if (value.includes('+')) {
                                                // c + di
                                                var bb = value.split('+')[0].split('').reverse();
                                                var dd = value.split('+')[1].split('i')[0].split('').reverse();
                                                var re = binaryRealSubtract(aa, bb, base);
                                                var im = binaryRealSubtract(cc.length == 0 ? ['1'] : cc, dd.length == 0 ? ['1'] : dd, base);
                                                setMemory(comParse(re, im, '-'));
                                            } else {
                                                // di
                                                var dd = value.split('i')[0].split('').reverse();
                                                var re = memory.split('+')[0];
                                                var im = binaryRealSubtract(cc.length == 0 ? ['1'] : cc, dd.length == 0 ? ['1'] : dd, base);
                                                setMemory(comParse(re, im, '-'));
                                            }
                                        } else {
                                            // bi
                                            var aa = memory.split('i')[0].split('').reverse();
                                            if (value.startsWith('-')) {
                                                // -c + di, -c - di, -di
                                                if (value.split('-').length > 2) {
                                                    // -c - di
                                                    var bb = value.split('-')[2].split('i')[0].split('').reverse();
                                                    var re = value.split('-')[1];
                                                    var im = binaryRealAdd(aa.length == 0 ? ['1'] : aa, bb.length == 0 ? ['1'] : bb, base);
                                                    setMemory(comParse(re, im, '-'));
                                                } else if (value.includes('+')) {
                                                    // -c + di
                                                    var bb = value.split('+')[1].split('i')[0].split('').reverse();
                                                    var re = value.split('+')[0].split('-')[1];
                                                    var im = binaryRealSubtract(aa.length == 0 ? ['1'] : aa, bb.length == 0 ? ['1'] : bb, base);
                                                    setMemory(comParse(re, im, '-'));
                                                } else {
                                                    // -di
                                                    var bb = value.split('-')[1].split('i')[0].split('').reverse();
                                                    var im = binaryRealAdd(aa.length == 0 ? ['1'] : aa, bb.length == 0 ? ['1'] : bb, base);
                                                    setMemory(comParse(base == 1 ? '' : '0', im, '-'));
                                                }
                                            } else if (value.includes('-')) {
                                                // c - di
                                                var bb = value.split('-')[1].split('i')[0].split('').reverse();
                                                var re = value.split('-')[0];
                                                var im = binaryRealAdd(aa.length == 0 ? ['1'] : aa, bb.length == 0 ? ['1'] : bb, base);
                                                setMemory(comParse('-' + re, im, '-'));
                                            } else if (value.includes('+')) {
                                                // c + di
                                                var bb = value.split('+')[1].split('i')[0].split('').reverse();
                                                var re = value.split('+')[0];
                                                var im = binaryRealSubtract(aa.length == 0 ? ['1'] : aa, bb.length == 0 ? ['1'] : bb, base);
                                                setMemory(comParse('-' + re, im, '-'));
                                            } else {
                                                // di
                                                var bb = value.split('i')[0].split('').reverse();
                                                var im = binaryRealSubtract(aa.length == 0 ? ['1'] : aa, bb.length == 0 ? ['1'] : bb, base);
                                                setMemory(comParse(base == 1 ? '' : '0', im, '-'));
                                            }
                                        }
                                    } else {
                                        // value is real
                                        if (memory.startsWith('-')) {
                                            // -a + bi, -a - bi, -bi
                                            if (memory.split('-').length > 3) {
                                                // -a - bi
                                                var aa = memory.split('-')[1].split('').reverse();
                                                if (value.includes('-')) {
                                                    var bb = value.split('-')[1].split('').reverse();
                                                    var re = binaryRealSubtract(bb, aa, base);
                                                    if (re == '0' || re == '') {
                                                        setMemory('-' + memory.split('-')[2] + '-');
                                                    } else {
                                                        setMemory(re + '-' + memory.split('-')[2] + '-');
                                                    }
                                                } else {
                                                    setMemory('-' + binaryRealAdd(aa, value.split('').reverse(), base) + '-' + memory.split('-')[2] + '-');
                                                }
                                            } else if (memory.includes('+')) {
                                                // -a + bi
                                                var aa = memory.split('+')[0].split('-')[1].split('').reverse();
                                                if (value.includes('-')) {
                                                    var bb = value.split('-')[1].split('').reverse();
                                                    var re = binaryRealSubtract(bb, aa, base);
                                                    if (re == '0' || re == '') {
                                                        setMemory(memory.split('+')[1]);
                                                    } else {
                                                        setMemory(re + '+' + memory.split('+')[1]);
                                                    }
                                                } else {
                                                    setMemory('-' + binaryRealAdd(aa, value.split('').reverse(), base) + '+' + memory.split('+')[1]);
                                                }
                                            } else {
                                                // -bi
                                                if (value == '0') {
                                                    setMemory(memory);
                                                } else {
                                                    if (value.startsWith('-')) {
                                                        setMemory(value + memory);
                                                    } else {
                                                        setMemory('-' + value + memory);
                                                    }
                                                }
                                            }
                                        } else if (memory.split('-').length > 2) {
                                            // a - bi
                                            var aa = memory.split('-')[0].split('').reverse();
                                            if (value.includes('-')) {
                                                setMemory(binaryRealAdd(aa, value.split('-')[1].split('').reverse(), base) + '-' + memory.split('-')[1] + '-');
                                            } else {
                                                var bb = value.split('').reverse();
                                                var re = binaryRealSubtract(aa, bb, base);
                                                if (re == '0' || re == '') {
                                                    setMemory('-' + memory.split('-')[1] + '-');
                                                } else {
                                                    setMemory(re + '-' + memory.split('-')[1] + '-');
                                                }
                                            }
                                        } else if (memory.includes('+')) {
                                            // a + bi
                                            var aa = memory.split('+')[0].split('').reverse();
                                            if (value.includes('-')) {
                                                setMemory(binaryRealAdd(aa, value.split('-')[1].split('').reverse(), base) + '+' + memory.split('+')[1]);
                                            } else {
                                                var bb = value.split('').reverse();
                                                var re = binaryRealSubtract(aa, bb, base);
                                                if (re == '0' || re == '') {
                                                    setMemory(memory.split('+')[1]);
                                                } else {
                                                    setMemory(re + '+' + memory.split('+')[1]);
                                                }
                                            }
                                        } else {
                                            // bi
                                            if (value == '0') {
                                                setMemory(memory);
                                            } else {
                                                if (value.startsWith('-')) {
                                                    setMemory(value + '+' + memory);
                                                } else {
                                                    setMemory('-' + value + '+' + memory);
                                                }
                                            }
                                        }
                                    }
                                } else {
                                    if (value.includes('i')) {
                                        if (value.startsWith('-')) {
                                            // -c + di, -c - di, -di
                                            if (value.split('-').length > 2) {
                                                // -c - di
                                                var aa = value.split('-')[1].split('').reverse();
                                                if (memory.startsWith('-')) {
                                                    // -a + c + di
                                                    var bb = memory.split('-')[1].split('').reverse();
                                                    var re = binaryRealSubtract(aa, bb, base);
                                                    if (re == '0' || re == '') {
                                                        setMemory(value.split('-')[2] + '-');
                                                    } else {
                                                        setMemory(re + '+' + value.split('-')[2] + '-');
                                                    }
                                                } else {
                                                    // a + c + di
                                                    setMemory(binaryRealAdd(memory.split('-')[0].split('').reverse(), aa, base) + '+' + value.split('-')[2] + '-');
                                                }
                                            } else if (value.split('-')[1].includes('+')) {
                                                // -c + di
                                                var aa = value.split('+')[0].split('-')[1].split('').reverse();
                                                if (memory.startsWith('-')) {
                                                    // -a + c - di
                                                    var bb = memory.split('-')[1].split('').reverse();
                                                    var re = binaryRealSubtract(aa, bb, base);
                                                    if (re == '0' || re == '') {
                                                        setMemory('-' + value.split('+')[1] + '-');
                                                    } else {
                                                        setMemory(re + '-' + value.split('+')[1] + '-');
                                                    }
                                                } else {
                                                    // a + c - di
                                                    setMemory(binaryRealAdd(memory.split('-')[0].split('').reverse(), aa, base) + '-' + value.split('+')[1] + '-');
                                                }
                                            } else {
                                                // -di
                                                if (memory == '0-' || memory == '-') {
                                                    setMemory(value.split('-')[1] + '-');
                                                } else {
                                                    if (memory.startsWith('-')) {
                                                        // negative real - negative imaginary
                                                        setMemory('-' + memory.split('-')[1] + '+' + value.split('-')[1] + '-');
                                                    } else {
                                                        // positive real - negative imaginary
                                                        setMemory(memory.split('-')[0] + '+' + value.split('-')[1] + '-');
                                                    }
                                                }
                                            }
                                        } else if (value.includes('-')) {
                                            // c - di
                                            var aa = value.split('-')[0].split('').reverse();
                                            if (memory.startsWith('-')) {
                                                // -a - c + di
                                                setMemory('-' + binaryRealAdd(memory.split('-')[1].split('').reverse(), aa, base) + '+' + value.split('-')[1] + '-');
                                            } else {
                                                // a - c + di
                                                var bb = memory.split('-')[0].split('').reverse();
                                                var re = binaryRealSubtract(bb, aa, base);
                                                if (re == '0' || re == '') {
                                                    setMemory(value.split('-')[1] + '-');
                                                } else {
                                                    setMemory(re + '+' + value.split('-')[1] + '-');
                                                }
                                            }
                                        } else if (value.includes('+')) {
                                            // c + di
                                            var aa = value.split('+')[0].split('').reverse();
                                            if (memory.startsWith('-')) {
                                                // -a - c - di
                                                setMemory('-' + binaryRealAdd(memory.split('-')[1].split('').reverse(), aa, base) + '-' + value.split('+')[1] + '-');
                                            } else {
                                                // a - c - di
                                                var bb = memory.split('-')[0].split('').reverse();
                                                var re = binaryRealSubtract(bb, aa, base);
                                                if (re == '0' || re == '') {
                                                    setMemory('-' + value.split('+')[1] + '-');
                                                } else {
                                                    setMemory(re + '-' + value.split('+')[1] + '-');
                                                }
                                            }
                                        } else {
                                            // di
                                            if (memory == '0-' || memory == '-') {
                                                setMemory('-' + value + '-');
                                            } else {
                                                setMemory(memory + value + '-');
                                            }
                                        }
                                    } else {
                                        if (memory.startsWith('-')) {
                                            var aa = memory.split('-')[1].split('').reverse();
                                            if (value.includes('-')) {
                                                // negative - negative
                                                setMemory(binaryRealSubtract(value.split('-')[1].split('').reverse(), aa, base) + '-');
                                            } else {
                                                // negative - positive
                                                setMemory('-' + binaryRealAdd(aa, value.split('').reverse(), base) + '-');
                                            }
                                        } else {
                                            var aa = memory.split('-')[0].split('').reverse()
                                            if (value.includes('-')) {
                                                // positive - negative
                                                setMemory(binaryRealAdd(aa, value.split('-')[1].split('').reverse(), base) + '-');
                                            } else {
                                                // positive - positive
                                                setMemory(binaryRealSubtract(aa, value.split('').reverse(), base) + '-');
                                            }
                                        }
                                    }
                                }
                                break;
                            case '*':
                                if (memory.includes('i')) {
                                    // complex
                                    if (value.includes('i')) {
                                        // value is imaginary
                                        if (memory.startsWith('-')) {
                                            // -a + bi, -a - bi, -bi
                                            if (memory.split('-').length > 2) {
                                                // -a - bi
                                                var aa = memory.split('-')[1].split('').reverse();
                                                var cc = memory.split('-')[2].split('i')[0].split('').reverse();
                                                if (value.startsWith('-')) {
                                                    // -c + di, -c - di, -di
                                                    if (value.split('-').length > 2) {
                                                        // -c - di
                                                        var bb = value.split('-')[1].split('').reverse();
                                                        var dd = value.split('-')[2].split('i')[0].split('').reverse();
                                                        var re = binaryRealSubtract(binaryRealMultiply(aa, bb, base).split('').reverse(), binaryRealMultiply(cc.length == 0 ? ['1'] : cc, dd.length == 0 ? ['1'] : dd, base).split('').reverse(), base);
                                                        var im = binaryRealAdd(binaryRealMultiply(aa, dd.length == 0 ? ['1'] : dd, base).split('').reverse(), binaryRealMultiply(bb, cc.length == 0 ? ['1'] : cc, base).split('').reverse(), base);
                                                        setMemory(comParse(re, im, '*'));
                                                    } else if (value.includes('+')) {
                                                        // -c + di
                                                        var bb = value.split('+')[0].split('-')[1].split('').reverse();
                                                        var dd = value.split('+')[1].split('i')[0].split('').reverse();
                                                        var re = binaryRealAdd(binaryRealMultiply(aa, bb, base).split('').reverse(), binaryRealMultiply(cc.length == 0 ? ['1'] : cc, dd.length == 0 ? ['1'] : dd, base).split('').reverse(), base);
                                                        var im = binaryRealSubtract(binaryRealMultiply(bb, cc.length == 0 ? ['1'] : cc, base).split('').reverse(), binaryRealMultiply(aa, dd.length == 0 ? ['1'] : dd, base).split('').reverse(), base);
                                                        setMemory(comParse(re, im, '*'));
                                                    } else {
                                                        // -di
                                                        var dd = value.split('-')[1].split('i')[0].split('').reverse();
                                                        var re = binaryRealMultiply(cc.length == 0 ? ['1'] : cc, dd.length == 0 ? ['1'] : dd, base);
                                                        var im = binaryRealMultiply(aa, dd.length == 0 ? ['1'] : dd, base);
                                                        setMemory(comParse('-' + re, im, '*'));
                                                    }
                                                } else if (value.includes('-')) {
                                                    // c - di
                                                    var bb = value.split('-')[0].split('').reverse();
                                                    var dd = value.split('-')[1].split('i')[0].split('').reverse();
                                                    var re = binaryRealAdd(binaryRealMultiply(aa, bb, base).split('').reverse(), binaryRealMultiply(cc.length == 0 ? ['1'] : cc, dd.length == 0 ? ['1'] : dd, base).split('').reverse(), base);
                                                    var im = binaryRealSubtract(binaryRealMultiply(aa, dd.length == 0 ? ['1'] : dd, base).split('').reverse(), binaryRealMultiply(bb, cc.length == 0 ? ['1'] : cc, base).split('').reverse(), base);
                                                    setMemory(comParse('-' + re, im, '*'));
                                                } else if (value.includes('+')) {
                                                    // c + di
                                                    var bb = value.split('+')[0].split('').reverse();
                                                    var dd = value.split('+')[1].split('i')[0].split('').reverse();
                                                    var re = binaryRealSubtract(binaryRealMultiply(cc.length == 0 ? ['1'] : cc, dd.length == 0 ? ['1'] : dd, base).split('').reverse(), binaryRealMultiply(aa, bb, base).split('').reverse(), base);
                                                    var im = binaryRealAdd(binaryRealMultiply(aa, dd.length == 0 ? ['1'] : dd, base).split('').reverse(), binaryRealMultiply(bb, cc.length == 0 ? ['1'] : cc, base).split('').reverse(), base);
                                                    setMemory(comParse(re, '-' + im, '*'));
                                                } else {
                                                    // di
                                                    var dd = value.split('i')[0].split('').reverse();
                                                    var re = binaryRealMultiply(cc.length == 0 ? ['1'] : cc, dd.length == 0 ? ['1'] : dd, base);
                                                    var im = binaryRealMultiply(aa, dd.length == 0 ? ['1'] : dd, base);
                                                    setMemory(comParse(re, '-' + im, '*'));
                                                }
                                            } else if (memory.includes('+')) {
                                                // -a + bi
                                                var aa = memory.split('+')[0].split('-')[1].split('').reverse();
                                                var cc = memory.split('+')[1].split('i')[0].split('').reverse();
                                                if (value.startsWith('-')) {
                                                    // -c + di, -c - di, -di
                                                    if (value.split('-').length > 2) {
                                                        // -c - di
                                                        var bb = value.split('-')[1].split('').reverse();
                                                        var dd = value.split('-')[2].split('i')[0].split('').reverse();
                                                        var re = binaryRealAdd(binaryRealMultiply(aa, bb, base).split('').reverse(), binaryRealMultiply(cc.length == 0 ? ['1'] : cc, dd.length == 0 ? ['1'] : dd, base).split('').reverse(), base);
                                                        var im = binaryRealSubtract(binaryRealMultiply(aa, dd.length == 0 ? ['1'] : dd, base).split('').reverse(), binaryRealMultiply(bb, cc.length == 0 ? ['1'] : cc, base).split('').reverse(), base);
                                                        setMemory(comParse(re, im, '*'));
                                                    } else if (value.includes('+')) {
                                                        // -c + di
                                                        var bb = value.split('+')[0].split('-')[1].split('').reverse();
                                                        var dd = value.split('+')[1].split('i')[0].split('').reverse();
                                                        var re = binaryRealSubtract(binaryRealMultiply(aa, bb, base).split('').reverse(), binaryRealMultiply(cc.length == 0 ? ['1'] : cc, dd.length == 0 ? ['1'] : dd, base).split('').reverse(), base);
                                                        var im = binaryRealAdd(binaryRealMultiply(aa, dd.length == 0 ? ['1'] : dd, base).split('').reverse(), binaryRealMultiply(bb, cc.length == 0 ? ['1'] : cc, base).split('').reverse(), base);
                                                        setMemory(comParse(re, '-' + im, '*'));
                                                    } else {
                                                        // -di
                                                        var dd = value.split('-')[1].split('i')[0].split('').reverse();
                                                        var re = binaryRealMultiply(cc.length == 0 ? ['1'] : cc, dd.length == 0 ? ['1'] : dd, base);
                                                        var im = binaryRealMultiply(aa, dd.length == 0 ? ['1'] : dd, base);
                                                        setMemory(comParse(re, im, '*'));
                                                    }
                                                } else if (value.includes('-')) {
                                                    // c - di
                                                    var bb = value.split('-')[0].split('').reverse();
                                                    var dd = value.split('-')[1].split('i')[0].split('').reverse();
                                                    var re = binaryRealSubtract(binaryRealMultiply(cc.length == 0 ? ['1'] : cc, dd.length == 0 ? ['1'] : dd, base).split('').reverse(), binaryRealMultiply(aa, bb, base).split('').reverse(), base);
                                                    var im = binaryRealAdd(binaryRealMultiply(aa, dd.length == 0 ? ['1'] : dd, base).split('').reverse(), binaryRealMultiply(bb, cc.length == 0 ? ['1'] : cc, base).split('').reverse(), base);
                                                    setMemory(comParse(re, im, '*'));
                                                } else if (value.includes('+')) {
                                                    // c + di
                                                    var bb = value.split('+')[0].split('').reverse();
                                                    var dd = value.split('+')[1].split('i')[0].split('').reverse();
                                                    var re = binaryRealAdd(binaryRealMultiply(aa, bb, base).split('').reverse(), binaryRealMultiply(cc.length == 0 ? ['1'] : cc, dd.length == 0 ? ['1'] : dd, base).split('').reverse(), base);
                                                    var im = binaryRealSubtract(binaryRealMultiply(bb, cc.length == 0 ? ['1'] : cc, base).split('').reverse(), binaryRealMultiply(aa, dd.length == 0 ? ['1'] : dd, base).split('').reverse(), base);
                                                    setMemory(comParse('-' + re, im, '*'));
                                                } else {
                                                    // di
                                                    var dd = value.split('i')[0].split('').reverse();
                                                    var re = binaryRealMultiply(cc.length == 0 ? ['1'] : cc, dd.length == 0 ? ['1'] : dd, base);
                                                    var im = binaryRealMultiply(aa, dd.length == 0 ? ['1'] : dd, base);
                                                    setMemory(comParse('-' + re, '-' + im, '*'));
                                                }
                                            } else {
                                                // -bi
                                                var aa = memory.split('-')[1].split('i')[0].split('').reverse();
                                                if (value.startsWith('-')) {
                                                    // -c + di, -c - di, -di
                                                    if (value.split('-').length > 2) {
                                                        // -c - di
                                                        var bb = value.split('-')[1].split('').reverse();
                                                        var cc = value.split('-')[2].split('i')[0].split('').reverse();
                                                        var re = binaryRealMultiply(aa.length == 0 ? ['1'] : aa, cc.length == 0 ? ['1'] : cc, base);
                                                        var im = binaryRealMultiply(aa.length == 0 ? ['1'] : aa, bb, base);
                                                        setMemory(comParse('-' + re, im, '*'));
                                                    } else if (value.includes('+')) {
                                                        // -c + di
                                                        var bb = value.split('+')[0].split('-')[1].split('').reverse();
                                                        var cc = value.split('+')[1].split('i')[0].split('').reverse();
                                                        var re = binaryRealMultiply(aa.length == 0 ? ['1'] : aa, cc.length == 0 ? ['1'] : cc, base);
                                                        var im = binaryRealMultiply(aa.length == 0 ? ['1'] : aa, bb, base);
                                                        setMemory(comParse(re, im, '*'));
                                                    } else {
                                                        // -di
                                                        var bb = value.split('-')[1].split('i')[0].split('').reverse();
                                                        var re = binaryRealMultiply(aa.length == 0 ? ['1'] : aa, bb.length == 0 ? ['1'] : bb, base);
                                                        setMemory(comParse('-' + re, base == 1 ? '' : '0', '*'));
                                                    }
                                                } else if (value.includes('-')) {
                                                    // c - di
                                                    var bb = value.split('-')[0].split('').reverse();
                                                    var cc = value.split('-')[1].split('i')[0].split('').reverse();
                                                    var re = binaryRealMultiply(aa.length == 0 ? ['1'] : aa, cc.length == 0 ? ['1'] : cc, base);
                                                    var im = binaryRealMultiply(aa.length == 0 ? ['1'] : aa, bb, base);
                                                    setMemory(comParse('-' + re, '-' + im, '*'));
                                                } else if (value.includes('+')) {
                                                    // c + di
                                                    var bb = value.split('+')[0].split('').reverse();
                                                    var cc = value.split('+')[1].split('i')[0].split('').reverse();
                                                    var re = binaryRealMultiply(aa.length == 0 ? ['1'] : aa, cc.length == 0 ? ['1'] : cc, base);
                                                    var im = binaryRealMultiply(aa.length == 0 ? ['1'] : aa, bb, base);
                                                    setMemory(comParse(re, '-' + im, '*'));
                                                } else {
                                                    // di
                                                    var bb = value.split('i')[0].split('').reverse();
                                                    var re = binaryRealMultiply(aa.length == 0 ? ['1'] : aa, bb.length == 0 ? ['1'] : bb, base);
                                                    setMemory(comParse(re, base == 1 ? '' : '0', '*'));
                                                }
                                            }
                                        } else if (memory.includes('-')) {
                                            // a - bi
                                            var aa = memory.split('-')[0].split('').reverse();
                                            var cc = memory.split('-')[1].split('i')[0].split('').reverse();
                                            if (value.startsWith('-')) {
                                                // -c + di, -c - di, -di
                                                if (value.split('-').length > 2) {
                                                    // -c - di
                                                    var bb = value.split('-')[1].split('').reverse();
                                                    var dd = value.split('-')[2].split('i')[0].split('').reverse();
                                                    var re = binaryRealAdd(binaryRealMultiply(aa, bb, base).split('').reverse(), binaryRealMultiply(cc.length == 0 ? ['1'] : cc, dd.length == 0 ? ['1'] : dd, base).split('').reverse(), base);
                                                    var im = binaryRealSubtract(binaryRealMultiply(bb, cc.length == 0 ? ['1'] : cc, base).split('').reverse(), binaryRealMultiply(aa, dd.length == 0 ? ['1'] : dd, base).split('').reverse(), base);
                                                    setMemory(comParse('-' + re, im, '*'));
                                                } else if (value.includes('+')) {
                                                    // -c + di
                                                    var bb = value.split('+')[0].split('-')[1].split('').reverse();
                                                    var dd = value.split('+')[1].split('i')[0].split('').reverse();
                                                    var re = binaryRealSubtract(binaryRealMultiply(cc.length == 0 ? ['1'] : cc, dd.length == 0 ? ['1'] : dd, base).split('').reverse(), binaryRealMultiply(aa, bb, base).split('').reverse(), base);
                                                    var im = binaryRealAdd(binaryRealMultiply(aa, dd.length == 0 ? ['1'] : dd, base).split('').reverse(), binaryRealMultiply(bb, cc.length == 0 ? ['1'] : cc, base).split('').reverse(), base);
                                                    setMemory(comParse(re, im, '*'));
                                                } else {
                                                    // -di
                                                    var dd = value.split('-')[1].split('i')[0].split('').reverse();
                                                    var re = binaryRealMultiply(cc.length == 0 ? ['1'] : cc, dd.length == 0 ? ['1'] : dd, base);
                                                    var im = binaryRealMultiply(aa, dd.length == 0 ? ['1'] : dd, base);
                                                    setMemory(comParse('-' + re, '-' + im, '*'));
                                                }
                                            } else if (value.includes('-')) {
                                                // c - di
                                                var bb = value.split('-')[0].split('').reverse();
                                                var dd = value.split('-')[1].split('i')[0].split('').reverse();
                                                var re = binaryRealSubtract(binaryRealMultiply(aa, bb, base).split('').reverse(), binaryRealMultiply(cc.length == 0 ? ['1'] : cc, dd.length == 0 ? ['1'] : dd, base).split('').reverse(), base);
                                                var im = binaryRealAdd(binaryRealMultiply(aa, dd.length == 0 ? ['1'] : dd, base).split('').reverse(), binaryRealMultiply(bb, cc.length == 0 ? ['1'] : cc, base).split('').reverse(), base);
                                                setMemory(comParse(re, '-' + im, '*'));
                                            } else if (value.includes('+')) {
                                                // c + di
                                                var bb = value.split('+')[0].split('').reverse();
                                                var dd = value.split('+')[1].split('i')[0].split('').reverse();
                                                var re = binaryRealAdd(binaryRealMultiply(aa, bb, base).split('').reverse(), binaryRealMultiply(cc.length == 0 ? ['1'] : cc, dd.length == 0 ? ['1'] : dd, base).split('').reverse(), base);
                                                var im = binaryRealSubtract(binaryRealMultiply(aa, dd.length == 0 ? ['1'] : dd, base).split('').reverse(), binaryRealMultiply(bb, cc.length == 0 ? ['1'] : cc, base).split('').reverse(), base);
                                                setMemory(comParse(re, im, '*'));
                                            } else {
                                                // di
                                                var dd = value.split('i')[0].split('').reverse();
                                                var re = binaryRealMultiply(cc.length == 0 ? ['1'] : cc, dd.length == 0 ? ['1'] : dd, base);
                                                var im = binaryRealMultiply(aa, dd.length == 0 ? ['1'] : dd, base);
                                                setMemory(comParse(re, im, '*'));
                                            }
                                        } else if (memory.includes('+')) {
                                            // a + bi
                                            var aa = memory.split('+')[0].split('').reverse();
                                            var cc = memory.split('+')[1].split('i')[0].split('').reverse();
                                            if (value.startsWith('-')) {
                                                // -c + di, -c - di, -di
                                                if (value.split('-').length > 2) {
                                                    // -c - di
                                                    var bb = value.split('-')[1].split('').reverse();
                                                    var dd = value.split('-')[2].split('i')[0].split('').reverse();
                                                    var re = binaryRealSubtract(binaryRealMultiply(cc.length == 0 ? ['1'] : cc, dd.length == 0 ? ['1'] : dd, base).split('').reverse(), binaryRealMultiply(aa, bb, base).split('').reverse(), base);
                                                    var im = binaryRealAdd(binaryRealMultiply(aa, dd.length == 0 ? ['1'] : dd, base).split('').reverse(), binaryRealMultiply(bb, cc.length == 0 ? ['1'] : cc, base).split('').reverse(), base);
                                                    setMemory(comParse(re, '-' + im, '*'));
                                                } else if (value.includes('+')) {
                                                    // -c + di
                                                    var bb = value.split('+')[0].split('-')[1].split('').reverse();
                                                    var dd = value.split('+')[1].split('i')[0].split('').reverse();
                                                    var re = binaryRealAdd(binaryRealMultiply(aa, bb, base).split('').reverse(), binaryRealMultiply(cc.length == 0 ? ['1'] : cc, dd.length == 0 ? ['1'] : dd, base).split('').reverse(), base);
                                                    var im = binaryRealSubtract(binaryRealMultiply(aa, dd.length == 0 ? ['1'] : dd, base).split('').reverse(), binaryRealMultiply(bb, cc.length == 0 ? ['1'] : cc, base).split('').reverse(), base);
                                                    setMemory(comParse('-' + re, im, '*'));
                                                } else {
                                                    // -di
                                                    var dd = value.split('-')[1].split('i')[0].split('').reverse();
                                                    var re = binaryRealMultiply(cc.length == 0 ? ['1'] : cc, dd.length == 0 ? ['1'] : dd, base);
                                                    var im = binaryRealMultiply(aa, dd.length == 0 ? ['1'] : dd, base);
                                                    setMemory(comParse(re, '-' + im, '*'));
                                                }
                                            } else if (value.includes('-')) {
                                                // c - di
                                                var bb = value.split('-')[0].split('').reverse();
                                                var dd = value.split('-')[1].split('i')[0].split('').reverse();
                                                var re = binaryRealAdd(binaryRealMultiply(aa, bb, base).split('').reverse(), binaryRealMultiply(cc.length == 0 ? ['1'] : cc, dd.length == 0 ? ['1'] : dd, base).split('').reverse(), base);
                                                var im = binaryRealSubtract(binaryRealMultiply(bb, cc.length == 0 ? ['1'] : cc, base).split('').reverse(), binaryRealMultiply(aa, dd.length == 0 ? ['1'] : dd, base).split('').reverse(), base);
                                                setMemory(comParse(re, im, '*'));
                                            } else if (value.includes('+')) {
                                                // c + di
                                                var bb = value.split('+')[0].split('').reverse();
                                                var dd = value.split('+')[1].split('i')[0].split('').reverse();
                                                var re = binaryRealSubtract(binaryRealMultiply(aa, bb, base).split('').reverse(), binaryRealMultiply(cc.length == 0 ? ['1'] : cc, dd.length == 0 ? ['1'] : dd, base).split('').reverse(), base);
                                                var im = binaryRealAdd(binaryRealMultiply(aa, dd.length == 0 ? ['1'] : dd, base).split('').reverse(), binaryRealMultiply(bb, cc.length == 0 ? ['1'] : cc, base).split('').reverse(), base);
                                                setMemory(comParse(re, im, '*'));
                                            } else {
                                                // di
                                                var dd = value.split('i')[0].split('').reverse();
                                                var re = binaryRealMultiply(cc.length == 0 ? ['1'] : cc, dd.length == 0 ? ['1'] : dd, base);
                                                var im = binaryRealMultiply(aa, dd.length == 0 ? ['1'] : dd, base);
                                                setMemory(comParse('-' + re, im, '*'));
                                            }
                                        } else {
                                            // bi
                                            var aa = memory.split('i')[0].split('').reverse();
                                            if (value.startsWith('-')) {
                                                // -c + di, -c - di, -di
                                                if (value.split('-').length > 2) {
                                                    // -c - di
                                                    var bb = value.split('-')[1].split('').reverse();
                                                    var cc = value.split('-')[2].split('i')[0].split('').reverse();
                                                    var re = binaryRealMultiply(aa.length == 0 ? ['1'] : aa, cc.length == 0 ? ['1'] : cc, base);
                                                    var im = binaryRealMultiply(aa.length == 0 ? ['1'] : aa, bb, base);
                                                    setMemory(comParse(re, '-' + im, '*'));
                                                } else if (value.includes('+')) {
                                                    // -c + di
                                                    var bb = value.split('+')[0].split('').reverse();
                                                    var cc = value.split('+')[1].split('i')[0].split('').reverse();
                                                    var re = binaryRealMultiply(aa.length == 0 ? ['1'] : aa, cc.length == 0 ? ['1'] : cc, base);
                                                    var im = binaryRealMultiply(aa.length == 0 ? ['1'] : aa, bb, base);
                                                    setMemory(comParse('-' + re, '-' + im, '*'));
                                                } else {
                                                    // -di
                                                    var bb = value.split('-')[1].split('i')[0].split('').reverse();
                                                    var re = binaryRealMultiply(aa.length == 0 ? ['1'] : aa, bb.length == 0 ? ['1'] : bb, base);
                                                    setMemory(comParse(re, base == 1 ? '' : '0', '*'));
                                                }
                                            } else if (value.includes('-')) {
                                                // c - di
                                                var bb = value.split('-')[0].split('').reverse();
                                                var cc = value.split('-')[1].split('i')[0].split('').reverse();
                                                var re = binaryRealMultiply(aa.length == 0 ? ['1'] : aa, cc.length == 0 ? ['1'] : cc, base);
                                                var im = binaryRealMultiply(aa.length == 0 ? ['1'] : aa, bb, base);
                                                setMemory(comParse(re, im, '*'));
                                            } else if (value.includes('+')) {
                                                // c + di
                                                var bb = value.split('+')[0].split('').reverse();
                                                var cc = value.split('+')[1].split('i')[0].split('').reverse();
                                                var re = binaryRealMultiply(aa.length == 0 ? ['1'] : aa, cc.length == 0 ? ['1'] : cc, base);
                                                var im = binaryRealMultiply(aa.length == 0 ? ['1'] : aa, bb, base);
                                                setMemory(comParse('-' + re, im, '*'));
                                            } else {
                                                // di
                                                var bb = value.split('i')[0].split('').reverse();
                                                var re = binaryRealMultiply(aa.length == 0 ? ['1'] : aa, bb.length == 0 ? ['1'] : bb, base);
                                                setMemory(comParse('-' + re, base == 1 ? '' : '0', '*'));
                                            }
                                        }
                                    } else {
                                        // value is real
                                        if (memory.startsWith('-')) {
                                            // -a + bi, -a - bi, -bi
                                            if (memory.split('-').length > 2) {
                                                // -a - bi
                                                var aa = memory.split('-')[1].split('').reverse();
                                                var bb = memory.split('-')[2].split('i')[0].split('').reverse();
                                                if (value.startsWith('-')) {
                                                    // ac + bci
                                                    var cc = value.split('-')[1].split('').reverse();
                                                    var re = binaryRealMultiply(aa, cc, base);
                                                    var im = binaryRealMultiply(bb.length == 0 ? ['1'] : bb, cc, base);
                                                    setMemory(comParse(re, im, '*'));
                                                } else {
                                                    // -ac - bci
                                                    var cc = value.split('').reverse();
                                                    var re = binaryRealMultiply(aa, cc, base);
                                                    var im = binaryRealMultiply(bb.length == 0 ? ['1'] : bb, cc, base);
                                                    setMemory(comParse('-' + re, '-' + im, '*'));
                                                }
                                            } else if (memory.includes('+')) {
                                                // -a + bi
                                                var aa = memory.split('+')[0].split('-')[1].split('').reverse();
                                                var bb = memory.split('+')[1].split('i')[0].split('').reverse();
                                                if (value.startsWith('-')) {
                                                    // ac - bci
                                                    var cc = value.split('-')[1].split('').reverse();
                                                    var re = binaryRealMultiply(aa, cc, base);
                                                    var im = binaryRealMultiply(bb.length == 0 ? ['1'] : bb, cc, base);
                                                    setMemory(comParse(re, '-' + im, '*'));
                                                } else {
                                                    // -ac + bci
                                                    var cc = value.split('').reverse();
                                                    var re = binaryRealMultiply(aa, cc, base);
                                                    var im = binaryRealMultiply(bb.length == 0 ? ['1'] : bb, cc, base);
                                                    setMemory(comParse('-' + re, im, '*'));
                                                }
                                            } else {
                                                // -bi
                                                var aa = memory.split('-')[1].split('i')[0].split('').reverse();
                                                if (memory == '0*' || memory == '*') {
                                                    setMemory('0*');
                                                } else {
                                                    if (memory.startsWith('-')) {
                                                        // bci
                                                        setMemory(comParse(base == 1 ? '' : '0', binaryRealMultiply(aa.length == 0 ? ['1'] : aa, value.split('-')[1].split('').reverse(), base), '*'));
                                                    } else {
                                                        // -bci
                                                        setMemory(comParse(base == 1 ? '' : '0', '-' + binaryRealMultiply(aa.length == 0 ? ['1'] : aa, value.split('').reverse(), base), '*'));
                                                    }
                                                }
                                            }
                                        } else if (memory.includes('-')) {
                                            // a - bi
                                            var aa = memory.split('-')[0].split('').reverse();
                                            var bb = memory.split('-')[1].split('i')[0].split('').reverse();
                                            if (value.startsWith('-')) {
                                                // -ac + bci
                                                var cc = value.split('-')[1].split('').reverse();
                                                var re = binaryRealMultiply(aa, cc, base);
                                                var im = binaryRealMultiply(bb.length == 0 ? ['1'] : bb, cc, base);
                                                setMemory(comParse('-' + re, im, '*'));
                                            } else {
                                                // ac - bci
                                                var cc = value.split('').reverse();
                                                var re = binaryRealMultiply(aa, cc, base);
                                                var im = binaryRealMultiply(bb.length == 0 ? ['1'] : bb, cc, base);
                                                setMemory(comParse(re, '-' + im, '*'));
                                            }
                                        } else if (memory.includes('+')) {
                                            // a + bi
                                            var aa = memory.split('+')[0].split('').reverse();
                                            var bb = memory.split('+')[1].split('i')[0].split('').reverse();
                                            if (value.startsWith('-')) {
                                                // -ac - bci
                                                var cc = value.split('-')[1].split('').reverse();
                                                var re = binaryRealMultiply(aa, cc, base);
                                                var im = binaryRealMultiply(bb.length == 0 ? ['1'] : bb, cc, base);
                                                setMemory(comParse('-' + re, '-' + im, '*'));
                                            } else {
                                                // ac + bci
                                                var cc = value.split('').reverse();
                                                var re = binaryRealMultiply(aa, cc, base);
                                                var im = binaryRealMultiply(bb.length == 0 ? ['1'] : bb, cc, base);
                                                setMemory(comParse(re, im, '*'));
                                            }
                                        } else {
                                            // bi
                                            var aa = memory.split('i')[0].split('').reverse();
                                            if (memory == '0*' || memory == '*') {
                                                setMemory('0*');
                                            } else {
                                                if (memory.startsWith('-')) {
                                                    // -bci
                                                    setMemory(comParse(base == 1 ? '' : '0', '-' + binaryRealMultiply(aa.length == 0 ? ['1'] : aa, value.split('-')[1].split('').reverse(), base), '*'));
                                                } else {
                                                    // bci
                                                    setMemory(comParse(base == 1 ? '' : '0', binaryRealMultiply(aa.length == 0 ? ['1'] : aa, value.split('').reverse(), base), '*'));
                                                }
                                            }
                                        }
                                    }
                                } else {
                                    if (value.includes('i')) {
                                        if (value.startsWith('-')) {
                                            // -c + di, -c - di, -di
                                            if (value.split('-').length > 2) {
                                                // -c - di
                                                var aa = value.split('-')[1].split('').reverse();
                                                var bb = value.split('-')[2].split('i')[0].split('').reverse();
                                                if (memory.startsWith('-')) {
                                                    // ac + adi
                                                    var cc = memory.split('*')[0].split('-')[1].split('').reverse();
                                                    var re = binaryRealMultiply(aa, cc, base);
                                                    var im = binaryRealMultiply(bb.length == 0 ? ['1'] : bb, cc, base);
                                                    setMemory(comParse(re, im, '*'));
                                                } else {
                                                    // -ac - adi
                                                    var cc = memory.split('*')[0].split('').reverse();
                                                    var re = binaryRealMultiply(aa, cc, base);
                                                    var im = binaryRealMultiply(bb.length == 0 ? ['1'] : bb, cc, base);
                                                    setMemory(comParse('-' + re, '-' + im, '*'));
                                                }
                                            } else if (value.split('-')[1].includes('+')) {
                                                // -c + di
                                                var aa = value.split('+')[0].split('-')[1].split('').reverse();
                                                var bb = value.split('+')[1].split('i')[0].split('').reverse();
                                                if (memory.startsWith('-')) {
                                                    // ac - adi
                                                    var cc = memory.split('*')[0].split('-')[1].split('').reverse();
                                                    var re = binaryRealMultiply(aa, cc, base);
                                                    var im = binaryRealMultiply(bb.length == 0 ? ['1'] : bb, cc, base);
                                                    setMemory(comParse(re, '-' + im, '*'));
                                                } else {
                                                    // -ac + adi
                                                    var cc = memory.split('*')[0].split('').reverse();
                                                    var re = binaryRealMultiply(aa, cc, base);
                                                    var im = binaryRealMultiply(bb.length == 0 ? ['1'] : bb, cc, base);
                                                    setMemory(comParse('-' + re, im, '*'));
                                                }
                                            } else {
                                                // -di
                                                var aa = value.split('-')[1].split('i')[0].split('').reverse();
                                                if (memory == '0*' || memory == '*') {
                                                    setMemory('0*');
                                                } else {
                                                    if (memory.startsWith('-')) {
                                                        // adi
                                                        setMemory(comParse(base == 1 ? '' : '0', binaryRealMultiply(aa.length == 0 ? ['1'] : aa, memory.split('*')[0].split('-')[1].split('').reverse(), base), '*'));
                                                    } else {
                                                        // -adi
                                                        setMemory(comParse(base == 1 ? '' : '0', '-' + binaryRealMultiply(aa.length == 0 ? ['1'] : aa, memory.split('*')[0].split('').reverse(), base), '*'));
                                                    }
                                                }
                                            }
                                        } else if (value.includes('-')) {
                                            // c - di
                                            var aa = value.split('-')[0].split('').reverse();
                                            var bb = value.split('-')[1].split('i')[0].split('').reverse();
                                            if (memory.startsWith('-')) {
                                                // -ac + adi
                                                var cc = memory.split('*')[0].split('-')[1].split('').reverse();
                                                var re = binaryRealMultiply(aa, cc, base);
                                                var im = binaryRealMultiply(bb.length == 0 ? ['1'] : bb, cc, base);
                                                setMemory(comParse('-' + re, im, '*'));
                                            } else {
                                                // ac - adi
                                                var cc = memory.split('*')[0].split('').reverse();
                                                var re = binaryRealMultiply(aa, cc, base);
                                                var im = binaryRealMultiply(bb.length == 0 ? ['1'] : bb, cc, base);
                                                setMemory(comParse(re, '-' + im, '*'));
                                            }
                                        } else if (value.includes('+')) {
                                            // c + di
                                            var aa = value.split('+')[0].split('').reverse();
                                            var bb = value.split('+')[1].split('i')[0].split('').reverse();
                                            if (memory.startsWith('-')) {
                                                // -ac - adi
                                                var cc = memory.split('*')[0].split('-')[1].split('').reverse();
                                                var re = binaryRealMultiply(aa, cc, base);
                                                var im = binaryRealMultiply(bb.length == 0 ? ['1'] : bb, cc, base);
                                                setMemory(comParse('-' + re, '-' + im, '*'));
                                            } else {
                                                // ac + adi
                                                var cc = memory.split('*')[0].split('').reverse();
                                                var re = binaryRealMultiply(aa, cc, base);
                                                var im = binaryRealMultiply(bb.length == 0 ? ['1'] : bb, cc, base);
                                                setMemory(comParse(re, im, '*'));
                                            }
                                        } else {
                                            // di
                                            var aa = value.split('i')[0].split('').reverse();
                                            if (memory == '0*' || memory == '*') {
                                                setMemory('0*');
                                            } else {
                                                if (memory.startsWith('-')) {
                                                    // -adi
                                                    setMemory(comParse(base == 1 ? '' : '0', '-' + binaryRealMultiply(aa.length == 0 ? ['1'] : aa, memory.split('*')[0].split('-')[1].split('').reverse(), base), '*'));
                                                } else {
                                                    // adi
                                                    setMemory(comParse(base == 1 ? '' : '0', binaryRealMultiply(aa.length == 0 ? ['1'] : aa, memory.split('*')[0].split('').reverse(), base), '*'));
                                                }
                                            }
                                        }
                                    } else {
                                        if (memory.includes('-')) {
                                            var aa = memory.split('*')[0].split('-')[1].split('').reverse();
                                            if (value.includes('-')) {
                                                // negative * negative
                                                setMemory(binaryRealMultiply(aa, value.split('-')[1].split('').reverse(), base) + '*');
                                            } else {
                                                // negative * positive
                                                setMemory('-' + binaryRealMultiply(aa, value.split('').reverse(), base) + '*');
                                            }
                                        } else {
                                            var aa = memory.split('*')[0].split('').reverse();
                                            if (value.includes('-')) {
                                                // positive * negative
                                                setMemory('-' + binaryRealMultiply(aa, value.split('-')[1].split('').reverse(), base) + '*');
                                            } else {
                                                // positive * positive
                                                setMemory(binaryRealMultiply(aa, value.split('').reverse(), base) + '*');
                                            }
                                        }
                                    }
                                }
                                break;
                            case '/':
                                if (memory.includes('i')) {
                                    // complex
                                    if (value.includes('i')) {
                                        // value is imaginary
                                        if (memory.startsWith('-')) {
                                            // -a + bi, -a - bi, -bi
                                            if (memory.split('-').length > 2) {
                                                // -a - bi
                                                var aa = memory.split('-')[1].split('').reverse();
                                                var cc = memory.split('-')[2].split('i')[0].split('').reverse();
                                                if (value.startsWith('-')) {
                                                    // -c + di, -c - di, -di
                                                    if (value.split('-').length > 2) {
                                                        // -c - di
                                                        var bb = value.split('-')[1].split('').reverse();
                                                        var dd = value.split('-')[2].split('i')[0].split('').reverse();
                                                        var denom = binaryRealAdd(binaryRealMultiply(bb, bb, base).split('').reverse(), binaryRealMultiply(dd.length == 0 ? ['1'] : dd, dd.length == 0 ? ['1'] : dd, base).split('').reverse(), base).split('').reverse();
                                                        var re = binaryRealDivide(binaryRealAdd(binaryRealMultiply(aa, bb, base).split('').reverse(), binaryRealMultiply(cc.length == 0 ? ['1'] : cc, dd.length == 0 ? ['1'] : dd, base).split('').reverse(), base).split('').reverse(), denom, base);
                                                        var im = binaryRealDivide(binaryRealSubtract(binaryRealMultiply(bb, cc.length == 0 ? ['1'] : cc, base).split('').reverse(), binaryRealMultiply(aa, dd.length == 0 ? ['1'] : dd, base).split('').reverse(), base).split('').reverse(), denom, base);
                                                        setMemory(comParse(re, im, '/'));
                                                    } else if (value.includes('+')) {
                                                        // -c + di
                                                        var bb = value.split('+')[0].split('-')[1].split('').reverse();
                                                        var dd = value.split('+')[1].split('i')[0].split('').reverse();
                                                        var denom = binaryRealAdd(binaryRealMultiply(bb, bb, base).split('').reverse(), binaryRealMultiply(dd.length == 0 ? ['1'] : dd, dd.length == 0 ? ['1'] : dd, base).split('').reverse(), base).split('').reverse();
                                                        var re = binaryRealDivide(binaryRealSubtract(binaryRealMultiply(aa, bb, base).split('').reverse(), binaryRealMultiply(cc.length == 0 ? ['1'] : cc, dd.length == 0 ? ['1'] : dd, base).split('').reverse(), base).split('').reverse(), denom, base);
                                                        var im = binaryRealDivide(binaryRealAdd(binaryRealMultiply(aa, dd.length == 0 ? ['1'] : dd, base).split('').reverse(), binaryRealMultiply(bb, cc.length == 0 ? ['1'] : cc, base).split('').reverse(), base).split('').reverse(), denom, base);
                                                        setMemory(comParse(re, im, '/'));
                                                    } else {
                                                        // -di
                                                        var dd = value.split('-')[1].split('i')[0].split('').reverse();
                                                        var re = binaryRealDivide(cc.length == 0 ? ['1'] : cc, dd.length == 0 ? ['1'] : dd, base);
                                                        var im = binaryRealDivide(aa, dd.length == 0 ? ['1'] : dd, base);
                                                        setMemory(comParse(re, '-' + im, '/'));
                                                    }
                                                } else if (value.includes('-')) {
                                                    // c - di
                                                    var bb = value.split('-')[0].split('').reverse();
                                                    var dd = value.split('-')[1].split('i')[0].split('').reverse();
                                                    var denom = binaryRealAdd(binaryRealMultiply(bb, bb, base).split('').reverse(), binaryRealMultiply(dd.length == 0 ? ['1'] : dd, dd.length == 0 ? ['1'] : dd, base).split('').reverse(), base).split('').reverse();
                                                    var re = binaryRealDivide(binaryRealSubtract(binaryRealMultiply(cc.length == 0 ? ['1'] : cc, dd.length == 0 ? ['1'] : dd, base).split('').reverse(), binaryRealMultiply(aa, bb, base).split('').reverse(), base).split('').reverse(), denom, base);
                                                    var im = binaryRealDivide(binaryRealAdd(binaryRealMultiply(aa, dd.length == 0 ? ['1'] : dd, base).split('').reverse(), binaryRealMultiply(bb, cc.length == 0 ? ['1'] : cc, base).split('').reverse(), base).split('').reverse(), denom, base);
                                                    setMemory(comParse(re, '-' + im, '/'));
                                                } else if (value.includes('+')) {
                                                    // c + di
                                                    var bb = value.split('+')[0].split('').reverse();
                                                    var dd = value.split('+')[1].split('i')[0].split('').reverse();
                                                    var denom = binaryRealAdd(binaryRealMultiply(bb, bb, base).split('').reverse(), binaryRealMultiply(dd.length == 0 ? ['1'] : dd, dd.length == 0 ? ['1'] : dd, base).split('').reverse(), base).split('').reverse();
                                                    var re = binaryRealDivide(binaryRealAdd(binaryRealMultiply(aa, bb, base).split('').reverse(), binaryRealMultiply(cc.length == 0 ? ['1'] : cc, dd.length == 0 ? ['1'] : dd, base).split('').reverse(), base).split('').reverse(), denom, base);
                                                    var im = binaryRealDivide(binaryRealSubtract(binaryRealMultiply(aa, dd.length == 0 ? ['1'] : dd, base).split('').reverse(), binaryRealMultiply(bb, cc.length == 0 ? ['1'] : cc, base).split('').reverse(), base).split('').reverse(), denom, base);
                                                    setMemory(comParse('-' + re, im, '/'));
                                                } else {
                                                    // di
                                                    var dd = value.split('i')[0].split('').reverse();
                                                    var re = binaryRealDivide(cc.length == 0 ? ['1'] : cc, dd.length == 0 ? ['1'] : dd, base);
                                                    var im = binaryRealDivide(aa, dd.length == 0 ? ['1'] : dd, base);
                                                    setMemory(comParse('-' + re, im, '/'));
                                                }
                                            } else if (memory.includes('+')) {
                                                // -a + bi
                                                var aa = memory.split('+')[0].split('-')[1].split('').reverse();
                                                var cc = memory.split('+')[1].split('i')[0].split('').reverse();
                                                if (value.startsWith('-')) {
                                                    // -c + di, -c - di, -di
                                                    if (value.split('-').length > 2) {
                                                        // -c - di
                                                        var bb = value.split('-')[1].split('').reverse();
                                                        var dd = value.split('-')[2].split('i')[0].split('').reverse();
                                                        var denom = binaryRealAdd(binaryRealMultiply(bb, bb, base).split('').reverse(), binaryRealMultiply(dd.length == 0 ? ['1'] : dd, dd.length == 0 ? ['1'] : dd, base).split('').reverse(), base).split('').reverse();
                                                        var re = binaryRealDivide(binaryRealSubtract(binaryRealMultiply(aa, bb, base).split('').reverse(), binaryRealMultiply(cc.length == 0 ? ['1'] : cc, dd.length == 0 ? ['1'] : dd, base).split('').reverse(), base).split('').reverse(), denom, base);
                                                        var im = binaryRealDivide(binaryRealAdd(binaryRealMultiply(aa, dd.length == 0 ? ['1'] : dd, base).split('').reverse(), binaryRealMultiply(bb, cc.length == 0 ? ['1'] : cc, base).split('').reverse(), base).split('').reverse(), denom, base);
                                                        setMemory(comParse(re, '-' + im, '/'));
                                                    } else if (value.includes('+')) {
                                                        // -c + di
                                                        var bb = value.split('+')[0].split('-')[1].split('').reverse();
                                                        var dd = value.split('+')[1].split('i')[0].split('').reverse();
                                                        var denom = binaryRealAdd(binaryRealMultiply(bb, bb, base).split('').reverse(), binaryRealMultiply(dd.length == 0 ? ['1'] : dd, dd.length == 0 ? ['1'] : dd, base).split('').reverse(), base).split('').reverse();
                                                        var re = binaryRealDivide(binaryRealAdd(binaryRealMultiply(aa, bb, base).split('').reverse(), binaryRealMultiply(cc.length == 0 ? ['1'] : cc, dd.length == 0 ? ['1'] : dd, base).split('').reverse(), base).split('').reverse(), denom, base);
                                                        var im = binaryRealDivide(binaryRealSubtract(binaryRealMultiply(aa, dd.length == 0 ? ['1'] : dd, base).split('').reverse(), binaryRealMultiply(bb, cc.length == 0 ? ['1'] : cc, base).split('').reverse(), base).split('').reverse(), denom, base);
                                                        setMemory(comParse(re, im, '/'));
                                                    } else {
                                                        // -di
                                                        var dd = value.split('-')[1].split('i')[0].split('').reverse();
                                                        var re = binaryRealDivide(cc.length == 0 ? ['1'] : cc, dd.length == 0 ? ['1'] : dd, base);
                                                        var im = binaryRealDivide(aa, dd.length == 0 ? ['1'] : dd, base);
                                                        setMemory(comParse('-' + re, '-' + im, '/'));
                                                    }
                                                } else if (value.includes('-')) {
                                                    // c - di
                                                    var bb = value.split('-')[0].split('').reverse();
                                                    var dd = value.split('-')[1].split('i')[0].split('').reverse();
                                                    var denom = binaryRealAdd(binaryRealMultiply(bb, bb, base).split('').reverse(), binaryRealMultiply(dd.length == 0 ? ['1'] : dd, dd.length == 0 ? ['1'] : dd, base).split('').reverse(), base).split('').reverse();
                                                    var re = binaryRealDivide(binaryRealAdd(binaryRealMultiply(aa, bb, base).split('').reverse(), binaryRealMultiply(cc.length == 0 ? ['1'] : cc, dd.length == 0 ? ['1'] : dd, base).split('').reverse(), base).split('').reverse(), denom, base);
                                                    var im = binaryRealDivide(binaryRealSubtract(binaryRealMultiply(bb, cc.length == 0 ? ['1'] : cc, base).split('').reverse(), binaryRealMultiply(aa, dd.length == 0 ? ['1'] : dd, base).split('').reverse(), base).split('').reverse(), denom, base);
                                                    setMemory(comParse('-' + re, im, '/'));
                                                } else if (value.includes('+')) {
                                                    // c + di
                                                    var bb = value.split('+')[0].split('').reverse();
                                                    var dd = value.split('+')[1].split('i')[0].split('').reverse();
                                                    var denom = binaryRealAdd(binaryRealMultiply(bb, bb, base).split('').reverse(), binaryRealMultiply(dd.length == 0 ? ['1'] : dd, dd.length == 0 ? ['1'] : dd, base).split('').reverse(), base).split('').reverse();
                                                    var re = binaryRealDivide(binaryRealSubtract(binaryRealMultiply(cc.length == 0 ? ['1'] : cc, dd.length == 0 ? ['1'] : dd, base).split('').reverse(), binaryRealMultiply(aa, bb, base).split('').reverse(), base).split('').reverse(), denom, base);
                                                    var im = binaryRealDivide(binaryRealAdd(binaryRealMultiply(aa, dd.length == 0 ? ['1'] : dd, base).split('').reverse(), binaryRealMultiply(bb, cc.length == 0 ? ['1'] : cc, base).split('').reverse(), base).split('').reverse(), denom, base);
                                                    setMemory(comParse(re, im, '/'));
                                                } else {
                                                    // di
                                                    var dd = value.split('i')[0].split('').reverse();
                                                    var re = binaryRealDivide(cc.length == 0 ? ['1'] : cc, dd.length == 0 ? ['1'] : dd, base);
                                                    var im = binaryRealDivide(aa, dd.length == 0 ? ['1'] : dd, base);
                                                    setMemory(comParse(re, im, '/'));
                                                }
                                            } else {
                                                // -bi
                                                var aa = memory.split('-')[1].split('i')[0].split('').reverse();
                                                if (value.startsWith('-')) {
                                                    // -c + di, -c - di, -di
                                                    if (value.split('-').length > 2) {
                                                        // -c - di
                                                        var bb = value.split('-')[1].split('').reverse();
                                                        var cc = value.split('-')[2].split('i')[0].split('').reverse();
                                                        var denom = binaryRealAdd(binaryRealMultiply(bb, bb, base).split('').reverse(), binaryRealMultiply(cc.length == 0 ? ['1'] : cc, cc.length == 0 ? ['1'] : cc, base).split('').reverse(), base).split('').reverse();
                                                        var re = binaryRealDivide(binaryRealMultiply(aa.length == 0 ? ['1'] : aa, cc.length == 0 ? ['1'] : cc, base).split('').reverse(), denom, base);
                                                        var im = binaryRealDivide(binaryRealMultiply(aa.length == 0 ? ['1'] : aa, bb, base).split('').reverse(), denom, base);
                                                        setMemory(comParse(re, im, '/'));
                                                    } else if (value.includes('+')) {
                                                        // -c + di
                                                        var bb = value.split('+')[0].split('-')[1].split('').reverse();
                                                        var cc = value.split('+')[1].split('i')[0].split('').reverse();
                                                        var denom = binaryRealAdd(binaryRealMultiply(bb, bb, base).split('').reverse(), binaryRealMultiply(cc.length == 0 ? ['1'] : cc, cc.length == 0 ? ['1'] : cc, base).split('').reverse(), base).split('').reverse();
                                                        var re = binaryRealDivide(binaryRealMultiply(aa.length == 0 ? ['1'] : aa, cc.length == 0 ? ['1'] : cc, base).split('').reverse(), denom, base);
                                                        var im = binaryRealDivide(binaryRealMultiply(aa.length == 0 ? ['1'] : aa, bb, base).split('').reverse(), denom, base);
                                                        setMemory(comParse('-' + re, im, '/'));
                                                    } else {
                                                        // -di
                                                        var bb = value.split('-')[1].split('i')[0].split('').reverse();
                                                        var re = binaryRealDivide(aa.length == 0 ? ['1'] : aa, bb.length == 0 ? ['1'] : bb, base);
                                                        setMemory(comParse(re, base == 1 ? '' : '0', '/'));
                                                    }
                                                } else if (value.includes('-')) {
                                                    // c - di
                                                    var bb = value.split('-')[0].split('').reverse();
                                                    var cc = value.split('-')[1].split('i')[0].split('').reverse();
                                                    var denom = binaryRealAdd(binaryRealMultiply(bb, bb, base).split('').reverse(), binaryRealMultiply(cc.length == 0 ? ['1'] : cc, cc.length == 0 ? ['1'] : cc, base).split('').reverse(), base).split('').reverse();
                                                    var re = binaryRealDivide(binaryRealMultiply(aa.length == 0 ? ['1'] : aa, cc.length == 0 ? ['1'] : cc, base).split('').reverse(), denom, base);
                                                    var im = binaryRealDivide(binaryRealMultiply(aa.length == 0 ? ['1'] : aa, bb, base).split('').reverse(), denom, base);
                                                    setMemory(comParse(re, '-' + im, '/'));
                                                } else if (value.includes('+')) {
                                                    // c + di
                                                    var bb = value.split('+')[0].split('').reverse();
                                                    var cc = value.split('+')[1].split('i')[0].split('').reverse();
                                                    var denom = binaryRealAdd(binaryRealMultiply(bb, bb, base).split('').reverse(), binaryRealMultiply(cc.length == 0 ? ['1'] : cc, cc.length == 0 ? ['1'] : cc, base).split('').reverse(), base).split('').reverse();
                                                    var re = binaryRealDivide(binaryRealMultiply(aa.length == 0 ? ['1'] : aa, cc.length == 0 ? ['1'] : cc, base).split('').reverse(), denom, base);
                                                    var im = binaryRealDivide(binaryRealMultiply(aa.length == 0 ? ['1'] : aa, bb, base).split('').reverse(), denom, base);
                                                    setMemory(comParse('-' + re, '-' + im, '/'));
                                                } else {
                                                    // di
                                                    var bb = value.split('i')[0].split('').reverse();
                                                    var re = binaryRealDivide(aa.length == 0 ? ['1'] : aa, bb.length == 0 ? ['1'] : bb, base);
                                                    setMemory(comParse('-' + re, base == 1 ? '' : '0', '/'));
                                                }
                                            }
                                        } else if (memory.includes('-')) {
                                            // a - bi
                                            var aa = memory.split('-')[0].split('').reverse();
                                            var cc = memory.split('-')[1].split('i')[0].split('').reverse();
                                            if (value.startsWith('-')) {
                                                // -c + di, -c - di, -di
                                                if (value.split('-').length > 2) {
                                                    // -c - di
                                                    var bb = value.split('-')[1].split('').reverse();
                                                    var dd = value.split('-')[2].split('i')[0].split('').reverse();
                                                    var denom = binaryRealAdd(binaryRealMultiply(bb, bb, base).split('').reverse(), binaryRealMultiply(dd.length == 0 ? ['1'] : dd, dd.length == 0 ? ['1'] : dd, base).split('').reverse(), base).split('').reverse();
                                                    var re = binaryRealDivide(binaryRealSubtract(binaryRealMultiply(cc.length == 0 ? ['1'] : cc, dd.length == 0 ? ['1'] : dd, base).split('').reverse(), binaryRealMultiply(aa, bb, base).split('').reverse(), base).split('').reverse(), denom, base);
                                                    var im = binaryRealDivide(binaryRealAdd(binaryRealMultiply(aa, dd.length == 0 ? ['1'] : dd, base).split('').reverse(), binaryRealMultiply(bb, cc.length == 0 ? ['1'] : cc, base).split('').reverse(), base).split('').reverse(), denom, base);
                                                    setMemory(comParse(re, im, '/'));
                                                } else if (value.includes('+')) {
                                                    // -c + di
                                                    var bb = value.split('+')[0].split('-')[1].split('').reverse();
                                                    var dd = value.split('+')[1].split('i')[0].split('').reverse();
                                                    var denom = binaryRealAdd(binaryRealMultiply(bb, bb, base).split('').reverse(), binaryRealMultiply(dd.length == 0 ? ['1'] : dd, dd.length == 0 ? ['1'] : dd, base).split('').reverse(), base).split('').reverse();
                                                    var re = binaryRealDivide(binaryRealAdd(binaryRealMultiply(aa, bb, base).split('').reverse(), binaryRealMultiply(cc.length == 0 ? ['1'] : cc, dd.length == 0 ? ['1'] : dd, base).split('').reverse(), base).split('').reverse(), denom, base);
                                                    var im = binaryRealDivide(binaryRealSubtract(binaryRealMultiply(bb, cc.length == 0 ? ['1'] : cc, base).split('').reverse(), binaryRealMultiply(aa, dd.length == 0 ? ['1'] : dd, base).split('').reverse(), base).split('').reverse(), denom, base);
                                                    setMemory(comParse('-' + re, im, '/'));
                                                } else {
                                                    // -di
                                                    var dd = value.split('-')[1].split('i')[0].split('').reverse();
                                                    var re = binaryRealDivide(cc.length == 0 ? ['1'] : cc, dd.length == 0 ? ['1'] : dd, base);
                                                    var im = binaryRealDivide(aa, dd.length == 0 ? ['1'] : dd, base);
                                                    setMemory(comParse(re, im, '/'));
                                                }
                                            } else if (value.includes('-')) {
                                                // c - di
                                                var bb = value.split('-')[0].split('').reverse();
                                                var dd = value.split('-')[1].split('i')[0].split('').reverse();
                                                var denom = binaryRealAdd(binaryRealMultiply(bb, bb, base).split('').reverse(), binaryRealMultiply(dd.length == 0 ? ['1'] : dd, dd.length == 0 ? ['1'] : dd, base).split('').reverse(), base).split('').reverse();
                                                var re = binaryRealDivide(binaryRealAdd(binaryRealMultiply(aa, bb, base).split('').reverse(), binaryRealMultiply(cc.length == 0 ? ['1'] : cc, dd.length == 0 ? ['1'] : dd, base).split('').reverse(), base).split('').reverse(), denom, base);
                                                var im = binaryRealDivide(binaryRealSubtract(binaryRealMultiply(aa, dd.length == 0 ? ['1'] : dd, base).split('').reverse(), binaryRealMultiply(bb, cc.length == 0 ? ['1'] : cc, base).split('').reverse(), base).split('').reverse(), denom, base);
                                                setMemory(comParse(re, im, '/'));
                                            } else if (value.includes('+')) {
                                                // c + di
                                                var bb = value.split('+')[0].split('').reverse();
                                                var dd = value.split('+')[1].split('i')[0].split('').reverse();
                                                var denom = binaryRealAdd(binaryRealMultiply(bb, bb, base).split('').reverse(), binaryRealMultiply(dd.length == 0 ? ['1'] : dd, dd.length == 0 ? ['1'] : dd, base).split('').reverse(), base).split('').reverse();
                                                var re = binaryRealDivide(binaryRealSubtract(binaryRealMultiply(aa, bb, base).split('').reverse(), binaryRealMultiply(cc.length == 0 ? ['1'] : cc, dd.length == 0 ? ['1'] : dd, base).split('').reverse(), base).split('').reverse(), denom, base);
                                                var im = binaryRealDivide(binaryRealAdd(binaryRealMultiply(aa, dd.length == 0 ? ['1'] : dd, base).split('').reverse(), binaryRealMultiply(bb, cc.length == 0 ? ['1'] : cc, base).split('').reverse(), base).split('').reverse(), denom, base);
                                                setMemory(comParse(re, '-' + im, '/'));
                                            } else {
                                                // di
                                                var dd = value.split('i')[0].split('').reverse();
                                                var re = binaryRealDivide(cc.length == 0 ? ['1'] : cc, dd.length == 0 ? ['1'] : dd, base);
                                                var im = binaryRealDivide(aa, dd.length == 0 ? ['1'] : dd, base);
                                                setMemory(comParse('-' + re, '-' + im, '/'));
                                            }
                                        } else if (memory.includes('+')) {
                                            // a + bi
                                            var aa = memory.split('+')[0].split('').reverse();
                                            var cc = memory.split('+')[1].split('i')[0].split('').reverse();
                                            if (value.startsWith('-')) {
                                                // -c + di, -c - di, -di
                                                if (value.split('-').length > 2) {
                                                    // -c - di
                                                    var bb = value.split('-')[1].split('').reverse();
                                                    var dd = value.split('-')[2].split('i')[0].split('').reverse();
                                                    var denom = binaryRealAdd(binaryRealMultiply(bb, bb, base).split('').reverse(), binaryRealMultiply(dd.length == 0 ? ['1'] : dd, dd.length == 0 ? ['1'] : dd, base).split('').reverse(), base).split('').reverse();
                                                    var re = binaryRealDivide(binaryRealAdd(binaryRealMultiply(aa, bb, base).split('').reverse(), binaryRealMultiply(cc.length == 0 ? ['1'] : cc, dd.length == 0 ? ['1'] : dd, base).split('').reverse(), base).split('').reverse(), denom, base);
                                                    var im = binaryRealDivide(binaryRealSubtract(binaryRealMultiply(aa, dd.length == 0 ? ['1'] : dd, base).split('').reverse(), binaryRealMultiply(bb, cc.length == 0 ? ['1'] : cc, base).split('').reverse(), base).split('').reverse(), denom, base);
                                                    setMemory(comParse('-' + re, im, '/'));
                                                } else if (value.includes('+')) {
                                                    // -c + di
                                                    var bb = value.split('+')[0].split('-')[1].split('').reverse();
                                                    var dd = value.split('+')[1].split('i')[0].split('').reverse();
                                                    var denom = binaryRealAdd(binaryRealMultiply(bb, bb, base).split('').reverse(), binaryRealMultiply(dd.length == 0 ? ['1'] : dd, dd.length == 0 ? ['1'] : dd, base).split('').reverse(), base).split('').reverse();
                                                    var re = binaryRealDivide(binaryRealSubtract(binaryRealMultiply(cc.length == 0 ? ['1'] : cc, dd.length == 0 ? ['1'] : dd, base).split('').reverse(), binaryRealMultiply(aa, bb, base).split('').reverse(), base).split('').reverse(), denom, base);
                                                    var im = binaryRealDivide(binaryRealAdd(binaryRealMultiply(aa, dd.length == 0 ? ['1'] : dd, base).split('').reverse(), binaryRealMultiply(bb, cc.length == 0 ? ['1'] : cc, base).split('').reverse(), base).split('').reverse(), denom, base);
                                                    setMemory(comParse(re, '-' + im, '/'));
                                                } else {
                                                    // -di
                                                    var dd = value.split('-')[1].split('i')[0].split('').reverse();
                                                    var re = binaryRealDivide(cc.length == 0 ? ['1'] : cc, dd.length == 0 ? ['1'] : dd, base);
                                                    var im = binaryRealDivide(aa, dd.length == 0 ? ['1'] : dd, base);
                                                    setMemory(comParse('-' + re, im, '/'));
                                                }
                                            } else if (value.includes('-')) {
                                                // c - di
                                                var bb = value.split('-')[0].split('').reverse();
                                                var dd = value.split('-')[1].split('i')[0].split('').reverse();
                                                var denom = binaryRealAdd(binaryRealMultiply(bb, bb, base).split('').reverse(), binaryRealMultiply(dd.length == 0 ? ['1'] : dd, dd.length == 0 ? ['1'] : dd, base).split('').reverse(), base).split('').reverse();
                                                var re = binaryRealDivide(binaryRealSubtract(binaryRealMultiply(aa, bb, base).split('').reverse(), binaryRealMultiply(cc.length == 0 ? ['1'] : cc, dd.length == 0 ? ['1'] : dd, base).split('').reverse(), base).split('').reverse(), denom, base);
                                                var im = binaryRealDivide(binaryRealAdd(binaryRealMultiply(aa, dd.length == 0 ? ['1'] : dd, base).split('').reverse(), binaryRealMultiply(bb, cc.length == 0 ? ['1'] : cc, base).split('').reverse(), base).split('').reverse(), denom, base);
                                                setMemory(comParse(re, im, '/'));
                                            } else if (value.includes('+')) {
                                                // c + di
                                                var bb = value.split('+')[0].split('').reverse();
                                                var dd = value.split('+')[1].split('i')[0].split('').reverse();
                                                var denom = binaryRealAdd(binaryRealMultiply(bb, bb, base).split('').reverse(), binaryRealMultiply(dd.length == 0 ? ['1'] : dd, dd.length == 0 ? ['1'] : dd, base).split('').reverse(), base).split('').reverse();
                                                var re = binaryRealDivide(binaryRealAdd(binaryRealMultiply(aa, bb, base).split('').reverse(), binaryRealMultiply(cc.length == 0 ? ['1'] : cc, dd.length == 0 ? ['1'] : dd, base).split('').reverse(), base).split('').reverse(), denom, base);
                                                var im = binaryRealDivide(binaryRealSubtract(binaryRealMultiply(bb, cc.length == 0 ? ['1'] : cc, base).split('').reverse(), binaryRealMultiply(aa, dd.length == 0 ? ['1'] : dd, base).split('').reverse(), base).split('').reverse(), denom, base);
                                                setMemory(comParse(re, im, '/'));
                                            } else {
                                                // di
                                                var dd = value.split('i')[0].split('').reverse();
                                                var re = binaryRealDivide(cc.length == 0 ? ['1'] : cc, dd.length == 0 ? ['1'] : dd, base);
                                                var im = binaryRealDivide(aa, dd.length == 0 ? ['1'] : dd, base);
                                                setMemory(comParse(re, '-' + im, '/'));
                                            }
                                        } else {
                                            // bi
                                            var aa = memory.split('i')[0].split('').reverse();
                                            if (value.startsWith('-')) {
                                                // -c + di, -c - di, -di
                                                if (value.split('-').length > 2) {
                                                    // -c - di
                                                    var bb = value.split('-')[1].split('').reverse();
                                                    var cc = value.split('-')[2].split('i')[0].split('').reverse();
                                                    var denom = binaryRealAdd(binaryRealMultiply(bb, bb, base).split('').reverse(), binaryRealMultiply(cc.length == 0 ? ['1'] : cc, cc.length == 0 ? ['1'] : cc, base).split('').reverse(), base).split('').reverse();
                                                    var re = binaryRealDivide(binaryRealMultiply(aa.length == 0 ? ['1'] : aa, cc.length == 0 ? ['1'] : cc, base).split('').reverse(), denom, base);
                                                    var im = binaryRealDivide(binaryRealMultiply(aa.length == 0 ? ['1'] : aa, bb, base).split('').reverse(), denom, base);
                                                    setMemory(comParse('-' + re, '-' + im, '/'));
                                                } else if (value.includes('+')) {
                                                    // -c + di
                                                    var bb = value.split('+')[0].split('').reverse();
                                                    var cc = value.split('+')[1].split('i')[0].split('').reverse();
                                                    var denom = binaryRealAdd(binaryRealMultiply(bb, bb, base).split('').reverse(), binaryRealMultiply(cc.length == 0 ? ['1'] : cc, cc.length == 0 ? ['1'] : cc, base).split('').reverse(), base).split('').reverse();
                                                    var re = binaryRealDivide(binaryRealMultiply(aa.length == 0 ? ['1'] : aa, cc.length == 0 ? ['1'] : cc, base).split('').reverse(), denom, base);
                                                    var im = binaryRealDivide(binaryRealMultiply(aa.length == 0 ? ['1'] : aa, bb, base).split('').reverse(), denom, base);
                                                    setMemory(comParse(re, '-' + im, '/'));
                                                } else {
                                                    // -di
                                                    var bb = value.split('-')[1].split('i')[0].split('').reverse();
                                                    var re = binaryRealDivide(aa.length == 0 ? ['1'] : aa, bb.length == 0 ? ['1'] : bb, base);
                                                    setMemory(comParse('-' + re, base == 1 ? '' : '0', '/'));
                                                }
                                            } else if (value.includes('-')) {
                                                // c - di
                                                var bb = value.split('-')[0].split('').reverse();
                                                var cc = value.split('-')[1].split('i')[0].split('').reverse();
                                                var denom = binaryRealAdd(binaryRealMultiply(bb, bb, base).split('').reverse(), binaryRealMultiply(cc.length == 0 ? ['1'] : cc, cc.length == 0 ? ['1'] : cc, base).split('').reverse(), base).split('').reverse();
                                                var re = binaryRealDivide(binaryRealMultiply(aa.length == 0 ? ['1'] : aa, cc.length == 0 ? ['1'] : cc, base).split('').reverse(), denom, base);
                                                var im = binaryRealDivide(binaryRealMultiply(aa.length == 0 ? ['1'] : aa, bb, base).split('').reverse(), denom, base);
                                                setMemory(comParse('-' + re, im, '/'));
                                            } else if (value.includes('+')) {
                                                // c + di
                                                var bb = value.split('+')[0].split('').reverse();
                                                var cc = value.split('+')[1].split('i')[0].split('').reverse();
                                                var denom = binaryRealAdd(binaryRealMultiply(bb, bb, base).split('').reverse(), binaryRealMultiply(cc.length == 0 ? ['1'] : cc, cc.length == 0 ? ['1'] : cc, base).split('').reverse(), base).split('').reverse();
                                                var re = binaryRealDivide(binaryRealMultiply(aa.length == 0 ? ['1'] : aa, cc.length == 0 ? ['1'] : cc, base).split('').reverse(), denom, base);
                                                var im = binaryRealDivide(binaryRealMultiply(aa.length == 0 ? ['1'] : aa, bb, base).split('').reverse(), denom, base);
                                                setMemory(comParse(re, im, '/'));
                                            } else {
                                                // di
                                                var bb = value.split('i')[0].split('').reverse();
                                                var re = binaryRealDivide(aa.length == 0 ? ['1'] : aa, bb.length == 0 ? ['1'] : bb, base);
                                                setMemory(comParse(re, base == 1 ? '' : '0', '/'));
                                            }
                                        }
                                    } else {
                                        // value is real
                                        if (memory.startsWith('-')) {
                                            // -a + bi, -a - bi, -bi
                                            if (memory.split('-').length > 2) {
                                                // -a - bi
                                                var aa = memory.split('-')[1].split('').reverse();
                                                var bb = memory.split('-')[2].split('i')[0].split('').reverse();
                                                if (value.startsWith('-')) {
                                                    // a / c + bi / c
                                                    var cc = value.split('-')[1].split('').reverse();
                                                    var re = binaryRealDivide(aa, cc, base);
                                                    var im = binaryRealDivide(bb.length == 0 ? ['1'] : bb, cc, base);
                                                    setMemory(comParse(re, im, '/'));
                                                } else {
                                                    // -a / c - bi / c
                                                    var cc = value.split('').reverse();
                                                    var re = binaryRealDivide(aa, cc, base);
                                                    var im = binaryRealDivide(bb.length == 0 ? ['1'] : bb, cc, base);
                                                    setMemory(comParse('-' + re, '-' + im, '/'));
                                                }
                                            } else if (memory.includes('+')) {
                                                // -a + bi
                                                var aa = memory.split('+')[0].split('-')[1].split('').reverse();
                                                var bb = memory.split('+')[1].split('i')[0].split('').reverse();
                                                if (value.startsWith('-')) {
                                                    // a / c - bi / c
                                                    var cc = value.split('-')[1].split('').reverse();
                                                    var re = binaryRealDivide(aa, cc, base);
                                                    var im = binaryRealDivide(bb.length == 0 ? ['1'] : bb, cc, base);
                                                    setMemory(comParse(re, '-' + im, '/'));
                                                } else {
                                                    // -a / c + bi / c
                                                    var cc = value.split('').reverse();
                                                    var re = binaryRealDivide(aa, cc, base);
                                                    var im = binaryRealDivide(bb.length == 0 ? ['1'] : bb, cc, base);
                                                    setMemory(comParse('-' + re, im, '/'));
                                                }
                                            } else {
                                                // -bi
                                                var aa = memory.split('-')[1].split('i')[0].split('').reverse();
                                                if (memory == '0/' || memory == '/') {
                                                    setMemory('0/');
                                                } else {
                                                    if (memory.startsWith('-')) {
                                                        // bi / c
                                                        setMemory(comParse(base == 1 ? '' : '0', binaryRealDivide(aa.length == 0 ? ['1'] : aa, value.split('-')[1].split('').reverse(), base), '/'));
                                                    } else {
                                                        // -bi / c
                                                        setMemory(comParse(base == 1 ? '' : '0', '-' + binaryRealDivide(aa.length == 0 ? ['1'] : aa, value.split('').reverse(), base), '/'));
                                                    }
                                                }
                                            }
                                        } else if (memory.includes('-')) {
                                            // a - bi
                                            var aa = memory.split('-')[0].split('').reverse();
                                            var bb = memory.split('-')[1].split('i')[0].split('').reverse();
                                            if (value.startsWith('-')) {
                                                // -a / c + bi / c
                                                var cc = value.split('-')[1].split('').reverse();
                                                var re = binaryRealDivide(aa, cc, base);
                                                var im = binaryRealDivide(bb.length == 0 ? ['1'] : bb, cc, base);
                                                setMemory(comParse('-' + re, im, '/'));
                                            } else {
                                                // a / c - bi / c
                                                var cc = value.split('').reverse();
                                                var re = binaryRealDivide(aa, cc, base);
                                                var im = binaryRealDivide(bb.length == 0 ? ['1'] : bb, cc, base);
                                                setMemory(comParse(re, '-' + im, '/'));
                                            }
                                        } else if (memory.includes('+')) {
                                            // a + bi
                                            var aa = memory.split('+')[0].split('').reverse();
                                            var bb = memory.split('+')[1].split('i')[0].split('').reverse();
                                            if (value.startsWith('-')) {
                                                // -a / c - bi / c
                                                var cc = value.split('-')[1].split('').reverse();
                                                var re = binaryRealDivide(aa, cc, base);
                                                var im = binaryRealDivide(bb.length == 0 ? ['1'] : bb, cc, base);
                                                setMemory(comParse('-' + re, '-' + im, '/'));
                                            } else {
                                                // a / c + bi / c
                                                var cc = value.split('').reverse();
                                                var re = binaryRealDivide(aa, cc, base);
                                                var im = binaryRealDivide(bb.length == 0 ? ['1'] : bb, cc, base);
                                                setMemory(comParse(re, im, '/'));
                                            }
                                        } else {
                                            // bi
                                            var aa = memory.split('i')[0].split('').reverse();
                                            if (memory == '0/' || memory == '/') {
                                                setMemory('0/');
                                            } else {
                                                if (memory.startsWith('-')) {
                                                    // -bi / c
                                                    setMemory(comParse(base == 1 ? '' : '0', '-' + binaryRealDivide(aa.length == 0 ? ['1'] : aa, value.split('-')[1].split('').reverse(), base), '/'));
                                                } else {
                                                    // bi / c
                                                    setMemory(comParse(base == 1 ? '' : '0', binaryRealDivide(aa.length == 0 ? ['1'] : aa, value.split('').reverse(), base), '/'));
                                                }
                                            }
                                        }
                                    }
                                } else {
                                    if (value.includes('i')) {
                                        if (value.startsWith('-')) {
                                            // -c + di, -c - di, -di
                                            if (value.split('-').length > 2) {
                                                // -c - di
                                                var aa = value.split('-')[1].split('').reverse();
                                                var bb = value.split('-')[2].split('i')[0].split('').reverse();
                                                var denom = binaryRealAdd(binaryRealMultiply(aa, aa, base).split('').reverse(), binaryRealMultiply(bb.length == 0 ? ['1'] : bb, bb.length == 0 ? ['1'] : bb, base).split('').reverse(), base).split('').reverse();
                                                if (memory.startsWith('-')) {
                                                    // (ac - adi) / denom
                                                    var cc = memory.split('/')[0].split('-')[1].split('').reverse();
                                                    var re = binaryRealDivide(binaryRealMultiply(aa, cc, base).split('').reverse(), denom, base);
                                                    var im = binaryRealDivide(binaryRealMultiply(bb.length == 0 ? ['1'] : bb, cc, base).split('').reverse(), denom, base);
                                                    setMemory(comParse(re, '-' + im, '/'));
                                                } else {
                                                    // (-ac + adi) / denom
                                                    var cc = memory.split('/')[0].split('').reverse();
                                                    var re = binaryRealDivide(binaryRealMultiply(aa, cc, base).split('').reverse(), denom, base);
                                                    var im = binaryRealDivide(binaryRealMultiply(bb.length == 0 ? ['1'] : bb, cc, base).split('').reverse(), denom, base);
                                                    setMemory(comParse('-' + re, im, '/'));
                                                }
                                            } else if (value.split('-')[1].includes('+')) {
                                                // -c + di
                                                var aa = value.split('+')[0].split('-')[1].split('').reverse();
                                                var bb = value.split('+')[1].split('i')[0].split('').reverse();
                                                var denom = binaryRealAdd(binaryRealMultiply(aa, aa, base).split('').reverse(), binaryRealMultiply(bb.length == 0 ? ['1'] : bb, bb.length == 0 ? ['1'] : bb, base).split('').reverse(), base).split('').reverse();
                                                if (memory.startsWith('-')) {
                                                    // (ac + adi) / denom
                                                    var cc = memory.split('/')[0].split('-')[1].split('').reverse();
                                                    var re = binaryRealDivide(binaryRealMultiply(aa, cc, base).split('').reverse(), denom, base);
                                                    var im = binaryRealDivide(binaryRealMultiply(bb.length == 0 ? ['1'] : bb, cc, base).split('').reverse(), denom, base);
                                                    setMemory(comParse(re, im, '/'));
                                                } else {
                                                    // (-ac - adi) / denom
                                                    var cc = memory.split('/')[0].split('').reverse();
                                                    var re = binaryRealDivide(binaryRealMultiply(aa, cc, base).split('').reverse(), denom, base);
                                                    var im = binaryRealDivide(binaryRealMultiply(bb.length == 0 ? ['1'] : bb, cc, base).split('').reverse(), denom, base);
                                                    setMemory(comParse('-' + re, '-' + im, '/'));
                                                }
                                            } else {
                                                // -di
                                                var aa = value.split('-')[1].split('i')[0].split('').reverse();
                                                if (memory == '0/' || memory == '/') {
                                                    setMemory('0/');
                                                } else {
                                                    if (memory.startsWith('-')) {
                                                        // -ai / d
                                                        setMemory(comParse(base == 1 ? '' : '0', '-' + binaryRealDivide(memory.split('/')[0].split('-')[1].split('').reverse(), aa.length == 0 ? ['1'] : aa, base), '/'));
                                                    } else {
                                                        // ai / d
                                                        setMemory(comParse(base == 1 ? '' : '0', binaryRealDivide(memory.split('/')[0].split('').reverse(), aa.length == 0 ? ['1'] : aa, base), '/'));
                                                    }
                                                }
                                            }
                                        } else if (value.includes('-')) {
                                            // c - di
                                            var aa = value.split('-')[0].split('').reverse();
                                            var bb = value.split('-')[1].split('i')[0].split('').reverse();
                                            var denom = binaryRealAdd(binaryRealMultiply(aa, aa, base).split('').reverse(), binaryRealMultiply(bb.length == 0 ? ['1'] : bb, bb.length == 0 ? ['1'] : bb, base).split('').reverse(), base).split('').reverse();
                                            if (memory.startsWith('-')) {
                                                // (-ac - adi) / denom
                                                var cc = memory.split('/')[0].split('-')[1].split('').reverse();
                                                var re = binaryRealDivide(binaryRealMultiply(aa, cc, base).split('').reverse(), denom, base);
                                                var im = binaryRealDivide(binaryRealMultiply(bb.length == 0 ? ['1'] : bb, cc, base).split('').reverse(), denom, base);
                                                setMemory(comParse('-' + re, '-' + im, '/'));
                                            } else {
                                                // (ac + adi) / denom
                                                var cc = memory.split('/')[0].split('').reverse();
                                                var re = binaryRealDivide(binaryRealMultiply(aa, cc, base).split('').reverse(), denom, base);
                                                var im = binaryRealDivide(binaryRealMultiply(bb.length == 0 ? ['1'] : bb, cc, base).split('').reverse(), denom, base);
                                                setMemory(comParse(re, im, '/'));
                                            }
                                        } else if (value.includes('+')) {
                                            // c + di
                                            var aa = value.split('+')[0].split('').reverse();
                                            var bb = value.split('+')[1].split('i')[0].split('').reverse();
                                            var denom = binaryRealAdd(binaryRealMultiply(aa, aa, base).split('').reverse(), binaryRealMultiply(bb.length == 0 ? ['1'] : bb, bb.length == 0 ? ['1'] : bb, base).split('').reverse(), base).split('').reverse();
                                            if (memory.startsWith('-')) {
                                                // (-ac + adi) / denom
                                                var cc = memory.split('/')[0].split('-')[1].split('').reverse();
                                                var re = binaryRealDivide(binaryRealMultiply(aa, cc, base).split('').reverse(), denom, base);
                                                var im = binaryRealDivide(binaryRealMultiply(bb.length == 0 ? ['1'] : bb, cc, base).split('').reverse(), denom, base);
                                                setMemory(comParse('-' + re, im, '/'));
                                            } else {
                                                // (ac - adi) / denom
                                                var cc = memory.split('/')[0].split('').reverse();
                                                var re = binaryRealDivide(binaryRealMultiply(aa, cc, base).split('').reverse(), denom, base);
                                                var im = binaryRealDivide(binaryRealMultiply(bb.length == 0 ? ['1'] : bb, cc, base).split('').reverse(), denom, base);
                                                setMemory(comParse(re, '-' + im, '/'));
                                            }
                                        } else {
                                            // di
                                            var aa = value.split('i')[0].split('').reverse();
                                            if (memory == '0/' || memory == '/') {
                                                setMemory('0/');
                                            } else {
                                                if (memory.startsWith('-')) {
                                                    // ai / d
                                                    setMemory(comParse(base == 1 ? '' : '0', binaryRealDivide(memory.split('/')[0].split('-')[1].split('').reverse(), aa.length == 0 ? ['1'] : aa, base), '/'));
                                                } else {
                                                    // -ai / d
                                                    setMemory(comParse(base == 1 ? '' : '0', '-' + binaryRealDivide(memory.split('/')[0].split('').reverse(), aa.length == 0 ? ['1'] : aa, base), '/'));
                                                }
                                            }
                                        }
                                    } else {
                                        if (memory.includes('-')) {
                                            var aa = memory.split('/')[0].split('-')[1].split('').reverse();
                                            if (value.includes('-')) {
                                                // negative / negative
                                                setMemory(binaryRealDivide(aa, value.split('-')[1].split('').reverse(), base) + '/');
                                            } else {
                                                // negative / positive
                                                setMemory('-' + binaryRealDivide(aa, value.split('').reverse(), base) + '/');
                                            }
                                        } else {
                                            var aa = memory.split('/')[0].split('').reverse();
                                            if (value.includes('-')) {
                                                // positive / negative
                                                setMemory('-' + binaryRealDivide(aa, value.split('-')[1].split('').reverse(), base) + '/');
                                            } else {
                                                // positive / positive
                                                setMemory(binaryRealDivide(aa, value.split('').reverse(), base) + '/');
                                            }
                                        }
                                    }
                                }
                                break;
                            case '^':
                                if (memory.split('').reverse()[1] == '^') {

                                } else {

                                }
                                break;
                            case '√':
                                break;
                            case 'g':
                                break;
                            default:
                                setValue(memory);
                                break;
                        }
                    }
                    setRepeat(true);
                }
                break;
            case '±':
                setValue(prev => {
                    if (prev == '0' || prev == '') {
                        return prev;
                    } else {
                        if (prev.includes('i')) {
                            if (prev.startsWith('-')) {
                                if (prev.split('-')[1].includes('+')) {
                                    return prev.split('-')[1].split('+')[0] + '-' + prev.split('+')[1];
                                } else if (prev.split('-').length > 2) {
                                    return prev.split('-')[1] + '+' + prev.split('-')[2];
                                } else {
                                    return prev.split('-')[1];
                                }
                            } else {
                                if (prev.includes('+')) {
                                    return '-' + prev.split('+')[0] + '-' + prev.split('+')[1];
                                } else if (prev.includes('-')) {
                                    return '-' + prev.split('-')[0] + '+' + prev.split('-')[1];
                                } else {
                                    return '-' + prev;
                                }
                            }
                        } else {
                            if (prev.includes('-')) {
                                return prev.split('-')[1];
                            } else {
                                return '-' + prev;
                            }
                        }
                    }
                });
                break;
            case 'AC':
                if (base == 1) {
                    setValue('');
                } else {
                    setValue('0');
                }
                setMemory('');
                setRepeat(false);
                break;
            case '>':
                if (base < valsb.length) {
                    setBase(base + 1);
                    var mem = bifurcate(memory);
                    setMemory(convSynt(mem[0].length > 0 ? mem[0] : '0', '11', base, mem[1]));
                    setValue(convSynt(value.length > 0 ? value : '0', '11', base, ''));
                }
                break;
            case '<':
                if (base > 1) {
                    setBase(base - 1);
                    var mem = bifurcate(memory);
                    if (base < 13) {
                        setMemory(convSynt(mem[0].length > 0 ? mem[0] : '0', valsa[base - 1], base, mem[1]));
                        setValue(convSynt(value.length > 0 ? value : '0', valsa[base - 1], base, ''));
                    } else {
                        setMemory(convSynt(mem[0].length > 0 ? mem[0] : '0', valsb[base - 1], base, mem[1]));
                        setValue(convSynt(value.length > 0 ? value : '0', valsb[base - 1], base, ''));
                    }
                }
                break;
            default:
                break;
        }
    }

    return <button className="eqs" onClick={handleClick}>{relation}</button>;
};
export default function App() {
    const [value, setValue] = useState('0');
    const [base, setBase] = useState(10);
    const [values, setValues] = useState(new Array(27).fill(''));
    const [memory, setMemory] = useState('');
    const [repeat, setRepeat] = useState(false);

    useEffect(() => {
        populateCells();
    }, [base]);

    const populateCells = () => {
        var arr = ['<', '>', 'AC', '^^', 'log', '√', '^', '/', '*', '-', '+', 'i', '±', '='];
        if (base == 1) {
            arr.push('|');
        } else if (base < 13) {
            arr.push('e', 'π', '.');
            for (let i = 0; i < base; i++) {
                arr.push(valsa[i]);
            }
        } else {
            arr.push('e', 'π', '.');
            for (let i = 0; i < base; i++) {
                arr.push(valsb[i]);
            }
        }
        setValues(arr);
    }

    const categoriseCell = (value) => {
        switch (value) {
            case '=':
            case '±':
            case 'AC':
            case '>':
            case '<':
                return 'eq';
            case '+':
            case '-':
            case '*':
            case '/':
            case '^':
            case '√':
            case 'log':
            case '^^':
                return 'op';
            default:
                return 'num';
        }
    }

    return (
        <div className="app7">
            <div aria-live="polite">{"Base " + base}</div>
            <div className="ans">{repeat ? truncate(memory) : value}</div>
            <div className="board7" style={{ gridTemplateColumns: 'repeat( ' + Math.floor(Math.sqrt(values.length)).toString() + ', 1fr)' }}>
                {values.map((val) => ((categoriseCell(val) == 'eq') ? (<Eq relation={val} base={base} value={value} setValue={setValue} setBase={setBase} memory={memory} setMemory={setMemory} setRepeat={setRepeat} />) : ((categoriseCell(val) == 'op') ? (<Op operation={val} value={value} setValue={setValue} setMemory={setMemory} repeat={repeat} setRepeat={setRepeat} />) : (<Cell value={val} setValue={setValue} base={base} setMemory={setMemory} repeat={repeat} setRepeat={setRepeat} />))))}
            </div>
        </div>
    );
}