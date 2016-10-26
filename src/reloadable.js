import React, { PropTypes } from 'react'
import {location} from 'pure-flux-router'

const Reloadable = React.createClass({

  componentDidMount() {

    if (this.props.onReload) {

      // run the reload on the initial load.
      this.props.onReload();

      this.unsubscribe = location.subscribe( (state, action) => {
        // set timeout to give componentWillUnmount an opportunity to run first.
        setTimeout(() => {
          // if the component is unsubscribed then a new page is loaded.
          // do not reload this component!
          if (this.unsubscribe) { this.props.onReload(); }
        }, 1)
      })

    }
  },

  componentWillUnmount() {

    if (this.unsubscribe) {

      // cancel the subscription when the page is unloaded.
      this.unsubscribe()

      // delete it so we know that the subscription is dead.
      delete this.unsubscribe
    }

    // run the unload code for the page, if applicable.
    if (this.props.onUnload) {
      this.props.onUnload()
    }
  },

  render () {
    return (
      <div>
        {this.props.children}
      </div>
    )
  }
})

Reloadable.propTypes = {
  onReload: React.PropTypes.func,
  onUnload: React.PropTypes.func
}

export default Reloadable
