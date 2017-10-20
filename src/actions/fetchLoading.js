import ActionType from '../constants/ActionType';

/**
 * Returns the action that is dispatched when data requirements for the
 * specified location has begun loading.
 * @param {String} pathname
 */
export default function fetchLoading(pathname) {
  return {
    type: ActionType.LOADING,
    payload: { pathname },
  };
}
