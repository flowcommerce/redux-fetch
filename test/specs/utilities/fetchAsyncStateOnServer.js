import { Component } from 'react';
import createMockStore from '../../utilities/createMockStore';
import fetchAsyncStateOnServer from '../../../src/utilities/fetchAsyncStateOnServer';

function createComponent(getAsyncState) {
  return class WrappedComponent extends Component {
    static getAsyncState = getAsyncState;
    render() {
      return null;
    }
  };
}

describe('fetchAsyncStateOnServer(store, components, params)', () => {
  it('should execute all `getAsyncState` from wrapped components', () => {
    const params = { foo: 'bar' };
    const initialState = { hello: 'goodbye' };
    const getAsyncState = sinon.stub().returns(Promise.resolve());
    const store = createMockStore(initialState);
    const { dispatch, getState } = store;
    const components = [createComponent(), createComponent(getAsyncState)];
    fetchAsyncStateOnServer(store, components, params);
    expect(getAsyncState).to.have.been.calledOnce;
    expect(getAsyncState).to.have.been.calledWithExactly(dispatch, getState(), params);
  });

  it('should not throw error when a route component is undefined', () => {
    const initialState = { hello: 'goodbye' };
    const getAsyncState = sinon.stub().returns(Promise.resolve());
    const store = createMockStore(initialState);
    const components = [undefined, createComponent(getAsyncState)];
    fetchAsyncStateOnServer(store, components);
  });
});
