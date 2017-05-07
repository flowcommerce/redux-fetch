import deepFreeze from 'deep-freeze';
import ActionTypes from '../../src/ActionTypes';
import ReadyState from '../../src/ReadyState';
import reducer from '../../src/reducer';
import createMockRouterState from '../utilities/createMockRouterState';
import uniqueId from '../../src/uniqueId';

describe('reducer', () => {
  context('when previous state is undefined', () => {
    it('should set "PENDING" ready state', () => {
      const action = deepFreeze({ type: '@@INIT' });
      const prevState = undefined;
      const nextState = reducer(prevState, action);
      expect(nextState).to.have.property('readyState', ReadyState.PENDING);
    });
  });

  context('when unknown action is dispatched', () => {
    it('should return previous state', () => {
      const action = deepFreeze({ type: '@@UNKNOWN' });
      const prevState = deepFreeze({ foo: 'foo' });
      const nextState = reducer(prevState, action);
      expect(nextState).to.deep.equal(prevState);
    });
  });

  context('when FETCH_REQUEST action is dispatched', () => {
    it('should return "LOADING" state', () => {
      const fetchId = uniqueId();
      const { location } = createMockRouterState();
      const action = deepFreeze({
        type: ActionTypes.FETCH_REQUEST,
        fetchId,
        location,
      });
      const prevState = deepFreeze({
        readyState: ReadyState.PENDING,
        fetchId,
        location,
      });
      const nextState = reducer(prevState, action);
      expect(nextState).to.deep.equal({
        readyState: ReadyState.LOADING,
        fetchId,
        location,
      });
    });
  });

  context('when FETCH_SUCCESS action is dispatched', () => {
    it('should return "SUCCESS" state when fetch identifiers match', () => {
      const fetchId = uniqueId();
      const { location } = createMockRouterState();
      const action = deepFreeze({
        type: ActionTypes.FETCH_SUCCESS,
        fetchId,
        location,
      });
      const prevState = deepFreeze({
        readyState: ReadyState.LOADING,
        fetchId,
        location,
      });
      const nextState = reducer(prevState, action);
      expect(nextState).to.deep.equal({
        readyState: ReadyState.SUCCESS,
        fetchId,
        location,
      });
    });

    it('should return previous state when fetch identifiers do not match', () => {
      const prevFetchId = uniqueId();
      const nextFetchId = uniqueId();
      const { location: prevLocation } = createMockRouterState();
      const { location: nextLocation } = createMockRouterState();
      const action = deepFreeze({
        type: ActionTypes.FETCH_SUCCESS,
        fetchId: prevFetchId,
        location: prevLocation,
      });
      const prevState = deepFreeze({
        readyState: ReadyState.LOADING,
        fetchId: nextFetchId,
        location: nextLocation,
      });
      const nextState = reducer(prevState, action);
      expect(nextState).to.deep.equal(prevState);
    });
  });

  context('when FETCH_FAILURE action is dispatched', () => {
    it('should return "FAILURE" state when fetch identifiers match', () => {
      const fetchId = uniqueId();
      const error = { message: 'Oops' };
      const { location } = createMockRouterState();
      const action = deepFreeze({
        type: ActionTypes.FETCH_FAILURE,
        error,
        fetchId,
        location,
      });
      const prevState = deepFreeze({
        readyState: ReadyState.LOADING,
        fetchId,
        location,
      });
      const nextState = reducer(prevState, action);
      expect(nextState).to.deep.equal({
        readyState: ReadyState.FAILURE,
        error,
        fetchId,
        location,
      });
    });

    it('should return previous state when fetch identifiers do not match', () => {
      const prevError = { message: 'Previous error' };
      const prevFetchId = uniqueId();
      const nextError = { message: 'Next error' };
      const nextFetchId = uniqueId();
      const { location: prevLocation } = createMockRouterState();
      const { location: nextLocation } = createMockRouterState();
      const action = deepFreeze({
        type: ActionTypes.FETCH_FAILURE,
        error: nextError,
        fetchId: nextFetchId,
        location: nextLocation,
      });
      const prevState = deepFreeze({
        readyState: ReadyState.LOADING,
        error: prevError,
        fetchId: prevFetchId,
        location: prevLocation,
      });
      const nextState = reducer(prevState, action);
      expect(nextState).to.deep.equal(prevState);
    });
  });
});
