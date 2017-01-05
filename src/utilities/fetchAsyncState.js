/**
 * An utility that returns a promise that is resolved after all data
 * requirements for fetch containers are fulfilled or rejected otherwise.
 * @param {Object} store An instance of the Redux store used in your application.
 * @param {Object} renderProps An object with non-router specific properties,
 * typically injected into `RouterContext`.
 * @return {Promise}
 */
export default function fetchAsyncState({ dispatch, getState }, renderProps) {
  const promises = renderProps.components
    // filter falsy components
    .filter(component => component)
    // filter components that haven't been decorated
    .filter(component => component.getAsyncState)
    // fetch data requirements and store promises
    .map(component => component.getAsyncState(dispatch, getState, renderProps));

  return Promise.all(promises);
}
