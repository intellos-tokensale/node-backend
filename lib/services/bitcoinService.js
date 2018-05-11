var blockexplorer = require('blockchain.info/blockexplorer');
const DECIMALS = 100000000;
var LBlock = 0;



export default {
    getTransactionsByAddress
};


function getTransactionsByAddress(address) {

    return blockexplorer.getLatestBlock()
        .then((latestBlock) => {
            LBlock = latestBlock;
            return;
        }).then(() => {
            return blockexplorer.getAddress(address, { limit: 20 });
        }).then(data => {
            return calculateTransactions(data);
        });
}

function calculateTransactions(addressData) {
    var txs = addressData.txs.map(tx => {
        var tmpTx = {};
        tmpTx.value = calculateValue(tx, addressData.address);

        tmpTx.confirmations = LBlock.height - tx.block_height + 1;
        tmpTx.hash = tx.hash;
        tmpTx.time = tx.time * 1000;
        return tmpTx;
    });
    return txs;
}


function calculateValue(tx, btcAddress) {
    var sum = tx.out.reduce((sum, current) => {
        if (current.addr === btcAddress) return sum + current.value;
        return sum;
    }, 0);
    return sum * 1.0 / DECIMALS;
}