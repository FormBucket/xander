import React from "react";
import { boot, Rule, Eval } from "xander";
import * as Formula from "formula";

window.Formula = Formula;

require("./app.scss");
require("xander/xander.css");

let query = `OR( status=false, AND(status = true, country = "Denmark") )`;
let query2 = `OR( +a+b=4, ((status=false)), AND(status = true, country = "Denmark"), {a,b,c;1,2,3}, A1:A10, Test!A1 )`;
query2 = `AND( OR( status = "A", status="B", status="C"), NOTINCLUDES(status, {"Ready for MFC","Modification Review Required","Buyout Complete"}), payoff_date > datevalue("1/1/2018"))`;
query = query2;

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
      <strong>Any of these</strong> must be TRUE:
    </span>
  ),
  labelINCLUDES: "Must find value in list:",
  labelNOTINCLUDES: "Must not find value in list:",

  renderRuleStyle: (rule, depth) => ({
    color: "maroon",
    backgroundColor: rule.subtype == "array" ? "lightblue" : "white",
    display:
      rule.type == "variable" || rule.type == "value" ? "inline" : "block",
    border:
      rule.type == "variable" || rule.type == "value"
        ? "none"
        : "1px solid maroon"
  }),

  renderVariable: ({ scope, name }, d) => (
    <span>
      @{name} {scope ? " in " + scope : null}
    </span>
  ),

  renderVariableStyle: (v, depth) => ({
    color: "green"
  }),

  renderOperandStyle: (o, depth) => ({
    color: o.subtype == "array" ? "black" : "red"
  }),

  renderString: value => `'${value}'`
};

boot({
  rootEl: document.getElementById("root"),
  routes: [
    {
      path: "/",
      component: props => <div className="hero">Hello, World.</div>
    },
    {
      path: "/test_rules",
      component: props => (
        <div>
          VALUES:
          <pre>
            {JSON.stringify(
              {
                A: 2,
                B: 2
              },
              null,
              2
            )}
          </pre>
          <hr />
          <Rule
            exp="A + B"
            values={{
              A: 2,
              B: 2
            }}
          />
          =
          <hr />
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
