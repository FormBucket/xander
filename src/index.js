let router = require('rootr')
let xander  = (opts) => {
  if(opts.routes) router.loadRoutes(routes) 
}
xander.Link = require('./link');
xander.Container = require('./container');
xander.connectStore = require('./connect');
xander.createStore = require('fluxury').createStore;
xander.composeStore = require('fluxury').composeStore;
xander.getStores = require('fluxury').getStores;
xander.replaceReducer = require('fluxury').replaceReducer;
xander.getStores = require('fluxury').getStores;
xander.router = router;
xander.loadRoutes = router.loadRoutes;
xander.location = router.location;
xander.default = xander;
xander.openPath = (path) => router.location.open(path)

module.exports = xander
