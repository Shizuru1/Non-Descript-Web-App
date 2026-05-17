import React from "react";

import "./styles.css";

const valsa = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'X', 'Ɛ'];
const valsb = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'α', 'β', 'γ', 'δ', 'ε', 'ζ', 'η', 'θ', 'ι', 'κ', 'λ', 'μ', 'ν', 'ξ', 'ο', 'Π', 'ρ', 'ς', 'τ', 'υ', 'φ', 'χ', 'ψ', 'ω'];

const convertInt = (num, base) => {
    var result = '';
    var bValues = base.values.slice(17);
    var power = Math.floor(Math.log(num) / Math.log(base.num));
    var next = num;
    for (let i = power; i >= 0; i--) {
        var digit = Math.floor(next / (base.num ** i));
        if (result == '' && digit == 0) {
            continue;
        } else {
            result += bValues[digit];
            next -= (digit * (base.num ** i));
        }
    }
    if (result == '') {
        result = bValues[0];
    }
    return result;
}

const convertDec = (num, base) => {
    var result = '';
    var bValues = base.values.slice(17);
    var power = Math.floor(Math.log10(num)) + 1;
    var exp = 10 ** power;
    var next = num;
    for (let i = 1; i <= Math.min(power, 15); i++) {
        var frac = (1 / (base.num ** i)) * exp;
        var digit = Math.floor(next / frac);
        result += bValues[digit];
        next -= (digit * frac);
    }
    if (result.endsWith(bValues[0])) {
        result = result.slice(0, result.split('').findLastIndex(value => value != bValues[0]));
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
    if (base.num == 1) {
        for (let i = 0; i < aa.length + bb.length; i++) {
            result += base.values[14];
        }
    } else {
        var bValues = base.values.slice(17);
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
                    var mm = bValues.findIndex(val => val == aa[i + beginDecA]);
                    var nn = bValues.findIndex(val => val == bb[i + beginDecB]);
                    var oo = mm + nn + rem;
                    result += bValues[oo % base.num];
                    rem = Math.floor(oo / base.num);
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
            var pp = bValues.findIndex(val => val == aaa[i]);
            var qq = bValues.findIndex(val => val == bbb[i]);
            var rr = pp + qq + rem;
            result += bValues[rr % base.num];
            rem = Math.floor(rr / base.num);
        }
        if (aaa.length > bbb.length) {
            for (let i = bbb.length; i < aaa.length; i++) {
                var vv = bValues.findIndex(val => val == aaa[i]);
                var ww = vv + rem;
                result += bValues[ww % base.num];
                rem = Math.floor(ww / base.num);
            }
        } else if (bbb.length > aaa.length) {
            for (let i = aaa.length; i < bbb.length; i++) {
                var xx = bValues.findIndex(val => val == bbb[i]);
                var yy = xx + rem;
                result += bValues[yy % base.num];
                rem = Math.floor(yy / base.num);
            }
        }
        if (rem > 0) {
            if (rem > base.num) {
                for (let i = 0; i < Math.ceil(Math.log(rem) / Math.log(base.num)); i++) {
                    var zz = rem % base.num;
                    result += bValues[zz];
                    rem = Math.floor(rem / base.num);
                }
            } else {
                result += bValues[rem];
            }
        }
        if (result.includes('.')) {
            while (result.startsWith(bValues[0])) {
                result = result.slice(1, result.length);
            }
        }
        if (result.startsWith('.')) {
            result = result.slice(1, result.length);
        }
        while (result.endsWith(bValues[0])) {
            if (result.length > 1) {
                result = result.slice(0, result.length - 1);
            } else {
                break;
            }
        }
        if (result.endsWith('.')) {
            result += bValues[0];
        }
    }
    return result.split('').reverse().join('');
}

const binaryRealSubtract = (aa, bb, base) => {
    var result = '';
    if (base.num == 1) {
        if (aa.length > bb.length) {
            for (let i = 0; i < aa.length - bb.length; i++) {
                result += base.values[14];
            }
        } else if (bb.length > aa.length) {
            result += '-';
            for (let i = 0; i < bb.length - aa.length; i++) {
                result += base.values[14];
            }
        } else {
            return '';
        }
    } else {
        var bValues = base.values.slice(17);
        if (aa.length == bb.length) {
            if (aa.every((value, index) => value == bb[index])) {
                return bValues[0];
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
                        var digA = bValues.findIndex(val => val == aa[aa.length - i]);
                        var digB = bValues.findIndex(val => val == bb[bb.length - i]);
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
                            var cc = bValues.findIndex(val => val == aa[i]);
                            result += bValues[base.num - rem - cc];
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
                            var cc = bValues.findIndex(val => val == bb[i]);
                            result += bValues[base.num - rem - cc];
                            rem = 1;
                        }
                    }
                }
                if (neg) {
                    for (let i = 0; i < remDec; i++) {
                        var ff = bValues.findIndex(val => val == aa[i + beginDecA]);
                        var gg = bValues.findIndex(val => val == bb[i + beginDecB]);
                        var hh = gg - ff - rem;
                        if (hh < 0) {
                            rem = Math.ceil(Math.abs(hh) / base.num);
                            hh += (base.num * rem);
                        } else {
                            rem = 0;
                        }
                        result += bValues[hh % base.num];
                    }
                } else {
                    for (let i = 0; i < remDec; i++) {
                        var ff = bValues.findIndex(val => val == aa[i + beginDecA]);
                        var gg = bValues.findIndex(val => val == bb[i + beginDecB]);
                        var hh = ff - gg - rem;
                        if (hh < 0) {
                            rem = Math.ceil(Math.abs(hh) / base.num);
                            hh += (base.num * rem);
                        } else {
                            rem = 0;
                        }
                        result += bValues[hh % base.num];
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
                        var digA = bValues.findIndex(val => val == aa[aa.length - i]);
                        var digB = bValues.findIndex(val => val == bb[bb.length - i]);
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
                        var jj = bValues.findIndex(val => val == aa[i]);
                        var kk = 0;
                        var ll = kk - jj - rem;
                        if (ll < 0) {
                            rem = Math.ceil(Math.abs(ll) / base.num);
                            ll += (base.num * rem);
                        } else {
                            rem = 0;
                        }
                        result += bValues[ll % base.num];
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
                    var digA = bValues.findIndex(val => val == aa[aa.length - i]);
                    var digB = bValues.findIndex(val => val == bb[bb.length - i]);
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
                    var jj = 0;
                    var kk = bValues.findIndex(val => val == bb[i]);
                    var ll = jj - kk - rem;
                    if (ll < 0) {
                        rem = Math.ceil(Math.abs(ll) / base.num);
                        ll += (base.num * rem);
                    } else {
                        rem = 0;
                    }
                    result += bValues[ll % base.num];
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
                    var digA = bValues.findIndex(val => val == aaa[aaLen - i]);
                    var digB = bValues.findIndex(val => val == bbb[bbLen - i]);
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
                var mm = bValues.findIndex(val => val == aaa[i]);
                var nn = bValues.findIndex(val => val == bbb[i]);
                var oo = nn - mm - rem;
                if (oo < 0) {
                    rem = Math.ceil(Math.abs(oo) / base.num);
                    oo += (base.num * rem);
                } else {
                    rem = 0;
                }
                result += bValues[oo % base.num];
            }
        } else {
            for (let i = 0; i < Math.min(aaa.length, bbb.length); i++) {
                var mm = bValues.findIndex(val => val == aaa[i]);
                var nn = bValues.findIndex(val => val == bbb[i]);
                var oo = mm - nn - rem;
                if (oo < 0) {
                    rem = Math.ceil(Math.abs(oo) / base.num);
                    oo += (base.num * rem);
                } else {
                    rem = 0;
                }
                result += bValues[oo % base.num];
            }
        }
        if (aaa.length > bbb.length) {
            for (let i = bbb.length; i < aaa.length; i++) {
                var pp = bValues.findIndex(val => val == aaa[i]);
                var qq = pp - rem;
                if (qq < 0) {
                    rem = Math.ceil(Math.abs(qq) / base.num);
                    qq += (base.num * rem);
                } else {
                    rem = 0;
                }
                result += bValues[qq % base.num];
            }
        } else if (bbb.length > aaa.length) {
            for (let i = aaa.length; i < bbb.length; i++) {
                var pp = bValues.findIndex(val => val == bbb[i]);
                var qq = pp - rem;
                if (qq < 0) {
                    rem = Math.ceil(Math.abs(qq) / base.num);
                    qq += (base.num * rem);
                } else {
                    rem = 0;
                }
                result += bValues[qq % base.num];
            }
        }
        if (result.includes('.')) {
            while (result.startsWith(bValues[0])) {
                result = result.slice(1, result.length);
            }
        }
        if (result.startsWith('.')) {
            result = result.slice(1, result.length);
        }
        while (result.endsWith(bValues[0])) {
            if (result.length > 1) {
                result = result.slice(0, result.length - 1);
            } else {
                break;
            }
        }
        if (result.endsWith('.')) {
            result += bValues[0];
        }
        if (neg) {
            result += '-';
        }
    }
    return result.split('').reverse().join('');
}

const binaryRealMultiply = (aa, bb, base) => {
    var result = '';
    if (base.num == 1) {
        for (let i = 0; i < aa.length * bb.length; i++) {
            result += base.values[14];
        }
    } else {
        var bValues = base.values.slice(17);
        if (aa.length == 1) {
            if (aa[0] == bValues[0]) {
                return bValues[0];
            }
        }
        if (bb.length == 1) {
            if (bb[0] == bValues[0]) {
                return bValues[0];
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
                resultArr[i] += bValues[0];
            }
            for (let j = 0; j < cc.length; j++) {
                if (cc[j] == '.') {
                    continue;
                }
                var ee = bValues.findIndex(val => val == cc[j]);
                var ff = bValues.findIndex(val => val == dd[i]);
                var gg = ee * ff + rem;
                resultArr[i] += bValues[gg % base.num];
                rem = Math.floor(gg / base.num);
            }
            var remDec = 0;
            if (rem > 0) {
                remDec = Math.ceil(Math.log(rem) / Math.log(base.num));
                for (let l = 0; l < remDec; l++) {
                    resultArr[i] += bValues[rem % base.num];
                    rem = Math.floor(rem / base.num);
                }
                if (remDec == 0) {
                    remDec = 1;
                    resultArr[i] += '1';
                }
                rem = 0;
            }
            if (k >= cc.length + remDec) {
                for (let n = cc.length + remDec; n <= k; n++) {
                    resultArr[i] += bValues[0];
                }
                resultArr[i] += ('.' + bValues[0]);
            } else if (k > 0) {
                resultArr[i] = resultArr[i].slice(0, k) + '.' + resultArr[i].slice(k, resultArr[i].length);
            }
        }
        for (let i = 0; i < resultArr.length; i++) {
            while (resultArr[i].endsWith(bValues[0])) {
                if (resultArr[i].length > 1) {
                    resultArr[i] = resultArr[i].slice(0, resultArr[i].length - 1);
                } else {
                    break;
                }
            }
            result = binaryRealAdd(result.split('').reverse(), resultArr[i].split(''), base);
        }
        if (result.length > 17) {
            if (result.includes('.')) {
                if (bValues.findIndex(val => val == result.split('')[17]) >= (base.num / 2)) {
                    result = result.slice(0, 17);
                    var replc = [];
                    var lenLen = result.length;
                    for (let i = 0; i < lenLen; i++) {
                        if (result.endsWith('.')) {
                            continue;
                        }
                        if (result.endsWith(bValues[base.num - 1])) {
                            replc.splice(0, 0, bValues[0]);
                        } else {
                            replc.splice(0, 0, bValues[bValues.findIndex(val => val == result.split('')[result.length - 1]) + 1]);
                            result = result.slice(0, result.length - 1);
                            break;
                        }
                        result = result.slice(0, result.length - 1);
                    }
                    result = result += replc.join('');
                } else {
                    result = result.slice(0, 17);
                }
            }
        }
        while (result.startsWith(bValues[0])) {
            result = result.slice(1, result.length);
        }
        if (result.startsWith('.')) {
            result = bValues[0] + result;
        }
    }
    return result;
}

const binaryRealDivide = (aa, bb, base) => {
    var result = '';
    if (base.num == 1) {
        for (let i = 0; i < Math.floor(aa.length / bb.length); i++) {
            result += base.values[14];
        }
    } else {
        var bValues = base.values.slice(17);
        if (aa.length == bb.length) {
            if (aa.every((value, index) => value == bb[index])) {
                return bValues[1];
            }
        }
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
                if (last[0] == bValues[0]) {
                    last.splice(0, 1);
                }
                last = binaryRealAdd(last.reverse(), cc[i], base).split('');
            } else {
                if (last[0] == bValues[0]) {
                    last.splice(0, 1, cc[i]);
                } else {
                    last.push(cc[i]);
                }
            }
            for (let j = 0; j < base.num; j++) {
                var k = binaryRealSubtract(last.reverse(), bb, base);
                if (k.startsWith('-')) {
                    result += bValues[j];
                    last = binaryRealSubtract(bb, k.split('-')[1].split('').reverse(), base).split('');
                    break;
                } else if (k == bValues[0]) {
                    result += bValues[(j + 1) % base.num];
                    last = [];
                    break;
                } else {
                    last = k.split('');
                    if (j == base.num - 1) {
                        var replc = [];
                        var lenLen = result.length;
                        for (let i = 0; i < lenLen; i++) {
                            if (result.endsWith('.')) {
                                continue;
                            }
                            if (result.endsWith(bValues[base.num - 1])) {
                                replc.splice(0, 0, bValues[0]);
                            } else {
                                replc.splice(0, 0, bValues[bValues.findIndex(val => val == result.split('')[result.length - 1]) + 1]);
                                result = result.slice(0, result.length - 1);
                                break;
                            }
                            result = result.slice(0, result.length - 1);
                        }
                        result = result += replc.join('');
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
                    if (last[0] == bValues[0]) {
                        last.splice(0, 1);
                    }
                    last = binaryRealAdd(last.reverse(), [cc[i]], base).split('');
                } else {
                    if (last[0] != bValues[0]) {
                        last.push(bValues[0]);
                    }
                }
                if (!result.includes('.')) {
                    result += '.';
                }
                for (let j = 0; j < base.num; j++) {
                    var l = binaryRealSubtract(last.reverse(), bb, base);
                    if (l.startsWith('-')) {
                        result += bValues[j];
                        last = binaryRealSubtract(bb, l.split('-')[1].split('').reverse(), base).split('');
                        break;
                    } else if (l == bValues[0]) {
                        result += bValues[(j + 1) % base.num];
                        last = [];
                        break;
                    } else {
                        last = l.split('');
                        if (j == base.num - 1) {
                            var replc = [];
                            var lenLen = result.length;
                            for (let i = 0; i < lenLen; i++) {
                                if (result.endsWith('.')) {
                                    continue;
                                }
                                if (result.endsWith(bValues[base.num - 1])) {
                                    replc.splice(0, 0, bValues[0]);
                                } else {
                                    replc.splice(0, 0, bValues[bValues.findIndex(val => val == result.split('')[result.length - 1]) + 1]);
                                    result = result.slice(0, result.length - 1);
                                    break;
                                }
                                result = result.slice(0, result.length - 1);
                            }
                            result = result += replc.join('');
                        }
                    }
                }
            }
        }
        if (result.length > 17) {
            if (bValues.findIndex(val => val == result.split('')[result.length - 1]) >= (base.num / 2)) {
                result = result.slice(0, result.length - 1);
                var replc = [];
                var lenLen = result.length;
                for (let i = 0; i < lenLen; i++) {
                    if (result.endsWith('.')) {
                        continue;
                    }
                    if (result.endsWith(bValues[base.num - 1])) {
                        replc.splice(0, 0, bValues[0]);
                    } else {
                        replc.splice(0, 0, bValues[bValues.findIndex(val => val == result.split('')[result.length - 1]) + 1]);
                        result = result.slice(0, result.length - 1);
                        break;
                    }
                    result = result.slice(0, result.length - 1);
                }
                result = result += replc.join('');
            } else {
                result = result.slice(0, result.length - 1);
            }
        }
        if (result.includes('.')) {
            while (result.endsWith(bValues[0])) {
                result = result.slice(0, result.length - 1);
            }
        }
        if (result.endsWith('.')) {
            result = result.slice(0, result.length - 1);
        }
        while (result.startsWith(bValues[0])) {
            result = result.slice(1, result.length);
        }
        if (result.startsWith('.')) {
            result = bValues[0] + result;
        }
    }
    return result;
}

const binaryRealExponentiate = (aa, bb, base) => {
    var result = '';
    if (base.num == 1) {
        for (let i = 0; i < aa.length ** bb.length; i++) {
            result += '|';
        }
    } else {
        // exponentiate
    }
}

const binaryRealRoot = (aa, bb, base) => {
    var result = '';
    if (base.num == 1) {
        for (let i = 0; i < Math.floor(aa.length ** (1 / bb.length)); i++) {
            result += '|';
        }
    } else {
        // root
    }
}

const binaryRealLogarithm = (aa, bb, base) => {
    var result = '';
    if (base.num == 1) {
        for (let i = 0; Math.floor(Math.log(bb.length) / Math.log(aa.length)); i++) {
            result += '|';
        }
    } else {
        // logarithm
    }
}

