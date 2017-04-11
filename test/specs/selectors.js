import { combineReducers } from 'redux';
import { fetchRouteDataFailure, fetchRouteDataRequest, fetchRouteDataSuccess } from '../../src/actions';
import { getLocation, getReadyState, getIsSameLocation } from '../../src/selectors';
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

  context('when getIsSameLocation is called', () => {
    it('should return a function', () => {
      const props = createMockRouterState();
      expect(getIsSameLocation(props)).to.be.a.function;
    });

    it('should return true when locations are equal', () => {
      const { location: prevLocation } = createMockRouterState();
      const nextLocation = prevLocation;
      const reducer = combineReducers({ fetch: fetchReducer });
      const actions = [
        initialize(),
        fetchRouteDataRequest(prevLocation),
        fetchRouteDataSuccess(prevLocation),
      ];
      const state = actions.reduce(reducer, undefined);
      const isSameLocation = getIsSameLocation(nextLocation);
      expect(isSameLocation(state)).to.equal(true);
    });

    it('should return false when locations contain different pathname', () => {
      const { location: prevLocation } = createMockRouterState({ location: { pathname: '/search/cats' } });
      const { location: nextLocation } = createMockRouterState({ location: { pathname: '/search/dogs' } });
      const reducer = combineReducers({ fetch: fetchReducer });
      const actions = [
        initialize(),
        fetchRouteDataRequest(prevLocation),
        fetchRouteDataSuccess(prevLocation),
      ];
      const state = actions.reduce(reducer, undefined);
      const isSameLocation = getIsSameLocation(nextLocation);
      expect(isSameLocation(state)).to.equal(false);
    });

    it('should return false when locations contain different search strings', () => {
      const { location: prevLocation } = createMockRouterState({ location: { search: '?color=purple' } });
      const { location: nextLocation } = createMockRouterState({ location: { search: '?color=yellow' } });
      const reducer = combineReducers({ fetch: fetchReducer });
      const actions = [
        initialize(),
        fetchRouteDataRequest(prevLocation),
        fetchRouteDataSuccess(prevLocation),
      ];
      const state = actions.reduce(reducer, undefined);
      const isSameLocation = getIsSameLocation(nextLocation);
      expect(isSameLocation(state)).to.equal(false);
    });
  });
});
