import { Component } from 'react';
import createMockStore from '../../utilities/create-mock-store';
import fetchRouteData from '../../../src/utilities/fetch-route-data';

function createComponent(getInitialAsyncState) {
  return class WrappedComponent extends Component {
    static getInitialAsyncState = getInitialAsyncState;
    render() {
      return null;
    }
  };
}

describe('fetchRouteData(store, components, params)', () => {
  it('should execute all `getInitialAsyncState` from wrapped components', () => {
    const params = { foo: 'bar' };
    const initialState = { hello: 'goodbye' };
    const getInitialAsyncState = sinon.stub().returns(Promise.resolve());
    const store = createMockStore(initialState);
    const { dispatch, getState } = store;
    const components = [createComponent(), createComponent(getInitialAsyncState)];
    fetchRouteData(store, components, params);
    expect(getInitialAsyncState).to.have.been.calledOnce;
    expect(getInitialAsyncState).to.have.been.calledWithExactly(dispatch, getState(), params);
  });
});
