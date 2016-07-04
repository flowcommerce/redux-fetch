import fetchData from './fetch-data';

export default function fetchRouteData(store, components, params) {
  const promises = components
    .filter(({ getAsyncState }) => getAsyncState)
    .map(({ getAsyncState }) => fetchData(store, getAsyncState, params));

  return Promise.all(promises);
}
