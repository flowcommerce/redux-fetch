import { ActionTypes } from '../../src/constants';
import reducer from '../../src/reducers';

describe('fetchReducer()', () => {
  it('should return its initial state', () => {
    expect(reducer()).to.deep.equal({ shouldFetch: true });
  });

  it('should handle @@fetch/INVALIDATE action', () => {
    const prevState = { shouldFetch: false };
    const nextState = { shouldFetch: true };
    const action = { type: ActionTypes.FETCH_INVALIDATE };
    expect(reducer(prevState, action)).to.deep.equal(nextState);
  });

  it('should handle @@fetch/VALIDATE action', () => {
    const prevState = { shouldFetch: true };
    const nextState = { shouldFetch: false };
    const action = { type: ActionTypes.FETCH_VALIDATE };
    expect(reducer(prevState, action)).to.deep.equal(nextState);
  });
});
