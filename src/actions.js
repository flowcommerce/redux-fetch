import ActionTypes from './ActionTypes';
import formatError from './formatError';
import isError from './isError';
import uniqueId from './uniqueId';

export const fetchFailure = (error, fetchId, location) => ({
  type: ActionTypes.FETCH_FAILURE, error, fetchId, location,
});

export const fetchRequest = (fetchId, location) => ({
  type: ActionTypes.FETCH_REQUEST, fetchId, location,
});

export const fetchSuccess = (fetchId, location) => ({
  type: ActionTypes.FETCH_SUCCESS, fetchId, location,
});

/**
 * Fetch data required to render components matched to the current location.
 * @param {RouterState} props An object representing the current state of the router.
 * @return {Promise} A promise that is settled after data requirements for all
 * matched route components is either complete or fails.
*/
export const fetchRouteData = props => (dispatch, getState) => {
  const { location, components } = props;
  const fetchId = uniqueId();

  dispatch(fetchRequest(fetchId, location));

  const promises = components
  // Grab route components from the current router state.
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
    dispatch(fetchSuccess(fetchId, location));
  }, (error) => {
    // Ideally, developers catch and handle runtime errors that occur in async
    // actions dispatched to fulfill data requirements, however, it's not a
    // great developer experience when you have to debug an error that
    // dissapears into the ether. As a result, we will reformat native errors
    // into JSON format so that it can be stored in Redux and rethrow the error
    // so it's printed in the browser developer tools.
    dispatch(fetchFailure(formatError(error), fetchId, location));
    if (isError(error)) throw error;
  });
};
