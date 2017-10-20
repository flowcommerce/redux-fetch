import { fetchCanceled } from '../../../src/actions';
import ActionType from '../../../src/constants/ActionType';

describe('fetchCanceled', () => {
  it('should return a CANCELED action object when invoked', () => {
    const pathname = '/search/people';
    expect(fetchCanceled(pathname)).to.deep.equal({
      type: ActionType.CANCELED,
      payload: { pathname },
    });
  });
});
