# react-pure-flux-router

[![CircleCI](https://circleci.com/gh/PureFlux/react-pure-flux-router.svg?style=svg)](https://circleci.com/gh/WebsiteHQ/react-pure-flux-router)

## Overview

A router for single page applications which supports:

1. Uses history api. No abstractions, zero overhead.
2. Routes defined with a paths similar to express.
3. Route content is loaded async. Works with webpack's code splitting.
4. Includes `Link` and `Container` components for React.
5. Routes can be changed at runtime.

## Usage

### Router Setup

```js
var router = require('react-pure-flux-router')
var {loadContent, loadRoutes} = require('react-pure-flux-router')

loadRoutes({
  routes: [{
    path: '/',
    load: loadContent( System.import('./pages/home') )
  }, {
    path: '/buckets',
    load: loadContent( System.import('./pages/buckets') )
  }, {
    path: '/bucket/:bucket_id',
    load: loadContent( System.import('./pages/buckets') )
  } {
    path: '*',
    load: loadContent( System.import('./pages/404') )
  }])
```
### Container Component

This will render the content async loaded by the route action.

```js
import {Container} from 'pure-flux-router'
render( <Container />, document.all.root )
```

### Link Component

A link component to switch pages.

```js
import {Link} from 'pure-flux-router'
<Link to="/buckets" />
<Link type="button" to="/buckets" />
```

### Open path programmically

```js
import {location} from 'pure-flux-router'
location.open('/buckets/1')
```
Use `redirect` to change the URL without adding an entry to the history state.
```js
location.redirect('/buckets')
```

### Replace routes

Change the routes.

```js
loadRoutes([{
  path: '/',
  load: loadContent( System.import('./pages/home') )
}])
```

## Final thoughts

Experimental. Untested in wide variety of browsers.
