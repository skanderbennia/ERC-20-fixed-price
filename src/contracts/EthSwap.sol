pragma solidity ^0.5.0;
import "./Token.sol";
contract EthSwap{
    string public name = "EthSwap Instance Exchange";
    Token public token;
    uint public rate = 100;
    constructor(Token _token) public {
        token = _token;
    }
    event TokensPurchased(address account, address token, uint amount, uint rate);
    event TokensSold(address account, address token, uint amount, uint rate);
    // when ever we want to pay something the function need to be payable
    function buyTokens()  public payable{
        // Redemption rate = # of tokens they receive for 1 ether
        
        //  Amount of Ethereum * Redemption rate
        // calculate the number of token to buy
        uint tokenAmount = msg.value * rate;
        require(token.balanceOf(address(this))>=tokenAmount); 
        token.transfer(msg.sender,tokenAmount);
        
        // Emit an event 
        emit TokensPurchased(msg.sender, address(token),tokenAmount, rate);
    }
    function sellTokens(uint _amount) public {
        // User can't sell more tokens than they have
        require(token.balanceOf(msg.sender)>= _amount);
        // perform sale
        //  calculate the amount of eth to redeem
        uint ethAmount = _amount/rate;

        require(address(this).balance >=ethAmount);
        token.transferFrom(msg.sender,address(this), _amount);
        msg.sender.transfer(ethAmount);

        // emit an event
        emit TokensSold(msg.sender, address(token),_amount, rate);
    }
}