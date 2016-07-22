import { Component } from 'react';
import createMockStore from '../../utilities/createMockStore';
import createMockRouterState from '../../utilities/createMockRouterState';
import fetchAsyncState from '../../../src/utilities/fetchAsyncState';

function createComponent(getAsyncState) {
  return class WrappedComponent extends Component {
    static getAsyncState = getAsyncState;
    render() {
      return null;
    }
  };
}

describe('fetchAsyncState(store, components, params)', () => {
  it('should execute all `getAsyncState` from wrapped components', () => {
    const getAsyncState = sinon.stub();
    const components = [createComponent(), createComponent(getAsyncState)];
    const routerProps = createMockRouterState({ components });
    const initialState = { hello: 'goodbye' };
    const store = createMockStore(initialState);
    const { dispatch, getState } = store;
    fetchAsyncState(store, routerProps);
    expect(getAsyncState).to.have.been.calledOnce;
    expect(getAsyncState).to.have.been.calledWithExactly(dispatch, getState, routerProps);
  });

  it('should not throw error when a route component is undefined', () => {
    const initialState = { hello: 'goodbye' };
    const getAsyncState = sinon.stub();
    const store = createMockStore(initialState);
    const components = [undefined, createComponent(getAsyncState)];
    const routerProps = createMockRouterState({ components });
    fetchAsyncState(store, routerProps);
  });
});
