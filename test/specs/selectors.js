import { combineReducers } from 'redux';
import ReadyState from '../../src/ReadyState';
import fetchReducer from '../../src/reducer';
import { fetchFailure, fetchRequest, fetchSuccess } from '../../src/actions';
import { getFetchStatus } from '../../src/selectors';

const initialize = () => ({ type: '@@INIT' });

describe('selectors', () => {
  context('when getFetchStatus is called', () => {
    it('should return "PENDING" status', () => {
      const reducer = combineReducers({ fetching: fetchReducer });
      const nextState = reducer(undefined, initialize());
      expect(getFetchStatus(nextState)).to.equal(ReadyState.PENDING);
    });

    it('should return "LOADING" status', () => {
      const reducer = combineReducers({ fetching: fetchReducer });
      const prevState = reducer(undefined, initialize());
      const nextState = reducer(prevState, fetchRequest());
      expect(getFetchStatus(nextState)).to.equal(ReadyState.LOADING);
    });

    it('should return "FAILURE" status', () => {
      const reducer = combineReducers({ fetching: fetchReducer });
      const prevState = reducer(undefined, initialize());
      const nextState = reducer(prevState, fetchFailure());
      expect(getFetchStatus(nextState)).to.equal(ReadyState.FAILURE);
    });

    it('should return "SUCCESS" status', () => {
      const reducer = combineReducers({ fetching: fetchReducer });
      const prevState = reducer(undefined, initialize());
      const nextState = reducer(prevState, fetchSuccess());
      expect(getFetchStatus(nextState)).to.equal(ReadyState.SUCCESS);
    });
  });
});
