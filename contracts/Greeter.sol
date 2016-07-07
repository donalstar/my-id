contract mortal {

address owner; function mortal() { owner = msg.sender; } function kill() { if (msg.sender == owner) suicide(owner); } }

contract Greeter is mortal {


string greeting;


function Greeter() public {
greeting = "Blah";

}


function greet() constant returns (string) { return greeting; } }
