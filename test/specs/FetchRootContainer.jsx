import React, { Component } from 'react';
import { mount } from 'enzyme';
import { FetchRootComponent } from '../../src/FetchRootContainer';
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
      <FetchRootComponent
        onFetchRouteData={onFetchRouteData}
        readyState={ReadyState.SUCCESS}
        routerProps={routerState}>
        <Child />
      </FetchRootComponent>,
    );

    expect(onFetchRouteData).to.not.have.been.called;
  });

  it('should call onFetchRouteData when data requirements are not met on mount', () => {
    const routerState = createMockRouterState();
    const onFetchRouteData = sinon.stub();

    mount(
      <FetchRootComponent
        onFetchRouteData={onFetchRouteData}
        routerProps={routerState}
        readyState={ReadyState.PENDING}>
        <Child />
      </FetchRootComponent>,
    );

    expect(onFetchRouteData).to.have.been.calledOnce;
  });

  it('should call onFetchRouteData when forced on mount', () => {
    const routerState = createMockRouterState();
    const onFetchRouteData = sinon.stub();

    mount(
      <FetchRootComponent
        onFetchRouteData={onFetchRouteData}
        routerProps={routerState}
        readyState={ReadyState.SUCCESS}
        forceInitialFetch>
        <Child />
      </FetchRootComponent>,
    );

    expect(onFetchRouteData).to.have.been.calledOnce;
  });

  it('should provide router state to onFetchRouteData when called on mount', () => {
    const routerState = createMockRouterState();
    const onFetchRouteData = sinon.stub();

    mount(
      <FetchRootComponent
        onFetchRouteData={onFetchRouteData}
        readyState={ReadyState.PENDING}
        routerProps={routerState}>
        <Child />
      </FetchRootComponent>,
    );

    expect(onFetchRouteData).to.have.been.calledOnce;
    expect(onFetchRouteData).to.have.been.calledWithExactly(routerState);
  });

  it('should call onFetchRouteData when updated with a different location', () => {
    const prevRouterState = createMockRouterState({
      location: {
        pathname: '/search/cats',
      },
    });

    const nextRouterState = createMockRouterState({
      location: {
        pathname: '/search/dogs',
      },
    });

    const onFetchRouteData = sinon.stub();
    const wrapper = mount(
      <FetchRootComponent
        onFetchRouteData={onFetchRouteData}
        readyState={ReadyState.SUCCESS}
        routerProps={prevRouterState}>
        <Child />
      </FetchRootComponent>,
    );

    wrapper.setProps({ routerProps: nextRouterState });

    expect(onFetchRouteData).to.have.been.calledOnce;
    expect(onFetchRouteData).to.have.been.calledWithExactly(nextRouterState);
  });

  it('should set FetchReadyStateRenderer to pending when location pathnames differ', () => {
    const prevRouterState = createMockRouterState({
      location: {
        pathname: '/search/cats',
      },
    });

    const nextRouterState = createMockRouterState({
      location: {
        pathname: '/search/dogs',
      },
    });

    const onFetchRouteData = sinon.stub();

    const wrapper = mount(
      <FetchRootComponent
        onFetchRouteData={onFetchRouteData}
        readyState={ReadyState.SUCCESS}
        routerProps={prevRouterState}>
        <Child />
      </FetchRootComponent>,
    );

    wrapper.setProps({ routerProps: nextRouterState });

    const child = wrapper.find('FetchReadyStateRenderer');

    expect(child.prop('readyState')).to.equal(ReadyState.PENDING);
  });

  it('should set FetchReadyStateRenderer to pending when location search strings differ', () => {
    const prevRouterState = createMockRouterState({
      location: {
        pathname: '/search/cats',
        search: '?pageNumber=1',
      },
    });

    const nextRouterState = createMockRouterState({
      location: {
        pathname: '/search/cats',
        search: '?pageNumber=2',
      },
    });

    const onFetchRouteData = sinon.stub();

    const wrapper = mount(
      <FetchRootComponent
        onFetchRouteData={onFetchRouteData}
        readyState={ReadyState.SUCCESS}
        routerProps={prevRouterState}>
        <Child />
      </FetchRootComponent>,
    );

    wrapper.setProps({ routerProps: nextRouterState });

    const child = wrapper.find('FetchReadyStateRenderer');

    expect(child.prop('readyState')).to.equal(ReadyState.PENDING);
  });

  it('should set FetchReadyStateRenderer to pending when location keys differ', () => {
    const prevRouterState = createMockRouterState({
      location: {
        pathname: '/search/cats',
        search: '?pageNumber=1',
        key: 'abc',
      },
    });

    const nextRouterState = createMockRouterState({
      location: {
        pathname: '/search/cats',
        search: '?pageNumber=1',
        key: 'cba',
      },
    });

    const onFetchRouteData = sinon.stub();

    const wrapper = mount(
      <FetchRootComponent
        onFetchRouteData={onFetchRouteData}
        readyState={ReadyState.SUCCESS}
        routerProps={prevRouterState}>
        <Child />
      </FetchRootComponent>,
    );

    wrapper.setProps({ routerProps: nextRouterState });

    const child = wrapper.find('FetchReadyStateRenderer');

    expect(child.prop('readyState')).to.equal(ReadyState.PENDING);
  });

  it('should not swallow render errors', () => {
    const error = new Error('Bad render');
    const render = () => mount(
      <FetchRootComponent readyState={ReadyState.SUCCESS}>
        {(() => { throw error; })()}
      </FetchRootComponent>,
    );

    expect(render).to.throw(error);
  });
});
