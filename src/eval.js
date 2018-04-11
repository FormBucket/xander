/**
 * Copyright (c) 2015-2018, JC Fisher
 */

import React, { createElement as h } from "react";
import { RUN as run } from "formula";

class Eval extends React.Component {
  render() {
    return h("div", this.props, run(this.props.exp, this.props.values || {}));
  }
}

export default Eval;
