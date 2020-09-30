const numberFormat = (value) => {
    if (!value) return '';
    var str = '' + value;
    var intPart = Math.floor(Number(value));
    var pointPart = str.substring(str.lastIndexOf('.') === -1 ? str.length : str.lastIndexOf('.'));
    var intPartFormat = intPart.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
    return intPartFormat + pointPart;
}

const humanDate = (timestamp) => {
    var date = new Date(timestamp);
    var now = new Date();
    var seconds = Math.floor((now - date) / 1000);
    if (seconds <= 0) return 'a moment ago';

    var units = [
      {value: 31536000, name: "year"},
      {value: 2592000, name: "month"},
      {value: 604800, name: "week"},
      {value: 86400, name: "day"},
      {value: 3600, name: "hour"},
      {value: 60, name: "minute"},
      {value: 1, name: "second"}
    ];
  
    for (var i = 0; i < units.length; ++i) {
      var unit = units[i];
      var v = Math.floor(seconds / unit.value);
      if (v !== 0) {
        var ret = v + ' ' + (v === 1 ? unit.name : unit.name + 's') + ' ago';
        return ret;
      }
    }
}

import Parser from '../api/transaction-parser';

const txDesc = (tx, address) => {
    var type = tx.type;
    var parser = Parser[type] ? Parser[type] : Parser['default'];
    return parser(tx, address);
}

const orderPair = (item) => {
  var s = item.specification;
  var ret = s.quantity.currency;
  if (s.quantity.counterparty) {
    ret += '@' + s.quantity.counterparty;
  }
  ret += '/' + s.totalPrice.currency;
  if (s.totalPrice.counterparty) {
    ret += '@' + s.totalPrice.counterparty;
  }
  return ret;
}

const orderPrice = (item) => {
  var s = item.specification;
  var price;
  if (s.direction === 'buy')
  {
    price = (Math.floor(Number(s.totalPrice.value) / Number(s.quantity.value) * 1000000) / 100000).toFixed(6);
  }
  else
  {
    price = (Math.ceil(Number(s.totalPrice.value) / Number(s.quantity.value) * 1000000) / 100000).toFixed(6);
  }
  return price;
}

export {
    numberFormat,
    humanDate,
    txDesc,
    orderPair,
    orderPrice
}
  