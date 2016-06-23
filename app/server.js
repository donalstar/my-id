// set up ======================================================================
var express = require('express');
var app = express(); 						// create our app w/ express
var mongoose = require('mongoose'); 				// mongoose for mongodb
var port = process.env.PORT || 8080; 				// set the port
var database = require('./config/database'); 			// load the database config
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

// IPFS
var ipfsAPI = require('ipfs-api')

// configuration ===============================================================

mongoose.connect(database.remoteUrl);

app.use(express.static(__dirname)); 		// set the static files location /public/img will be /img for users
app.use(morgan('dev')); // log every request to the console
app.use(bodyParser.urlencoded({'extended': 'true'})); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({type: 'application/vnd.api+json'})); // parse application/vnd.api+json as json
app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request


// routes ======================================================================
require('./server/routes.js')(app);

// listen (start app with node server.js) ======================================
app.listen(port);

//var ipfs = ipfsAPI('localhost', '5001', {protocol: 'http'}) // leaving out the arguments will default to these values
var ipfs = ipfsAPI({host: 'localhost', port: '5001', procotol: 'http'})

console.log("IPFS - " + ipfs);


ipfs.id()
  .then(function (id) {
    console.log('my id is: ', id)
  })
  .catch(function(err) {
    console.log('Fail: ', err)
  })

var testDir = 'QmdbHK6gMiecyjjSoPnfJg6iKMF7v6E2NkoBgGpmyCoevh';

//ipfs.ls('QmdbHK6gMiecyjjSoPnfJg6iKMF7v6E2NkoBgGpmyCoevh', function( err, res ) {
//  console.log('got error after '+((new Date() - start)), err );
//});


//ipfs cat QmWLdkp93sNxGRjnFHPaYg8tCQ35NBY3XPn6KiETd3Z4WR

//ipfs.pin.add('QmWLdkp93sNxGRjnFHPaYg8tCQ35NBY3XPn6KiETd3Z4WR')
//  .then(function (ls) {
//    console.log('LS result: ', ls)
//  })
//  .catch(function(err) {
//    console.log('Fail: ', err)
//  })

//  ipfs.cat('QmWLdkp93sNxGRjnFHPaYg8tCQ35NBY3XPn6KiETd3Z4WR')
//  .then(function (ls) {
//    console.log('LS result: ', ls)
//  })
//  .catch(function(err) {
//    console.log('Fail: ', err)
//  })

//ipfs object get QmdcYvbv8FSBfbq1VVSfbjLokVaBYRLKHShpnXu3crd3Gm


//dir
  ipfs.object.get(['QmdcYvbv8FSBfbq1VVSfbjLokVaBYRLKHShpnXu3crd3Gm'])
        .then(function (ls) {
    console.log('CP result: ', ls)
  })
  .catch(function(err) {
    console.log('Fail: ', err)
  })

//file



  ipfs.object.get(['QmWLdkp93sNxGRjnFHPaYg8tCQ35NBY3XPn6KiETd3Z4WR'])
        .then(function (ls) {
    console.log('CP result: ', ls);

    console.log('data: ', ls.data)
  })
  .catch(function(err) {
    console.log('Fail: ', err)
  })

//
//ipfs.ls("QmdbHK6gMiecyjjSoPnfJg6iKMF7v6E2NkoBgGpmyCoevh", function( err, res ) {
//  console.log('got error after '+((new Date() - start)), err );
//});
//
//
//
//ipfs.ls('QmdbHK6gMiecyjjSoPnfJg6iKMF7v6E2NkoBgGpmyCoevh')
//  .then(function (ls) {
//    console.log('LS result: ', ls)
//  })
//  .catch(function(err) {
//    console.log('Fail: ', err)
//  })


console.log("App listening on port " + port);

