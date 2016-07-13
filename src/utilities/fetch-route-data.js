export default function fetchRouteData({ dispatch, getState }, components, params) {
  return Promise.all(components
    .filter(({ getAsyncState }) => getAsyncState)
    .map(({ getAsyncState }) => getAsyncState(dispatch, getState(), params)));
}
