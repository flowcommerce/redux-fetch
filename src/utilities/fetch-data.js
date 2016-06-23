export default function fetchData({ dispatch, getState }, getInitialAsyncState) {
  return getInitialAsyncState(dispatch, getState());
}
