import { combineReducers } from 'redux';
import { fetchFulfilled, fetchLoading, fetchRejected } from '../../../src/actions';
import { getError } from '../../../src/selectors';
import getIn from '../../../src/utilities/getIn';
import reducer from '../../../src/reducer';

const initialize = () => ({ type: '@@redux/INIT' });

describe('getError', () => {
  it('should return a function', () => {
    expect(getError()).to.be.a('function');
  });

  it('should return error stored in application state', () => {
    const error = { message: 'Invalid data provided' };
    const pathname = '/search/people';
    const actions = [
      initialize(),
      fetchLoading(pathname),
      fetchRejected(pathname, error),
    ];
    const rootReducer = combineReducers({ fetch: reducer });
    const state = actions.reduce(rootReducer, undefined);
    expect(getError()(state)).to.deep.equal(error);
  });

  it('should return undefined when error is not present in application state', () => {
    const pathname = '/search/people';
    const actions = [
      initialize(),
      fetchLoading(pathname),
      fetchFulfilled(pathname),
    ];
    const rootReducer = combineReducers({ fetch: reducer });
    const state = actions.reduce(rootReducer, undefined);
    expect(getError()(state)).to.equal(undefined);
  });

  it('should use getFetchState when provided', () => {
    const error = { message: 'Invalid data provided' };
    const pathname = '/search/people';
    const actions = [
      initialize(),
      fetchLoading(pathname),
      fetchRejected(pathname, error),
    ];
    const rootReducer = combineReducers({ fetching: reducer });
    const getFetchState = state => getIn(state, 'fetching');
    const state = actions.reduce(rootReducer, undefined);
    expect(getError(getFetchState)(state)).to.deep.equal(error);
  });
});
