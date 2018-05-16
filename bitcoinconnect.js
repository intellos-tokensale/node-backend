

var RpcClient = require('bitcoind-rpc');

var config = {
    protocol: 'http',
    user: 'bitcoinrpc',
    pass: 'nt4XxaUXuQ7mFUmsX0uVCLmBqHhyqOqrGqiU+Ss2yIIl',
    host: '127.0.0.1',
    port: '8332',
};

var rpc = new RpcClient(config);









// rpc.importAddress('1LuckyY9fRzcJre7aou7ZhWVXktxjjBb9S', 'o', true, function(err, ret) {
//     console.log('imported?', err, ret);
// });

// rpc.listsinceblock('000000000000000006fcbd156db0b55946b3d11c0f485e4d8f625ed2918d8d8e', 100, true, function(e, o) {
//     if (e) console.log(e);


//     var transactions = o.result.transactions;
//     console.log(transactions[0]);
//     console.log(transactions[transactions.length - 1]);
//     // o.result.transactions.forEach(element => {
//     //     if (element.category === 'receive') {
//     //         console.log(element);

//     //     }
//     // });
//     // console.log(o.result.transactions[0]);
// })
/*
rpc.getaccount('1LuckyY9fRzcJre7aou7ZhWVXktxjjBb9S', (e, o) => {
    console.log(e);
    console.log(o);
})
rpc.listtransactions('', 100, 0, true, (e, o) => {
    // console.log(e);
    // console.log(o);
    // console.log(o.result);
    o.result.forEach(element => {
        if (element.category === 'receive') {
            element.timedate = new Date(1000 * element.time);
            console.log(element);
        }
    });
});
*/

/*
function showNewTransactions() {

    rpc.getRawMemPool(function(err, ret) {
        if (err) {
            console.error(err);
            return setTimeout(showNewTransactions, 10000);
        }

        function batchCall() {
            ret.result.forEach(function(txid) {
                if (txids.indexOf(txid) === -1) {
                    rpc.getRawTransaction(txid);
                }
            });
        }

        rpc.batch(batchCall, function(err, rawtxs) {
            console.log("we are here now!", err, rawtxs);
            if (err) {
                console.error(err);
                return setTimeout(showNewTransactions, 10000);
            }

            rawtxs.map(function(rawtx) {
                console.log(rawtx);
                console.log("mapping");
                // console.log('\n\n\n' + tx.id + ':', tx.toObject());
            });

            txids = ret.result;
            setTimeout(showNewTransactions, 2500);
        });
    });
}

showNewTransactions();

*/