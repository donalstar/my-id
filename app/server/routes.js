var Web3 = require('web3');
var Todo = require('./models/todo');
var Pudding = require("ether-pudding");
var UserChain = require("../contracts/UserChain.sol.js");

function getTodos(res) {
    Todo.find(function (err, todos) {

        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err) {
            res.send(err);
        }

        res.json(todos); // return all todos in JSON format
    });
}
;

module.exports = function (app) {

    // api ---------------------------------------------------------------------
    // get all todos
    app.get('/api/todos', function (req, res) {
        // use mongoose to get all todos in the database
        getTodos(res);
    });

    app.get('/api/ssn/:id', function (req, res) {

        var web3 = new Web3();

        var provider = new web3.providers.HttpProvider();

        web3.setProvider(provider);

        Pudding.setWeb3(web3);

        UserChain.load(Pudding);

        var userChain = UserChain.deployed();

//res.send(JSON.stringify({ a: 11 }));

        web3.eth.getAccounts(function(err, accs) {
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
        });



    });

    // create todo and send back all todos after creation
    app.post('/api/todos', function (req, res) {

        // create a todo, information comes from AJAX request from Angular
        Todo.create({
            text: req.body.text,
            done: false
        }, function (err, todo) {
            if (err)
                res.send(err);

            // get and return all the todos after you create another
            getTodos(res);
        });

    });

    // delete a todo
    app.delete('/api/todos/:todo_id', function (req, res) {
        Todo.remove({
            _id: req.params.todo_id
        }, function (err, todo) {
            if (err)
                res.send(err);

            getTodos(res);
        });
    });

    // application -------------------------------------------------------------
    app.get('*', function (req, res) {
    console.log("send to " + __dirname + '/public/index.html');
        res.sendFile(__dirname + '/public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
    });
};