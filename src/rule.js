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
          {branch(
            config.hasOwnProperty("renderFunction"),
            () => config.renderFunction(config, f, depth, renderRule),
            () => (
              <span>
                <span className="xander-rules-function-begin">
                  config.renderFunctionBegin(config, f, depth),
                </span>

                <div className="xander-rules-args">
                  {f.args.map(d => renderRule(config, d, depth + 1))}
                </div>

                <span className="xander-rules-function-end  ">
                  {config.renderFunctionEnd(config, f, depth)}
                </span>
              </span>
            )
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
            config.renderString(value),
            subtype === "number",
            config.renderNumber(value),
            subtype === "boolean",
            config.renderBoolean(value),
            subtype === "array",
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
            ),

            "error: unknown operand"
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
          ({renderRule(g.exp, depth + 1)})
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
      renderRule,
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
