import { Component } from 'react';
import createMockStore from '../../utilities/create-mock-store';
import fetchRouteData from '../../../src/utilities/fetch-route-data';

function createComponent(getAsyncState) {
  return class WrappedComponent extends Component {
    static getAsyncState = getAsyncState;
    render() {
      return null;
    }
  };
}

describe('fetchRouteData(store, components, params)', () => {
  it('should execute all `getAsyncState` from wrapped components', () => {
    const params = { foo: 'bar' };
    const initialState = { hello: 'goodbye' };
    const getAsyncState = sinon.stub().returns(Promise.resolve());
    const store = createMockStore(initialState);
    const { dispatch, getState } = store;
    const components = [createComponent(), createComponent(getAsyncState)];
    fetchRouteData(store, components, params);
    expect(getAsyncState).to.have.been.calledOnce;
    expect(getAsyncState).to.have.been.calledWithExactly(dispatch, getState(), params);
  });

  it('should not throw error when a route component is undefined', () => {
    const initialState = { hello: 'goodbye' };
    const getAsyncState = sinon.stub().returns(Promise.resolve());
    const store = createMockStore(initialState);
    const components = [undefined, createComponent(getAsyncState)];
    fetchRouteData(store, components);
  });
});
