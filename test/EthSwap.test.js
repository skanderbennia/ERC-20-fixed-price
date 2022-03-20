const { assert } = require("chai");
const Token = artifacts.require("Token");

const EthSwap = artifacts.require("EthSwap");
//? this is our chai configuration in our smart contract
require("chai")
  .use(require("chai-as-promised"))
  .should();
//  this function convert wei to token(because our token have the save value of an ether)
const tokens = (n) => {
  return web3.utils.toWei(n, "ether");
};
function get_array() {
  return [1, 2, 3];
}
contract("EthSwap", function([deployer, investor]) {
  let token, ethSwap;
  before(async () => {
    token = await Token.new();
    ethSwap = await EthSwap.new(token.address);
    await token.transfer(ethSwap.address, tokens("1000000"));
  });
  describe("Token deployement", async () => {
    it("Contract has a name", async () => {
      //!  not deployed new : we use new in the test template
      const token = await Token.new();
      const name = await token.name();
      assert.equal(name, "DApp Token");
    });
  });
  describe("EthSwap deployement", async () => {
    it("Contract has a name", async () => {
      const name = await ethSwap.name();
      assert.equal(name, "EthSwap Instance Exchange");
    });
    it("Contract has token", async () => {
      let balance = await token.balanceOf(ethSwap.address);
      assert.equal(balance.toString(), tokens("1000000"));
    });
  });
  describe("buyTokens()", async () => {
    let result;
    before(async () => {
      //  Purchase tokens before each example
      result = await ethSwap.buyTokens({
        from: investor,
        value: web3.utils.toWei("1", "ether"),
      });
    });
    it("Allows user to instantly purchase tokens from ethSwap for a fixed price ", async () => {
      //   check investor token balance after purchase
      let investorBalance = await token.balanceOf(investor);
      assert.equal(investorBalance.toString(), tokens("100"));

      //    Check ethSwap balance after purchase
      let ethSwapBalance;
      ethSwapBalance = await token.balanceOf(ethSwap.address);
      assert.equal(ethSwapBalance.toString(), tokens("999900"));
      ethSwapBalance = await web3.eth.getBalance(ethSwap.address);
      assert.equal(ethSwapBalance.toString(), web3.utils.toWei("1", "Ether"));

      const event = result.logs[0].args;
      assert.equal(event.account, investor);
      assert.equal(event.token, token.address);
      assert.equal(event.amount.toString(), tokens("100").toString());
      assert.equal(event.rate.toString(), "100");
    });
  });
  describe("sellTokens()", async () => {
    let result;
    before(async () => {
      //  you can pass in the message an object that take as a parameter options { from : investor (account [1])}
      await token.approve(ethSwap.address, tokens("100"), { from: investor });
      result = await ethSwap.sellTokens(tokens("100"), { from: investor });
    });
    it("Allows user to instantly sell tokens from ethSwap for a fixed price ", async () => {
      let investorBalance = await token.balanceOf(investor);
      assert.equal(investorBalance.toString(), tokens("0"));

      let ethSwapBalance;
      ethSwapBalance = await token.balanceOf(ethSwap.address);
      assert.equal(ethSwapBalance.toString(), tokens("1000000"));
      ethSwapBalance = await web3.eth.getBalance(ethSwap.address);
      assert.equal(ethSwapBalance.toString(), web3.utils.toWei("0", "Ether"));

      const event = result.logs[0].args;
      assert.equal(event.account, investor);
      assert.equal(event.token, token.address);
      assert.equal(event.amount.toString(), tokens("100").toString());
      assert.equal(event.rate.toString(), "100");
      //  Failure investor can't sell more token than they  have
      await ethSwap.sellTokens(tokens("500"), { from: investor }).should.be
        .rejected;
    });
  });
});
