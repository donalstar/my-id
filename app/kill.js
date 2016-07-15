'use strict'
var Web3 = require('web3');
var web3 = new Web3();
var fs = require('fs');
var Pudding = require("ether-pudding");
var accountsFile = "../data/accounts.json";
var UserChain = require("./contracts/UserChain.sol.js");

var provider = new web3.providers.HttpProvider();

web3.setProvider(provider);
Pudding.setWeb3(web3);
UserChain.load(Pudding);

var rpc = require('json-rpc2');
var config = require('./server/config.js');
var client = rpc.Client.$create(config.server_port, config.server_host);


console.log("Kill Contracts \n ------------ \n");

var owner = '0x6337ac72daa8566fad104f185be41b4200063e6d';

unlockAccount(owner, 'eth1', function (err, result) {
    if (!err) {
        fs.readFile(accountsFile, 'utf8', function (err, data) {
            var result;

            if (err) {
                callback(err, null);
            }

            result = JSON.parse(data);

            for (var index in result) {

                var user = result[index].username;

                if (typeof user != 'undefined') {
                    if (user.startsWith("donal")) {

                        killContract(user, result[index].account, result[index].contract);

                    }
                }
            }
        });
    }
});


function killContract(user, account, contract_location) {
    unlockAccount(account, getPassword(user), function (err, result) {
        if (!err) {
            console.log("Kill contract at " + contract_location);

            var contract = UserChain.at(contract_location);

            contract.destroy({from: account}).then(function (result) {
                console.log("OWNER - " + result);
            }).catch(function (e) {
                console.log("ERR " + e);
            });
        }
        else {
            console.log("Failed to unlock " + account);
        }

    });


}

function getPassword(user) {
    var index = user.substring(5);

    return "test" + index;
}

function unlockAccount(address, passphrase, callback) {

    client.call("personal_unlockAccount", [address, passphrase, 300], function (err, result) {

        callback(err, result);
    });
}
