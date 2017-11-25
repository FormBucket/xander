import React from 'react'
import ReactDOM from 'react-dom'
import xander from 'xander'

require('./app.scss')

let routes = [{
  path: '/',
  component: (props) => <p>Hello, World.</p>
}, {
  path: '*',
  component: ((props) => <div>No Page Found</div>)
}]

let App = xander({ routes })
ReactDOM.render(<App />, document.getElementById('root'))
