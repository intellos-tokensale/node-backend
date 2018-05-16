// "Eth.providers.givenProvider" will be set if in an Ethereum supported browser.
var Web3 = require('web3');
var web3 = new Web3(
    new Web3.providers.HttpProvider('https://mainnet.infura.io/mSh9CgtJ3vUvDvFXMYxK')
);
var eth = web3.eth;


var o = {
    '0x3f5CE5FBFe3E9af3971dD833D26bA9b5C936f0bE': 123
};

getTransactionsByAccount(o)
    .then(console.log);


function getTransactionsByAccount(accounts, startBlockNumber) {

    var transX = [];
    return eth.getBlock('latest')
        .then((l) => {
            if (!startBlockNumber) startBlockNumber = l.number - 20; //5 * 60 * 2;

            var blockIds = [];
            for (var i = startBlockNumber; i <= l.number; i++) {
                blockIds.push(i);
            }
            return for_each(blockIds, 0, processTransaction);

        })
        .then(() => {
            console.log(transX.length);

            console.log(transX);
            return transX;
        })

    function processTransaction(i) {
        console.log(i);
        return eth.getBlock(i, true)
            .then((block) => {
                if (block == null) return [];
                if (block.transactions == null) {
                    console.log(block.number, 'transactions 0');
                    return [];
                }
                var tx = block.transactions.map(function(e) {
                    if (!accounts[e.to]) return null;
                    return e;
                });
                tx = tx.filter(x => !!x);
                transX = transX.concat(tx);
                return;
            });
    }
}




function for_each(array, i, func) {
    if (i >= array.length) {
        return Promise.resolve({});
    }
    return func(array[i]).then(() => {
        return for_each(array, i + 1, func);
    });
}