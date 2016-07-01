export default function fetchData({ dispatch, getState }, getInitialAsyncState, params) {
  return getInitialAsyncState(dispatch, getState(), params);
}
