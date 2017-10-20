import ActionType from '../constants/ActionType';

/**
 * Returns the action that is dispatched when data requirements for the
 * specified location has failed.
 * @access private
 * @param {String} pathname
 * @param {Any} error
 * @returns {Object}
 */
export default function fetchRejected(pathname, error) {
  return {
    type: ActionType.REJECTED,
    payload: { pathname, error },
  };
}
