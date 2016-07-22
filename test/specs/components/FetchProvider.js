import React, { Component } from 'react';
import { mount } from 'enzyme';
import { fetchShape } from '../../../src/utilities/PropTypes';
import FetchProvider from '../../../src/components/FetchProvider';
import createMockStore from '../../utilities/createMockStore';
import createMockRouterState from '../../utilities/createMockRouterState';

describe('FetchProvider', () => {
  class Child extends Component {

    static contextTypes = {
      fetch: fetchShape,
    };

    render() {
      return <div />;
    }
  }

  it('should throw when store is not in scope', () => {
    const routerState = createMockRouterState();

    expect(mount.bind(null,
      <FetchProvider routerProps={routerState}>
        <Child />
      </FetchProvider>
    )).to.throw;
  });

  it('should not call fetch aggregator on initial mount', () => {
    const store = createMockStore();
    const routerState = createMockRouterState();
    const promise = new Promise(() => {});
    const aggregator = sinon.stub().returns(promise);

    mount(
      <FetchProvider store={store} aggregator={aggregator} routerProps={routerState}>
        <Child />
      </FetchProvider>
    );

    expect(aggregator).to.not.have.been.called;
  });

  it('should call fetch aggregator when `forceInitialFetch` is `true`', () => {
    const store = createMockStore();
    const routerState = createMockRouterState();
    const promise = new Promise(() => {});
    const aggregator = sinon.stub().returns(promise);

    mount(
      <FetchProvider
        store={store}
        aggregator={aggregator}
        routerProps={routerState}
        forceInitialFetch>
        <Child />
      </FetchProvider>
    );

    expect(aggregator).to.have.been.calledOnce;
  });

  it('should pass store and router state to aggregator', () => {
    const store = createMockStore();
    const routerState = createMockRouterState();
    const promise = new Promise(() => {});
    const aggregator = sinon.stub().returns(promise);

    mount(
      <FetchProvider
        store={store}
        aggregator={aggregator}
        routerProps={routerState}
        forceInitialFetch>
        <Child />
      </FetchProvider>
    );

    expect(aggregator).to.have.been.calledOnce;
    expect(aggregator).to.have.been.calledWithExactly(store, routerState);
  });

  it('should add render callbacks to the child context', () => {
    const routerState = createMockRouterState();
    const renderFailure = sinon.stub();
    const renderLoading = sinon.stub();
    const store = createMockStore();
    const wrapper = mount(
      <FetchProvider
        store={store}
        routerProps={routerState}
        renderFailure={renderFailure}
        renderLoading={renderLoading}>
        <Child />
      </FetchProvider>
    );

    const child = wrapper.find(Child).get(0);

    expect(child).to.have.deep.property('context.fetch.renderFailure', renderFailure);
    expect(child).to.have.deep.property('context.fetch.renderLoading', renderLoading);
  });

  it('should add `{ fetching: true }` to the child context while fetching', () => {
    const store = createMockStore();
    const routerState = createMockRouterState();
    const promise = new Promise(() => {});
    const aggregator = sinon.stub().returns(promise);
    const wrapper = mount(
      <FetchProvider
        store={store}
        aggregator={aggregator}
        routerProps={routerState}
        forceInitialFetch>
        <Child />
      </FetchProvider>
    );

    const child = wrapper.find(Child).get(0);

    expect(child).to.have.deep.property('context.fetch.fetching', true);
  });

  it('should add `{ fetching: false }` to the child context while not fetching', () => {
    const store = createMockStore();
    const routerState = createMockRouterState();
    const promise = new Promise(() => {});
    const aggregator = sinon.stub().returns(promise);
    const wrapper = mount(
      <FetchProvider
        store={store}
        aggregator={aggregator}
        routerProps={routerState}>
        <Child />
      </FetchProvider>
    );

    const child = wrapper.find(Child).get(0);

    expect(child).to.have.deep.property('context.fetch.fetching', false);
  });

  it('should update the child context after fetching successfully', () => {
    const store = createMockStore();
    const routerState = createMockRouterState();
    const promise = Promise.resolve();
    const aggregator = sinon.stub().returns(promise);
    const wrapper = mount(
      <FetchProvider
        store={store}
        aggregator={aggregator}
        routerProps={routerState}
        forceInitialFetch>
        <Child />
      </FetchProvider>
    );

    promise.then(() => {
      const child = wrapper.find(Child).get(0);
      expect(child).to.have.deep.property('context.fetch.fetching', false);
    });

    return promise;
  });

  it('should update the child context when an error is incurred', () => {
    const store = createMockStore();
    const routerState = createMockRouterState();
    const error = 'something went wrong';
    const promise = Promise.reject(error);
    const aggregator = sinon.stub().returns(promise);
    const wrapper = mount(
      <FetchProvider
        store={store}
        aggregator={aggregator}
        routerProps={routerState}
        forceInitialFetch>
        <Child />
      </FetchProvider>
    );

    return promise.catch(() => {}).then(() => {
      const child = wrapper.find(Child).get(0);
      expect(child).to.have.deep.property('context.fetch.fetching', false);
      expect(child).to.have.deep.property('context.fetch.error', error);
    });
  });
});
