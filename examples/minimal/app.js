// Import the boot function to intialize xander.
import React from "react";
import { render } from "xander";

// Import style onto the page.
require("./app.css");

// Define routes for the app.
let routes = [
  {
    path: "/",
    component: props => <div>Hello, World.</div>
  },
  {
    path: "*",
    component: props => <div>404 NOT FOUND</div>
  }
];

// Render the app to the DOM.
render(
  {
    routes
  },
  document.getElementById("root")
);
