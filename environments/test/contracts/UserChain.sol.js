// Factory "morphs" into a Pudding class.
// The reasoning is that calling load in each context
// is cumbersome.

(function() {

  var contract_data = {
    abi: [{"constant":false,"inputs":[],"name":"getBalance","outputs":[{"name":"balance","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"registrantsPaid","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":false,"inputs":[],"name":"getValue","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[],"name":"dl","outputs":[{"name":"","type":"address"}],"type":"function"},{"constant":true,"inputs":[],"name":"value","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":false,"inputs":[],"name":"buyTick","outputs":[],"type":"function"},{"constant":true,"inputs":[],"name":"location","outputs":[{"name":"","type":"string"}],"type":"function"},{"constant":false,"inputs":[{"name":"new_value","type":"uint256"}],"name":"setValue","outputs":[],"type":"function"},{"constant":true,"inputs":[],"name":"organizer","outputs":[{"name":"","type":"address"}],"type":"function"},{"constant":false,"inputs":[{"name":"recipient","type":"address"},{"name":"amount","type":"uint256"}],"name":"refundTicket","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"loc_address","type":"string"}],"name":"setLocation","outputs":[],"type":"function"},{"constant":false,"inputs":[],"name":"destroy","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"dl_address","type":"address"}],"name":"setDL","outputs":[],"type":"function"},{"constant":false,"inputs":[],"name":"getSSN","outputs":[{"name":"","type":"string"}],"type":"function"},{"constant":false,"inputs":[{"name":"newquota","type":"uint256"}],"name":"changeQuota","outputs":[],"type":"function"},{"constant":true,"inputs":[],"name":"balance","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":false,"inputs":[{"name":"location","type":"string"}],"name":"setSSN","outputs":[],"type":"function"},{"constant":false,"inputs":[],"name":"getDL","outputs":[{"name":"dl","type":"address"}],"type":"function"},{"constant":false,"inputs":[],"name":"getLocation","outputs":[{"name":"","type":"string"}],"type":"function"},{"constant":true,"inputs":[],"name":"quota","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[],"name":"ssn_address","outputs":[{"name":"","type":"string"}],"type":"function"},{"constant":true,"inputs":[],"name":"numRegistrants","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"inputs":[],"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_from","type":"address"},{"indexed":false,"name":"_amount","type":"uint256"}],"name":"Deposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_to","type":"address"},{"indexed":false,"name":"_amount","type":"uint256"}],"name":"Refund","type":"event"}],
    binary: "60008054600160a060020a0319163317815560646003556002818155610320600555600a60085560a0604052600160608190527f300000000000000000000000000000000000000000000000000000000000000060805260048054938190527f300000000000000000000000000000000000000000000000000000000000000281559260d6926020601f9383161561010002600019019092160491909101047f8a35acfbc15ff81a39ae7d344fd709f28e8600b4aa8c65c6b64bfe7fe36bd19b908101905b8082111560e6576000815560010160c4565b5050610781806100ea6000396000f35b509056606060405236156101065760e060020a600035046312065fe0811461010857806313381fbf14610112578063209652551461012a57806324a85aac146101355780633fa4f245146101475780634d99580514610150578063516f279e1461016357806355241077146101c157806361203265146101d0578063705099b9146101e2578063827bfbdf1461020857806383197ef0146102b4578063a2a468bb146102dd578063a52bb3ab14610303578063a977c71e1461036d578063b69ef8a81461038e578063c092e1c314610397578063c5a87e001461042b578063ce2ce3fc14610433578063cebe09c91461049d578063d8dd7a6a146104a6578063ec3a6f7314610506575b005b61050f5b60005b90565b61050f60043560016020526000908152604090205481565b61050f60085461010f565b610521600654600160a060020a031681565b61050f60085481565b610106600354600254106105ac57610002565b61053e6007805460408051602060026001851615610100026000190190941693909304601f810184900484028201840190925281815292918301828280156106395780601f1061060e57610100808354040283529160200191610639565b61010660043560088190555b50565b610521600054600160a060020a031681565b61010660043560243560008054600160a060020a0390811633909116146106415761070c565b6040805160206004803580820135601f81018490048402850184019095528484526101069491936024939092918401919081908401838280828437509496505050505050508060076000509080519060200190828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061071157805160ff19168380011785555b5061070c9291505b8082111561074157600081556001016102a0565b610106600054600160a060020a0390811633909116141561060c57600054600160a060020a0316ff5b6006805473ffffffffffffffffffffffffffffffffffffffff1916600435179055610106565b60408051602081810183526000825260048054845160026001831615610100026000190190921691909104601f810184900484028201840190955284815261053e9490928301828280156107705780601f1061074557610100808354040283529160200191610770565b61010660043560005433600160a060020a0390811691161461077c576101cd565b61050f60055481565b6040805160206004803580820135601f81018490048402850184019095528484526101069491936024939092918401919081908401838280828437509496505050505050508060046000509080519060200190828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061071157805160ff1916838001178555610298565b61052161010c565b60408051602081810183526000825260078054845160026001831615610100026000190190921691909104601f810184900484028201840190955284815261053e9490928301828280156107705780601f1061074557610100808354040283529160200191610770565b61050f60035481565b61053e60048054604080516020601f600260001961010060018816150201909516949094049384018190048102820181019092528281529291908301828280156106395780601f1061060e57610100808354040283529160200191610639565b61050f60025481565b60408051918252519081900360200190f35b60408051600160a060020a03929092168252519081900360200190f35b60405180806020018281038252838181518152602001915080519060200190808383829060006004602084601f0104600f02600301f150905090810190601f16801561059e5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b33600160a060020a0316600081815260016020818152604092839020349081905560028054909301909255825193845283015280517fe1fffcc4923d04b559f4d29a8bfc6cda04eb5b0d3c460751c2402c5c5cc9109c9281900390910190a15b565b820191906000526020600020905b81548152906001019060200180831161061c57829003601f168201915b505050505081565b600160a060020a03831660009081526001602052604090205482141561070c575030600160a060020a0381163182901061070c57604051600160a060020a03841690600090849082818181858883f1505060408051938452602084019190915280517fbb28353e4598c3b9199101a66e0989549b659a59a54d2c27fbb183f1932c8e6d938190039091019150a160006001600050600085600160a060020a03168152602001908152602001600020600050819055506002600081815054809291906001900391905055505b505050565b82800160010185558215610298579182015b82811115610298578251826000505591602001919060010190610723565b5090565b820191906000526020600020905b81548152906001019060200180831161075357829003601f168201915b5050505050905061010f565b60035556",
    unlinked_binary: "60008054600160a060020a0319163317815560646003556002818155610320600555600a60085560a0604052600160608190527f300000000000000000000000000000000000000000000000000000000000000060805260048054938190527f300000000000000000000000000000000000000000000000000000000000000281559260d6926020601f9383161561010002600019019092160491909101047f8a35acfbc15ff81a39ae7d344fd709f28e8600b4aa8c65c6b64bfe7fe36bd19b908101905b8082111560e6576000815560010160c4565b5050610781806100ea6000396000f35b509056606060405236156101065760e060020a600035046312065fe0811461010857806313381fbf14610112578063209652551461012a57806324a85aac146101355780633fa4f245146101475780634d99580514610150578063516f279e1461016357806355241077146101c157806361203265146101d0578063705099b9146101e2578063827bfbdf1461020857806383197ef0146102b4578063a2a468bb146102dd578063a52bb3ab14610303578063a977c71e1461036d578063b69ef8a81461038e578063c092e1c314610397578063c5a87e001461042b578063ce2ce3fc14610433578063cebe09c91461049d578063d8dd7a6a146104a6578063ec3a6f7314610506575b005b61050f5b60005b90565b61050f60043560016020526000908152604090205481565b61050f60085461010f565b610521600654600160a060020a031681565b61050f60085481565b610106600354600254106105ac57610002565b61053e6007805460408051602060026001851615610100026000190190941693909304601f810184900484028201840190925281815292918301828280156106395780601f1061060e57610100808354040283529160200191610639565b61010660043560088190555b50565b610521600054600160a060020a031681565b61010660043560243560008054600160a060020a0390811633909116146106415761070c565b6040805160206004803580820135601f81018490048402850184019095528484526101069491936024939092918401919081908401838280828437509496505050505050508060076000509080519060200190828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061071157805160ff19168380011785555b5061070c9291505b8082111561074157600081556001016102a0565b610106600054600160a060020a0390811633909116141561060c57600054600160a060020a0316ff5b6006805473ffffffffffffffffffffffffffffffffffffffff1916600435179055610106565b60408051602081810183526000825260048054845160026001831615610100026000190190921691909104601f810184900484028201840190955284815261053e9490928301828280156107705780601f1061074557610100808354040283529160200191610770565b61010660043560005433600160a060020a0390811691161461077c576101cd565b61050f60055481565b6040805160206004803580820135601f81018490048402850184019095528484526101069491936024939092918401919081908401838280828437509496505050505050508060046000509080519060200190828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061071157805160ff1916838001178555610298565b61052161010c565b60408051602081810183526000825260078054845160026001831615610100026000190190921691909104601f810184900484028201840190955284815261053e9490928301828280156107705780601f1061074557610100808354040283529160200191610770565b61050f60035481565b61053e60048054604080516020601f600260001961010060018816150201909516949094049384018190048102820181019092528281529291908301828280156106395780601f1061060e57610100808354040283529160200191610639565b61050f60025481565b60408051918252519081900360200190f35b60408051600160a060020a03929092168252519081900360200190f35b60405180806020018281038252838181518152602001915080519060200190808383829060006004602084601f0104600f02600301f150905090810190601f16801561059e5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b33600160a060020a0316600081815260016020818152604092839020349081905560028054909301909255825193845283015280517fe1fffcc4923d04b559f4d29a8bfc6cda04eb5b0d3c460751c2402c5c5cc9109c9281900390910190a15b565b820191906000526020600020905b81548152906001019060200180831161061c57829003601f168201915b505050505081565b600160a060020a03831660009081526001602052604090205482141561070c575030600160a060020a0381163182901061070c57604051600160a060020a03841690600090849082818181858883f1505060408051938452602084019190915280517fbb28353e4598c3b9199101a66e0989549b659a59a54d2c27fbb183f1932c8e6d938190039091019150a160006001600050600085600160a060020a03168152602001908152602001600020600050819055506002600081815054809291906001900391905055505b505050565b82800160010185558215610298579182015b82811115610298578251826000505591602001919060010190610723565b5090565b820191906000526020600020905b81548152906001019060200180831161075357829003601f168201915b5050505050905061010f565b60035556",
    address: "0x3e6a9643ed7c3310f519188ccf01dad5384619fe",
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
