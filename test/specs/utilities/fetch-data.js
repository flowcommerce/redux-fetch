import createMockStore from '../../utilities/create-mock-store';
import fetchData from '../../../src/utilities/fetch-data';

describe('fetchData(store, getAsyncState)', () => {
  it('should call `getAsyncState` with store\'s dispatch, state and params', () => {
    const params = { foo: 'bar' };
    const store = createMockStore({ testing: true });
    const { dispatch, getState } = store;
    const getAsyncState = sinon.stub();
    fetchData(store, getAsyncState, params);
    expect(getAsyncState).to.have.been.calledOnce;
    expect(getAsyncState).to.have.been.calledWithExactly(dispatch, getState(), params);
  });
});
