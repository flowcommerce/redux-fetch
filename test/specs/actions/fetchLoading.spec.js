import { fetchLoading } from '../../../src/actions';
import ActionType from '../../../src/constants/ActionType';

describe('fetchLoading', () => {
  it('should create LOADING action object when invoked', () => {
    const pathname = '/path/to/route';
    expect(fetchLoading(pathname)).to.deep.equal({
      type: ActionType.LOADING,
      payload: { pathname },
    });
  });
});
