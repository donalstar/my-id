'use strict'

var async = require("async");
var fs = require('fs');

console.log("add.js");

async.map(['index.html','package.json','server.js'], fs.stat, function(err, results){
    // results is now an array of stats for each file
    console.log("RES " + results);
});


// var Web3 = require('web3');
// var Pudding = require("ether-pudding");
//
// var Greeter = require("./contracts/Greeter.sol.js");
//
//
//
// var UserChain = require("./contracts/UserChain.sol.js");
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



