import ActionType from '../constants/ActionType';

/**
 * Returns the action that is dispatched when data requirements for the
 * specified location is canceled.
 * @access private
 * @param {String} pathname
 * @return {Object}
 */
export default function fetchCanceled(pathname) {
  return {
    type: ActionType.CANCELED,
    payload: { pathname },
  };
}
