import React, { Component } from 'react';
import { mount } from 'enzyme';
import ActionTypes from '../../src/ActionTypes';
import ReadyState from '../../src/ReadyState';
import FetchRootContainer from '../../src/FetchRootContainer';
import createMockStore from '../utilities/createMockStore';
import createMockRouterState from '../utilities/createMockRouterState';

class Child extends Component {
  render() {
    return <div />;
  }
}

describe('FetchRootContainer', () => {
  it('should throw when store is not in scope', () => {
    const routerState = createMockRouterState();

    expect(mount.bind(null,
      <FetchRootContainer routerProps={routerState}>
        <Child />
      </FetchRootContainer>,
    )).to.throw;
  });

  it('should not call fetch aggregator on initial mount when data fetching is complete', () => {
    const store = createMockStore({ fetching: { status: ReadyState.SUCCESS } });
    const routerState = createMockRouterState();
    const promise = new Promise(() => {});
    const aggregator = sinon.stub().returns(promise);

    mount(
      <FetchRootContainer store={store} aggregator={aggregator} routerProps={routerState}>
        <Child />
      </FetchRootContainer>,
    );

    expect(aggregator).to.not.have.been.called;
  });

  it('should call fetch aggregator when forced on initial mount', () => {
    const store = createMockStore({ fetching: { status: ReadyState.SUCCESS } });
    const routerState = createMockRouterState();
    const promise = new Promise(() => {});
    const aggregator = sinon.stub().returns(promise);

    mount(
      <FetchRootContainer
        store={store}
        aggregator={aggregator}
        routerProps={routerState}
        forceInitialFetch>
        <Child />
      </FetchRootContainer>,
    );

    expect(aggregator).to.have.been.calledOnce;
  });

  it('should pass store and router state to aggregator', () => {
    const store = createMockStore({ fetching: { status: ReadyState.PENDING } });
    const routerState = createMockRouterState();
    const promise = new Promise(() => {});
    const aggregator = sinon.stub().returns(promise);

    mount(
      <FetchRootContainer store={store} aggregator={aggregator} routerProps={routerState}>
        <Child />
      </FetchRootContainer>,
    );

    expect(aggregator).to.have.been.calledOnce;
    expect(aggregator).to.have.been.calledWithExactly(store, routerState);
  });

  it('should dispatch FETCH_SUCCESS action after fetching successfully', () => {
    const store = createMockStore({ fetching: { status: ReadyState.PENDING } });
    const routerState = createMockRouterState();
    const promise = Promise.resolve();
    const aggregator = sinon.stub().returns(promise);

    mount(
      <FetchRootContainer aggregator={aggregator} store={store} routerProps={routerState}>
        <Child />
      </FetchRootContainer>,
    );

    return expect(promise).to.have.been.fulfilled.then(() => {
      const [requestAction, successAction] = store.getActions();
      expect(requestAction).to.deep.equal({ type: ActionTypes.FETCH_REQUEST });
      expect(successAction).to.deep.equal({ type: ActionTypes.FETCH_SUCCESS });
    });
  });

  it('should dispatch FETCH_FAILURE action when an error is incurred', () => {
    const store = createMockStore({ fetching: { status: ReadyState.PENDING } });
    const routerState = createMockRouterState();
    const promise = Promise.reject();
    const aggregator = sinon.stub().returns(promise);

    mount(
      <FetchRootContainer aggregator={aggregator} store={store} routerProps={routerState}>
        <Child />
      </FetchRootContainer>,
    );

    return expect(promise).to.have.been.rejected.then(() => {
      const [requestAction, failureAction] = store.getActions();
      expect(requestAction).to.deep.equal({ type: ActionTypes.FETCH_REQUEST });
      expect(failureAction).to.deep.equal({ type: ActionTypes.FETCH_FAILURE });
    });
  });
});
