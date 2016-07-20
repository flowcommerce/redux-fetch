const defaults = {
  error: null,
  fetching: false,
  firstRender: true,
  renderLoading: undefined,
  renderFailure: undefined,
  renderFetched: undefined,
};

export default function createMockFetch(context = {}) {
  return Object.assign({}, defaults, context);
}
