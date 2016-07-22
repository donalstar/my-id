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
                client.call("personal_unlockAccount", [address, passphrase, config.account_unlock_duration],
                    function (err, result) {
                        if (!err) {
                            console.log("Unlocked account: " + address);
                            resolve(result);
                        }
                        else {
                            console.log("Failed to unlock account: " + address);

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
        self.getAccounts(accountsFile, function (err, result) {
            if (err) {
                callback(err, null);
            }

            var account;

            for (index in result) {

                if (username == result[index].username) {
                    console.log("matched username! - contract = " + result[index].contract);
                    account = result[index];
                    break;
                }
            }

            callback(null, account);

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
                self.getAccounts(customersFile, function (err, result) {
                    if (err) {
                        reject(err);
                    }

                    var account;

                    for (index in result) {

                        if (username == result[index].username) {
                            account = result[index];
                            break;
                        }
                    }

                    resolve(account);
                });
            }
        );
    },

    /**
     *
     * @param callback
     */
    getUserAccounts: function (callback) {
        self.getAccounts(accountsFile, callback);
    },

    /**
     *
     * @param fileName
     * @param callback
     */
    getAccounts: function (fileName, callback) {
        var result;

        fs.readFile(fileName, 'utf8', function (err, data) {
            if (err) {
                callback(err, null);
            }

            result = JSON.parse(data);

            callback(null, result);
        });
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
                var work_balance = 5 * finney;

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

                        self.addFunds(masterAccount, to_address, amount, function () {
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
     * @param callback
     */
    addFunds: function (from_address, to_address, amount, callback) {
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

                callback();
            }

        });
    },

    /**
     *
     * @param username
     * @param first_name
     * @param last_name
     * @param accountAddress
     * @param contractAddress
     * @param callback
     */
    addToFile: function (username, first_name, last_name, accountAddress, contractAddress, callback) {
        var result;

        fs.readFile(accountsFile, 'utf8', function (err, data) {
            if (err) throw err;
            result = JSON.parse(data);

            result.push({
                username: username,
                first_name: first_name,
                last_name: last_name,
                account: accountAddress,
                contract: contractAddress
            });

            fs.writeFile(accountsFile, JSON.stringify(result), function (err) {
                if (err) {
                    return console.log(err);
                }

                console.log("The file was saved!");

                callback();
            });
        });
    }
    ,

    /**
     *
     * @param username
     * @param first_name
     * @param last_name
     * @param accountAddress
     * @param callback
     */
    addToCustomerFile: function (username, first_name, last_name, accountAddress, callback) {
        var result;

        fs.readFile(customersFile, 'utf8', function (err, data) {
            if (err) throw err;
            result = JSON.parse(data);

            result.push({
                username: username,
                first_name: first_name,
                last_name: last_name,
                account: accountAddress
            });

            fs.writeFile(customersFile, JSON.stringify(result), function (err) {
                if (err) {
                    return console.log(err);
                }

                console.log("The file was saved!");

                callback();
            });
        });
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
    }
};

