import { getUsers } from '../services/JsonPlaceholderWebApi';
import ActionTypes from '../constants/ActionTypes';

export function fetchUsersRequest() {
  return {
    type: ActionTypes.FETCH_USERS_REQUEST,
  };
}

export function fetchUsersFailure(error) {
  return {
    type: ActionTypes.FETCH_USERS_FAILURE,
    payload: error,
    error: true,
  };
}

export function fetchUsersSuccess(users) {
  return {
    type: ActionTypes.FETCH_USERS_SUCCESS,
    payload: users,
  };
}

export function fetchUsers() {
  return function fetchUsersEffects(dispatch) {
    dispatch(fetchUsersRequest());
    return getUsers().then((response) => {
      dispatch(fetchUsersSuccess(response));
    }).catch((error) => {
      dispatch(fetchUsersFailure(error));
    });
  };
}
