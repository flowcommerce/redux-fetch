import React from 'react';
import { fetchRouteData, fetchRouteDataFailure, fetchRouteDataRequest, fetchRouteDataSuccess } from '../../src/actions';
import ActionTypes from '../../src/ActionTypes';
import createMockStore from '../utilities/createMockStore';
import createMockRouterState from '../utilities/createMockRouterState';

function createMockComponent(fetchAsyncState) {
  return class WrappedComponent extends React.Component {
    static fetchAsyncState = fetchAsyncState;
    render() {
      return null;
    }
  };
}

describe('action creators', () => {
  context('when fetchRouteDataRequest is called', () => {
    it('should return a FETCH_REQUEST action object with payload', () => {
      const routerProps = createMockRouterState();
      expect(fetchRouteDataRequest(routerProps)).to.deep.equal({
        payload: routerProps,
        type: ActionTypes.FETCH_REQUEST,
      });
    });
  });

  context('when fetchRouteDataFailure is called', () => {
    it('should return a FETCH_FAILURE action object with payload', () => {
      const routerProps = createMockRouterState();
      expect(fetchRouteDataFailure(routerProps)).to.deep.equal({
        payload: routerProps,
        type: ActionTypes.FETCH_FAILURE,
      });
    });
  });

  context('when fetchRouteDataSuccess is called', () => {
    it('should return a FETCH_SUCCESS action object with payload', () => {
      const routerProps = createMockRouterState();
      expect(fetchRouteDataSuccess(routerProps)).to.deep.equal({
        payload: routerProps,
        type: ActionTypes.FETCH_SUCCESS,
      });
    });
  });

  describe('fetchRouteData', () => {
    it('should call `fetchAsyncState` of route components', () => {
      const fetchAsyncState = sinon.stub();
      const components = [createMockComponent(), createMockComponent(fetchAsyncState)];
      const routerProps = createMockRouterState({ components });
      const store = createMockStore();
      const { dispatch, getState } = store;
      fetchRouteData(store, routerProps);
      expect(fetchAsyncState).to.have.been.calledOnce;
      expect(fetchAsyncState).to.have.been.calledWithExactly(dispatch, getState, routerProps);
    });

    it('should call `fetchAsyncState` of named route components', () => {
      const fetchAsyncState = sinon.stub();
      const components = [{
        sidebar: createMockComponent(),
        dashboard: createMockComponent(fetchAsyncState),
      }];
      const routerProps = createMockRouterState({ components });
      const store = createMockStore();
      const { dispatch, getState } = store;
      fetchRouteData(store, routerProps);
      expect(fetchAsyncState).to.have.been.calledOnce;
      expect(fetchAsyncState).to.have.been.calledWithExactly(dispatch, getState, routerProps);
    });

    it('should not throw error when a route component is undefined', () => {
      const fetchAsyncState = sinon.stub();
      const store = createMockStore();
      const components = [undefined, createMockComponent(fetchAsyncState)];
      const routerProps = createMockRouterState({ components });
      fetchRouteData(store, routerProps);
    });
  });
});
