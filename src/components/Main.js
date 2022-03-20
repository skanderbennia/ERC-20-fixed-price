import React, { Component } from "react";
import BuyForm from "./BuyForm";
import SellForm from "./SellForm";

export default class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentForm: "buy",
    };
  }
  render() {
    let content;
    if (this.state.currentForm === "buy") {
      content = <BuyForm {...this.props} />;
    } else {
      content = <SellForm {...this.props} />;
    }

    return (
      <div id="content" className="mt-3">
        <div className="d-flex justify-content-between mb-3">
          <button
            className="btn btn-light"
            onClick={(event) => {
              this.setState({ currentForm: "buy" });
            }}
          >
            Buy
          </button>
          <span className="text-muted">&lt; &nbsp; &gt;</span>
          <button
            className="btn btn-light"
            onClick={(event) => {
              this.setState({ currentForm: "sell" });
            }}
          >
            Sell
          </button>
        </div>
        {content}
      </div>
    );
  }
}
