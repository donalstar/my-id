var account = require('./account-handler.js');
var attributes = require('./attributes-handler.js');

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



