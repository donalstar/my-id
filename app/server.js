// set up ======================================================================
var express = require('express');
var session = require('express-session');
var app = express(); 						// create our app w/ express
var mongoose = require('mongoose'); 				// mongoose for mongodb
var port = process.env.PORT || 8000; 				// set the port
var database = require('./config/database'); 			// load the database config
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');



// configuration ===============================================================

mongoose.connect(database.remoteUrl);

app.use(express.static(__dirname)); 		// set the static files location /public/img will be /img for users
app.use(morgan('dev')); // log every request to the console
app.use(bodyParser.urlencoded({'extended': 'true'})); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({type: 'application/vnd.api+json'})); // parse application/vnd.api+json as json
app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request

app.use(session({secret: 'ssshhhhh'}));



// // // Add headers
// app.use(function (req, res, next) {
// // // Website you wish to allow to connect
//     res.setHeader('Access-Control-Allow-Origin', '*');
// //
// // // Request methods you wish to allow
// //     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
// //
// // // Request headers you wish to allow
// //     res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
// // //
// // // // Set to true if you need the website to include cookies in the requests sent
// // // // to the API (e.g. in case you use sessions)
// // //     res.setHeader('Access-Control-Allow-Credentials', true);
// //
// });


// routes ======================================================================
require('./server/routes.js')(app);

var utility = require('./server/utility.js');

// Logging
// utility.logTokenTransfer();

// listen (start app with node server.js) ======================================
app.listen(port);

console.log("App listening on port " + port);

