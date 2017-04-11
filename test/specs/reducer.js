import deepFreeze from 'deep-freeze';
import ActionTypes from '../../src/ActionTypes';
import ReadyState from '../../src/ReadyState';
import reducer from '../../src/reducer';

describe('reducer', () => {
  context('when previous state is undefined', () => {
    it('should set pending fetch status', () => {
      const action = deepFreeze({ type: '@@INIT' });
      const prevState = undefined;
      const nextState = reducer(prevState, action);
      expect(nextState).to.have.property('status', ReadyState.PENDING);
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
    it('should set "LOADING" fetch status', () => {
      const action = deepFreeze({ type: ActionTypes.FETCH_REQUEST });
      const prevState = deepFreeze({ status: ReadyState.PENDING });
      const nextState = reducer(prevState, action);
      expect(nextState).to.have.property('status', ReadyState.LOADING);
    });
  });

  context('when FETCH_SUCCESS action is dispatched', () => {
    it('should set "SUCCESS" fetch status', () => {
      const action = deepFreeze({ type: ActionTypes.FETCH_SUCCESS });
      const prevState = deepFreeze({ status: ReadyState.LOADING });
      const nextState = reducer(prevState, action);
      expect(nextState).to.have.property('status', ReadyState.SUCCESS);
    });
  });

  context('when FETCH_FAILURE action is dispatched', () => {
    it('should set "FAILURE" fetch status', () => {
      const action = deepFreeze({ type: ActionTypes.FETCH_FAILURE });
      const prevState = deepFreeze({ status: ReadyState.LOADING });
      const nextState = reducer(prevState, action);
      expect(nextState).to.have.property('status', ReadyState.FAILURE);
    });
  });
});
