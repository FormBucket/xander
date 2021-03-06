(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react'), require('react-dom'), require('formula')) :
	typeof define === 'function' && define.amd ? define(['exports', 'react', 'react-dom', 'formula'], factory) :
	(factory((global.xander = global.xander || {}),global.React,global.ReactDom,global.formula));
}(this, (function (exports,React,reactDom,formula) { 'use strict';

var React__default = 'default' in React ? React['default'] : React;

/* xander - Copyright 2015-2018 FormBucket.com */
// Based on Facebook's Flux dispatcher class.
function Dispatcher() {
  var lastId = 1;
  var prefix = "ID_";
  var callbacks = {};
  var isPending = {};
  var isHandled = {};
  var isDispatching = false;
  var pendingPayload = null;

  function invokeCallback(id) {
    isPending[id] = true;
    callbacks[id](pendingPayload);
    isHandled[id] = true;
  }

  this.register = function (callback) {
    var id = prefix + lastId++;
    callbacks[id] = callback;
    return id;
  };

  this.unregister = function (id) {
    if (!callbacks.hasOwnProperty(id))
      { return new Error("Cannot unregister unknown ID!"); }
    delete callbacks[id];
    return id;
  };

  this.waitFor = function (ids) {
    for (var i = 0; i < ids.length; i++) {
      var id = ids[id];
      if (isPending[id]) {
        return new Error("Circular dependency waiting for " + id);
      }

      if (!callbacks[id]) {
        return new Error(("waitFor: " + id + " is not a registered callback."));
      }

      invokeCallback(id);
    }

    return undefined;
  };

  this.dispatch = function (payload) {
    if (isDispatching) { return new Error("Cannot dispatch while dispatching."); }

    // start
    for (var id in callbacks) {
      isPending[id] = false;
      isHandled[id] = false;
    }

    pendingPayload = payload;
    isDispatching = true;

    // run each callback.
    try {
      for (var id in callbacks) {
        if (isPending[id]) { continue; }
        invokeCallback(id);
      }
    } finally {
      pendingPayload = null;
      isDispatching = false;
    }

    return payload;
  };
}

var rootState = Object.freeze({});
var stores = {};
var dispatcher = new Dispatcher();
var waitFor = dispatcher.waitFor.bind(dispatcher);
var rootListeners = [];
var rootNextListeners = [];

function copyIfSame(current, next) {
  if (current === next) { return current.slice(); }
  return next;
}

function updateRootState(name, newState) {
  var changes = {};
  changes[name] =
    typeof newState === "object" ? Object.freeze(newState) : newState;
  rootState = Object.assign({}, rootState, changes);
}

function rootNotify(action) {
  // notify root listeners
  var listeners = (rootListeners = rootNextListeners);
  for (var i = 0; i < listeners.length; i++) {
    var listener = listeners[i];
    listener(rootState, action);
  }
}

function subscribe(cb) {
  if (typeof cb !== "function") {
    throw "Listener must be a function";
  }

  // avoid mutating list that could be iterating during dispatch
  var subscribed = true;
  rootNextListeners = copyIfSame(rootListeners, rootNextListeners);

  rootNextListeners.push(cb);

  return function () {
    if (!subscribed) { return; }
    subscribed = false;

    rootNextListeners = copyIfSame(rootListeners, rootNextListeners);

    var index = rootNextListeners.indexOf(cb);
    rootNextListeners.splice(index, 1);
  };
}

function replaceState(newState) {
  rootState = newState;
}

function dispatch(action, data) {
  try {
    if (typeof action === "object" && typeof action.then === "function") {
      return action.then(function (result) {
        dispatch(result);
        return Promise.resolve(result);
      });
    } else if (typeof action === "object") {
    } else if (typeof action === "string") {
      action = { type: action, data: data };
    } else {
      return Promise.reject("Invalid action!");
    }

    // keep a reference to current rootState
    var currentState = rootState;

    // dispatch the action to the core dispatcher.
    dispatcher.dispatch(action);

    // notify if root state changes!
    if (currentState !== rootState) {
      rootNotify(action);
    }

    // Return a promise that resolves to the action.
    return Promise.resolve(action);
  } catch (e) {
    return Promise.reject(e);
  }
}

// construct a reducer method with a spec
function makeReducer(spec) {
  return function (state, action) {
    // Check if action has definition and run it if available.
    if (
      action &&
      typeof action.type === "string" &&
      spec.hasOwnProperty(action.type)
    ) {
      return spec[action.type](state, action.data, waitFor);
    }

    // Return current state when action has no handler.
    return state;
  };
}

function bindSelectors(name, selectors) {
  return Object.keys(selectors).reduce(function(a, b, i) {
    var newFunc = {};
    newFunc[b] = function() {
      var params = [], len = arguments.length;
      while ( len-- ) params[ len ] = arguments[ len ];

      return selectors[b].apply(selectors, [ rootState[name] ].concat( params ));
    };
    return Object.assign(a, newFunc);
  }, {});
}

function getState() {
  return rootState;
}

function getStores() {
  return stores;
}

function createStore(name, reducerOrSpec, selectors) {
  if ( selectors === void 0 ) selectors = {};

  if (typeof name !== "string") { throw "Expect name to be string."; }
  if (typeof reducerOrSpec !== "function" && typeof reducerOrSpec !== "object")
    { throw "Expect reducer to be function or object spec."; }
  if (typeof selectors !== "object") { throw "Expect selectors to be object."; }

  var isSpec = typeof reducerOrSpec === "object",
    reducer = isSpec ? makeReducer(reducerOrSpec) : reducerOrSpec,
    actions = {},
    currentListeners = [],
    nextListeners = [];

  updateRootState(
    name,
    isSpec
      ? reducerOrSpec.getInitialState
        ? reducerOrSpec.getInitialState()
        : undefined
      : reducer(undefined, {}, function () {})
  );

  rootNotify(undefined);

  var dispatchToken = dispatcher.register(function(action) {
    var newState = reducer(rootState[name], action, waitFor);
    if (rootState[name] !== newState) {
      updateRootState(name, newState);

      // avoid looping over potentially mutating list
      var listeners = (currentListeners = nextListeners);
      for (var i = 0; i < listeners.length; i++) {
        var listener = listeners[i];
        listener(newState, action);
      }
    }
  });

  function subscribe(cb) {
    if (typeof cb !== "function") {
      throw "Listener must be a function";
    }

    // avoid mutating list that could be iterating during dispatch
    var subscribed = true;
    nextListeners = copyIfSame(currentListeners, nextListeners);

    nextListeners.push(cb);

    return function () {
      if (!subscribed) { return; }
      subscribed = false;

      nextListeners = copyIfSame(currentListeners, nextListeners);

      var index = nextListeners.indexOf(cb);
      nextListeners.splice(index, 1);
    };
  }

  if (isSpec) {
    // create helpful action methods
    actions = Object.keys(reducerOrSpec).reduce(function (a, b) {
      if (b === "getInitialState") { return a; }
      a[b] = function (data) { return dispatch({
          type: b,
          data: data
        }); };
      return a;
    }, {});
  }

  var store = Object.assign({}, actions, bindSelectors(name, selectors), {
    name: name,
    dispatch: function () {
      var action = [], len = arguments.length;
      while ( len-- ) action[ len ] = arguments[ len ];

      return dispatch.apply(void 0, action);
  },
    dispatchToken: dispatchToken,
    subscribe: subscribe,
    replaceReducer: function (newReducer) { return (reducer = newReducer); },
    setState: function (state) {
      updateRootState(name, state);
    },
    getReducer: function () { return reducer; },
    getState: function() {
      return rootState[name];
    }
  });

  if (name[0] !== "_") { stores[name] = store; }

  return store;
}

/**
 * Copyright (c) 2015, JC Fisher
 */

var Container = (function (superclass) {
  function Container () {
    superclass.apply(this, arguments);
  }

  if ( superclass ) Container.__proto__ = superclass;
  Container.prototype = Object.create( superclass && superclass.prototype );
  Container.prototype.constructor = Container;

  Container.prototype.render = function render () {
    // properties must be passed in.
    var ref = this.props;
    var router = ref.router;

    if (!router) { throw Error("Router and location expected to be initialized!"); }

    var Content = router.content;
    if (!Content) { return null; }

    if (Content.then) {
      return null;
    }

    // render the content for the route!
    return React.createElement(
      Content,
      Object.assign({}, this.props, {
        location: router.location
      })
    );
  };

  return Container;
}(React__default.Component));

/**
 * Copyright (c) 2015-2018, JC Fisher
 */

function connect(Composed) {
  return (function (superclass) {
    function Connect(props) {
      superclass.call(this, props);
      this.state = getState();
      this.onChange = this.onChange.bind(this);
    }

    if ( superclass ) Connect.__proto__ = superclass;
    Connect.prototype = Object.create( superclass && superclass.prototype );
    Connect.prototype.constructor = Connect;

    Connect.prototype.componentDidMount = function componentDidMount () {
      this.token = subscribe(this.onChange);
    };

    Connect.prototype.componentWillUnmount = function componentWillUnmount () {
      if (typeof this.token === "function") {
        this.token();
      }
    };

    Connect.prototype.onChange = function onChange (state) {
      this.setState(state);
    };

    Connect.prototype.render = function render () {
      return React.createElement(Composed, Object.assign({}, this.state, this.props));
    };

    return Connect;
  }(React__default.PureComponent));
}

/**
 * Copyright (c) 2015-2018, JC Fisher
 */

// Borrowed from very old version of pathToRegexp library
/**
 * Expose `pathtoRegexp`.
 */

/**
 * Normalize the given path string,
 * returning a regular expression.
 *
 * An empty array should be passed,
 * which will contain the placeholder
 * key names. For example "/user/:id" will
 * then contain ["id"].
 *
 * @param  {String|RegExp|Array} path
 * @param  {Array} keys
 * @param  {Object} options
 * @return {RegExp}
 * @api private
 */

function pathtoRegexp(path, keys, options) {
  options = options || {};
  var sensitive = options.sensitive;
  var strict = options.strict;
  keys = keys || [];

  if (path instanceof RegExp) { return path; }
  if (path instanceof Array) { path = "(" + path.join("|") + ")"; }

  path = path
    .concat(strict ? "" : "/?")
    .replace(/\/\(/g, "(?:/")
    .replace(/(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?(\*)?/g, function(
      _,
      slash,
      format,
      key,
      capture,
      optional,
      star
    ) {
      keys.push({ name: key, optional: !!optional });
      slash = slash || "";
      return (
        "" +
        (optional ? "" : slash) +
        "(?:" +
        (optional ? slash : "") +
        (format || "") +
        (capture || ((format && "([^/.]+?)") || "([^/]+?)")) +
        ")" +
        (optional || "") +
        (star ? "(/*)?" : "")
      );
    })
    .replace(/([\/.])/g, "\\$1")
    .replace(/\*/g, "(.*)");

  return new RegExp("^" + path + "$", sensitive ? "" : "i");
}

/**
 * Copyright (c) 2015-2018, JC Fisher
 */

var pathRegexps = {};
function readLocation(state) {
  var pathname = window.location.pathname,
    search = window.location.search;

  return {
    title: document.title,
    pathname: window.location.pathname,
    search: window.location.search,
    hash: window.location.hash,
    query: search && search.length > 0 ? formula.PARSEQUERY(window.location.search) : {}
  };
}

// Return the first matching route.
function match(routes, path) {
  if ( routes === void 0 ) routes = [];

  for (var i = 0; i < routes.length; i++) {
    var re = pathRegexps[routes[i].path] || pathtoRegexp(routes[i].path);
    pathRegexps[routes[i].path] = re;

    if (re && re.test(path)) {
      return { re: re, route: routes[i] };
    }
  }

  return false;
}

// Create a store with options:
//
// - routes - [{ path: "/buckets/:id", action: Promise }]
//   A list of routes that specify a URL path and an action that must return a promise to the page content.
var store = createStore(
  "router",
  function (state, action) {
    if ( state === void 0 ) state = { location: readLocation(), routes: [] };

    var location = state.location;
    switch (action.type) {
      case "openPath":
      case "redirectPath":
      case "windowPopState":
        location = readLocation();
    }

    if (
      false ==
      (action.type == "loadRoutes" ||
        action.type == "loadContent" ||
        action.type == "openPath" ||
        action.type == "redirectPath" ||
        action.type == "windowPopState")
    ) {
      return state;
    }

    var routes = state.routes;
    var content = state.content;

    if (action.type === "loadContent") {
      // console.log('loadContent in router', state, action)
      return Object.assign({}, state, {
        location: location,
        content:
          formula.ISOBJECT(action.data) && action.data.default
            ? action.data.default
            : action.data
      });
    }

    if (action.type === "loadRoutes") {
      routes = action.data;
    }

    var ls = location;
    var pathname = ls.pathname;

    // console.log('current path', pathname)
    // Copyright 2017 JC Fisher

    // Match routesstore
    var found = match(routes, pathname);

    if (!found) {
      console.warn("not found", pathname, routes);
      return state;
    }

    var re = found.re;
    var route = found.route;

    if (!route) {
      // Copyright 2017 JC Fisher

      console.warn("no route!");
      return state;
    }
    // extract parameters
    var paramNames = re.exec(route.path).slice(1);
    var args = re.exec(pathname).slice(1);

    // zip into object { key: value }
    var params =
      paramNames.length === args.length
        ? paramNames.reduce(function (acc, key, i) {
            acc[key.substring(1)] = args[i];
            return acc;
          }, {})
        : {};

    if (state.route && state.route === route && state.params === params) {
      // console.log('same route and params')
      return state;
    }

    // console.log('CHECK', route, typeof route.load)
    if (found && route.component) {
      // console.log('COMPONENT', route.component)
      content = route.component;
    }

    // console.log('EXIT', pathname, route.path, content)

    return { location: location, routes: routes, route: route, params: params, args: args, content: content };
  },
  {
    loadRoutes: function (state, routes) { return dispatch("loadRoutes", routes); },
    loadContent: function (state, cmp) { return dispatch("loadRoutes", cmp); },
    open: function (state, path) {
      history.pushState({ path: path }, document.title, path);
      return dispatch("openPath", path);
    },
    redirect: function (state, path) {
      history.replaceState({ path: path }, document.title, path);
      return dispatch("redirectPath", path);
    }
  }
);

window.addEventListener("popstate", function(event) {
  dispatch("windowPopState");
});

/**
 * Copyright (c) 2015-2018, JC Fisher
 */

function isLeftClickEvent(event) {
  return event.button === 0;
}

function isModifiedEvent(event) {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
}

var Link = (function (superclass) {
  function Link() {
    superclass.call(this);
    this.handleClick = this.handleClick.bind(this);
  }

  if ( superclass ) Link.__proto__ = superclass;
  Link.prototype = Object.create( superclass && superclass.prototype );
  Link.prototype.constructor = Link;

  Link.prototype.handleClick = function handleClick (event) {
    if (this.props.onClick) { this.props.onClick(event); }

    if (event.defaultPrevented) { return; }

    if (isModifiedEvent(event) || !isLeftClickEvent(event)) { return; }

    if (this.props.stopPropagation) { event.stopPropagation(); }
    event.preventDefault();
    this.props.action ? this.props.action(event) : store.open(this.props.to);
  };

  Link.prototype.render = function render () {
    return React.createElement(
      this.props.tagName || "a",
      {
        disabled: this.props.disabled,
        className: this.props.className,
        style: this.props.style,
        onClick: this.handleClick,
        href: this.props.to
      },
      this.props.children
    );
  };

  return Link;
}(React__default.Component));

/**
 * Copyright (c) 2015-2018, JC Fisher
 */

var Eval = (function (superclass) {
  function Eval () {
    superclass.apply(this, arguments);
  }

  if ( superclass ) Eval.__proto__ = superclass;
  Eval.prototype = Object.create( superclass && superclass.prototype );
  Eval.prototype.constructor = Eval;

  Eval.prototype.render = function render () {
    return React.createElement("div", this.props, formula.RUN(this.props.exp, this.props.values || {}));
  };

  return Eval;
}(React__default.Component));

/**
 * Copyright (c) 2015-2018, JC Fisher
 */

var key = 0;

var Rule = (function (superclass) {
  function Rule () {
    superclass.apply(this, arguments);
  }

  if ( superclass ) Rule.__proto__ = superclass;
  Rule.prototype = Object.create( superclass && superclass.prototype );
  Rule.prototype.constructor = Rule;

  Rule.prototype.render = function render () {
    var ref = this;
    var props = ref.props;
    var ref$1 = formula.COMPILE(props.exp);
    var ast = ref$1.ast;

    function renderFunction(config, f, depth) {
      return React.createElement(
        "div",
        {
          style: (config.renderFunctionStyle || function() {})(f, depth),
          className: "xander-rules-section xander-rules-function"
        },
        React.createElement(
          "span",
          null,
          React.createElement(
            "span",
            { className: "xander-rules-function-begin" },
            config.renderFunctionBegin(config, f, depth)
          ),
          React.createElement(
            "div",
            { className: "xander-rules-args" },
            f.args.map(function(d) {
              return config.renderRule(config, d, depth + 1);
            })
          ),
          React.createElement(
            "span",
            { className: "xander-rules-function-end  " },
            config.renderFunctionEnd(config, f, depth)
          )
        )
      );
    }

    function renderOperator(config, o, depth) {
      var subtype = o.subtype;
      var operands = o.operands;
      return React.createElement(
        "div",
        {
          style: (config.renderOperatorStyle || function() {})(o, depth),
          className: "xander-rules-section xander-rules-operator"
        },
        formula.IF(
          operands.length === 1,
          function() {
            return React.createElement(
              "div",
              {
                style: (config.renderOperatorStyle || function() {})(o, depth),
                className: "xander-rules-operator"
              },
              React.createElement(
                "span",
                {
                  style: (config.renderPrefixStyle || function() {})(o, depth),
                  className: "xander-rules-operator-" + subtype
                },
                formula.IF(
                  subtype == "prefix-minus",
                  config.labelPrefixMINUS || "-",
                  subtype == "prefix-plus",
                  config.labelPrefixPLUS || "+"
                )
              ),
              React.createElement(
                "span",
                {
                  className: "xander-rules-rhs",
                  style: (config.renderRHSStyle || function() {})(o, depth)
                },
                config.renderRule(config, operands[0], depth + 1)
              )
            );
          },
          operands.length === 2,
          function() {
            return React.createElement(
              "div",
              {
                style: (config.renderOperatorStyle || function() {})(o, depth),
                className: "xander-rules-operator"
              },
              React.createElement(
                "span",
                {
                  style: (config.renderLHSStyle || function() {})(o, depth),
                  className: "xander-rules-lhs"
                },
                renderRule(config, operands[0], depth + 1)
              ),
              " ",
              React.createElement(
                "span",
                {
                  style: (config.rendeInfixStyle || function() {})(o, depth),
                  className: "xander-rules-operator-" + subtype
                },
                formula.IF(
                  subtype == "infix-eq",
                  config.labelEQ || "=",
                  subtype == "infix-ne",
                  config.labelNE || "<>",
                  subtype == "infix-gt",
                  config.labelGT || "<",
                  subtype == "infix-gte",
                  config.labelGTE || "<=",
                  subtype == "infix-lt",
                  config.labelLE || ">",
                  subtype == "infix-lte",
                  config.labelLTE || ">=",
                  subtype == "infix-add",
                  config.labelADD || "+",
                  subtype == "infix-subtract",
                  config.labelSUB || "-",
                  subtype == "infix-multiply",
                  config.labelMUL || "*",
                  subtype == "infix-divide",
                  config.labelDIV || "/",
                  subtype == "infix-power",
                  config.labelMUL || "^",
                  subtype == "infix-concat",
                  config.labelMUL || "&",
                  config.labelDefault || "huh?"
                )
              ),
              " ",
              React.createElement(
                "span",
                {
                  style: (config.renderRHSStyle || function() {})(o, depth),
                  className: "xander-rules-rhs"
                },
                renderRule(config, operands[1], depth + 1)
              )
            );
          },
          React.createElement("div", null, "unexpected number of operands!")
        )
      );
    }

    function renderValue(config, o, depth) {
      var type = o.type;
      var subtype = o.subtype;
      var scope = o.scope;
      var name = o.name;
      var value = o.value;
      var items = o.items;

      return React.createElement(
        "div",
        {
          style: (config.renderOperandStyle || function() {})(o, depth),
          className:
            "xander-rules-section xander-rules-value xander-rules-value-" +
            subtype
        },
        formula.IF(
          subtype === "string",
          function() {
            return config.renderString(value);
          },
          subtype === "number",
          function() {
            return config.renderNumber(value);
          },
          subtype === "boolean",
          function() {
            return config.renderBoolean(value);
          },
          subtype === "array",
          function() {
            return React.createElement(
              "span",
              null,
              "[",
              items.map(function(d) {
                return React.createElement(
                  "div",
                  {
                    key: key++,
                    className: "xander-rules-value xander-rules-array"
                  },
                  config.renderRule(config, d, depth + 1)
                );
              }),
              "]"
            );
          },
          "Other"
        )
      );
    }

    function renderGroup(config, g, depth) {
      return React.createElement(
        "div",
        {
          key: key++,
          style: (config.renderRangeStyle || function() {})(g, depth),
          className: "xander-rules-section xander-rules-group"
        },
        "(",
        config.renderRule(g.exp, depth + 1),
        ")"
      );
    }

    function renderRange(config, r, depth) {
      return React.createElement(
        "div",
        {
          style: (config.renderRangeStyle || function() {})(r, depth),
          className: "xander-rules-section xander-rules-range"
        },
        formula.IF(
          config.hasOwnProperty("renderRange"),
          function() {
            return config.renderRange(r, depth);
          },
          React.createElement(
            "span",
            null,
            renderVariable(r.topLeft),
            ":",
            renderVariable(r.topLeft)
          )
        )
      );
    }

    function renderVariable(config, v, depth) {
      var scope = v.scope;
      var name = v.name;

      return React.createElement(
        "div",
        {
          style: (config.renderVariableStyle || function() {})(v, depth),
          className: "xander-rules-section xander-rules-variable-name"
        },
        formula.WALKERCONFIGDEFAULT.renderVariable(config, v, depth)
      );
    }

    var ruleKey = 0;
    function renderRule(config, ast, depth) {
      if ( depth === void 0 ) depth = 0;

      var type = ast.type;
      var subtype = ast.subtype;

      return React.createElement(
        "div",
        {
          key: ruleKey++,
          style: (config.renderRuleStyle || function() {})(ast, depth),
          className:
            "xander-rules-block xander-rules-block-" +
            type +
            " xander-rules-block-" +
            subtype +
            " xander-rules-depth-" +
            depth
        },
        formula.WALKERCONFIGDEFAULT.renderRule(config, ast, depth)
      );
    }

    function renderFunctionEnd(config, f) {
      return null;
    }

    var newConfig = formula.ASSIGN(
      formula.WALKERCONFIGDEFAULT,
      {
        visit: function () {},
        renderRule: renderRule,
        renderOperator: renderOperator,
        renderVariable: renderVariable,
        renderRange: renderRange,
        renderGroup: renderGroup,
        renderValue: renderValue,
        renderFunction: renderFunction,
        renderFunctionEnd: renderFunctionEnd
      },
      props.config
    );

    return React.createElement(
      "div",
      { className: "xander-rules-formula" },
      renderRule(newConfig, ast)
    );
  };

  return Rule;
}(React__default.Component));

/**
 * Copyright (c) 2015-2018, JC Fisher
 */
// Inspired by react-loadable
var DefaultEmpty = function () { return null; };
var DefaultLoading = function (props) { return props.error ? React.createElement("div", null, "Error!") : React.createElement("div", null, "Loading..."); };

var Loadable = function(options) {
  return (function (superclass) {
    function LoadableComponent() {
      superclass.call(this);
      this.state = {
        cmp: null,
        error: null,
        loading: DefaultEmpty,
        timedOut: true
      };
    }

    if ( superclass ) LoadableComponent.__proto__ = superclass;
    LoadableComponent.prototype = Object.create( superclass && superclass.prototype );
    LoadableComponent.prototype.constructor = LoadableComponent;

    LoadableComponent.prototype.componentWillMount = function componentWillMount () {
      var this$1 = this;

      var ref = this.state;
      var cmp = ref.cmp;
      var loading = options.loading;
      var loader = options.loader;
      var delay = options.delay;
      if (!loader) { throw Error("loader component expected to be initialized!"); }

      // setTimeout to show loading component.
      setTimeout(function () {
        // don't set loading if cmp is already loaded.
        if (!this$1.state.cmp) {
          this$1.setState({
            loading: loading || DefaultLoading
          });
        }
      }, delay || 167); // 10 frames at 16.7ms

      // setTimeout to handle loading timeout.
      setTimeout(function () {
        if (!this$1.state.cmp) {
          this$1.setState({ timedOut: true });
        }
      });

      // resolve ES6 modules to default.
      function resolve(cmp) {
        return cmp.__esModule ? cmp.default : cmp;
      }

      loader()
        .then(function (cmp) { return this$1.setState({ cmp: resolve(cmp) }); })
        .catch(function (error) { return this$1.setState({ error: error }); });
    };

    LoadableComponent.prototype.render = function render () {
      var ref = this.state;
      var cmp = ref.cmp;
      var error = ref.error;
      var loading = ref.loading;

      if (cmp !== null) {
        return React.createElement(cmp, this.props);
      }

      return React.createElement(loading, {
        error: this.state.error,
        timedOut: this.state.timedOut
      });
    };

    return LoadableComponent;
  }(React__default.Component));
};

/**
 * Copyright (c) 2015-2018, JC Fisher
 */

var start = function () {
  var getWindow = function () { return ({
    width: window.innerWidth,
    height: window.innerHeight,
    scrollX: window.scrollX,
    scrollY: window.scrollY
  }); };

  var windowStore = createStore("window", {
    getInitialState: getWindow,
    windowOnResize: function (state, data) { return data; },
    windowOnScroll: function (state, data) { return data; }
  });

  function resize() {
    dispatch("windowOnResize", getWindow());
  }

  function scroll() {
    dispatch("windowOnScroll", getWindow());
  }

  window.onresize = resize;
  window.onscroll = scroll;

  return windowStore;
};

var window$1 = function () { return start(); };

/**
 * Copyright (c) 2015-2018, JC Fisher
 */

var app = function (ref, rootEl) {
  var routes = ref.routes;
  var debug = ref.debug;

  // load the routes
  if (routes) { store.loadRoutes(routes); }

  // enable console tools when debug enabled.
  if (debug === true) {
    window.router = store;
    subscribe(function (state, action) { return console.log("action", action); });
  }

  return connect(Container);
};

var render$1 = function (options, rootEl) {
  if (!rootEl) {
    console.log("rootEl must not be falsey");
    return;
  }

  var App = app(options);
  reactDom.render(React.createElement(App), rootEl);
};

exports.app = app;
exports.render = render$1;
exports.dispatch = dispatch;
exports.subscribe = subscribe;
exports.createStore = createStore;
exports.getState = getState;
exports.getStores = getStores;
exports.replaceState = replaceState;
exports.router = store;
exports.Link = Link;
exports.Eval = Eval;
exports.Rule = Rule;
exports.Container = Container;
exports.connect = connect;
exports.loadable = Loadable;
exports.loadWindowStore = window$1;

Object.defineProperty(exports, '__esModule', { value: true });

})));

