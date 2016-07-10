import React from 'react';
import { isElementOfType } from 'react-addons-test-utils';
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

describe('fetch(getAsyncState, options)', () => {
  it('should render its default loading component while fetching', () => {
    const getAsyncState = sinon.stub().returns(new Promise(() => {}));
    const WrappedComponent = fetch(getAsyncState)(Component);
    const { wrapper } = mountWithStore(<WrappedComponent />);
    expect(wrapper.find(Spinner)).to.have.length(1);
  });

  it('should render a custom loading component while fetching', () => {
    const ActivityIndicator = () => <div className="loading" />;
    const getAsyncState = sinon.stub().returns(new Promise(() => {}));
    const WrappedComponent = fetch(getAsyncState, {
      renderLoading: () => <ActivityIndicator />,
    })(Component);
    const { wrapper } = mountWithStore(<WrappedComponent />);
    expect(wrapper.find(ActivityIndicator)).to.have.length(1);
    expect(wrapper.find(Spinner)).to.have.length(0);
  });

  it('should render its own failure component when an unhandled error occurs', (done) => {
    const getAsyncState = sinon.stub().returns(Promise.reject());
    const WrappedComponent = fetch(getAsyncState)(Component);
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
    const getAsyncState = sinon.stub().returns(Promise.resolve());
    const WrappedComponent = fetch(getAsyncState)(Component);
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

  it('should not fetch data requirements when `shouldFetchOnMount` returns `false`', () => {
    const getAsyncState = sinon.stub();
    const WrappedComponent = fetch(getAsyncState, {
      shouldFetchOnMount: () => false,
    })(Component);
    mountWithStore(<WrappedComponent />);
    expect(getAsyncState).to.not.have.been.called;
  });

  it('should fetch data before rendering when `shouldFetchOnMount` returns `true`', () => {
    const getAsyncState = sinon.stub().returns(Promise.resolve());
    const WrappedComponent = fetch(getAsyncState, {
      shouldFetchOnMount: () => true,
    })(Component);
    mountWithStore(<WrappedComponent />);
    expect(getAsyncState).to.have.been.calledOnce;
  });

  it('should not fetch when `shouldFetchOnUpdate` returns `false`', () => {
    const getAsyncState = sinon.stub().returns(Promise.resolve());
    const WrappedComponent = fetch(getAsyncState, {
      shouldFetchOnMount: () => false,
      shouldFetchOnUpdate: () => false,
    })(Component);
    const { wrapper } = mountWithStore(<WrappedComponent />);
    expect(getAsyncState).to.not.have.been.called;
    wrapper.setProps({ foo: 'bar' });
    expect(getAsyncState).to.not.have.been.called;
  });

  it('should fetch when `shouldFetchOnUpdate` returns `true`', () => {
    const getAsyncState = sinon.stub().returns(Promise.resolve());
    const WrappedComponent = fetch(getAsyncState, {
      shouldFetchOnMount: () => false,
      shouldFetchOnUpdate: () => true,
    })(Component);
    const { wrapper } = mountWithStore(<WrappedComponent />);
    expect(getAsyncState).to.not.have.been.called;
    wrapper.setProps({ foo: 'bar' });
    expect(getAsyncState).to.have.been.calledOnce;
  });

  it('should inject application state and own props in `shouldFetchOnMount`', () => {
    const ownProps = { foo: 'baz' };
    const shouldFetchOnMount = sinon.stub().returns(false);
    const getAsyncState = sinon.stub().returns(Promise.resolve());
    const WrappedComponent = fetch(getAsyncState, { shouldFetchOnMount })(Component);
    const { store } = mountWithStore(<WrappedComponent {...ownProps} />);
    const state = store.getState();
    expect(shouldFetchOnMount).to.have.been.calledWithExactly(state, ownProps);
  });

  it('should inject application state, previous and next props in `shouldFetchOnUpdate`', () => {
    const prevProps = { foo: 'baz' };
    const nextProps = { foo: 'bar' };
    const shouldFetchOnUpdate = sinon.stub().returns(false);
    const getAsyncState = sinon.stub().returns(Promise.resolve());
    const WrappedComponent = fetch(getAsyncState, { shouldFetchOnUpdate })(Component);
    const { store, wrapper } = mountWithStore(<WrappedComponent {...prevProps} />);
    const state = store.getState();
    wrapper.setProps(nextProps);
    expect(shouldFetchOnUpdate).to.have.been.calledWithExactly(state, prevProps, nextProps);
  });

  it('should pass store\'s dispatch to `getAsyncState`', () => {
    const getAsyncState = sinon.stub().returns(Promise.resolve());
    const WrappedComponent = fetch(getAsyncState)(Component);
    const { store } = mountWithStore(<WrappedComponent />);
    expect(getAsyncState).to.have.been.calledOnce;
    expect(getAsyncState).to.have.been.calledWith(store.dispatch);
  });

  it('should pass the current state to `getAsyncState`', () => {
    const getAsyncState = sinon.stub().returns(Promise.resolve());
    const WrappedComponent = fetch(getAsyncState)(Component);
    const { store } = mountWithStore(<WrappedComponent />);
    expect(getAsyncState).to.have.been.calledOnce;
    expect(getAsyncState).to.have.been.calledWith(store.dispatch, store.getState());
  });

  it('should pass own props to `getAsyncState`', () => {
    const getAsyncState = sinon.stub().returns(Promise.resolve());
    const WrappedComponent = fetch(getAsyncState)(Component);
    const ownProps = { foo: 'bar' };
    const { store: { dispatch, getState } } = mountWithStore(<WrappedComponent {...ownProps} />);
    expect(getAsyncState).to.have.been.calledOnce;
    expect(getAsyncState).to.have.been.calledWith(dispatch, getState(), ownProps);
  });

  it('should throw when store is not in scope', () => {
    const getAsyncState = sinon.stub();
    const WrappedComponent = fetch(getAsyncState)(Component);
    expect(mount.bind(null, <WrappedComponent />)).to.throw;
  });
});


describe('default fetch settings', () => {
  context('when renderFailure() is called', () => {
    it('should return <Glitch /> element', () => {
      expect(isElementOfType(fetch.settings.renderFailure(), Glitch)).to.be.true;
    });
  });

  context('when renderLoading() is called', () => {
    it('should return <Spinner /> element', () => {
      expect(isElementOfType(fetch.settings.renderLoading(), Spinner)).to.be.true;
    });
  });

  context('when shouldFetchOnMount() is called', () => {
    it('should ALWAYS return true', () => {
      expect(fetch.settings.shouldFetchOnMount()).to.be.true;
    });
  });

  context('when shouldFetchOnUpdate() is called', () => {
    it('should return `false` when prev/next route location are the same', () => {
      const state = {};

      const prevProps = {
        location: {
          pathname: '/path/to/resource',
          search: '?q=monkeys',
        },
      };

      const nextProps = {
        location: {
          pathname: '/path/to/resource',
          search: '?q=monkeys',
        },
      };

      expect(fetch.settings.shouldFetchOnUpdate(state, prevProps, nextProps)).to.be.false;
    });

    it('should return `true` when prev/next route location differ by pathname', () => {
      const state = {};

      const prevProps = {
        location: {
          pathname: '/path/to/resource',
          search: '?q=monkeys',
        },
      };

      const nextProps = {
        location: {
          pathname: '/path/to/other/resource',
          search: '?q=monkeys',
        },
      };

      expect(fetch.settings.shouldFetchOnUpdate(state, prevProps, nextProps)).to.be.true;
    });

    it('should return `true` when prev/next route location differ by search string', () => {
      const state = {};

      const prevProps = {
        location: {
          pathname: '/path/to/resource',
          search: '?q=monkeys',
        },
      };

      const nextProps = {
        location: {
          pathname: '/path/to/resource',
          search: '?q=dolphins',
        },
      };

      expect(fetch.settings.shouldFetchOnUpdate(state, prevProps, nextProps)).to.be.true;
    });
  });
});

describe('fetch.setup(options)', () => {
  it('should overwrite default loading component', () => {
    const ActivityIndicator = () => <div className="loading" />;
    const getAsyncState = sinon.stub().returns(new Promise(() => {}));
    const WrappedComponent = fetch(getAsyncState)(Component);

    // Purposely placed after `Component` is decorated with `fetch` to ensure settings can be
    // overwritten after component class is defined. However, not after the component is mounted.
    fetch.setup({ renderLoading: () => <ActivityIndicator /> });

    const { wrapper } = mountWithStore(<WrappedComponent />);

    expect(wrapper.find(Spinner)).to.have.length(0);
    expect(wrapper.find(ActivityIndicator)).to.have.length(1);
  });

  it('should overwrite default failure component', (done) => {
    const Boom = () => <div className="boom" />;
    const getAsyncState = sinon.stub().returns(Promise.reject());
    const WrappedComponent = fetch(getAsyncState)(Component);

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
