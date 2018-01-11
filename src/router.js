var createStore = require('fluxury').createStore;
var dispatch = require('fluxury').dispatch;
var pathToRegexp = require('./pathToRegexp');
let pathRegexps = {};
let isobject = require('formula/fn/isobject');
let isfunction = require('formula').isfunction;
let parseQuery = require('formula').parsequery;

function readLocation(state) {
    var pathname = window.location.pathname,
        search = window.location.search;

    return {
        title: document.title,
        pathname: window.location.pathname,
        search: window.location.search,
        hash: window.location.hash,
        query: search && search.length > 0 ? parseQuery(window.location.search) : {}
    };
}

// Return the first matching route.
function match(routes=[], path) {
  for (var i = 0; i < routes.length; i++) {
    var re = pathRegexps[routes[i].path] || pathToRegexp(routes[i].path);
    pathRegexps[routes[i].path] = re;

    if (re && re.test(path)) {
      return { re, route: routes[i] };
    }
  }

  return false;
}


// Create a store with options:
//
// - routes - [{ path: "/buckets/:id", action: Promise }]
//   A list of routes that specify a URL path and an action that must return a promise to the page content.
module.exports = createStore( 'router', (state={ location: readLocation(), routes: [] }, action) => {

    let location = state.location;
    switch (action.type) {
    case 'openPath':
    case 'redirectPath':
    case 'windowPopState':
        location = readLocation();
    }

  if (false == (action.type == 'loadRoutes' || action.type == 'loadContent' || action.type == 'openPath' || action.type == 'redirectPath' || action.type == 'windowPopState')) {
    return state;
  }

  var {routes, content} = state;

  if (action.type === 'loadContent') {
    // console.log('loadContent in router', state, action)
    return Object.assign({}, state, { location, content: isobject(action.data) && action.data.default ? action.data.default : action.data });
  }

  if (action.type === 'loadRoutes'){
    routes = action.data;
  }

  var ls = location;
  var pathname = ls.pathname;

  // console.log('current path', pathname)

  // Match routes
  var found = match( routes, pathname );

  if (!found) {
    console.warn("not found", pathname, routes);
    return state;
  }

  var {re, route} = found;



  if (!route) {
    console.warn('no route!');
    return state;
  }
  // extract parameters
  var paramNames = re.exec(route.path).slice(1);
  var args = re.exec(pathname).slice(1);

  // zip into object { key: value }
  var params = paramNames.length === args.length ?
      paramNames.reduce( (acc, key, i) => { acc[key.substring(1)] = args[i]; return acc; }, {}) :
      {};


  if (state.route && state.route === route && state.params === params) {
    // console.log('same route and params')
    return state;
  }

  // console.log('CHECK', route, typeof route.load)
  if (found && route.component) {
    // console.log('COMPONENT', route.component)
    content = route.component;
  } else if (found && route && route.load) {
    // console.log('ASYNC', route, content)
    // run the action method defined by the router
    let loader = route.load;

    if (isfunction(loader)) {
      // console.log("THUNK", route, typeof route.load)
      loader = route.load(params);
    }

    if (isfunction(loader)) {
      content = loader;
    } else if (isobject(loader) && loader.then) {
      // console.log("THEN", route)
      loader.then( (cmp) => dispatch('loadContent', cmp) );
    }
  }

  // console.log('EXIT', pathname, route.path, content)

  return { location, routes, route, params, args, content };

}, {
  loadRoutes: (state, routes) => dispatch('loadRoutes', routes),
  loadContent: (state, cmp) => dispatch('loadRoutes', cmp),
  open: (state, path) => {
    history.pushState({ path }, document.title, path);
    return dispatch('openPath', path);
  },
  redirect: (state, path) => {
    history.replaceState({ path }, document.title, path);
    return dispatch('redirectPath', path);
  }
});

window.addEventListener('popstate', function(event) {
  dispatch('windowPopState')
});
