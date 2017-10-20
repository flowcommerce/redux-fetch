import keyBy from 'lodash/keyBy';
import update from 'immutability-helper';
import ActionTypes from '../constants/ActionTypes';

const initialState = {};

export default function (state = initialState, action) {
  switch (action.type) {
  case ActionTypes.FETCH_USERS_SUCCESS:
    return update(state, {
      $merge: keyBy(action.payload, 'id'),
    });
  default:
    return state;
  }
}
