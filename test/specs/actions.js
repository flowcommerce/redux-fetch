import React from 'react';
import { fetchRouteData, fetchRouteDataFailure, fetchRouteDataRequest, fetchRouteDataSuccess } from '../../src/actions';
import ActionTypes from '../../src/ActionTypes';
import createMockStore from '../utilities/createMockStore';
import createMockRouterState from '../utilities/createMockRouterState';
import uniqueId from '../../src/uniqueId';

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
      const { location } = createMockRouterState();
      const fetchId = uniqueId();
      const payload = { fetchId, location };
      expect(fetchRouteDataRequest(payload)).to.deep.equal({
        payload,
        type: ActionTypes.FETCH_REQUEST,
      });
    });
  });

  context('when fetchRouteDataFailure is called', () => {
    it('should return a FETCH_FAILURE action object with payload', () => {
      const { location } = createMockRouterState();
      const fetchId = uniqueId();
      const payload = { fetchId, location };
      expect(fetchRouteDataFailure(payload)).to.deep.equal({
        payload,
        type: ActionTypes.FETCH_FAILURE,
      });
    });
  });

  context('when fetchRouteDataSuccess is called', () => {
    it('should return a FETCH_SUCCESS action object with payload', () => {
      const { location } = createMockRouterState();
      const fetchId = uniqueId();
      const payload = { fetchId, location };
      expect(fetchRouteDataSuccess(payload)).to.deep.equal({
        payload,
        type: ActionTypes.FETCH_SUCCESS,
      });
    });
  });

  describe('fetchRouteData', () => {
    it('should dispatch FETCH_SUCCESS action when promise is fulfilled', () => {
      const fetchAsyncState = sinon.stub().returns(Promise.resolve());
      const components = [createMockComponent(fetchAsyncState)];
      const routerState = createMockRouterState({ components });
      const { dispatch, getActions } = createMockStore();

      return expect(dispatch(fetchRouteData(routerState))).to.be.fulfilled.then(() => {
        const [requestAction, successAction] = getActions();

        expect(requestAction).to.have.property('type').that.equal(ActionTypes.FETCH_REQUEST);
        expect(requestAction).to.have.deep.property('payload.location').that.equal(routerState.location);
        expect(requestAction).to.have.deep.property('payload.fetchId').that.is.a.string;

        expect(successAction).to.have.property('type').that.equal(ActionTypes.FETCH_SUCCESS);
        expect(successAction).to.have.deep.property('payload.location').that.equal(routerState.location);
        expect(successAction).to.have.deep.property('payload.fetchId').that.is.a.string;
      });
    });

    it('should dispatch FETCH_FAILURE action when promise is fulfilled', () => {
      const fetchAsyncState = sinon.stub().returns(Promise.reject());
      const components = [createMockComponent(fetchAsyncState)];
      const routerState = createMockRouterState({ components });
      const { dispatch, getActions } = createMockStore();

      return expect(dispatch(fetchRouteData(routerState))).to.be.fulfilled.then(() => {
        const [requestAction, failureAction] = getActions();

        expect(requestAction).to.have.property('type').that.equal(ActionTypes.FETCH_REQUEST);
        expect(requestAction).to.have.deep.property('payload.location').that.equal(routerState.location);
        expect(requestAction).to.have.deep.property('payload.fetchId').that.is.a.string;

        expect(failureAction).to.have.property('type').that.equal(ActionTypes.FETCH_FAILURE);
        expect(failureAction).to.have.deep.property('payload.location').that.equal(routerState.location);
        expect(failureAction).to.have.deep.property('payload.fetchId').that.is.a.string;
      });
    });

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
