// Knows all about which page is loaded and responds to action to load new page.
var createStore = require('pure-flux').createStore
var dispatch = require('pure-flux').dispatch
var parsequery = require('functionfoundry/fn/parsequery')

function readLocation(state) {
  var path = window.location.pathname,
  search = window.location.search

  return {
    title: document.title,
    path,
    search,
    query: search && search.length > 0 ? parsequery(window.location.search) : {}
  }
}

var store = createStore( 'location', ( state={ path: null }, action ) => {

  // before action types don't change store state
  if (action.type === 'beforeOpenPath' || action.type === 'beforeRedirectPath') {
    return state;
  }

  return readLocation()

}, {
  open: (state, path) => {
    return (dispatch('beforeOpenPath', path)
    .then( () => Promise.resolve(history.pushState({ path },  document.title, path)) )
    .then( () => dispatch('openPath', path) ))
  },
  redirect: (state, path) => {
    return (dispatch('beforeRedirectPath', path)
    .then( () => Promise.resolve(history.replaceState({ path },  document.title, path)) )
    .then( () => dispatch('redirectPath', path) ))
  }
})

window.addEventListener('popstate', function(event) {
  store.redirect( window.location.pathname )
});

module.exports = store
