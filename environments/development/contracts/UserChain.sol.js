// Factory "morphs" into a Pudding class.
// The reasoning is that calling load in each context
// is cumbersome.

(function() {

  var contract_data = {
    abi: [{"constant":false,"inputs":[],"name":"getBalance","outputs":[{"name":"balance","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"registrantsPaid","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[],"name":"dl","outputs":[{"name":"","type":"address"}],"type":"function"},{"constant":true,"inputs":[],"name":"organizer","outputs":[{"name":"","type":"address"}],"type":"function"},{"constant":false,"inputs":[{"name":"recipient","type":"address"},{"name":"amount","type":"uint256"}],"name":"refundTicket","outputs":[],"type":"function"},{"constant":false,"inputs":[],"name":"destroy","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"dl_address","type":"address"}],"name":"setDL","outputs":[],"type":"function"},{"constant":false,"inputs":[],"name":"getSSN","outputs":[{"name":"ssn","type":"uint256"}],"type":"function"},{"constant":false,"inputs":[{"name":"newquota","type":"uint256"}],"name":"changeQuota","outputs":[],"type":"function"},{"constant":true,"inputs":[],"name":"balance","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":false,"inputs":[],"name":"getDL","outputs":[{"name":"dl","type":"address"}],"type":"function"},{"constant":true,"inputs":[],"name":"quota","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[],"name":"ssn","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":false,"inputs":[{"name":"newssn","type":"uint256"}],"name":"setSSN","outputs":[],"type":"function"},{"constant":true,"inputs":[],"name":"numRegistrants","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":false,"inputs":[],"name":"buyTicket","outputs":[],"type":"function"},{"inputs":[],"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_from","type":"address"},{"indexed":false,"name":"_amount","type":"uint256"}],"name":"Deposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_to","type":"address"},{"indexed":false,"name":"_amount","type":"uint256"}],"name":"Refund","type":"event"}],
    binary: "606060405260008054600160a060020a0319163317815560646003556002819055600455610320600555610337806100376000396000f3606060405236156100c45760e060020a600035046312065fe081146100c657806313381fbf146100cf57806324a85aac146100e757806361203265146100f9578063705099b91461010b57806383197ef014610132578063a2a468bb1461015c578063a52bb3ab146100c6578063a977c71e14610185578063b69ef8a8146101a8578063c5a87e00146101b1578063cebe09c9146101b9578063d96f4385146101c2578063eba7580c146101cb578063ec3a6f73146101d6578063edca914c146101df575b005b6101f25b600090565b6101f260043560016020526000908152604090205481565b6101fc600654600160a060020a031681565b6101fc600054600160a060020a031681565b6100c460043560243560008054600160a060020a0390811633919091161461020f576102d3565b6100c4600054600160a060020a03908116339190911614156102d857600054600160a060020a0316ff5b6100c46004356006805473ffffffffffffffffffffffffffffffffffffffff1916821790555b50565b6100c4600435600054600160a060020a039081163391909116146102da57610182565b6101f260055481565b6101fc6100ca565b6101f260035481565b6101f260045481565b6004803590556100c4565b6101f260025481565b6100c4600354600254106102df57610002565b6060908152602090f35b600160a060020a03166060908152602090f35b600160a060020a0383168152600160205260408120548214156102d3575030600160a060020a038116318290106102d357600160a060020a038316600083606082818181858883f1505060408051938452602084019190915280517fbb28353e4598c3b9199101a66e0989549b659a59a54d2c27fbb183f1932c8e6d938190039091019150a160006001600050600085600160a060020a03168152602001908152602001600020600050819055506002600081815054809291906001900391905055505b505050565b565b600355565b600160a060020a03331660008181526001602081905260409182902034908190556002805490920190915560609283526080527fe1fffcc4923d04b559f4d29a8bfc6cda04eb5b0d3c460751c2402c5c5cc9109c91a156",
    unlinked_binary: "606060405260008054600160a060020a0319163317815560646003556002819055600455610320600555610337806100376000396000f3606060405236156100c45760e060020a600035046312065fe081146100c657806313381fbf146100cf57806324a85aac146100e757806361203265146100f9578063705099b91461010b57806383197ef014610132578063a2a468bb1461015c578063a52bb3ab146100c6578063a977c71e14610185578063b69ef8a8146101a8578063c5a87e00146101b1578063cebe09c9146101b9578063d96f4385146101c2578063eba7580c146101cb578063ec3a6f73146101d6578063edca914c146101df575b005b6101f25b600090565b6101f260043560016020526000908152604090205481565b6101fc600654600160a060020a031681565b6101fc600054600160a060020a031681565b6100c460043560243560008054600160a060020a0390811633919091161461020f576102d3565b6100c4600054600160a060020a03908116339190911614156102d857600054600160a060020a0316ff5b6100c46004356006805473ffffffffffffffffffffffffffffffffffffffff1916821790555b50565b6100c4600435600054600160a060020a039081163391909116146102da57610182565b6101f260055481565b6101fc6100ca565b6101f260035481565b6101f260045481565b6004803590556100c4565b6101f260025481565b6100c4600354600254106102df57610002565b6060908152602090f35b600160a060020a03166060908152602090f35b600160a060020a0383168152600160205260408120548214156102d3575030600160a060020a038116318290106102d357600160a060020a038316600083606082818181858883f1505060408051938452602084019190915280517fbb28353e4598c3b9199101a66e0989549b659a59a54d2c27fbb183f1932c8e6d938190039091019150a160006001600050600085600160a060020a03168152602001908152602001600020600050819055506002600081815054809291906001900391905055505b505050565b565b600355565b600160a060020a03331660008181526001602081905260409182902034908190556002805490920190915560609283526080527fe1fffcc4923d04b559f4d29a8bfc6cda04eb5b0d3c460751c2402c5c5cc9109c91a156",
    address: "0x44879ad21c0bdbc39c4c132f8eba78169f1eba6b",
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
