import React, { Component } from 'react';
import { mount } from 'enzyme';
import withFetch from '../../src/FetchContainer';

class Passthrough extends Component {
  render() {
    return (<div {...this.props} />);
  }
}

describe('withFetch', () => {
  it('should assign `fetchAsyncState` as a static property', () => {
    const fetchAsyncState = sinon.stub();

    class Container extends Component {
      render() {
        return (<Passthrough {...this.props} />);
      }
    }

    const DecoratedContainer = withFetch(fetchAsyncState)(Container);
    expect(DecoratedContainer).to.have.property('fetchAsyncState').that.is.equal(fetchAsyncState);
  });

  it('should provide unhandled props to wrapped component', () => {
    const fetchAsyncState = sinon.stub();

    class Container extends Component {
      render() {
        return (<Passthrough {...this.props} />);
      }
    }

    const DecoratedContainer = withFetch(fetchAsyncState)(Container);
    const wrapper = mount(<DecoratedContainer id="foo" />);
    const child = wrapper.find(Passthrough);

    expect(child).to.have.length(1);
    expect(child.prop('id')).to.equal('foo');
  });

  it('should copy non-react statics from wrapped component', () => {
    const fetchAsyncState = sinon.stub();
    const meta = { name: 'Container' };

    class Container extends Component {
      static meta = meta;
    }

    const DecoratedContainer = withFetch(fetchAsyncState)(Container);

    expect(DecoratedContainer).to.have.nested.property('meta.name', meta.name);
  });
});
