import React, { Component } from "react";
import tokenLogo from "../token-logo.png";
import ethLogo from "../eth-logo.png";

export default class BuyForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ouput: "0",
    };
  }
  render() {
    console.log(this.props);
    return (
      <form
        className="mb-3 "
        onSubmit={(event) => {
          event.preventDefault();
          let etherAmount;
          etherAmount = this.input.value.toString();
          // convert from ether to wei
          etherAmount = window.web3.utils.toWei(etherAmount, "Ether");
          this.props.buyTokens(etherAmount);
        }}
        style={{
          width: "600px",
          border: "3px solid lightgrey",
          padding: "20px 10px",
        }}
      >
        <div>
          <label className="float-left">
            <b>Input</b>
          </label>
          <span className="float-right text-muted">
            Balance: {window.web3.utils.fromWei(this.props.ethBalance, "Ether")}
          </span>
        </div>
        <div className="input-group mb-4 ">
          <input
            type="text"
            onChange={(event) => {
              const etherAmount = this.input.value.toString();
              this.setState({
                output: etherAmount * 100,
              });
            }}
            ref={(input) => {
              this.input = input;
            }}
            className="form-control form-control-lg"
            placeholder="0"
            required
          />
          <div className="input-group-append">
            <div className="input-group-text">
              <img src={ethLogo} height="32" alt="" />
              &nbsp;&nbsp;&nbsp; ETH
            </div>
          </div>
        </div>
        <div>
          <label className="float-left">
            <b>Output</b>
          </label>
          <span className="float-right text-muted">
            Balance:{" "}
            {window.web3.utils.fromWei(
              this.props.tokenBalance.toString(),
              "Ether"
            )}
          </span>
        </div>
        <div className="input-group mb-2">
          <input
            type="text"
            className="form-control form-control-lg"
            placeholder="0"
            value={this.state.output}
            disabled
          />
          <div className="input-group-append">
            <div className="input-group-text">
              <img src={tokenLogo} height="32" alt="" />
              &nbsp; Bennia
            </div>
          </div>
        </div>
        <div className="mb-5">
          <span className="float-left text-muted">Exchange Rate</span>
          <span className="float-right text-muted">1 ETH = 100 Bennia</span>
        </div>
        <button type="submit" className="btn btn-primary btn-block btn-lg">
          SWAP!
        </button>
      </form>
    );
  }
}
