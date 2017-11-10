# spago

[![CircleCI](https://circleci.com/gh/formula/spago.svg?style=svg)](https://circleci.com/gh/formula/spago)

## Overview

Single Page App Framework for React.

Look at [example](./example) for minimal setup.

Built on [rootr](https://github.com/formula/rootr/), [formula](https://github.com/formula/formula) and [fluxury](https://github.com/formula/fluxury)

## Usage

## Installation

```sh
npm install --save spago rootr fluxury
```

### Router Setup

```js
var router = require('spago')
var {loadContent, loadRoutes} = require('spago')

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
import {Container} from 'spago'
render( <Container router={...} location={...} />, document.all.root )
```

### Link Component

A link component to switch pages.

```js
import {Link} from 'spago'
<Link to="/buckets" />
<Link type="button" to="/buckets" />
```

### Open path programmically

```js
import {location} from 'spago'
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
