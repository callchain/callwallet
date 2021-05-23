import BN from "bignumber.js";
const ONE = new BN(1);

function humanAmount(tx, amount) {
    if (!amount) {
        return ', but failed with result: ' + tx.outcome.result;
    }
    let val = new BN(amount.value);
    if (amount.currency === 'CALL')
        return val.toFormat() + ' CALL';
    else
        return val.toFormat() + ' ' + amount.currency;
}

function processPayment(tx, address) {
    let outcome = tx.outcome;
    if (tx.address === address)
    {
        let result = 'You sent ' + tx.specification.destination.address
            + ' ' + humanAmount(tx, outcome.deliveredAmount);
        return result;
    }
    else
    {
        let result = tx.address + ' sent you ' + humanAmount(tx, outcome.deliveredAmount);
        return result;
    }
}

function pastAction(act) {
    if (act === 'sell') return 'sold';
    else return 'bought';
}

function processOrder(tx, address) {
    let changes = tx.outcome.orderbookChanges;
    let spec = tx.specification;

    if (tx.address === address)
    {
        let result = "You created an offer to " + spec.direction + ' '
            + humanAmount(tx, spec.quantity) + ' for ' + humanAmount(tx, spec.totalPrice);
        let filled = 0;
        for (let key in changes) {
            let items = changes[key];
            for (let i = 0; i < items.length; ++i)
            {
                let item = items[i];
                if (item.type === 'filled' || item.type === 'partially-filled')
                    filled += Number(item.quantity.value);
            }
        }

        if (filled !== 0)
        {
            if (filled < Number(spec.quantity))
            {
                result += ', partially filled ' + filled + ' ' + spec.quantity.currency;
            }
            else
            {
                result += ', total filled'
            }
        }
        return result;
    }
    else
    {
        let items = changes[address];
        if (!items) return 'Passive affected order transaction';
        let result = '';
        for (let i = 0; i < items.length; ++i) {
            if (i !== 0) result += ';';
            let item = items[i];
            result += 'You passive ' + (item.direction === 'sell' ? 'sold' : 'bought') + ' ' + humanAmount(tx, item.quantity) + ' at price ' 
                 + ONE.div(item.makerExchangeRate).toFormat();
        }
        return result;
    }
}

function processOrderCancellation(tx, address) {
    let changes = tx.outcome.orderbookChanges[address];
    if (!changes) {
        return 'Passive affected order cancellation transaction';
    }
    let change = changes[0];
    let result = 'You cancelled to ' + change.direction + ' ' + humanAmount(tx, change.quantity) + ' for ' + humanAmount(tx, change.totalPrice);
    return result;
}

function processTrustline(tx, address) {
    let spec = tx.specification;
    if (tx.address === address)
    {
        let result = 'You are trusting ' + spec.counterparty + ' for ' + spec.limit + ' ' + spec.currency;
        return result;
    }

    if (spec.counterparty !== address) return 'Passive trust transaction';

    let result = 'You have been trust by ' + tx.address + ' for ' + spec.limit + ' ' + spec.currency;
    return result;
}

function processSettings(tx, address) {
    return 'Todo: account setting tx';
}

function processIssueSet(tx, address) {
    let spec = tx.specification;
    if (spec.issuer !== address) return 'Passive affected issue set transaction';
    return 'You are issuing ' + spec.total + ' ' + spec.currency;
}

function processDefault(tx, address) {
    return 'unknown transaction';
}

/**
 * return transaction description
 */
let Parser = {
    'payment': processPayment,
    'order': processOrder,
    'orderCancellation': processOrderCancellation,
    'trustline': processTrustline,
    'settings': processSettings,
    'issueSet': processIssueSet,
    'default': processDefault
};

export default Parser;