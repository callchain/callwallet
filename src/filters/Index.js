import BN from 'bignumber.js';

const numberFormat = (value) => {
    if (!value) return '';
    return new BN(value).toFormat();
}

const humanDate = (timestamp) => {
    let date = new Date(timestamp);
    let now = new Date();
    let seconds = Math.floor((now - date) / 1000);
    if (seconds <= 0) return 'a moment ago';

    let units = [
      {value: 31536000, name: "year"},
      {value: 2592000, name: "month"},
      {value: 604800, name: "week"},
      {value: 86400, name: "day"},
      {value: 3600, name: "hour"},
      {value: 60, name: "minute"},
      {value: 1, name: "second"}
    ];
  
    for (let i = 0; i < units.length; ++i) {
      let unit = units[i];
      let v = Math.floor(seconds / unit.value);
      if (v !== 0) {
        let ret = v + ' ' + (v === 1 ? unit.name : unit.name + 's') + ' ago';
        return ret;
      }
    }
}

import Parser from '../api/transaction-parser';

const txDesc = (tx, address) => {
    let type = tx.type;
    let parser = Parser[type] ? Parser[type] : Parser['default'];
    return parser(tx, address);
}

const orderPair = (item) => {
  let s = item.specification;
  let ret = s.quantity.currency;
  if (s.quantity.counterparty) {
    ret += '@' + s.quantity.counterparty;
  }
  ret += '/' + s.totalPrice.currency;
  if (s.totalPrice.counterparty) {
    ret += '@' + s.totalPrice.counterparty;
  }
  return ret;
}

export {
    numberFormat,
    humanDate,
    txDesc,
    orderPair
}
  