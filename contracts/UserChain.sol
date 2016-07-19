contract UserChain {  // can be killed, so the owner gets sent the money in the end

    uint minBalance;

    struct Name {
        string first;
        string last;
    }

    struct Attributes {
        string ssn;
        string dl;
    }

	address public owner;
	address public owner_address;

    uint TYPE_SSN = 0;
    uint TYPE_DL = 1;

    string public first_name;
    string public last_name;

    Name public the_name;

    Attributes public the_attributes;

    mapping (uint => string) public attribsMap;

    string public attributes;

	event SetAttribute(uint id, string attribute);
	event GetAttribute(uint id, string attribute);

	function UserChain(string fname, string lname, address new_owner) {
		owner = msg.sender;

        first_name = fname;
        last_name = lname;

        owner_address = new_owner;

        the_name = Name(first_name, last_name);

        attributes = "0";
	}


    function setAttrib(uint id, string location) {
        SetAttribute(id, location);

        attribsMap[id] = location;
    }

    function getAttrib(uint id) constant returns (string res) {
        return attribsMap[id];
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

