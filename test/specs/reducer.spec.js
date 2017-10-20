import deepFreeze from 'deep-freeze';
import { fetchCanceled, fetchFulfilled, fetchLoading, fetchRejected } from '../../src/actions';
import ReadyState from '../../src/constants/ReadyState';
import reducer from '../../src/reducer';

describe('reducer', () => {
  it('should return initial state', () => {
    const action = deepFreeze({ type: '@@redux/INIT' });
    const prevState = undefined;
    const nextState = reducer(prevState, action);
    expect(nextState).to.have.property('readyState', ReadyState.PENDING);
  });

  it('should update state accordingly when LOADING action is dispatched', () => {
    const pathname = '/search/people';
    const action = deepFreeze(fetchLoading(pathname));
    const prevState = deepFreeze({ readyState: ReadyState.PENDING });
    const nextState = reducer(prevState, action);
    expect(nextState).to.deep.equal({
      pathname,
      readyState: ReadyState.LOADING,
    });
  });

  it('should update state accordingly when FULFILLED action is dispatched', () => {
    const pathname = '/search/people';
    const action = deepFreeze(fetchFulfilled(pathname));
    const prevState = deepFreeze({ readyState: ReadyState.PENDING });
    const nextState = reducer(prevState, action);
    expect(nextState).to.deep.equal({
      pathname,
      readyState: ReadyState.FULFILLED,
    });
  });

  it('should update state accordingly when REJECTED action is dispatched', () => {
    const pathname = '/search/people';
    const error = { message: 'Invalid data provided' };
    const action = deepFreeze(fetchRejected(pathname, error));
    const prevState = deepFreeze({ readyState: ReadyState.PENDING });
    const nextState = reducer(prevState, action);
    expect(nextState).to.deep.equal({
      error,
      pathname,
      readyState: ReadyState.REJECTED,
    });
  });

  it('should update state accordingly when CANCELED action is dispatched', () => {
    const pathname = '/search/people';
    const action = deepFreeze(fetchCanceled(pathname));
    const prevState = deepFreeze({ readyState: ReadyState.PENDING });
    const nextState = reducer(prevState, action);
    expect(nextState).to.deep.equal({
      pathname,
      readyState: ReadyState.CANCELED,
    });
  });
});
