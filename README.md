# hrx

[![CircleCI](https://circleci.com/gh/FormBucket/hrx.svg?style=svg)](https://circleci.com/gh/FormBucket/hrx)

# Overview

Frontend Framework for [React](https://github.com/facebook/react) and [Formula](https://github.com/FormBucket/formula).

# Usage

## Installation

```sh
npm install --save react formula hrx
```

# Examples

## Quick start

A minimal hrx app with home and 404 page.

```js
// Import the boot function to intialize hrx.
import { render } from "hrx";

// Define routes for your app.
let routes = [
  {
    path: "/",
    component: props => "Hello, World."
  },
  {
    path: "*",
    component: props => "No Page Found"
  }
];

// Boot the app into a root DOM element. Map your URLs to component to render.
render({ routes }, document.getElementById("root"));
```

## With React's render

Render HRX with React's render function.

```js
// Import the boot function to intialize hrx.
import { app } from "hrx";
import React from "react";
import ReactDOM from "react-dom";
import routes from "./routes";

let App = app({ routes });
// Define routes for your app.
// Boot the app into a root DOM element. Map your URLs to component to render.
ReactDOM.render(<App />, document.getElementById("root"));
```

# Components

## Link Component

A link component to hyperlink your app without annoying page refreshes.

```js
import {Link} from 'hrx'
<Link to="/buckets">Go to my buckets</Link>
```

## Eval Component

The Eval component calculates the result of a formula expression.

```js
import {Eval} from 'hrx'
<Eval exp="SUM(A, B)" values={ A: 2, B: 2 } />
```

## Rule Component

The Rule component renders HTML describing a formula expression.

```js
import {Rule} from 'hrx'
<Rule exp="SUM(A, B)" />
```

## Loadable / loader HOCs

The Loadable HOC works with webpack to split your app into chunks that load dynamically.

```jsx
import { loadable } from "hrx";
let routes = [
  {
    path: "/",
    component: loadable({
      loader: () => import("./home"),
      loading: (props) => <div>Loading...</div>
      delay: 500 // 0.500 seconds
    })
  }
];
```

## Container Component

The Container component renders the router's current component.

```jsx
import { Link } from "hrx";
render(<Container />);
```

## Connect Component

The Connect HOC component syncs the store with React state.

```jsx
import { connect, Container } from "hrx";
connect(Container);
```

# Stores

## Router

A minimal router, backed by native history API.

```js
import { router } from "hrx";
router.open("/buckets/1");
```

Use `redirect` to modify URL without adding an entry to the history state.

```js
router.redirect("/buckets");
```

### Load Routes

Load routes and related configuration without `app` or `render`.

```js
import { router } from "hrx";
router.loadRoutes([
  {
    path: "/",
    component: require("./pages/home")
  }
]);
```

## Window Store

The window store keeps track of window size and scroll location; syncs with DOM.

```js
import { loadWindowStore } from "hrx";

loadWindowStore();
```

# Custom State management

HRX includes a state management system.

```js
import { createStore } from "hrx";
createStore(key, reducerOrSpec, actionsAndQueries);

// example store, access via the key `todos` in react props.
let todosStore = createStore('todos', {
  getInitialState: () => []
  addTodo: (state, todo) => state.concat(todo),
  removeTodo: (state, id) => state.filter(d => d.id !== id)
})

// usage
todosStore.addTodo({ id: 1, desc: "Make new framework" })
todosStore.addTodo({ id: 2, desc: "Write killer app" })
todosStore.addTodo({ id: 3, desc: "Analyze competition" })
todosStore.removeTodo(3)
todosStore.subscribe((state, action) => console.log('todos changes', state, action))
todosStore.dispatch('addTodo', { id: 4, desc: "Write product examples" })
```

## createStore( key, reducerOrSpec, actionsOrSelectors )

A store responds to actions by returning the next state.

```js
const inc = 'inc'
import {createStore} from 'xander';

// a simple counting store
var store = createStore( "count", (state=0, action) => {
  switch (action.type)
  case inc:
    return state + 1;
  case incN:
    return state + action.data;
  default:
    return state;
}, {
  inc: (state) => dispatch('inc'),
  incN: (state, count) => dispatch('incN', count),
})

// the store includes a reference to dispatch
store.dispatch('inc')

// optionally, define action creators into the store.
store.inc()
```

Optionally, you may define a store with a specification.

```js
const inc = "inc";
import { createStore } from "xander";

// a simple counting store
var countStore = createStore("count", {
  // life-cycle method for initialization.
  getInitialState: () => 0,
  // handles { type: 'inc' }
  inc: state => state + 1,
  // handles { type: 'incN' }
  incN: (state, n) => state + n
});

// object spec makes action creators automatically...
countStore.inc();
countStore.incN(10);
```

### Store Properties

Here is a list of store properties that are part of the public API.

| name           | comment                             |
| -------------- | ----------------------------------- |
| name           | The name of the store               |
| dispatch       | Access to dispatch function         |
| dispatchToken  | A number used to identity the store |
| subscribe      | A function to tegister a listener   |
| getState       | A function to access state          |
| setState       | Replace the store's state           |
| replaceReducer | Replace the store's reducer         |

## dispatch( action )

The entry point to effecting state changes in the app is when an action is dispatch.

Dispatch accepts action as object, promise, or type/data; returns promise.

```js
// Import the dispatch function.
var { dispatch } = require( 'xander' )

// Dispatch action as object
dispatch( { type: 'openPath', '/user/new' } )
.then( action => console.log('Going', action.data) )

// Dispatch action as promise
dispatch( Promise.resolve({ type: 'get', mode: 'off the juice' }) )

// Dispatch action with type:string and data:object.
dispatch( 'loadSettings', { a: 1, b: 2 } )
```

## WaitFor

```js
import { createStore, dispatch, subscribe, getState } from "xander";

// creates a key="A" in the root store, connected to a reducer function.
let storeA = createStore(
  "a1",
  (state = 0, action) => (action.type === "setA" ? action.data : state)
);

let storeB = createStore(
  "b1",
  (state = 0, action) => (action.type === "setB" ? action.data : state)
);

// Store with dependencies on state in storeA and storeB.
let storeC = createStore("c1", (state = 0, action, waitFor) => {
  // Ensure storeA and storeB reducers run prior to continuing.
  waitFor([storeA.dispatchToken, storeB.dispatchToken]);

  // Side effect! Get state from other stores.
  return storeA.getState() + storeB.getState();
});

subscribe((...args) => console.log("action", ...args));
dispatch("setA", 2);
dispatch("setB", 2);
getState(); // -> { a1: 2, b1: 2, c1: 4 }
```

## getStores( )

Returns an object with the name as key and store as value.

## replaceState( state )

Rehydrate the root state.

```js
replaceState({
  MyCountStore: 1
});
```

## subscribe( listener )

Listen to changes to all stores. This will trigger once each time createStore or dispatch is invoked.

```
var unsubscribe = subscribe( (state, action) => {
  // got change
})

// stop listening
unsubscribe()
```

_Please note that action will be undefined when createStore is invoked._
