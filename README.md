# xander

[![CircleCI](https://circleci.com/gh/formula/xander.svg?style=svg)](https://circleci.com/gh/formula/xander)

## Overview

Framework for React Single Page Apps.

Webpack is recommended to bundle your projects. The [minimal example](./examples/minimal) provides a simple boilerplate setup. For larger projects, look at the [async example](./examples/async) which utilizes webpack's code splitting to scale your app.

This project was born out of a desire to build 
alternatives to React-Router and Redux, keeping 
`router` and `location` in stores. Trying to
build something simple, but complete.

## Usage

## Installation

```sh
npm install --save xander
```
## Examples
### Quick start

A minimal app with home and 404 page.

```js
import {boot} from 'xander';

// Calling constructor function return React component.
boot({
  debug: false, // optional, enables logging actions to console.
  rootEl: document.body, // optional, determine root node for application.
  routes: [{
    path: '/',
    component: (props) => <div>Hello, World.</div> 
  }, {
    path: '*',
    component: (props) => <div>404</div>
  }])

})
```

### Link Component

A link component to hyperlink your app without annoying page refreshes.

```js
import {Link} from 'xander'
<Link to="/buckets" />
<Link type="button" to="/buckets" />
<Link type="button" to="/buckets" type="button" /> // render button tag instead of a
```

### Router

A minimalist routers, supports history API.

#### Location

Manage location with the easy to use API.

```js
import {location} from 'xander'
location.open('/buckets/1')
```
Use `redirect` to change the URL without adding an entry to the history state.
```js
location.redirect('/buckets')
```

#### Load Routes 

Routes and related location information stored as routes.

```js
loadRoutes([{
  path: '/',
  load: loadContent( System.import('./pages/home') )
}])
```


See [rootr](https://github.com/formula/rootr) for more examples.

### State management

Use `createStore` to create immutable stores.

```js
import {createStore} from 'xander'
createStore(name, reducerOrSpec, actionsAndQueries)`
```

For more examples see [fluxury](https://github.com/formula/fluxury).

#### connect ####

A higher order function to connect React component

```js
import {connect} from 'xander'
let Connected = connect(store, component)`
ReactDOM.render(<Connected />)
```

#### Container ####

A component to render the current route content.

```js
import {Container} from 'xander'
render( <Container router={...} location={...} />, document.all.root )
```

