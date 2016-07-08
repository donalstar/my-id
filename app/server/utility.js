var fs = require('fs');

var accountsFile = "../data/accounts.json";

module.exports = {

    /**
     *
     * @param username
     * @param callback
     */
    getAccountInfo: function (username, callback) {
        var result;

        fs.readFile(accountsFile, 'utf8', function (err, data) {
            if (err) {
                callback(err, null);
            }

            result = JSON.parse(data);

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
     * @param accountAddress
     * @param contractAddress
     * @param callback
     */
    addToFile: function (username, accountAddress, contractAddress, callback) {
        var result;

        fs.readFile(accountsFile, 'utf8', function (err, data) {
            if (err) throw err;
            result = JSON.parse(data);

            result.push({username: username, account: accountAddress, contract: contractAddress});

            fs.writeFile(accountsFile, JSON.stringify(result), function (err) {
                if (err) {
                    return console.log(err);
                }

                console.log("The file was saved!");
                
                callback();
            });
        });
    }
};