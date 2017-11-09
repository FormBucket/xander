# react-pure-flux-router

[![CircleCI](https://circleci.com/gh/PureFlux/react-pure-flux-router.svg?style=svg)](https://circleci.com/gh/PureFlux/react-pure-flux-router)

## Overview

Router for React.

1. Uses [history api](https://caniuse.com/#search=history).
2. Routes managed as application state.
3. Page content loaded async.

Hopefully, easy to install and setup.

Built with [pure-flux](https://github.com/PureFlux/pure-flux/)

## Usage

## Installation

```sh
npm install --save react-pure-flux-router
```

### Router Setup

```js
var router = require('react-pure-flux-router')
var {loadContent, loadRoutes} = require('react-pure-flux-router')

loadRoutes({
  routes: [{
    path: '/',
    load: () => System.import('./HomePage').then( content => loadContent(content) ) 
  }, {
    path: '*',
    load: () => System.import('./HomePage').then( content => loadContent(content) )
  }])
```
### Container Component

This will render the content async loaded by the route action.

```js
import {Container} from 'react-pure-flux-router'
render( <Container />, document.all.root )
```

### Link Component

A link component to switch pages.

```js
import {Link} from 'react-pure-flux-router'
<Link to="/buckets" />
<Link type="button" to="/buckets" />
```

### Open path programmically

```js
import {location} from 'react-pure-flux-router'
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
