var Web3 = require('web3');
var rpc = require('json-rpc2');
var UserChain = require("../contracts/UserChain.sol.js");
var client = rpc.Client.$create(8545, "localhost");
var web3 = new Web3();
var provider = new web3.providers.HttpProvider();

web3.setProvider(provider);


/**
 * Unlock account
 *
 * @param passphrase
 * @param callback
 */
function unlockAccount(address, passphrase, callback) {

    // address = "0x6337ac72daa8566fad104f185be41b4200063e6d";
    // passphrase = "eth1";

    client.call("personal_unlockAccount", [address, passphrase, 30], function (err, result) {

        callback(err, result);
    });
}

/**
 * Create Contract
 *
 * @param sendingAddr
 */
function createContract(sendingAddr, callback) {

    code = UserChain.binary;

    abi = UserChain.abi;

    var contract = web3.eth.contract(abi);

    var gasEstimate = web3.eth.estimateGas({
        to: sendingAddr,
        data: code
    });
    console.log("Gas estimate " + gasEstimate + " for sender " + sendingAddr);


    // TODO: How to correctly set gas
    var gas = gasEstimate * 10;

    contract.new({
        from: sendingAddr,
        data: code,
        gas: gas
    }, function (e, contract) {
        if (!e) {

            if (!contract.address) {
                console.log("Contract transaction send: TransactionHash: " + contract.transactionHash + " waiting to be mined...");

            } else {
                console.log("Contract mined! Address: " + contract.address);
                // console.log(contract);

                console.log("GAS PRICE " + web3.eth.gasPrice);
                console.log("Balance: " + web3.eth.getBalance(sendingAddr));

                callback(null, contract.address);
            }
        }
        else {
            console.log("Error " + e);
            console.log("GAS PRICE " + web3.eth.gasPrice);
            console.log("Balance: " + web3.eth.getBalance(sendingAddr));

            callback(e, null);
        }
    })
}

//
// function addFunds(address, callback) {
//     web3.eth.getAccounts(function (err, accs) {
//         var amount = web3.toWei(5, "finney"); // decide how much to contribute
//
//
//         var transaction = web3.eth.sendTransaction({
//             from: accs[0],
//             to: address,
//             value: amount,
//             gas: 3000000
//         });
//
//         console.log("Sent funds to " + address); // "0x7f9fade1c0d57a7af66ab4ead7c2eb7b11a91385"
//
//
//         console.log("NEW Balance: " + web3.eth.getBalance(address));
//
//         web3.eth.getTransactionReceipt(transaction, function (receipt) {
//             console.log("TXN receipt " + receipt);
//
//
//             callback();
//         });
//
//     });
//
//
// }


module.exports = {

    getAccount: function(key, passphrase, res) {

        unlockAccount(key, passphrase, function (err, result) {
            console.log("unlockAccount - done");

            if (result == true) {
                console.log("ACC UNLOCK SUCCESSFUL");
            }
            else {
                console.log("ACC UNLOCK UN-SUCCESSFUL")
            }

            res.send(JSON.stringify({result: result, error: err}));
        });
    },

    /**
     * Create Account
     *
     * @param passphrase
     * @param res
     */
    createAccount: function (passphrase, res) {
        console.log("createAccount - passphrase " + passphrase);

        client.call("personal_newAccount", [passphrase], function (err, result) {
            console.log("Created acc " + result + " err " + err);

            web3.eth.getAccounts(function (err, accs) {
                unlockAccount(accs[0], passphrase, function () {
                    createContract(accs[0], function (err, contract) {
                        console.log("Created contract with address " + contract + " for account " + result);

                        res.send(JSON.stringify({value: result}));
                    });
                });
            });
        });
    }
};