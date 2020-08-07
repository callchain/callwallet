import store from '../store/Index';
var alib = require('async');

/**
 * or null
 * @param {*} tx 
 * @param {*} address 
 */
function processTx(tx, address) {
    return null;
}

export default function(server) {
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

    return api;
}

