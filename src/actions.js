import ActionTypes from './ActionTypes';

export const fetchRouteDataFailure = payload => ({ payload, type: ActionTypes.FETCH_FAILURE });

export const fetchRouteDataRequest = payload => ({ payload, type: ActionTypes.FETCH_REQUEST });

export const fetchRouteDataSuccess = payload => ({ payload, type: ActionTypes.FETCH_SUCCESS });

/**
 * An async action creator that returns a promise that is resolved after all
 * data requirements for decorated route components are fulfilled.
 * @param {Object} props An object with non-router specific properties,
 * typically injected into `RouterContext`.
 * @return {Promise}
 */
export const fetchRouteData = props => (dispatch, getState) => {
  const { location, components } = props;

  dispatch(fetchRouteDataRequest(location));

  const promises = components
  // Grab route components from React Router properties.
  .reduce((accumulator, component) => {
    // A component may be a plain object when named components are used.
    if (typeof component === 'object') {
      Object.keys(component).forEach((key) => {
        accumulator.push(component[key]);
      });
    } else {
      accumulator.push(component);
    }

    return accumulator;
  }, [])
  // Filter falsy components
  .filter(component => component)
  // Filter components that haven't been decorated
  .filter(component => component.fetchAsyncState)
  // Fetch data requirements and store promises
  .map(component => component.fetchAsyncState(dispatch, getState, props));

  return Promise.all(promises).then(() => {
    dispatch(fetchRouteDataSuccess(location));
  }, () => {
    dispatch(fetchRouteDataFailure(location));
  });
};
