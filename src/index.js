/**
 * Copyright (c) 2015-2018, JC Fisher
 */

import React, { createElement as h } from "react";
import { render as reactRender } from "react-dom";
import { dispatch } from "xander";
import Container from "./container";
import connect from "./connect";
import router from "./router";

export let app = ({ routes, debug }, rootEl) => {
  // load the routes
  if (routes) router.loadRoutes(routes);

  // enable console tools when debug enabled.
  if (debug === true) {
    window.router = router;
    subscribe((state, action) => console.log("action", action));
  }

  return connect(Container);
};

export let render = (options, rootEl) => {
  if (!rootEl) {
    console.log("rootEl must not be falsey");
    return;
  }
  reactRender(h(App(options)), rootEl);
};

export { dispatch, subscribe, createStore } from "xander";
export { default as router } from "./router";
export { default as Link } from "./link";
export { default as Eval } from "./eval";
export { default as Rule } from "./rule";
export { default as Container } from "./container";
export { default as connect } from "./connect";
export { default as loadable } from "./loadable";
export { default as loadWindowStore } from "./window";
