let router = require('rootr')
let composeStore = require('fluxury').composeStore;
let { getStores } = require('fluxury')
let Container = require('./container');
let connectStore = require('./connect');

require('./windowStore');

let xander  = ({routes, debug}) => {

  // create store from all current stores.
  var store = composeStore( 'app', getStores() );

  // load the routes
  if(routes) router.loadRoutes(routes);

  // enable console tools when debug enabled.
  if (debug === true) {
    window.router = router
    store.subscribe( (state, action) => console.log('action', action))
  }

  // Create a react component connected to container
  // returns store and container.
  return { store, Container: connectStore(store, Container) };
}

xander.Link = require('./link');
xander.Container = Container;
xander.connectStore = connectStore;
xander.createStore = require('fluxury').createStore;
xander.composeStore = composeStore;
xander.getStores = require('fluxury').getStores;
xander.replaceReducer = require('fluxury').replaceReducer;
xander.getStores = require('fluxury').getStores;
xander.router = router;
xander.loadRoutes = router.loadRoutes;
xander.location = router.location;
xander.default = xander;
xander.openPath = (path) => router.location.open(path)

module.exports = xander
