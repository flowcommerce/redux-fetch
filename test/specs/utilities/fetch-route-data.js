import * as actions from '../../../src/actions';
import { Component } from 'react';
import fetchRouteData from '../../../src/utilities/fetch-route-data';

function createStore(initialState) {
  return {
    dispatch: sinon.stub(),
    getState: sinon.stub().returns(initialState),
  };
}

function createComponent(getInitialAsyncState) {
  return class WrappedComponent extends Component {
    static getInitialAsyncState = getInitialAsyncState;
    render() {
      return null;
    }
  };
}

describe('fetchRouteData(store, components)', () => {
  let getInitialAsyncState;
  let initialState;
  let store;

  before(() => {
    sinon.stub(actions, 'validate');
  });

  after(() => {
    actions.validate.restore();
  });

  beforeEach(() => {
    initialState = { hello: 'goodbye' };
    getInitialAsyncState = sinon.stub().returns(Promise.resolve());
    store = createStore(initialState);
    const components = [createComponent(), createComponent(getInitialAsyncState)];
    fetchRouteData(store, components);
  });

  it('should execute all `getInitialAsyncState` from wrapped components', () => {
    expect(getInitialAsyncState).to.have.been.calledOnce;
    expect(getInitialAsyncState).to.have.been.calledWithExactly(store.dispatch, initialState);
  });

  it('should dispatch a validate() action after resolving all promises', () => {
    expect(actions.validate).to.have.been.calledOnce;
  });
});
