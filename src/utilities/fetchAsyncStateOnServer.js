export default function fetchAsyncStateOnServer({ dispatch, getState }, components, params) {
  return Promise.all(components
    // Assign default value to prevent errors when a component is undefined.
    .filter(({ getAsyncState } = {}) => getAsyncState)
    .map(({ getAsyncState }) => getAsyncState(dispatch, getState(), params)));
}
