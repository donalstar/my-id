var account = require('./account-handler.js');

var Web3 = require('web3');
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
    app.get('/api/account/:key/:password', function (req, response) {
        console.log("Get account " + req.params.key);
        
        account.getAccount(req.params.key, req.params.password, response);
    });
    
    app.post('/api/account', function (req, response) {
       account.createAccount(req.body.text, response);
    });

    // application -------------------------------------------------------------
    app.get('*', function (req, res) {
        console.log("send to " + __dirname + '/public/index.html');
        res.sendFile(__dirname + '/public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
    });


    
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