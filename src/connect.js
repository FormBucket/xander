import React from 'react';
import { subscribe, getState } from 'fluxury'

function _connect(getState, subscribe, Composed) {
  return (
    class Connect extends React.PureComponent {

      constructor(props) {
        super(props);
        this.state = getState();
        this.handleChange = this.handleChange.bind(this);
      }

      componentDidMount() {
        this.token = subscribe( this.handleChange );
      }

      componentWillUnmount() {
        if (typeof this.token === 'function') {
          this.token();
        }
      }

      handleChange(state) {
        this.setState(state);
      }

      render() {
        return (<Composed {...this.state} {...this.props} />);
      }
    }
  )
}

export function connectStore (store, Composed) {
  return _connect( store.getState, store.subscribe, Composed );
}

export function connect(Composed) {
  return _connect( getState, subscribe, Composed );
}
