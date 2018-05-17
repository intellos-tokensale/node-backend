import rpcConfig from '../../config/bitcoinRpc.json';
var RpcClient = require('bitcoind-rpc');
var rpc = new RpcClient(rpcConfig);


export default {
    searchBlockChainForTransactions,
    searchUnconfirmedTransactions
};



function searchBlockChainForTransactions(time) {
    return getbestblockhash()
        .then(hash => {
            return processBlock(hash, time, []);
        });
}



function searchUnconfirmedTransactions() {
    return getRawMemPool()
        .then((txids) => {
            if (!txids) return [];
            return getTransactionsByIds(txids);
        });
}


function processBlock(hash, time, allTrans) {
    var prev;
    return getBlock(hash)
        .then((block) => {
            if (!block) return allTrans;
            if (!block.tx) return block.tx = [];
            if (block.time < time) return allTrans;

            // console.log(new Date(block.time * 1000), new Date(time * 1000));
            prev = block.previousblockhash;
            return getTransactionsByIds(block.tx)
                .then(trxs => {
                    allTrans = allTrans.concat(trxs);
                    return processBlock(prev, time, allTrans);
                });
        })

}


function getbestblockhash() {
    return new Promise((resolve, reject) => {
        rpc.getbestblockhash((e, o) => {
            if (e) return reject(e);
            resolve(o.result);
        });
    });
}


function getBlock(hash) {
    console.log('getBlock', hash);
    return new Promise((resolve, reject) => {
        rpc.getblock(hash, (e, o) => {
            if (e) return reject(e);
            resolve(o.result);
        });
    });
}

function getRawMemPool() {
    return new Promise((resolve, reject) => {
        rpc.getRawMemPool((e, o) => {
            if (e) return reject(e);
            resolve(o.result);
        });
    });
}


function getTransactionsByIds(txIds) {
    return new Promise((resolve, reject) => {
        rpc.batch(() => {
                txIds.forEach(txid => rpc.getRawTransaction(txid, 1));
            },
            (e, rawtxs) => {
                if (e) return reject(e);
                resolve(rawtxs);
            });
    });
}