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
} from "xander";
import loadable from "./loadable";
import Container from "./container";
import connect from "./connect";

let hrx = ({ routes, debug }) => {
  // load the routes
  if (routes) router.loadRoutes(routes);

  // enable console tools when debug enabled.
  if (debug === true) {
    window.router = router;
    subscribe((state, action) => console.log("action", action));
  }

  return connect(Container);
};

hrx.boot = options => {
  let App = hrx(options);
  render(React.createElement(App), options.rootEl || document.body);
};
import Link from "./link";
import Eval from "./eval";
import Rule from "./rule";

// Export static functions
hrx.Link = Link;
hrx.Eval = Eval;
hrx.Rule = Rule;
hrx.loadable = loadable;
hrx.loader = loader => loadable({ loader });
hrx.Container = Container;
hrx.connect = connect;
hrx.createStore = createStore;
hrx.dispatch = dispatch;
hrx.subscribe = subscribe;
hrx.getState = getState;
hrx.replaceReducer = replaceReducer;
hrx.getStores = getStores;
hrx.promiseAction = promiseAction;
hrx.router = router;
hrx.loadRoutes = router.loadRoutes;
hrx.__esModule = true;
hrx.default = hrx;
hrx.openPath = path => router.open(path);
module.exports = hrx;
