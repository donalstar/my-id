var Web3 = require('web3');
var rpc = require('json-rpc2');
var UserChain = require("../contracts/UserChain.sol.js");
var Pudding = require("ether-pudding");
var file_store = require('./file-store.js');
var config = require('./config.js');
var client = rpc.Client.$create(config.server_port, config.server_host);
var web3 = new Web3();
var provider = new web3.providers.HttpProvider();

var utility = require('./utility.js');

web3.setProvider(provider);

Pudding.setWeb3(web3);

UserChain.load(Pudding);

/**
 * Unlock account
 *
 * @param address
 * @param passphrase
 * @param callback
 */
function unlockAccount(address, passphrase, callback) {

    client.call("personal_unlockAccount", [address, passphrase, 30], function (err, result) {

        callback(err, result);
    });
}

/**
 * Create Contract
 *
 * @param firstName
 * @param lastName
 * @param accountAddress
 * @param masterAccount
 * @param callback
 */
function createContract(firstName, lastName, accountAddress, masterAccount, callback) {

    code = UserChain.binary;

    abi = UserChain.abi;

    var contract = web3.eth.contract(abi);

    var gasEstimate = web3.eth.estimateGas({
        to: masterAccount,
        data: code
    });
    console.log("Gas estimate " + gasEstimate + " for sender " + masterAccount);

    // TODO: How to correctly set gas
    var gas = gasEstimate * 10;

    contract.new(firstName, lastName, accountAddress, {
        from: masterAccount,
        data: code,
        gas: gas
    }, function (e, contract) {
        if (!e) {

            if (!contract.address) {
                console.log("Contract transaction send: TransactionHash: " + contract.transactionHash + " waiting to be mined...");

            } else {
                console.log("Contract mined! Address: " + contract.address);

                callback(e, contract);
            }
        }
        else {
            console.log("Error " + e);
            console.log("GAS PRICE " + web3.eth.gasPrice);
            console.log("Balance: " + web3.eth.getBalance(masterAccount));

            callback(e, null);
        }
    })
}


function addFunds(address, callback) {
    web3.eth.getAccounts(function (err, accs) {
        var amount = web3.toWei(5, "finney"); // decide how much to contribute

        var transaction = web3.eth.sendTransaction({
            from: accs[0],
            to: address,
            value: amount,
            gas: 3000000
        });

        console.log("Sent funds to " + address); // "0x7f9fade1c0d57a7af66ab4ead7c2eb7b11a91385"


        console.log("NEW Balance: " + web3.eth.getBalance(address));

        web3.eth.getTransactionReceipt(transaction, function (receipt) {
            console.log("TXN receipt " + receipt);


            callback();
        });

    });
}

module.exports = {

    /**
     *
     * @param username
     * @param passphrase
     * @param res
     */
    getAccount: function (username, passphrase, res) {

        utility.getAccountInfo(username, function (error, accountInfo) {

            if (accountInfo) {
                var contract = UserChain.at(accountInfo.contract);

                var balance = web3.fromWei(web3.eth.getBalance(accountInfo.account), 'finney');

                console.log("Account Balance (finney): " + balance);

                unlockAccount(accountInfo.account, passphrase, function (err, result) {
                    if (!err) {
                        console.log("unlockAccount " + accountInfo.account + " - done: success " + result);

                        contract.the_name.call().then(
                            function (the_name) {

                                contract.getDL.call().then(
                                    function (dl_address) {
                                        console.log("GOT DL == " + dl_address);

                                        var dl = "0";
                                        
                                        file_store.readFromFile(dl_address, function (error, data) {
                                            if (!error) {
                                                dl = data;
                                            }
                                        });

                                        contract.getSSN.call().then(
                                            function (ssn_address) {
                                                console.log("Got ssn_address " + ssn_address);

                                                if (ssn_address && ssn_address != 0) {
                                                    file_store.readFromFile(ssn_address, function (error, data) {
                                                        if (!error) {
                                                            console.log('FROM IPFS --- ' + data);

                                                            res.send(JSON.stringify(
                                                                {
                                                                    result: result,
                                                                    balance: balance,
                                                                    first_name: the_name[0],
                                                                    last_name: the_name[1],
                                                                    ssn: data,
                                                                    dl: dl,
                                                                    error: err
                                                                }));
                                                        }
                                                        else {
                                                            var message = 'Error reading from file store: ' + error;

                                                            console.log(message, error);

                                                            res.send(JSON.stringify(
                                                                {
                                                                    error: message + error
                                                                }));
                                                        }
                                                    });
                                                }
                                                else {
                                                    res.send(JSON.stringify(
                                                        {
                                                            result: result,
                                                            balance: balance,
                                                            first_name: the_name[0],
                                                            last_name: the_name[1],
                                                            ssn: "0",
                                                            error: err
                                                        }));
                                                }
                                            });
                                    });

                            });
                    }
                    else {
                        console.log("Failed to unlock account " + err);

                        var message = 'system error';

                        if (err.code == -32000) {
                            message = err.message;
                        }
                        else {

                        }
                        res.send(JSON.stringify(
                            {
                                error: message
                            }));
                    }
                });
            }
        });
    },

    /**
     * Create Account
     *
     * @param username
     * @param first_name
     * @param last_name
     * @param passphrase
     * @param res
     */
    createAccount: function (username, first_name, last_name, passphrase, res) {
        console.log("createAccount - username " + username + " passphrase " + passphrase);

        client.call("personal_newAccount", [passphrase], function (err, accountAddress) {

            web3.eth.getAccounts(function (err, accounts) {
                var masterAccount = accounts[0];

                createContract(first_name, last_name, accountAddress, masterAccount, function (err, contract) {
                    console.log("Created contract with address " + contract + " for account " + accountAddress);

                    addFunds(accountAddress, function () {
                        if (!err) {
                            console.log("Successfully added funds to account " + accountAddress);

                            utility.addToFile(username, accountAddress, contract.address, function () {
                                console.log("Account creation complete");

                                res.send(JSON.stringify({value: "ok"}));
                            });
                        }
                        else {
                            console.log('Failed to add funds : ', error);
                        }
                    });
                });
            });
        });
    }
};