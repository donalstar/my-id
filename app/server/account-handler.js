var Web3 = require('web3');
var rpc = require('json-rpc2');
var UserChain = require("../contracts/UserChain.sol.js");
var Pudding = require("ether-pudding");
var client = rpc.Client.$create(8545, "localhost");
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
                    
                    addFunds(accountAddress, function () {
                        if (!err) {
                            console.log("Successfully added funds to account " + accountAddress);
                            
                            setOwner(masterAccount, accountAddress, contract, function (error) {
                                console.log("After setOwner: error " + error);

                                utility.addToFile(username, accountAddress, contract.address, function () {
                                    console.log("Account creation complete");
                                    
                                    res.send(JSON.stringify({value: "ok"}));
                                });
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