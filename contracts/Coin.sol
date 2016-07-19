contract owned {
    address public owner;

    function owned() {
        owner = msg.sender;
    }

    modifier onlyOwner {
        if (msg.sender != owner) throw;
        _
    }

    function transferOwnership(address newOwner) onlyOwner {
        owner = newOwner;
    }
}



contract Coin is owned {
    uint256 public totalSupply;

    /* This creates an array with all balances */
    mapping (address => uint256) public balanceOf;

    string public name;
    string public symbol;
    uint8 public decimals;

    uint256 public sellPrice;
    uint256 public buyPrice;


    event TransferTokens(address indexed from, address indexed to, uint256 value);

    event BuyTokens(address indexed from, address indexed to, uint256 msgValue, uint256 buyPrice, uint256 value);

    event SellTokens(address indexed from, address indexed to, uint256 revenue, uint256 sellPrice, uint256 value);

    event GetBalance(address indexed addr, uint256 value);

    /* Initializes contract with initial supply tokens to the creator of the contract */

    mapping (address => bool) public frozenAccount;
    event FrozenFunds(address target, bool frozen);


    function Coin(uint256 initialSupply,
        string tokenName,
        uint8 decimalUnits,
        string tokenSymbol,
        address centralMinter) {

        if(centralMinter != 0 ) owner = centralMinter;

        totalSupply = initialSupply;

        balanceOf[msg.sender] = initialSupply;              // Give the creator all initial tokens
        name = tokenName;                                   // Set the name for display purposes
        symbol = tokenSymbol;                               // Set the symbol for display purposes
        decimals = decimalUnits;                            // Amount of decimals for display purposes
    }



    function transfer(address _to, uint256 _value) {
        if (frozenAccount[msg.sender]) throw;

        /* Check if sender has balance and for overflows */
        if (balanceOf[msg.sender] < _value || balanceOf[_to] + _value < balanceOf[_to])
            throw;

        /* Add and subtract new balances */
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;

        /* Notify anyone listening that this transfer took place */
        TransferTokens(msg.sender, _to, _value);
    }

    function mintToken(address target, uint256 mintedAmount) onlyOwner {
        balanceOf[target] += mintedAmount;
        totalSupply += mintedAmount;
        TransferTokens(0, owner, mintedAmount);
        TransferTokens(owner, target, mintedAmount);
    }

    function freezeAccount(address target, bool freeze) onlyOwner {
        frozenAccount[target] = freeze;
        FrozenFunds(target, freeze);
    }



    function setPrices(uint256 newSellPrice, uint256 newBuyPrice) onlyOwner {
        sellPrice = newSellPrice;
        buyPrice = newBuyPrice;
    }


    function buy() returns (uint amount){
        amount = msg.value / buyPrice;                     // calculates the amount
        if (balanceOf[this] < amount) throw;               // checks if it has enough to sell
        balanceOf[msg.sender] += amount;                   // adds the amount to buyer's balance
        balanceOf[this] -= amount;                         // subtracts amount from seller's balance
        BuyTokens(this, msg.sender, msg.value, buyPrice, amount);                // execute an event reflecting the change
        return amount;                                     // ends function and returns
    }

    function sell(uint amount) returns (uint revenue){
        if (balanceOf[msg.sender] < amount ) throw;        // checks if the sender has enough to sell
        balanceOf[this] += amount;                         // adds the amount to owner's balance
        balanceOf[msg.sender] -= amount;                   // subtracts the amount from seller's balance
        revenue = amount * sellPrice;
        if (!msg.sender.send(revenue)) {                    // sends ether to the seller
            balanceOf[msg.sender] += amount;
        }

        SellTokens(this, msg.sender, revenue, sellPrice, amount);

        return revenue;                                    // ends function and returns
    }

    function getBalance(address addr) returns(uint) {
        GetBalance(addr, balanceOf[addr]);

    	return balanceOf[addr];
    }
}



