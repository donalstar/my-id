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

var attributeTypes = ['ssn', 'dl'];

function contains(arr, obj) {
    return (arr.indexOf(obj) != -1);
}

/**
 *
 * @param username
 * @param requestType
 * @param value
 */
function saveValueToContract(username, requestType, value, res) {
    utility.getAccountInfo(username, function (error, accountInfo) {
        var contract = UserChain.at(accountInfo.contract);

        if (requestType == 'ssn') {
            contract.setSSN(value, {from: accountInfo.account}).then(function (result) {
                console.log("Set location addr - " + value + " : " + result);

                res.send(JSON.stringify({value: "ok"}));
            }).catch(function (e) {
                console.log("updateAttribute ERR " + e);

                res.send(JSON.stringify({value: e}));
            });
        }
        else if (requestType == 'dl') {
            contract.setDL(value, {from: accountInfo.account}).then(function (result) {
                console.log("DL: Set location addr - " + value + " : " + result);

                res.send(JSON.stringify({value: "ok"}));
            }).catch(function (e) {
                console.log("updateAttribute ERR " + e);

                res.send(JSON.stringify({value: e}));
            });
        }
    });

}

module.exports = {

    /**
     *
     * @param username
     * @param requestType
     * @param values
     * @param res
     */
    updateAttribute: function (username, requestType, values, res) {
        console.log("Update: request type " + requestType);

        if (contains(attributeTypes, requestType)) { // valid type
            var attributeValue = values[requestType];

            file_store.storeValue(attributeValue, function (error, location) {
                if (!error) {
                    saveValueToContract(username, requestType, location, res);
                }
                else {
                    console.log('Fail: ', error);
                }
            });
        }
        else {
            var message = "Unsupported attribute type " + requestType;

            console.log(message);

            res.status(500).send(JSON.stringify({message: message}));
        }
    }
};

