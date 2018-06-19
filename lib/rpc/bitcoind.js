module.exports = {
    searchBlockChainForTransactions,
    searchUnconfirmedTransactions
};

const config = require('../../config');
const logger = require('../logger');
const crawledblock = require('../crawledblock');
const RpcClient = require('bitcoind-rpc');
const rpc = new RpcClient(config.bitcoinrpc);

let bestheight;



function searchBlockChainForTransactions(time) {
    return getblockcount()
        .then(height => {
            bestheight = height;
            return getbestblockhash();
        })
        .then(hash => {
            return processBlock(hash, time, []);
        })
}



function searchUnconfirmedTransactions() {
    return getRawMemPool()
        .then((txids) => {
            if (!txids) return [];
            return getTransactionsByIds(txids);
        });
}


function processBlock(hash, time, allTrans) {
    let prev;
    return crawledblock.skipToLastUnprocessedByHash(hash, time, 'BTC')
        .then((b) => {
            if (!b.blocktime) b.blocktime = time;
            if (b.blocktime < time) { return allTrans; }
            return getBlock(b.blockhash)
                .then((block) => {
                    if (!block) { return allTrans; }
                    if (!block.tx) return block.tx = [];
                    if (block.time < time) { return allTrans; }
                    prev = block.previousblockhash;
                    return getTransactionsByIds(block.tx)
                        .then(trxs => {
                            allTrans = allTrans.concat(trxs);
                            crawledblock.markBlockasProcessed(block, 'BTC', bestheight);
                            return processBlock(prev, time, allTrans);
                        });
                });
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


function getBlock(hash) {
    logger.info('fetching btc block ', hash);
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

function getblockcount() {
    return new Promise((resolve, reject) => {
        rpc.getblockcount((e, o) => {
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