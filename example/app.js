import React from 'react'
import ReactDOM from 'react-dom'

import { composeStore } from 'pure-flux'
import { connectStore } from 'react-pure-flux'
import router, { location, loadRoutes, loadContent, promiseContent, Container, Link } from 'react-pure-flux-router'

let routes = [{
  path: '/',
  load: promiseContent((props) => <p>Hello, World. <Link to="/page2">Another page</Link> <Link to="/fubar">Broken link</Link></p>)
}, {
  path: '/page2',
  load: promiseContent((props) => <p>Another awesome page.</p>)
}, {
  path: '/page3',
  load: () => System.import('./page3').then(cmp => loadContent(cmp))
}, {
  path: '*',
  load: promiseContent((props) => <p>No content found.</p>)
}]

loadRoutes(routes)
location.open(window.location.pathname + window.location.search + window.location.hash)

let store = composeStore('app', {
  router,
  location
})

var ConnectedContainer = connectStore( store, Container )
ReactDOM.render(<ConnectedContainer />, document.getElementById('root'))
