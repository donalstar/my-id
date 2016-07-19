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

                console.log("Account Balance (finney): " + balance);

                res.send(JSON.stringify(
                    {
                        result: true,
                        balance: balance,
                        first_name: accountInfo.first_name,
                        last_name: accountInfo.last_name,
                        error: error
                    }));
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

        utility.createAccount(username, passphrase, function (err, accountAddress) {
            if (!err) {
                utility.addToCustomerFile(username, first_name, last_name, accountAddress, function () {
                    console.log("Account creation complete");

                    // QUICK TEST -- GET COINS
                    
                    res.send(JSON.stringify({value: "ok"}));
                });
            }
            else {
                res.send(JSON.stringify({error: err}));
            }
        });
    }
};