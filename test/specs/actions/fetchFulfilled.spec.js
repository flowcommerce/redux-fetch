import { fetchFulfilled } from '../../../src/actions';
import ActionType from '../../../src/constants/ActionType';

describe('fetchFulfilled', () => {
  it('should create FULFILLED action object when invoked', () => {
    const pathname = '/search/people';
    expect(fetchFulfilled(pathname)).to.deep.equal({
      type: ActionType.FULFILLED,
      payload: { pathname },
    });
  });
});
