// Copyright 2017 JC Fisher

import React from "react";
import { render } from "react-dom";
let router = require("./router");
let {
  getState,
  getStores,
  subscribe,
  createStore,
  dispatch,
  promiseAction,
  replaceReducer
} = require("fluxury");
let Container = require("./container");
let connectStore = require("./connect").connectStore;
let connect = require("./connect").connect;

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
  render(<App />, options.rootEl || document.body);
};

// Export static functions
xander.Link = require("./link");
xander.Eval = require("./eval");
xander.Rule = require("./rule");
xander.Container = Container;
xander.connect = connect;
xander.connectStore = connectStore;
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
