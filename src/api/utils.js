function isValidAddr(addr) {
    return /^c[1-9A-HJ-NP-Za-km-z]{25,34}$/.test(addr);
}

const cutils = call.CallAPI._PRIVATE;


function isValidSec(seed) {
    return cutils.schemaValidator.isValidSecret(seed);
}

export default {
    isValidAddr, isValidSec
}
