/**
 * Copyright (c) 2015-2018, JC Fisher
 */

import React, { createElement as h } from "react";
import router from "./router";

function isLeftClickEvent(event) {
  return event.button === 0;
}

function isModifiedEvent(event) {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
}

class Link extends React.Component {
  constructor() {
    super();
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event) {
    if (this.props.onClick) this.props.onClick(event);

    if (event.defaultPrevented) return;

    if (isModifiedEvent(event) || !isLeftClickEvent(event)) return;

    if (this.props.stopPropagation) event.stopPropagation();
    event.preventDefault();
    this.props.action ? this.props.action(event) : router.open(this.props.to);
  }

  render() {
    return h(
      this.props.tagName || "a",
      {
        disabled: this.props.disabled,
        className: this.props.className,
        style: this.props.style,
        onClick: this.handleClick,
        href: this.props.to
      },
      this.props.children
    );
  }
}

export default Link;
