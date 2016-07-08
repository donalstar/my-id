contract UserChain {  // can be killed, so the owner gets sent the money in the end

    struct Name {
        string first;
        string last;
    }


	address public owner;
	address public owner_address;

	mapping (address => uint) public registrantsPaid;

	uint public quota;
    string public ssn_address;
    uint public balance;
    address public dl;

    string public first_name;
    string public last_name;

    Name public the_name;

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
	}

    // SSN
    function setSSN(string location) public {
       GetSSN(ssn_address);

       ssn_address = location;
    }

    function getSSN() public returns (string) {
        return ssn_address;
    }

    function setDL(address dl_address) public {
        dl = dl_address;
    }


	function changeQuota(uint newquota) public {
		if (msg.sender != owner) { return; }
		quota = newquota;
	}


    function getDL() returns (address dl) {
        return dl;
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
