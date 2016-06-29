import fetchData from './fetch-data';

export default function fetchRouteData(store, components) {
  const promises = components
    .filter(({ getInitialAsyncState }) => getInitialAsyncState)
    .map(({ getInitialAsyncState }) => fetchData(store, getInitialAsyncState));

  return Promise.all(promises);
}
