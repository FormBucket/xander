/**
 * Copyright (c) 2015-2018, JC Fisher
 */

import React from "react";
import { render } from "react-dom";
import router from "./router";
import {
  getState,
  getStores,
  subscribe,
  createStore,
  dispatch,
  promiseAction,
  replaceReducer
} from "fluxury";
import loadable from "./loadable";
import Container from "./container";
import connect from "./connect";

let xander = ({ routes, debug }) => {
  // load the routes
  if (routes) router.loadRoutes(routes);

  // enable console tools when debug enabled.
  if (debug === true) {
    window.router = router;
    subscribe((state, action) => console.log("action", action));
  }

  return connect(Container);
};

xander.boot = options => {
  let App = xander(options);
  render(React.createElement(App), options.rootEl || document.body);
};
import Link from "./link";
import Eval from "./eval";
import Rule from "./rule";

// Export static functions
xander.Link = Link;
xander.Eval = Eval;
xander.Rule = Rule;
xander.loadable = loadable;
xander.Container = Container;
xander.connect = connect;
xander.createStore = createStore;
xander.dispatch = dispatch;
xander.subscribe = subscribe;
xander.getState = getState;
xander.replaceReducer = replaceReducer;
xander.getStores = getStores;
xander.promiseAction = promiseAction;
xander.router = router;
xander.loadRoutes = router.loadRoutes;
xander.default = xander;
xander.openPath = path => router.open(path);
module.exports = xander;
