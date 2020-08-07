import store from '../store/Index';
var alib = require('async');

var server = store.state.server;
const url = (server.ssl ? 'wss://' : 'ws://') + server.host + ':' + server.port;
var api = new call.CallAPI({
    server: url
});

api.on('error', function(code, msg) {
    console.log('call connection error, code=' + code + ', msg=' + msg);
});

api.on('connected', function() {
    store.commit('online');
    console.log('connect it');
});

api.on('disconnected', function() {
    store.commit('offline');
    console.log('server disconnect');
});

/**
 * {
 *   success: true : false,
 *   desc: '',
 *   balances: [{currency, issuer, +value},{currency, issuer, -value}],
 *   offers: [{seq: 0, taker_pays: +-, taker_gets: ++, sell: true:false}],
 *   issues: [{currency, amount, add...}],
 *   trustlines: [{currency, +-limit}]
 * }
 * or null
 * @param {*} tx 
 * @param {*} address 
 */
function processTx(tx, address) {

    return null;
}

api.on('ledger', async function(ledger) {
    // update block number
    var blocknumber = ledger.ledgerVersion;
    store.commit('updateHeight', ledger.ledgerVersion);
    var ldg = await api.getLedger({ledgerVersion: blocknumber, includeTransactions: true});
    if (!ldg.transactionHashes ) return;

    var address = store.state.address;
    alib.each(ldg.transactionHashes, async function(hash, cb) {
        var tx = await api.getTransaction(hash);
        if (!tx) return cb();

        var result = processTx(tx, address);
        if (!result) return cb(); // no related tx

        cb();
    }, function(err) {
        if (err) console.error(err);
    });
});

api.on('transactions', function(tx) {
    console.dir(tx);
});

export default api;
