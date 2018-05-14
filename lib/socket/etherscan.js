import account from '../account';
import events from '../events/events';

const WebSocketClient = require('./websocketclient');


var wsc = new WebSocketClient();
wsc.open('wss://socket.etherscan.io/wshandler');

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
    if (m.event == 'txlist') parseTransaction(m.address);
}



function loadNewAddresses() {
    return account.getAssociatedAccounts()
        .then(accounts => {
            accounts.forEach(acc => {
                acc = acc.dataValues;
                if (!addresses[acc.ethAddress]) {
                    addresses[acc.ethAddress] = acc.userId;
                    subscribe(acc.ethAddress);
                }
            });
            return {};
        });

}

function subscribe(addr) {
    var cmd = { "event": "txlist", "address": addr };
    //console.log(cmd);
    wsc.send(JSON.stringify(cmd));
}

function parseTransaction(address) {

    account.getFlat(addresses[address])
        .then(acc => {

            events.eventEmitter.emit('accountFetched', acc);
        });
}