'use strict'

var Web3 = require('web3');
var Pudding = require("ether-pudding");

var Greeter = require("./contracts/Greeter.sol.js");


var UserChain = require("./contracts/UserChain.sol.js");
// var ipfsAPI = require('ipfs-api');
//
// var ipfs = ipfsAPI({host: 'localhost', port: '5001', procotol: 'http'});

var web3 = new Web3();

var provider = new web3.providers.HttpProvider();

web3.setProvider(provider);

Pudding.setWeb3(web3);

UserChain.load(Pudding);

var userChain = UserChain.deployed();
// var greeter = Greeter.deployed();

web3.eth.getAccounts(function (err, accs) {

    // greeter.greet.call({from: accs[0]}).then(function (value) {
    //     console.log("value " + value);
    // });


    userChain.getSSN.call({from: accs[0]}).then(function (value) {
        //  console.log("SSN location " + value);

        console.log("value " + value);

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
            console.log("value not set");
        }

    });
});

