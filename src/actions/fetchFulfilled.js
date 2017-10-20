import ActionType from '../constants/ActionType';

/**
 * Returns the action that is dispatched when data requirements for the
 * specified location is fulfilled.
 * @access private
 * @param {String} pathname
 * @returns {Object}
 */
export default function fetchFulfilled(pathname) {
  return {
    type: ActionType.FULFILLED,
    payload: { pathname },
  };
}
