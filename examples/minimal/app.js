import {boot} from 'xander';

require('./app.scss');

boot({
  rootEl: document.getElementById('root'),
  routes: [{
    path: "/",
    component: (props) => "Hello, World."
  }, {
    path: "*",
    component: ((props) => "No Page Found" )
  }]
});
