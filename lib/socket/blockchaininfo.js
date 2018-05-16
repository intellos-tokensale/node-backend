import account from '../account';
import events from '../events/events';


const WebSocketClient = require('./websocketclient');

var wsc = new WebSocketClient();
wsc.open('wss://ws.blockchain.info/inv');

var addresses = [];


export default {
    loadNewAddresses
};


wsc.onopen = function(e) {
    loadNewAddresses();
}

wsc.onclose = function(e) {
    addresses = [];
    loadNewAddresses();
}

wsc.onerror = function(e) {
    addresses = [];
    loadNewAddresses();
}

wsc.onmessage = function(m, flags, number) {
    m = JSON.parse(m);
    if (m.op === 'utx') parseTransaction(m.x);
}


function loadNewAddresses() {
    return account.getAssociatedAccounts()
        .then(accounts => {
            accounts.forEach(acc => {
                acc = acc.dataValues;
                if (!addresses[acc.btcAddress]) {
                    addresses[acc.btcAddress] = acc.userId;
                    subscribe(acc.btcAddress);
                }
            });
            console.log(Object.keys(addresses).length);
            return {};
        });

}

function subscribe(addr) {
    var cmd = { "op": "addr_sub", "addr": addr };
    wsc.send(JSON.stringify(cmd));
}


function parseTransaction(tx) {
    var outaddr = tx.out.filter(o => addresses[o.addr])
        .map(o => o.addr)
        .filter((elem, index, self) => index === self.indexOf(elem));

    outaddr.forEach(x => {
        //console.log(addresses[x] + "", x);
        account.getFlat(addresses[x])
            .then(acc => {
                //console.log(acc);
                events.eventEmitter.emit('accountFetched', acc);
            });
    });
}