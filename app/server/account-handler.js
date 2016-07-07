var Web3 = require('web3');
var rpc = require('json-rpc2');
var UserChain = require("../contracts/UserChain.sol.js");
var Pudding = require("ether-pudding");
var fs = require('fs');
var client = rpc.Client.$create(8545, "localhost");
var web3 = new Web3();
var provider = new web3.providers.HttpProvider();

var accountsFile = "../data/accounts.json";

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
 * @param masterAccount
 */
function createContract(accountAddress, masterAccount, callback) {

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

    contract.new({
        from: masterAccount,
        data: code,
        gas: gas
    }, function (e, contract) {
        if (!e) {

            if (!contract.address) {
                console.log("Contract transaction send: TransactionHash: " + contract.transactionHash + " waiting to be mined...");

            } else {
                console.log("Contract mined! Address: " + contract.address);

                console.log("GAS PRICE " + web3.eth.gasPrice);
                console.log("Balance: " + web3.eth.getBalance(masterAccount));

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

function getAccountInfo(username, callback) {
    var result;

    fs.readFile(accountsFile, 'utf8', function (err, data) {
        if (err) {
            callback(err, null);
        }

        result = JSON.parse(data);

        var account;

        for (index in result) {
            console.log("Username " + result[index].username);

            if (username == result[index].username) {
                console.log("matched username!");
                account = result[index];
                break;
            }
        }

        callback(null, account);
    });
}

/**
 *
 * @param username
 * @param accountAddress
 * @param contractAddress
 * @param callback
 */
function addToFile(username, accountAddress, contractAddress, callback) {

    var result;

    fs.readFile(accountsFile, 'utf8', function (err, data) {
        if (err) throw err;
        result = JSON.parse(data);

        result.push({username: username, account: accountAddress, contract: contractAddress});

        fs.writeFile(accountsFile, JSON.stringify(result), function (err) {
            if (err) {
                return console.log(err);
            }

            console.log("The file was saved!");
        });
    });
}

/**
 *
 * @param masterAccount
 * @param accountAddress
 * @param contract
 * @param callback
 */
function setOwner(masterAccount, accountAddress, contract, callback) {
    console.log("Set owner...");

    var userChain = UserChain.at(contract.address);

    userChain.setOwner(accountAddress, {from: masterAccount}).then(function (value) {

        console.log("setOwner to " + accountAddress);

        userChain.setContractOwner(accountAddress, {from: masterAccount}).then(function (value) {
            console.log("setContractOwner " + accountAddress);

            callback(null);
        }).catch(function (e) {
            console.log("ERR " + e);

            callback(null);
        });

    }).catch(function (e) {
        console.log("ERR " + e);

        callback(null);
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

        getAccountInfo(username, function (error, accountInfo) {

            if (accountInfo) {


                var contract = UserChain.at(accountInfo.contract);

                // myContractInstance.myMethod.call(param1 [, param2, ...] [, transactionObject] [, defaultBlock] [, callback]);
                //

                contract.owner.call().then(
                    function (owner) {
                        console.log("Got owner_address " + owner);
                    });

                contract.contract_owner.call().then(
                    function (a2) {
                        console.log("Got a2 " + a2);
                    });


                contract.ssn_address.call().then(
                    function (ssn_address) {
                        console.log("Got ssn_address " + ssn_address);
                    });

                unlockAccount(accountInfo.account, passphrase, function (err, result) {
                    console.log("unlockAccount - done: success " + result);

                    res.send(JSON.stringify({result: result, error: err}));
                });
            }
        });
    },

    /**
     * Create Account
     *
     * @param username
     * @param passphrase
     * @param res
     */
    createAccount: function (username, passphrase, res) {
        console.log("createAccount - username " + username + " passphrase " + passphrase);

        client.call("personal_newAccount", [passphrase], function (err, accountAddress) {

            web3.eth.getAccounts(function (err, accounts) {
                var masterAccount = accounts[0];

                createContract(accountAddress, masterAccount, function (err, contract) {
                    console.log("Created contract with address " + contract + " for account " + accountAddress);

                    setOwner(masterAccount, accountAddress, contract, function (error) {
                        console.log("After setOwner: error " + error);

                        addToFile(username, accountAddress, contract.address, function () {
                            res.send(JSON.stringify({value: result}));
                        });
                    });

                });


            });
        });
    }
};