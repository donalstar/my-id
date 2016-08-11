var Web3 = require('web3');
var web3 = new Web3();
var IdStore = require("../contracts/IdStore.sol.js");
var Pudding = require("ether-pudding");
var provider = new web3.providers.HttpProvider();
var utility = require('./utility.js');
var file_store = require('./file-store.js');
var async = require("async");

web3.setProvider(provider);
Pudding.setWeb3(web3);
IdStore.load(Pudding);

var Coin = require("../contracts/Coin.sol.js");
Coin.load(Pudding);

var config = require('./config.js');

var attributeTypes = utility.getAttributeTypes();


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
        var contract = IdStore.at(accountInfo.contract);

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
        var contract = IdStore.at(accountInfo.contract);

        contract.setAttribute(requestType, value, {from: accountInfo.account}).then(function (result) {
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

var self = module.exports = {

    /**
     *
     * @param accountInfo
     * @param contract_address
     * @param attributeId
     * @param callback
     */
    getAttribute: function (accountInfo, contract_address, attributeId, callback) {
        var contract = IdStore.at(contract_address);

        console.log("Get Attribute: (caller account) " + accountInfo.account);

        var block = web3.eth.getBlock('latest').number;

        var event = contract.GetAttribute();

        var result = {};

        var data_value = "";
        var tokens_value = "";

        async.parallel([

            function (callback) {
                event.watch(function (error, result) {
                    if (result.blockNumber > block) {
                        if (!error) {
                            console.log(" : Bank " + result.args.bank +
                                " Id: " + result.args.id
                                + " Value: " + result.args.attribute);

                            event.stopWatching();

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
            },


            function (callback) {
                utility.listenOnTokenTransfer(function (error, result) {
                    if (!error) {
                        console.log("getAttribute : transfer to: " + result.to + " from: " + result.from
                            + " val: " + result.value);

                        utility.getTokens(accountInfo.account).then(function (tokens) {
                            console.log("got tokens bal (new) " + tokens);

                            callback(error, tokens);
                        })
                    }
                    else {
                        console.log("Error processing token transfer: " + error);

                        callback(error, null);
                    }
                });
            }
        ], function (err, results) {
            result.data = results[0];

            result.tokens = results[1];

            callback(err, result);
        });


        contract.getAttribute(attributeId, {from: accountInfo.account}).then(function (result) {
            console.log("Got Attrib: " + result);
        }).catch(function (error) {
            console.log("Got error " + error);

            callback(null, null);
        });
    },


    getAttributes: function (accountInfo, callback) {
        console.log("get attributes for account " + accountInfo.username);

        var contract = IdStore.at(accountInfo.contract);

        contract.attributes.call().then(
            function (attributes_location) {
                console.log("got attributes location: " + attributes_location);

                if (attributes_location != "") {
                    file_store.readFromFile(attributes_location, function (error, data) {
                        callback(error, data);
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

