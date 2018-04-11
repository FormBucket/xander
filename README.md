# xander

[![CircleCI](https://circleci.com/gh/FormBucket/xander.svg?style=svg)](https://circleci.com/gh/FormBucket/xander)

## Overview

Single Page App framework for React and [formula](https://github.com/FormBucket/formula).

* State management
* Router
* Link Component
* Container Component
* Rule Component
* Formula Evaluation Component

## Usage

## Installation

```sh
npm install --save xander
```

## Examples

### Quick start

A minimal app with home and 404 page.

```js
import {boot, Loadable, Rule, Eval} from 'xander';

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
    path: '/test_rules',
    component: (props) => (
      <div>
        <Rule exp="SUM(A,B)" values={{ A: 2, B: 4 }} />
        <Eval exp="A + B" values={{ A: 2, B: 4 }} />
        <Rule
          exp={`AND(status = true, country = "Denmark")`}
          values={{ valid: true, country: "Denmark" }}
        />
      </div>
    )
  }, {
    path: '*',
    component: (props) => <div>404</div>
  }])

})
```

### xan server

Do you want a full featured development server with new project setup? Try xan server.

### webpack

Do you like to tinker? If so, then Webpack is recommended to bundle your projects. The [minimal example](./examples/minimal) provides a simple boilerplate setup. For larger projects, look at the [async example](./examples/async) which utilizes webpack's code splitting to scale your app.

### Link Component

A link component to hyperlink your app without annoying page refreshes.

```js
import {Link} from 'xander'
<Link to="/buckets" />
<Link type="button" to="/buckets" />
<Link type="button" to="/buckets" type="button" /> // render button tag instead of a
```

### Router

A minimal router, only supports history API.

```js
import { router } from "xander";
router.open("/buckets/1");
```

Use `redirect` to change the URL without adding an entry to the history state.

```js
router.redirect("/buckets");
```

#### Load Routes

Load routes and related configuration.

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
import { createStore } from "xander";
createStore(name, reducerOrSpec, actionsAndQueries);
```

For more examples see [fluxury](https://github.com/formula/fluxury).
