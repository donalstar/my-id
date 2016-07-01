contract Mortal {
    address owner;

    function Mortal() {
        owner = msg.sender;
    }

    function kill() {
        if (msg.sender == owner)
            suicide(owner);
    }

}

contract Greeter is Mortal {
    string greeting;

    function Greeter() public {
       greeting = "hello";
    }

    function greet() constant returns (string) {
        return greeting;
    }

}