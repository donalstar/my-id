'use strict'

var lightwallet = require('eth-lightwallet');

console.log("add.js");

var Web3 = require('web3');
var Pudding = require("ether-pudding");

var Greeter = require("./contracts/Greeter.sol.js");


var UserChain = require("./contracts/UserChain.sol.js");
// var ipfsAPI = require('ipfs-api');
//
// var ipfs = ipfsAPI({host: 'localhost', port: '5001', procotol: 'http'});

var web3 = new Web3();

var HookedWeb3Provider = require("hooked-web3-provider");

var provider = new web3.providers.HttpProvider();

web3.setProvider(provider);

var rpc = require('json-rpc2');
var client = rpc.Client.$create(8545, "localhost");

client.call("personal_newAccount", ["password"], function(err,result) {
    console.log("Created acc " + result + " err " + err);

    web3.eth.getAccounts(function (err, accs) {
        console.log("personalAccounts " + accs);
    });

    client.call("personal_unlockAccount", ["password"], function(err,result) {
        console.log("yay")


    });

     // web3.personal.unlockAccount(result, "password", 2);
     // console.log("yay")
});



// var seed = lightwallet.keystore.generateRandomSeed();
//
// lightwallet.keystore.deriveKeyFromPassword('mypassword', function (err, pwDerivedKey) {
//
//     console.log("dervied key " + pwDerivedKey);
//
//     var keystore = new lightwallet.keystore(seed, pwDerivedKey)
//     keystore.generateNewAddress(pwDerivedKey)
//
//     var sendingAddr = keystore.getAddresses()[0]
//
//     console.log("Sending addr " + sendingAddr);
//
//
//     var web3Provider = new HookedWeb3Provider({
//         host: "http://localhost:8545",
//         transaction_signer: keystore
//     });
//
//     web3.setProvider(web3Provider);
//
//     web3.eth.getAccounts(function (err, accs) {
//         console.log("personalAccounts " + accs);
//     });
//
//
// });


//
// web3.setProvider(provider);
//
// Pudding.setWeb3(web3);
//
// UserChain.load(Pudding);
//
// var userChain = UserChain.deployed();
// // var greeter = Greeter.deployed();
//
// var personalAccounts = web3.personal.getAccounts();
//
// web3.eth.getAccounts(function (err, accs) {
//
//     // greeter.greet.call({from: accs[0]}).then(function (value) {
//     //     console.log("value " + value);
//     // });
//
//
//     userChain.getSSN.call({from: accs[0]}).then(function (value) {
//         //  console.log("SSN location " + value);
//
//         console.log("value " + value);
//
//         if (value && value != 0) {
//             ipfs.object.get([value])
//                 .then(function (result) {
//                     console.log('FROM IPFS --- ' + result.data);
//
//                     res.send(JSON.stringify({value: result.data}));
//                 })
//                 .catch(function (err) {
//                     console.log('getSSN Fail: ', err)
//                 })
//
//         }
//         else {
//             console.log("value not set");
//         }
//
//     });
// });

