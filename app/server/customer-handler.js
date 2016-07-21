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

        utility.getCustomerInfo(username, function (error, accountInfo) {
            if (accountInfo) {
                var balance = web3.fromWei(web3.eth.getBalance(accountInfo.account), 'finney');

                utility.getTokens(accountInfo.account, function (error, tokens) {
                    console.log("Account Balance (finney): " + balance);

                    res.send(JSON.stringify(
                        {
                            result: true,
                            balance: balance,
                            tokens: tokens,
                            first_name: accountInfo.first_name,
                            last_name: accountInfo.last_name,
                            error: error
                        }));
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

        // QUICK TEST -- GET COINS (110 finney)
        var initialAccountBalance = 110;

        utility.createAccount(username, passphrase).then(function (accountAddress) {

            return utility.addFundsFromMaster(accountAddress, initialAccountBalance);
        }).then(function (amount) {
            var balance = web3.eth.getBalance(accountAddress);

            console.log("New account balance (finney): " + web3.fromWei(balance, 'finney'));

            return utility.unlockAccount(username, passphrase);

        }).then(function (result) {
            console.log("unlockAccount " + accountAddress + " - done: success " + result);

            // Buy tokens with $$$
            return utility.buyTokens(accountAddress);

        }).then(function (tokens) {
            utility.addToCustomerFile(username, first_name, last_name, accountAddress, function () {
                console.log("Account creation complete");

                res.send(JSON.stringify({value: "ok"}));
            });
        }).catch(function (error) {
            res.send(JSON.stringify({error: error}));
        });
    }
};


