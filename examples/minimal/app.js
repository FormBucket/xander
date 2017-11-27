import React from 'react'
import ReactDOM from 'react-dom'
import Xander from 'xander'

require('./app.scss')

let App = new Xander({
  routes: [{
    path: "/",
    component: (props) => "Hello, World."
  }, {
    path: "*",
    component: ((props) => "No Page Found" )
  }]
})

ReactDOM.render(<App />, document.getElementById('root'))
