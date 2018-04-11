/**
 * Copyright (c) 2015-2018, JC Fisher
 */

import React, { createElement as h } from "react";
import { subscribe, getState } from "fluxury";

function connect(Composed) {
  return class Connect extends React.PureComponent {
    constructor(props) {
      super(props);
      this.state = getState();
      this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
      this.token = subscribe(this.handleChange);
    }

    componentWillUnmount() {
      if (typeof this.token === "function") {
        this.token();
      }
    }

    handleChange(state) {
      this.setState(state);
    }

    render() {
      return h(Composed, Object.assign({}, this.state, this.props));
    }
  };
}

export default connect;
