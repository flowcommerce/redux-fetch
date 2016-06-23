import React from 'react';
import { mount } from 'enzyme';
import { invalidate } from '../../../src/actions';
import fetch from '../../../src/components/fetch';

const RouteComponent = () => <div className="route" />;

const LoadingComponent = () => <div className="loading" />;

function createStore(initialState = {}) {
  return {
    dispatch: sinon.stub(),
    getState: sinon.stub().returns(initialState),
  };
}

function createWrappedComponent(getInitialAsyncState = sinon.stub().returns(Promise.resolve())) {
  const WrappedComponent = fetch(getInitialAsyncState)(RouteComponent, LoadingComponent);
  return { getInitialAsyncState, WrappedComponent };
}

function renderWithStore(Component, store) {
  return mount(<Component />, {
    context: { store },
  });
}

describe('fetch(getInitialAsyncState)(RouteComponent[, LoadingComponent])', () => {
  it('should render its loading component while fetching', () => {
    const store = createStore({ fetching: { shouldFetch: true } });
    const getInitialAsyncState = sinon.stub().returns(new Promise(() => {}));
    const { WrappedComponent } = createWrappedComponent(getInitialAsyncState);
    const wrapper = renderWithStore(WrappedComponent, store);
    expect(wrapper.find(LoadingComponent)).to.have.length(1);
  });

  it('should render its route component after fetching', (done) => {
    const store = createStore({ fetching: { shouldFetch: true } });
    const { WrappedComponent } = createWrappedComponent();
    const wrapper = renderWithStore(WrappedComponent, store);
    // defer to next tick to allow setState(...) to be picked up by event loop
    setTimeout(() => {
      expect(wrapper.find(RouteComponent)).to.have.length(1);
      done();
    }, 0);
  });

  it('should invalidate fetch state when rendered', () => {
    const store = createStore({ fetching: { shouldFetch: false } });
    const { WrappedComponent } = createWrappedComponent();
    renderWithStore(WrappedComponent, store);
    expect(store.dispatch).to.have.been.calledOnce;
    expect(store.dispatch).to.have.been.calledWithExactly(invalidate());
  });

  it('should not fetch data requirements when `{ shouldFetch: false }`', () => {
    const store = createStore({ fetching: { shouldFetch: false } });
    const { getInitialAsyncState, WrappedComponent } = createWrappedComponent();
    renderWithStore(WrappedComponent, store);
    expect(getInitialAsyncState).to.not.have.been.called;
  });

  it('should fetch data before rendering when `{ shouldFetch: true }`', () => {
    const store = createStore({ fetching: { shouldFetch: true } });
    const { getInitialAsyncState, WrappedComponent } = createWrappedComponent();
    renderWithStore(WrappedComponent, store);
    expect(getInitialAsyncState).to.have.been.calledOnce;
  });

  it('should throw when store is configured incorrectly', () => {
    const store = createStore();
    const { WrappedComponent } = createWrappedComponent();
    expect(mount.bind(null, <WrappedComponent />)).to.throw;
    expect(renderWithStore.bind(null, WrappedComponent, store)).to.throw;
  });

  it('should not throw an error when store is configured correctly', () => {
    const store = createStore({ fetching: { shouldFetch: false } });
    const { WrappedComponent } = createWrappedComponent();
    expect(renderWithStore.bind(null, WrappedComponent, store)).to.not.throw;
  });
});
