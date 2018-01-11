/**
* Copyright (c) 2015, JC Fisher
*/
import React from 'react';

class Container extends React.Component {
  render() {
    // properties must be passed in.
    let { router } = this.props;

    if (!router) throw Error("Router and location expected to be initialized!");

    var Content = router.content;
    if (!Content) return null;

    if (Content.then) {
      return null;
    }

    // render the content for the route!
    return <Content router={router} location={router.location} {...this.props }  />
  }
}

export default Container
