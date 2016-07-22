// Factory "morphs" into a Pudding class.
// The reasoning is that calling load in each context
// is cumbersome.

(function() {

  var contract_data = {
    abi: [{"constant":false,"inputs":[{"name":"newSellPrice","type":"uint256"},{"name":"newBuyPrice","type":"uint256"}],"name":"setPrices","outputs":[],"type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"type":"function"},{"constant":true,"inputs":[],"name":"sellPrice","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":false,"inputs":[{"name":"target","type":"address"},{"name":"mintedAmount","type":"uint256"}],"name":"mintToken","outputs":[],"type":"function"},{"constant":true,"inputs":[],"name":"buyPrice","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"type":"function"},{"constant":false,"inputs":[],"name":"buy","outputs":[{"name":"amount","type":"uint256"}],"type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[],"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"frozenAccount","outputs":[{"name":"","type":"bool"}],"type":"function"},{"constant":false,"inputs":[{"name":"amount","type":"uint256"}],"name":"sell","outputs":[{"name":"revenue","type":"uint256"}],"type":"function"},{"constant":false,"inputs":[{"name":"target","type":"address"},{"name":"freeze","type":"bool"}],"name":"freezeAccount","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"addr","type":"address"}],"name":"getBalance","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"inputs":[{"name":"initialSupply","type":"uint256"},{"name":"tokenName","type":"string"},{"name":"decimalUnits","type":"uint8"},{"name":"tokenSymbol","type":"string"},{"name":"centralMinter","type":"address"}],"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"value","type":"uint256"}],"name":"Amount","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"TransferTokens","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"msgValue_finney","type":"uint256"},{"indexed":false,"name":"buyPrice_finney","type":"uint256"},{"indexed":false,"name":"tokens","type":"uint256"}],"name":"BuyTokens","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"rev_finney","type":"uint256"},{"indexed":false,"name":"sellPrice_finney","type":"uint256"},{"indexed":false,"name":"tokens","type":"uint256"}],"name":"SellTokens","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"addr","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"GetBalance","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"target","type":"address"},{"indexed":false,"name":"frozen","type":"bool"}],"name":"FrozenFunds","type":"event"}],
    binary: "606060405266038d7ea4c68000600860005055604051610ad1380380610ad183398101604052805160805160a05160c05160e0519394928301939192019060008054600160a060020a03191633179055600160a060020a0381166000146100735760008054600160a060020a031916821790555b6001859055600160a060020a033316600090815260026020908152604091829020879055815187815291517fee0e21a0909c175792d67fa4e7c4f99d844405993e69b1ac9985af378f4cda4b9281900390910190a18360036000509080519060200190828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061016057805160ff19168380011785555b506101909291505b808211156101e9576000815560010161011b565b50506005805460ff191684179055662386f26fc10000600681905560075550505050506108b48061021d6000396000f35b82800160010185558215610113579182015b82811115610113578251826000505591602001919060010190610172565b50508160046000509080519060200190828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106101ed57805160ff19168380011785555b5061012f92915061011b565b5090565b828001600101855582156101dd579182015b828111156101dd5782518260005055916020019190600101906101ff56606060405236156100cf5760e060020a600035046305fefda781146100d157806306fdde03146100f557806318160ddd14610152578063313ce5671461015b5780634b7503341461016757806370a082311461017057806379c65068146101885780638620410b146101ac5780638da5cb5b146101b557806395d89b41146101c7578063a6f2ae3a14610223578063a9059cbb146102ca578063b414d4b6146102f9578063e4849b3214610314578063e724529c14610340578063f2fde38b14610364578063f8b2cb4f14610385575b005b6100cf60043560243560005433600160a060020a039081169116146104b957610002565b61042360038054602060026001831615610100026000190190921691909104601f810182900490910260809081016040526060828152929190828280156104ef5780601f106104c4576101008083540402835291602001916104ef565b61049160015481565b6104a360055460ff1681565b61049160065481565b61049160043560026020526000908152604090205481565b6100cf60043560243560005433600160a060020a039081169116146104f757610002565b61049160075481565b6104a3600054600160a060020a031681565b610423600480546020601f600260001960018516156101000201909316929092049182018190040260809081016040526060828152929190828280156104ef5780601f106104c4576101008083540402835291602001916104ef565b610491600754340460608181527fee0e21a0909c175792d67fa4e7c4f99d844405993e69b1ac9985af378f4cda4b90602090a130600160a060020a031660009081526002602090815260409091205460609081527fee0e21a0909c175792d67fa4e7c4f99d844405993e69b1ac9985af378f4cda4b9190a1806002600050600030600160a060020a031681526020019081526020016000206000505410156105b257610002565b6100cf60043560243533600160a060020a031660009081526009602052604090205460ff161561068157610002565b6104ad60043560096020526000908152604090205460ff1681565b61049160043533600160a060020a03166000908152600260205260408120548290101561076557610002565b6100cf60043560243560005433600160a060020a0390811691161461083c57610002565b6100cf60043560005433600160a060020a0390811691161461089257610002565b610491600435600160a060020a038116600081815260026020908152604082205460609081529192917f2ee5108edf1b0cacb02ca5dd70ace75f5f6acba366cfe64a64b126815c5473a99190a27fee0e21a0909c175792d67fa4e7c4f99d844405993e69b1ac9985af378f4cda4b60206060a16002600050600083600160a060020a031681526020019081526020016000206000505490505b919050565b60405180806020018281038252838181518152602001915080519060200190808383829060006004602084601f0104600f02600301f150905090810190601f1680156104835780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b60408051918252519081900360200190f35b6060908152602090f35b15156060908152602090f35b600691909155600755565b820191906000526020600020905b8154815290600101906020018083116104d257829003601f168201915b505050505081565b600160a060020a03808316600090815260026020908152604082208054850190556001805485019055815460608581529316927f58908a0fd75f7db2ca358a37b3076327d374ee1403d013a2efbc255535501edf9190a381600160a060020a0316600060009054906101000a9004600160a060020a0316600160a060020a03167f58908a0fd75f7db2ca358a37b3076327d374ee1403d013a2efbc255535501edf836040518082815260200191505060405180910390a35050565b806002600050600033600160a060020a03168152602001908152602001600020600082828250540192505081905550806002600050600030600160a060020a0316815260200190815260200160002060008282825054039250508190555033600160a060020a031630600160a060020a03167f50b6aaf116de9bdc1a9ed630e1ccfc0ba2a9fc8f40413653c72dac40c5828b956008600050543404600860005054600760005054048560405180848152602001838152602001828152602001935050505060405180910390a390565b6002602052604060002054819010806106ae5750600160a060020a03821660009081526040902054808201105b156106b857610002565b806002600050600033600160a060020a03168152602001908152602001600020600082828250540392505081905550806002600050600084600160a060020a0316815260200190815260200160002060008282825054019250508190555081600160a060020a031633600160a060020a03167f58908a0fd75f7db2ca358a37b3076327d374ee1403d013a2efbc255535501edf836040518082815260200191505060405180910390a35050565b604080822030600160a060020a03908116845291832080548501905533909116808352815484900390915560065483029182606082818181858883f1935050505015156107dc57816002600050600033600160a060020a031681526020019081526020016000206000828282505401925050819055505b6008546006546040805183850481529290910460208301528181018490525133600160a060020a039081169230909116917f548d9f3da692e92a59f1014c9cf16821d2e2bb0638285c31bfd81778aa8a6c2d9181900360600190a361041e565b600160a060020a03821660008181526009602052604090819020805460ff19168417905560609182528215156080527f48335238b4855f35377ed80f164e8c6f3c366e54ac00b96a6402d4a9814a03a591a15050565b6000805473ffffffffffffffffffffffffffffffffffffffff1916821790555056",
    unlinked_binary: "606060405266038d7ea4c68000600860005055604051610ad1380380610ad183398101604052805160805160a05160c05160e0519394928301939192019060008054600160a060020a03191633179055600160a060020a0381166000146100735760008054600160a060020a031916821790555b6001859055600160a060020a033316600090815260026020908152604091829020879055815187815291517fee0e21a0909c175792d67fa4e7c4f99d844405993e69b1ac9985af378f4cda4b9281900390910190a18360036000509080519060200190828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061016057805160ff19168380011785555b506101909291505b808211156101e9576000815560010161011b565b50506005805460ff191684179055662386f26fc10000600681905560075550505050506108b48061021d6000396000f35b82800160010185558215610113579182015b82811115610113578251826000505591602001919060010190610172565b50508160046000509080519060200190828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106101ed57805160ff19168380011785555b5061012f92915061011b565b5090565b828001600101855582156101dd579182015b828111156101dd5782518260005055916020019190600101906101ff56606060405236156100cf5760e060020a600035046305fefda781146100d157806306fdde03146100f557806318160ddd14610152578063313ce5671461015b5780634b7503341461016757806370a082311461017057806379c65068146101885780638620410b146101ac5780638da5cb5b146101b557806395d89b41146101c7578063a6f2ae3a14610223578063a9059cbb146102ca578063b414d4b6146102f9578063e4849b3214610314578063e724529c14610340578063f2fde38b14610364578063f8b2cb4f14610385575b005b6100cf60043560243560005433600160a060020a039081169116146104b957610002565b61042360038054602060026001831615610100026000190190921691909104601f810182900490910260809081016040526060828152929190828280156104ef5780601f106104c4576101008083540402835291602001916104ef565b61049160015481565b6104a360055460ff1681565b61049160065481565b61049160043560026020526000908152604090205481565b6100cf60043560243560005433600160a060020a039081169116146104f757610002565b61049160075481565b6104a3600054600160a060020a031681565b610423600480546020601f600260001960018516156101000201909316929092049182018190040260809081016040526060828152929190828280156104ef5780601f106104c4576101008083540402835291602001916104ef565b610491600754340460608181527fee0e21a0909c175792d67fa4e7c4f99d844405993e69b1ac9985af378f4cda4b90602090a130600160a060020a031660009081526002602090815260409091205460609081527fee0e21a0909c175792d67fa4e7c4f99d844405993e69b1ac9985af378f4cda4b9190a1806002600050600030600160a060020a031681526020019081526020016000206000505410156105b257610002565b6100cf60043560243533600160a060020a031660009081526009602052604090205460ff161561068157610002565b6104ad60043560096020526000908152604090205460ff1681565b61049160043533600160a060020a03166000908152600260205260408120548290101561076557610002565b6100cf60043560243560005433600160a060020a0390811691161461083c57610002565b6100cf60043560005433600160a060020a0390811691161461089257610002565b610491600435600160a060020a038116600081815260026020908152604082205460609081529192917f2ee5108edf1b0cacb02ca5dd70ace75f5f6acba366cfe64a64b126815c5473a99190a27fee0e21a0909c175792d67fa4e7c4f99d844405993e69b1ac9985af378f4cda4b60206060a16002600050600083600160a060020a031681526020019081526020016000206000505490505b919050565b60405180806020018281038252838181518152602001915080519060200190808383829060006004602084601f0104600f02600301f150905090810190601f1680156104835780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b60408051918252519081900360200190f35b6060908152602090f35b15156060908152602090f35b600691909155600755565b820191906000526020600020905b8154815290600101906020018083116104d257829003601f168201915b505050505081565b600160a060020a03808316600090815260026020908152604082208054850190556001805485019055815460608581529316927f58908a0fd75f7db2ca358a37b3076327d374ee1403d013a2efbc255535501edf9190a381600160a060020a0316600060009054906101000a9004600160a060020a0316600160a060020a03167f58908a0fd75f7db2ca358a37b3076327d374ee1403d013a2efbc255535501edf836040518082815260200191505060405180910390a35050565b806002600050600033600160a060020a03168152602001908152602001600020600082828250540192505081905550806002600050600030600160a060020a0316815260200190815260200160002060008282825054039250508190555033600160a060020a031630600160a060020a03167f50b6aaf116de9bdc1a9ed630e1ccfc0ba2a9fc8f40413653c72dac40c5828b956008600050543404600860005054600760005054048560405180848152602001838152602001828152602001935050505060405180910390a390565b6002602052604060002054819010806106ae5750600160a060020a03821660009081526040902054808201105b156106b857610002565b806002600050600033600160a060020a03168152602001908152602001600020600082828250540392505081905550806002600050600084600160a060020a0316815260200190815260200160002060008282825054019250508190555081600160a060020a031633600160a060020a03167f58908a0fd75f7db2ca358a37b3076327d374ee1403d013a2efbc255535501edf836040518082815260200191505060405180910390a35050565b604080822030600160a060020a03908116845291832080548501905533909116808352815484900390915560065483029182606082818181858883f1935050505015156107dc57816002600050600033600160a060020a031681526020019081526020016000206000828282505401925050819055505b6008546006546040805183850481529290910460208301528181018490525133600160a060020a039081169230909116917f548d9f3da692e92a59f1014c9cf16821d2e2bb0638285c31bfd81778aa8a6c2d9181900360600190a361041e565b600160a060020a03821660008181526009602052604090819020805460ff19168417905560609182528215156080527f48335238b4855f35377ed80f164e8c6f3c366e54ac00b96a6402d4a9814a03a591a15050565b6000805473ffffffffffffffffffffffffffffffffffffffff1916821790555056",
    address: "0xfdba047f4b538709af4bad6db2c1481487a36eb8",
    generated_with: "2.0.9",
    contract_name: "Coin"
  };

  function Contract() {
    if (Contract.Pudding == null) {
      throw new Error("Coin error: Please call load() first before creating new instance of this contract.");
    }

    Contract.Pudding.apply(this, arguments);
  };

  Contract.load = function(Pudding) {
    Contract.Pudding = Pudding;

    Pudding.whisk(contract_data, Contract);

    // Return itself for backwards compatibility.
    return Contract;
  }

  Contract.new = function() {
    if (Contract.Pudding == null) {
      throw new Error("Coin error: Please call load() first before calling new().");
    }

    return Contract.Pudding.new.apply(Contract, arguments);
  };

  Contract.at = function() {
    if (Contract.Pudding == null) {
      throw new Error("Coin error: Please call load() first before calling at().");
    }

    return Contract.Pudding.at.apply(Contract, arguments);
  };

  Contract.deployed = function() {
    if (Contract.Pudding == null) {
      throw new Error("Coin error: Please call load() first before calling deployed().");
    }

    return Contract.Pudding.deployed.apply(Contract, arguments);
  };

  if (typeof module != "undefined" && typeof module.exports != "undefined") {
    module.exports = Contract;
  } else {
    // There will only be one version of Pudding in the browser,
    // and we can use that.
    window.Coin = Contract;
  }

})();
