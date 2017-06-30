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

    @withFetch(fetchAsyncState)
    class Container extends Component {
      render() {
        return (<Passthrough {...this.props} />);
      }
    }

    expect(Container).to.have.property('fetchAsyncState').that.is.equal(fetchAsyncState);
  });

  it('should provide unhandled props to wrapped component', () => {
    const fetchAsyncState = sinon.stub();

    @withFetch(fetchAsyncState)
    class Container extends Component {
      render() {
        return (<Passthrough {...this.props} />);
      }
    }

    const wrapper = mount(<Container id="foo" />);
    const child = wrapper.find(Passthrough);

    expect(child).to.have.length(1);
    expect(child.prop('id')).to.equal('foo');
  });

  it('should copy non-react statics from wrapped component', () => {
    const fetchAsyncState = sinon.stub();
    const meta = { name: 'Container' };

    @withFetch(fetchAsyncState)
    class Container extends Component {
      static meta = meta;
    }

    expect(Container).to.have.nested.property('meta.name', meta.name);
  });
});
