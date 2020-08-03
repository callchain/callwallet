const server = 'wss://s1.callchain.live:5020';
var api = new call.CallAPI({
    server: server
});

api.on('error', function(code, msg) {
    console.log('call connection error, code=' + code + ', msg=' + msg);
});

api.on('connected', function() {
    console.log('connect it');
});

api.on('disconnected', function() {
    console.log('server disconnect');
});

import store from '../store/Index';
var alib = require('async');

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
    console.log('ledger msg, ledger=' + ledger.ledgerVersion);
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

api.connect().then(async function() {
    console.log('api connected');
    console.dir(api);
    var info = await api.getServerInfo();
    console.dir(info);
}).catch(function(e) {
    console.log('fail to connect api: ');
    console.dir(e);
});

export default api;
