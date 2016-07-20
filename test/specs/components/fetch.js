import React from 'react';
import { mount } from 'enzyme';
import createMockStore from '../../utilities/createMockStore';
import waitFor from '../../utilities/waitFor';
import fetch from '../../../src/components/fetch';

const Spinner = () => <div>Loading...</div>;
const Glitch = error => <div>{error.message}</div>;
const Component = () => <div className="route" />;

function mountWithStore(node) {
  const store = createMockStore({ stateful: true });
  const wrapper = mount(node, { context: { store } });
  return { store, wrapper };
}

describe('fetch(getAsyncState, options)', () => {
  it('should render loading component while fetching data requirements', () => {
    const getAsyncState = sinon.stub().returns(new Promise(() => {}));
    const WrappedComponent = fetch(getAsyncState, {
      renderLoading: () => <Spinner />,
    })(Component);
    const { wrapper } = mountWithStore(<WrappedComponent />);
    expect(wrapper.find(Spinner)).to.have.length(1);
    expect(wrapper.find(Component)).to.have.length(0);
  });

  it('should render failure component if an error is incurred', (done) => {
    const getAsyncState = sinon.stub().returns(Promise.reject({ message: 'No cake for you.' }));
    const WrappedComponent = fetch(getAsyncState, {
      renderFailure: (error) => <Glitch error={error} />,
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

  it('should render route component after data requirements are fulfilled', (done) => {
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

  it('should not fetch data requirements when `shouldFetchBeforeMount` returns `false`', () => {
    const getAsyncState = sinon.stub();
    const WrappedComponent = fetch(getAsyncState, {
      shouldFetchBeforeMount: () => false,
    })(Component);
    mountWithStore(<WrappedComponent />);
    expect(getAsyncState).to.not.have.been.called;
  });

  it('should fetch data before rendering when `shouldFetchBeforeMount` returns `true`', () => {
    const getAsyncState = sinon.stub().returns(Promise.resolve());
    const WrappedComponent = fetch(getAsyncState, {
      shouldFetchBeforeMount: () => true,
    })(Component);
    mountWithStore(<WrappedComponent />);
    expect(getAsyncState).to.have.been.calledOnce;
  });

  it('should not fetch when `shouldFetchBeforeUpdate` returns `false`', () => {
    const getAsyncState = sinon.stub().returns(Promise.resolve());
    const WrappedComponent = fetch(getAsyncState, {
      shouldFetchBeforeMount: () => false,
      shouldFetchBeforeUpdate: () => false,
    })(Component);
    const { wrapper } = mountWithStore(<WrappedComponent />);
    expect(getAsyncState).to.not.have.been.called;
    wrapper.setProps({ foo: 'bar' });
    expect(getAsyncState).to.not.have.been.called;
  });

  it('should fetch when `shouldFetchBeforeUpdate` returns `true`', () => {
    const getAsyncState = sinon.stub().returns(Promise.resolve());
    const WrappedComponent = fetch(getAsyncState, {
      shouldFetchBeforeMount: () => false,
      shouldFetchBeforeUpdate: () => true,
    })(Component);
    const { wrapper } = mountWithStore(<WrappedComponent />);
    expect(getAsyncState).to.not.have.been.called;
    wrapper.setProps({ foo: 'bar' });
    expect(getAsyncState).to.have.been.calledOnce;
  });

  it('should inject own props and app state to `shouldFetchBeforeMount`', () => {
    const ownProps = { foo: 'baz' };
    const shouldFetchBeforeMount = sinon.stub().returns(false);
    const getAsyncState = sinon.stub().returns(Promise.resolve());
    const WrappedComponent = fetch(getAsyncState, { shouldFetchBeforeMount })(Component);
    const { store } = mountWithStore(<WrappedComponent {...ownProps} />);
    const state = store.getState();
    expect(shouldFetchBeforeMount).to.have.been.calledWithExactly(ownProps, state);
  });

  it('should inject previous, next props, and app state to `shouldFetchBeforeUpdate`', () => {
    const prevProps = { foo: 'baz' };
    const nextProps = { foo: 'bar' };
    const shouldFetchBeforeUpdate = sinon.stub().returns(false);
    const getAsyncState = sinon.stub().returns(Promise.resolve());
    const WrappedComponent = fetch(getAsyncState, { shouldFetchBeforeUpdate })(Component);
    const { store, wrapper } = mountWithStore(<WrappedComponent {...prevProps} />);
    const state = store.getState();
    wrapper.setProps(nextProps);
    expect(shouldFetchBeforeUpdate).to.have.been.calledWithExactly(prevProps, nextProps, state);
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
  it('should have renderFailure option that is undefined', () => {
    expect(fetch.settings.renderFailure).to.be.undefined;
  });

  it('should have renderLoading option that is undefined', () => {
    expect(fetch.settings.renderLoading).to.be.undefined;
  });

  it('should have renderSuccess option that is undefined', () => {
    expect(fetch.settings.renderSuccess).to.be.undefined;
  });

  context('when shouldFetchBeforeMount() is called', () => {
    it('should ALWAYS return true', () => {
      expect(fetch.settings.shouldFetchBeforeMount()).to.be.true;
    });
  });

  context('when shouldFetchBeforeUpdate() is called', () => {
    it('should return `false` when prev/next route location are the same', () => {
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

      expect(fetch.settings.shouldFetchBeforeUpdate(prevProps, nextProps)).to.be.false;
    });

    it('should return `true` when prev/next route location differ by pathname', () => {
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

      expect(fetch.settings.shouldFetchBeforeUpdate(prevProps, nextProps)).to.be.true;
    });

    it('should return `true` when prev/next route location differ by search string', () => {
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

      expect(fetch.settings.shouldFetchBeforeUpdate(prevProps, nextProps)).to.be.true;
    });
  });
});

describe('fetch.setup(options)', () => {
  it('should overwrite default loading component', () => {
    const getAsyncState = sinon.stub().returns(new Promise(() => {}));
    const WrappedComponent = fetch(getAsyncState)(Component);

    // Purposely placed after `Component` is decorated with `fetch` to ensure settings can be
    // overwritten after component class is defined. However, not after the component is mounted.
    fetch.setup({ renderLoading: () => <Spinner /> });

    const { wrapper } = mountWithStore(<WrappedComponent />);

    expect(wrapper.find(Spinner)).to.have.length(1);
  });

  it('should overwrite default failure component', (done) => {
    const getAsyncState = sinon.stub().returns(Promise.reject());
    const WrappedComponent = fetch(getAsyncState)(Component);

    // Purposely placed after `Component` is decorated with `fetch` to ensure settings can be
    // overwritten after component class is defined. However, not after the component is mounted.
    fetch.setup({ renderFailure: error => <Glitch error={error} /> });

    const { wrapper } = mountWithStore(<WrappedComponent />);

    waitFor(
      () => wrapper.state('isFetching') === false,
      'Data fetching timed out',
      () => {
        expect(wrapper.find(Glitch)).to.have.length(1);
        done();
      }
    );
  });
});
