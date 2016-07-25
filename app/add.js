// 'use strict'
//


var Web3 = require('web3');
var UserChain = require("./contracts/UserChain.sol.js");
var Pudding = require("ether-pudding");
var web3 = new Web3();
var provider = new web3.providers.HttpProvider();

var utility = require('./server/utility.js');

web3.setProvider(provider);

Pudding.setWeb3(web3);

UserChain.load(Pudding);

var Coin = require("./contracts/Coin.sol.js");
Coin.load(Pudding);

console.log("Connect to bank");


var owner = '0x6337ac72daa8566fad104f185be41b4200063e6d';

getUser();

// getBank();

var account = '0xffc87f4f89772b3de2ff5e89657769ad46924865';

utility.getTokens(account, function (error, balance) {
    console.log("ACCOUNT BALANCE balance (tokens) " + balance);
});

function getUser() {
    console.log("Get user");

    var contract_addr = '0xed2800326db27a1923b07e12e408c1e55314904b';
    var contract = UserChain.at(contract_addr);

    contract.the_name.call().then(
        function (the_name) {
            console.log("Contract name " + the_name);
        });
}

function getBank() {
    console.log("Get bank");


    var contract_addr = '0xb257c4fdcb29c72356ed10556226aaacd39328f3';
    var contract = Coin.at(contract_addr);

    contract.name.call().then(
        function (the_name) {
            console.log("BANK name " + the_name);
        });
}


// var async = require("async");
// var fs = require('fs');
//
// var ipfsAPI = require('ipfs-api');
// var ipfs = ipfsAPI({host: 'localhost', port: '5001', procotol: 'http'});
//

//
// var profile = [
//     {name: 'ssn', value: '444', access: 0},
//     {name: 'dl', value: '7655586', access: 1}
// ];
//
// var out = JSON.stringify(profile);
//
//
// ipfs.block.put(new Buffer(out), function (err, res) {
//     if (err || !res) return console.log(err);
//
//     var key = res.Key;
//
//     ipfs.block.get(key)
//         .then(function (result) {
//
//
//             let buff = '';
//
//             result
//                 .on('data', function (data) {
//
//                     buff += data;
//
//                 })
//                 .on('end', function () {
//
//                     console.log("Got data 2 " + buff);
//
//                     var struct = JSON.parse(buff);
//
//                     console.log("JSON");
//                 })
//             ;
//
//         })
//         .catch(function (err) {
//             console.log("ERR " + err);
//
//         })
// })
// ;


// async.map(['index.html','package.json','server.js'], fs.stat, function(err, results){
//     // results is now an array of stats for each file
//     console.log("RES " + results);
// });


// var Web3 = require('web3');
// var Pudding = require("ether-pudding");
//
// var Greeter = require("./contracts/Greeter.sol.js");
//
//
//
// var UserChain = require("./contracts/IdStore.sol.js");
// // var ipfsAPI = require('ipfs-api');
// //
// // var ipfs = ipfsAPI({host: 'localhost', port: '5001', procotol: 'http'});
//
// var web3 = new Web3();
//
// var HookedWeb3Provider = require("hooked-web3-provider");
//
// var provider = new web3.providers.HttpProvider();
//
// web3.setProvider(provider);

// var players = [
//     "Messi",
//     "Ronaldo",
//     "Costa",
//     "Neymar",
//     "Arabi",
//     "Bale",
//     "Toquero"
// ];
//
// var teams = [
//     "A",
//     "C",
//     "g",
//     "H",
//     "X",
//     "A",
//     "S"
// ];
//
// var result = [];
//
// for (var i=0; i<players.length; i++) {
//     result.push({name: players[i], team: teams[i]});
// }
//

// var file = "../data/accounts.json";

// fs.writeFile(file, JSON.stringify(result), function (err) {
//     if (err) {
//         return console.log(err);
//     }
//
//     console.log("The file was saved!");
// });
//
// console.log("NOW READ IT");
//
// var result = [];
//
// result.push({account: "1234", contract: "5678"});
//
// fs.writeFile(file, JSON.stringify(result), function (err) {
//     if (err) {
//         return console.log(err);
//     }
//
//     console.log("The file was saved!");
// });
//
// var obj;
//
// fs.readFile(file, 'utf8', function (err, data) {
//     if (err) throw err;
//     obj = JSON.parse(data);
//
//     for (var index in obj) {
//         console.log("Item " + obj[index].account + " " + obj[index].contract);
//     }
// });


// var obj;
// fs.readFile(file, 'utf8', function (err, data) {
//     if (err) {
//         console.log("File does not exist");
//     }
//
//     obj = JSON.parse(data);
//
//     for (var index in obj) {
//         console.log("Item " + obj[index].name + " " + obj[index].team);
//     }
//
//     console.log("Add new");
//
//     obj.push({name: 'donal', team: 'SF United'});
//
//     fs.writeFile(file, JSON.stringify(obj), function (err) {
//         if (err) {
//             return console.log(err);
//         }
//
//         console.log("The file was saved!");
//     });
//
//     fs.readFile(file, 'utf8', function (err, data) {
//         if (err) throw err;
//         obj = JSON.parse(data);
//
//         for (var index in obj) {
//             console.log("Item " + obj[index].name + " " + obj[index].team);
//         }
//     });
// });



