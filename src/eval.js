import React from "react";
import { run } from "formula";

class Eval extends React.Component {
  render() {
    return (
      <div style={this.props.style} className={this.props.className}>
        {run(this.props.exp, this.props.values || {})}
      </div>
    );
  }
}

export default Eval;
