/**
* Copyright (c) 2015, Peter W Moresi
*/
import React from 'react';

class Container extends React.Component {
  render() {
    console.log(this.props.location)
    // properties must be passed in.
    let { router, location } = this.props;

    if (!router || !location) throw Error("Router and location expected to be initialized!");

    var Content = router.content;
    if (!Content) return null;

    // render the content for the route!
    return <Content router={router} location={location} {...this.props }  />
  }
}

export default Container
