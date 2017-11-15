import React from 'react'
import ReactDOM from 'react-dom'

// State management
import { composeStore, createStore } from 'xander'

// Higher order function to bind store to React.PureComponent
import { connectStore } from 'xander'

// Stores to track current route and location.
import { router, location } from 'xander'

// Action creator to initialize routes.
import { loadRoutes } from 'xander'

// React components for display and navigation.
import { Container, Link } from 'xander'

// Create a simple counter store.
let counter = createStore('counter', {
  getInitialState: () => 0,
  inc: (state) => state+1
})

require('./app.css');

let routes = [{
  path: '/',
    component: (props) => (
      <p>
        Hello, World. Count: {props.count}
        <button onClick={counter.inc}>Inc</button>
        <Link to="/page2">Page 2</Link>
        <Link to="/page3">Page 3</Link>
        <Link to="/fubar">Broken link</Link>
      </p>
    )
}, {
  path: '/page2',
  component: (props) => <p onClick={(e) => location.open('/page3')}>Another awesome page.</p>
}, {
  path: '/page3',
  load: () => System.import('./page3')
}, {
  path: '*',
  component: ((props) => <Link to='/'>No content found.</Link>)
}]

loadRoutes(routes)

// create a composite store as a single source of truth.
let store = composeStore('app', { router, location, count: counter })

window.router = router
store.subscribe( (state, action) => console.log('action', action))

var ConnectedContainer = connectStore( store, Container )
ReactDOM.render(<ConnectedContainer store={store} />, document.getElementById('root'))
