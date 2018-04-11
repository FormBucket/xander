import React from "react";
import ReactDOM from "react-dom";
import xander, { Loadable } from "xander";
import routes from "./routes";
require("../style/app.scss");

let App = xander({ routes });
ReactDOM.render(<App />, document.getElementById("root"));
