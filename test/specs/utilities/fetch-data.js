import createMockStore from '../../utilities/create-mock-store';
import fetchData from '../../../src/utilities/fetch-data';

describe('fetchData(store, getInitialAsyncState)', () => {
  it('should call `getInitialAsyncState` with store\'s dispatch, state and params', () => {
    const params = { foo: 'bar' };
    const store = createMockStore({ testing: true });
    const { dispatch, getState } = store;
    const getInitialAsyncState = sinon.stub();
    fetchData(store, getInitialAsyncState, params);
    expect(getInitialAsyncState).to.have.been.calledOnce;
    expect(getInitialAsyncState).to.have.been.calledWithExactly(dispatch, getState(), params);
  });
});
