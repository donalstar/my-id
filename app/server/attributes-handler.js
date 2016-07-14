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

function saveAttributesLocationToContract(username, location, callback) {
    utility.getAccountInfo(username, function (error, accountInfo) {
        var contract = UserChain.at(accountInfo.contract);

        contract.setAttributes(location, {from: accountInfo.account}).then(function (result) {
            console.log("Set location addr - " + location + " : " + result);

            var balance = web3.fromWei(web3.eth.getBalance(accountInfo.account), 'finney');

            callback(null, balance);
        }).catch(function (e) {
            console.log("updateAttributes ERR " + e);

            callback(e, null);
        });
    });
}

module.exports = {

    getAttributes: function (accountInfo, callback) {
        var contract = UserChain.at(accountInfo.contract);

        contract.attributes.call().then(
            function (attributes_location) {
                console.log("Got Attribs Loc: " + attributes_location);

                if (attributes_location != "0") {
                    file_store.readFromFile(attributes_location, function (error, data) {
                        callback(null, data);
                    });
                }
                else {
                    callback(null, null);
                }
            }
        );
    },

    /**
     *
     * @param username
     * @param attributes
     * @param res
     */
    saveAttributes: function (username, attributes, res) {
        var value = JSON.stringify(attributes);
        
        file_store.storeValue(value, function (error, location) {
            if (!error) {
                saveAttributesLocationToContract(username, location, function (error, result) {
                    if (!error) {
                        res.send(JSON.stringify({value: "ok", balance: result}));
                    }
                    else {
                        res.status(500).send({message: error.message});
                    }
                });
            }
            else {
                res.status(500).send({message: error.message});
            }
        });
    }
};

