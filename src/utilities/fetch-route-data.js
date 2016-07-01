import fetchData from './fetch-data';

export default function fetchRouteData(store, components, params) {
  const promises = components
    .filter(({ getInitialAsyncState }) => getInitialAsyncState)
    .map(({ getInitialAsyncState }) => fetchData(store, getInitialAsyncState, params));

  return Promise.all(promises);
}
