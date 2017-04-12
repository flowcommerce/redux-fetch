import { combineReducers } from 'redux';
import { fetchRouteDataFailure, fetchRouteDataRequest, fetchRouteDataSuccess } from '../../src/actions';
import { getLocation, getReadyState } from '../../src/selectors';
import ReadyState from '../../src/ReadyState';
import createMockRouterState from '../utilities/createMockRouterState';
import fetchReducer from '../../src/reducer';

const initialize = () => ({ type: '@@INIT' });

describe('selectors', () => {
  context('when getLocation is called', () => {
    it('should return current location', () => {
      const { location } = createMockRouterState();
      const reducer = combineReducers({ fetch: fetchReducer });
      const actions = [initialize(), fetchRouteDataRequest(location)];
      const state = actions.reduce(reducer, undefined);
      expect(getLocation(state)).to.deep.equal(location);
    });
  });

  context('when getReadyState is called', () => {
    it('should return "PENDING" status', () => {
      const reducer = combineReducers({ fetch: fetchReducer });
      const actions = [initialize()];
      const state = actions.reduce(reducer, undefined);
      expect(getReadyState(state)).to.equal(ReadyState.PENDING);
    });

    it('should return "LOADING" status', () => {
      const reducer = combineReducers({ fetch: fetchReducer });
      const actions = [initialize(), fetchRouteDataRequest()];
      const state = actions.reduce(reducer, undefined);
      expect(getReadyState(state)).to.equal(ReadyState.LOADING);
    });

    it('should return "FAILURE" status', () => {
      const reducer = combineReducers({ fetch: fetchReducer });
      const actions = [initialize(), fetchRouteDataRequest(), fetchRouteDataFailure()];
      const state = actions.reduce(reducer, undefined);
      expect(getReadyState(state)).to.equal(ReadyState.FAILURE);
    });

    it('should return "SUCCESS" status', () => {
      const reducer = combineReducers({ fetch: fetchReducer });
      const actions = [initialize(), fetchRouteDataRequest(), fetchRouteDataSuccess()];
      const state = actions.reduce(reducer, undefined);
      expect(getReadyState(state)).to.equal(ReadyState.SUCCESS);
    });
  });
});
