import React, { Component } from "react";
import Web3 from "web3";
import NavBar from "./NavBar";
import EthSwap from "../abis/EthSwap.json";
import Token from "../abis/Token.json";
import Main from "./Main";
import "./App.css";

class App extends Component {
  async componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
  }
  async loadBlockchainData() {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });
    const ethBalance = await web3.eth.getBalance(this.state.account);
    this.setState({ ethBalance });
    const networkId = await web3.eth.net.getId();
    const tokenData = Token.networks[networkId];
    //  if token data then get address
    if (tokenData) {
      // load token
      const token = new web3.eth.Contract(Token.abi, tokenData.address);
      this.setState({ token });
      let tokenBalance = await token.methods
        .balanceOf(this.state.account)
        .call();
      this.setState({ tokenBalance: tokenBalance });
    } else {
      window.alert("Token contract not deployed to ");
    }
    const ethSwapData = EthSwap.networks[networkId];
    //  if token data then get address
    if (ethSwapData) {
      // load EthSwap
      const ethSwap = new web3.eth.Contract(EthSwap.abi, ethSwapData.address);
      this.setState({ ethSwap });
    } else {
      window.alert("Token contract not deployed to ");
    }
    this.setState({ loading: false });
  }
  constructor(props) {
    super(props);
    this.state = {
      token: {},
      account: "",
      ethBalance: "",
      tokenBalance: "0",
      ethSwap: {},
      loading: true,
    };
  }
  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  }
  buyTokens = (etherAmount) => {
    this.setState({ loading: true });
    this.state.ethSwap.methods
      .buyTokens()
      .send({ from: this.state.account, value: etherAmount })
      .on("transactionHash", (hash) => {
        this.setState({ loading: false });
      });
  };
  sellTokens = (tokenAmount) => {
    this.setState({ loading: true });
    this.state.token.methods
      .approve(this.state.ethSwap.address, tokenAmount)
      .send({ from: this.state.account });
    this.state.ethSwap.methods
      .sellTokens(tokenAmount)
      .send({ from: this.state.account })
      .on("transactionHash", (hash) => {
        this.setState({ loading: false });
      });
  };
  render() {
    let content;

    if (this.state.loading) {
      content = (
        <p id="loader" className="text-center">
          Loading ...
        </p>
      );
    } else {
      content = (
        <Main
          ethBalance={this.state.ethBalance}
          tokenBalance={this.state.tokenBalance}
          buyTokens={this.buyTokens}
          sellTokens={this.sellTokens}
        />
      );
    }
    return (
      <div>
        <NavBar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">{content}</div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
