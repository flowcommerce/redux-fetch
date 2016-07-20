export default function createMockStore(initialState = {}) {
  return {
    dispatch: sinon.stub(),
    getState: sinon.stub().returns(initialState),
    subscribe: sinon.stub(),
  };
}
