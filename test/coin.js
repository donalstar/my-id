contract('Coin', function (accounts) {
    console.log(accounts);
    var owner_account = accounts[0];
    var sender_account = accounts[1];


    it("should put 1000 Coin in the first account", function (done) {
        Coin.new(1000, 'TOK', 0, 'T', 0, {from: owner_account}).then(function (coin) {

            return coin.getBalance.call(accounts[0]).then(function (balance) {
                assert.equal(balance.valueOf(), 1000, "1000 wasn't in the first account");
            }).then(done).catch(done);
        });
    });

    it("should send coin correctly", function (done) {

        var account_one_starting_balance;
        var account_two_starting_balance;

        var amount = 10;

        // Coin.new(1000, 'TOK', 0, 'T', 0, {from: owner_account, value: web3.toWei("11", "Ether")}).then(
        Coin.new(10000, 'TOK', 0, 'T', 0, {from: owner_account}).then(
            function (coin) {

                web3.eth.sendTransaction({from: accounts[0], to: coin.address, value: web3.toWei("1", "Ether")});

                var bal = web3.fromWei(web3.eth.getBalance(coin.address), 'ether');
                var finney = web3.fromWei(web3.eth.getBalance(coin.address), 'finney');

                console.log("Contract bal " + bal);
                console.log("Contract bal (finney) " + finney);
                console.log("Contract bal (wei) " + web3.eth.getBalance(coin.address) );


                coin.getBalance.call(accounts[0]).then(function (balance) {

                // coin.setPrices(1000, 1000, {from: accounts[0]}).then(function () {
                //     return coin.getBalance.call(accounts[0]);
                // }).then(function (balance) {

                    console.log("Starting account[0] balance " + balance);

                    account_one_starting_balance = balance;



                    return coin.getBalance.call(accounts[1]);
                }).then(function (balance) {
                    console.log("Starting account[1] balance " + balance);

                    return coin.sell(2, {from: accounts[0]});
                }).then(function (revenue) {

                    assert.equal(account_one_starting_balance, 1000, "account[0] balance wrong");

                    console.log("Sold... " + revenue);

                    //   return coin.getBalance.call(accounts[0]);
                    // }).then(function (balance) {
                    //     console.log("Account[0] bal " + balance);
                    //
                    //     return coin.buy({
                    //         from: accounts[1], value: 99
                    //     });
                    //
                    // }).then(function (bought) {
                    //     console.log("Account[1] bought... " + bought);
                    //
                    //     return coin.getBalance.call(accounts[1]);
                    // }).then(function (balance) {
                    //     console.log("Account[1] bal " + balance);
                    //
                    //     return coin.getBalance.call(coin.address);
                    // }).then(function (balance) {
                    //     console.log("Contract bal " + balance);
                    //
                    //     var bal = web3.fromWei(web3.eth.getBalance(coin.address), 'ether');
                    //
                    //     console.log("Contract bal (ether) " + bal);
                }).then(done).catch(done);
            });


    });

})
;

