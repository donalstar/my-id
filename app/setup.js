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

        // var contract = Coin.at(result);
        //
        // contract.balanceOf.call(owner, {from: owner}).then(function (balance) {
        //     console.log("Owner balance (tokens) " + balance);
        //
        //
        // });
    }
    else {
        console.log("Error creating contract " + error);
    }

    process.exit();
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

    var initialContractBalance = 100;

    var tokenName = "TOK";
    var decimalUnits = 0;
    var tokenSymbol = "T";

    Coin.new(supply, tokenName, decimalUnits, tokenSymbol, 0, {
        from: masterAccount,
        data: code,
        gas: gas
    }).then(function (contract) {

        if (!contract.address) {
            console.log("Contract transaction send: TransactionHash: " + contract.transactionHash + " waiting to be mined...");

        } else {
            console.log("[ COIN BANK ] Contract mined! Address: " + contract.address);


            var block = web3.eth.getBlock('latest').number;
            contract.SellTokens().watch(function (error, result) {
                if (result.blockNumber > block) {
                    if (!error)
                        console.log(" : SELL PRICE " + result.args.sellPrice_finney + " finney "
                            + " Tokens: " + result.args.tokens
                            + " REVENUE " + result.args.rev_finney + " finney");
                }
            });

            contract.getBalance.call(masterAccount).then(function (balance) {
                console.log("Owner initial balance (tokens) " + balance);

                return contract.sell(initialContractBalance, {from: masterAccount});
            }).then(function (revenue) {
                console.log("Master account Sold " + initialContractBalance + " finney to contract: rev = " + revenue);

                return contract.getBalance.call(contract.address);

            }).then(function (balance) {
                console.log("Contract balance (tokens) " + balance);

                return contract.getBalance.call(masterAccount);
            }).then(function (balance) {
                console.log("Owner balance (tokens) " + balance);
                callback(null, contract.address);
            }).catch(function (error) {
                console.log("Got error " + error);

                callback(error, contract.address);
            });


        }
    }).catch(function (error) {
        console.log("Got error ");

        console.log("Error " + error);
        console.log("Gas price: " + web3.eth.gasPrice);
        console.log("Balance: " + web3.eth.getBalance(masterAccount));

        callback(error, null);
    });

}