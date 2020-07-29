import sjcl from 'sjcl';
import btoa from 'btoa';
import atob from 'atob';

var Blob = {};
const PREFIX = 'callchain-';

Blob.encrypt = function(username, password, data) {

    var username_ = ("" + username).toLowerCase().trim();
    var password_ = ("" + password).trim();

    var hash = sjcl.codec.hex.fromBits(sjcl.hash.sha256.hash(username_));
    if (localStorage.getItem(PREFIX + hash)) {
        return "Name exists";
    }
    var key = "" + username_.length + '|' + username_ + password_;
    var b64 = btoa(sjcl.encrypt(key, JSON.stringify(data), {iter: 1000, adata: JSON.stringify(data.meta), ks: 256}));

    localStorage.setItem(PREFIX + hash, b64);
    return "OK";
};

Blob.decrypt = function(username, password) {

    var username_ = ("" + username).toLowerCase().trim();
    var password_ = ("" + password).trim();

    var hash = sjcl.codec.hex.fromBits(sjcl.hash.sha256.hash(username_));
    var b64 = localStorage.getItem(PREFIX + hash);
    if (!b64) {
        return "Account not exist";
    }

    var key = "" + username_.length + '|' + username_ + password_;

    try {
        var ciphertext = atob(b64);
        var blob = JSON.parse(sjcl.decrypt(key, ciphertext));
        return blob;
    } catch (e) {
        console.error(e);
        return "Invalid password";
    }
};

export default Blob;
