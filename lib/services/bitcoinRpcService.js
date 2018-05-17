import _m from '../util/bigMath';
import events from '../events/events';
import checker from '../util/checker';
import series from '../util/series';
import account from '../account';
import bitcoind from '../rpc/bitcoind';


const DECIMALS = _m.newD(100000000);
var LBlock = 0;

export default {
    searchBlockChainForTransactions,
    searchUnconfirmedTransactions
};

function searchUnconfirmedTransactions() {
    return bitcoind.searchUnconfirmedTransactions()
        .then(txs => {
            var cleanTxs = [];
            console.log(txs.length);
            txs.forEach(tx => {
                if (!tx.result) return;
                tx = tx.result;
                tx.confirmations = tx.confirmations || 0;
                tx.blocktime = tx.blocktime || Math.floor(Date.now() / 1000);
                cleanTxs = cleanTxs.concat(processTransaction(tx));
            });
            return cleanTxs;
        });
}


function searchBlockChainForTransactions(time) {
    if (!time) time = Date.now();
    return bitcoind.searchBlockChainForTransactions(time)
        .then(txs => {
            var cleanTxs = [];
            txs.forEach(tx => {
                cleanTxs = cleanTxs.concat(processTransaction(tx.result));
            });
            return cleanTxs;
        });
}

function processTransaction(tx) {
    var outAll = [];
    var address;
    try {

        if (!tx.vout) return [];
        if (tx.vout.length == 0) return [];
        tx.vout.forEach(e => {
            if (!e.scriptPubKey) return;
            if (!e.scriptPubKey.addresses) return;
            if (e.scriptPubKey.addresses.length == 0) return;
            if (!addressRelevant(e.scriptPubKey.addresses)) return;
            if (e.scriptPubKey.addresses.length != 1) {
                console.log('strange multiple or no addresses', e, tx.txid);
                events.eventEmitter.emit('unsucessfulTransaction', null, 'BTC', tx, err);
            }
            address = e.scriptPubKey.addresses[0];
            var tmpOut = {
                value: _m.newD(e.value),
                address: address,
                hash: tx.txid,
                confirmations: tx.confirmations,
                time: tx.blocktime * 1000,
                accountId: account.loadedAddressToAccountId(address)
            };
            checker.checkInternalTransacitonProperties(tmpOut);
            outAll.push(tmpOut);
        });
    } catch (err) {
        console.log(tx.hash);
        console.log('transaction did not pass', err);
        try {
            events.eventEmitter.emit('unsucessfulTransaction', address, 'BTC', tx, err);
        } catch (err) {
            console.log("event-fail");
        }
    }
    return outAll;
}

function addressRelevant(outAddresses) {
    var retval = false;
    outAddresses.forEach(e => {
        if (account.loadedAddressToAccountId(outAddresses)) {
            retval = true;
        }
    });
    return retval;
}