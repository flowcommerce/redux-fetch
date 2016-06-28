import React from 'react';
import { mount } from 'enzyme';
import createMockStore from '../../utilities/create-mock-store';
import { invalidate } from '../../../src/actions';
import fetch from '../../../src/components/fetch';
import Spinner from '../../../src/components/spinner';

const RouteComponent = () => <div className="route" />;

function createWrappedComponent(getInitialAsyncState = sinon.stub().returns(Promise.resolve())) {
  const WrappedComponent = fetch(getInitialAsyncState)(RouteComponent);
  return { getInitialAsyncState, WrappedComponent };
}

function mountWithStore(node, store) {
  return mount(node, { context: { store } });
}

describe('fetch(getInitialAsyncState)(RouteComponent[, ActivityIndicator])', () => {
  it('should render its default activity indicator while fetching', () => {
    const store = createMockStore({ fetching: { shouldFetch: true } });
    const getInitialAsyncState = sinon.stub().returns(new Promise(() => {}));
    const WrappedComponent = fetch(getInitialAsyncState)(RouteComponent);
    const wrapper = mountWithStore(<WrappedComponent />, store);
    expect(wrapper.find(Spinner)).to.have.length(1);
  });

  it('should render its loading component while fetching', () => {
    const ActivityIndicator = () => <div className="loading" />;
    const store = createMockStore({ fetching: { shouldFetch: true } });
    const getInitialAsyncState = sinon.stub().returns(new Promise(() => {}));
    const WrappedComponent = fetch(getInitialAsyncState)(RouteComponent, ActivityIndicator);
    const wrapper = mountWithStore(<WrappedComponent />, store);
    expect(wrapper.find(ActivityIndicator)).to.have.length(1);
  });

  it('should render its route component after fetching', (done) => {
    const store = createMockStore({ fetching: { shouldFetch: true } });
    const { WrappedComponent } = createWrappedComponent();
    const wrapper = mountWithStore(<WrappedComponent />, store);
    // defer to next tick to allow setState(...) to be picked up by event loop
    setTimeout(() => {
      expect(wrapper.find(RouteComponent)).to.have.length(1);
      done();
    }, 0);
  });

  it('should invalidate fetch state when rendered', () => {
    const store = createMockStore({ fetching: { shouldFetch: false } });
    const { WrappedComponent } = createWrappedComponent();
    mountWithStore(<WrappedComponent />, store);
    expect(store.dispatch).to.have.been.calledOnce;
    expect(store.dispatch).to.have.been.calledWithExactly(invalidate());
  });

  it('should not fetch data requirements when `{ shouldFetch: false }`', () => {
    const store = createMockStore({ fetching: { shouldFetch: false } });
    const { getInitialAsyncState, WrappedComponent } = createWrappedComponent();
    mountWithStore(<WrappedComponent />, store);
    expect(getInitialAsyncState).to.not.have.been.called;
  });

  it('should fetch data before rendering when `{ shouldFetch: true }`', () => {
    const store = createMockStore({ fetching: { shouldFetch: true } });
    const { getInitialAsyncState, WrappedComponent } = createWrappedComponent();
    mountWithStore(<WrappedComponent />, store);
    expect(getInitialAsyncState).to.have.been.calledOnce;
  });

  it('should throw when store is configured incorrectly', () => {
    const store = createMockStore();
    const { WrappedComponent } = createWrappedComponent();
    expect(mount.bind(null, <WrappedComponent />)).to.throw;
    expect(mountWithStore.bind(null, WrappedComponent, store)).to.throw;
  });

  it('should not throw an error when store is configured correctly', () => {
    const store = createMockStore({ fetching: { shouldFetch: false } });
    const { WrappedComponent } = createWrappedComponent();
    expect(mountWithStore.bind(null, WrappedComponent, store)).to.not.throw;
  });
});

describe('fetch.setup(options)', () => {
  it('should overwrite default activity indicator', () => {
    const MyActivityIndicator = () => <div />;
    fetch.setup({ activityIndicator: MyActivityIndicator });
    const store = createMockStore({ fetching: { shouldFetch: true } });
    const getInitialAsyncState = sinon.stub().returns(new Promise(() => {}));
    const { WrappedComponent } = createWrappedComponent(getInitialAsyncState);
    const wrapper = mountWithStore(<WrappedComponent />, store);
    expect(wrapper.find(Spinner)).to.have.length(0);
    expect(wrapper.find(MyActivityIndicator)).to.have.length(1);
  });

  it('should overwrite default selector for fetching state', () => {
    const store = createMockStore({ custom: { shouldFetch: false } });
    const { WrappedComponent } = createWrappedComponent();
    expect(mountWithStore.bind(null, WrappedComponent, store)).to.not.throw;
  });
});
