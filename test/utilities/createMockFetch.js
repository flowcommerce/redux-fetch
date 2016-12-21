const defaults = {
  error: null,
  fetching: false,
  firstRender: true,
  renderLoading: undefined,
  renderFailure: undefined,
  retry: sinon.stub(),
};

export default function createMockFetch(context = {}) {
  return Object.assign({}, defaults, context);
}
