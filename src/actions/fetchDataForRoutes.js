import { matchRoutes } from 'react-router-config';
import fetchCanceled from './fetchCanceled';
import fetchFulfilled from './fetchFulfilled';
import fetchLoading from './fetchLoading';
import fetchRejected from './fetchRejected';
import CancellationToken from '../utilities/CancellationToken';

/**
 * An asynchronous action creator that fetches the data required before
 * rendering matched route components when dispatched.
 *
 * NOTE: The Redux store is expected to be configured with
 * the Redux Thunk middleware.
 *
 * @param {RouteConfig[]} routes - the route configuration.
 * @param {String} pathname - the current location of the application.
 * @param {CancellationToken} [cancelToken]
 * @return {Function}
 */
export default function fetchDataForRoutes(routes, pathname, cancelToken = CancellationToken.none) {
  return function fetchDataForRoutesSideEffects(dispatch, getState) {
    dispatch(fetchLoading(pathname));

    const branch = matchRoutes(routes, pathname);

    const promises = branch.map(({ route, match }) => {
      const { fetchData } = route.component;
      return (fetchData instanceof Function)
        ? fetchData(dispatch, getState, match, cancelToken)
        : Promise.resolve(null);
    });

    const registration = cancelToken.register(() => {
      dispatch(fetchCanceled(pathname));
    });

    return Promise.all(promises).then(() => {
      if (!cancelToken.cancellationRequested) {
        registration.unregister();
        dispatch(fetchFulfilled(pathname));
      }
    }).catch((error) => {
      if (!cancelToken.cancellationRequested) {
        registration.unregister();
        dispatch(fetchRejected(pathname, error));
      }
    });
  };
}
