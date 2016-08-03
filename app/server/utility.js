var fs = require('fs');

var rpc = require('json-rpc2');
var config = require('./config.js');
var client = rpc.Client.$create(config.server_port, config.server_host);
var Web3 = require('web3');
var web3 = new Web3();
var provider = new web3.providers.HttpProvider();
web3.setProvider(provider);

var Pudding = require("ether-pudding");
Pudding.setWeb3(web3);

var Coin = require("../contracts/Coin.sol.js");
Coin.load(Pudding);

var accountsFile = "../data/accounts.json";
var customersFile = "../data/customers.json";

var attributes = require('../data/attributes.js');

/**
 *
 * @param accounts
 * @param index
 * @param result
 * @param callback
 */
function getNextToken(accounts, index, result, callback) {
    if (index < accounts.length) {
        self.getTokens(accounts[index].account).then(function (tokens) {
            var token_value = {};

            token_value.account = accounts[index];
            token_value.tokens = tokens;

            result.push(token_value);

            if (index < accounts.length) {
                getNextToken(accounts, index + 1, result, callback);
            }
        });
    }
    else {
        callback();
    }

}

/**
 *
 * @param filename
 * @param value
 * @returns {Promise}
 */
function addValueToFile(filename, value) {

    return new Promise(
        function (resolve, reject) {
            fs.readFile(filename, 'utf8', function (err, data) {
                if (!err) {
                    var result = JSON.parse(data);

                    result.push(value);

                    fs.writeFile(filename, JSON.stringify(result), function (err) {
                        if (!err) {
                            console.log("The file was saved!");

                            resolve();
                        }
                        else {
                            reject(err);
                        }
                    });
                }
                else {
                    reject(err);
                }
            });
        }
    );
}

