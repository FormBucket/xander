import React from "react";
import { boot, Rule, Eval } from "../../lib/index";
import * as Formula from "formula";

window.Formula = Formula;

require("./app.scss");
require("../../xander.css");

let query = `OR( status=false, AND(status = true, country = "Denmark") )`;

let config = {
  labelAfterAND: null,
  labelAND: (
    <span>
      <strong>All of these</strong> must be{" "}
      <span className="xander-rules-true">TRUE:</span>
    </span>
  ),
  labelOR: (
    <span>
      <strong>Any of these</strong> must be <strong>TRUE</strong>:
    </span>
  ),
  labelNOR: (
    <span>
      <strong>All of these</strong> must be <strong>FALSE</strong>:
    </span>
  ),
  labelNOT: (
    <span>
      This must be <strong>FALSE</strong>:
    </span>
  ),
  labelINCLUDES: "Must find value in list:",
  labelNOTINCLUDES: "Must not find value in list:",

  renderRuleStyle: (config, rule, depth) => ({
    color: "maroon",
    backgroundColor: "lightblue",
    display:
      rule.type == "variable" ||
      (rule.type == "value" && rule.subtype !== "array")
        ? "inline"
        : "block",
    border:
      rule.type == "variable" || rule.type == "value"
        ? "none"
        : "1px solid maroon"
  }),

  renderVariableStyle: (config, v, depth) => ({
    color: "green"
  }),

  renderOperandStyle: (config, o, depth) => ({
    color: o.subtype == "array" ? "black" : "red"
  }),

  renderFunctionBegin: (config, f, depth) => (
    <span>
      <input type="checkbox" />
      {config[`label${f.name}`] || f.name + "("}
    </span>
  ),

  renderFunctionEnd: () => <button>Add More</button>

  // renderString: value => `'${value}'`
};

boot({
  rootEl: document.getElementById("root"),
  routes: [
    {
      path: "/",
      component: props => (
        <div>
          QUERY:
          <pre>{query}</pre>
          <h3>Empty config</h3>
          <Rule exp={query} />
          <hr />
          <h3>Default config</h3>
          <Rule exp={query} config={config} />
        </div>
      )
    },
    {
      path: "*",
      component: props => "No Page Found"
    }
  ]
});
