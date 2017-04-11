import React, { Component } from 'react';
import withFetch from '../../src/FetchContainer';

class Passthrough extends Component {
  render() {
    return (<div {...this.props} />);
  }
}

describe('withFetch', () => {
  it('should assign `fetchAsyncState` as a static property', () => {
    const fetchAsyncState = sinon.stub();

    @withFetch(fetchAsyncState)
    class Container extends Component {
      render() {
        return (<Passthrough {...this.props} />);
      }
    }

    expect(Container).to.have.property('fetchAsyncState').that.is.equal(fetchAsyncState);
  });
});
