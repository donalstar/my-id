// Factory "morphs" into a Pudding class.
// The reasoning is that calling load in each context
// is cumbersome.

(function() {

  var contract_data = {
    abi: [{"constant":false,"inputs":[],"name":"getBalance","outputs":[{"name":"balance","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"registrantsPaid","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[],"name":"dl","outputs":[{"name":"","type":"address"}],"type":"function"},{"constant":false,"inputs":[],"name":"buyTick","outputs":[],"type":"function"},{"constant":true,"inputs":[],"name":"organizer","outputs":[{"name":"","type":"address"}],"type":"function"},{"constant":false,"inputs":[{"name":"recipient","type":"address"},{"name":"amount","type":"uint256"}],"name":"refundTicket","outputs":[],"type":"function"},{"constant":false,"inputs":[],"name":"destroy","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"dl_address","type":"address"}],"name":"setDL","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"newquota","type":"uint256"}],"name":"changeQuota","outputs":[],"type":"function"},{"constant":true,"inputs":[],"name":"balance","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":false,"inputs":[],"name":"getDL","outputs":[{"name":"dl","type":"address"}],"type":"function"},{"constant":false,"inputs":[{"name":"addr","type":"address"}],"name":"getValu","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[],"name":"quota","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[],"name":"ssn","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":false,"inputs":[{"name":"newssn","type":"uint256"}],"name":"setSSN","outputs":[],"type":"function"},{"constant":true,"inputs":[],"name":"numRegistrants","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":false,"inputs":[{"name":"addr","type":"address"}],"name":"getSSN","outputs":[{"name":"ssn","type":"uint256"}],"type":"function"},{"inputs":[],"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_from","type":"address"},{"indexed":false,"name":"_amount","type":"uint256"}],"name":"Deposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_to","type":"address"},{"indexed":false,"name":"_amount","type":"uint256"}],"name":"Refund","type":"event"}],
    binary: "606060405260008054600160a060020a0319163317815560646003556002819055600455610320600555610358806100376000396000f3606060405236156100cf5760e060020a600035046312065fe081146100d157806313381fbf146100da57806324a85aac146100f25780634d995805146101045780636120326514610118578063705099b91461012a57806383197ef01461014f578063a2a468bb14610177578063a977c71e146101a0578063b69ef8a8146101c1578063c5a87e00146101ca578063cc796cc9146101d2578063cebe09c9146101e1578063d96f4385146101ea578063eba7580c146101f3578063ec3a6f73146101fe578063fffcd07c14610207575b005b6102145b600090565b61021460043560016020526000908152604090205481565b61021e600654600160a060020a031681565b6100cf600254600354901061023157610002565b61021e600054600160a060020a031681565b6100cf6004356024356000805433600160a060020a0390811691161461028a5761034e565b6100cf60005433600160a060020a039081169116141561028857600054600160a060020a0316ff5b6100cf6004356006805473ffffffffffffffffffffffffffffffffffffffff1916821790555b50565b6100cf60043560005433600160a060020a039081169116146103535761019d565b61021460055481565b61021e6100d5565b6102146004356005545b919050565b61021460035481565b61021460045481565b6004803590556100cf565b61021460025481565b61021460043560006101dc565b6060908152602090f35b600160a060020a03166060908152602090f35b33600160a060020a031660008181526001602081905260409182902034908190556002805490920190915560609283526080527fe1fffcc4923d04b559f4d29a8bfc6cda04eb5b0d3c460751c2402c5c5cc9109c91a15b565b600160a060020a03831681526001602052604081205482141561034e575030600160a060020a0381163182901061034e57600160a060020a038316600083606082818181858883f1505060408051938452602084019190915280517fbb28353e4598c3b9199101a66e0989549b659a59a54d2c27fbb183f1932c8e6d938190039091019150a160006001600050600085600160a060020a03168152602001908152602001600020600050819055506002600081815054809291906001900391905055505b505050565b60035556",
    unlinked_binary: "606060405260008054600160a060020a0319163317815560646003556002819055600455610320600555610358806100376000396000f3606060405236156100cf5760e060020a600035046312065fe081146100d157806313381fbf146100da57806324a85aac146100f25780634d995805146101045780636120326514610118578063705099b91461012a57806383197ef01461014f578063a2a468bb14610177578063a977c71e146101a0578063b69ef8a8146101c1578063c5a87e00146101ca578063cc796cc9146101d2578063cebe09c9146101e1578063d96f4385146101ea578063eba7580c146101f3578063ec3a6f73146101fe578063fffcd07c14610207575b005b6102145b600090565b61021460043560016020526000908152604090205481565b61021e600654600160a060020a031681565b6100cf600254600354901061023157610002565b61021e600054600160a060020a031681565b6100cf6004356024356000805433600160a060020a0390811691161461028a5761034e565b6100cf60005433600160a060020a039081169116141561028857600054600160a060020a0316ff5b6100cf6004356006805473ffffffffffffffffffffffffffffffffffffffff1916821790555b50565b6100cf60043560005433600160a060020a039081169116146103535761019d565b61021460055481565b61021e6100d5565b6102146004356005545b919050565b61021460035481565b61021460045481565b6004803590556100cf565b61021460025481565b61021460043560006101dc565b6060908152602090f35b600160a060020a03166060908152602090f35b33600160a060020a031660008181526001602081905260409182902034908190556002805490920190915560609283526080527fe1fffcc4923d04b559f4d29a8bfc6cda04eb5b0d3c460751c2402c5c5cc9109c91a15b565b600160a060020a03831681526001602052604081205482141561034e575030600160a060020a0381163182901061034e57600160a060020a038316600083606082818181858883f1505060408051938452602084019190915280517fbb28353e4598c3b9199101a66e0989549b659a59a54d2c27fbb183f1932c8e6d938190039091019150a160006001600050600085600160a060020a03168152602001908152602001600020600050819055506002600081815054809291906001900391905055505b505050565b60035556",
    address: "0x2db1570dff1d14d844edf4fad09914f8615de2ba",
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
