// "Eth.providers.givenProvider" will be set if in an Ethereum supported browser.
var Web3 = require('web3');
var web3 = new Web3(
    new Web3.providers.HttpProvider('https://mainnet.infura.io/mSh9CgtJ3vUvDvFXMYxK')
);
var eth = web3.eth;



export default {

}

function scanBlockchain(aproxTime) {
    if (!aproxTime) aproxTime = 4 * 4;
    var blocks = aproxTime;
    loadNewAddresses().then(addresses => {
        getTransactionsByAccount(addresses, aproxTime);
    });

}


function loadNewAddresses() {
    return account.getAssociatedAccounts()
        .then(accounts => {
                var addresses = {};
                accounts.forEach(acc => {
                        addresses[acc.ethAddress] = acc.userId;
                    }
                });
            return addresses;
        });
}


function getTransactionsByAccount(accounts, blocksBack) {

    var transX = [];
    return eth.getBlock('latest')
        .then((l) => {
            if (!blocksBack) blocksBack = 4 * 5;
            var startBlockNumber = l.number - blocksBack;

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
                    e.userId = accounts[e.to];
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