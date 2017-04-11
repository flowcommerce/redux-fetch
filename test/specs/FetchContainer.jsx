import React, { Component } from 'react';
import { mount } from 'enzyme';
import ReadyState from '../../src/ReadyState';
import withFetch from '../../src/FetchContainer';
import createMockStore from '../utilities/createMockStore';

class Passthrough extends Component {
  render() {
    return (<div {...this.props} />);
  }
}

class Tada extends Component {
  render() {
    return (<div>Tada!</div>);
  }
}

class Spinner extends Component {
  render() {
    return (<div>Loading...</div>);
  }
}

class Glitch extends Component {
  render() {
    return (<div>Something went wrong...</div>);
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

  it('should render loading component while fetching data requirements', () => {
    const store = createMockStore({ fetching: { status: ReadyState.LOADING } });
    const fetchAsyncState = sinon.stub();

    @withFetch(fetchAsyncState, { renderLoading: () => <Spinner /> })
    class Container extends Component {
      render() {
        return (<Passthrough {...this.props} />);
      }
    }

    const wrapper = mount(<Container store={store} />, { fetching: true });

    expect(wrapper.find(Passthrough)).to.have.length(0);
    expect(wrapper.find(Spinner)).to.have.length(1);
  });

  it('should render failure component if an error is incurred', () => {
    const store = createMockStore({ fetching: { status: ReadyState.FAILURE } });
    const fetchAsyncState = sinon.stub();

    @withFetch(fetchAsyncState, { renderFailure: () => <Glitch /> })
    class Container extends Component {
      render() {
        return (<Passthrough {...this.props} />);
      }
    }

    const wrapper = mount(<Container store={store} />);

    expect(wrapper.find(Passthrough)).to.have.length(0);
    expect(wrapper.find(Glitch)).to.have.length(1);
  });

  it('should render success component when specified', () => {
    const store = createMockStore({ fetching: { status: ReadyState.SUCCESS } });
    const fetchAsyncState = sinon.stub();

    @withFetch(fetchAsyncState, { renderSuccess: () => (<Tada />) })
    class Container extends Component {
      render() {
        return (<Passthrough {...this.props} />);
      }
    }

    const wrapper = mount(<Container store={store} />);

    expect(wrapper.find(Tada)).to.have.length(1);
    expect(wrapper.find(Passthrough)).to.have.length(0);
  });

  it('should render child component after required data is fulfilled', () => {
    const fetchAsyncState = sinon.stub();
    const store = createMockStore({ fetching: { status: ReadyState.SUCCESS } });

    @withFetch(fetchAsyncState)
    class Container extends Component {
      render() {
        return (<Passthrough {...this.props} />);
      }
    }

    const wrapper = mount(<Container store={store} />);

    expect(wrapper.find(Passthrough)).to.have.length(1);
  });
});
