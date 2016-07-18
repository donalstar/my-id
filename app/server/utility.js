var fs = require('fs');

var rpc = require('json-rpc2');
var config = require('./config.js');
var client = rpc.Client.$create(config.server_port, config.server_host);
var accountsFile = "../data/accounts.json";
var customersFile = "../data/customers.json";

var self = module.exports = {

    /**
     * Create a new account
     *
     * @param username
     * @param passphrase
     * @param callback
     */
    createAccount: function (username, passphrase, callback) {
        console.log("createAccount - username " + username + " passphrase " + passphrase);

        client.call("personal_newAccount", [passphrase], function (err, accountAddress) {
            callback(err, accountAddress);
        });
    },

    /**
     * Unlock account
     *
     * @param address
     * @param passphrase
     * @param callback
     */
    unlockAccount: function (address, passphrase, callback) {
        client.call("personal_unlockAccount", [address, passphrase, config.account_unlock_duration], function (err, result) {

            callback(err, result);
        });
    },

    /**
     *
     * @param username
     * @param callback
     */
    getAccountInfo: function (username, callback) {
        self.getAccounts(accountsFile, function (err, result) {
            if (err) {
                callback(err, null);
            }

            var account;

            for (index in result) {

                if (username == result[index].username) {
                    console.log("matched username! - contract = " + result[index].contract);
                    account = result[index];
                    break;
                }
            }

            callback(null, account);

        });
    },

    /**
     *
     * @param username
     * @param callback
     */
    getCustomerInfo: function (username, callback) {
        self.getAccounts(customersFile, function (err, result) {
            if (err) {
                callback(err, null);
            }

            var account;

            for (index in result) {

                if (username == result[index].username) {
                    account = result[index];
                    break;
                }
            }

            callback(null, account);

        });
    },

    /**
     *
     * @param callback
     */
    getUserAccounts: function (callback) {
        self.getAccounts(accountsFile, callback);
    },
    
    /**
     *
     * @param fileName
     * @param callback
     */
    getAccounts: function (fileName, callback) {
        var result;

        fs.readFile(fileName, 'utf8', function (err, data) {
            if (err) {
                callback(err, null);
            }

            result = JSON.parse(data);

            callback(null, result);
        });
    },

    /**
     *
     * @param username
     * @param first_name
     * @param last_name
     * @param accountAddress
     * @param contractAddress
     * @param callback
     */
    addToFile: function (username, first_name, last_name, accountAddress, contractAddress, callback) {
        var result;

        fs.readFile(accountsFile, 'utf8', function (err, data) {
            if (err) throw err;
            result = JSON.parse(data);

            result.push({
                username: username,
                first_name: first_name,
                last_name: last_name,
                account: accountAddress,
                contract: contractAddress
            });

            fs.writeFile(accountsFile, JSON.stringify(result), function (err) {
                if (err) {
                    return console.log(err);
                }

                console.log("The file was saved!");

                callback();
            });
        });
    },

    /**
     *
     * @param username
     * @param first_name
     * @param last_name
     * @param accountAddress
     * @param callback
     */
    addToCustomerFile: function (username, first_name, last_name, accountAddress, callback) {
        var result;

        fs.readFile(customersFile, 'utf8', function (err, data) {
            if (err) throw err;
            result = JSON.parse(data);

            result.push({
                username: username,
                first_name: first_name,
                last_name: last_name,
                account: accountAddress
            });

            fs.writeFile(customersFile, JSON.stringify(result), function (err) {
                if (err) {
                    return console.log(err);
                }

                console.log("The file was saved!");

                callback();
            });
        });
    }
};

