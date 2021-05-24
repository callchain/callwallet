import sjcl from 'sjcl';
import btoa from 'btoa';
import atob from 'atob';

let Blob = {};
const PREFIX = 'callchain-';

Blob.encrypt = function(username, password, data) {
    let username_ = ("" + username).toLowerCase().trim();
    let password_ = ("" + password).trim();

    let hash = sjcl.codec.hex.fromBits(sjcl.hash.sha256.hash(username_));
    if (localStorage.getItem(PREFIX + hash)) {
        return "Name exists";
    }
    let key = "" + username_.length + '|' + username_ + password_;
    let b64 = btoa(sjcl.encrypt(key, JSON.stringify(data), {iter: 1000, adata: JSON.stringify(data.meta), ks: 256}));

    localStorage.setItem(PREFIX + hash, b64);
    return "OK";
};

Blob.decrypt = function(username, password) {
    let username_ = ("" + username).toLowerCase().trim();
    let password_ = ("" + password).trim();

    let hash = sjcl.codec.hex.fromBits(sjcl.hash.sha256.hash(username_));
    let b64 = localStorage.getItem(PREFIX + hash);
    if (!b64) {
        return "Account not exist";
    }

    let key = "" + username_.length + '|' + username_ + password_;

    try {
        let ciphertext = atob(b64);
        let blob = JSON.parse(sjcl.decrypt(key, ciphertext));
        return blob;
    } catch (e) {
        console.error(e);
        return "Invalid password";
    }
};

export default Blob;
