import BN from 'bignumber.js';

function isValidAddr(addr) {
    return /^c[1-9A-HJ-NP-Za-km-z]{25,34}$/.test(addr);
}

const cutils = call.CallAPI._PRIVATE;

function isValidSec(seed) {
    return cutils.schemaValidator.isValidSecret(seed);
}

function isValidDomain(domain) {
    return /^(?:(?:(?:[a-zA-z\-]+)\:\/{1,3})?(?:[a-zA-Z0-9])(?:[a-zA-Z0-9\-\.]){1,61}(?:\.[a-zA-Z]{2,})+|\[(?:(?:(?:[a-fA-F0-9]){1,4})(?::(?:[a-fA-F0-9]){1,4}){7}|::1|::)\]|(?:(?:[0-9]{1,3})(?:\.[0-9]{1,3}){3}))(?:\:[0-9]{1,5})?$/.test(domain);
}

function isValidPort(port) {
    return port && (parseInt(port) + '') === (port + '')
        && Number(port) > 0 && Number(port) < 65535;
}

function isValidCur(cur) {
    return /^[1-9A-Z]{3,6}$/.test(cur);
}

function isAffected(obj, addr) {
    for (let prop in obj) {
        // check key
        if (prop === addr) return true;

        // check value
        let value = obj[prop];
        if (typeof value === 'object')
        {
            if (isAffected(value, addr)) return true;
        }
        else
        {
            if (value === addr) return true;
        }
    }
    return false;
}

function getPair(item) {
    let p = item.quantity.currency;
    if (item.quantity.counterparty) {
        p += '@' + item.quantity.counterparty;
    }
    p += '/';
    p += item.totalPrice.currency;
    if (item.totalPrice.counterparty) {
        p += '@' + item.totalPrice.counterparty;
    }
    return p;
}

function toFixed(num) {
    return num.toFixed(6).replace(/[.]?0+$/, '');
}

/**
 * return price
 * 
 * @param {*} item 
 * @param {*} type 
 * @returns 
 */
function getPrice(item, type) {
    return new BN(item.totalPrice.value).div(item.quantity.value);
}

function getAmount(item) {
    return new BN(item.quantity.value);
}

export default {
    isValidAddr, isValidSec, isValidDomain, isValidPort, isValidCur, isAffected,
    getPair, getPrice, getAmount,toFixed
}
