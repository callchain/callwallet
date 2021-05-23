import store from '../store/Index';
import Parser from './transaction-parser';
import vue from '../main';
import utils from './utils'

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

    api.on('ledger', function(ledger) {
        // update block number
        store.commit('updateLedger', ledger);
    });
    
    api.on('transactions', async function(tx) {
        var hash = tx.transaction.hash;
        var address = store.state.address;
        var cp = store.state.current_pair;
        try {
            var info = await api.getTransaction(hash);

            // 1. update balance
            var balanceChanges = info.outcome.balanceChanges[address];
            if (balanceChanges)
            {
                for (var i = 0; i < balanceChanges.length; ++i)
                {
                    var item = balanceChanges[i];
                    var key = item.counterparty ? item.currency + '@' + item.counterparty : item.currency;
                    store.commit('updateBalance', {key: key, change: item});
                }
            }

            // 2. update orderbook and orders
            var obs = info.outcome.orderbookChanges;
            for (var addr in obs) {
                var changes = obs[addr];
                for (var i = 0; i < changes.length; ++i) {
                    var item = changes[i];
                    var p = utils.getPair(item);
                    if (p === cp) store.commit('updateOrderbook', item);
                    if (addr === address) store.commit('updateOrder', item);
                }
            }

            // 3. update effect account data
            if (utils.isAffected(info, address))
            {
                // 3.1. notify success
                var parse = Parser[info.type] ? Parser[info.type] : Parser['default'];
                var desc = parse(info, address);
                if (info.outcome.result !== 'tesSUCCESS')
                {
                    vue.$toast.error('Failed: ' + desc);
                    return;
                }
                vue.$toast.success(desc);

                // 3.2. update transaction list
                store.commit('newTransaction', info);

                // 3.3 update trustline
                if (info.type === 'trustline')
                {
                    var cur = info.specification.currency + '@' + info.specification.counterparty;
                    store.commit('updateTrustline', {key: cur, change: info.specification});
                }
            }
        } catch (e) {
            vue.$toast.error(e.message);
            console.error(e);
        }
    });

    return api;
}

