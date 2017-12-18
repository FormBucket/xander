import React from 'react';
import {render} from 'react-dom'
let router = require('rootr')
let { getState, getStores, subscribe, composeStore, createStore, dispatch, promiseAction, replaceReducer } = require('fluxury')
let Container = require('./container');
let connectStore = require('./connect').connectStore;
let connect = require('./connect').connect;

let xander  = ({routes, debug}) => {

  // load the routes
  if(routes) router.loadRoutes(routes);

  // enable console tools when debug enabled.
  if (debug === true) {
    window.router = router
    subscribe( (state, action) => console.log('action', action))
  }

  return connect(Container)
};

xander.boot = (options) => {
  let App = xander(options);
  render( <App />, options.rootEl || document.body);
};

// Export static functions
xander.Link = require('./link');
xander.Container = Container;
xander.connect = connect;
xander.connectStore = connectStore;
xander.createStore = createStore;
xander.composeStore = composeStore;
xander.dispatch = dispatch;
xander.subscribe = subscribe;
xander.getState = getState;
xander.replaceReducer = replaceReducer;
xander.getStores = getStores;
xander.promiseAction = promiseAction;
xander.router = router;
xander.loadRoutes = router.loadRoutes;
xander.location = router.location;
xander.default = xander;
xander.openPath = (path) => router.location.open(path);

module.exports = xander
