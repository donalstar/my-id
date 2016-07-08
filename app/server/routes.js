var account = require('./account-handler.js');
var ssn = require('./ssn-handler.js');


module.exports = function (app) {

    /**
     * Add/Update SSN
     */

    app.post('/api/ssn', function (req, response) {
        ssn.updateSSN(req.body.user, req.body.text, response);
    });

    /**
     * Account
     */
    app.get('/api/account/:username/:password', function (req, response) {
        console.log("Get account " + req.params.username);

        account.getAccount(req.params.username, req.params.password, response);
    });

    app.post('/api/account', function (req, response) {
        account.createAccount(req.body.username, req.body.firstName, req.body.lastName, req.body.password, response);
    });

    // application -------------------------------------------------------------
    app.get('*', function (req, res) {
        console.log("send to " + __dirname + '/public/index.html');
        res.sendFile(__dirname + '/public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
    });
};