import React from "react";
import { boot, Rule, Eval } from "xander";
import Formula from "formula";

window.f = Formula;

require("./app.scss");
require("xander/xander.css");

let query = `OR( status=false, AND(status = true, country = "Denmark") )`;
let query2 = `OR( +a+b=4, ((status=false)), AND(status = true, country = "Denmark"), {a,b,c;1,2,3}, A1:A10, Test!A1 )`;

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
          <Eval
            exp="A + B"
            values={{
              A: 2,
              B: 2
            }}
          />
          QUERY:
          <pre>{query}</pre>
          <Rule exp={query} />
          <hr />
          <pre>{query2}</pre>
          <Rule exp={query2} />
        </div>
      )
    },
    {
      path: "*",
      component: props => "No Page Found"
    }
  ]
});
