import React from 'react'
import ReactDOM from 'react-dom'
import Xander from 'xander'
let { createStore, Link } = Xander

require('./app.css')

// Create a simple counter store.
let counter = createStore('count', {
  getInitialState: () => 0,
  inc: (state) => state+1
})

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

let {store, Container} = Xander({ debug: true, routes })
ReactDOM.render(<Container store={store} />, document.getElementById('root'))
