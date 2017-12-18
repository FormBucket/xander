import {boot} from 'xander'

require('./app.scss')

boot({
  routes: [{
    path: "/",
    component: (props) => "Hello, World."
  }, {
    path: "*",
    component: ((props) => "No Page Found" )
  }]
})
