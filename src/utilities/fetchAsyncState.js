/**
 * An utility that returns a promise that is resolved after all data requirements for fetch
 * containers are fulfilled or rejected otherwise.
 * @param {Object} store - An instance of the redux store used in your application.
 * @param {Object} renderProps - An object with non-router specific properties, typically injected
 * into RouterContext.
 * @return {Promise}
 */
export default function fetchAggregatedAsyncState({ dispatch, getState }, renderProps) {
  return Promise.all(renderProps.components
    // Assign a default value to prevent errors when a component is undefined.
    .filter(({ getAsyncState } = {}) => getAsyncState)
    .map(({ getAsyncState }) => getAsyncState(dispatch, getState, renderProps)));
}
