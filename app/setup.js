var Web3 = require('web3');
var web3 = new Web3();

var Pudding = require("ether-pudding");

var Coin = require("./contracts/Coin.sol.js");

var provider = new web3.providers.HttpProvider();

web3.setProvider(provider);
Pudding.setWeb3(web3);
Coin.load(Pudding);

console.log("SETUP \n ------- \n");

var owner = '0x6337ac72daa8566fad104f185be41b4200063e6d';

var supply = 1000;

createCoinBank(supply, owner, function (error, result) {
    if (!error) {
        console.log("Created contract " + result);

        var contract = Coin.at(result);

        contract.balanceOf.call(owner, {from: owner}).then(function (balance) {
            console.log("Initial balance " + balance);
        });
    }
    else {
        console.log("Error creating contract " + error);
    }
});


/**
 *
 * @param supply
 * @param masterAccount
 * @param callback
 */
function createCoinBank(supply, masterAccount, callback) {

    code = Coin.binary;

    abi = Coin.abi;

    var contract = web3.eth.contract(abi);

    var gasEstimate = web3.eth.estimateGas({
        to: masterAccount,
        data: code
    });

    console.log("Gas estimate " + gasEstimate + " for sender " + masterAccount);

    // TODO: How to correctly set gas
    var gas = gasEstimate * 10;

    contract.new(supply, 'TOK', 0, 'T', 0, {
        from: masterAccount,
        data: code,
        gas: gas
    }, function (e, contract) {
        if (!e) {

            if (!contract.address) {
                console.log("Contract transaction send: TransactionHash: " + contract.transactionHash + " waiting to be mined...");

            } else {
                console.log("Contract mined! Address: " + contract.address);

                callback(e, contract.address);
            }
        }
        else {
            console.log("Error " + e);
            console.log("Gas price: " + web3.eth.gasPrice);
            console.log("Balance: " + web3.eth.getBalance(masterAccount));

            callback(e, null);
        }
    })
}