/**
 * Copyright (c) 2015-2018, JC Fisher
 */
// Inspired by react-loadable
import React, { createElement as h } from "react";

let DefaultEmpty = () => null;
let DefaultLoading = props =>
  props.error ? h("div", null, "Error!") : h("div", null, "Loading...");

let Loadable = function(options) {
  return class LoadableComponent extends React.Component {
    constructor() {
      super();
      this.state = {
        cmp: null,
        error: null,
        loading: DefaultEmpty,
        timedOut: true
      };
    }

    componentWillMount() {
      let { cmp } = this.state;
      let { loading, loader, delay } = options;
      if (!loader) throw Error("loader component expected to be initialized!");

      // setTimeout to show loading component.
      setTimeout(() => {
        // don't set loading if cmp is already loaded.
        if (!this.state.cmp) {
          this.setState({
            loading: loading || DefaultLoading
          });
        }
      }, delay || 167); // 10 frames at 16.7ms

      // setTimeout to handle loading timeout.
      setTimeout(() => {
        if (!this.state.cmp) {
          this.setState({ timedOut: true });
        }
      });

      // resolve ES6 modules to default.
      function resolve(cmp) {
        return cmp.__esModule ? cmp.default : cmp;
      }

      loader()
        .then(cmp => this.setState({ cmp: resolve(cmp) }))
        .catch(error => this.setState({ error }));
    }

    render() {
      let { cmp, error, loading } = this.state;

      if (cmp !== null) {
        return h(cmp, this.props);
      }

      return h(loading, {
        error: this.state.error,
        timedOut: this.state.timedOut
      });
    }
  };
};

export default Loadable;
