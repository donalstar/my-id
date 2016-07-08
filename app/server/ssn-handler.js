var Web3 = require('web3');
var web3 = new Web3();
var UserChain = require("../contracts/UserChain.sol.js");
var Pudding = require("ether-pudding");
var provider = new web3.providers.HttpProvider();
var utility = require('./utility.js');
var file_store = require('./file-store.js');

web3.setProvider(provider);
Pudding.setWeb3(web3);
UserChain.load(Pudding);

module.exports = {


    /**
     *
     * @param username
     * @param value
     * @param res
     */
    updateSSN: function (username, value, res) {
        utility.getAccountInfo(username, function (error, accountInfo) {
            var contract = UserChain.at(accountInfo.contract);

            console.log("ADD SSN VALUE " + value + " using account " + accountInfo.account);

            file_store.storeValue(value, function (error, location) {
                if (!error) {
                    contract.setSSN(location, {from: accountInfo.account}).then(function (value) {
                        console.log("Set location addr - " + location + " : " + value);

                        res.send(JSON.stringify({value: "ok"}));
                    }).catch(function (e) {
                        console.log("ERR " + e);

                        res.send(JSON.stringify({value: e}));
                    });
                }
                else {
                    console.log('Fail: ', error);
                }
            });
        });
    }
};