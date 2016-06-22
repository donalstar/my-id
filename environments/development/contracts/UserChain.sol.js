// Factory "morphs" into a Pudding class.
// The reasoning is that calling load in each context
// is cumbersome.

(function() {

  var contract_data = {
    abi: [{"constant":false,"inputs":[],"name":"getBalance","outputs":[{"name":"balance","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"registrantsPaid","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":false,"inputs":[],"name":"getValue","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[],"name":"dl","outputs":[{"name":"","type":"address"}],"type":"function"},{"constant":true,"inputs":[],"name":"value","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":false,"inputs":[],"name":"buyTick","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"new_value","type":"uint256"}],"name":"setValue","outputs":[],"type":"function"},{"constant":true,"inputs":[],"name":"organizer","outputs":[{"name":"","type":"address"}],"type":"function"},{"constant":false,"inputs":[{"name":"recipient","type":"address"},{"name":"amount","type":"uint256"}],"name":"refundTicket","outputs":[],"type":"function"},{"constant":false,"inputs":[],"name":"destroy","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"dl_address","type":"address"}],"name":"setDL","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"newquota","type":"uint256"}],"name":"changeQuota","outputs":[],"type":"function"},{"constant":true,"inputs":[],"name":"balance","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":false,"inputs":[],"name":"getDL","outputs":[{"name":"dl","type":"address"}],"type":"function"},{"constant":false,"inputs":[{"name":"addr","type":"address"}],"name":"getValu","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[],"name":"quota","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[],"name":"ssn","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":false,"inputs":[{"name":"newssn","type":"uint256"}],"name":"setSSN","outputs":[],"type":"function"},{"constant":true,"inputs":[],"name":"numRegistrants","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":false,"inputs":[{"name":"addr","type":"address"}],"name":"getSSN","outputs":[{"name":"ssn","type":"uint256"}],"type":"function"},{"inputs":[],"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_from","type":"address"},{"indexed":false,"name":"_amount","type":"uint256"}],"name":"Deposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_to","type":"address"},{"indexed":false,"name":"_amount","type":"uint256"}],"name":"Refund","type":"event"}],
    binary: "606060405260008054600160a060020a0319163317815560646003556002819055600455610320600555600a6007556103bc8061003c6000396000f3606060405236156100f05760e060020a600035046312065fe081146100f257806313381fbf146100fc578063209652551461011457806324a85aac1461011f5780633fa4f245146101315780634d9958051461013a578063552410771461014e578063612032651461015d578063705099b91461016f57806383197ef014610194578063a2a468bb146101bc578063a977c71e146101e2578063b69ef8a814610203578063c5a87e001461020c578063cc796cc914610214578063cebe09c914610223578063d96f43851461022c578063eba7580c14610235578063ec3a6f7314610240578063fffcd07c14610249575b005b6102565b60005b90565b61025660043560016020526000908152604090205481565b6102566007546100f9565b610268600654600160a060020a031681565b61025660075481565b6100f0600254600354901061028557610002565b6100f060043560078190555b50565b610268600054600160a060020a031681565b6100f06004356024356000805433600160a060020a039081169116146102e7576103b2565b6100f060005433600160a060020a03908116911614156102e557600054600160a060020a0316ff5b6006805473ffffffffffffffffffffffffffffffffffffffff19166004351790556100f0565b6100f060043560005433600160a060020a039081169116146103b75761015a565b61025660055481565b6102686100f6565b6102566004356005545b919050565b61025660035481565b61025660045481565b6004803590556100f0565b61025660025481565b610256600435600061021e565b60408051918252519081900360200190f35b60408051600160a060020a03929092168252519081900360200190f35b33600160a060020a0316600081815260016020818152604092839020349081905560028054909301909255825193845283015280517fe1fffcc4923d04b559f4d29a8bfc6cda04eb5b0d3c460751c2402c5c5cc9109c9281900390910190a15b565b600160a060020a0383166000908152600160205260409020548214156103b2575030600160a060020a038116318290106103b257604051600160a060020a03841690600090849082818181858883f1505060408051938452602084019190915280517fbb28353e4598c3b9199101a66e0989549b659a59a54d2c27fbb183f1932c8e6d938190039091019150a160006001600050600085600160a060020a03168152602001908152602001600020600050819055506002600081815054809291906001900391905055505b505050565b60035556",
    unlinked_binary: "606060405260008054600160a060020a0319163317815560646003556002819055600455610320600555600a6007556103bc8061003c6000396000f3606060405236156100f05760e060020a600035046312065fe081146100f257806313381fbf146100fc578063209652551461011457806324a85aac1461011f5780633fa4f245146101315780634d9958051461013a578063552410771461014e578063612032651461015d578063705099b91461016f57806383197ef014610194578063a2a468bb146101bc578063a977c71e146101e2578063b69ef8a814610203578063c5a87e001461020c578063cc796cc914610214578063cebe09c914610223578063d96f43851461022c578063eba7580c14610235578063ec3a6f7314610240578063fffcd07c14610249575b005b6102565b60005b90565b61025660043560016020526000908152604090205481565b6102566007546100f9565b610268600654600160a060020a031681565b61025660075481565b6100f0600254600354901061028557610002565b6100f060043560078190555b50565b610268600054600160a060020a031681565b6100f06004356024356000805433600160a060020a039081169116146102e7576103b2565b6100f060005433600160a060020a03908116911614156102e557600054600160a060020a0316ff5b6006805473ffffffffffffffffffffffffffffffffffffffff19166004351790556100f0565b6100f060043560005433600160a060020a039081169116146103b75761015a565b61025660055481565b6102686100f6565b6102566004356005545b919050565b61025660035481565b61025660045481565b6004803590556100f0565b61025660025481565b610256600435600061021e565b60408051918252519081900360200190f35b60408051600160a060020a03929092168252519081900360200190f35b33600160a060020a0316600081815260016020818152604092839020349081905560028054909301909255825193845283015280517fe1fffcc4923d04b559f4d29a8bfc6cda04eb5b0d3c460751c2402c5c5cc9109c9281900390910190a15b565b600160a060020a0383166000908152600160205260409020548214156103b2575030600160a060020a038116318290106103b257604051600160a060020a03841690600090849082818181858883f1505060408051938452602084019190915280517fbb28353e4598c3b9199101a66e0989549b659a59a54d2c27fbb183f1932c8e6d938190039091019150a160006001600050600085600160a060020a03168152602001908152602001600020600050819055506002600081815054809291906001900391905055505b505050565b60035556",
    address: "0xb419494857dc45992965a5221071ef4c61ef3f0c",
    generated_with: "2.0.9",
    contract_name: "UserChain"
  };

  function Contract() {
    if (Contract.Pudding == null) {
      throw new Error("UserChain error: Please call load() first before creating new instance of this contract.");
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
      throw new Error("UserChain error: Please call load() first before calling new().");
    }

    return Contract.Pudding.new.apply(Contract, arguments);
  };

  Contract.at = function() {
    if (Contract.Pudding == null) {
      throw new Error("UserChain error: Please call load() first before calling at().");
    }

    return Contract.Pudding.at.apply(Contract, arguments);
  };

  Contract.deployed = function() {
    if (Contract.Pudding == null) {
      throw new Error("UserChain error: Please call load() first before calling deployed().");
    }

    return Contract.Pudding.deployed.apply(Contract, arguments);
  };

  if (typeof module != "undefined" && typeof module.exports != "undefined") {
    module.exports = Contract;
  } else {
    // There will only be one version of Pudding in the browser,
    // and we can use that.
    window.UserChain = Contract;
  }

})();
