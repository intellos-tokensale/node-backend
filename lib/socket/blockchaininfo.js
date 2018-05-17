import account from '../account';
import events from '../events/events';


const WebSocketClient = require('./websocketclient');

var wsc = new WebSocketClient();
wsc.open('wss://ws.blockchain.info/inv');


export default {
    loadNewAddresses
};


wsc.onopen = function(e) {
    account.reloadAccounts()
        .then(() => subscribeNewAddresses());
}

wsc.onclose = function(e) {

    account.reloadAccounts()
        .then(() => subscribeNewAddresses());
}

wsc.onerror = function(e) {
    account.reloadAccounts()
        .then(() => subscribeNewAddresses());

}

wsc.onmessage = function(m, flags, number) {
    m = JSON.parse(m);
    if (m.op === 'utx') parseTransaction(m.x);
}

function subscribeNewAddresses() {
    return account.getAssociatedAccountsETH()
        .then(accounts => {
            return accounts.forEach(acc => subscribe(acc.btcAddress));
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