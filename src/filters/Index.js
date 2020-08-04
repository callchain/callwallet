const numberFormat = (value) => {
    if (!value) return '';
    var str = '' + value;
    var intPart = Number(value).toFixed(0);
    var pointPart = str.substring(str.lastIndexOf('.') === -1 ? str.length : str.lastIndexOf('.'));
    var intPartFormat = intPart.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
    return intPartFormat + pointPart;
}

const humanDate = (timestamp) => {
    var date = new Date(timestamp);
    var now = new Date();
    var seconds = parseInt((now - date) / 1000);
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
      var v = parseInt(seconds / unit.value);
      if (v !== 0) {
        return v + ' ' + (v === 1 ? unit.name : unit.name + 's') + ' ago';
      }
    }
}

import Parser from '../api/transaction-parser';

const txDesc = (tx, address) => {
    var type = tx.type;
    var parser = Parser[type] ? Parser[type] : Parser['default'];
    return parser(tx, address);
}

export {
    numberFormat,
    humanDate,
    txDesc
}
  