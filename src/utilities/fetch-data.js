export default function fetchData({ dispatch, getState }, getAsyncState, params) {
  return getAsyncState(dispatch, getState(), params);
}
