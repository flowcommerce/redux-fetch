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
      const fetchAsyncState = sinon.stub().returns(Promise.resolve());
      const components = [createMockComponent(), createMockComponent(fetchAsyncState)];
      const routerState = createMockRouterState({ components });
      const { dispatch } = createMockStore();
      return expect(dispatch(fetchRouteData(routerState))).to.be.fulfilled.then(() => {
        expect(fetchAsyncState).to.have.been.calledOnce;
      });
    });

    it('should call `fetchAsyncState` of named route components', () => {
      const fetchAsyncState = sinon.stub().returns(Promise.resolve());
      const components = [{
        sidebar: createMockComponent(),
        dashboard: createMockComponent(fetchAsyncState),
      }];
      const routerState = createMockRouterState({ components });
      const { dispatch } = createMockStore();
      return expect(dispatch(fetchRouteData(routerState))).to.be.fulfilled.then(() => {
        expect(fetchAsyncState).to.have.been.calledOnce;
      });
    });

    it('should not throw error when a route component is undefined', () => {
      const fetchAsyncState = sinon.stub().returns(Promise.resolve());
      const components = [undefined, createMockComponent(fetchAsyncState)];
      const routerState = createMockRouterState({ components });
      const { dispatch } = createMockStore();
      return expect(dispatch(fetchRouteData(routerState))).to.be.fulfilled;
    });
  });
});
