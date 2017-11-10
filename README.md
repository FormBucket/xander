# react-rootr

[![CircleCI](https://circleci.com/gh/formula/react-rootr.svg?style=svg)](https://circleci.com/gh/formula/react-rootr)

## Overview

Router for React.

1. Uses [history api](https://caniuse.com/#search=history).
2. Routes managed as application state.
3. Load page content sync or async.

Hopefully, easy to install and setup. Look at [example](./example) for a minimal webpack etup.

Built on [rootr](https://github.com/formula/rootr/), [formula](https://github.com/formula/formula) and [fluxury](https://github.com/formula/fluxury)

## Usage

## Installation

```sh
npm install --save react-rootr rootr fluxury
```

### Router Setup

```js
var router = require('react-rootr')
var {loadContent, loadRoutes} = require('react-rootr')

loadRoutes({
  routes: [{
    path: '/',
    load: () => System.import('./HomePage')
  }, {
    path: '*',
    load: () => System.import('./HomePage')
  }])
```
### Container Component

This will render the content async loaded by the route action.

```js
import {Container} from 'react-rootr'
render( <Container router={...} location={...} />, document.all.root )
```

### Link Component

A link component to switch pages.

```js
import {Link} from 'react-rootr'
<Link to="/buckets" />
<Link type="button" to="/buckets" />
```

### Open path programmically

```js
import {location} from 'react-rootr'
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
