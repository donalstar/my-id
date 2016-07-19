contract('Coin', function (accounts) {
    console.log(accounts);
    var owner_account = accounts[0];
    var sender_account = accounts[1];

    it("should put 10000 Coin in the first account", function (done) {
        Coin.new(1000, 'TOK', 0, 'T', 0,  {from: owner_account}).then(
            function (coin) {

                console.log("Deployed contract " + coin);

                coin.getBalance.call(accounts[0]).then(function (balance) {
                    assert.equal(balance.valueOf(), 1000, "1000 wasn't in the first account");
                }).then(done).catch(done);
            });
    });
});

