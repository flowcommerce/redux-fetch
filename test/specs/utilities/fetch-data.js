import createMockStore from '../../utilities/create-mock-store';
import fetchData from '../../../src/utilities/fetch-data';

describe('fetchData(store, getInitialAsyncState)', () => {
  it('should call `getInitialAsyncState` with store\'s dispatch and current state', () => {
    const store = createMockStore({ testing: true });
    const getInitialAsyncState = sinon.stub();
    fetchData(store, getInitialAsyncState);
    expect(getInitialAsyncState).to.have.been.calledOnce;
    expect(getInitialAsyncState).to.have.been.calledWithExactly(store.dispatch, store.getState());
  });
});
