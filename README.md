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
npm install --save hrx formula
```

## Examples

### Quick start

A minimal hrx app with home and 404 page.

```js
// Import the boot function to intialize hrx.
import {boot} from 'hrx';

// Import sass styles onto the page.
require('./app.scss');

// Boot the app into a root DOM element. Map your URLs to component to render.
boot({
  rootEl: document.getElementById('root'),
  routes: [{
    path: "/",
    component: (props) => "Hello, World."
  }, {
    path: "*",
    component: ((props) => "No Page Found" )
  }]
});
```

### xan server

Want a full featured static site generator and hot reloading development server. Checkout [xan](https://github.com/FormBucket/xan)

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

#### Container Component

The Container component renders a child component based on URL.

```jsx
import {Link} from 'hrx'
render(
  <Container>
  </Container>
)
```
#### Connect Component

The Connect HOC component syncs Xander state with React state.

```jsx
import {connect, Container} from 'hrx'
render(
  connect(Container) // <- boot function does just this
)
```

#### Loadable Component

The Loadable HOC works with webpack to split your app into chunks that load dynamically.

```jsx
import {Loadable} from 'hrx'
let HomePage = (props) =>
<div>
  <div id="hero">...</div>
  {
    loadable({
      loader: () => import("./HomePageBelowFold")
    })
  }
</div>
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
loadRoutes([
  {
    path: "/",
    component: require("./pages/home")
  }
]);
```

#### Window

The window store (optional) keeps track of window size and scroll location; keeps in sync with DOM.

```js
import windowStore from "hrx/lib/window";
```

#### Custom State management

Use `createStore` to manage locally cached data.

```js
import { createStore } from "hrx";
createStore(name, reducerOrSpec, actionsAndQueries);
```

For more info checkout [xander](https://github.com/FormBucket/xander).
