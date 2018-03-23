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
      return (
        <div
          style={(config.renderFunctionStyle || (() => {}))(f, depth)}
          className={`xander-rules-section xander-rules-function`}
        >
          {branch(
            config.hasOwnProperty("renderFunction"),
            () => config.renderFunction(f, depth, renderRule),
            () => (
              <span>
                <span className="xander-rules-function-begin">
                  {branch(
                    config.hasOwnProperty("renderFunctionBegin"),
                    () => config.renderFunctionBegin(f, depth),
                    () => config[`label${f.name}`] || f.name + "("
                  )}
                </span>

                <div className="xander-rules-args">
                  {f.args.map(d => renderRule(d, depth + 1))}
                </div>

                <span className="xander-rules-function-end  ">
                  {branch(
                    config.hasOwnProperty("renderFunctionEnd"),
                    () => config.renderFunctionEnd(f, depth),
                    () => config[`labelAfter${f.name}`] || ")"
                  )}
                </span>
              </span>
            )
          )}
        </div>
      );
    }

    function renderValue(o, depth) {
      let { type, subtype, scope, name, value, items } = o;

      return (
        <div
          style={(config.renderOperandStyle || (() => {}))(o, depth)}
          className={`xander-rules-section xander-rules-value xander-rules-value-${subtype}`}
        >
          {branch(
            subtype === "string",
            () => `"${value}"`,
            subtype === "number",
            () =>
              branch(
                config.hasOwnProperty("renderNumber"),
                () => config.renderNumber(value),
                config.hasOwnProperty("renderValue"),
                () => config.renderValue(value),
                value
              ),
            subtype === "boolean",
            () =>
              branch(
                config.hasOwnProperty("renderBoolean"),
                () => config.renderBoolean(value),
                config.hasOwnProperty("renderValue"),
                () => config.renderValue(value),
                value
                  ? config.labelTRUE || "TRUE"
                  : config.labelFALSE || "FALSE"
              ),
            subtype === "array",
            () =>
              branch(
                config.hasOwnProperty("renderArray"),
                () => config.renderArray(value),
                config.hasOwnProperty("renderValue"),
                () => config.renderValue(value),
                () => (
                  <span>
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
                  </span>
                )
              ),
            "error: unknown operand"
          )}
        </div>
      );
    }

    function renderOperator(o, depth) {
      let { subtype, operands } = o;
      return (
        <div
          style={(config.renderOperatorStyle || (() => {}))(o, depth)}
          className={`xander-rules-section xander-rules-operator`}
        >
          {branch(
            config.hasOwnProperty("renderOperator"),
            () => config.renderOperator(o, depth, renderRule),
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
                <span
                  style={(config.renderLHSStyle || (() => {}))(o, depth)}
                  className="xander-rules-lhs"
                >
                  {renderRule(operands[0], depth + 1)}
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
                  {renderRule(operands[1], depth + 1)}
                </span>
              </div>
            ),
            <div>unexpected number of operands!</div>
          )}
        </div>
      );
    }

    function renderGroup(g, depth) {
      return (
        <div
          key={key++}
          style={(config.renderRangeStyle || (() => {}))(g, depth)}
          className={`xander-rules-section xander-rules-group`}
        >
          ({renderRule(g.exp, depth + 1)})
        </div>
      );
    }

    function renderRange(r, depth) {
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

    function renderVariable(v, depth) {
      let { scope, name } = v;
      return (
        <div
          style={(config.renderVariableStyle || (() => {}))(v, depth)}
          className="xander-rules-section xander-rules-variable-name"
        >
          {branch(
            config.hasOwnProperty("renderVariable"),
            () => config.renderVariable(v, depth),
            () => (
              <span>
                {scope}
                {scope ? "" : null}
                {name}
              </span>
            )
          )}
        </div>
      );
    }

    function renderRule(ast, depth = 0) {
      let { type, subtype } = ast;
      return (
        <div
          style={(config.renderRuleStyle || (() => {}))(ast, depth)}
          className={`xander-rules-block xander-rules-block-${type} xander-rules-block-${subtype} xander-rules-depth-${depth}`}
        >
          {branch(
            type === "group",
            () => renderGroup(ast, depth),
            type === "function",
            () => renderFunction(ast, depth),
            type === "operator",
            () => renderOperator(ast, depth),
            type === "variable",
            () => renderVariable(ast, depth),
            type === "value",
            () => renderValue(ast, depth),
            type === "range",
            () => renderRange(ast, depth),
            () => <div>error: {type}</div>
          )}
        </div>
      );
    }

    return <div className="xander-rules-formula">{renderRule(ast)}</div>;
  }
}

export default Rule;
