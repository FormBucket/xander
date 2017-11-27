import React from 'react'
import ReactDOM from 'react-dom'
import xander from 'xander'

require('./app.scss')

let routes = [{
  path: '/',
  component: (props) => "Hello, World."
}, {
  path: '*',
  component: ((props) => "No Page Found" )
}]

let App = xander({ routes })
ReactDOM.render(<App />, document.getElementById('root'))
