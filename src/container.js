/**
* Copyright (c) 2015, Peter W Moresi
*/
import React, { PropTypes } from 'react';
import {subscribe, getState } from 'pure-flux';
import { location, router } from './index';
import PureRenderMixin from 'react-addons-pure-render-mixin';

class Container extends React.Component {

  render() {

    let { location, router } = getState();

    if (!router || !location) throw Error("Router and location expected to be initialized!");

    var Content = router.content;
    if (!Content) return null;

    // render the content for the route!
    return <Content router={router} location={location} {...this.props }  />
  }
}

export default Container
