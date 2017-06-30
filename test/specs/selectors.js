import { combineReducers } from 'redux';
import { fetchFailure, fetchRequest, fetchSuccess } from '../../src/actions';
import { getLocation, getReadyState } from '../../src/selectors';
import ReadyState from '../../src/ReadyState';
import createMockRouterState from '../utilities/createMockRouterState';
import fetchReducer from '../../src/reducer';
import uniqueId from '../../src/uniqueId';

const initialize = () => ({ type: '@@INIT' });

describe('selectors', () => {
  context('when getLocation is called', () => {
    it('should return current location', () => {
      const fetchId = uniqueId();
      const { location } = createMockRouterState();
      const reducer = combineReducers({ fetch: fetchReducer });
      const actions = [
        initialize(),
        fetchRequest(fetchId, location),
      ];
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
      const fetchId = uniqueId();
      const { location } = createMockRouterState();
      const reducer = combineReducers({ fetch: fetchReducer });
      const actions = [
        initialize(),
        fetchRequest(fetchId, location),
      ];
      const state = actions.reduce(reducer, undefined);
      expect(getReadyState(state)).to.equal(ReadyState.LOADING);
    });

    it('should return "FAILURE" status', () => {
      const error = { message: 'Oops' };
      const fetchId = uniqueId();
      const { location } = createMockRouterState();
      const reducer = combineReducers({ fetch: fetchReducer });
      const actions = [
        initialize(),
        fetchRequest(fetchId, location),
        fetchFailure(error, fetchId, location),
      ];
      const state = actions.reduce(reducer, undefined);
      expect(getReadyState(state)).to.equal(ReadyState.FAILURE);
    });

    it('should return "SUCCESS" status', () => {
      const fetchId = uniqueId();
      const { location } = createMockRouterState();
      const reducer = combineReducers({ fetch: fetchReducer });
      const actions = [
        initialize(),
        fetchRequest(fetchId, location),
        fetchSuccess(fetchId, location),
      ];
      const state = actions.reduce(reducer, undefined);
      expect(getReadyState(state)).to.equal(ReadyState.SUCCESS);
    });
  });
});