var self = module.exports = {

    /**
     *
     * @param username
     * @param passphrase
     * @returns {Promise}
     */
    createAccount: function (username, passphrase) {
        console.log("createAccount - username " + username + " passphrase " + passphrase);

        return new Promise(
            function (resolve, reject) {
                client.call("personal_newAccount", [passphrase], function (err, accountAddress) {
                    if (!err) {
                        resolve(accountAddress);
                    }
                    else {
                        reject(err);
                    }
                });
            }
        );
    },


    /**
     * Unlock account
     *
     * @param address
     * @param passphrase
     * @returns {Promise}
     */
    unlockAccount: function (address, passphrase) {
        return new Promise(
            function (resolve, reject) {
                console.log("unlock account " + address + " PP " + passphrase);

                console.log("Use client " + client + " " + client.host + " " + client.port);

                client.call("personal_unlockAccount", [address, passphrase, config.account_unlock_duration],
                    function (err, result) {
                        if (!err) {
                            resolve(result);
                        }
                        else {
                            console.log("failed to unlock account: " + address + " : " + err);

                            reject(err);
                        }
                    });
            }
        );
    },

    /**
     *
     * @param username
     * @param callback
     */
    getAccountInfo: function (username, callback) {
        self.getAccounts(accountsFile).then(function (result) {
            var account;

            for (index in result) {

                if (username == result[index].username) {
                    console.log("checked accounts file - username " + username + " valid");
                    account = result[index];
                    break;
                }
            }

            callback(null, account);
        }).catch(function (error) {
            callback(error, null);
        });
    },

    /**
     *
     * @param username
     * @returns {Promise}
     */
    getCustomerInfo: function (username) {

        return new Promise(
            function (resolve, reject) {
                self.getAccounts(accountsFile).then(function (result) {
                    var account;

                    for (index in result) {
                        if (username == result[index].username) {
                            account = result[index];
                            break;
                        }
                    }

                    resolve(account);
                }).catch(function (error) {
                    reject(error);
                });
            }
        );
    },

    /**
     *
     * @returns {*|Promise}
     */
    getUserAccounts: function () {
        return self.getAccounts(accountsFile);
    },

    /**
     *
     * @param fileName
     * @returns {Promise}
     */
    getAccounts: function (fileName) {

        return new Promise(
            function (resolve, reject) {
                var result;

                fs.readFile(fileName, 'utf8', function (err, data) {
                    if (!err) {
                        result = JSON.parse(data);

                        resolve(result);
                    }
                    else {
                        reject(err);
                    }
                });
            }
        );
    },

    /**
     *
     * @param account
     * @returns {Promise}
     */
    getTokens: function (account) {

        return new Promise(
            function (resolve, reject) {
                var contract = Coin.at(config.coin_bank);

                contract.getBalance.call(account).then(function (balance) {
                    resolve(balance);
                });
            }
        );
    },

    /**
     *
     * @returns {Promise}
     */
    getTokenBalances: function () {

        return new Promise(
            function (resolve, reject) {

                self.getUserAccounts().then(function (accounts) {
                    var result = [];

                    getNextToken(accounts, 0, result, function () {
                        resolve(result);
                    });
                }).catch(function (error) {
                    reject(error);
                });
            }
        );
    },

    /**
     *
     * @param account
     * @returns {Promise}
     */
    buyTokens: function (account) {

        return new Promise(
            function (resolve, reject) {
                var addr = config.coin_bank;

                var contract = Coin.at(addr);

                var block = web3.eth.getBlock('latest').number;

                var event = contract.BuyTokens();

                event.watch(function (error, result) {
                    if (result.blockNumber > block) {
                        if (!error) {
                            console.log(" : BUY PRICE (finney) " + result.args.buyPrice_finney +
                                " Msg Value (finney): " + result.args.msgValue_finney
                                + " Purchased Tokens: " + result.args.tokens);

                            event.stopWatching();
                        }
                    }
                });

                var finney = 1000000000000000;
                var work_balance = 10 * finney;

                var balance = web3.eth.getBalance(account);

                contract.buy({from: account, value: balance - work_balance}).then(function (amount) {
                    console.log("Bought: " + amount);

                    resolve(amount);
                }).catch(function (error) {
                    console.log("Got error " + error);

                    reject(error);
                });
            }
        );
    },

    /**
     *
     * @param to_address
     * @param amount
     * @returns {Promise}
     */
    addFundsFromMaster: function (to_address, amount) {
        return new Promise(
            function (resolve, reject) {
                web3.eth.getAccounts(function (err, accounts) {
                    if (!err) {
                        var masterAccount = accounts[0];

                        self.addFunds(masterAccount, to_address, amount).then(function () {
                            resolve(amount);
                        });
                    }
                    else {
                        reject(err);
                    }
                });
            }
        );
    },

    /**
     *
     * @param from_address
     * @param to_address
     * @param amount
     */
    addFunds: function (from_address, to_address, amount) {

        return new Promise(
            function (resolve, reject) {
                var quantity = web3.toWei(amount, "finney");

                var transaction = web3.eth.sendTransaction({
                    from: from_address,
                    to: to_address,
                    value: quantity,
                    gas: 3000000
                });

                console.log("CREATED TXN " + transaction);

                // TODO: How to handle when transaction is mined
                // For now, wait for 1st pending transaction

                var filter = web3.eth.filter('pending');

                filter.watch(function (error, result) {
                    var balance = web3.eth.getBalance(to_address);

                    if (balance > 0) {
                        console.log("Sent funds to " + to_address);

                        filter.stopWatching();

                        resolve();
                    }
                });
            }
        );
    },

    /**
     *
     * @param username
     * @param first_name
     * @param last_name
     * @param accountAddress
     * @param contractAddress
     */
    addToFile: function (username, first_name, last_name, accountAddress, contractAddress) {

        var account =
        {
            username: username,
            first_name: first_name,
            last_name: last_name,
            account: accountAddress,
            contract: contractAddress
        };

        addValueToFile(accountsFile, account);
    },

    /**
     *
     * @param username
     * @param first_name
     * @param last_name
     * @param accountAddress
     * @returns {Promise}
     */
    addToCustomerFile: function (username, first_name, last_name, accountAddress) {

        var customer = {
            username: username,
            first_name: first_name,
            last_name: last_name,
            account: accountAddress
        };

        addValueToFile(customersFile, customer);
    },

    logTokenTransfer: function () {
        var contract = Coin.at(config.coin_bank);

        var event = contract.TransferTokens();

        event.watch(function (error, result) {

            if (!error) {
                console.log("Transfer tokens: from " + result.args.from +
                    " To: " + result.args.to
                    + " Value: " + result.args.value);
            }
        });
    },

    listenOnTokenTransfer: function () {

        return new Promise(
            function (resolve, reject) {
                var contract = Coin.at(config.coin_bank);

                var event = contract.TransferTokens();

                event.watch(function (error, result) {

                    event.stopWatching();

                    if (!error) {
                        resolve(result.args);
                    }
                    else {
                        reject(error);
                    }
                });
            }
        );
    },

    getAttributeTypes: function () {
        var types = [];

        var value_attributes = attributes.getValueAttributes();

        for (index in value_attributes) {
            var value = value_attributes[index];

            types.push(value.name);
        }

        return types;
    }
};

