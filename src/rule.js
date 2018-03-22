import React from "react";
import {
  IF as branch,
  COMPILE as compile,
  ISTEXT as isText,
  ISOBJECT as isObject
} from "formula";
let key = 0;

class Rule extends React.Component {
  render() {
    let { props } = this;
    let { config } = props;
    let { ast } = compile(props.exp);

    config = config || {};

    function renderFunction(f, depth) {
      return branch(
        config.hasOwnProperty("renderFunction"),
        () => config.renderFunction(f, depth, renderRule),
        () => (
          <div
            style={(config.renderFunctionStyle || (() => {}))(f, depth)}
            className={`xander-rules-function`}
          >
            {config[`label${f.name}`] || f.name + "("}
            <div className="xander-rules-args">
              {f.args.map(d => renderRule(d, depth + 1))}
            </div>
            {config[`labelAfter${f.name}`] || ")"}
          </div>
        )
      );
    }

    function renderOperand(o, depth) {
      let { type, subtype, scope, name, value, items } = o;
      return branch(
        subtype === "string",
        () => (
          <span
            style={(config.renderOperandStyle || (() => {}))(o, depth)}
            className="xander-rules-value xander-rules-value-string"
          >
            {branch(
              config.hasOwnProperty("renderString"),
              () => config.renderString(value),
              () => `"${value}"`
            )}
          </span>
        ),
        subtype === "number",
        () => (
          <span
            style={(config.renderOperandStyle || (() => {}))(o, depth)}
            className="xander-rules-value xander-rules-value-number"
          >
            {branch(
              config.hasOwnProperty("renderNumber"),
              () => config.renderNumber(value),
              value
            )}
          </span>
        ),
        subtype === "boolean",
        () => (
          <span
            style={(config.renderOperandStyle || (() => {}))(o, depth)}
            className="xander-rules-value xander-rules-value-boolean"
          >
            {branch(
              config.hasOwnProperty("renderBoolean"),
              () => config.renderBoolean(value),
              value ? config.labelTRUE || "TRUE" : config.labelFALSE || "FALSE"
            )}
          </span>
        ),
        subtype === "array",
        () =>
          branch(
            config.hasOwnProperty("renderArray"),
            () => config.renderArray(value),
            () => (
              <div
                style={(config.renderOperandStyle || (() => {}))(o, depth)}
                className={`xander-rules-value xander-rules-array`}
              >
                [
                {items.map(d => (
                  <div
                    key={key++}
                    className={`xander-rules-value xander-rules-array`}
                  >
                    {renderRule(d, depth + 1)}
                  </div>
                ))}
                ]
              </div>
            )
          ),
        <span className="xander-rules-operand-unknown">{type}</span>
      );
    }

    function renderOperator(o, depth) {
      let { subtype, operands } = o;
      return branch(
        operands.length === 1,
        () => (
          <div
            style={(config.renderOperatorStyle || (() => {}))(o, depth)}
            className={`xander-rules-operator`}
          >
            <span className={`xander-rules-operator-${subtype}`}>
              {branch(
                subtype == "prefiprefixx-minus",
                config.labelPrefixMINUS || "-",
                subtype == "prefix-plus",
                config.labelPrefixPLUS || "+"
              )}
            </span>
            <span className="xander-rules-rhs">
              {renderRule(operands[0], depth + 1)}
            </span>
          </div>
        ),
        operands.length === 2,
        () => (
          <div
            style={(config.renderOperatorStyle || (() => {}))(o, depth)}
            className={`xander-rules-operator`}
          >
            <span className="xander-rules-lhs">
              {renderRule(operands[0], depth + 1)}
            </span>{" "}
            <span className={`xander-rules-operator-${subtype}`}>
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
            <span className="xander-rules-rhs">
              {renderRule(operands[1], depth + 1)}
            </span>
          </div>
        ),
        <div>unexpected number of operands!</div>
      );
    }

    function renderGroup(g, depth) {
      return (
        <div
          key={key++}
          style={(config.renderRangeStyle || (() => {}))(g, depth)}
          className={`xander-rules-group`}
        >
          ({renderRule(g.exp, depth + 1)})
        </div>
      );
    }

    function renderRange(r, depth) {
      return (
        <div
          style={(config.renderRangeStyle || (() => {}))(r, depth)}
          className="xander-rules-range"
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

    function renderVariable(v, depth) {
      let { scope, name } = v;
      return (
        <span
          style={(config.renderVariableStyle || (() => {}))(v, depth)}
          className="xander-rules-variable-name"
        >
          {branch(
            config.hasOwnProperty("renderVariable"),
            () => config.renderVariable(v, depth),
            <span>
              {scope}
              {scope ? " -> " : null}
              {name}
            </span>
          )}
        </span>
      );
    }
    function renderRule(ast, depth = 0) {
      return (
        <div
          style={(config.renderRuleStyle || (() => {}))(ast, depth)}
          className={`xander-rules-block xander-rules-depth-${depth}`}
        >
          {branch(
            ast.type === "group",
            () => renderGroup(ast, depth),
            ast.type === "function",
            () => renderFunction(ast, depth),
            ast.type === "operator",
            () => renderOperator(ast, depth),
            ast.type === "variable",
            () => renderVariable(ast, depth),
            ast.type === "value",
            () => renderOperand(ast, depth),
            ast.type === "range",
            () => renderRange(ast, depth)
          )}
        </div>
      );
    }

    return <div className="xander-rules-formula">{renderRule(ast)}</div>;
  }
}

export default Rule;
