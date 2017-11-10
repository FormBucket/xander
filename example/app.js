import React from 'react'
import ReactDOM from 'react-dom'

// State management
import { composeStore, createStore } from 'spago'

// Redux higher order function to bind store
import { connectStore } from 'spago'

// Stores to track current route and location.
import { router, location } from 'spago'

// Action creator to initialize routes.
import { loadRoutes } from 'spago'

// Redux components for display and navigation.
import { Container, Link } from 'spago'

let counter = createStore('counter', {
  getInitialState: () => 0,
  inc: (state) => state+1
})

let routes = [{
  path: '/',
  component: (props) => <p>Hello, World. Count: {props.count} <button onClick={counter.inc}>Inc</button> <Link to="/page2">Another page</Link> <Link to="/fubar">Broken link</Link></p>
}, {
  path: '/page2',
  component: (props) => <p onClick={(e) => location.open('/page3')}>Another awesome page.</p>
}, {
  path: '/page3',
  component: (props) => <p onClick={(e) => counter.inc()}>{props.count}</p>
}, {
  path: '*',
  component: ((props) => <p onClick={() => location.open('/')}>No content found.</p>)
}]

loadRoutes(routes)

let store = composeStore('app', { router, location, count: counter })

window.router = router
store.subscribe( (state, action) => console.log('action', action))

var ConnectedContainer = connectStore( store, Container )
ReactDOM.render(<ConnectedContainer />, document.getElementById('root'))
