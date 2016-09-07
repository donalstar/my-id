var account = require('./account-handler.js');
var customer = require('./customer-handler.js');
var attributes = require('./attributes-handler.js');
var mail = require('./mail.js');

var cors = require('cors');


module.exports = function (app) {

    /**
     * Add/Update Attribute
     */

    app.post('/api/attribute', function (req, response) {
        console.log("-- Update attrib - type = " + req.body.requestType);

        attributes.saveAttributes(req.body.user, req.body.requestType, req.body.profile, response);
    });

    /**
     * Account
     */
    app.get('/api/account/:username/:password', function (req, response) {

        account.getAccount(req.session, req.params.username, req.params.password, response);
    });

    app.get('/api/check_login', function (req, response) {
        console.log("check login! - from session: " + req.session.logged_in);

        response.send(JSON.stringify(
            {
                logged_in: req.session.logged_in,
                username: req.session.username
            }));
    });


    /**
     * Get Accounts
     */
    app.get('/api/accounts', function (req, response) {
        console.log("Get all accounts");

        account.getAllAccounts(response);
    });

    app.post('/api/account', function (req, response) {
        account.createAccount(req.body.username, req.body.firstName, req.body.lastName, req.body.password, response);
    });

    app.options('/api/mail', cors()); // enable pre-flight request for POST request

    app.post('/api/mail', cors(), function (req, response) {
        mail.sendMail(req.body.name, req.body.email_address, req.body.message, response);
    });

    /**
     * Account data
     *
     */
    app.get('/api/account_data/:username/:account_name/:attribute', function (req, response) {
        account.requestData(req.params.username, req.params.account_name, req.params.attribute, response);
    });

    // Customer

    /**
     * Create Customer
     */

    app.post('/api/customer', function (req, response) {
        console.log("Create new customer " + req.body.username);

        customer.createAccount(req.body.username, req.body.firstName, req.body.lastName, req.body.password, response);
    });

    /**
     * Get customer
     */
    app.get('/api/customer/:username/:password', function (req, response) {
        console.log("Get customer account " + req.params.username);

        customer.getAccount(req.params.username, req.params.password, response);
    });

    /**
     * Get coinbank balances
     */
    app.get('/api/coinbank', function (req, response) {
        account.getBalances(response);
    });

    // application -------------------------------------------------------------
    app.get('*', function (req, res) {
        console.log("send to " + __dirname + '/public/index.html');
        res.sendFile(__dirname + '/public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
    });
};



