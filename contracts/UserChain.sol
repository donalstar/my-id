contract UserChain {  // can be killed, so the owner gets sent the money in the end

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

	mapping (address => uint) public registrantsPaid;

    uint TYPE_SSN = 1;
    uint TYPE_DL = 2;

	mapping (uint => string) public attributes;

	uint public quota;
    string public ssn_address;
    uint public balance;

    string public first_name;
    string public last_name;

    Name public the_name;

    Attributes public the_attributes;

	event GetSSN(string ssn_address);

	function UserChain(string fname, string lname, address new_owner) {
		owner = msg.sender;
		quota = 100;
		balance = 800;

        ssn_address = "0";

        first_name = fname;
        last_name = lname;

        owner_address = new_owner;

        the_name = Name(first_name, last_name);

        attributes[TYPE_SSN] = "0";

        the_attributes.ssn = "0";
        the_attributes.dl = "0";
	}

    function setAttribute(uint id, string location) {
        if (id == TYPE_SSN) {
            the_attributes.ssn = location;
        }
        else if (id == TYPE_DL) {
            the_attributes.dl = location;
        }
        else {
            throw;
        }
    }

    // SSN
    function setSSN(string location) public {
       ssn_address = location;

      // attributes[TYPE_SSN] = location;
    }

    function getSSN() public returns (string) {
        return ssn_address;
    }

    // Attribute

    function setDL(string location) public {
        the_attributes.dl = location;
    }

    function getDL() public returns (string) {
        return the_attributes.dl;
    }


	function changeQuota(uint newquota) public {
		if (msg.sender != owner) { return; }
		quota = newquota;
	}

    function getBalance() public returns (uint balance) {
        return balance;
    }

	function destroy() {
		if (msg.sender == owner) { // without this funds could be locked in the contract forever!
			suicide(owner);
		}
	}
}
