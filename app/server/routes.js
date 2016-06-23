var Web3 = require('web3');
var Pudding = require("ether-pudding");
var UserChain = require("../contracts/UserChain.sol.js");
var ipfsAPI = require('ipfs-api')

var ipfs = ipfsAPI({host: 'localhost', port: '5001', procotol: 'http'})

var web3 = new Web3();

var provider = new web3.providers.HttpProvider();

web3.setProvider(provider);

Pudding.setWeb3(web3);

UserChain.load(Pudding);

var userChain = UserChain.deployed();

module.exports = function (app) {

    app.get('/api/value/:id', function (req, res) {

        web3.eth.getAccounts(function(err, accs) {
            getValue(err, accs, res);
        });

    });

    app.post('/api/value', function (req, res) {

        web3.eth.getAccounts(function(err, accs) {

            userChain.setValue(req.body.text, {from: accs[0]}).then(function(value) {
                console.log("update succeeded");


                        // test -- add data to IPFS



                const f1 = 'Hello'
                const f2 = 'World'

                ipfs.files.add([new Buffer(f1), new Buffer(f2)], function (err, res) {
                  if (err || !res) return console.log(err)

                  for (let i = 0; i < res.length; i++) {
                    console.log(res[i])

                    console.log("file: " + res[i].path);


                    ipfs.object.get([res[i].path])
                        .then(function (result) {
                        console.log('READ FILE ' + i + ': ', result.data);


                        if (i == 0) {
                            userChain.setLocation(res[i].path, {from: accs[0]}).then(function(value) {
                                console.log("Set location addr - " + res[i].path + " : " + value);
                            }).catch(function(e) {
                              console.log("ERR " + e);
                            });
                        }
                      })
                      .catch(function(err) {
                        console.log('Fail: ', err)
                      })
                  }

                })



            }).catch(function(e) {
              console.log("ERR " + e);
            });
        });



    });

    app.get('/api/ssn/:id', function (req, res) {

        web3.eth.getAccounts(function(err, accs) {
            getSSN(err, accs, res);
        });

    });


    // application -------------------------------------------------------------
    app.get('*', function (req, res) {
    console.log("send to " + __dirname + '/public/index.html');
        res.sendFile(__dirname + '/public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
    });


    function getValue(err, accs, res) {
        if (err != null) {
          console.log("There was an error fetching your accounts.");
          return;
        }

        if (accs.length == 0) {
          console.log("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
          return;
        }



        userChain.getValue.call({from: accs[0]}).then(function(value) {
                // test -- get location
                userChain.getLocation.call({from: accs[0]}).then(function(value) {
                  console.log("GOT VALUE " + value);



                    ipfs.object.get([value])
                        .then(function (result) {
                        console.log('FROM IPFS --- '  + result.data );


                      })
                      .catch(function(err) {
                        console.log('Fail: ', err)
                      })


                }).catch(function(e) {
                  console.log("GET LOC ERR " + e);
                });

          res.send(JSON.stringify({ value: value }));

        }).catch(function(e) {
          console.log("ERR " + e);
        });
    }

    function getSSN(err, accs, res) {
        console.log("get SSN");

        if (err != null) {
          console.log("There was an error fetching your accounts.");
          return;
        }

        if (accs.length == 0) {
          console.log("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
          return;
        }

        console.log("accounts " + accs);

        userChain.getValu.call(accs[0], {from: accs[0]}).then(function(value) {
            console.log("User Chain bal " + value);

            res.send(JSON.stringify({ a: value }));

        }).catch(function(e) {
            console.log("ERR " + e);
        });
    }
};