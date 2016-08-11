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
 * @returns {Promise}
 */
function getAccountInfo(accountInfo, passphrase, contract, balance) {

    return new Promise(
        function (resolve, reject) {

            var logged_in = (passphrase == 'undefined' || passphrase == null);

            console.log("account unlock required: " + !logged_in);

            // need to check if account is unlocked
            if (!logged_in) {
                utility.unlockAccount(accountInfo.account, passphrase).then(function (result) {
                    console.log("unlockAccount " + accountInfo.account + " - done: success " + result);

                    return getAccountData(accountInfo, contract, balance);
                }).then(function (result) {
                    resolve(result);
                }).catch(function (error) {
                    reject(error);
                });
            }
            else {
                // assume account is unlocked already
                getAccountData(accountInfo, contract, balance).then(function (result) {
                    resolve(result);
                }).catch(function (error) {
                    reject(error);
                });
            }
        }
    );
}

/**
 *
 * @param accountInfo
 * @returns {Promise}
 */
function topUpAccount(accountInfo) {

    return new Promise(
        function (resolve, reject) {

            try {
                var balance = web3.fromWei(web3.eth.getBalance(accountInfo.account), 'finney');

                console.log("account " + accountInfo.account + " : balance (finney): " + balance);

                if (balance < 5) {
                    console.log("Account Balance too low - top up...");

                    var initialAccountBalance = 20;

                    utility.addFundsFromMaster(accountInfo.account, initialAccountBalance).then(function (amount) {
                        resolve(balance);
                    }).catch(function (error) {
                        reject(error);
                    });
                }
                else {
                    resolve(balance);
                }
            } catch (e) {
                reject(e);
            }

        }
    );
}

/**
 *
 * @param accountInfo
 * @param contract
 * @param balance
 * @returns {Promise}
 */
function getAccountData(accountInfo, contract, balance) {

    return new Promise(
        function (resolve, reject) {
            contract.the_name.call().then(function (the_name) {
                attributesHandler.getAttributes(accountInfo, function (error, attributes) {

                    if (!error) {
                        var profile = getDefaultProfile();

                        if (attributes != null) {
                            profile = JSON.parse(attributes);
                        }

                        var result = {
                            result: true,
                            balance: balance,
                            first_name: the_name[0],
                            last_name: the_name[1],
                            profile: profile,
                            error: error
                        };

                        resolve(result);
                    }
                    else {
                        reject(error);
                    }
                });
            });
        }
    );
}

function getDefaultProfile() {
    var profile = [];

    var attribute_types = utility.getAttributeTypes();

    // for (index in attribute_types) {
    //     var type = attribute_types[index];
    //
    //     profile.push({name: type, value: "", access: 0});
    // }

    //profile.push({name: 'ssn', value: "", access: 0});

    return profile;
}

/**
 *
 * @param res
 * @param message
 */
function sendErrorResponse(res, message) {
    console.log("sendErrorResponse - " + message);

    res.status(500).send(JSON.stringify(
        {
            message: message
        }));
}

module.exports = {

    /**
     *
     * @param session
     * @param username
     * @param passphrase
     * @param res
     */
    getAccount: function (session, username, passphrase, res) {

        console.log("getAccount - " + username);

        utility.getAccountInfo(username, function (error, accountInfo) {
            if (accountInfo) {
                var contract = IdStore.at(accountInfo.contract);

                topUpAccount(accountInfo).then(function (balance) {
                    return getAccountInfo(accountInfo, passphrase, contract, balance);
                }).then(function (result) {
                    session.logged_in = true;
                    session.username = username;
                    
                    res.send(JSON.stringify(result));
                }).catch(function (error) {
                    console.log("ERROR " + error);

                    sendErrorResponse(res, error.message);
                });
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
                            console.log("requestData - success " + result.data);

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
                            console.log("requestData - error " + err);
                            sendErrorResponse(res, err.message);
                        }

                    });
                }).catch(function (error) {
                    sendErrorResponse(res, error.message);
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

                            return utility.addToFile(username, first_name, last_name, accountAddress, contract.address);
                        }).then(function () {

                            res.send(JSON.stringify({value: "ok"}));
                        }).catch(function (error) {
                            console.log('Failed to add funds : ', error);
                        });
                    }
                    else {
                        sendErrorResponse(res, err.message);
                    }
                });
            });
        }).catch(function (error) {
            sendErrorResponse(res, error.message);
        });
    },

    /**
     *
     * @param res
     */
    getAllAccounts: function (res) {
        utility.getUserAccounts().then(function (result) {
            res.send(result);
        }).catch(function (error) {
            sendErrorResponse(res, error.message);
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