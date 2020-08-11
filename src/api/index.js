import store from '../store/Index';
import Parser from './transaction-parser';
import vue from '../main';

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
        store.commit('updateHeight', ledger.ledgerVersion);
    });
    
    api.on('transactions', async function(tx) {
        var hash = tx.transaction.hash;
        var address = store.state.address;
        try {
            var info = await api.getTransaction(hash);
            var parse = Parser[info.type] ? Parser[info.type] : Parser['default'];
            var desc = parse(info, address);
            if (info.outcome.result !== 'tesSUCCESS')
            {
                vue.$toast.error(desc);
                return;
            }
            vue.$toast.success(desc);

            console.dir(info);
            // update balance
            
            // update trustline
            if (info.type === 'trustline')
            {

            }

            // update issue list

        } catch (e) {
            vue.$toast.error(e.message);
            console.error(e);
        }
    });

    return api;
}

