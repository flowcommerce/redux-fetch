import fetchData from '../../../src/utilities/fetch-data';

describe('fetchData(store, getInitialAsyncState)', () => {
  it('should call `getInitialAsyncState` with store\'s dispatch and current state', () => {
    const state = { testing: true };
    const dispatch = sinon.stub();
    const getState = sinon.stub().returns(state);
    const getInitialAsyncState = sinon.stub();
    const store = { dispatch, getState };
    fetchData(store, getInitialAsyncState);
    expect(getInitialAsyncState).to.have.been.calledOnce;
    expect(getInitialAsyncState).to.have.been.calledWithExactly(dispatch, state);
  });
});
