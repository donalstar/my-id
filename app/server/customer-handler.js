var config = require('./config.js');
var utility = require('./utility.js');
var Web3 = require('web3');
var web3 = new Web3();

var provider = new web3.providers.HttpProvider();

web3.setProvider(provider);


module.exports = {

    /**
     *
     * @param username
     * @param passphrase
     * @param res
     */
    getAccount: function (username, passphrase, res) {

        var accountInfo;

        utility.getCustomerInfo(username).then(function (result) {
            accountInfo = result;

            return utility.unlockAccount(accountInfo.account, passphrase);
        }).then(function (result) {
            return utility.getTokens(accountInfo.account);
        }).then(function (tokens) {
            var balance = web3.fromWei(web3.eth.getBalance(accountInfo.account), 'finney');

            console.log("Account Balance (finney): " + balance);

            res.send(JSON.stringify(
                {
                    result: true,
                    balance: balance,
                    tokens: tokens,
                    first_name: accountInfo.first_name,
                    last_name: accountInfo.last_name,
                    error: null
                }));
        }).catch(function (error) {
            console.log("Error " + error);

            res.send(JSON.stringify(
                {
                    error: error.message
                }));
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

        var response = null;
        
        // QUICK TEST -- GET COINS (110 finney)
        var initialAccountBalance = 210;

        var accountAddress;

        utility.createAccount(username, passphrase).then(function (result) {
            accountAddress = result;

            return utility.addFundsFromMaster(accountAddress, initialAccountBalance);
        }).then(function (amount) {
            var balance = web3.eth.getBalance(accountAddress);

            console.log("New account balance (finney): " + web3.fromWei(balance, 'finney'));

            return utility.unlockAccount(accountAddress, passphrase);

        }).then(function (result) {
            console.log("unlockAccount " + accountAddress + " - done: success " + result);

            // Buy tokens with $$$
            return utility.buyTokens(accountAddress);

        }).then(function (tokens) {
            return utility.addToCustomerFile(username, first_name, last_name, accountAddress);
        }).then(function () {
            console.log("Account creation complete");

            response = JSON.stringify({value: "ok"});

            res.send(response);
        }).catch(function (error) {
            response = JSON.stringify({error: error});

            res.send(response);
        });


    }
}
;


