import React from 'react';
import { mount } from 'enzyme';
import createMockStore from '../../utilities/create-mock-store';
import waitFor from '../../utilities/wait-for';
import fetch from '../../../src/components/fetch';
import Spinner from '../../../src/components/spinner';
import Glitch from '../../../src/components/glitch';

const Component = () => <div className="route" />;

function mountWithStore(node) {
  const store = createMockStore({ stateful: true });
  const wrapper = mount(node, { context: { store } });
  return { store, wrapper };
}

describe('fetch(getInitialAsyncState, options)', () => {
  it('should render its default loading component while fetching', () => {
    const getInitialAsyncState = sinon.stub().returns(new Promise(() => {}));
    const WrappedComponent = fetch(getInitialAsyncState, {
      forceInitialFetch: true,
    })(Component);
    const { wrapper } = mountWithStore(<WrappedComponent />);
    expect(wrapper.find(Spinner)).to.have.length(1);
  });

  it('should render a custom loading component while fetching', () => {
    const ActivityIndicator = () => <div className="loading" />;
    const getInitialAsyncState = sinon.stub().returns(new Promise(() => {}));
    const WrappedComponent = fetch(getInitialAsyncState, {
      forceInitialFetch: true,
      renderLoading: () => <ActivityIndicator />,
    })(Component);
    const { wrapper } = mountWithStore(<WrappedComponent />);
    expect(wrapper.find(ActivityIndicator)).to.have.length(1);
    expect(wrapper.find(Spinner)).to.have.length(0);
  });

  it('should render its own failure component when an unhandled error occurs', (done) => {
    const getInitialAsyncState = sinon.stub().returns(Promise.reject());
    const WrappedComponent = fetch(getInitialAsyncState, {
      forceInitialFetch: true,
    })(Component);
    const { wrapper } = mountWithStore(<WrappedComponent />);
    waitFor(
      () => wrapper.state('isFetching') === false,
      'Data fetching timed out',
      () => {
        expect(wrapper.find(Glitch)).to.have.length(1);
        expect(wrapper.find(Component)).to.have.length(0);
        done();
      }
    );
  });

  it('should render route component after data fetching is successful', (done) => {
    const getInitialAsyncState = sinon.stub().returns(Promise.resolve());
    const WrappedComponent = fetch(getInitialAsyncState, {
      forceInitialFetch: true,
    })(Component);
    const { wrapper } = mountWithStore(<WrappedComponent />);
    waitFor(
      () => wrapper.state('isFetching') === false,
      'Data fetching timed out',
      () => {
        expect(wrapper.find(Component)).to.have.length(1);
        done();
      }
    );
  });

  it('should not fetch data requirements when `{ forceInitialFetch: false }`', () => {
    const getInitialAsyncState = sinon.stub();
    const WrappedComponent = fetch(getInitialAsyncState, {
      forceInitialFetch: false,
    })(Component);
    mountWithStore(<WrappedComponent />);
    expect(getInitialAsyncState).to.not.have.been.called;
  });

  it('should fetch data before rendering when `{ forceInitialFetch: true }`', () => {
    const getInitialAsyncState = sinon.stub().returns(Promise.resolve());
    const WrappedComponent = fetch(getInitialAsyncState, {
      forceInitialFetch: true,
    })(Component);
    mountWithStore(<WrappedComponent />);
    expect(getInitialAsyncState).to.have.been.calledOnce;
  });

  it('should pass store\'s dispatch to `getInitialAsyncState`', () => {
    const getInitialAsyncState = sinon.stub().returns(Promise.resolve());
    const WrappedComponent = fetch(getInitialAsyncState, { forceInitialFetch: true })(Component);
    const { store } = mountWithStore(<WrappedComponent />);
    expect(getInitialAsyncState).to.have.been.calledOnce;
    expect(getInitialAsyncState).to.have.been.calledWith(store.dispatch);
  });

  it('should pass the current state to `getInitialAsyncState`', () => {
    const getInitialAsyncState = sinon.stub().returns(Promise.resolve());
    const WrappedComponent = fetch(getInitialAsyncState, { forceInitialFetch: true })(Component);
    const { store } = mountWithStore(<WrappedComponent />);
    expect(getInitialAsyncState).to.have.been.calledOnce;
    expect(getInitialAsyncState).to.have.been.calledWith(store.dispatch, store.getState());
  });

  it('should pass own props to `getInitialAsyncState`', () => {
    const getInitialAsyncState = sinon.stub().returns(Promise.resolve());
    const WrappedComponent = fetch(getInitialAsyncState, { forceInitialFetch: true })(Component);
    const ownProps = { foo: 'bar' };
    const { store: { dispatch, getState } } = mountWithStore(<WrappedComponent {...ownProps} />);
    expect(getInitialAsyncState).to.have.been.calledOnce;
    expect(getInitialAsyncState).to.have.been.calledWith(dispatch, getState(), ownProps);
  });

  it('should throw when store is not in scope', () => {
    const getInitialAsyncState = sinon.stub();
    const WrappedComponent = fetch(getInitialAsyncState, {
      forceInitialFetch: false,
    })(Component);
    expect(mount.bind(null, <WrappedComponent />)).to.throw;
  });
});

describe('fetch.setup(options)', () => {
  it('should overwrite default loading component', () => {
    const ActivityIndicator = () => <div className="loading" />;
    const getInitialAsyncState = sinon.stub().returns(new Promise(() => {}));
    const WrappedComponent = fetch(getInitialAsyncState, {
      forceInitialFetch: true,
    })(Component);

    // Purposely placed after `Component` is decorated with `fetch` to ensure settings can be
    // overwritten after component class is defined. However, not after the component is mounted.
    fetch.setup({ renderLoading: () => <ActivityIndicator /> });

    const { wrapper } = mountWithStore(<WrappedComponent />);

    expect(wrapper.find(Spinner)).to.have.length(0);
    expect(wrapper.find(ActivityIndicator)).to.have.length(1);
  });

  it('should overwrite default failure component', (done) => {
    const Boom = () => <div className="boom" />;
    const getInitialAsyncState = sinon.stub().returns(Promise.reject());
    const WrappedComponent = fetch(getInitialAsyncState, {
      forceInitialFetch: true,
    })(Component);

    // Purposely placed after `Component` is decorated with `fetch` to ensure settings can be
    // overwritten after component class is defined. However, not after the component is mounted.
    fetch.setup({ renderFailure: () => <Boom /> });

    const { wrapper } = mountWithStore(<WrappedComponent />);

    waitFor(
      () => wrapper.state('isFetching') === false,
      'Data fetching timed out',
      () => {
        expect(wrapper.find(Glitch)).to.have.length(0);
        expect(wrapper.find(Boom)).to.have.length(1);
        done();
      }
    );
  });
});
