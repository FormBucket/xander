import React from 'react'
import ReactDOM from 'react-dom'

import { dispatch, composeStore, createStore, getStores } from 'fluxury'
import connectStore from 'react-rootr'
import router, { location, loadRoutes, loadContent, Container, Link } from 'react-rootr'

let routes = [{
  path: '/',
  component: (props) => <p>Hello, World. <Link to="/page2">Another page</Link> <Link to="/fubar">Broken link</Link></p>
}, {
  path: '/page2',
  component: (props) => <p onClick={(e) => location.open('/')}>Another awesome page.</p>
}, {
  path: '/page3',
  component: (props) => <p>Another awesome page.</p>
}, {
  path: '*',
  component: ((props) => <p onClick={() => dispatch('openPath', '/')}>No content found.</p>)
}]

loadRoutes(routes)

let store = composeStore('app', getStores())

createStore("hook", (state=1, action) => { console.log('action', action); return state; })

window.router = router
store.subscribe( (state, action) => console.log('action', action))

var ConnectedContainer = connectStore( store, Container )
ReactDOM.render(<ConnectedContainer />, document.getElementById('root'))
