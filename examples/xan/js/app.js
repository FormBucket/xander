import React from "react";
import ReactDOM from "react-dom";
import { app, Loadable } from "xander";
import routes from "./routes";
require("../style/app.scss");

let App = app({ routes });
ReactDOM.render(<App />, document.getElementById("root"));
