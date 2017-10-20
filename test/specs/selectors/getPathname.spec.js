import { combineReducers } from 'redux';
import { fetchFulfilled, fetchLoading } from '../../../src/actions';
import { getPathname } from '../../../src/selectors';
import getIn from '../../../src/utilities/getIn';
import reducer from '../../../src/reducer';

const initialize = () => ({ type: '@@redux/INIT' });

describe('getPathname', () => {
  it('should return a function', () => {
    expect(getPathname()).to.be.a('function');
  });

  it('should return pathname stored in application state', () => {
    const pathname = '/search/people';
    const actions = [
      initialize(),
      fetchLoading(pathname),
    ];
    const rootReducer = combineReducers({ fetch: reducer });
    const state = actions.reduce(rootReducer, undefined);
    expect(getPathname()(state)).to.deep.equal(pathname);
  });

  it('should return undefined when pathname is not present in application state', () => {
    const actions = [
      initialize(),
    ];
    const rootReducer = combineReducers({ fetch: reducer });
    const state = actions.reduce(rootReducer, undefined);
    expect(getPathname()(state)).to.equal(undefined);
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
    expect(getPathname(getFetchState)(state)).to.deep.equal(pathname);
  });
});
