import React from 'react'
import ReactDOM from 'react-dom'
import xander from 'xander'

require('./app.scss')

let routes = [{
  path: '/',
  load: () => System.import('./HomePage') 
}, {
  path: '*',
  load: () => System.import('./PageNotFound') 
}]

let App = xander({ routes })
ReactDOM.render(<App />, document.getElementById('root'))
