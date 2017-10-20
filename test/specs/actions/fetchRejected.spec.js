import { fetchRejected } from '../../../src/actions';
import ActionType from '../../../src/constants/ActionType';

describe('fetchRejected', () => {
  it('should create REJECTED action object when invoked', () => {
    const pathname = '/search/people';
    const error = { message: 'Something went wrong' };
    expect(fetchRejected(pathname, error)).to.deep.equal({
      type: ActionType.REJECTED,
      payload: { pathname, error },
    });
  });
});
