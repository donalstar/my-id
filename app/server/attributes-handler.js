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

var Coin = require("../contracts/Coin.sol.js");
Coin.load(Pudding);

var config = require('./config.js');

var attributeTypes = ['ssn', 'dl', 'fico'];

function contains(arr, obj) {
    return (arr.indexOf(obj) != -1);
}


/**
 *
 * @param attributeType
 * @returns {number}
 */
function getAttributeId(attributeType) {
    return (attributeTypes.indexOf(attributeType));
}


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

/**
 *
 * @param username
 * @param requestType
 * @param value
 * @param callback
 */
function saveValueToContract(username, requestType, value, callback) {
    utility.getAccountInfo(username, function (error, accountInfo) {
        var contract = UserChain.at(accountInfo.contract);

        contract.setAttrib(requestType, value, {from: accountInfo.account}).then(function (result) {
            console.log("Set location addr - " + value + " : " + result);

            callback(null, result);
        }).catch(function (e) {
            console.log("updateAttribute ERR " + e);

            callback(e, null);
        });
    });
}

/**
 *
 * @param username
 * @param requestType
 * @param attributeValue
 * @param callback
 */
function updateAttribute(username, requestType, attributeValue, callback) {
    console.log("Update: request type " + requestType);

    if (contains(attributeTypes, requestType)) { // valid type

        var attributeType = getAttributeId(requestType);

        file_store.storeValue(attributeValue, function (error, location) {
            if (!error) {
                saveValueToContract(username, attributeType, location, callback);
            }
            else {
                callback(error, null);
            }
        });
    }
    else {
        var message = "Unsupported attribute type " + requestType;

        console.log(message);

        throw message;
    }
}

/**
 *
 * @param attributes
 * @param requestType
 */
function getAttributeValue(attributes, requestType) {
    var value = null;

    for (var i = 0; i < attributes.length; i++) {
        var attribute = attributes[i];

        if (attribute.name == requestType) {
            value = attribute.value;
        }
    }

    return value;
}

module.exports = {


    /**
     *
     * @param accountInfo
     * @param contract_address
     * @param attributeId
     * @param callback
     */
    getAttribute: function (accountInfo, contract_address, attributeId, callback) {
        var contract = UserChain.at(contract_address);

        console.log("Get Attrib: (caller account) " + accountInfo.account);

        var block = web3.eth.getBlock('latest').number;

        var event = contract.GetAttribute();

        event.watch(function (error, result) {
            if (result.blockNumber > block) {
                if (!error) {
                    console.log(" : Bank " + result.args.bank +
                        " Id: " + result.args.id
                        + " Value: " + result.args.attribute);

                 //   event.stopWatching();

                    var attribute_value = result.args.attribute;

                    if (attribute_value != "0") {
                        file_store.readFromFile(attribute_value, function (error, data) {
                            callback(error, data);
                        });
                    }
                    else {
                        callback(null, null);
                    }
                }
            }
        });

        contract.getAttrib(attributeId, {from: accountInfo.account}).then(function (result) {
            console.log("Got Attrib: " + result);
        }).catch(function (error) {
            console.log("Got error " + error);

            callback(null, null);
        });
    },

    getAttributes: function (accountInfo, callback) {
        var contract = UserChain.at(accountInfo.contract);

        // quick test -- get attrib #1

        contract.getAttrib(0, {from: accountInfo.account}).then(function (result) {
            console.log("Got Attrib: " + result);

            file_store.readFromFile(result, function (error, data) {
                console.log("Got Attrib VALUE: " + data);
            });
        });


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
     * @param updatedAttributeType
     * @param attributes
     * @param res
     */
    saveAttributes: function (username, updatedAttributeType, attributes, res) {
        var value = JSON.stringify(attributes);

        var attributeValue = getAttributeValue(attributes, updatedAttributeType);

        updateAttribute(username, updatedAttributeType, attributeValue, function (error, result) {
            if (!error) {
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
            else {
                res.status(500).send({message: error.message});
            }
        });
    }
};

