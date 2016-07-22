import "Coin.sol";

contract UserChain {  // can be killed, so the owner gets sent the money in the end

    uint minBalance;

    struct Name {
        string first;
        string last;
    }

	address public owner;
	address public owner_address;

	address coinbank;

    string public first_name;
    string public last_name;

    Name public the_name;

    mapping (uint => string) public attribsMap;

    string public attributes;

	event SetAttribute(uint id, string attribute);
	event GetAttribute(address bank, uint id, string attribute);

	function UserChain(string fname, string lname, address new_owner, address bank) {
		owner = msg.sender;

        first_name = fname;
        last_name = lname;

        owner_address = new_owner;

        the_name = Name(first_name, last_name);

        coinbank = bank;
	}


    function setAttrib(uint id, string location) {
        SetAttribute(id, location);

        attribsMap[id] = location;
    }

    function getAttrib(uint id) returns (string res) {
        string value = attribsMap[id];

        GetAttribute(coinbank, id, value);

        Coin c = Coin(coinbank);



        GetAttribute(coinbank, c.getBalance(owner), "BAL");

     //   c.transfer(owner_address, 1);

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

