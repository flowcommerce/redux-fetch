import url from 'url';
import { createAction } from 'redux-actions';

import ActionTypes from '../constants/ActionTypes';
import checkHttpStatus from '../utilities/checkHttpStatus';
import normalizeResponse from '../utilities/normalizeResponse';

const fetchUserRequest = createAction(ActionTypes.FETCH_USER_REQUEST);
const fetchUserSuccess = createAction(ActionTypes.FETCH_USER_SUCCESS);
const fetchUserFailure = createAction(ActionTypes.FETCH_USER_FAILURE);

export default function fetchUser() {
  return (dispatch, getState) => {
    const state = getState();

    const fetchUrl = url.format({
      protocol: 'http',
      host: 'localhost:7051',
      pathname: '/api/users/show.json',
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
      .then(normalizeResponse)
      .then(checkHttpStatus)
      .then((response) => {
        dispatch(fetchUserSuccess(response.data));
      })
      .catch((error) => {
        const payload = error.response ? error.response.data : error;
        dispatch(fetchUserFailure(payload));
      });
  };
}
