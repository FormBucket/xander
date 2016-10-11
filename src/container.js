/**
* Copyright (c) 2015, Peter W Moresi
*/
import React, { PropTypes } from 'react'
import {subscribe, getState } from 'pure-flux'
import PureRenderMixin from 'react-addons-pure-render-mixin';

class Container extends React.Component {

  constructor(props) {
    super(props)
    this.state = getState() || {}
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  componentDidMount() {
    this.token = subscribe( this.handleChange )
  }

  componentWillUnmount() {
    if (typeof this.token === 'function') {
      this.token()
    }
  }

  handleChange(state) {
    this.setState(state)
  }

  render() {
    var { location, router } = this.state;
    if (!router || !location) throw Error("Router and location expected to be initialized!")

    var Content = router.content;
    if (!Content) return null;

    // render the content for the route!
    return <Content args={router.args} params={router.params} {...this.state} />
  }
}

export default Container
