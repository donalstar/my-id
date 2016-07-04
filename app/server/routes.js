var Web3 = require('web3');
var rpc = require('json-rpc2');
var Pudding = require("ether-pudding");
var UserChain = require("../contracts/UserChain.sol.js");
var ipfsAPI = require('ipfs-api');


var ipfs = ipfsAPI({host: 'localhost', port: '5001', procotol: 'http'});

var web3 = new Web3();

var provider = new web3.providers.HttpProvider();

web3.setProvider(provider);

Pudding.setWeb3(web3);

UserChain.load(Pudding);

var userChain = UserChain.deployed();

var client = rpc.Client.$create(8545, "localhost");

console.log("ABI " + UserChain.abi);
console.log("binary " + UserChain.binary);

module.exports = function (app) {

    /**
     * SSN
     */

    app.post('/api/ssn', function (req, response) {

        web3.eth.getAccounts(function (err, accs) {

            var updatedValue = req.body.text;

            console.log("SET VALUE " + updatedValue);

            userChain.setValue(updatedValue, {from: accs[0]}).then(function (value) {
                console.log("update succeeded");

                response.send({result: "success"});

                addSSN(updatedValue, accs);


            }).catch(function (e) {
                console.log("ERR " + e);
            });
        });
    });

    app.get('/api/ssn/:id', function (req, res) {

        console.log("Get ssn");

        web3.eth.getAccounts(function (err, accs) {
            getSSN(err, accs, res);
        });

    });


    /**
     * Account
     */
    app.post('/api/account', function (req, response) {
        createAccount(req.body.text, response);
    });

    // application -------------------------------------------------------------
    app.get('*', function (req, res) {
        console.log("send to " + __dirname + '/public/index.html');
        res.sendFile(__dirname + '/public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
    });

    /**
     * Create Account
     *
     * @param passphrase
     */
    function createAccount(passphrase, res) {
        console.log("createAccount - passphrase " + passphrase);

        client.call("personal_newAccount", [passphrase], function (err, result) {
            console.log("Created acc " + result + " err " + err);

            web3.eth.getAccounts(function (err, accs) {
                unlockAccount(accs[0], passphrase, function () {
                    createContract(accs[0]);

                    res.send(JSON.stringify({value: result}));
                });
            });


        });

    }

    //
    // function addFunds(address, callback) {
    //     web3.eth.getAccounts(function (err, accs) {
    //         var amount = web3.toWei(5, "finney"); // decide how much to contribute
    //
    //
    //         var transaction = web3.eth.sendTransaction({
    //             from: accs[0],
    //             to: address,
    //             value: amount,
    //             gas: 3000000
    //         });
    //
    //         console.log("Sent funds to " + address); // "0x7f9fade1c0d57a7af66ab4ead7c2eb7b11a91385"
    //
    //
    //         console.log("NEW Balance: " + web3.eth.getBalance(address));
    //
    //         web3.eth.getTransactionReceipt(transaction, function (receipt) {
    //             console.log("TXN receipt " + receipt);
    //
    //
    //             callback();
    //         });
    //
    //     });
    //
    //
    // }


    function createContract(sendingAddr) {

        code = UserChain.binary;

        abi = UserChain.abi;

        var contract = web3.eth.contract(abi);

        var gasEstimate = web3.eth.estimateGas({
            to: sendingAddr,
            data: code
        });
        console.log("Gas estimate " + gasEstimate + " for sender " + sendingAddr);


        // TODO: How to correctly set gas 
        var gas = gasEstimate * 10;

        contract.new({
            from: sendingAddr,
            data: code,
            gas: gas
        }, function (e, contract) {
            if (!e) {

                if (!contract.address) {
                    console.log("Contract transaction send: TransactionHash: " + contract.transactionHash + " waiting to be mined...");

                } else {
                    console.log("Contract mined! Address: " + contract.address);
                    console.log(contract);

                    console.log("GAS PRICE " + web3.eth.gasPrice);
                    console.log("Balance: " + web3.eth.getBalance(sendingAddr));
                }

            }
            else {
                console.log("Error " + e);
                console.log("GAS PRICE " + web3.eth.gasPrice);
                console.log("Balance: " + web3.eth.getBalance(sendingAddr));
            }
        })


    }

    /**
     * Unlock account
     *
     * @param passphrase
     * @param callback
     */
    function unlockAccount(address, passphrase, callback) {


        client.call("personal_unlockAccount", [address, passphrase, 30], function (err, result) {
            console.log("account " + address + " unlocked");

            callback();
        });
    }

    function addSSN(value, accs) {

        console.log("ADD SSN VALUE " + value);

        ipfs.files.add([new Buffer(value)], function (err, res) {
            if (err || !res) return console.log(err);

            for (let i = 0; i < res.length; i++) {
                console.log(res[i]);

                ipfs.object.get([res[i].path])
                    .then(function (result) {
                        console.log('READ FILE ' + i + ': ', result.data);

                        if (i == 0) {
                            userChain.setSSN(res[i].path, {from: accs[0]}).then(function (value) {
                                console.log("Set location addr - " + res[i].path + " : " + value);
                            }).catch(function (e) {
                                console.log("ERR " + e);
                            });
                        }
                    })
                    .catch(function (err) {
                        console.log('Fail: ', err)
                    })
            }

        })
    }


    function getSSN(err, accs, res) {
        console.log("getSSN");

        if (err != null) {
            console.log("There was an error fetching your accounts.");
            return;
        }

        if (accs.length == 0) {
            console.log("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
            return;
        }

        checkValues();

        console.log("Owner " + userChain.organizer.call());

        console.log("Now get SSN");

        userChain.getSSN.call({from: accs[0]}).then(function (value) {

            if (value && value != 0) {
                ipfs.object.get([value])
                    .then(function (result) {
                        console.log('FROM IPFS --- ' + result.data);

                        res.send(JSON.stringify({value: result.data}));
                    })
                    .catch(function (err) {
                        console.log('getSSN Fail: ', err)
                    })

            }
            else {
                console.log("getSSN : SSN value not set");
            }
        }).catch(function (e) {
            console.log("ERR " + e);
        });


    }

    function checkValues() {
        userChain.organizer.call().then(
            function (organizer) {
                console.log("Got organizer " + organizer);
            });
    }
};