# hrx

[![CircleCI](https://circleci.com/gh/FormBucket/hrx.svg?style=svg)](https://circleci.com/gh/FormBucket/hrx)

## Overview

Framework for [React](https://github.com/facebook/react) and [Formula](https://github.com/FormBucket/formula).

## why hrx?

* **h** is for hyperscript.
* **r** is for `RUN` expression.
* **x** is for [xander](https://github.com/FormBucket/xander).

hrx is **h**yperscript + **f**ormula + **x**ander

## Usage

## Installation

```sh
npm install --save react formula hrx
```

## Examples

### Quick start

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

### With React's render

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

### Components

#### Link Component

A link component to hyperlink your app without annoying page refreshes.

```js
import {Link} from 'hrx'
<Link to="/buckets" />
<Link type="button" to="/buckets" />
<Link type="button" to="/buckets" type="button" /> // render button tag instead of a
```

#### Eval Component

The Eval component calculates the result of a formula expression.

```js
import {Eval} from 'hrx'
<Eval exp="SUM(A, B)" values={ A: 2, B: 2 } />
```

#### Rule Component

The Rule component renders HTML describing a formula expression.

```js
import {Rule} from 'hrx'
<Rule exp="SUM(A, B)" />
```

#### Loadable / loader HOCs

The Loadable HOC works with webpack to split your app into chunks that load dynamically.

```jsx
import { loadable, loader } from "hrx";
let routes = [
  {
    path: "/",
    component: loadable({
      loader: () => import("./home"),
      delay: 500 // 0.500 seconds
    })
  },
  {
    path: "*",
    component: loader(() => import("./404"))
  }
];
```

#### Container Component

The Container component renders a child component based on URL.

```jsx
import { Link } from "hrx";
render(<Container />);
```

#### Connect Component

The Connect HOC component syncs Xander state with React state.

```jsx
import { connect, Container } from "hrx";
render(
  connect(Container) // <- boot function does just this
);
```

### Stores

#### Router

A minimal router, backed by native history API.

```js
import { router } from "hrx";
router.open("/buckets/1");
```

Use `redirect` to modify URL without adding an entry to the history state.

```js
router.redirect("/buckets");
```

##### Load Routes

Load routes and related configuration without `boot`.

```js
import { router } from "hrx";
router.loadRoutes([
  {
    path: "/",
    component: require("./pages/home")
  }
]);
```

#### Window Store

The window store (optional) keeps track of window size and scroll location; keeps in sync with DOM.

```js
import { loadWindowStore } from "hrx";

loadWindowStore();
```

#### Custom State management

Use `createStore` for custom application state.

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

For more see [xander](https://github.com/FormBucket/xander).
