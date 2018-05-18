// Import the boot function to intialize hrx.
import { render } from "hrx";

// Import sass styles onto the page.
require("./app.css");

// Boot the app into a root DOM element. Map your URLs to component to render.
render(
  {
    routes: [
      {
        path: "/",
        component: props => <div>Hello, World.</div>
      },
      {
        path: "*",
        component: props => <div>404 NOT FOUND</div>
      }
    ]
  },
  document.getElementById("root")
);
