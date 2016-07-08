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
     * Get SSN
     *
     * @param username
     * @param res
     */
    getSSN: function (username, res) {

        utility.getAccountInfo(username, function (error, accountInfo) {
            console.log("SSN - Got acc info -- contract = " + accountInfo.contract);

            var contract = UserChain.at(accountInfo.contract);

            contract.getSSN.call({from: accountInfo.account}).then(function (value) {

                if (value && value != 0) {
                    file_store.readFromFile(value, function (error, data) {
                        if (!error) {
                            console.log('FROM IPFS --- ' + data);

                            res.send(JSON.stringify({value: data}));
                        }
                        else {
                            console.log('getSSN Fail: ', error);
                        }
                    });
                }
                else {
                    console.log("getSSN : SSN value not set");
                }
            }).catch(function (e) {
                console.log("ERR " + e);
            });
        });
    },

    /**
     *
     * @param username
     * @param value
     * @param res
     */
    updateSSN: function (username, value, res) {
        utility.getAccountInfo(username, function (error, accountInfo) {
            var contract = UserChain.at(accountInfo.contract);

            console.log("ADD SSN VALUE " + value);

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