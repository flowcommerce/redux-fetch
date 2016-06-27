import { Component } from 'react';
import createMockStore from '../../utilities/create-mock-store';
import * as actions from '../../../src/actions';
import fetchRouteData from '../../../src/utilities/fetch-route-data';

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
    store = createMockStore(initialState);
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
