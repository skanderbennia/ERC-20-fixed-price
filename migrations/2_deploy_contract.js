const EthSwap = artifacts.require("EthSwap");
const Token = artifacts.require("Token");

module.exports = async function(deployer) {
  //! there is something very important you need to know :
  //! :P : you need to use await when you deploy contracts successively.
  // ! in this example if we didn't do that the ethSwap will be deployed before the token and like that there will be no transfer of tokens
  // ! to the ethSwap smartContract address
  // Deploy Token
  await deployer.deploy(Token);
  const token = await Token.deployed();
  // Deploy EthSwap
  //! here we did pass the token address because he have an token object in the params of the constructor of the EthSwap
  await deployer.deploy(EthSwap, token.address);
  const ethSwap = await EthSwap.deployed();
  // transfer all the token to the eth swap
  await token.transfer(ethSwap.address, "1000000000000000000000000");
};
