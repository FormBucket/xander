import React, { PropTypes } from 'react';
import { dispatch } from 'pure-flux';
import locationStore from 'pure-flux-router/lib/location';

function isLeftClickEvent(event) {
  return event.button === 0
}

function isModifiedEvent(event) {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey)
}

const Link = React.createClass({
  handleClick(event) {

    if (this.props.onClick)
      this.props.onClick(event)

    if (event.defaultPrevented) return;

    if (isModifiedEvent(event) || !isLeftClickEvent(event)) return;


    if (this.props.stopPropagation) event.stopPropagation();
    event.preventDefault();

    this.props.action ? this.props.action(event) : locationStore.open(this.props.to);
  },

  render () {

    if (this.props.type === 'button') {
      return (
        <button disabled={this.props.disabled} className={this.props.className} style={this.props.style} onClick={this.handleClick}>
          {this.props.children}
        </button>
      );
    }

    return (
      <a disabled={this.props.disabled} className={this.props.className} style={this.props.style} onClick={this.handleClick} href={this.props.to}>
        {this.props.children}
      </a>
    );
  }
});

export default Link