const binaryRealTetrate = (aa, bb, base) => {
    var result = '';
    if (base.num == 1) {
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
        result[0] = base.values[17] + reMul.slice(reMul.split('').findIndex(val => val == '.'), reMul.length);
        result[1] = reMul.slice(0, reMul.split('') .findIndex(val => val == '.'));
    } else {
        result[0] = base.values[17];
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

const comParse = (re, im, op, base) => {
    var result = '';
    var nzr = false;
    var nzi = false;
    if (base.num == 1) {
        var bValues = ['', base.values[14]];
    } else {
        var bValues = base.values.slice(17);
    }
    if (re != bValues[0] && re != '') {
        result += re;
        nzr = true;
    }
    if (im != bValues[0] && im != '') {
        if (im == bValues[1]) {
            if (nzr) {
                result += '+';
            }
            result += 'i';
        } else if (im == ('-' + bValues[1])) {
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
    if (base.num == 1) {
        if (mul.length == 2) {
            var rom = '';
            for (let i = 0; i < num.length; i++) {
                rom = binaryRealAdd(rom.split('').reverse(), base.values.length < 16 ? ['1'] : [base.values[15]], { num: 2, values: base.values });
            }
            return rom;
        }
    }
    if (base.num == 2) {
        if (mul.length == 1) {
            if (num.includes('.')) {
                var conv = num.slice(num.findIndex(val => val == '.') + 1, num.length);
            } else {
                var conv = num.slice(0, num.length);
            }
            var tally = '';
            while (conv.length > 1 || conv[0] != base.values[17]) {
                tally += ((base.values.length == 19 && base.values[18] == '1' && base.values[17] == '0') || base.values.length == 17) ? '|' : base.values[17];
                conv = binaryRealSubtract(conv, [base.values[18]], base).split('').reverse();
            }
            return tally;
        }
    }
    if (num.includes('.')) {
        var whl = '';
        var whlBfr = num.slice(num.findIndex(val => val == '.') + 1);
        while (whlBfr.length > 1 || whlBfr[0] != base.values[17]) {
            var whlArr = binaryDivMod(whlBfr, mul, base);
            if (whlArr[1].length > 1) {
                whl = (base.values.length > (17 + base.num) ? base.values[17 + base.num] : (base.num < 12 ? valsa[base] : valsb[base])) + whl;
            } else {
                whl = whlArr[1] + whl;
            }
            whlBfr = whlArr[0].split('').reverse();
        }
        if (whl === '') {
            whl = base.values[17];
        }
        var dec = '';
        var decBfr = num.slice(0, num.findIndex(val => val == '.'));
        while (decBfr.length > 1 || decBfr[0] != base.values[17]) {
            var decArr = binaryDecMod(decBfr, mul, base);
            if (decArr[1].length > 1) {
                dec += (base.values.length > (17 + base.num) ? base.values[17 + base.num] : (base.num < 12 ? valsa[base] : valsb[base]));
            } else {
                dec += decArr[1];
            }
            decBfr = decArr[0].split('').reverse();
        }
        return whl + '.' + dec;
    } else {
        var nmbr = '';
        var nmbrBfr = num;
        while (nmbrBfr.length > 1 || nmbrBfr[0] != base.values[17]) {
            var nmbrArr = binaryDivMod(nmbrBfr, mul, base);
            if (nmbrArr[1].length > 1) {
                nmbr = (base.values.length > (17 + base.num) ? base.values[17 + base.num] : (base.num < 12 ? valsa[base] : valsb[base])) + nmbr;
            } else {
                if (mul.length > 1) {
                    if (base.num == 12) {
                        if ((base.values.length <= 29 && valsb.slice(0, 13).includes(nmbrArr[1])) || base.values.length > 29) {
                            nmbr = nmbrArr[1] + nmbr;
                        } else {
                            nmbr = valsb[base.values.findIndex(val => val == nmbrArr[1])] + nmbr;
                        }
                    } else {
                        nmbr = nmbrArr[1] + nmbr;
                    }
                } else {
                    if (base.num == 13) {
                        if (length == 30 && base.values.slice(17).toString() == valsb.slice(0, 13).toString() && valsa.includes(nmbrArr[1])) {
                            nmbr = nmbrArr[1] + nmbr;
                        } else {
                            nmbr = valsa[base.values.findIndex(val => val == nmbrArr[1])] + nmbr;
                        }
                    } else {
                        nmbr = nmbrArr[1] + nmbr;
                    }
                }
            }
            nmbrBfr = nmbrArr[0].split('').reverse();
        }
        if (nmbr === '') {
            nmbr = base.values[17];
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
                var im = '-' + convSyntSngl(bb.length == 0 ? (base.num == 1 ? [base.values[14]] : [base.values[18]]) : bb, mul, base);
                return comParse(re, im, suff, base);
            } else if (num.split('-')[1].includes('+')) {
                // -a + bi
                var aa = num.split('-')[1].split('+')[0].split('').reverse();
                var bb = num.split('+')[1].split('i')[0].split('').reverse();
                var re = '-' + convSyntSngl(aa, mul, base);
                var im = convSyntSngl(bb.length == 0 ? (base.num == 1 ? [base.values[14]] : [base.values[18]]) : bb, mul, base);
                return comParse(re, im, suff, base);
            } else {
                // -bi
                var bb = num.split('-')[1].split('i')[0].split('').reverse();
                var im = '-' + convSyntSngl(bb.length == 0 ? (base.num == 1 ? [base.values[14]] : [base.values[18]]) : bb, mul, base);
                return comParse(base.num == 1 ? '' : base.values[17], im, suff, base);
            }
        } else if (num.includes('-')) {
            // a - bi
            var aa = num.split('-')[0].split('').reverse();
            var bb = num.split('-')[1].split('i')[0].split('').reverse();
            var re = convSyntSngl(aa, mul, base);
            var im = '-' + convSyntSngl(bb.length == 0 ? (base.num == 1 ? [base.values[14]] : [base.values[18]]) : bb, mul, base)
            return comParse(re, im, suff, base);
        } else if (num.includes('+')) {
            // a + bi
            var aa = num.split('+')[0].split('').reverse();
            var bb = num.split('+')[1].split('i')[0].split('').reverse();
            var re = convSyntSngl(aa, mul, base);
            var im = convSyntSngl(bb.length == 0 ? (base.num == 1 ? [base.values[14]] : [base.values[18]]) : bb, mul, base);
            return comParse(re, im, suff, base);
        } else {
            // bi
            var bb = num.split('i')[0].split('').reverse();
            var im = convSyntSngl(bb.length == 0 ? (base.num == 1 ? [base.values[14]] : [base.values[18]]) : bb, mul, base);
            return comParse(base.num == 1 ? '' : base.values[17], im, suff, base);
        }
    } else {
        if (num.includes('-')) {
            // -a
            var aa = num.split('-')[1].split('').reverse();
            var re = '-' + convSyntSngl(aa, mul, base);
            return comParse(re, base.num == 1 ? '' : base.values[17], suff, base);
        } else {
            // a
            var aa = num.split('').reverse();
            var re = convSyntSngl(aa, mul, base);
            return comParse(re, base.num == 1 ? '' : base.values[17], suff, base);
        }
    }
}

const Cell = (props) => {
    const { value, values, setValues, base } = props;

    const handleClick = () => {
        switch (value) {
            case 'π':
                var val = '3.1415926535897932';
                setValues({ value: convert(val, base), memory: (values.repeat ? '' : values.memory), repeat: false });
                break;
            case 'e':
                var val = '2.7182818284590452';
                setValues({ value: convert(val, base), memory: (values.repeat ? '' : values.memory), repeat: false });
                break;
            case 'i':
                setValues({
                    value: (values.repeat ? 'i' :
                        ((values.value == '|' || values.value == '0' || values.value == '1' || values.value == '0.' || values.value == '1.' || values.value == 'i' || values.value == '-i') ?
                            'i' : ((values.value == '-1' || values.value == '-1.') ? '-i' : (values.value.includes('i') ? values.value : (values.value + 'i'))))),
                    memory: (values.repeat ? '' : values.memory),
                    repeat: false
                });
                break;
            case '.':
                setValues({
                    value: (values.repeat ? '0.' :
                        (values.value == '' ? '0.' : (values.value.includes('.') ? values.value :
                            (values.value == 'i' ? '1.i' : (values.value == '-i' ? '-1.i' :
                                (values.value.includes('i') ? (values.value.split('i')[0] + '.i') : (values.value + '.'))))))),
                    memory: (values.repeat ? '' : values.memory),
                    repeat: false
                });
                break;
            default:
                setValues({
                    value: (values.repeat ? value :
                        (values.value == '0' ? value : (values.value.includes('i') ? (values.value.split('i')[0] + value + 'i') : (values.value + value)))),
                    memory: (values.repeat ? '' : values.memory),
                    repeat: false
                });
                break;
        }
    }

    return <button className="cell5" onClick={handleClick}>{value}</button>;
};

const Op = (props) => {
    const { operation, values, setValues } = props;

    const handleClick = () => {
        if (values.value != '') {
            setValues({ value: '', memory: ((values.repeat ? truncate(values.memory) : values.value) + operation), repeat: false });
        }
    }

    return <button className="ops" onClick={handleClick}>{operation}</button>;
};

const Eq = (props) => {
    const { relation, base, values, setValues, baseIncrement, baseDecrement } = props;

    const handleClick = () => {
        switch (relation) {
            case '=':
                if (values.memory != '') {
                    if (values.value == '') {
                        setValues({ value: truncate(values.memory), memory: values.memory, repeat: true });
                    } else {
                        switch (values.memory.split('').reverse()[0]) {
                            case '+':
                                if (values.memory.includes('i')) {
                                    // complex
                                    if (values.value.includes('i')) {
                                        // values.value is imaginary
                                        if (values.memory.startsWith('-')) {
                                            // -a + bi, -a - bi, -bi
                                            if (values.memory.split('-').length > 2) {
                                                // -a - bi
                                                var aa = values.memory.split('-')[1].split('').reverse();
                                                var cc = values.memory.split('-')[2].split('i')[0].split('').reverse();
                                                if (values.value.startsWith('-')) {
                                                    // -c + di, -c - di, -di
                                                    if (values.value.split('-').length > 2) {
                                                        // -c - di
                                                        var bb = values.value.split('-')[1].split('').reverse();
                                                        var dd = values.value.split('-')[2].split('i')[0].split('').reverse();
                                                        var re = binaryRealAdd(aa, bb, base);
                                                        var im = binaryRealAdd(cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) :cc, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base);
                                                        setValues({ value: values.value, memory: comParse('-' + re, '-' + im, '+', base), repeat: true });
                                                    } else if (values.value.includes('+')) {
                                                        // -c + di
                                                        var bb = values.value.split('+')[0].split('-')[1].split('').reverse();
                                                        var dd = values.value.split('+')[1].split('i')[0].split('').reverse();
                                                        var re = binaryRealAdd(aa, bb, base);
                                                        var im = binaryRealSubtract(dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, base);
                                                        setValues({ value: values.value, memory: comParse('-' + re, im, '+', base), repeat: true });
                                                    } else {
                                                        // -di
                                                        var dd = values.value.split('-')[1].split('i')[0].split('').reverse();
                                                        var re = values.memory.split('-')[1];
                                                        var im = binaryRealAdd(cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base);
                                                        setValues({ value: values.value, memory: comParse('-' + re, '-' + im, '+', base), repeat: true });
                                                    }
                                                } else if (values.value.includes('-')) {
                                                    // c - di
                                                    var bb = values.value.split('-')[0].split('').reverse();
                                                    var dd = values.value.split('-')[1].split('i')[0].split('').reverse();
                                                    var re = binaryRealSubtract(bb, aa, base);
                                                    var im = binaryRealAdd(cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base);
                                                    setValues({ value: values.value, memory: comParse(re, '-' + im, '+', base), repeat: true });
                                                } else if (values.value.includes('+')) {
                                                    // c + di
                                                    var bb = values.value.split('+')[0].split('').reverse();
                                                    var dd = values.value.split('+')[1].split('i')[0].split('').reverse();
                                                    var re = binaryRealSubtract(bb, aa, base);
                                                    var im = binaryRealSubtract(dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, base);
                                                    setValues({ value: values.value, memory: comParse(re, im, '+', base), repeat: true });
                                                } else {
                                                    // di
                                                    var dd = values.value.split('i')[0].split('').reverse();
                                                    var re = values.memory.split('-')[1];
                                                    var im = binaryRealSubtract(dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, base);
                                                    setValues({ value: values.value, memory: comParse('-' + re, im, '+', base), repeat: true });
                                                }
                                            } else if (values.memory.split('+').length > 2) {
                                                // -a + bi
                                                var aa = values.memory.split('+')[0].split('-')[1].split('').reverse();
                                                var cc = values.memory.split('+')[1].split('i')[0].split('').reverse();
                                                if (values.value.startsWith('-')) {
                                                    // -c + di, -c - di, -di
                                                    if (values.value.split('-').length > 2) {
                                                        // -c - di
                                                        var bb = values.value.split('-')[1].split('').reverse();
                                                        var dd = values.value.split('-')[2].split('i')[0].split('').reverse();
                                                        var re = binaryRealAdd(aa, bb, base);
                                                        var im = binaryRealSubtract(cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base);
                                                        setValues({ value: values.value, memory: comParse('-' + re, im, '+', base), repeat: true });
                                                    } else if (values.value.includes('+')) {
                                                        // -c + di
                                                        var bb = values.value.split('+')[0].split('-')[1].split('').reverse();
                                                        var dd = values.value.split('+')[1].split('i')[0].split('').reverse();
                                                        var re = binaryRealAdd(aa, bb, base);
                                                        var im = binaryRealAdd(cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base);
                                                        setValues({ value: values.value, memory: comParse('-' + re, im, '+', base), repeat: true });
                                                    } else {
                                                        // -di
                                                        var dd = values.value.split('-')[1].split('i')[0].split('').reverse();
                                                        var re = values.memory.split('+')[0];
                                                        var im = binaryRealSubtract(cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base);
                                                        setValues({ value: values.value, memory: comParse(re, im, '+', base), repeat: true });
                                                    }
                                                } else if (values.value.includes('-')) {
                                                    // c - di
                                                    var bb = values.value.split('-')[0].split('').reverse();
                                                    var dd = values.value.split('-')[1].split('i')[0].split('').reverse();
                                                    var re = binaryRealSubtract(bb, aa, base);
                                                    var im = binaryRealSubtract(cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base)
                                                    setValues({ value: values.value, memory: comParse(re, im, '+', base), repeat: true });
                                                } else if (values.value.includes('+')) {
                                                    // c + di
                                                    var bb = values.value.split('+')[0].split('').reverse();
                                                    var dd = values.value.split('+')[1].split('i')[0].split('').reverse();
                                                    var re = binaryRealSubtract(bb, aa, base);
                                                    var im = binaryRealAdd(cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base);
                                                    setValues({ value: values.value, memory: comParse(re, im, '+', base), repeat: true });
                                                } else {
                                                    // di
                                                    var dd = values.value.split('i')[0].split('').reverse();
                                                    var re = values.memory.split('+')[0];
                                                    var im = binaryRealAdd(cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base);
                                                    setValues({ value: values.value, memory: comParse(re, im, '+', base), repeat: true });
                                                }
                                            } else {
                                                // -bi
                                                var aa = values.memory.split('-')[1].split('i')[0].split('').reverse();
                                                if (values.value.startsWith('-')) {
                                                    // -c + di, -c - di, -di
                                                    if (values.value.split('-').length > 2) {
                                                        // -c - di
                                                        var bb = values.value.split('-')[2].split('i')[0].split('').reverse();
                                                        var re = values.value.split('-')[1];
                                                        var im = binaryRealAdd(aa.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : aa, bb.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : bb, base);
                                                        setValues({ value: values.value, memory: comParse('-' + re, '-' + im, '+', base), repeat: true });
                                                    } else if (values.value.includes('+')) {
                                                        // -c + di
                                                        var bb = values.value.split('+')[1].split('i')[0].split('').reverse();
                                                        var re = values.value.split('+')[0];
                                                        var im = binaryRealSubtract(bb.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : bb, aa.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : aa, base);
                                                        setValues({ value: values.value, memory: comParse(re, im, '+', base), repeat: true });
                                                    } else {
                                                        // -di
                                                        var bb = values.value.split('-')[1].split('i')[0].split('').reverse();
                                                        var im = binaryRealAdd(aa.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : aa, bb.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : bb, base);
                                                        setValues({ value: values.value, memory: comParse(base == 1 ? '' : (base.values.length > 17 ? base.values[17] : '0'), '-' + im, '+', base), repeat: true });
                                                    }
                                                } else if (values.value.includes('-')) {
                                                    // c - di
                                                    var bb = values.value.split('-')[1].split('i')[0].split('').reverse();
                                                    var re = values.value.split('-')[0];
                                                    var im = binaryRealAdd(aa.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : aa, bb.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : bb, base)
                                                    setValues({ value: values.value, memory: comParse(re, '-' + im, '+', base), repeat: true });
                                                } else if (values.value.includes('+')) {
                                                    // c + di
                                                    var bb = values.value.split('+')[1].split('i')[0].split('').reverse();
                                                    var re = values.value.split('+')[0];
                                                    var im = binaryRealSubtract(bb.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : bb, aa.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : aa, base);
                                                    setValues({ value: values.value, memory: comParse(re, im, '+', base), repeat: true });
                                                } else {
                                                    // di
                                                    var bb = values.value.split('i')[0].split('').reverse();
                                                    var im = binaryRealSubtract(bb.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : bb, aa.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : aa, base);
                                                    setValues({ value: values.value, memory: comParse(base == 1 ? '' : (base.values.length > 17 ? base.values[17] : '0'), im, '+', base), repeat: true });
                                                }
                                            }
                                        } else if (values.memory.includes('-')) {
                                            // a - bi
                                            var aa = values.memory.split('-')[0].split('').reverse();
                                            var cc = values.memory.split('-')[1].split('i')[0].split('').reverse();
                                            if (values.value.startsWith('-')) {
                                                // -c + di, -c - di, -di
                                                if (values.value.split('-').length > 2) {
                                                    // -c - di
                                                    var bb = values.value.split('-')[1].split('').reverse();
                                                    var dd = values.value.split('-')[2].split('i')[0].split('').reverse();
                                                    var re = binaryRealSubtract(aa, bb, base);
                                                    var im = binaryRealAdd(cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base);
                                                    setValues({ value: values.value, memory: comParse(re, '-' + im, '+', base), repeat: true });
                                                } else if (values.value.includes('+')) {
                                                    // -c + di
                                                    var bb = values.value.split('+')[0].split('-')[1].split('').reverse();
                                                    var dd = values.value.split('+')[1].split('i')[0].split('').reverse();
                                                    var re = binaryRealSubtract(aa, bb, base);
                                                    var im = binaryRealSubtract(dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, base);
                                                    setValues({ value: values.value, memory: comParse(re, im, '+', base), repeat: true });
                                                } else {
                                                    // -di
                                                    var dd = values.value.split('-')[1].split('i')[0].split('').reverse();
                                                    var re = values.memory.split('-')[0];
                                                    var im = binaryRealAdd(cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base);
                                                    setValues({ value: values.value, memory: comParse(re, '-' + im, '+', base), repeat: true });
                                                }
                                            } else if (values.value.includes('-')) {
                                                // c - di
                                                var bb = values.value.split('-')[0].split('').reverse();
                                                var dd = values.value.split('-')[1].split('i')[0].split('').reverse();
                                                var re = binaryRealAdd(aa, bb, base);
                                                var im = binaryRealAdd(cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base);
                                                setValues({ value: values.value, memory: comParse(re, '-' + im, '+', base), repeat: true });
                                            } else if (values.value.includes('+')) {
                                                // c + di
                                                var bb = values.value.split('+')[0].split('').reverse();
                                                var dd = values.value.split('+')[1].split('i')[0].split('').reverse();
                                                var re = binaryRealAdd(aa, bb, base);
                                                var im = binaryRealSubtract(dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, base);
                                                setValues({ value: values.value, memory: comParse(re, im, '+', base), repeat: true });
                                            } else {
                                                // di
                                                var dd = values.value.split('i')[0].split('').reverse();
                                                var re = values.memory.split('-')[0];
                                                var im = binaryRealSubtract(dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, base);
                                                setValues({ value: values.value, memory: comParse(re, im, '+', base), repeat: true });
                                            }
                                        } else if (values.memory.split('+').length > 2) {
                                            // a + bi
                                            var aa = values.memory.split('+')[0].split('').reverse();
                                            var cc = values.memory.split('+')[1].split('i')[0].split('').reverse();
                                            if (values.value.startsWith('-')) {
                                                // -c + di, -c - di, -di
                                                if (values.value.split('-').length > 2) {
                                                    // -c - di
                                                    var bb = values.value.split('-')[1].split('').reverse();
                                                    var dd = values.value.split('-')[2].split('i')[0].split('').reverse();
                                                    var re = binaryRealSubtract(aa, bb, base);
                                                    var im = binaryRealSubtract(cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base);
                                                    setValues({ value: values.value, memory: comParse(re, im, '+', base), repeat: true });
                                                } else if (values.value.includes('+')) {
                                                    // -c + di
                                                    var bb = values.value.split('+')[0].split('-')[1].split('').reverse();
                                                    var dd = values.value.split('+')[1].split('i')[0].split('').reverse();
                                                    var re = binaryRealSubtract(aa, bb, base);
                                                    var im = binaryRealAdd(cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base);
                                                    setValues({ value: values.value, memory: comParse(re, im, '+', base), repeat: true });
                                                } else {
                                                    // -di
                                                    var dd = values.value.split('-')[1].split('i')[0].split('').reverse();
                                                    var re = values.memory.split('+')[0];
                                                    var im = binaryRealSubtract(cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base);
                                                    setValues({ value: values.value, memory: comParse(re, im, '+', base), repeat: true });
                                                }
                                            } else if (values.value.includes('-')) {
                                                // c - di
                                                var bb = values.value.split('-')[0].split('').reverse();
                                                var dd = values.value.split('-')[1].split('i')[0].split('').reverse();
                                                var re = binaryRealAdd(aa, bb, base);
                                                var im = binaryRealSubtract(cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base);
                                                setValues({ value: values.value, memory: comParse(re, im, '+', base), repeat: true });
                                            } else if (values.value.includes('+')) {
                                                // c + di
                                                var bb = values.value.split('+')[0].split('').reverse();
                                                var dd = values.value.split('+')[1].split('i')[0].split('').reverse();
                                                var re = binaryRealAdd(aa, bb, base);
                                                var im = binaryRealAdd(cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base);
                                                setValues({ value: values.value, memory: comParse(re, im, '+', base), repeat: true });
                                            } else {
                                                // di
                                                var dd = values.value.split('i')[0].split('').reverse();
                                                var re = values.memory.split('+')[0];
                                                var im = binaryRealAdd(cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base);
                                                setValues({ value: values.value, memory: comParse(re, im, '+', base), repeat: true });
                                            }
                                        } else {
                                            // bi
                                            var aa = values.memory.split('i')[0].split('').reverse();
                                            if (values.value.startsWith('-')) {
                                                // -c + di, -c - di, -di
                                                if (values.value.split('-').length > 2) {
                                                    // -c - di
                                                    var bb = values.value.split('-')[2].split('i')[0].split('').reverse();
                                                    var re = values.value.split('-')[1];
                                                    var im = binaryRealSubtract(aa.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : aa, bb.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : bb, base);
                                                    setValues({ value: values.value, memory: comParse('-' + re, im, '+', base), repeat: true });
                                                } else if (values.value.includes('+')) {
                                                    // -c + di
                                                    var bb = values.value.split('+')[1].split('i')[0].split('').reverse();
                                                    var re = values.value.split('+')[0];
                                                    var im = binaryRealAdd(aa.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : aa, bb.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : bb, base);
                                                    setValues({ value: values.value, memory: comParse(re, im, '+', base), repeat: true });
                                                } else {
                                                    // -di
                                                    var bb = values.value.split('-')[1].split('i')[0].split('').reverse();
                                                    var im = binaryRealSubtract(aa.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : aa, bb.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : bb, base);
                                                    setValues({ value: values.value, memory: comParse(base == 1 ? '' : (base.values.length > 17 ? base.values[17] : '0'), im, '+', base), repeat: true });
                                                }
                                            } else if (values.value.includes('-')) {
                                                // c - di
                                                var bb = values.value.split('-')[1].split('i')[0].split('').reverse();
                                                var re = values.value.split('-')[0];
                                                var im = binaryRealSubtract(aa.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : aa, bb.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : bb, base);
                                                setValues({ value: values.value, memory: comParse(re, im, '+', base), repeat: true });
                                            } else if (values.value.includes('+')) {
                                                // c + di
                                                var bb = values.value.split('+')[1].split('i')[0].split('').reverse();
                                                var re = values.value.split('+')[0];
                                                var im = binaryRealAdd(aa.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : aa, bb.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : bb, base);
                                                setValues({ value: values.value, memory: comParse(re, im, '+', base), repeat: true });
                                            } else {
                                                // di
                                                var bb = values.value.split('i')[0].split('').reverse();
                                                var im = binaryRealAdd(aa.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : aa, bb.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : bb, base)
                                                setValues({ value: values.value, memory: comParse(base == 1 ? '' : (base.values.length > 17 ? base.values[17] : '0'), im, '+', base), repeat: true });
                                            }
                                        }
                                    } else {
                                        // values.value is real
                                        if (values.memory.startsWith('-')) {
                                            // -a + bi, -a - bi, -bi
                                            if (values.memory.split('-').length > 2) {
                                                // -a - bi
                                                var aa = values.memory.split('-')[1].split('').reverse();
                                                if (values.value.includes('-')) {
                                                    setValues({ value: values.value, memory: ('-' + binaryRealAdd(aa, values.value.split('-')[1].split('').reverse(), base) + '-' + values.memory.split('-')[2]), repeat: true });
                                                } else {
                                                    var bb = values.value.split('').reverse();
                                                    var re = binaryRealSubtract(bb, aa, base);
                                                    if (re == (base.values.length > 17 ? base.values[17] : '0') || re == '') {
                                                        setValues({ value: values.value, memory: ('-' + values.memory.split('-')[2]), repeat: true });
                                                    } else {
                                                        setValues({ value: values.value, memory: (re + '-' + values.memory.split('-')[2]), repeat: true });
                                                    }
                                                }
                                            } else if (values.memory.split('+').length > 2) {
                                                // -a + bi
                                                var aa = values.memory.split('+')[0].split('-')[1].split('').reverse();
                                                if (values.value.includes('-')) {
                                                    setValues({ value: values.value, memory: ('-' + binaryRealAdd(aa, values.value.split('-')[1].split('').reverse(), base) + '+' + values.memory.split('+')[1] + '+'), repeat: true });
                                                } else {
                                                    var bb = values.value.split('').reverse();
                                                    var re = binaryRealSubtract(bb, aa, base);
                                                    if (re == (base.values.length > 17 ? base.values[17] : '0') || re == '') {
                                                        setValues({ value: values.value, memory: (values.memory.split('+')[1] + '+'), repeat: true });
                                                    } else {
                                                        setValues({ value: values.value, memory: (re + '+' + values.memory.split('+')[1] + '+'), repeat: true });
                                                    }
                                                }
                                            } else {
                                                // -bi
                                                if (values.value == (base.values.length > 17 ? base.values[17] : '0')) {
                                                    setValues({ value: values.value, memory: values.memory, repeat: true });
                                                } else {
                                                    setValues({ value: values.value, memory: (values.value + values.memory), repeat: true });
                                                }
                                            }
                                        } else if (values.memory.includes('-')) {
                                            // a - bi
                                            var aa = values.memory.split('-')[0].split('').reverse();
                                            if (values.value.includes('-')) {
                                                var bb = values.value.split('-')[1].split('').reverse();
                                                var re = binaryRealSubtract(aa, bb, base);
                                                if (re == (base.values.length > 17 ? base.values[17] : '0') || re == '') {
                                                    setValues({ value: values.value, memory: ('-' + values.memory.split('-')[1]), repeat: true });
                                                } else {
                                                    setValues({ value: values.value, memory: (re + '-' + values.memory.split('-')[1]), repeat: true });
                                                }
                                            } else {
                                                setValues({ value: values.value, memory: (binaryRealAdd(aa, values.value.split('').reverse(), base) + '-' + values.memory.split('-')[1]), repeat: true });
                                            }
                                        } else if (values.memory.split('+').length > 2) {
                                            // a + bi
                                            var aa = values.memory.split('+')[0].split('').reverse();
                                            if (values.value.includes('-')) {
                                                var bb = values.value.split('-')[1].split('').reverse();
                                                var re = binaryRealSubtract(aa, bb, base);
                                                if (re == (base.values.length > 17 ? base.values[17] : '0') || re == '') {
                                                    setValues({ value: values.value, memory: (values.memory.split('+')[1] + '+'), repeat: true });
                                                } else {
                                                    setValues({ value: values.value, memory: (re + '+' + values.memory.split('+')[1] + '+'), repeat: true });
                                                }
                                            } else {
                                                setValues({ value: values.value, memory: (binaryRealAdd(aa, values.value.split('').reverse(), base) + '+' + values.memory.split('+')[1] + '+'), repeat: true });
                                            }
                                        } else {
                                            // bi
                                            if (values.value == (base.values.length > 17 ? base.values[17] : '0') || values.value == '') {
                                                setValues({ value: values.value, memory: values.memory, repeat: true });
                                            } else {
                                                setValues({ value: values.value, memory: (values.value + '+' + values.memory), repeat: true });
                                            }
                                        }
                                    }
                                } else {
                                    if (values.value.includes('i')) {
                                        if (values.value.startsWith('-')) {
                                            // -c + di, -c - di, -di
                                            if (values.value.split('-').length > 2) {
                                                // -c - di
                                                var aa = values.value.split('-')[1].split('').reverse();
                                                if (values.memory.includes('-')) {
                                                    // -a - c - di
                                                    setValues({ value: values.value, memory: ('-' + binaryRealAdd(values.memory.split('+')[0].split('-')[1].split('').reverse(), aa, base) + '-' + values.value.split('-')[2] + '+'), repeat: true });
                                                } else {
                                                    // a - c - di
                                                    var bb = values.memory.split('+')[0].split('').reverse();
                                                    var re = binaryRealSubtract(bb, aa, base);
                                                    if (re == (base.values.length > 17 ? base.values[17] : '0') || re == '') {
                                                        setValues({ value: values.value, memory: ('-' + values.value.split('-')[2] + '+'), repeat: true });
                                                    } else {
                                                        setValues({ value: values.value, memory: (re + '-' + values.value.split('-')[2] + '+'), repeat: true });
                                                    }
                                                }
                                            } else if (values.value.split('-')[1].includes('+')) {
                                                // -c + di
                                                var aa = values.value.split('+')[0].split('-')[1].split('').reverse();
                                                if (values.memory.includes('-')) {
                                                    // -a - c + di
                                                    setValues({ value: values.value, memory: ('-' + binaryRealAdd(values.memory.split('+')[0].split('-')[1].split('').reverse(), aa, base) + '+' + values.value.split('+')[1] + '+'), repeat: true });
                                                } else {
                                                    // a - c + di
                                                    var bb = values.memory.split('+')[0].split('').reverse();
                                                    var re = binaryRealSubtract(bb, aa, base);
                                                    if (re == (base.values.length > 17 ? base.values[17] : '0') || re == '') {
                                                        setValues({ value: values.value, memory: (values.value.split('+')[1] + '+'), repeat: true });
                                                    } else {
                                                        setValues({ value: values.value, memory: (re + '+' + values.value.split('+')[1] + '+'), repeat: true });
                                                    }
                                                }
                                            } else {
                                                // -di
                                                if (values.memory == ((base.values.length > 17 ? base.values[17] : '0') + '+') || values.memory == '+') {
                                                    setValues({ value: values.value, memory: (values.value + '+'), repeat: true });
                                                } else {
                                                    setValues({ value: values.value, memory: (values.memory.split('+')[0] + values.value + '+'), repeat: true });
                                                }
                                            }
                                        } else if (values.value.includes('-')) {
                                            // c - di
                                            var aa = values.value.split('-')[0].split('').reverse();
                                            if (values.memory.includes('-')) {
                                                // -a + c - di
                                                var bb = values.memory.split('+')[0].split('-')[1].split('').reverse();
                                                var re = binaryRealSubtract(aa, bb, base);
                                                if (re == (base.values.length > 17 ? base.values[17] : '0') || re == '') {
                                                    setValues({ value: values.value, memory: ('-' + values.value.split('-')[1] + '+'), repeat: true });
                                                } else {
                                                    setValues({ value: values.value, memory: (re + '-' + values.value.split('-')[1] + '+'), repeat: true });
                                                }
                                            } else {
                                                // a + c - di
                                                setValues({ value: values.value, memory: (binaryRealAdd(values.memory.split('+')[0].split('').reverse(), aa, base) + '-' + values.value.split('-')[1] + '+'), repeat: true });
                                            }
                                        } else if (values.value.includes('+')) {
                                            // c + di
                                            var aa = values.value.split('+')[0].split('').reverse();
                                            if (values.memory.includes('-')) {
                                                // -a + c + di
                                                var bb = values.memory.split('+')[0].split('-')[1].split('').reverse();
                                                var re = binaryRealSubtract(aa, bb, base);
                                                if (re == (base.values.length > 17 ? base.values[17] : '0') || re == '') {
                                                    setValues({ value: values.value, memory: (values.value.split('+')[1] + '+'), repeat: true });
                                                } else {
                                                    setValues({ value: values.value, memory: (re + '+' + values.value.split('+')[1] + '+'), repeat: true });
                                                }
                                            } else {
                                                // a + c + di
                                                setValues({ value: values.value, memory: (binaryRealAdd(values.memory.split('+')[0].split('').reverse(), aa, base) + '+' + values.value.split('+')[1] + '+'), repeat: true });
                                            }
                                        } else {
                                            // di
                                            if (values.memory == ((base.values.length > 17 ? base.values[17] : '0') + '+') || values.memory == '+') {
                                                setValues({ value: values.value, memory: (values.value + '+'), repeat: true });
                                            } else {
                                                setValues({ value: values.value, memory: (values.memory + values.value + '+'), repeat: true });
                                            }
                                        }
                                    } else {
                                        if (values.memory.includes('-')) {
                                            var aa = values.memory.split('+')[0].split('-')[1].split('').reverse();
                                            if (values.value.includes('-')) {
                                                // negative + negative
                                                setValues({ value: values.value, memory: ('-' + binaryRealAdd(aa, values.value.split('-')[1].split('').reverse(), base) + '+'), repeat: true });
                                            } else {
                                                // negative + positive
                                                setValues({ value: values.value, memory: (binaryRealSubtract(values.value.split('').reverse(), aa, base) + '+'), repeat: true });
                                            }
                                        } else {
                                            var aa = values.memory.split('+')[0].split('').reverse();
                                            if (values.value.includes('-')) {
                                                // positive + negative
                                                setValues({ value: values.value, memory: (binaryRealSubtract(aa, values.value.split('-')[1].split('').reverse(), base) + '+'), repeat: true });
                                            } else {
                                                // positive + positive
                                                setValues({ value: values.value, memory: (binaryRealAdd(aa, values.value.split('').reverse(), base) + '+'), repeat: true });
                                            }
                                        }
                                    }
                                }
                                break;
                            case '-':
                                if (values.memory.includes('i')) {
                                    // complex
                                    if (values.value.includes('i')) {
                                        // values.value is imaginary
                                        if (values.memory.startsWith('-')) {
                                            // -a + bi, -a - bi, -bi
                                            if (values.memory.split('-').length > 3) {
                                                // -a - bi
                                                var aa = values.memory.split('-')[1].split('').reverse();
                                                var cc = values.memory.split('-')[2].split('i')[0].split('').reverse();
                                                if (values.value.startsWith('-')) {
                                                    // -c + di, -c - di, -di
                                                    if (values.value.split('-').length > 2) {
                                                        // -c - di
                                                        var bb = values.value.split('-')[1].split('').reverse();
                                                        var dd = values.value.split('-')[2].split('i')[0].split('').reverse();
                                                        var re = binaryRealSubtract(bb, aa, base);
                                                        var im = binaryRealSubtract(dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, base);
                                                        setValues({ value: values.value, memory: comParse(re, im, '-', base), repeat: true });
                                                    } else if (values.value.includes('+')) {
                                                        // -c + di
                                                        var bb = values.value.split('+')[0].split('-')[1].split('').reverse();
                                                        var dd = values.value.split('+')[1].split('i')[0].split('').reverse();
                                                        var re = binaryRealSubtract(bb, aa, base);
                                                        var im = binaryRealAdd(cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base);
                                                        setValues({ value: values.value, memory: comParse(re, '-' + im, '-', base), repeat: true });
                                                    } else {
                                                        // -di
                                                        var dd = values.value.split('-')[1].split('i')[0].split('').reverse();
                                                        var re = values.memory.split('-')[1];
                                                        var im = binaryRealSubtract(dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, base);
                                                        setValues({ value: values.value, memory: comParse('-' + re, im, '-', base), repeat: true });
                                                    }
                                                } else if (values.value.includes('-')) {
                                                    // c - di
                                                    var bb = values.value.split('-')[0].split('').reverse();
                                                    var dd = values.value.split('-')[1].split('i')[0].split('').reverse();
                                                    var re = binaryRealAdd(aa, bb, base);
                                                    var im = binaryRealSubtract(dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, base);
                                                    setValues({ value: values.value, memory: comParse('-' + re, im, '-', base), repeat: true });
                                                } else if (values.value.includes('+')) {
                                                    // c + di
                                                    var bb = values.value.split('+')[0].split('').reverse();
                                                    var dd = values.value.split('+')[1].split('i')[0].split('').reverse();
                                                    var re = binaryRealAdd(aa, bb, base);
                                                    var im = binaryRealAdd(cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base);
                                                    setValues({ value: values.value, memory: comParse('-' + re, '-' + im, '-', base), repeat: true });
                                                } else {
                                                    // di
                                                    var dd = values.value.split('i')[0].split('').reverse();
                                                    var re = values.memory.split('-')[1];
                                                    var im = binaryRealAdd(cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base);
                                                    setValues({ value: values.value, memory: comParse('-' + re, '-' + im, '-', base), repeat: true });
                                                }
                                            } else if (values.memory.includes('+')) {
                                                // -a + bi
                                                var aa = values.memory.split('+')[0].split('-')[1].split('').reverse();
                                                var cc = values.memory.split('+')[1].split('i')[0].split('').reverse();
                                                if (values.value.startsWith('-')) {
                                                    // -c + di, -c - di, -di
                                                    if (values.value.split('-').length > 2) {
                                                        // -c - di
                                                        var bb = values.value.split('-')[1].split('').reverse();
                                                        var dd = values.value.split('-')[2].split('i')[0].split('').reverse();
                                                        var re = binaryRealSubtract(bb, aa, base);
                                                        var im = binaryRealAdd(cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base);
                                                        setValues({ value: values.value, memory: comParse(re, im, '-', base), repeat: true });
                                                    } else if (values.value.includes('+')) {
                                                        // -c + di
                                                        var bb = values.value.split('+')[0].split('-')[1].split('').reverse();
                                                        var dd = values.value.split('+')[1].split('i')[0].split('').reverse();
                                                        var re = binaryRealSubtract(bb, aa, base);
                                                        var im = binaryRealSubtract(cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base);
                                                        setValues({ value: values.value, memory: comParse(re, im, '-', base), repeat: true });
                                                    } else {
                                                        // -di
                                                        var dd = values.value.split('-')[1].split('i')[0].split('').reverse();
                                                        var re = values.memory.split('+')[0];
                                                        var im = binaryRealAdd(cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base);
                                                        setValues({ value: values.value, memory: comParse(re, im, '-', base), repeat: true });
                                                    }
                                                } else if (values.value.includes('-')) {
                                                    // c - di
                                                    var bb = values.value.split('-')[0].split('').reverse();
                                                    var dd = values.value.split('-')[1].split('i')[0].split('').reverse();
                                                    var re = binaryRealAdd(aa, bb, base);
                                                    var im = binaryRealAdd(cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base);
                                                    setValues({ value: values.value, memory: comParse('-' + re, im, '-', base), repeat: true });
                                                } else if (values.value.includes('+')) {
                                                    // c + di
                                                    var bb = values.value.split('+')[0].split('').reverse();
                                                    var dd = values.value.split('+')[1].split('i')[0].split('').reverse();
                                                    var re = binaryRealAdd(aa, bb, base);
                                                    var im = binaryRealSubtract(cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base);
                                                    setValues({ value: values.value, memory: comParse('-' + re, im, '-', base), repeat: true });
                                                } else {
                                                    // di
                                                    var dd = values.value.split('i')[0].split('').reverse();
                                                    var re = values.memory.split('+')[0];
                                                    var im = binaryRealSubtract(cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base);
                                                    setValues({ value: values.value, memory: comParse(re, im, '-', base), repeat: true });
                                                }
                                            } else {
                                                // -bi
                                                var aa = values.memory.split('-')[1].split('i')[0].split('').reverse();
                                                if (values.value.startsWith('-')) {
                                                    // -c + di, -c - di, -di
                                                    if (values.value.split('-').length > 2) {
                                                        // -c - di
                                                        var bb = values.value.split('-')[2].split('i')[0].split('').reverse();
                                                        var re = values.value.split('-')[1];
                                                        var im = binaryRealSubtract(bb.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : bb, aa.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : aa, base);
                                                        setValues({ value: values.value, memory: comParse(re, im, '-', base), repeat: true });
                                                    } else if (values.value.includes('+')) {
                                                        // -c + di
                                                        var bb = values.value.split('+')[1].split('i')[0].split('').reverse();
                                                        var re = values.value.split('+')[0].split('-')[1];
                                                        var im = binaryRealAdd(aa.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : aa, bb.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : bb, base);
                                                        setValues({ value: values.value, memory: comParse(re, '-' + im, '-', base), repeat: true });
                                                    } else {
                                                        // -di
                                                        var bb = values.value.split('-')[1].split('i')[0].split('').reverse();
                                                        var im = binaryRealSubtract(bb.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : bb, aa.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : aa, base)
                                                        setValues({ value: values.value, memory: comParse(base == 1 ? '' : (base.values.length > 17 ? base.values[17] : '0'), im, '-', base), repeat: true });
                                                    }
                                                } else if (values.value.includes('-')) {
                                                    // c - di
                                                    var bb = values.value.split('-')[1].split('i')[0].split('').reverse();
                                                    var re = values.value.split('-')[0];
                                                    var im = binaryRealSubtract(bb.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : bb, aa.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : aa, base);
                                                    setValues({ value: values.value, memory: comParse('-' + re, im, '-', base), repeat: true });
                                                } else if (values.value.includes('+')) {
                                                    // c + di
                                                    var bb = values.value.split('+')[1].split('i')[0].split('').reverse();
                                                    var re = values.value.split('+')[0];
                                                    var im = binaryRealAdd(aa.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : aa, bb.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : bb, base);
                                                    setValues({ value: values.value, memory: comParse('-' + re, '-' + im, '-', base), repeat: true });
                                                } else {
                                                    // di
                                                    var bb = values.value.split('i')[0].split('').reverse();
                                                    var im = binaryRealAdd(aa.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : aa, bb.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : bb, base);
                                                    setValues({ value: values.value, memory: comParse(base == 1 ? '' : (base.values.length > 17 ? base.values[17] : '0'), '-' + im, '-', base), repeat: true });
                                                }
                                            }
                                        } else if (values.memory.split('-').length > 2) {
                                            // a - bi
                                            var aa = values.memory.split('-')[0].split('').reverse();
                                            var cc = values.memory.split('-')[1].split('i')[0].split('').reverse();
                                            if (values.value.startsWith('-')) {
                                                // -c + di, -c - di, -di
                                                if (values.value.split('-').length > 2) {
                                                    // -c - di
                                                    var bb = values.value.split('-')[1].split('').reverse();
                                                    var dd = values.value.split('-')[2].split('i')[0].split('').reverse();
                                                    var re = binaryRealAdd(aa, bb, base);
                                                    var im = binaryRealSubtract(dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, base);
                                                    setValues({ value: values.value, memory: comParse(re, im, '-', base), repeat: true });
                                                } else if (values.value.includes('+')) {
                                                    // -c + di
                                                    var bb = values.value.split('+')[0].split('-')[1].split('').reverse();
                                                    var dd = values.value.split('+')[1].split('i')[0].split('').reverse();
                                                    var re = binaryRealAdd(aa, bb, base);
                                                    var im = binaryRealAdd(cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base);
                                                    setValues({ value: values.value, memory: comParse(re, '-' + im, '-', base), repeat: true });
                                                } else {
                                                    // -di
                                                    var dd = values.value.split('-')[1].split('i')[0].split('').reverse();
                                                    var re = values.memory.split('-')[0];
                                                    var im = binaryRealAdd(dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, base);
                                                    setValues({ value: values.value, memory: comParse(re, im, '-', base), repeat: true });
                                                }
                                            } else if (values.value.includes('-')) {
                                                // c - di
                                                var bb = values.value.split('-')[0].split('').reverse();
                                                var dd = values.value.split('-')[1].split('i')[0].split('').reverse();
                                                var re = binaryRealSubtract(aa, bb, base);
                                                var im = binaryRealSubtract(dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, base);
                                                setValues({ value: values.value, memory: comParse(re, im, '-', base), repeat: true });
                                            } else if (values.value.includes('+')) {
                                                // c + di
                                                var bb = values.value.split('+')[0].split('').reverse();
                                                var dd = values.value.split('+')[1].split('i')[0].split('').reverse();
                                                var re = binaryRealSubtract(aa, bb, base);
                                                var im = binaryRealAdd(cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base);
                                                setValues({ value: values.value, memory: comParse(re, '-' + im, '-', base), repeat: true });
                                            } else {
                                                // di
                                                var dd = values.value.split('i')[0].split('').reverse();
                                                var re = values.memory.split('-')[0];
                                                var im = binaryRealAdd(cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base);
                                                setValues({ value: values.value, memory: comParse(re, '-' + im, '-', base), repeat: true });
                                            }
                                        } else if (values.memory.includes('+')) {
                                            // a + bi
                                            var aa = values.memory.split('+')[0].split('').reverse();
                                            var cc = values.memory.split('+')[1].split('i')[0].split('').reverse();
                                            if (values.value.startsWith('-')) {
                                                // -c + di, -c - di, -di
                                                if (values.value.split('-').length > 2) {
                                                    // -c - di
                                                    var bb = values.value.split('-')[1].split('').reverse();
                                                    var dd = values.value.split('-')[2].split('i')[0].split('').reverse();
                                                    var re = binaryRealAdd(aa, bb, base);
                                                    var im = binaryRealAdd(cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base);
                                                    setValues({ value: values.value, memory: comParse(re, im, '-', base), repeat: true });
                                                } else if (values.value.includes('+')) {
                                                    // -c + di
                                                    var bb = values.value.split('+')[0].split('-')[1].split('').reverse();
                                                    var dd = values.value.split('+')[1].split('i')[0].split('').reverse();
                                                    var re = binaryRealAdd(aa, bb, base);
                                                    var im = binaryRealSubtract(cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base);
                                                    setValues({ value: values.value, memory: comParse(re, im, '-', base), repeat: true });
                                                } else {
                                                    // -di
                                                    var dd = values.value.split('-')[1].split('i')[0].split('').reverse();
                                                    var re = values.memory.split('+')[0];
                                                    var im = binaryRealAdd(cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base);
                                                    setValues({ value: values.value, memory: comParse(re, im, '-', base), repeat: true });
                                                }
                                            } else if (values.value.includes('-')) {
                                                // c - di
                                                var bb = values.value.split('-')[0].split('').reverse();
                                                var dd = values.value.split('-')[1].split('i')[0].split('').reverse();
                                                var re = binaryRealSubtract(aa, bb, base);
                                                var im = binaryRealAdd(cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base);
                                                setValues({ value: values.value, memory: comParse(re, im, '-', base), repeat: true });
                                            } else if (values.value.includes('+')) {
                                                // c + di
                                                var bb = values.value.split('+')[0].split('').reverse();
                                                var dd = values.value.split('+')[1].split('i')[0].split('').reverse();
                                                var re = binaryRealSubtract(aa, bb, base);
                                                var im = binaryRealSubtract(cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base);
                                                setValues({ value: values.value, memory: comParse(re, im, '-', base), repeat: true });
                                            } else {
                                                // di
                                                var dd = values.value.split('i')[0].split('').reverse();
                                                var re = values.memory.split('+')[0];
                                                var im = binaryRealSubtract(cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base);
                                                setValues({ value: values.value, memory: comParse(re, im, '-', base), repeat: true });
                                            }
                                        } else {
                                            // bi
                                            var aa = values.memory.split('i')[0].split('').reverse();
                                            if (values.value.startsWith('-')) {
                                                // -c + di, -c - di, -di
                                                if (values.value.split('-').length > 2) {
                                                    // -c - di
                                                    var bb = values.value.split('-')[2].split('i')[0].split('').reverse();
                                                    var re = values.value.split('-')[1];
                                                    var im = binaryRealAdd(aa.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : aa, bb.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : bb, base);
                                                    setValues({ value: values.value, memory: comParse(re, im, '-', base), repeat: true });
                                                } else if (values.value.includes('+')) {
                                                    // -c + di
                                                    var bb = values.value.split('+')[1].split('i')[0].split('').reverse();
                                                    var re = values.value.split('+')[0].split('-')[1];
                                                    var im = binaryRealSubtract(aa.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : aa, bb.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : bb, base);
                                                    setValues({ value: values.value, memory: comParse(re, im, '-', base), repeat: true });
                                                } else {
                                                    // -di
                                                    var bb = values.value.split('-')[1].split('i')[0].split('').reverse();
                                                    var im = binaryRealAdd(aa.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : aa, bb.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : bb, base);
                                                    setValues({ value: values.value, memory: comParse(base == 1 ? '' : (base.values.length > 17 ? base.values[17] : '0'), im, '-', base), repeat: true });
                                                }
                                            } else if (values.value.includes('-')) {
                                                // c - di
                                                var bb = values.value.split('-')[1].split('i')[0].split('').reverse();
                                                var re = values.value.split('-')[0];
                                                var im = binaryRealAdd(aa.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : aa, bb.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : bb, base);
                                                setValues({ value: values.value, memory: comParse('-' + re, im, '-', base), repeat: true });
                                            } else if (values.value.includes('+')) {
                                                // c + di
                                                var bb = values.value.split('+')[1].split('i')[0].split('').reverse();
                                                var re = values.value.split('+')[0];
                                                var im = binaryRealSubtract(aa.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : aa, bb.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : bb, base);
                                                setValues({ value: values.value, memory: comParse('-' + re, im, '-', base), repeat: true });
                                            } else {
                                                // di
                                                var bb = values.value.split('i')[0].split('').reverse();
                                                var im = binaryRealSubtract(aa.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : aa, bb.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : bb, base);
                                                setValues({ value: values.value, memory: comParse(base == 1 ? '' : (base.values.length > 17 ? base.values[17] : '0'), im, '-', base), repeat: true });
                                            }
                                        }
                                    } else {
                                        // values.value is real
                                        if (values.memory.startsWith('-')) {
                                            // -a + bi, -a - bi, -bi
                                            if (values.memory.split('-').length > 3) {
                                                // -a - bi
                                                var aa = values.memory.split('-')[1].split('').reverse();
                                                if (values.value.includes('-')) {
                                                    var bb = values.value.split('-')[1].split('').reverse();
                                                    var re = binaryRealSubtract(bb, aa, base);
                                                    if (re == (base.values.length > 17 ? base.values[17] : '0') || re == '') {
                                                        setValues({ value: values.value, memory: ('-' + values.memory.split('-')[2] + '-'), repeat: true });
                                                    } else {
                                                        setValues({ value: values.value, memory: (re + '-' + values.memory.split('-')[2] + '-'), repeat: true });
                                                    }
                                                } else {
                                                    setValues({ value: values.value, memory: ('-' + binaryRealAdd(aa, values.value.split('').reverse(), base) + '-' + values.memory.split('-')[2] + '-'), repeat: true });
                                                }
                                            } else if (values.memory.includes('+')) {
                                                // -a + bi
                                                var aa = values.memory.split('+')[0].split('-')[1].split('').reverse();
                                                if (values.value.includes('-')) {
                                                    var bb = values.value.split('-')[1].split('').reverse();
                                                    var re = binaryRealSubtract(bb, aa, base);
                                                    if (re == (base.values.length > 17 ? base.values[17] : '0') || re == '') {
                                                        setValues({ value: values.value, memory: values.memory.split('+')[1], repeat: true });
                                                    } else {
                                                        setValues({ value: values.value, memory: (re + '+' + values.memory.split('+')[1]), repeat: true });
                                                    }
                                                } else {
                                                    setValues({ value: values.value, memory: ('-' + binaryRealAdd(aa, values.value.split('').reverse(), base) + '+' + values.memory.split('+')[1]), repeat: true });
                                                }
                                            } else {
                                                // -bi
                                                if (values.value == (base.values.length > 17 ? base.values[17] : '0') || values.value == '') {
                                                    setValues({ value: values.value, memory: values.memory, repeat: true });
                                                } else {
                                                    if (values.value.startsWith('-')) {
                                                        setValues({ value: values.value, memory: (values.value + values.memory), repeat: true });
                                                    } else {
                                                        setValues({ value: values.value, memory: ('-' + values.value + values.memory), repeat: true });
                                                    }
                                                }
                                            }
                                        } else if (values.memory.split('-').length > 2) {
                                            // a - bi
                                            var aa = values.memory.split('-')[0].split('').reverse();
                                            if (values.value.includes('-')) {
                                                setValues({ value: values.value, memory: (binaryRealAdd(aa, values.value.split('-')[1].split('').reverse(), base) + '-' + values.memory.split('-')[1] + '-'), repeat: true });
                                            } else {
                                                var bb = values.value.split('').reverse();
                                                var re = binaryRealSubtract(aa, bb, base);
                                                if (re == (base.values.length > 17 ? base.values[17] : '0') || re == '') {
                                                    setValues({ value: values.value, memory: ('-' + values.memory.split('-')[1] + '-'), repeat: true });
                                                } else {
                                                    setValues({ value: values.value, memory: (re + '-' + values.memory.split('-')[1] + '-'), repeat: true });
                                                }
                                            }
                                        } else if (values.memory.includes('+')) {
                                            // a + bi
                                            var aa = values.memory.split('+')[0].split('').reverse();
                                            if (values.value.includes('-')) {
                                                setValues({ value: values.value, memory: (binaryRealAdd(aa, values.value.split('-')[1].split('').reverse(), base) + '+' + values.memory.split('+')[1]), repeat: true });
                                            } else {
                                                var bb = values.value.split('').reverse();
                                                var re = binaryRealSubtract(aa, bb, base);
                                                if (re == (base.values.length > 17 ? base.values[17] : '0') || re == '') {
                                                    setValues({ value: values.value, memory: values.memory.split('+')[1], repeat: true });
                                                } else {
                                                    setValues({ value: values.value, memory: (re + '+' + values.memory.split('+')[1]), repeat: true });
                                                }
                                            }
                                        } else {
                                            // bi
                                            if (values.value == (base.values.length > 17 ? base.values[17] : '0') || values.value == '') {
                                                setValues({ value: values.value, memory: values.memory, repeat: true });
                                            } else {
                                                if (values.value.startsWith('-')) {
                                                    setValues({ value: values.value, memory: (values.value + '+' + values.memory), repeat: true });
                                                } else {
                                                    setValues({ value: values.value, memory: ('-' + values.value + '+' + values.memory), repeat: true });
                                                }
                                            }
                                        }
                                    }
                                } else {
                                    if (values.value.includes('i')) {
                                        if (values.value.startsWith('-')) {
                                            // -c + di, -c - di, -di
                                            if (values.value.split('-').length > 2) {
                                                // -c - di
                                                var aa = values.value.split('-')[1].split('').reverse();
                                                if (values.memory.startsWith('-')) {
                                                    // -a + c + di
                                                    var bb = values.memory.split('-')[1].split('').reverse();
                                                    var re = binaryRealSubtract(aa, bb, base);
                                                    if (re == (base.values.length > 17 ? base.values[17] : '0') || re == '') {
                                                        setValues({ value: values.value, memory: (values.value.split('-')[2] + '-'), repeat: true });
                                                    } else {
                                                        setValues({ value: values.value, memory: (re + '+' + values.value.split('-')[2] + '-'), repeat: true });
                                                    }
                                                } else {
                                                    // a + c + di
                                                    setValues({ value: values.value, memory: (binaryRealAdd(values.memory.split('-')[0].split('').reverse(), aa, base) + '+' + values.value.split('-')[2] + '-'), repeat: true });
                                                }
                                            } else if (values.value.split('-')[1].includes('+')) {
                                                // -c + di
                                                var aa = values.value.split('+')[0].split('-')[1].split('').reverse();
                                                if (values.memory.startsWith('-')) {
                                                    // -a + c - di
                                                    var bb = values.memory.split('-')[1].split('').reverse();
                                                    var re = binaryRealSubtract(aa, bb, base);
                                                    if (re == (base.values.length > 17 ? base.values[17] : '0') || re == '') {
                                                        setValues({ value: values.value, memory: ('-' + values.value.split('+')[1] + '-'), repeat: true });
                                                    } else {
                                                        setValues({ value: values.value, memory: (re + '-' + values.value.split('+')[1] + '-'), repeat: true });
                                                    }
                                                } else {
                                                    // a + c - di
                                                    setValues({ value: values.value, memory: (binaryRealAdd(values.memory.split('-')[0].split('').reverse(), aa, base) + '-' + values.value.split('+')[1] + '-'), repeat: true });
                                                }
                                            } else {
                                                // -di
                                                if (values.memory == ((base.values.length > 17 ? base.values[17] : '0') + '-') || values.memory == '-') {
                                                    setValues({ value: values.value, memory: (values.value.split('-')[1] + '-'), repeat: true });
                                                } else {
                                                    if (values.memory.startsWith('-')) {
                                                        // negative real - negative imaginary
                                                        setValues({ value: values.value, memory: ('-' + values.memory.split('-')[1] + '+' + values.value.split('-')[1] + '-'), repeat: true });
                                                    } else {
                                                        // positive real - negative imaginary
                                                        setValues({ value: values.value, memory: (values.memory.split('-')[0] + '+' + values.value.split('-')[1] + '-'), repeat: true });
                                                    }
                                                }
                                            }
                                        } else if (values.value.includes('-')) {
                                            // c - di
                                            var aa = values.value.split('-')[0].split('').reverse();
                                            if (values.memory.startsWith('-')) {
                                                // -a - c + di
                                                setValues({ value: values.value, memory: ('-' + binaryRealAdd(values.memory.split('-')[1].split('').reverse(), aa, base) + '+' + values.value.split('-')[1] + '-'), repeat: true });
                                            } else {
                                                // a - c + di
                                                var bb = values.memory.split('-')[0].split('').reverse();
                                                var re = binaryRealSubtract(bb, aa, base);
                                                if (re == (base.values.length > 17 ? base.values[17] : '0') || re == '') {
                                                    setValues({ value: values.value, memory: (values.value.split('-')[1] + '-'), repeat: true });
                                                } else {
                                                    setValues({ value: values.value, memory: (re + '+' + values.value.split('-')[1] + '-'), repeat: true });
                                                }
                                            }
                                        } else if (values.value.includes('+')) {
                                            // c + di
                                            var aa = values.value.split('+')[0].split('').reverse();
                                            if (values.memory.startsWith('-')) {
                                                // -a - c - di
                                                setValues({ value: values.value, memory: ('-' + binaryRealAdd(values.memory.split('-')[1].split('').reverse(), aa, base) + '-' + values.value.split('+')[1] + '-'), repeat: true });
                                            } else {
                                                // a - c - di
                                                var bb = values.memory.split('-')[0].split('').reverse();
                                                var re = binaryRealSubtract(bb, aa, base);
                                                if (re == (base.values.length > 17 ? base.values[17] : '0') || re == '') {
                                                    setValues({ value: values.value, memory: ('-' + values.value.split('+')[1] + '-'), repeat: true });
                                                } else {
                                                    setValues({ value: values.value, memory: (re + '-' + values.value.split('+')[1] + '-'), repeat: true });
                                                }
                                            }
                                        } else {
                                            // di
                                            if (values.memory == ((base.values.length > 17 ? base.values[17] : '0') + '-') || values.memory == '-') {
                                                setValues({ value: values.value, memory: ('-' + values.value + '-'), repeat: true });
                                            } else {
                                                setValues({ value: values.value, memory: (values.memory + values.value + '-'), repeat: true });
                                            }
                                        }
                                    } else {
                                        if (values.memory.startsWith('-')) {
                                            var aa = values.memory.split('-')[1].split('').reverse();
                                            if (values.value.includes('-')) {
                                                // negative - negative
                                                setValues({ value: values.value, memory: (binaryRealSubtract(values.value.split('-')[1].split('').reverse(), aa, base) + '-'), repeat: true });
                                            } else {
                                                // negative - positive
                                                setValues({ value: values.value, memory: ('-' + binaryRealAdd(aa, values.value.split('').reverse(), base) + '-'), repeat: true });
                                            }
                                        } else {
                                            var aa = values.memory.split('-')[0].split('').reverse()
                                            if (values.value.includes('-')) {
                                                // positive - negative
                                                setValues({ value: values.value, memory: (binaryRealAdd(aa, values.value.split('-')[1].split('').reverse(), base) + '-'), repeat: true });
                                            } else {
                                                // positive - positive
                                                setValues({ value: values.value, memory: (binaryRealSubtract(aa, values.value.split('').reverse(), base) + '-'), repeat: true });
                                            }
                                        }
                                    }
                                }
                                break;
                            case '*':
                                if (values.memory.includes('i')) {
                                    // complex
                                    if (values.value.includes('i')) {
                                        // values.value is imaginary
                                        if (values.memory.startsWith('-')) {
                                            // -a + bi, -a - bi, -bi
                                            if (values.memory.split('-').length > 2) {
                                                // -a - bi
                                                var aa = values.memory.split('-')[1].split('').reverse();
                                                var cc = values.memory.split('-')[2].split('i')[0].split('').reverse();
                                                if (values.value.startsWith('-')) {
                                                    // -c + di, -c - di, -di
                                                    if (values.value.split('-').length > 2) {
                                                        // -c - di
                                                        var bb = values.value.split('-')[1].split('').reverse();
                                                        var dd = values.value.split('-')[2].split('i')[0].split('').reverse();
                                                        var re = binaryRealSubtract(binaryRealMultiply(aa, bb, base).split('').reverse(), binaryRealMultiply(cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base).split('').reverse(), base);
                                                        var im = binaryRealAdd(binaryRealMultiply(aa, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base).split('').reverse(), binaryRealMultiply(bb, cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, base).split('').reverse(), base);
                                                        setValues({ value: values.value, memory: comParse(re, im, '*', base), repeat: true });
                                                    } else if (values.value.includes('+')) {
                                                        // -c + di
                                                        var bb = values.value.split('+')[0].split('-')[1].split('').reverse();
                                                        var dd = values.value.split('+')[1].split('i')[0].split('').reverse();
                                                        var re = binaryRealAdd(binaryRealMultiply(aa, bb, base).split('').reverse(), binaryRealMultiply(cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base).split('').reverse(), base);
                                                        var im = binaryRealSubtract(binaryRealMultiply(bb, cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, base).split('').reverse(), binaryRealMultiply(aa, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base).split('').reverse(), base);
                                                        setValues({ value: values.value, memory: comParse(re, im, '*', base), repeat: true });
                                                    } else {
                                                        // -di
                                                        var dd = values.value.split('-')[1].split('i')[0].split('').reverse();
                                                        var re = binaryRealMultiply(cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base);
                                                        var im = binaryRealMultiply(aa, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base);
                                                        setValues({ value: values.value, memory: comParse('-' + re, im, '*', base), repeat: true });
                                                    }
                                                } else if (values.value.includes('-')) {
                                                    // c - di
                                                    var bb = values.value.split('-')[0].split('').reverse();
                                                    var dd = values.value.split('-')[1].split('i')[0].split('').reverse();
                                                    var re = binaryRealAdd(binaryRealMultiply(aa, bb, base).split('').reverse(), binaryRealMultiply(cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base).split('').reverse(), base);
                                                    var im = binaryRealSubtract(binaryRealMultiply(aa, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base).split('').reverse(), binaryRealMultiply(bb, cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, base).split('').reverse(), base);
                                                    setValues({ value: values.value, memory: comParse('-' + re, im, '*', base), repeat: true });
                                                } else if (values.value.includes('+')) {
                                                    // c + di
                                                    var bb = values.value.split('+')[0].split('').reverse();
                                                    var dd = values.value.split('+')[1].split('i')[0].split('').reverse();
                                                    var re = binaryRealSubtract(binaryRealMultiply(cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base).split('').reverse(), binaryRealMultiply(aa, bb, base).split('').reverse(), base);
                                                    var im = binaryRealAdd(binaryRealMultiply(aa, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base).split('').reverse(), binaryRealMultiply(bb, cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, base).split('').reverse(), base);
                                                    setValues({ value: values.value, memory: comParse(re, '-' + im, '*', base), repeat: true });
                                                } else {
                                                    // di
                                                    var dd = values.value.split('i')[0].split('').reverse();
                                                    var re = binaryRealMultiply(cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base);
                                                    var im = binaryRealMultiply(aa, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base);
                                                    setValues({ value: values.value, memory: comParse(re, '-' + im, '*', base), repeat: true });
                                                }
                                            } else if (values.memory.includes('+')) {
                                                // -a + bi
                                                var aa = values.memory.split('+')[0].split('-')[1].split('').reverse();
                                                var cc = values.memory.split('+')[1].split('i')[0].split('').reverse();
                                                if (values.value.startsWith('-')) {
                                                    // -c + di, -c - di, -di
                                                    if (values.value.split('-').length > 2) {
                                                        // -c - di
                                                        var bb = values.value.split('-')[1].split('').reverse();
                                                        var dd = values.value.split('-')[2].split('i')[0].split('').reverse();
                                                        var re = binaryRealAdd(binaryRealMultiply(aa, bb, base).split('').reverse(), binaryRealMultiply(cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base).split('').reverse(), base);
                                                        var im = binaryRealSubtract(binaryRealMultiply(aa, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base).split('').reverse(), binaryRealMultiply(bb, cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, base).split('').reverse(), base);
                                                        setValues({ value: values.value, memory: comParse(re, im, '*', base), repeat: true });
                                                    } else if (values.value.includes('+')) {
                                                        // -c + di
                                                        var bb = values.value.split('+')[0].split('-')[1].split('').reverse();
                                                        var dd = values.value.split('+')[1].split('i')[0].split('').reverse();
                                                        var re = binaryRealSubtract(binaryRealMultiply(aa, bb, base).split('').reverse(), binaryRealMultiply(cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base).split('').reverse(), base);
                                                        var im = binaryRealAdd(binaryRealMultiply(aa, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base).split('').reverse(), binaryRealMultiply(bb, cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, base).split('').reverse(), base);
                                                        setValues({ value: values.value, memory: comParse(re, '-' + im, '*', base), repeat: true });
                                                    } else {
                                                        // -di
                                                        var dd = values.value.split('-')[1].split('i')[0].split('').reverse();
                                                        var re = binaryRealMultiply(cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base);
                                                        var im = binaryRealMultiply(aa, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base);
                                                        setValues({ value: values.value, memory: comParse(re, im, '*', base), repeat: true });
                                                    }
                                                } else if (values.value.includes('-')) {
                                                    // c - di
                                                    var bb = values.value.split('-')[0].split('').reverse();
                                                    var dd = values.value.split('-')[1].split('i')[0].split('').reverse();
                                                    var re = binaryRealSubtract(binaryRealMultiply(cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base).split('').reverse(), binaryRealMultiply(aa, bb, base).split('').reverse(), base);
                                                    var im = binaryRealAdd(binaryRealMultiply(aa, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base).split('').reverse(), binaryRealMultiply(bb, cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, base).split('').reverse(), base);
                                                    setValues({ value: values.value, memory: comParse(re, im, '*', base), repeat: true });
                                                } else if (values.value.includes('+')) {
                                                    // c + di
                                                    var bb = values.value.split('+')[0].split('').reverse();
                                                    var dd = values.value.split('+')[1].split('i')[0].split('').reverse();
                                                    var re = binaryRealAdd(binaryRealMultiply(aa, bb, base).split('').reverse(), binaryRealMultiply(cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base).split('').reverse(), base);
                                                    var im = binaryRealSubtract(binaryRealMultiply(bb, cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, base).split('').reverse(), binaryRealMultiply(aa, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base).split('').reverse(), base);
                                                    setValues({ value: values.value, memory: comParse('-' + re, im, '*', base), repeat: true });
                                                } else {
                                                    // di
                                                    var dd = values.value.split('i')[0].split('').reverse();
                                                    var re = binaryRealMultiply(cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base);
                                                    var im = binaryRealMultiply(aa, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base);
                                                    setValues({ value: values.value, memory: comParse('-' + re, '-' + im, '*', base), repeat: true });
                                                }
                                            } else {
                                                // -bi
                                                var aa = values.memory.split('-')[1].split('i')[0].split('').reverse();
                                                if (values.value.startsWith('-')) {
                                                    // -c + di, -c - di, -di
                                                    if (values.value.split('-').length > 2) {
                                                        // -c - di
                                                        var bb = values.value.split('-')[1].split('').reverse();
                                                        var cc = values.value.split('-')[2].split('i')[0].split('').reverse();
                                                        var re = binaryRealMultiply(aa.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : aa, cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, base);
                                                        var im = binaryRealMultiply(aa.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : aa, bb, base);
                                                        setValues({ value: values.value, memory: comParse('-' + re, im, '*', base), repeat: true });
                                                    } else if (values.value.includes('+')) {
                                                        // -c + di
                                                        var bb = values.value.split('+')[0].split('-')[1].split('').reverse();
                                                        var cc = values.value.split('+')[1].split('i')[0].split('').reverse();
                                                        var re = binaryRealMultiply(aa.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : aa, cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, base);
                                                        var im = binaryRealMultiply(aa.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : aa, bb, base);
                                                        setValues({ value: values.value, memory: comParse(re, im, '*', base), repeat: true });
                                                    } else {
                                                        // -di
                                                        var bb = values.value.split('-')[1].split('i')[0].split('').reverse();
                                                        var re = binaryRealMultiply(aa.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : aa, bb.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : bb, base);
                                                        setValues({ value: values.value, memory: comParse('-' + re, base == 1 ? '' : (base.values.length > 17 ? base.values[17] : '0'), '*', base), repeat: true });
                                                    }
                                                } else if (values.value.includes('-')) {
                                                    // c - di
                                                    var bb = values.value.split('-')[0].split('').reverse();
                                                    var cc = values.value.split('-')[1].split('i')[0].split('').reverse();
                                                    var re = binaryRealMultiply(aa.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : aa, cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, base);
                                                    var im = binaryRealMultiply(aa.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : aa, bb, base);
                                                    setValues({ value: values.value, memory: comParse('-' + re, '-' + im, '*', base), repeat: true });
                                                } else if (values.value.includes('+')) {
                                                    // c + di
                                                    var bb = values.value.split('+')[0].split('').reverse();
                                                    var cc = values.value.split('+')[1].split('i')[0].split('').reverse();
                                                    var re = binaryRealMultiply(aa.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : aa, cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, base);
                                                    var im = binaryRealMultiply(aa.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : aa, bb, base);
                                                    setValues({ value: values.value, memory: comParse(re, '-' + im, '*', base), repeat: true });
                                                } else {
                                                    // di
                                                    var bb = values.value.split('i')[0].split('').reverse();
                                                    var re = binaryRealMultiply(aa.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : aa, bb.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : bb, base);
                                                    setValues({ value: values.value, memory: comParse(re, base == 1 ? '' : (base.values.length > 17 ? base.values[17] : '0'), '*', base), repeat: true });
                                                }
                                            }
                                        } else if (values.memory.includes('-')) {
                                            // a - bi
                                            var aa = values.memory.split('-')[0].split('').reverse();
                                            var cc = values.memory.split('-')[1].split('i')[0].split('').reverse();
                                            if (values.value.startsWith('-')) {
                                                // -c + di, -c - di, -di
                                                if (values.value.split('-').length > 2) {
                                                    // -c - di
                                                    var bb = values.value.split('-')[1].split('').reverse();
                                                    var dd = values.value.split('-')[2].split('i')[0].split('').reverse();
                                                    var re = binaryRealAdd(binaryRealMultiply(aa, bb, base).split('').reverse(), binaryRealMultiply(cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base).split('').reverse(), base);
                                                    var im = binaryRealSubtract(binaryRealMultiply(bb, cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, base).split('').reverse(), binaryRealMultiply(aa, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base).split('').reverse(), base);
                                                    setValues({ value: values.value, memory: comParse('-' + re, im, '*', base), repeat: true });
                                                } else if (values.value.includes('+')) {
                                                    // -c + di
                                                    var bb = values.value.split('+')[0].split('-')[1].split('').reverse();
                                                    var dd = values.value.split('+')[1].split('i')[0].split('').reverse();
                                                    var re = binaryRealSubtract(binaryRealMultiply(cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base).split('').reverse(), binaryRealMultiply(aa, bb, base).split('').reverse(), base);
                                                    var im = binaryRealAdd(binaryRealMultiply(aa, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base).split('').reverse(), binaryRealMultiply(bb, cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, base).split('').reverse(), base);
                                                    setValues({ value: values.value, memory: comParse(re, im, '*', base), repeat: true });
                                                } else {
                                                    // -di
                                                    var dd = values.value.split('-')[1].split('i')[0].split('').reverse();
                                                    var re = binaryRealMultiply(cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base);
                                                    var im = binaryRealMultiply(aa, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base);
                                                    setValues({ value: values.value, memory: comParse('-' + re, '-' + im, '*', base), repeat: true });
                                                }
                                            } else if (values.value.includes('-')) {
                                                // c - di
                                                var bb = values.value.split('-')[0].split('').reverse();
                                                var dd = values.value.split('-')[1].split('i')[0].split('').reverse();
                                                var re = binaryRealSubtract(binaryRealMultiply(aa, bb, base).split('').reverse(), binaryRealMultiply(cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base).split('').reverse(), base);
                                                var im = binaryRealAdd(binaryRealMultiply(aa, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base).split('').reverse(), binaryRealMultiply(bb, cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, base).split('').reverse(), base);
                                                setValues({ value: values.value, memory: comParse(re, '-' + im, '*', base), repeat: true });
                                            } else if (values.value.includes('+')) {
                                                // c + di
                                                var bb = values.value.split('+')[0].split('').reverse();
                                                var dd = values.value.split('+')[1].split('i')[0].split('').reverse();
                                                var re = binaryRealAdd(binaryRealMultiply(aa, bb, base).split('').reverse(), binaryRealMultiply(cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base).split('').reverse(), base);
                                                var im = binaryRealSubtract(binaryRealMultiply(aa, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base).split('').reverse(), binaryRealMultiply(bb, cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, base).split('').reverse(), base);
                                                setValues({ value: values.value, memory: comParse(re, im, '*', base), repeat: true });
                                            } else {
                                                // di
                                                var dd = values.value.split('i')[0].split('').reverse();
                                                var re = binaryRealMultiply(cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base);
                                                var im = binaryRealMultiply(aa, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base);
                                                setValues({ value: values.value, memory: comParse(re, im, '*', base), repeat: true });
                                            }
                                        } else if (values.memory.includes('+')) {
                                            // a + bi
                                            var aa = values.memory.split('+')[0].split('').reverse();
                                            var cc = values.memory.split('+')[1].split('i')[0].split('').reverse();
                                            if (values.value.startsWith('-')) {
                                                // -c + di, -c - di, -di
                                                if (values.value.split('-').length > 2) {
                                                    // -c - di
                                                    var bb = values.value.split('-')[1].split('').reverse();
                                                    var dd = values.value.split('-')[2].split('i')[0].split('').reverse();
                                                    var re = binaryRealSubtract(binaryRealMultiply(cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base).split('').reverse(), binaryRealMultiply(aa, bb, base).split('').reverse(), base);
                                                    var im = binaryRealAdd(binaryRealMultiply(aa, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base).split('').reverse(), binaryRealMultiply(bb, cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, base).split('').reverse(), base);
                                                    setValues({ value: values.value, memory: comParse(re, '-' + im, '*', base), repeat: true });
                                                } else if (values.value.includes('+')) {
                                                    // -c + di
                                                    var bb = values.value.split('+')[0].split('-')[1].split('').reverse();
                                                    var dd = values.value.split('+')[1].split('i')[0].split('').reverse();
                                                    var re = binaryRealAdd(binaryRealMultiply(aa, bb, base).split('').reverse(), binaryRealMultiply(cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base).split('').reverse(), base);
                                                    var im = binaryRealSubtract(binaryRealMultiply(aa, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base).split('').reverse(), binaryRealMultiply(bb, cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, base).split('').reverse(), base);
                                                    setValues({ value: values.value, memory: comParse('-' + re, im, '*', base), repeat: true });
                                                } else {
                                                    // -di
                                                    var dd = values.value.split('-')[1].split('i')[0].split('').reverse();
                                                    var re = binaryRealMultiply(cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base);
                                                    var im = binaryRealMultiply(aa, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base);
                                                    setValues({ value: values.value, memory: comParse(re, '-' + im, '*', base), repeat: true });
                                                }
                                            } else if (values.value.includes('-')) {
                                                // c - di
                                                var bb = values.value.split('-')[0].split('').reverse();
                                                var dd = values.value.split('-')[1].split('i')[0].split('').reverse();
                                                var re = binaryRealAdd(binaryRealMultiply(aa, bb, base).split('').reverse(), binaryRealMultiply(cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base).split('').reverse(), base);
                                                var im = binaryRealSubtract(binaryRealMultiply(bb, cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, base).split('').reverse(), binaryRealMultiply(aa, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base).split('').reverse(), base);
                                                setValues({ value: values.value, memory: comParse(re, im, '*', base), repeat: true });
                                            } else if (values.value.includes('+')) {
                                                // c + di
                                                var bb = values.value.split('+')[0].split('').reverse();
                                                var dd = values.value.split('+')[1].split('i')[0].split('').reverse();
                                                var re = binaryRealSubtract(binaryRealMultiply(aa, bb, base).split('').reverse(), binaryRealMultiply(cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base).split('').reverse(), base);
                                                var im = binaryRealAdd(binaryRealMultiply(aa, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base).split('').reverse(), binaryRealMultiply(bb, cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, base).split('').reverse(), base);
                                                setValues({ value: values.value, memory: comParse(re, im, '*', base), repeat: true });
                                            } else {
                                                // di
                                                var dd = values.value.split('i')[0].split('').reverse();
                                                var re = binaryRealMultiply(cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base);
                                                var im = binaryRealMultiply(aa, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base);
                                                setValues({ value: values.value, memory: comParse('-' + re, im, '*', base), repeat: true });
                                            }
                                        } else {
                                            // bi
                                            var aa = values.memory.split('i')[0].split('').reverse();
                                            if (values.value.startsWith('-')) {
                                                // -c + di, -c - di, -di
                                                if (values.value.split('-').length > 2) {
                                                    // -c - di
                                                    var bb = values.value.split('-')[1].split('').reverse();
                                                    var cc = values.value.split('-')[2].split('i')[0].split('').reverse();
                                                    var re = binaryRealMultiply(aa.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : aa, cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, base);
                                                    var im = binaryRealMultiply(aa.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : aa, bb, base);
                                                    setValues({ value: values.value, memory: comParse(re, '-' + im, '*', base), repeat: true });
                                                } else if (values.value.includes('+')) {
                                                    // -c + di
                                                    var bb = values.value.split('+')[0].split('').reverse();
                                                    var cc = values.value.split('+')[1].split('i')[0].split('').reverse();
                                                    var re = binaryRealMultiply(aa.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : aa, cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, base);
                                                    var im = binaryRealMultiply(aa.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : aa, bb, base);
                                                    setValues({ value: values.value, memory: comParse('-' + re, '-' + im, '*', base), repeat: true });
                                                } else {
                                                    // -di
                                                    var bb = values.value.split('-')[1].split('i')[0].split('').reverse();
                                                    var re = binaryRealMultiply(aa.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : aa, bb.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : bb, base);
                                                    setValues({ value: values.value, memory: comParse(re, base == 1 ? '' : (base.values.length > 17 ? base.values[17] : '0'), '*', base), repeat: true });
                                                }
                                            } else if (values.value.includes('-')) {
                                                // c - di
                                                var bb = values.value.split('-')[0].split('').reverse();
                                                var cc = values.value.split('-')[1].split('i')[0].split('').reverse();
                                                var re = binaryRealMultiply(aa.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : aa, cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, base);
                                                var im = binaryRealMultiply(aa.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : aa, bb, base);
                                                setValues({ value: values.value, memory: comParse(re, im, '*', base), repeat: true });
                                            } else if (values.value.includes('+')) {
                                                // c + di
                                                var bb = values.value.split('+')[0].split('').reverse();
                                                var cc = values.value.split('+')[1].split('i')[0].split('').reverse();
                                                var re = binaryRealMultiply(aa.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : aa, cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, base);
                                                var im = binaryRealMultiply(aa.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : aa, bb, base);
                                                setValues({ value: values.value, memory: comParse('-' + re, im, '*', base), repeat: true });
                                            } else {
                                                // di
                                                var bb = values.value.split('i')[0].split('').reverse();
                                                var re = binaryRealMultiply(aa.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : aa, bb.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : bb, base);
                                                setValues({ value: values.value, memory: comParse('-' + re, base == 1 ? '' : (base.values.length > 17 ? base.values[17] : '0'), '*', base), repeat: true });
                                            }
                                        }
                                    } else {
                                        // values.value is real
                                        if (values.memory.startsWith('-')) {
                                            // -a + bi, -a - bi, -bi
                                            if (values.memory.split('-').length > 2) {
                                                // -a - bi
                                                var aa = values.memory.split('-')[1].split('').reverse();
                                                var bb = values.memory.split('-')[2].split('i')[0].split('').reverse();
                                                if (values.value.startsWith('-')) {
                                                    // ac + bci
                                                    var cc = values.value.split('-')[1].split('').reverse();
                                                    var re = binaryRealMultiply(aa, cc, base);
                                                    var im = binaryRealMultiply(bb.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : bb, cc, base);
                                                    setValues({ value: values.value, memory: comParse(re, im, '*', base), repeat: true });
                                                } else {
                                                    // -ac - bci
                                                    var cc = values.value.split('').reverse();
                                                    var re = binaryRealMultiply(aa, cc, base);
                                                    var im = binaryRealMultiply(bb.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : bb, cc, base);
                                                    setValues({ value: values.value, memory: comParse('-' + re, '-' + im, '*', base), repeat: true });
                                                }
                                            } else if (values.memory.includes('+')) {
                                                // -a + bi
                                                var aa = values.memory.split('+')[0].split('-')[1].split('').reverse();
                                                var bb = values.memory.split('+')[1].split('i')[0].split('').reverse();
                                                if (values.value.startsWith('-')) {
                                                    // ac - bci
                                                    var cc = values.value.split('-')[1].split('').reverse();
                                                    var re = binaryRealMultiply(aa, cc, base);
                                                    var im = binaryRealMultiply(bb.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : bb, cc, base);
                                                    setValues({ value: values.value, memory: comParse(re, '-' + im, '*', base), repeat: true });
                                                } else {
                                                    // -ac + bci
                                                    var cc = values.value.split('').reverse();
                                                    var re = binaryRealMultiply(aa, cc, base);
                                                    var im = binaryRealMultiply(bb.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : bb, cc, base);
                                                    setValues({ value: values.value, memory: comParse('-' + re, im, '*', base), repeat: true });
                                                }
                                            } else {
                                                // -bi
                                                var aa = values.memory.split('-')[1].split('i')[0].split('').reverse();
                                                if (values.memory == ((base.values.length > 17 ? base.values[17] : '0') + '*') || values.memory == '*') {
                                                    setValues({
                                                        value: values.value, memory: (base.num == 1 ? '*' : ((base.values.length > 17 ? base.values[17] : '0') + '*')), repeat: true });
                                                } else {
                                                    if (values.memory.startsWith('-')) {
                                                        // bci
                                                        setValues({ value: values.value, memory: comParse(base == 1 ? '' : (base.values.length > 17 ? base.values[17] : '0'), binaryRealMultiply(aa.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : aa, values.value.split('-')[1].split('').reverse(), base), '*', base), repeat: true });
                                                    } else {
                                                        // -bci
                                                        setValues({ value: values.value, memory: comParse(base == 1 ? '' : (base.values.length > 17 ? base.values[17] : '0'), '-' + binaryRealMultiply(aa.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : aa, values.value.split('').reverse(), base), '*', base), repeat: true });
                                                    }
                                                }
                                            }
                                        } else if (values.memory.includes('-')) {
                                            // a - bi
                                            var aa = values.memory.split('-')[0].split('').reverse();
                                            var bb = values.memory.split('-')[1].split('i')[0].split('').reverse();
                                            if (values.value.startsWith('-')) {
                                                // -ac + bci
                                                var cc = values.value.split('-')[1].split('').reverse();
                                                var re = binaryRealMultiply(aa, cc, base);
                                                var im = binaryRealMultiply(bb.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : bb, cc, base);
                                                setValues({ value: values.value, memory: comParse('-' + re, im, '*', base), repeat: true });
                                            } else {
                                                // ac - bci
                                                var cc = values.value.split('').reverse();
                                                var re = binaryRealMultiply(aa, cc, base);
                                                var im = binaryRealMultiply(bb.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : bb, cc, base);
                                                setValues({ value: values.value, memory: comParse(re, '-' + im, '*', base), repeat: true });
                                            }
                                        } else if (values.memory.includes('+')) {
                                            // a + bi
                                            var aa = values.memory.split('+')[0].split('').reverse();
                                            var bb = values.memory.split('+')[1].split('i')[0].split('').reverse();
                                            if (values.value.startsWith('-')) {
                                                // -ac - bci
                                                var cc = values.value.split('-')[1].split('').reverse();
                                                var re = binaryRealMultiply(aa, cc, base);
                                                var im = binaryRealMultiply(bb.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : bb, cc, base);
                                                setValues({ value: values.value, memory: comParse('-' + re, '-' + im, '*', base), repeat: true });
                                            } else {
                                                // ac + bci
                                                var cc = values.value.split('').reverse();
                                                var re = binaryRealMultiply(aa, cc, base);
                                                var im = binaryRealMultiply(bb.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : bb, cc, base);
                                                setValues({ value: values.value, memory: comParse(re, im, '*', base), repeat: true });
                                            }
                                        } else {
                                            // bi
                                            var aa = values.memory.split('i')[0].split('').reverse();
                                            if (values.memory == ((base.values.length > 17 ? base.values[17] : '0') + '*') || values.memory == '*') {
                                                setValues({
                                                    value: values.value, memory: (base.num == 1 ? '*' : ((base.values.length > 17 ? base.values[17] : '0') + '*')), repeat: true });
                                            } else {
                                                if (values.memory.startsWith('-')) {
                                                    // -bci
                                                    setValues({ value: values.value, memory: comParse(base == 1 ? '' : (base.values.length > 17 ? base.values[17] : '0'), '-' + binaryRealMultiply(aa.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : aa, values.value.split('-')[1].split('').reverse(), base), '*', base), repeat: true });
                                                } else {
                                                    // bci
                                                    setValues({ value: values.value, memory: comParse(base == 1 ? '' : (base.values.length > 17 ? base.values[17] : '0'), binaryRealMultiply(aa.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : aa, values.value.split('').reverse(), base), '*', base), repeat: true });
                                                }
                                            }
                                        }
                                    }
                                } else {
                                    if (values.value.includes('i')) {
                                        if (values.value.startsWith('-')) {
                                            // -c + di, -c - di, -di
                                            if (values.value.split('-').length > 2) {
                                                // -c - di
                                                var aa = values.value.split('-')[1].split('').reverse();
                                                var bb = values.value.split('-')[2].split('i')[0].split('').reverse();
                                                if (values.memory.startsWith('-')) {
                                                    // ac + adi
                                                    var cc = values.memory.split('*')[0].split('-')[1].split('').reverse();
                                                    var re = binaryRealMultiply(aa, cc, base);
                                                    var im = binaryRealMultiply(bb.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : bb, cc, base);
                                                    setValues({ value: values.value, memory: comParse(re, im, '*', base), repeat: true });
                                                } else {
                                                    // -ac - adi
                                                    var cc = values.memory.split('*')[0].split('').reverse();
                                                    var re = binaryRealMultiply(aa, cc, base);
                                                    var im = binaryRealMultiply(bb.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : bb, cc, base);
                                                    setValues({ value: values.value, memory: comParse('-' + re, '-' + im, '*', base), repeat: true });
                                                }
                                            } else if (values.value.split('-')[1].includes('+')) {
                                                // -c + di
                                                var aa = values.value.split('+')[0].split('-')[1].split('').reverse();
                                                var bb = values.value.split('+')[1].split('i')[0].split('').reverse();
                                                if (values.memory.startsWith('-')) {
                                                    // ac - adi
                                                    var cc = values.memory.split('*')[0].split('-')[1].split('').reverse();
                                                    var re = binaryRealMultiply(aa, cc, base);
                                                    var im = binaryRealMultiply(bb.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : bb, cc, base);
                                                    setValues({ value: values.value, memory: comParse(re, '-' + im, '*', base), repeat: true });
                                                } else {
                                                    // -ac + adi
                                                    var cc = values.memory.split('*')[0].split('').reverse();
                                                    var re = binaryRealMultiply(aa, cc, base);
                                                    var im = binaryRealMultiply(bb.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : bb, cc, base);
                                                    setValues({ value: values.value, memory: comParse('-' + re, im, '*', base), repeat: true });
                                                }
                                            } else {
                                                // -di
                                                var aa = values.value.split('-')[1].split('i')[0].split('').reverse();
                                                if (values.memory == ((base.values.length > 17 ? base.values[17] : '0') + '*') || values.memory == '*') {
                                                    setValues({
                                                        value: values.value, memory: (base.num == 1 ? '*' : ((base.values.length > 17 ? base.values[17] : '0') + '*')), repeat: true });
                                                } else {
                                                    if (values.memory.startsWith('-')) {
                                                        // adi
                                                        setValues({ value: values.value, memory: comParse(base == 1 ? '' : (base.values.length > 17 ? base.values[17] : '0'), binaryRealMultiply(aa.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : aa, values.memory.split('*')[0].split('-')[1].split('').reverse(), base), '*', base), repeat: true });
                                                    } else {
                                                        // -adi
                                                        setValues({ value: values.value, memory: comParse(base == 1 ? '' : (base.values.length > 17 ? base.values[17] : '0'), '-' + binaryRealMultiply(aa.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : aa, values.memory.split('*')[0].split('').reverse(), base), '*', base), repeat: true });
                                                    }
                                                }
                                            }
                                        } else if (values.value.includes('-')) {
                                            // c - di
                                            var aa = values.value.split('-')[0].split('').reverse();
                                            var bb = values.value.split('-')[1].split('i')[0].split('').reverse();
                                            if (values.memory.startsWith('-')) {
                                                // -ac + adi
                                                var cc = values.memory.split('*')[0].split('-')[1].split('').reverse();
                                                var re = binaryRealMultiply(aa, cc, base);
                                                var im = binaryRealMultiply(bb.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : bb, cc, base);
                                                setValues({ value: values.value, memory: comParse('-' + re, im, '*', base), repeat: true });
                                            } else {
                                                // ac - adi
                                                var cc = values.memory.split('*')[0].split('').reverse();
                                                var re = binaryRealMultiply(aa, cc, base);
                                                var im = binaryRealMultiply(bb.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : bb, cc, base);
                                                setValues({ value: values.value, memory: comParse(re, '-' + im, '*', base), repeat: true });
                                            }
                                        } else if (values.value.includes('+')) {
                                            // c + di
                                            var aa = values.value.split('+')[0].split('').reverse();
                                            var bb = values.value.split('+')[1].split('i')[0].split('').reverse();
                                            if (values.memory.startsWith('-')) {
                                                // -ac - adi
                                                var cc = values.memory.split('*')[0].split('-')[1].split('').reverse();
                                                var re = binaryRealMultiply(aa, cc, base);
                                                var im = binaryRealMultiply(bb.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : bb, cc, base);
                                                setValues({ value: values.value, memory: comParse('-' + re, '-' + im, '*', base), repeat: true });
                                            } else {
                                                // ac + adi
                                                var cc = values.memory.split('*')[0].split('').reverse();
                                                var re = binaryRealMultiply(aa, cc, base);
                                                var im = binaryRealMultiply(bb.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : bb, cc, base);
                                                setValues({ value: values.value, memory: comParse(re, im, '*', base), repeat: true });
                                            }
                                        } else {
                                            // di
                                            var aa = values.value.split('i')[0].split('').reverse();
                                            if (values.memory == ((base.values.length > 17 ? base.values[17] : '0') + '*') || values.memory == '*') {
                                                setValues({
                                                    value: values.value, memory: (base.num == 1 ? '*' : ((base.values.length > 17 ? base.values[17] : '0') + '*')), repeat: true });
                                            } else {
                                                if (values.memory.startsWith('-')) {
                                                    // -adi
                                                    setValues({ value: values.value, memory: comParse(base == 1 ? '' : (base.values.length > 17 ? base.values[17] : '0'), '-' + binaryRealMultiply(aa.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : aa, values.memory.split('*')[0].split('-')[1].split('').reverse(), base), '*', base), repeat: true });
                                                } else {
                                                    // adi
                                                    setValues({ value: values.value, memory: comParse(base == 1 ? '' : (base.values.length > 17 ? base.values[17] : '0'), binaryRealMultiply(aa.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : aa, values.memory.split('*')[0].split('').reverse(), base), '*', base), repeat: true });
                                                }
                                            }
                                        }
                                    } else {
                                        if (values.memory.includes('-')) {
                                            var aa = values.memory.split('*')[0].split('-')[1].split('').reverse();
                                            if (values.value.includes('-')) {
                                                // negative * negative
                                                setValues({ value: values.value, memory: (binaryRealMultiply(aa, values.value.split('-')[1].split('').reverse(), base) + '*'), repeat: true });
                                            } else {
                                                // negative * positive
                                                setValues({ value: values.value, memory: ('-' + binaryRealMultiply(aa, values.value.split('').reverse(), base) + '*'), repeat: true });
                                            }
                                        } else {
                                            var aa = values.memory.split('*')[0].split('').reverse();
                                            if (values.value.includes('-')) {
                                                // positive * negative
                                                setValues({ value: values.value, memory: ('-' + binaryRealMultiply(aa, values.value.split('-')[1].split('').reverse(), base) + '*'), repeat: true });
                                            } else {
                                                // positive * positive
                                                setValues({ value: values.value, memory: (binaryRealMultiply(aa, values.value.split('').reverse(), base) + '*'), repeat: true });
                                            }
                                        }
                                    }
                                }
                                break;
                            case '/':
                                if (values.memory.includes('i')) {
                                    // complex
                                    if (values.value.includes('i')) {
                                        // values.value is imaginary
                                        if (values.memory.startsWith('-')) {
                                            // -a + bi, -a - bi, -bi
                                            if (values.memory.split('-').length > 2) {
                                                // -a - bi
                                                var aa = values.memory.split('-')[1].split('').reverse();
                                                var cc = values.memory.split('-')[2].split('i')[0].split('').reverse();
                                                if (values.value.startsWith('-')) {
                                                    // -c + di, -c - di, -di
                                                    if (values.value.split('-').length > 2) {
                                                        // -c - di
                                                        var bb = values.value.split('-')[1].split('').reverse();
                                                        var dd = values.value.split('-')[2].split('i')[0].split('').reverse();
                                                        var denom = binaryRealAdd(binaryRealMultiply(bb, bb, base).split('').reverse(), binaryRealMultiply(dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base).split('').reverse(), base).split('').reverse();
                                                        var re = binaryRealDivide(binaryRealAdd(binaryRealMultiply(aa, bb, base).split('').reverse(), binaryRealMultiply(cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base).split('').reverse(), base).split('').reverse(), denom, base);
                                                        var im = binaryRealDivide(binaryRealSubtract(binaryRealMultiply(bb, cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, base).split('').reverse(), binaryRealMultiply(aa, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base).split('').reverse(), base).split('').reverse(), denom, base);
                                                        setValues({ value: values.value, memory: comParse(re, im, '/', base), repeat: true });
                                                    } else if (values.value.includes('+')) {
                                                        // -c + di
                                                        var bb = values.value.split('+')[0].split('-')[1].split('').reverse();
                                                        var dd = values.value.split('+')[1].split('i')[0].split('').reverse();
                                                        var denom = binaryRealAdd(binaryRealMultiply(bb, bb, base).split('').reverse(), binaryRealMultiply(dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base).split('').reverse(), base).split('').reverse();
                                                        var re = binaryRealDivide(binaryRealSubtract(binaryRealMultiply(aa, bb, base).split('').reverse(), binaryRealMultiply(cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base).split('').reverse(), base).split('').reverse(), denom, base);
                                                        var im = binaryRealDivide(binaryRealAdd(binaryRealMultiply(aa, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base).split('').reverse(), binaryRealMultiply(bb, cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, base).split('').reverse(), base).split('').reverse(), denom, base);
                                                        setValues({ value: values.value, memory: comParse(re, im, '/', base), repeat: true });
                                                    } else {
                                                        // -di
                                                        var dd = values.value.split('-')[1].split('i')[0].split('').reverse();
                                                        var re = binaryRealDivide(cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base);
                                                        var im = binaryRealDivide(aa, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base);
                                                        setValues({ value: values.value, memory: comParse(re, '-' + im, '/', base), repeat: true });
                                                    }
                                                } else if (values.value.includes('-')) {
                                                    // c - di
                                                    var bb = values.value.split('-')[0].split('').reverse();
                                                    var dd = values.value.split('-')[1].split('i')[0].split('').reverse();
                                                    var denom = binaryRealAdd(binaryRealMultiply(bb, bb, base).split('').reverse(), binaryRealMultiply(dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base).split('').reverse(), base).split('').reverse();
                                                    var re = binaryRealDivide(binaryRealSubtract(binaryRealMultiply(cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base).split('').reverse(), binaryRealMultiply(aa, bb, base).split('').reverse(), base).split('').reverse(), denom, base);
                                                    var im = binaryRealDivide(binaryRealAdd(binaryRealMultiply(aa, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base).split('').reverse(), binaryRealMultiply(bb, cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, base).split('').reverse(), base).split('').reverse(), denom, base);
                                                    setValues({ value: values.value, memory: comParse(re, '-' + im, '/', base), repeat: true });
                                                } else if (values.value.includes('+')) {
                                                    // c + di
                                                    var bb = values.value.split('+')[0].split('').reverse();
                                                    var dd = values.value.split('+')[1].split('i')[0].split('').reverse();
                                                    var denom = binaryRealAdd(binaryRealMultiply(bb, bb, base).split('').reverse(), binaryRealMultiply(dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base).split('').reverse(), base).split('').reverse();
                                                    var re = binaryRealDivide(binaryRealAdd(binaryRealMultiply(aa, bb, base).split('').reverse(), binaryRealMultiply(cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base).split('').reverse(), base).split('').reverse(), denom, base);
                                                    var im = binaryRealDivide(binaryRealSubtract(binaryRealMultiply(aa, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base).split('').reverse(), binaryRealMultiply(bb, cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, base).split('').reverse(), base).split('').reverse(), denom, base);
                                                    setValues({ value: values.value, memory: comParse('-' + re, im, '/', base), repeat: true });
                                                } else {
                                                    // di
                                                    var dd = values.value.split('i')[0].split('').reverse();
                                                    var re = binaryRealDivide(cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base);
                                                    var im = binaryRealDivide(aa, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base);
                                                    setValues({ value: values.value, memory: comParse('-' + re, im, '/', base), repeat: true });
                                                }
                                            } else if (values.memory.includes('+')) {
                                                // -a + bi
                                                var aa = values.memory.split('+')[0].split('-')[1].split('').reverse();
                                                var cc = values.memory.split('+')[1].split('i')[0].split('').reverse();
                                                if (values.value.startsWith('-')) {
                                                    // -c + di, -c - di, -di
                                                    if (values.value.split('-').length > 2) {
                                                        // -c - di
                                                        var bb = values.value.split('-')[1].split('').reverse();
                                                        var dd = values.value.split('-')[2].split('i')[0].split('').reverse();
                                                        var denom = binaryRealAdd(binaryRealMultiply(bb, bb, base).split('').reverse(), binaryRealMultiply(dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base).split('').reverse(), base).split('').reverse();
                                                        var re = binaryRealDivide(binaryRealSubtract(binaryRealMultiply(aa, bb, base).split('').reverse(), binaryRealMultiply(cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base).split('').reverse(), base).split('').reverse(), denom, base);
                                                        var im = binaryRealDivide(binaryRealAdd(binaryRealMultiply(aa, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base).split('').reverse(), binaryRealMultiply(bb, cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, base).split('').reverse(), base).split('').reverse(), denom, base);
                                                        setValues({ value: values.value, memory: comParse(re, '-' + im, '/', base), repeat: true });
                                                    } else if (values.value.includes('+')) {
                                                        // -c + di
                                                        var bb = values.value.split('+')[0].split('-')[1].split('').reverse();
                                                        var dd = values.value.split('+')[1].split('i')[0].split('').reverse();
                                                        var denom = binaryRealAdd(binaryRealMultiply(bb, bb, base).split('').reverse(), binaryRealMultiply(dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base).split('').reverse(), base).split('').reverse();
                                                        var re = binaryRealDivide(binaryRealAdd(binaryRealMultiply(aa, bb, base).split('').reverse(), binaryRealMultiply(cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base).split('').reverse(), base).split('').reverse(), denom, base);
                                                        var im = binaryRealDivide(binaryRealSubtract(binaryRealMultiply(aa, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base).split('').reverse(), binaryRealMultiply(bb, cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, base).split('').reverse(), base).split('').reverse(), denom, base);
                                                        setValues({ value: values.value, memory: comParse(re, im, '/', base), repeat: true });
                                                    } else {
                                                        // -di
                                                        var dd = values.value.split('-')[1].split('i')[0].split('').reverse();
                                                        var re = binaryRealDivide(cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base);
                                                        var im = binaryRealDivide(aa, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base);
                                                        setValues({ value: values.value, memory: comParse('-' + re, '-' + im, '/', base), repeat: true });
                                                    }
                                                } else if (values.value.includes('-')) {
                                                    // c - di
                                                    var bb = values.value.split('-')[0].split('').reverse();
                                                    var dd = values.value.split('-')[1].split('i')[0].split('').reverse();
                                                    var denom = binaryRealAdd(binaryRealMultiply(bb, bb, base).split('').reverse(), binaryRealMultiply(dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base).split('').reverse(), base).split('').reverse();
                                                    var re = binaryRealDivide(binaryRealAdd(binaryRealMultiply(aa, bb, base).split('').reverse(), binaryRealMultiply(cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base).split('').reverse(), base).split('').reverse(), denom, base);
                                                    var im = binaryRealDivide(binaryRealSubtract(binaryRealMultiply(bb, cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, base).split('').reverse(), binaryRealMultiply(aa, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base).split('').reverse(), base).split('').reverse(), denom, base);
                                                    setValues({ value: values.value, memory: comParse('-' + re, im, '/', base), repeat: true });
                                                } else if (values.value.includes('+')) {
                                                    // c + di
                                                    var bb = values.value.split('+')[0].split('').reverse();
                                                    var dd = values.value.split('+')[1].split('i')[0].split('').reverse();
                                                    var denom = binaryRealAdd(binaryRealMultiply(bb, bb, base).split('').reverse(), binaryRealMultiply(dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base).split('').reverse(), base).split('').reverse();
                                                    var re = binaryRealDivide(binaryRealSubtract(binaryRealMultiply(cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base).split('').reverse(), binaryRealMultiply(aa, bb, base).split('').reverse(), base).split('').reverse(), denom, base);
                                                    var im = binaryRealDivide(binaryRealAdd(binaryRealMultiply(aa, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base).split('').reverse(), binaryRealMultiply(bb, cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, base).split('').reverse(), base).split('').reverse(), denom, base);
                                                    setValues({ value: values.value, memory: comParse(re, im, '/', base), repeat: true });
                                                } else {
                                                    // di
                                                    var dd = values.value.split('i')[0].split('').reverse();
                                                    var re = binaryRealDivide(cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base);
                                                    var im = binaryRealDivide(aa, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base);
                                                    setValues({ value: values.value, memory: comParse(re, im, '/', base), repeat: true });
                                                }
                                            } else {
                                                // -bi
                                                var aa = values.memory.split('-')[1].split('i')[0].split('').reverse();
                                                if (values.value.startsWith('-')) {
                                                    // -c + di, -c - di, -di
                                                    if (values.value.split('-').length > 2) {
                                                        // -c - di
                                                        var bb = values.value.split('-')[1].split('').reverse();
                                                        var cc = values.value.split('-')[2].split('i')[0].split('').reverse();
                                                        var denom = binaryRealAdd(binaryRealMultiply(bb, bb, base).split('').reverse(), binaryRealMultiply(cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, base).split('').reverse(), base).split('').reverse();
                                                        var re = binaryRealDivide(binaryRealMultiply(aa.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : aa, cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, base).split('').reverse(), denom, base);
                                                        var im = binaryRealDivide(binaryRealMultiply(aa.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : aa, bb, base).split('').reverse(), denom, base);
                                                        setValues({ value: values.value, memory: comParse(re, im, '/', base), repeat: true });
                                                    } else if (values.value.includes('+')) {
                                                        // -c + di
                                                        var bb = values.value.split('+')[0].split('-')[1].split('').reverse();
                                                        var cc = values.value.split('+')[1].split('i')[0].split('').reverse();
                                                        var denom = binaryRealAdd(binaryRealMultiply(bb, bb, base).split('').reverse(), binaryRealMultiply(cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, base).split('').reverse(), base).split('').reverse();
                                                        var re = binaryRealDivide(binaryRealMultiply(aa.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : aa, cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, base).split('').reverse(), denom, base);
                                                        var im = binaryRealDivide(binaryRealMultiply(aa.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : aa, bb, base).split('').reverse(), denom, base);
                                                        setValues({ value: values.value, memory: comParse('-' + re, im, '/', base), repeat: true });
                                                    } else {
                                                        // -di
                                                        var bb = values.value.split('-')[1].split('i')[0].split('').reverse();
                                                        var re = binaryRealDivide(aa.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : aa, bb.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : bb, base);
                                                        setValues({ value: values.value, memory: comParse(re, base == 1 ? '' : (base.values.length > 17 ? base.values[17] : '0'), '/', base), repeat: true });
                                                    }
                                                } else if (values.value.includes('-')) {
                                                    // c - di
                                                    var bb = values.value.split('-')[0].split('').reverse();
                                                    var cc = values.value.split('-')[1].split('i')[0].split('').reverse();
                                                    var denom = binaryRealAdd(binaryRealMultiply(bb, bb, base).split('').reverse(), binaryRealMultiply(cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, base).split('').reverse(), base).split('').reverse();
                                                    var re = binaryRealDivide(binaryRealMultiply(aa.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : aa, cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, base).split('').reverse(), denom, base);
                                                    var im = binaryRealDivide(binaryRealMultiply(aa.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : aa, bb, base).split('').reverse(), denom, base);
                                                    setValues({ value: values.value, memory: comParse(re, '-' + im, '/', base), repeat: true });
                                                } else if (values.value.includes('+')) {
                                                    // c + di
                                                    var bb = values.value.split('+')[0].split('').reverse();
                                                    var cc = values.value.split('+')[1].split('i')[0].split('').reverse();
                                                    var denom = binaryRealAdd(binaryRealMultiply(bb, bb, base).split('').reverse(), binaryRealMultiply(cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, base).split('').reverse(), base).split('').reverse();
                                                    var re = binaryRealDivide(binaryRealMultiply(aa.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : aa, cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, base).split('').reverse(), denom, base);
                                                    var im = binaryRealDivide(binaryRealMultiply(aa.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : aa, bb, base).split('').reverse(), denom, base);
                                                    setValues({ value: values.value, memory: comParse('-' + re, '-' + im, '/', base), repeat: true });
                                                } else {
                                                    // di
                                                    var bb = values.value.split('i')[0].split('').reverse();
                                                    var re = binaryRealDivide(aa.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : aa, bb.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : bb, base);
                                                    setValues({ value: values.value, memory: comParse('-' + re, base == 1 ? '' : (base.values.length > 17 ? base.values[17] : '0'), '/', base), repeat: true });
                                                }
                                            }
                                        } else if (values.memory.includes('-')) {
                                            // a - bi
                                            var aa = values.memory.split('-')[0].split('').reverse();
                                            var cc = values.memory.split('-')[1].split('i')[0].split('').reverse();
                                            if (values.value.startsWith('-')) {
                                                // -c + di, -c - di, -di
                                                if (values.value.split('-').length > 2) {
                                                    // -c - di
                                                    var bb = values.value.split('-')[1].split('').reverse();
                                                    var dd = values.value.split('-')[2].split('i')[0].split('').reverse();
                                                    var denom = binaryRealAdd(binaryRealMultiply(bb, bb, base).split('').reverse(), binaryRealMultiply(dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base).split('').reverse(), base).split('').reverse();
                                                    var re = binaryRealDivide(binaryRealSubtract(binaryRealMultiply(cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base).split('').reverse(), binaryRealMultiply(aa, bb, base).split('').reverse(), base).split('').reverse(), denom, base);
                                                    var im = binaryRealDivide(binaryRealAdd(binaryRealMultiply(aa, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base).split('').reverse(), binaryRealMultiply(bb, cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, base).split('').reverse(), base).split('').reverse(), denom, base);
                                                    setValues({ value: values.value, memory: comParse(re, im, '/', base), repeat: true });
                                                } else if (values.value.includes('+')) {
                                                    // -c + di
                                                    var bb = values.value.split('+')[0].split('-')[1].split('').reverse();
                                                    var dd = values.value.split('+')[1].split('i')[0].split('').reverse();
                                                    var denom = binaryRealAdd(binaryRealMultiply(bb, bb, base).split('').reverse(), binaryRealMultiply(dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base).split('').reverse(), base).split('').reverse();
                                                    var re = binaryRealDivide(binaryRealAdd(binaryRealMultiply(aa, bb, base).split('').reverse(), binaryRealMultiply(cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base).split('').reverse(), base).split('').reverse(), denom, base);
                                                    var im = binaryRealDivide(binaryRealSubtract(binaryRealMultiply(bb, cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, base).split('').reverse(), binaryRealMultiply(aa, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base).split('').reverse(), base).split('').reverse(), denom, base);
                                                    setValues({ value: values.value, memory: comParse('-' + re, im, '/', base), repeat: true });
                                                } else {
                                                    // -di
                                                    var dd = values.value.split('-')[1].split('i')[0].split('').reverse();
                                                    var re = binaryRealDivide(cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base);
                                                    var im = binaryRealDivide(aa, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base);
                                                    setValues({ value: values.value, memory: comParse(re, im, '/', base), repeat: true });
                                                }
                                            } else if (values.value.includes('-')) {
                                                // c - di
                                                var bb = values.value.split('-')[0].split('').reverse();
                                                var dd = values.value.split('-')[1].split('i')[0].split('').reverse();
                                                var denom = binaryRealAdd(binaryRealMultiply(bb, bb, base).split('').reverse(), binaryRealMultiply(dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base).split('').reverse(), base).split('').reverse();
                                                var re = binaryRealDivide(binaryRealAdd(binaryRealMultiply(aa, bb, base).split('').reverse(), binaryRealMultiply(cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base).split('').reverse(), base).split('').reverse(), denom, base);
                                                var im = binaryRealDivide(binaryRealSubtract(binaryRealMultiply(aa, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base).split('').reverse(), binaryRealMultiply(bb, cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, base).split('').reverse(), base).split('').reverse(), denom, base);
                                                setValues({ value: values.value, memory: comParse(re, im, '/', base), repeat: true });
                                            } else if (values.value.includes('+')) {
                                                // c + di
                                                var bb = values.value.split('+')[0].split('').reverse();
                                                var dd = values.value.split('+')[1].split('i')[0].split('').reverse();
                                                var denom = binaryRealAdd(binaryRealMultiply(bb, bb, base).split('').reverse(), binaryRealMultiply(dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base).split('').reverse(), base).split('').reverse();
                                                var re = binaryRealDivide(binaryRealSubtract(binaryRealMultiply(aa, bb, base).split('').reverse(), binaryRealMultiply(cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base).split('').reverse(), base).split('').reverse(), denom, base);
                                                var im = binaryRealDivide(binaryRealAdd(binaryRealMultiply(aa, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base).split('').reverse(), binaryRealMultiply(bb, cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, base).split('').reverse(), base).split('').reverse(), denom, base);
                                                setValues({ value: values.value, memory: comParse(re, '-' + im, '/', base), repeat: true });
                                            } else {
                                                // di
                                                var dd = values.value.split('i')[0].split('').reverse();
                                                var re = binaryRealDivide(cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base);
                                                var im = binaryRealDivide(aa, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base);
                                                setValues({ value: values.value, memory: comParse('-' + re, '-' + im, '/', base), repeat: true });
                                            }
                                        } else if (values.memory.includes('+')) {
                                            // a + bi
                                            var aa = values.memory.split('+')[0].split('').reverse();
                                            var cc = values.memory.split('+')[1].split('i')[0].split('').reverse();
                                            if (values.value.startsWith('-')) {
                                                // -c + di, -c - di, -di
                                                if (values.value.split('-').length > 2) {
                                                    // -c - di
                                                    var bb = values.value.split('-')[1].split('').reverse();
                                                    var dd = values.value.split('-')[2].split('i')[0].split('').reverse();
                                                    var denom = binaryRealAdd(binaryRealMultiply(bb, bb, base).split('').reverse(), binaryRealMultiply(dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base).split('').reverse(), base).split('').reverse();
                                                    var re = binaryRealDivide(binaryRealAdd(binaryRealMultiply(aa, bb, base).split('').reverse(), binaryRealMultiply(cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base).split('').reverse(), base).split('').reverse(), denom, base);
                                                    var im = binaryRealDivide(binaryRealSubtract(binaryRealMultiply(aa, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base).split('').reverse(), binaryRealMultiply(bb, cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, base).split('').reverse(), base).split('').reverse(), denom, base);
                                                    setValues({ value: values.value, memory: comParse('-' + re, im, '/', base), repeat: true });
                                                } else if (values.value.includes('+')) {
                                                    // -c + di
                                                    var bb = values.value.split('+')[0].split('-')[1].split('').reverse();
                                                    var dd = values.value.split('+')[1].split('i')[0].split('').reverse();
                                                    var denom = binaryRealAdd(binaryRealMultiply(bb, bb, base).split('').reverse(), binaryRealMultiply(dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base).split('').reverse(), base).split('').reverse();
                                                    var re = binaryRealDivide(binaryRealSubtract(binaryRealMultiply(cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base).split('').reverse(), binaryRealMultiply(aa, bb, base).split('').reverse(), base).split('').reverse(), denom, base);
                                                    var im = binaryRealDivide(binaryRealAdd(binaryRealMultiply(aa, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base).split('').reverse(), binaryRealMultiply(bb, cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, base).split('').reverse(), base).split('').reverse(), denom, base);
                                                    setValues({ value: values.value, memory: comParse(re, '-' + im, '/', base), repeat: true });
                                                } else {
                                                    // -di
                                                    var dd = values.value.split('-')[1].split('i')[0].split('').reverse();
                                                    var re = binaryRealDivide(cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base);
                                                    var im = binaryRealDivide(aa, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base);
                                                    setValues({ value: values.value, memory: comParse('-' + re, im, '/', base), repeat: true });
                                                }
                                            } else if (values.value.includes('-')) {
                                                // c - di
                                                var bb = values.value.split('-')[0].split('').reverse();
                                                var dd = values.value.split('-')[1].split('i')[0].split('').reverse();
                                                var denom = binaryRealAdd(binaryRealMultiply(bb, bb, base).split('').reverse(), binaryRealMultiply(dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base).split('').reverse(), base).split('').reverse();
                                                var re = binaryRealDivide(binaryRealSubtract(binaryRealMultiply(aa, bb, base).split('').reverse(), binaryRealMultiply(cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base).split('').reverse(), base).split('').reverse(), denom, base);
                                                var im = binaryRealDivide(binaryRealAdd(binaryRealMultiply(aa, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base).split('').reverse(), binaryRealMultiply(bb, cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, base).split('').reverse(), base).split('').reverse(), denom, base);
                                                setValues({ value: values.value, memory: comParse(re, im, '/', base), repeat: true });
                                            } else if (values.value.includes('+')) {
                                                // c + di
                                                var bb = values.value.split('+')[0].split('').reverse();
                                                var dd = values.value.split('+')[1].split('i')[0].split('').reverse();
                                                var denom = binaryRealAdd(binaryRealMultiply(bb, bb, base).split('').reverse(), binaryRealMultiply(dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base).split('').reverse(), base).split('').reverse();
                                                var re = binaryRealDivide(binaryRealAdd(binaryRealMultiply(aa, bb, base).split('').reverse(), binaryRealMultiply(cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base).split('').reverse(), base).split('').reverse(), denom, base);
                                                var im = binaryRealDivide(binaryRealSubtract(binaryRealMultiply(bb, cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, base).split('').reverse(), binaryRealMultiply(aa, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base).split('').reverse(), base).split('').reverse(), denom, base);
                                                setValues({ value: values.value, memory: comParse(re, im, '/', base), repeat: true });
                                            } else {
                                                // di
                                                var dd = values.value.split('i')[0].split('').reverse();
                                                var re = binaryRealDivide(cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base);
                                                var im = binaryRealDivide(aa, dd.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : dd, base);
                                                setValues({ value: values.value, memory: comParse(re, '-' + im, '/', base), repeat: true });
                                            }
                                        } else {
                                            // bi
                                            var aa = values.memory.split('i')[0].split('').reverse();
                                            if (values.value.startsWith('-')) {
                                                // -c + di, -c - di, -di
                                                if (values.value.split('-').length > 2) {
                                                    // -c - di
                                                    var bb = values.value.split('-')[1].split('').reverse();
                                                    var cc = values.value.split('-')[2].split('i')[0].split('').reverse();
                                                    var denom = binaryRealAdd(binaryRealMultiply(bb, bb, base).split('').reverse(), binaryRealMultiply(cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, base).split('').reverse(), base).split('').reverse();
                                                    var re = binaryRealDivide(binaryRealMultiply(aa.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : aa, cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, base).split('').reverse(), denom, base);
                                                    var im = binaryRealDivide(binaryRealMultiply(aa.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : aa, bb, base).split('').reverse(), denom, base);
                                                    setValues({ value: values.value, memory: comParse('-' + re, '-' + im, '/', base), repeat: true });
                                                } else if (values.value.includes('+')) {
                                                    // -c + di
                                                    var bb = values.value.split('+')[0].split('').reverse();
                                                    var cc = values.value.split('+')[1].split('i')[0].split('').reverse();
                                                    var denom = binaryRealAdd(binaryRealMultiply(bb, bb, base).split('').reverse(), binaryRealMultiply(cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, base).split('').reverse(), base).split('').reverse();
                                                    var re = binaryRealDivide(binaryRealMultiply(aa.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : aa, cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, base).split('').reverse(), denom, base);
                                                    var im = binaryRealDivide(binaryRealMultiply(aa.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : aa, bb, base).split('').reverse(), denom, base);
                                                    setValues({ value: values.value, memory: comParse(re, '-' + im, '/', base), repeat: true });
                                                } else {
                                                    // -di
                                                    var bb = values.value.split('-')[1].split('i')[0].split('').reverse();
                                                    var re = binaryRealDivide(aa.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : aa, bb.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : bb, base);
                                                    setValues({ value: values.value, memory: comParse('-' + re, base == 1 ? '' : (base.values.length > 17 ? base.values[17] : '0'), '/', base), repeat: true });
                                                }
                                            } else if (values.value.includes('-')) {
                                                // c - di
                                                var bb = values.value.split('-')[0].split('').reverse();
                                                var cc = values.value.split('-')[1].split('i')[0].split('').reverse();
                                                var denom = binaryRealAdd(binaryRealMultiply(bb, bb, base).split('').reverse(), binaryRealMultiply(cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, base).split('').reverse(), base).split('').reverse();
                                                var re = binaryRealDivide(binaryRealMultiply(aa.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : aa, cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, base).split('').reverse(), denom, base);
                                                var im = binaryRealDivide(binaryRealMultiply(aa.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : aa, bb, base).split('').reverse(), denom, base);
                                                setValues({ value: values.value, memory: comParse('-' + re, im, '/', base), repeat: true });
                                            } else if (values.value.includes('+')) {
                                                // c + di
                                                var bb = values.value.split('+')[0].split('').reverse();
                                                var cc = values.value.split('+')[1].split('i')[0].split('').reverse();
                                                var denom = binaryRealAdd(binaryRealMultiply(bb, bb, base).split('').reverse(), binaryRealMultiply(cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, base).split('').reverse(), base).split('').reverse();
                                                var re = binaryRealDivide(binaryRealMultiply(aa.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : aa, cc.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : cc, base).split('').reverse(), denom, base);
                                                var im = binaryRealDivide(binaryRealMultiply(aa.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : aa, bb, base).split('').reverse(), denom, base);
                                                setValues({ value: values.value, memory: comParse(re, im, '/', base), repeat: true });
                                            } else {
                                                // di
                                                var bb = values.value.split('i')[0].split('').reverse();
                                                var re = binaryRealDivide(aa.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : aa, bb.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : bb, base);
                                                setValues({ value: values.value, memory: comParse(re, base == 1 ? '' : (base.values.length > 17 ? base.values[17] : '0'), '/', base), repeat: true });
                                            }
                                        }
                                    } else {
                                        // values.value is real
                                        if (values.memory.startsWith('-')) {
                                            // -a + bi, -a - bi, -bi
                                            if (values.memory.split('-').length > 2) {
                                                // -a - bi
                                                var aa = values.memory.split('-')[1].split('').reverse();
                                                var bb = values.memory.split('-')[2].split('i')[0].split('').reverse();
                                                if (values.value.startsWith('-')) {
                                                    // a / c + bi / c
                                                    var cc = values.value.split('-')[1].split('').reverse();
                                                    var re = binaryRealDivide(aa, cc, base);
                                                    var im = binaryRealDivide(bb.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : bb, cc, base);
                                                    setValues({ value: values.value, memory: comParse(re, im, '/', base), repeat: true });
                                                } else {
                                                    // -a / c - bi / c
                                                    var cc = values.value.split('').reverse();
                                                    var re = binaryRealDivide(aa, cc, base);
                                                    var im = binaryRealDivide(bb.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : bb, cc, base);
                                                    setValues({ value: values.value, memory: comParse('-' + re, '-' + im, '/', base), repeat: true });
                                                }
                                            } else if (values.memory.includes('+')) {
                                                // -a + bi
                                                var aa = values.memory.split('+')[0].split('-')[1].split('').reverse();
                                                var bb = values.memory.split('+')[1].split('i')[0].split('').reverse();
                                                if (values.value.startsWith('-')) {
                                                    // a / c - bi / c
                                                    var cc = values.value.split('-')[1].split('').reverse();
                                                    var re = binaryRealDivide(aa, cc, base);
                                                    var im = binaryRealDivide(bb.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : bb, cc, base);
                                                    setValues({ value: values.value, memory: comParse(re, '-' + im, '/', base), repeat: true });
                                                } else {
                                                    // -a / c + bi / c
                                                    var cc = values.value.split('').reverse();
                                                    var re = binaryRealDivide(aa, cc, base);
                                                    var im = binaryRealDivide(bb.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : bb, cc, base);
                                                    setValues({ value: values.value, memory: comParse('-' + re, im, '/', base), repeat: true });
                                                }
                                            } else {
                                                // -bi
                                                var aa = values.memory.split('-')[1].split('i')[0].split('').reverse();
                                                if (values.memory == (base.values.length > 17 ? base.values[17] : '0') + '/' || values.memory == '/') {
                                                    setValues({
                                                        value: values.value, memory: (base.num == 1 ? '/' : ((base.values.length > 17 ? base.values[17] : '0') + '/')), repeat: true });
                                                } else {
                                                    if (values.memory.startsWith('-')) {
                                                        // bi / c
                                                        setValues({ value: values.value, memory: comParse(base == 1 ? '' : (base.values.length > 17 ? base.values[17] : '0'), binaryRealDivide(aa.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : aa, values.value.split('-')[1].split('').reverse(), base), '/', base), repeat: true });
                                                    } else {
                                                        // -bi / c
                                                        setValues({ value: values.value, memory: comParse(base == 1 ? '' : (base.values.length > 17 ? base.values[17] : '0'), '-' + binaryRealDivide(aa.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : aa, values.value.split('').reverse(), base), '/', base), repeat: true });
                                                    }
                                                }
                                            }
                                        } else if (values.memory.includes('-')) {
                                            // a - bi
                                            var aa = values.memory.split('-')[0].split('').reverse();
                                            var bb = values.memory.split('-')[1].split('i')[0].split('').reverse();
                                            if (values.value.startsWith('-')) {
                                                // -a / c + bi / c
                                                var cc = values.value.split('-')[1].split('').reverse();
                                                var re = binaryRealDivide(aa, cc, base);
                                                var im = binaryRealDivide(bb.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : bb, cc, base);
                                                setValues({ value: values.value, memory: comParse('-' + re, im, '/', base), repeat: true });
                                            } else {
                                                // a / c - bi / c
                                                var cc = values.value.split('').reverse();
                                                var re = binaryRealDivide(aa, cc, base);
                                                var im = binaryRealDivide(bb.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : bb, cc, base);
                                                setValues({ value: values.value, memory: comParse(re, '-' + im, '/', base), repeat: true });
                                            }
                                        } else if (values.memory.includes('+')) {
                                            // a + bi
                                            var aa = values.memory.split('+')[0].split('').reverse();
                                            var bb = values.memory.split('+')[1].split('i')[0].split('').reverse();
                                            if (values.value.startsWith('-')) {
                                                // -a / c - bi / c
                                                var cc = values.value.split('-')[1].split('').reverse();
                                                var re = binaryRealDivide(aa, cc, base);
                                                var im = binaryRealDivide(bb.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : bb, cc, base);
                                                setValues({ value: values.value, memory: comParse('-' + re, '-' + im, '/', base), repeat: true });
                                            } else {
                                                // a / c + bi / c
                                                var cc = values.value.split('').reverse();
                                                var re = binaryRealDivide(aa, cc, base);
                                                var im = binaryRealDivide(bb.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : bb, cc, base);
                                                setValues({ value: values.value, memory: comParse(re, im, '/', base), repeat: true });
                                            }
                                        } else {
                                            // bi
                                            var aa = values.memory.split('i')[0].split('').reverse();
                                            if (values.memory == ((base.values.length > 17 ? base.values[17] : '0') + '/') || values.memory == '/') {
                                                setValues({
                                                    value: values.value, memory: (base.num == 1 ? '/' : ((base.values.length > 17 ? base.values[17] : '0') + '/')), repeat: true });
                                            } else {
                                                if (values.memory.startsWith('-')) {
                                                    // -bi / c
                                                    setValues({ value: values.value, memory: comParse(base == 1 ? '' : (base.values.length > 17 ? base.values[17] : '0'), '-' + binaryRealDivide(aa.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : aa, values.value.split('-')[1].split('').reverse(), base), '/', base), repeat: true });
                                                } else {
                                                    // bi / c
                                                    setValues({ value: values.value, memory: comParse(base == 1 ? '' : (base.values.length > 17 ? base.values[17] : '0'), binaryRealDivide(aa.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : aa, values.value.split('').reverse(), base), '/', base), repeat: true });
                                                }
                                            }
                                        }
                                    }
                                } else {
                                    if (values.value.includes('i')) {
                                        if (values.value.startsWith('-')) {
                                            // -c + di, -c - di, -di
                                            if (values.value.split('-').length > 2) {
                                                // -c - di
                                                var aa = values.value.split('-')[1].split('').reverse();
                                                var bb = values.value.split('-')[2].split('i')[0].split('').reverse();
                                                var denom = binaryRealAdd(binaryRealMultiply(aa, aa, base).split('').reverse(), binaryRealMultiply(bb.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : bb, bb.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : bb, base).split('').reverse(), base).split('').reverse();
                                                if (values.memory.startsWith('-')) {
                                                    // (ac - adi) / denom
                                                    var cc = values.memory.split('/')[0].split('-')[1].split('').reverse();
                                                    var re = binaryRealDivide(binaryRealMultiply(aa, cc, base).split('').reverse(), denom, base);
                                                    var im = binaryRealDivide(binaryRealMultiply(bb.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : bb, cc, base).split('').reverse(), denom, base);
                                                    setValues({ value: values.value, memory: comParse(re, '-' + im, '/', base), repeat: true });
                                                } else {
                                                    // (-ac + adi) / denom
                                                    var cc = values.memory.split('/')[0].split('').reverse();
                                                    var re = binaryRealDivide(binaryRealMultiply(aa, cc, base).split('').reverse(), denom, base);
                                                    var im = binaryRealDivide(binaryRealMultiply(bb.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : bb, cc, base).split('').reverse(), denom, base);
                                                    setValues({ value: values.value, memory: comParse('-' + re, im, '/', base), repeat: true });
                                                }
                                            } else if (values.value.split('-')[1].includes('+')) {
                                                // -c + di
                                                var aa = values.value.split('+')[0].split('-')[1].split('').reverse();
                                                var bb = values.value.split('+')[1].split('i')[0].split('').reverse();
                                                var denom = binaryRealAdd(binaryRealMultiply(aa, aa, base).split('').reverse(), binaryRealMultiply(bb.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : bb, bb.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : bb, base).split('').reverse(), base).split('').reverse();
                                                if (values.memory.startsWith('-')) {
                                                    // (ac + adi) / denom
                                                    var cc = values.memory.split('/')[0].split('-')[1].split('').reverse();
                                                    var re = binaryRealDivide(binaryRealMultiply(aa, cc, base).split('').reverse(), denom, base);
                                                    var im = binaryRealDivide(binaryRealMultiply(bb.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : bb, cc, base).split('').reverse(), denom, base);
                                                    setValues({ value: values.value, memory: comParse(re, im, '/', base), repeat: true });
                                                } else {
                                                    // (-ac - adi) / denom
                                                    var cc = values.memory.split('/')[0].split('').reverse();
                                                    var re = binaryRealDivide(binaryRealMultiply(aa, cc, base).split('').reverse(), denom, base);
                                                    var im = binaryRealDivide(binaryRealMultiply(bb.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : bb, cc, base).split('').reverse(), denom, base);
                                                    setValues({ value: values.value, memory: comParse('-' + re, '-' + im, '/', base), repeat: true });
                                                }
                                            } else {
                                                // -di
                                                var aa = values.value.split('-')[1].split('i')[0].split('').reverse();
                                                if (values.memory == ((base.values.length > 17 ? base.values[17] : '0') + '/') || values.memory == '/') {
                                                    setValues({
                                                        value: values.value, memory: (base.num == 1 ? '/' : ((base.values.length > 17 ? base.values[17] : '0') + '/')), repeat: true });
                                                } else {
                                                    if (values.memory.startsWith('-')) {
                                                        // -ai / d
                                                        setValues({ value: values.value, memory: comParse(base == 1 ? '' : (base.values.length > 17 ? base.values[17] : '0'), '-' + binaryRealDivide(values.memory.split('/')[0].split('-')[1].split('').reverse(), aa.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : aa, base), '/', base), repeat: true });
                                                    } else {
                                                        // ai / d
                                                        setValues({ value: values.value, memory: comParse(base == 1 ? '' : (base.values.length > 17 ? base.values[17] : '0'), binaryRealDivide(values.memory.split('/')[0].split('').reverse(), aa.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : aa, base), '/', base), repeat: true });
                                                    }
                                                }
                                            }
                                        } else if (values.value.includes('-')) {
                                            // c - di
                                            var aa = values.value.split('-')[0].split('').reverse();
                                            var bb = values.value.split('-')[1].split('i')[0].split('').reverse();
                                            var denom = binaryRealAdd(binaryRealMultiply(aa, aa, base).split('').reverse(), binaryRealMultiply(bb.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : bb, bb.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : bb, base).split('').reverse(), base).split('').reverse();
                                            if (values.memory.startsWith('-')) {
                                                // (-ac - adi) / denom
                                                var cc = values.memory.split('/')[0].split('-')[1].split('').reverse();
                                                var re = binaryRealDivide(binaryRealMultiply(aa, cc, base).split('').reverse(), denom, base);
                                                var im = binaryRealDivide(binaryRealMultiply(bb.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : bb, cc, base).split('').reverse(), denom, base);
                                                setValues({ value: values.value, memory: comParse('-' + re, '-' + im, '/', base), repeat: true });
                                            } else {
                                                // (ac + adi) / denom
                                                var cc = values.memory.split('/')[0].split('').reverse();
                                                var re = binaryRealDivide(binaryRealMultiply(aa, cc, base).split('').reverse(), denom, base);
                                                var im = binaryRealDivide(binaryRealMultiply(bb.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : bb, cc, base).split('').reverse(), denom, base);
                                                setValues({ value: values.value, memory: comParse(re, im, '/', base), repeat: true });
                                            }
                                        } else if (values.value.includes('+')) {
                                            // c + di
                                            var aa = values.value.split('+')[0].split('').reverse();
                                            var bb = values.value.split('+')[1].split('i')[0].split('').reverse();
                                            var denom = binaryRealAdd(binaryRealMultiply(aa, aa, base).split('').reverse(), binaryRealMultiply(bb.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : bb, bb.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : bb, base).split('').reverse(), base).split('').reverse();
                                            if (values.memory.startsWith('-')) {
                                                // (-ac + adi) / denom
                                                var cc = values.memory.split('/')[0].split('-')[1].split('').reverse();
                                                var re = binaryRealDivide(binaryRealMultiply(aa, cc, base).split('').reverse(), denom, base);
                                                var im = binaryRealDivide(binaryRealMultiply(bb.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : bb, cc, base).split('').reverse(), denom, base);
                                                setValues({ value: values.value, memory: comParse('-' + re, im, '/', base), repeat: true });
                                            } else {
                                                // (ac - adi) / denom
                                                var cc = values.memory.split('/')[0].split('').reverse();
                                                var re = binaryRealDivide(binaryRealMultiply(aa, cc, base).split('').reverse(), denom, base);
                                                var im = binaryRealDivide(binaryRealMultiply(bb.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : bb, cc, base).split('').reverse(), denom, base);
                                                setValues({ value: values.value, memory: comParse(re, '-' + im, '/', base), repeat: true });
                                            }
                                        } else {
                                            // di
                                            var aa = values.value.split('i')[0].split('').reverse();
                                            if (values.memory == ((base.values.length > 17 ? base.values[17] : '0') + '/') || values.memory == '/') {
                                                setValues({
                                                    value: values.value, memory: (base.num == 1 ? '/' : ((base.values.length > 17 ? base.values[17] : '0') + '/')), repeat: true });
                                            } else {
                                                if (values.memory.startsWith('-')) {
                                                    // ai / d
                                                    setValues({ value: values.value, memory: comParse(base == 1 ? '' : (base.values.length > 17 ? base.values[17] : '0'), binaryRealDivide(values.memory.split('/')[0].split('-')[1].split('').reverse(), aa.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : aa, base), '/', base), repeat: true });
                                                } else {
                                                    // -ai / d
                                                    setValues({ value: values.value, memory: comParse(base == 1 ? '' : (base.values.length > 17 ? base.values[17] : '0'), '-' + binaryRealDivide(values.memory.split('/')[0].split('').reverse(), aa.length == 0 ? (base.num == 1 ? (base.values.length > 14 ? [base.values[14]] : ['|']) : (base.values.length > 18 ? [base.values[18]] : (base.values.length == 18 ? (base.values[17] == '1' ? ['0'] : ['1']) : ['1']))) : aa, base), '/', base), repeat: true });
                                                }
                                            }
                                        }
                                    } else {
                                        if (values.memory.includes('-')) {
                                            var aa = values.memory.split('/')[0].split('-')[1].split('').reverse();
                                            if (values.value.includes('-')) {
                                                // negative / negative
                                                setValues({ value: values.value, memory: (binaryRealDivide(aa, values.value.split('-')[1].split('').reverse(), base) + '/'), repeat: true });
                                            } else {
                                                // negative / positive
                                                setValues({ value: values.value, memory: ('-' + binaryRealDivide(aa, values.value.split('').reverse(), base) + '/'), repeat: true });
                                            }
                                        } else {
                                            var aa = values.memory.split('/')[0].split('').reverse();
                                            if (values.value.includes('-')) {
                                                // positive / negative
                                                setValues({ value: values.value, memory: ('-' + binaryRealDivide(aa, values.value.split('-')[1].split('').reverse(), base) + '/'), repeat: true });
                                            } else {
                                                // positive / positive
                                                setValues({ value: values.value, memory: (binaryRealDivide(aa, values.value.split('').reverse(), base) + '/'), repeat: true });
                                            }
                                        }
                                    }
                                }
                                break;
                            case '^':
                                if (values.memory.split('').reverse()[1] == '^') {

                                } else {

                                }
                                break;
                            case '√':
                                break;
                            case 'g':
                                break;
                            default:
                                setValues({ value: values.memory, memory: values.memory, repeat: true });
                                break;
                        }
                    }
                }
                break;
            case '±':
                setValues({
                    value: (((base.values.length > 17 ? values.value == base.values[17] : values.value == '0') || values.value == '') ?
                        values.value :
                        (values.value.includes('i') ?
                            (values.value.startsWith('-') ?
                                (values.value.split('-')[1].includes('+') ?
                                    (values.value.split('-')[1].split('+')[0] + '-' + values.value.split('+')[1]) :
                                    (values.value.split('-').length > 2 ?
                                        (values.value.split('-')[1] + '+' + values.value.split('-')[2]) :
                                        values.value.split('-')[1])) :
                                (values.value.includes('+') ?
                                    ('-' + values.value.split('+')[0] + '-' + values.value.split('+')[1]) :
                                    (values.value.includes('-') ?
                                        ('-' + values.value.split('-')[0] + '+' + values.value.split('-')[1]) :
                                        ('-' + values.value)))) :
                            (values.value.includes('-') ?
                                values.value.split('-')[1] :
                                ('-' + values.value)))),
                    memory: values.memory,
                    repeat: values.repeat
                });
                break;
            case 'AC':
                setValues({ value: (base.num == 1 ? '' : (base.values.length > 17 ? base.values[17] : '0')), memory: '', repeat: false });
                break;
            case '>':
                if (base.num < valsb.length || base.num < (base.values.length - 17)) {
                    baseIncrement();
                    var mem = bifurcate(values.memory);
                    setValues({
                        value: convSynt(values.value.length > 0 ? values.value :
                            (base.num == 1 ? ((base.values.length < 15 || (base.values.length == 15 && base.values[14] == '|')) ? '0' : base.values[14]) :
                                (base.values.length > 17 ? base.values[17] : '0')), (base.num == 1 ? (base.values.length < 16 ? '11' :
                            (base.values[16] + base.values[16])) : (base.values.length > 18 ? (base.values[18] + base.values[18]) :
                                (base.values.length == 18 ? (base.values[17] == '1' ? '00' : '11') : '11'))), base, ''),
                        memory: convSynt(mem[0].length > 0 ? mem[0] :
                            (base.num == 1 ? ((base.values.length < 15 || (base.values.length == 15 && base.values[14] == '|')) ? '0' : base.values[14]) :
                                (base.values.length > 17 ? base.values[17] : '0')), (base.num == 1 ? (base.values.length < 16 ? '11' :
                            (base.values[16] + base.values[16])) : (base.values.length > 18 ? (base.values[18] + base.values[18]) :
                                (base.values.length == 18 ? (base.values[17] == '1' ? '00' : '11') : '11'))), base, mem[1]),
                        repeat: values.repeat
                    });
                }
                break;
            case '<':
                if (base.num > 1) {
                    baseDecrement();
                    var mem = bifurcate(values.memory);
                    setValues({
                        value: convSynt(values.value.length > 0 ? values.value : (base.values.length > 17 ? base.values[17] : '0'),
                            (base.values.length > (16 + base.num) ? base.values[base.num - 1] : (base.num < 13 ? valsa[base.num - 1] : valsb[base.num - 1])),
                            base, ''),
                        memory: convSynt(mem[0].length > 0 ? mem[0] : (base.values.length > 17 ? base.values[17] : '0'),
                            (base.values.length > (16 + base.num) ? base.values[base.num - 1] : (base.num < 13 ? valsa[base.num - 1] : valsb[base.num - 1])),
                            base, mem[1]),
                        repeat: values.repeat
                    });
                }
                break;
            default:
                break;
        }
    }

    return <button className="eqs" onClick={handleClick}>{relation}</button>;
};

export function CalcSidebar(props) {
    const { base, setBase } = props;

    const setValues = (nums) => {
        const nValues = nums.split('');
        if (base.num == 1) {
            const bValues = base.values.slice(0, 14);
            setBase({ num: base.num, values: bValues.concat(nValues) });
        } else {
            const bValues = base.values.slice(0, 17);
            setBase({ num: base.num, values: bValues.concat(nValues) });
        }
    }

    return (<div>
        <div>Digits:</div>
        <input className="base-text"
        value={base.num == 1 ? base.values.slice(14).join('') : base.values.slice(17).join('')}
            onChange={(event) => setValues(event.target.value)} />
    </div>);
}

export default function Calc(props) {
    const { base, setBase, values, setValues } = props;

    const num = base.num;

    const baseIncrement = () => {
        const bValues = base.values.slice();
        const length = bValues.length;
        if (num == 1) {
            if (length == 15) {
                if (bValues[14] == '|') {
                    bValues.pop();
                    bValues.push('.', '0', '1');
                } else {
                    if (bValues[14] == '1') {
                        bValues.push('0');
                    } else {
                        bValues.push('1');
                    }
                    bValues.splice(14, 0, '.');
                }
            } else if (length == 14) {
                bValues.push('.', '0', '1');
            } else {
                bValues.splice(14, 0, '.');
            }
            bValues.splice(13, 0, 'e', 'π');
        } else if (num < 12) {
            if (length == (17 + num)) {
                bValues.push(valsa[num]);
            } else if (length < (17 + num)) {
                valsa.slice(0, num + 1).forEach(value => {
                    if (!bValues.includes(value)) {
                        bValues.push(value);
                    }
                });
            }
        } else if (num == 12) {
            if (length == 29) {
                if (bValues[28] == 'Ɛ') {
                    bValues.pop();
                    if (bValues[27] == 'X') {
                        bValues.pop();
                        bValues.push('A', 'B', 'C');
                    } else {
                        bValues.push('B', 'C');
                    }
                } else {
                    bValues.push('C');
                }
            } else if (length < 29) {
                valsb.slice(0, num + 1).forEach(value => {
                    if (!bValues.includes(value)) {
                        bValues.push(value);
                    }
                });
            }
        } else if (num < valsb.length) {
            if (length == (17 + num)) {
                bValues.push(valsb[num]);
            } else if (length < (17 + num)) {
                valsb.slice(0, num + 1).forEach(value => {
                    if (!bValues.includes(value)) {
                        bValues.push(value);
                    }
                });
            }
        }
        setBase({ num: num + 1, values: bValues });
    }

    const baseDecrement = () => {
        const bValues = base.values.slice();
        const length = bValues.length;
        if (num == 2) {
            if (length == 19 && bValues[18] == '1' && bValues[17] == '0') {
                bValues.splice(16, 3, '|');
                bValues.splice(13, 2);
            } else if (length == 17) {
                bValues.splice(16, 1, '|');
                bValues.splice(13, 2);
            } else {
                bValues.splice(16, 1);
                bValues.splice(13, 2);
            }
        } else if (num < 13) {
            if (length == 17 + num) {
                if (bValues.slice(17).toString() == valsa.slice(0, length - 17).toString()) {
                    bValues.pop();
                }
            } else if (length < 17 + num) {
                valsa.slice(0, num).forEach(value => {
                    if (!bValues.includes(value)) {
                        bValues.push(value);
                    }
                });
            }
        } else if (num == 13) {
            if (length == 30) {
                if (bValues.slice(17).toString() == valsb.slice(0, 13).toString()) {
                    bValues.splice(27, 3, 'X', 'Ɛ');
                }
            } else if (length < 30) {
                valsa.slice(0, num).forEach(value => {
                    if (!bValues.includes(value)) {
                        bValues.push(value);
                    }
                });
            }
        } else {
            if (length == 17 + num) {
                if (bValues.slice(17).toString() == valsb.slice(0, length - 17).toString()) {
                    bValues.pop();
                }
            } else if (length < 17 + num) {
                valsb.slice(0, num).forEach(value => {
                    if (!bValues.includes(value)) {
                        bValues.push(value);
                    }
                });
            }
        }
        setBase({ num: num - 1, values: bValues });
    }

    return (
        <div className="app5">
            <div>{"Base " + num}</div>
            <div className="ans">{values.repeat ? truncate(values.memory) : values.value}</div>
            <div className="board5" style={{ gridTemplateColumns: 'repeat( ' + Math.floor(Math.sqrt((num == 1 ? 15 : 17 + num))).toString() + ', 1fr)' }}>
                {base.values.map((val, index) => {
                    if (index < (num == 1 ? 15 : (17 + num))) {
                        switch (val) {
                            case '=':
                            case '±':
                            case 'AC':
                            case '>':
                            case '<':
                                return (<Eq relation={val} base={base} values={values} setValues={setValues} baseIncrement={baseIncrement} baseDecrement={baseDecrement} />);
                            case '+':
                            case '-':
                            case '*':
                            case '/':
                            case '^':
                            case '√':
                            case 'log':
                            case '^^':
                                return (<Op operation={val} values={values} setValues={setValues} />);
                            default:
                                return (<Cell value={val} values={values} setValues={setValues} base={base} />);
                        }
                    }
                })}
            </div>
        </div>
    );
}