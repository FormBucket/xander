import React from 'react';

export default function connectStore (store, Composed, transform=d=>d) {
  return (
    class Connect extends React.PureComponent {

      constructor(props) {
        super(props)
        this.state = transform( store.getState() ) || {}
        this.handleChange = this.handleChange.bind(this)
      }

      componentDidMount() {
        this.token = store.subscribe( this.handleChange )
      }

      componentWillUnmount() {
        if (typeof this.token === 'function') {
          this.token()
        }
      }

      handleChange(state) {
        this.setState(
          transform( state )
        )
      }

      render() {
        return (<Composed {...this.state} {...this.props} />);
      }
    }
  )
}
