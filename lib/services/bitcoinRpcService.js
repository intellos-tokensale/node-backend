import _m from '../util/bigMath';
import events from '../events/events';
import checker from '../util/checker';
import rpcConfig from '../../config/bitcoinRpc.json';
import account from '../account';

var RpcClient = require('bitcoind-rpc');
var bitcoin_address = require('bitcoin-address');
const DECIMALS = _m.newD(100000000);
var LBlock = 0;


var rpc = new RpcClient(rpcConfig);



export default {
    getTransactionsByAddress,
    calculateTransactions
};



function getTransactionsByAddress(address) {
    if (!bitcoin_address.validate(address)) throw 'Account: Not a valid BTC address';
    const account = ''; //= 'acc'+address;
    return new Promise((resolve, reject) => {
        rpc.listtransactions(account, 100, 0, true, (e, o) => {
            if (e) return reject(e);
            var tmp = o.result.filter(tx => tx.category == 'receive');
            resolve(tmp);
        });
    }).then(data => {
        return calculateTransactions(data, address);
    });
}

function calculateTransactions(transactions, address) {
    if (!transactions) throw 'BTC Service: addressData.txs undefined';
    if (!Array.isArray(transactions)) throw 'BTC Service: addressData.txs not an array';
    if (!address) throw 'BTC Service: addressData.address undefined';

    var txs = transactions.map(tx => {
        try {
            checker.checkBlockchainRpcBTCTransactionProperties(tx);
            var tmpTx = {};
            tmpTx.value = _m.newD(tx.amount);
            tmpTx.confirmations = tx.confirmations;
            tmpTx.hash = tx.txid;
            tmpTx.time = tx.time * 1000; //maybe received time?

            checker.checkInternalTransacitonProperties(tmpTx);
            console.log('transaction passed');
            return tmpTx;
        } catch (err) {
            console.log('transaction did not pass', err);
            events.eventEmitter.emit('unsucessfulTransaction', address, 'BTC', tx, err);
            return null;
        }
    });
    txs = txs.filter(tx => !!tx);
    return txs;
}

var allTrans = [];

searchBlockChainForTransactions(Math.floor(Date.now() / 1000) - 1 * 60 * 60);


function searchBlockChainForTransactions(time) {
    getbestblockhash()
        .then(hash => {
            return processBlock(hash, time);
        })
        .then(() => {
            console.log(allTrans);
        });
}

function processBlock(hash, time) {

    var block;
    return getBlock(hash)
        .then(b => {
            block = b;
            var txids = b.tx;
            console.log('processing block', hash, new Date(block.time * 1000));
            return for_each(txids, 0, processTransactions);
        })
        .then(() => {
            console.log(new Date(block.time * 1000), new Date(time * 1000));
            console.log()
            if (block.time > time) {
                return processBlock(block.previousblockhash, time);
            }

            console.log("we are done");
            return {};

        });
}


function getbestblockhash() {
    return new Promise((resolve, reject) => {
        rpc.getbestblockhash((e, o) => {
            if (e) return reject(e);
            resolve(o.result);
        });
    });
}


function processTransactions(txid) {
    return gettransaction(txid)
        .then(tx => {
            return modRawTransaction(tx);
        }).then(relevant => {
            // console.log(txid);
            allTrans = allTrans.concat(relevant);
            return {};
        })
        .catch(e => {
            console.log("there was an error getting the Transaction " + txid, e);
            return {};
        })
}


function getBlock(hash) {
    return new Promise((resolve, reject) => {
        rpc.getblock(hash, (e, o) => {
            if (e) return reject(e);
            resolve(o.result);
        });
    });
}

function gettransaction(txid) {
    return new Promise((resolve, reject) => {
        rpc.getrawtransaction(txid, 1, (e, o) => {
            if (e) return reject(e);
            resolve(o.result);
        });
    });
}

var addresses = {
    '1BnCLyRJBWADCcMHcpfqeDU9EmYHzPFSw9': true,
    '1NtDLeHtFCMtGJsaCFe2JJDKyo2URa1CWY': true
};

function modRawTransaction(tx) {
    var outAll = [];
    if (tx.vout.lenth == 0) return [];
    tx.vout.forEach(e => {

        if (!e.scriptPubKey) return;
        if (!e.scriptPubKey.addresses) return;
        if (e.scriptPubKey.addresses.length == 0) return;
        if (!addressRelevant(e.scriptPubKey.addresses, addresses)) return;
        if (!e.scriptPubKey.addresses.length == 1) {
            console.log('strange multiple  or no addresses', e, tx.txid);
            events.eventEmitter.emit('unsucessfulTransaction', address, 'ETH', tx, err);
        }
        var tmpOut = {
            value: _m.newD(e.value),
            address: e.scriptPubKey.addresses[0],
            hash: tx.txid,
            confirmations: tx.confirmations,
            time: tx.blocktime,
        };
        outAll.push(tmpOut);
    });
    return outAll;
}

function addressRelevant(outAddresses, relevantAddresses) {
    var retval = false;
    outAddresses.forEach(e => {
        if (relevantAddresses[e]) {
            console.log(e, 'isrelevant');
            retval = true;
        }
    });
    return retval;
}

function for_each(array, i, func) {
    if (i >= array.length) {
        return Promise.resolve({});
    }
    return func(array[i]).then(() => {
        return for_each(array, i + 1, func);
    });
}


/*
var addresses = {};

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
            multisub();
            return {};
        });

}

var newAddresses = [];
var maxImport = 100000;

function subscribe(address) {

    var itm = {
        scriptPubKey: { address: address },
        timestamp: Date.now() - 60 * 60,
        label: 'acc' + address
    };
    if (newAddresses.length < maxImport) {
        newAddresses.push(itm);
    }
}

//const { exec } = require('child_process');


function multisub() {
    // console.log('starting mutli sub');
    var str = newAddresses;
    var length = newAddresses.length;
    //console.log(str);
    var rescan = { "rescan": true };
    rpc.importmulti(str, rescan, function(e, o) {
        if (e) console.log('error', e);
        console.log('done');
        // console.log(o);
        // if (length > maxImport - 1) {

        // }
    });
    //var cmd = 'bitcoin-cli importmulti --rpcuser=' + rpcConfig.user + ' --rpcpassword=' + rpcConfig.pass + ' \'' + str + '\' \'' + rescan + '\'';
    // console.log(cmd);
    // exec(cmd, (error, stdout, stderr) => {
    //     if (error) {
    //         console.error(`exec error: ${error}`);
    //         return;
    //     }
    //     console.log(`stdout: ${stdout}`);
    //     console.log(`stderr: ${stderr}`);
    // });

}

*/

// loadNewAddresses();
/*
getTransactionsByAddress('14ChPPM8rPYJeHnw6kMVUDnNNKx1KnjYW4')
    .then(x => {
        x.map(x => {
            x.datetime = new Date(x.time);
            return x;
        })
        console.log('transactions', x)
    });

*/