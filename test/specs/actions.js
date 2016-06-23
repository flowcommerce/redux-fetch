import { ActionTypes } from '../../src/constants';
import { validate, invalidate } from '../../src/actions';

describe('action creators', () => {
  context('when validate() is called', () => {
    it('should create an action to confirm dehydration of server state', () => {
      expect(validate()).to.deep.equal({ type: ActionTypes.FETCH_VALIDATE });
    });
  });

  context('when invalidate() is called', () => {
    it('should crean an action to confirm hydration of server state', () => {
      expect(invalidate()).to.deep.equal({ type: ActionTypes.FETCH_INVALIDATE });
    });
  });
});
