import deepFreeze from 'deep-freeze';
import ActionTypes from '../../src/ActionTypes';
import ReadyState from '../../src/ReadyState';
import reducer from '../../src/reducer';
import createMockRouterState from '../utilities/createMockRouterState';

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
    it('should set "LOADING" ready state', () => {
      const action = deepFreeze({ type: ActionTypes.FETCH_REQUEST });
      const prevState = deepFreeze({ readyState: ReadyState.PENDING });
      const nextState = reducer(prevState, action);
      expect(nextState).to.have.property('readyState', ReadyState.LOADING);
    });

    it('should set location to action payload', () => {
      const { location } = createMockRouterState();
      const action = deepFreeze({ type: ActionTypes.FETCH_REQUEST, payload: location });
      const prevState = deepFreeze({ readyState: ReadyState.PENDING });
      const nextState = reducer(prevState, action);
      expect(nextState).to.have.property('location').that.deep.equal(location);
    });
  });

  context('when FETCH_SUCCESS action is dispatched', () => {
    it('should set "SUCCESS" ready state', () => {
      const action = deepFreeze({ type: ActionTypes.FETCH_SUCCESS });
      const prevState = deepFreeze({ readyState: ReadyState.LOADING });
      const nextState = reducer(prevState, action);
      expect(nextState).to.have.property('readyState', ReadyState.SUCCESS);
    });

    it('should set location to action payload', () => {
      const { location } = createMockRouterState();
      const action = deepFreeze({ type: ActionTypes.FETCH_SUCCESS, payload: location });
      const prevState = deepFreeze({ readyState: ReadyState.PENDING });
      const nextState = reducer(prevState, action);
      expect(nextState).to.have.property('location').that.deep.equal(location);
    });
  });

  context('when FETCH_FAILURE action is dispatched', () => {
    it('should set "FAILURE" ready state', () => {
      const action = deepFreeze({ type: ActionTypes.FETCH_FAILURE });
      const prevState = deepFreeze({ readyState: ReadyState.LOADING });
      const nextState = reducer(prevState, action);
      expect(nextState).to.have.property('readyState', ReadyState.FAILURE);
    });

    it('should set location to action payload', () => {
      const { location } = createMockRouterState();
      const action = deepFreeze({ type: ActionTypes.FETCH_FAILURE, payload: location });
      const prevState = deepFreeze({ readyState: ReadyState.PENDING });
      const nextState = reducer(prevState, action);
      expect(nextState).to.have.property('location').that.deep.equal(location);
    });
  });
});
