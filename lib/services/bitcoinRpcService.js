import _m from '../util/bigMath';
import events from '../events/events';
import checker from '../util/checker';
import series from '../util/series';
import account from '../account';
import bitcoind from '../rpc/bitcoind';
import logger from '../logger';


const DECIMALS = _m.newD(100000000);
const LBlock = 0;

export default {
    searchBlockChainForTransactions,
    searchUnconfirmedTransactions
};

function searchUnconfirmedTransactions() {
    return bitcoind.searchUnconfirmedTransactions()
        .then(txs => {
            let cleanTxs = [];
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
            let cleanTxs = [];
            txs.forEach(tx => {
                cleanTxs = cleanTxs.concat(processTransaction(tx.result));
            });
            return cleanTxs;
        });
}

function processTransaction(tx) {
    let outAll = [];
    let address;
    try {

        if (!tx.vout) return [];
        if (tx.vout.length == 0) return [];
        tx.vout.forEach(e => {
            if (!e.scriptPubKey) return;
            if (!e.scriptPubKey.addresses) return;
            if (e.scriptPubKey.addresses.length == 0) return;
            if (!addressRelevant(e.scriptPubKey.addresses)) return;
            if (e.scriptPubKey.addresses.length != 1) {
                logger.info('strange multiple or no addresses', e, tx.txid);
                events.eventEmitter.emit('unsucessfulTransaction', null, 'BTC', tx, err);
            }
            address = e.scriptPubKey.addresses[0];
            let tmpOut = {
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
        logger.info(tx.hash);
        logger.info('transaction did not pass', err);
        try {
            events.eventEmitter.emit('unsucessfulTransaction', address, 'BTC', tx, err);
        } catch (err) {
            console.warn("event-fail", err);
        }
    }
    return outAll;
}

function addressRelevant(outAddresses) {
    let retval = false;
    outAddresses.forEach(e => {
        if (account.loadedAddressToAccountId(e)) {
            retval = true;
        }
    });
    return retval;
}