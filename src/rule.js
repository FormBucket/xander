import React from "react";
import { branch, compile, isText, isObject } from "formula";
let key = 0;

// take an ast and convert inflix and prefix operator into function calls.
function functify(ast) {
  function go(n) {
    return n;
  }

  return _doTheFunc(ast);
}

class Rule extends React.Component {
  render() {
    let { props } = this;
    let { ast } = compile(props.exp);

    function renderFunction(f, depth) {
      return (
        <div
          className={`xander-rules-block xander-rules-function xander-rules-depth-${depth}`}
        >
          {f.name} (
          <div className="xander-rules-args">
            {f.args.map(d => renderRule(d, depth + 1))}
          </div>
          )
        </div>
      );
    }

    function renderOperand(o, depth) {
      let { type, subtype, scope, name, value, items } = o;
      return branch(
        type === "value" && subtype === "string",
        () => (
          <span className="xander-rules-value xander-rules-value-string">
            "{value}"
          </span>
        ),
        type === "value" && subtype === "number",
        () => (
          <span className="xander-rules-value xander-rules-value-number">
            {value}
          </span>
        ),
        type === "value" && subtype === "boolean",
        () => (
          <span className="xander-rules-value xander-rules-value-boolean">
            {value ? props.labelTRUE || "TRUE" : props.labelFALSE || "FALSE"}
          </span>
        ),
        type === "value" && subtype === "array",
        () => (
          <div
            className={`xander-rules-block xander-rules-value xander-rules-array xander-rules-depth-${depth}`}
          >
            [
            {items.map(d => (
              <div
                key={key++}
                className={`xander-rules-block xander-rules-value xander-rules-array xander-rules-depth-${depth}`}
              >
                {renderRule(d, depth + 1)}
              </div>
            ))}
            ]
          </div>
        ),
        type === "variable",
        () => (
          <span className="xander-rules-variable-name">
            {scope}
            {scope ? "!" : null}
            {name}
          </span>
        ),
        type === "operator",
        () => renderOperator(o),
        type === "function",
        () => renderFunction(o),
        <span className="xander-rules-operand-unknown">{type}</span>
      );
    }

    function renderOperator({ subtype, operands }, depth) {
      if (operands.length === 1) {
        return (
          <div
            className={`xander-rules-block xander-rules-operator xander-rules-depth-${depth}`}
          >
            <span className={`xander-rules-operator-${subtype}`}>
              {branch(
                subtype == "prefix-minus",
                props.labelPrefixMINUS || "-",
                subtype == "prefix-plus",
                props.labelPrefixPLUS || "+"
              )}
            </span>
            <span className="xander-rules-rhs">
              {renderOperand(operands[0], depth)}
            </span>
          </div>
        );
      }

      if (operands.length === 2) {
        return (
          <div
            className={`xander-rules-block xander-rules-operator xander-rules-depth-${depth}`}
          >
            <span className="xander-rules-lhs">
              {renderOperand(operands[0], depth)}
            </span>{" "}
            <span className={`xander-rules-operator-${subtype}`}>
              {branch(
                subtype == "infix-eq",
                props.labelEQ || "=",
                subtype == "infix-ne",
                props.labelNE || "<>",
                subtype == "infix-gt",
                props.labelGT || "<",
                subtype == "infix-gte",
                props.labelGTE || "<=",
                subtype == "infix-lt",
                props.labelLE || ">",
                subtype == "infix-lte",
                props.labelLTE || ">=",
                subtype == "infix-add",
                props.labelADD || "+",
                subtype == "infix-subtract",
                props.labelSUB || "-",
                subtype == "infix-multiply",
                props.labelMUL || "*",
                subtype == "infix-divide",
                props.labelDIV || "/",
                subtype == "infix-power",
                props.labelMUL || "^",
                subtype == "infix-concat",
                props.labelMUL || "&",
                props.labelDefault || "huh?"
              )}
            </span>{" "}
            <span className="xander-rules-rhs">
              {renderOperand(operands[1], depth)}
            </span>
          </div>
        );
      }

      return <div>unexpected number of operands!</div>;
    }

    function renderGroup(g, depth) {
      return (
        <div
          key={key++}
          className={`xander-rules-block xander-rules-group xander-rules-depth-${depth}`}
        >
          ({renderRule(g.exp, depth + 1)})
        </div>
      );
    }

    function renderRange(r, depth) {
      return (
        <div>
          {r.topLeft.name}:{r.bottomRight.name}
        </div>
      );
    }
    function renderRule(ast, depth = 0) {
      return branch(
        ast.type === "group",
        () => renderGroup(ast, depth),
        ast.type === "function",
        () => renderFunction(ast, depth),
        ast.type === "operator",
        () => renderOperator(ast, depth),
        ast.type === "value" || ast.type === "variable",
        () => renderOperand(ast, depth),
        ast.type === "range",
        () => renderRange(ast, depth)
      );
    }

    return <div className="xander-rules-formula">{renderRule(ast)}</div>;
  }
}

export default Rule;
