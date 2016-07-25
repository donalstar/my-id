import "Coin.sol";

contract IdStore {  // can be killed, so the owner gets sent the money in the end

    uint minBalance;

    struct Name {
        string first;
        string last;
    }

	address public owner;
	address public owner_address;

	address coinbank;

	uint price;

    string public first_name;
    string public last_name;

    Name public the_name;

    mapping (uint => string) public attribsMap;

    string public attributes;

    uint fi = 1 finney;

	event SetAttribute(uint id, string attribute);
	event GetAttribute(address msg_sender, address bank, address contract_owner, uint id, string attribute);

    event GetBalance(address owner_address, uint256 balance);

    event AccountBalance(string addr_name, address addr, uint amount);

    // Constructor
	function IdStore(string fname, string lname, address new_owner, uint transaction_price, address bank) {
		owner = msg.sender;

        first_name = fname;
        last_name = lname;

        owner_address = new_owner;

        the_name = Name(first_name, last_name);

        coinbank = bank;

        price = transaction_price;
	}

    function setAttribute(uint id, string location) {
        SetAttribute(id, location);

        attribsMap[id] = location;
    }

    function getAttribute(uint id) returns (string res) {
        AccountBalance("tx.origin", tx.origin, tx.origin.balance);

        string value = attribsMap[id];

        GetAttribute(msg.sender, coinbank, owner_address, id, value);

        Coin c = Coin(coinbank);

        if (tx.origin.balance < 5 finney) {
            AccountBalance("TOP UP!!", tx.origin, tx.origin.balance);

            c.topUp(10 finney);
        }

        c.transfer(owner_address, price);

        return value;
    }

    // Attributes
    function setAttributes(string location) public {
        attributes = location;
    }

	function destroy() {
		if (msg.sender == owner) { // without this funds could be locked in the contract forever!
			suicide(owner);
		}
	}

	/* This unnamed function is called whenever someone tries to send ether to it */
    function () {
        throw;     // Prevents accidental sending of ether
    }

}

