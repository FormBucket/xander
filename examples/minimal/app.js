// Import the boot function to intialize hrx.
import {boot} from 'hrx';

// Import sass styles onto the page.
require('./app.scss');

// Boot the app into a root DOM element. Map your URLs to component to render.
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
