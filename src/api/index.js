const server = 'ws://s2.callchain.live:5021';
var CallAPI = require('call-lib').CallAPI;
var api = new CallAPI({
    server: server
});

api.on('error', function(code, msg) {
    console.dir(code);
    console.dir(msg);
});

api.on('connected', function() {
    console.log('connect it');
});

api.on('disconnected', function() {
    console.log('server disconnect');
});

try {
    api.connect().then(function() {
    });
} catch (e) {
    console.dir(e);
}


export default api;
