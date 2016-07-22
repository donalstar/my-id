contract('UserChain', function (accounts) {
    console.log(accounts);
    var owner_account = accounts[0];
    var sender_account = accounts[1];

    // it("Should set SSN", function (done) {
    //     console.log("SET SSN!!");
    //
    //     var c = UserChain.at(UserChain.deployed_address);
    //
    //     UserChain.new({from: owner_account}).then(
    //         function (UserChain) {
    //             UserChain.getSSN.call().then(
    //                 function (ssn) {
    //                     assert.equal(ssn, 0, "SSN doesn't match!");
    //                 }).then(
    //                 function () {
    //                     return UserChain.setSSN(123456789);
    //                 }).then(
    //                 function () {
    //                     return UserChain.getSSN.call()
    //                 }).then(
    //                 function (ssn) {
    //                     console.log("New SSN " + ssn);
    //                     assert.equal(ssn, 123456789, "New SSN is not correct!");
    //                     done();
    //                 }).catch(done);
    //         }).catch(done);
    // });

    // it("Should set attribs", function (done) {
    //     UserChain.new({from: owner_account}).then(
    //         function (UserChain) {
    //             UserChain.setAttrib(1, "22222").then(
    //                 function (attribute) {
    //                     console.log("Set attrib 1 to " + "22222");
    //                 }).then(
    //                 function () {
    //                     var ssn = "4321";
    //
    //                     console.log("Set attrib 0 to " + ssn);
    //                     return UserChain.setAttrib(0, ssn);
    //                 }).then(
    //                 function () {
    //                     return UserChain.getAttrib(0);
    //                 }).then(
    //                 function (attrib) {
    //                     assert.equal(attrib, "4321", "New SSN is not correct!");
    //
    //                     return UserChain.attribsMap.call();
    //                 }).then(
    //                 function (attribsMap) {
    //                     console.log("Attribs map " + attribsMap);
    //
    //
    //                     done();
    //                 }).catch(done);
    //
    //
    //
    //
    //         });


    it("Should call coin contract", function (done) {
        var bank = null;

        var coinbank;
        var user;

        Coin.new(500, 'TOK', 0, 'T', 0, {from: owner_account}).then(function (Coin) {
            console.log("Created coin -- add " + Coin.address);

            coinbank = Coin;

            bank = Coin.address;

            return Coin.balanceOf(owner_account)
        }).then(function (balance) {

            console.log("Owner Token Balance: " + balance);

            return UserChain.new("John", "Smith", sender_account, bank, {from: owner_account});
        }).then(function (UserChain) {
            user = UserChain;

            return UserChain.setAttrib(1, "22222");
        }).then(function (attribute) {
            console.log("Set attrib 1 to " + "22222");

            return user.getAttrib(1, {from: owner_account});
        }).then(function (result) {
            return coinbank.balanceOf(owner_account);
        }).then(function (balance) {
            console.log("Owner Token Balance (updated): " + balance);

            return coinbank.balanceOf(sender_account);
        }).then(function (balance) {
            console.log("User Token Balance --: " + balance);

            assert.equal(balance, 10, "User balance incorrect");
            done();
        }).catch(done);


    });


// it("Should set Attributes", function (done) {
//     var c = UserChain.at(UserChain.deployed_address);
//
//     UserChain.new({from: owner_account}).then(
//         function (UserChain) {
//
//
//             UserChain.setAttribute(1, "22222").then(
//                 function (attribute) {
//                     console.log("Set attrib 2 to " + attribute);
//                 }).then(
//                 function () {
//                     var ssn = "4321";
//
//                     console.log("Set attrib 1 to " + ssn);
//                     return UserChain.setAttribute(0, ssn);
//                 }).then(
//                 function () {
//                     return UserChain.the_attributes.call()
//                 }).then(
//                 function (the_attributes) {
//                     assert.equal(the_attributes[0], "4321", "New SSN is not correct!");
//                     assert.equal(the_attributes[1], "22222", "New DL is not correct!");
//                     done();
//                 }).catch(done);
//         });
// });
//
// it("Should get DL", function (done) {
//     var c = UserChain.at(UserChain.deployed_address);
//
//     UserChain.new({from: owner_account}).then(
//         function (UserChain) {
//             UserChain.setDL("11111").then(
//                 function (dl) {
//                     console.log("Set DL to " + dl);
//                 }).then(
//                 function () {
//                     return UserChain.the_attributes.call()
//                 }).then(
//                 function (the_attributes) {
//                     assert.equal(the_attributes[1], "11111", "New DL is not correct!");
//                     done();
//                 }).catch(done);
//
//             // .then(
//             // function () {
//             //     return UserChain.setDL("11112")
//             // }).then(
//             // function (the_attributes) {
//             //     assert.equal(the_attributes[1], "11111", "New DL (2) is not correct!");
//             //     done();
//             // })
//         }).catch(done);
//
//
// });


})
;

