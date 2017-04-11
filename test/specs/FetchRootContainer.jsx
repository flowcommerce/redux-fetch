import React, { Component } from 'react';
import { mount } from 'enzyme';
import { FetchRootContainer } from '../../src/FetchRootContainer';
import ReadyState from '../../src/ReadyState';
import createMockRouterState from '../utilities/createMockRouterState';

class Child extends Component {
  render() {
    return <div />;
  }
}

describe('FetchRootContainer', () => {
  it('should not call onFetchRouteData when data requirements are met on mount', () => {
    const routerState = createMockRouterState();
    const onFetchRouteData = sinon.stub();

    mount(
      <FetchRootContainer
        isSameLocation
        onFetchRouteData={onFetchRouteData}
        readyState={ReadyState.SUCCESS}
        routerProps={routerState}>
        <Child />
      </FetchRootContainer>,
    );

    expect(onFetchRouteData).to.not.have.been.called;
  });

  it('should call onFetchRouteData when data requirements are not met', () => {
    const routerState = createMockRouterState();
    const onFetchRouteData = sinon.stub();

    mount(
      <FetchRootContainer
        isSameLocation
        onFetchRouteData={onFetchRouteData}
        routerProps={routerState}
        readyState={ReadyState.PENDING}>
        <Child />
      </FetchRootContainer>,
    );

    expect(onFetchRouteData).to.have.been.calledOnce;
  });

  it('should call onFetchRouteData when forced on mount', () => {
    const routerState = createMockRouterState();
    const onFetchRouteData = sinon.stub();

    mount(
      <FetchRootContainer
        isSameLocation
        onFetchRouteData={onFetchRouteData}
        routerProps={routerState}
        readyState={ReadyState.SUCCESS}
        forceInitialFetch>
        <Child />
      </FetchRootContainer>,
    );

    expect(onFetchRouteData).to.have.been.calledOnce;
  });

  it('should provide router state to onFetchRouteData when called on mount', () => {
    const routerState = createMockRouterState();
    const onFetchRouteData = sinon.stub();

    mount(
      <FetchRootContainer
        isSameLocation
        onFetchRouteData={onFetchRouteData}
        readyState={ReadyState.PENDING}
        routerProps={routerState}>
        <Child />
      </FetchRootContainer>,
    );

    expect(onFetchRouteData).to.have.been.calledOnce;
    expect(onFetchRouteData).to.have.been.calledWithExactly(routerState);
  });

  it('should call onFetchRouteData when updated with a different location', () => {
    const routerState = createMockRouterState();
    const onFetchRouteData = sinon.stub();

    const wrapper = mount(
      <FetchRootContainer
        isSameLocation
        onFetchRouteData={onFetchRouteData}
        readyState={ReadyState.SUCCESS}
        routerProps={routerState}>
        <Child />
      </FetchRootContainer>,
    );

    wrapper.setProps({ isSameLocation: false });

    expect(onFetchRouteData).to.have.been.calledOnce;
  });

  it('should set FetchReadyStateRenderer to pending when locations are different', () => {
    const routerState = createMockRouterState();
    const onFetchRouteData = sinon.stub();

    const wrapper = mount(
      <FetchRootContainer
        isSameLocation={false}
        onFetchRouteData={onFetchRouteData}
        readyState={ReadyState.SUCCESS}
        routerProps={routerState}>
        <Child />
      </FetchRootContainer>,
    );

    const child = wrapper.find('FetchReadyStateRenderer');
    expect(child.prop('readyState')).to.equal(ReadyState.PENDING);
  });
});
