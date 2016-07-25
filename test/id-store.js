contract('IdStore', function (accounts) {
    console.log(accounts);
    var owner_account = accounts[0];
    var sender_account = accounts[1];

    var customer_account = accounts[2];

    it("Should call coin contract/transfer tokens", function (done) {
        var bank = null;

        var coinbank;
        var user;

        var transaction_price = 1; // 1 Token

        var finney = 1000000000000000;

        Coin.new(500, 'TOK', 0, 'T', 0, {from: owner_account}).then(function (Coin) {
            console.log("Created coin -- add " + Coin.address);

            coinbank = Coin;

            bank = Coin.address;

            return Coin.sell(100, {from: owner_account});
        }).then(function (revenue) {
            return coinbank.buy({from: customer_account, value: 100 * finney});
        }).then(function (amount) {
            console.log("Customer account bought tokens");

            return coinbank.balanceOf(owner_account);
        }).then(function (balance) {

            console.log("Owner Token Balance: " + balance);

            return IdStore.new("John", "Smith", sender_account, transaction_price, bank, {from: owner_account});
        }).then(function (IdStore) {
            user = IdStore;

            return IdStore.setAttribute(1, "22222");
        }).then(function (attribute) {
            console.log("Set attrib 1 to " + "22222");

            return user.getAttribute(1, {from: customer_account});
        }).then(function (result) {
            return coinbank.balanceOf(customer_account);
        }).then(function (balance) {
            console.log("Owner Token Balance (updated): " + balance);

            return coinbank.balanceOf(sender_account);
        }).then(function (balance) {
            console.log("User Token Balance --: " + balance);

            assert.equal(balance, 10, "User balance incorrect");
            done();
        }).catch(done);


    });


    // it("Should set attribs", function (done) {
    //     IdStore.new({from: owner_account}).then(
    //         function (IdStore) {
    //             IdStore.setAttribute(1, "22222").then(
    //                 function (attribute) {
    //                     console.log("Set attrib 1 to " + "22222");
    //                 }).then(
    //                 function () {
    //                     var ssn = "4321";
    //
    //                     console.log("Set attrib 0 to " + ssn);
    //                     return IdStore.setAttribute(0, ssn);
    //                 }).then(
    //                 function () {
    //                     return IdStore.getAttribute(0);
    //                 }).then(
    //                 function (attrib) {
    //                     assert.equal(attrib, "4321", "New SSN is not correct!");
    //
    //                     return IdStore.attribsMap.call();
    //                 }).then(
    //                 function (attribsMap) {
    //                     console.log("Attribs map " + attribsMap);
    //
    //
    //                     done();
    //                 }).catch(done);
    //
    //
    //         });
    //
    //
    //
    // });

});