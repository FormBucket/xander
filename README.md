# hrx

[![CircleCI](https://circleci.com/gh/FormBucket/hrx.svg?style=svg)](https://circleci.com/gh/FormBucket/hrx)

## Overview

Framework for [React](https://github.com/facebook/react) and [Formula](https://github.com/FormBucket/formula).

## why hrx?

* **h** is for hyperscript.
* **r** is for `RUN` expression.
* **x** is for e**X**perience.

hrx is hyperscript + formula.

## Usage

## Installation

```sh
npm install --save hrx formula
```

## Examples

### Quick start

A minimal hrx app with home and 404 page.

```js
import { createElement as h } from 'react';
import { RUN as r } from 'formula'
import {boot, Loadable, Rule, Eval} from 'hrx';

// Calling constructor function return React component.
boot({
  routes: [{
    path: '/',
    component: (props) => <div>Hello, World.</div>
  }, {
    path: '/page-splitting',
    component: Loadable({
      loader: () => import('./page-to-your-component'),
      loading: (props) => <div>My Loader Code</div>
    })
  }, {
    path: '/hyperscript',
    component: (props) => h('div',
      h(Rule, { exp: 'sum(A,B)'}, values: { A: 2, B: 4 }),
      h(Eval, { exp: 'sum(A,B)'}, values: { A: 2, B: 4 }),
    )
  }, {
    path: '/jsx',
    component: (props) =>
    <div>
      <Rule exp="sum(A,B)" values={{ A: 2, B: 4 }} />
      <Eval exp="sum(A, B)" values={{ A: 2, B: 4 }} />
    </div>
  }, {
    path: '*',
    component: (props) => <div>404</div>
  }])

}, document.getElementById('your-dom-element-goes-here'))
```

### xan server

Try [xan](https://github.com/FormBucket/xan) for a full featured development server.

### webpack

Already use webpack? The [minimal example](./examples/minimal) offers a simple boilerplate.

### Link Component

A link component to hyperlink your app without annoying page refreshes.

```js
import {Link} from 'hrx'
<Link to="/buckets" />
<Link type="button" to="/buckets" />
<Link type="button" to="/buckets" type="button" /> // render button tag instead of a
```

### Router

A minimal router, backed by native history API.

```js
import { router } from "hrx";
router.open("/buckets/1");
```

Use `redirect` to modify URL without adding an entry to the history state.

```js
router.redirect("/buckets");
```

#### Load Routes

Load routes and related configuration without `boot`.

```js
loadRoutes([
  {
    path: "/",
    component: require("./pages/home")
  }
]);
```

### State management

Use `createStore` to create immutable stores.

```js
import { createStore } from "hrx";
createStore(name, reducerOrSpec, actionsAndQueries);
```

For more examples see [fluxury](https://github.com/formula/fluxury).
