contract UserChain {  // can be killed, so the owner gets sent the money in the end

	address public owner;
	mapping (address => uint) public registrantsPaid;
	uint public numRegistrants;
	uint public quota;
    string public ssn_address;
    uint public balance;
    address public dl;

    string public location;

    uint public value;

	event GetSSN(string ssn_address);

	event Refund(address _to, uint _amount); // so you can log the event

    event SetOwner(address _owner);

	function UserChain(address account_address) {
		quota = 100;
		numRegistrants = 0;
		balance = 800;

		value = 0;

        ssn_address = "0";

        owner = account_address;
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

    function setValue(uint new_value) public {
        value = new_value;
    }

    function getValue() returns(uint) {
    	return value;
  	}

    function setLocation(string loc_address) {
        location = loc_address;
    }

    function getLocation() returns(string) {
        return location;
    }

    function setOwner(address new_owner) {
        if (msg.sender != owner) { return; }

        SetOwner(new_owner);

        owner = new_owner;
    }

	function buyTick() public {
		if (numRegistrants >= quota) { 
			throw; // throw ensures funds will be returned
		}
		registrantsPaid[msg.sender] = msg.value;
		numRegistrants++;
	}

	function changeQuota(uint newquota) public {
		if (msg.sender != owner) { return; }
		quota = newquota;
	}

	function refundTicket(address recipient, uint amount) public {
		if (msg.sender != owner) { return; }
		if (registrantsPaid[recipient] == amount) { 
			address myAddress = this;
			if (myAddress.balance >= amount) { 
				recipient.send(amount);
				Refund(recipient, amount);
				registrantsPaid[recipient] = 0;
				numRegistrants--;
			}
		}
		return;
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
