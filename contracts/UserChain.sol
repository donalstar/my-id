contract UserChain {  // can be killed, so the owner gets sent the money in the end

	address public organizer;
	mapping (address => uint) public registrantsPaid;
	uint public numRegistrants;
	uint public quota;
    uint public ssn;
    uint public balance;
    address public dl;

	event Deposit(address _from, uint _amount); // so you can log the event
	event Refund(address _to, uint _amount); // so you can log the event

	function UserChain() {
		organizer = msg.sender;		
		quota = 100;
		numRegistrants = 0;
		ssn = 0;
		balance = 800;
	}

    function setSSN(uint newssn) public {
        ssn = newssn;
    }

    function setDL(address dl_address) public {
        dl = dl_address;
    }

	function buyTick() public {
		if (numRegistrants >= quota) { 
			throw; // throw ensures funds will be returned
		}
		registrantsPaid[msg.sender] = msg.value;
		numRegistrants++;
		Deposit(msg.sender, msg.value);
	}

	function changeQuota(uint newquota) public {
		if (msg.sender != organizer) { return; }
		quota = newquota;
	}

	function refundTicket(address recipient, uint amount) public {
		if (msg.sender != organizer) { return; }
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

    function getSSN(address addr) public returns (uint ssn) {
        return ssn;
    }

    function getDL() returns (address dl) {
        return dl;
    }

    function getBalance() public returns (uint balance) {
        return balance;
    }

    function getValu(address addr) returns(uint) {
    	return balance;
  	}


	function destroy() {
		if (msg.sender == organizer) { // without this funds could be locked in the contract forever!
			suicide(organizer);
		}
	}
}
