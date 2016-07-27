var Web3 = require('web3');
var async = require("async");
var IdStore = require("../contracts/IdStore.sol.js");
var Pudding = require("ether-pudding");
var config = require('./config.js');
var attributesHandler = require('./attributes-handler.js');
var web3 = new Web3();
var provider = new web3.providers.HttpProvider();

var utility = require('./utility.js');

web3.setProvider(provider);

Pudding.setWeb3(web3);

IdStore.load(Pudding);

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

    code = IdStore.binary;

    abi = IdStore.abi;

    var contract = web3.eth.contract(abi);

    var gasEstimate = web3.eth.estimateGas({
        to: masterAccount,
        data: code
    });
    console.log("Gas estimate " + gasEstimate + " for sender " + masterAccount);

    // TODO: How to correctly set gas
    var gas = gasEstimate * 10;

    var coinbank = config.coin_bank;

    var transaction_price = 1;

    contract.new(firstName, lastName, accountAddress, transaction_price, coinbank, {
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
            console.log("Gas price: " + web3.eth.gasPrice);
            console.log("Balance: " + web3.eth.getBalance(masterAccount));

            callback(e, null);
        }
    })
}

/**
 *
 * @param accountInfo
 * @param passphrase
 * @param contract
 * @param balance
 * @param res
 */
function getAccountInfo(accountInfo, passphrase, contract, balance, res) {

    utility.unlockAccount(accountInfo.account, passphrase).then(function (result) {
        console.log("unlockAccount " + accountInfo.account + " - done: success " + result);

        contract.the_name.call().then(function (the_name) {
            attributesHandler.getAttributes(accountInfo, function (error, attributes) {

                var profile = [
                    {name: "ssn", value: "", access: 0},
                    {name: "dl", value: "", access: 0},
                    {name: "fico", value: "", access: 0}
                ];

                if (attributes != null) {
                    profile = JSON.parse(attributes);
                }

                res.send(JSON.stringify(
                    {
                        result: true,
                        balance: balance,
                        first_name: the_name[0],
                        last_name: the_name[1],
                        profile: profile,
                        error: error
                    }));
            });
        });
    }).catch(function (error) {
        console.log("Failed to unlock account " + error);

        var message = 'system error';

        if (error.code == -32000) {
            message = error.message;
        }

        res.send(JSON.stringify(
            {
                error: message
            }));
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
                var contract = IdStore.at(accountInfo.contract);

                var balance = web3.fromWei(web3.eth.getBalance(accountInfo.account), 'finney');

                console.log("Account " + accountInfo.account + " Balance (wei): " + balance);

                if (balance < 5) {
                    console.log("Account Balance too low - top up...");

                    var amount = 10;

                    utility.addFundsFromMaster(accountAddress, initialAccountBalance).then(function (amount) {
                        getAccountInfo(accountInfo, passphrase, contract, balance, res);
                    }).catch(function (error) {
                        console.log("ERROR " + error);
                    });

                    utility.addFundsFromMaster(accountInfo.account, amount, function () {
                        getAccountInfo(accountInfo, passphrase, contract, balance, res);
                    });
                }
                else {
                    getAccountInfo(accountInfo, passphrase, contract, balance, res);
                }
            }
        });
    },

    /**
     *
     * @param username
     * @param account_name
     * @param attribute
     * @param res
     */
    requestData: function (username, account_name, attribute, res) {

        utility.getAccountInfo(account_name, function (error, result) {
            if (result) {
                var contract_address = result.contract;

                utility.getCustomerInfo(username).then(function (accountInfo) {
                    attributesHandler.getAttribute(accountInfo, contract_address, 0, function (err, result) {

                        if (!err) {
                            var balance = web3.fromWei(web3.eth.getBalance(accountInfo.account), 'finney');

                            var tokens = result.tokens;

                            res.send(JSON.stringify(
                                {
                                    result: true,
                                    balance: balance,
                                    token_balance: tokens,
                                    attribute: attribute,
                                    value: result.data,
                                    error: err
                                }));
                        }
                        else {
                            res.status(500).send({message: err.message});
                        }

                    });
                }).catch(function (error) {
                    res.status(500).send({message: error.message});
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

        utility.createAccount(username, passphrase).then(function (accountAddress) {
            web3.eth.getAccounts(function (err, accounts) {
                var masterAccount = accounts[0];

                createContract(first_name, last_name, accountAddress, masterAccount, function (err, contract) {
                    if (!err) {
                        console.log("Created contract with address " + contract.address + " for account " + accountAddress);

                        utility.addFundsFromMaster(accountAddress, 10).then(function (amount) {
                            console.log("Successfully added funds to account " + accountAddress);

                            utility.addToFile(username, first_name, last_name, accountAddress, contract.address, function () {
                                console.log("Account creation complete");

                                res.send(JSON.stringify({value: "ok"}));
                            });
                        }).catch(function (error) {
                            console.log('Failed to add funds : ', error);
                        });
                    }
                    else {
                        res.status(500).send(JSON.stringify({message: err.message}));
                    }
                });
            });
        }).catch(function (error) {
            res.status(500).send(JSON.stringify({message: error.message}));
        });
    },

    /**
     *
     * @param res
     */
    getAllAccounts: function (res) {
        utility.getUserAccounts(function (err, result) {
            if (err) {
                res.status(500).send({message: err.message});
            }
            else {
                res.send(result);
            }
        });
    },

    /**
     * Get all account token balances
     *
     * @param res
     */
    getBalances: function (res) {

        utility.getTokenBalances().then(function (result) {
            res.send(JSON.stringify(result));
        });
    }
};