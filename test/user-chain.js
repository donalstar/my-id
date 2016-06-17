contract('UserChain', function(accounts) {
	console.log(accounts);
	var owner_account = accounts[0];
  var sender_account = accounts[1];

  it("Should set SSN", function(done) {
    var c = UserChain.at(UserChain.deployed_address);

  	  	UserChain.new({from: owner_account}).then(
  		function(UserChain) {
  			UserChain.ssn.call().then(
  				function(ssn) {
  					assert.equal(ssn, 0, "SSN doesn't match!");
  			}).then(
  				function() {
  					return UserChain.setSSN(123456789);
  			}).then(
  				function() {
  					return UserChain.ssn.call()
  			}).then(
  				function(ssn) {
  					assert.equal(ssn, 123456789, "New SSN is not correct!");
  					done();
  			}).catch(done);
  	}).catch(done);
  });

  it("Should set DL", function(done) {
    var c = UserChain.at(UserChain.deployed_address);

  	UserChain.new({from: owner_account}).then(
  		function(UserChain) {

            console.log("Set DL to " + accounts[2]);

            var dl_address =  accounts[2]; // 0xa36feca5a19d6f010ffd7fe4b812d79f3ade7f6f;

  		    return UserChain.setDL(dl_address).then(
  				function() {
  					return UserChain.dl.call();
  			}).then(
  				function(dl) {
  					assert.equal(dl, accounts[2], "New DL is not correct!");
  					done();
  			}).catch(done);
  	}).catch(done);
  });

  it("Should match account balance", function(done) {
    var c = UserChain.at(UserChain.deployed_address);

  	UserChain.new({from: owner_account}).then(
  		function(UserChain) {
  		    return UserChain.balance.call().then(
  				function(balance) {
  					assert.equal(balance, 800, "Account balance is not correct!");
  					done();
  			}).catch(done);
  	}).catch(done);
  });


  it("Should update quota", function(done) {
    var c = UserChain.at(UserChain.deployed_address);
  	
  	UserChain.new({from: owner_account}).then(
  		function(UserChain) {
  			UserChain.quota.call().then(
  				function(quota) { 
  					assert.equal(quota, 100, "Quota doesn't match!"); 
  			}).then(
  				function() { 
  					return UserChain.changeQuota(300);
  			}).then(
  				function() { 
  					return UserChain.quota.call()
  			}).then(
  				function(quota) { 
  					assert.equal(quota, 300, "New quota is not correct!");
  					done();
  			}).catch(done);
  	}).catch(done);
  });


  it("Should let you buy a ticket", function(done) {
    var c = UserChain.at(UserChain.deployed_address);

  	UserChain.new({ from: accounts[0] }).then(
  		function(UserChain) {

        var ticketPrice = web3.toWei(.05, 'ether');
        var initialBalance = web3.eth.getBalance(UserChain.address).toNumber();  

  			UserChain.buyTicket({ from: accounts[1], value: ticketPrice }).then(
          function() {
  					var newBalance = web3.eth.getBalance(UserChain.address).toNumber();
            var difference = newBalance - initialBalance;
  					assert.equal(difference, ticketPrice, "Difference should be what was sent");
  					return UserChain.numRegistrants.call(); 
  			}).then(
  				function(num) { 
  					assert.equal(num, 1, "there should be 1 registrant");
  					return UserChain.registrantsPaid.call(sender_account);
  			}).then(
  				function(amount) {
  					assert.equal(amount.toNumber(), ticketPrice, "Sender's paid but is not listed as paying");	
  					return web3.eth.getBalance(UserChain.address);
  			}).then(
  				function(bal) {
            assert.equal(bal.toNumber(), ticketPrice, "Final balance mismatch");
  					done();
  			}).catch(done);
  	}).catch(done);
  });

  it("Should issue a refund by owner only", function(done) {
    var c = UserChain.at(UserChain.deployed_address);
    
    UserChain.new({ from: accounts[0] }).then(
      function(UserChain) {

        var ticketPrice = web3.toWei(.05, 'ether');
        var initialBalance = web3.eth.getBalance(UserChain.address).toNumber(); 

        UserChain.buyTicket({ from: accounts[1], value: ticketPrice }).then(
          function() {
            var newBalance = web3.eth.getBalance(UserChain.address).toNumber();
            var difference = newBalance - initialBalance;
            assert.equal(difference, ticketPrice, "Difference should be what was sent");

            // Now try to issue refund as second user - should fail
            return UserChain.refundTicket(accounts[1], ticketPrice, {from: accounts[1]});
        }).then(
          function() {  
            var balance = web3.eth.getBalance(UserChain.address);
            assert.equal(balance, ticketPrice, "Balance should be unchanged");
            // Now try to issue refund as organizer/owner
            return UserChain.refundTicket(accounts[1], ticketPrice, {from: accounts[0]});
        }).then(
          function() {
            var postRefundBalance = web3.eth.getBalance(UserChain.address).toNumber();
            assert.equal(postRefundBalance, initialBalance, "Balance should be initial balance");
            done();
        }).catch(done);
      }).catch(done);
    });

});

