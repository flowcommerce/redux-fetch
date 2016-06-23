import url from 'url';
import { createAction } from 'redux-actions';
import { checkStatus, parseJSON } from '../utilities/fetch';

export const fetchUserRequest = createAction('FETCH_USER_REQUEST');
export const fetchUserSuccess = createAction('FETCH_USER_SUCCESS');
export const fetchUserFailure = createAction('FETCH_USER_FAILURE');

export function fetchUser() {
  return (dispatch, getState) => {
    const state = getState();

    const fetchUrl = url.format({
      protocol: 'http',
      host: 'localhost:9000',
      pathname: '/users/show.json',
      query: {
        user_id: state.authorization.user_id,
        screen_name: state.authorization.screen_name,
      },
    });

    const fetchOptions = {
      headers: {
        Authorization: `Bearer ${state.authorization.token}`,
      },
    };

    dispatch(fetchUserRequest());

    return fetch(fetchUrl, fetchOptions)
    .then(checkStatus)
    .then(parseJSON)
    .then(response => dispatch(fetchUserSuccess(response)))
    // Should always handle errors surfaced while fetching initial route state.
    .catch(error => dispatch(fetchUserFailure(error)));
  };
}
