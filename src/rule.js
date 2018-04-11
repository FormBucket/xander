/**
 * Copyright (c) 2015-2018, JC Fisher
 */

import React, { createElement as h } from "react";
import {
  ASSIGN as assign,
  IF as branch,
  COMPILE as compile,
  WALKERCONFIGDEFAULT as defaultConfig
} from "formula";

let key = 0;

class Rule extends React.Component {
  render() {
    let { props } = this;
    let { ast } = compile(props.exp);

    function renderFunction(config, f, depth) {
      return h(
        "div",
        {
          style: (config.renderFunctionStyle || function() {})(f, depth),
          className: "xander-rules-section xander-rules-function"
        },
        h(
          "span",
          null,
          h(
            "span",
            { className: "xander-rules-function-begin" },
            config.renderFunctionBegin(config, f, depth)
          ),
          h(
            "div",
            { className: "xander-rules-args" },
            f.args.map(function(d) {
              return config.renderRule(config, d, depth + 1);
            })
          ),
          h(
            "span",
            { className: "xander-rules-function-end  " },
            config.renderFunctionEnd(config, f, depth)
          )
        )
      );
    }

    function renderOperator(config, o, depth) {
      let { subtype, operands } = o;
      return h(
        "div",
        {
          style: (config.renderOperatorStyle || function() {})(o, depth),
          className: "xander-rules-section xander-rules-operator"
        },
        branch(
          operands.length === 1,
          function() {
            return h(
              "div",
              {
                style: (config.renderOperatorStyle || function() {})(o, depth),
                className: "xander-rules-operator"
              },
              h(
                "span",
                {
                  style: (config.renderPrefixStyle || function() {})(o, depth),
                  className: "xander-rules-operator-" + subtype
                },
                branch(
                  subtype == "prefix-minus",
                  config.labelPrefixMINUS || "-",
                  subtype == "prefix-plus",
                  config.labelPrefixPLUS || "+"
                )
              ),
              h(
                "span",
                {
                  className: "xander-rules-rhs",
                  style: (config.renderRHSStyle || function() {})(o, depth)
                },
                config.renderRule(config, operands[0], depth + 1)
              )
            );
          },
          operands.length === 2,
          function() {
            return h(
              "div",
              {
                style: (config.renderOperatorStyle || function() {})(o, depth),
                className: "xander-rules-operator"
              },
              h(
                "span",
                {
                  style: (config.renderLHSStyle || function() {})(o, depth),
                  className: "xander-rules-lhs"
                },
                renderRule(config, operands[0], depth + 1)
              ),
              " ",
              h(
                "span",
                {
                  style: (config.rendeInfixStyle || function() {})(o, depth),
                  className: "xander-rules-operator-" + subtype
                },
                branch(
                  subtype == "infix-eq",
                  config.labelEQ || "=",
                  subtype == "infix-ne",
                  config.labelNE || "<>",
                  subtype == "infix-gt",
                  config.labelGT || "<",
                  subtype == "infix-gte",
                  config.labelGTE || "<=",
                  subtype == "infix-lt",
                  config.labelLE || ">",
                  subtype == "infix-lte",
                  config.labelLTE || ">=",
                  subtype == "infix-add",
                  config.labelADD || "+",
                  subtype == "infix-subtract",
                  config.labelSUB || "-",
                  subtype == "infix-multiply",
                  config.labelMUL || "*",
                  subtype == "infix-divide",
                  config.labelDIV || "/",
                  subtype == "infix-power",
                  config.labelMUL || "^",
                  subtype == "infix-concat",
                  config.labelMUL || "&",
                  config.labelDefault || "huh?"
                )
              ),
              " ",
              h(
                "span",
                {
                  style: (config.renderRHSStyle || function() {})(o, depth),
                  className: "xander-rules-rhs"
                },
                renderRule(config, operands[1], depth + 1)
              )
            );
          },
          h("div", null, "unexpected number of operands!")
        )
      );
    }

    function renderValue(config, o, depth) {
      let { type, subtype, scope, name, value, items } = o;

      return h(
        "div",
        {
          style: (config.renderOperandStyle || function() {})(o, depth),
          className:
            "xander-rules-section xander-rules-value xander-rules-value-" +
            subtype
        },
        branch(
          subtype === "string",
          function() {
            return config.renderString(value);
          },
          subtype === "number",
          function() {
            return config.renderNumber(value);
          },
          subtype === "boolean",
          function() {
            return config.renderBoolean(value);
          },
          subtype === "array",
          function() {
            return h(
              "span",
              null,
              "[",
              items.map(function(d) {
                return h(
                  "div",
                  {
                    key: key++,
                    className: "xander-rules-value xander-rules-array"
                  },
                  config.renderRule(config, d, depth + 1)
                );
              }),
              "]"
            );
          },
          "Other"
        )
      );
    }

    function renderGroup(config, g, depth) {
      return h(
        "div",
        {
          key: key++,
          style: (config.renderRangeStyle || function() {})(g, depth),
          className: "xander-rules-section xander-rules-group"
        },
        "(",
        config.renderRule(g.exp, depth + 1),
        ")"
      );
    }

    function renderRange(config, r, depth) {
      return h(
        "div",
        {
          style: (config.renderRangeStyle || function() {})(r, depth),
          className: "xander-rules-section xander-rules-range"
        },
        branch(
          config.hasOwnProperty("renderRange"),
          function() {
            return config.renderRange(r, depth);
          },
          h(
            "span",
            null,
            renderVariable(r.topLeft),
            ":",
            renderVariable(r.topLeft)
          )
        )
      );
    }

    function renderVariable(config, v, depth) {
      let { scope, name } = v;

      return h(
        "div",
        {
          style: (config.renderVariableStyle || function() {})(v, depth),
          className: "xander-rules-section xander-rules-variable-name"
        },
        defaultConfig.renderVariable(config, v, depth)
      );
    }

    function renderRule(config, ast, depth = 0) {
      let { type, subtype } = ast;

      return h(
        "div",
        {
          style: (config.renderRuleStyle || function() {})(ast, depth),
          className:
            "xander-rules-block xander-rules-block-" +
            type +
            " xander-rules-block-" +
            subtype +
            " xander-rules-depth-" +
            depth
        },
        defaultConfig.renderRule(config, ast, depth)
      );
    }

    let newConfig = assign(
      defaultConfig,
      {
        visit: () => {},
        renderRule,
        renderOperator,
        renderVariable,
        renderRange,
        renderGroup,
        renderValue,
        renderFunction
      },
      props.config
    );

    return h(
      "div",
      { className: "xander-rules-formula" },
      renderRule(newConfig, ast)
    );
  }
}

export default Rule;
