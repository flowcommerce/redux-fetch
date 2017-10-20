import { combineReducers } from 'redux';
import { fetchFulfilled, fetchLoading } from '../../../src/actions';
import { getReadyState } from '../../../src/selectors';
import ReadyState from '../../../src/constants/ReadyState';
import getIn from '../../../src/utilities/getIn';
import reducer from '../../../src/reducer';

const initialize = () => ({ type: '@@redux/INIT' });

describe('getReadyState', () => {
  it('should return a function', () => {
    expect(getReadyState()).to.be.a('function');
  });

  it('should return ready state stored in application state', () => {
    const pathname = '/search/people';
    const actions = [
      initialize(),
      fetchLoading(pathname),
    ];
    const rootReducer = combineReducers({ fetch: reducer });
    const state = actions.reduce(rootReducer, undefined);
    expect(getReadyState()(state)).to.deep.equal(ReadyState.LOADING);
  });

  it('should return undefined when ready state is not present in application state', () => {
    const actions = [
      initialize(),
    ];
    const rootReducer = combineReducers({ fetching: reducer });
    const state = actions.reduce(rootReducer, undefined);
    expect(getReadyState()(state)).to.equal(undefined);
  });

  it('should use getFetchState when provided', () => {
    const pathname = '/search/people';
    const actions = [
      initialize(),
      fetchLoading(pathname),
      fetchFulfilled(pathname),
    ];
    const rootReducer = combineReducers({ fetching: reducer });
    const getFetchState = state => getIn(state, 'fetching');
    const state = actions.reduce(rootReducer, undefined);
    expect(getReadyState(getFetchState)(state)).to.deep.equal(ReadyState.FULFILLED);
  });
});
