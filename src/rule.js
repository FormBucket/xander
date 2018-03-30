import React from "react";
import {
  ASSIGN as assign,
  IF as branch,
  COMPILE as compile,
  ISTEXT as isText,
  ISOBJECT as isObject,
  WALKER as walker,
  WALKERCONFIGDEFAULT as defaultConfig
} from "formula";

let key = 0;

class Rule extends React.Component {
  render() {
    let { props } = this;
    let { ast } = compile(props.exp);

    function renderFunction(config, f, depth) {
      return (
        <div
          style={(config.renderFunctionStyle || (() => {}))(f, depth)}
          className={`xander-rules-section xander-rules-function`}
        >
          <span>
            <span className="xander-rules-function-begin">
              {config.renderFunctionBegin(config, f, depth)}
            </span>

            <div className="xander-rules-args">
              {f.args.map(d => config.renderRule(config, d, depth + 1))}
            </div>

            <span className="xander-rules-function-end  ">
              {config.renderFunctionEnd(config, f, depth)}
            </span>
          </span>
        </div>
      );
    }

    function renderOperator(config, o, depth) {
      let { subtype, operands } = o;
      return (
        <div
          style={(config.renderOperatorStyle || (() => {}))(o, depth)}
          className={`xander-rules-section xander-rules-operator`}
        >
          {branch(
            operands.length === 1,
            () => (
              <div
                style={(config.renderOperatorStyle || (() => {}))(o, depth)}
                className={`xander-rules-operator`}
              >
                <span
                  style={(config.renderPrefixStyle || (() => {}))(o, depth)}
                  className={`xander-rules-operator-${subtype}`}
                >
                  {branch(
                    subtype == "prefix-minus",
                    config.labelPrefixMINUS || "-",
                    subtype == "prefix-plus",
                    config.labelPrefixPLUS || "+"
                  )}
                </span>
                <span
                  className="xander-rules-rhs"
                  style={(config.renderRHSStyle || (() => {}))(o, depth)}
                >
                  {config.renderRule(config, operands[0], depth + 1)}
                </span>
              </div>
            ),
            operands.length === 2,
            () => (
              <div
                style={(config.renderOperatorStyle || (() => {}))(o, depth)}
                className={`xander-rules-operator`}
              >
                <span
                  style={(config.renderLHSStyle || (() => {}))(o, depth)}
                  className="xander-rules-lhs"
                >
                  {renderRule(config, operands[0], depth + 1)}
                </span>{" "}
                <span
                  style={(config.rendeInfixStyle || (() => {}))(o, depth)}
                  className={`xander-rules-operator-${subtype}`}
                >
                  {branch(
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
                  )}
                </span>{" "}
                <span
                  style={(config.renderRHSStyle || (() => {}))(o, depth)}
                  className="xander-rules-rhs"
                >
                  {renderRule(config, operands[1], depth + 1)}
                </span>
              </div>
            ),
            <div>unexpected number of operands!</div>
          )}
        </div>
      );
    }

    function renderValue(config, o, depth) {
      let { type, subtype, scope, name, value, items } = o;

      return (
        <div
          style={(config.renderOperandStyle || (() => {}))(o, depth)}
          className={`xander-rules-section xander-rules-value xander-rules-value-${subtype}`}
        >
          {branch(
            subtype === "string",
            () => config.renderString(value),
            subtype === "number",
            () => config.renderNumber(value),
            subtype === "boolean",
            () => config.renderBoolean(value),
            subtype === "array",
            () => (
              <span>
                [
                {items.map(d => (
                  <div
                    key={key++}
                    className={`xander-rules-value xander-rules-array`}
                  >
                    {config.renderRule(config, d, depth + 1)}
                  </div>
                ))}
                ]
              </span>
            ),
            "Other"
          )}
        </div>
      );
    }

    function renderGroup(config, g, depth) {
      return (
        <div
          key={key++}
          style={(config.renderRangeStyle || (() => {}))(g, depth)}
          className={`xander-rules-section xander-rules-group`}
        >
          ({config.renderRule(g.exp, depth + 1)})
        </div>
      );
    }

    function renderRange(config, r, depth) {
      return (
        <div
          style={(config.renderRangeStyle || (() => {}))(r, depth)}
          className="xander-rules-section xander-rules-range"
        >
          {branch(
            config.hasOwnProperty("renderRange"),
            () => config.renderRange(r, depth),
            <span>
              {renderVariable(r.topLeft)}:{renderVariable(r.topLeft)}
            </span>
          )}
        </div>
      );
    }

    function renderVariable(config, v, depth) {
      let { scope, name } = v;
      return (
        <div
          style={(config.renderVariableStyle || (() => {}))(v, depth)}
          className="xander-rules-section xander-rules-variable-name"
        >
          {defaultConfig.renderVariable(config, v, depth)}
        </div>
      );
    }

    function renderRule(config, ast, depth = 0) {
      let { type, subtype } = ast;
      return (
        <div
          style={(config.renderRuleStyle || (() => {}))(ast, depth)}
          className={`xander-rules-block xander-rules-block-${type} xander-rules-block-${subtype} xander-rules-depth-${depth}`}
        >
          {defaultConfig.renderRule(config, ast, depth)}
        </div>
      );
    }

    let newConfig = assign(defaultConfig, {
      visit: () => {},
      renderRule,
      renderOperator,
      renderVariable,
      renderRange,
      renderGroup,
      renderValue,
      renderFunction
    });

    return (
      <div className="xander-rules-formula">{renderRule(newConfig, ast)}</div>
    );
  }
}

export default Rule;
