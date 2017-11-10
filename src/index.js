var spago = require('rootr')

spago.Link = require('./link');
spago.Container = require('./container');
spago.connectStore = require('./connect');
spago.createStore = require('fluxury').createStore;
spago.composeStore = require('fluxury').composeStore;
spago.router = spago;
spago.default = spago;

module.exports = spago;
