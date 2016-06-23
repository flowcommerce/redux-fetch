import { handleActions } from 'redux-actions';
import { assign } from 'lodash';

const initialState = {};

export default handleActions({
  FETCH_USER_SUCCESS: (state, action) =>
    assign({}, state, action.payload),
  FETCH_USER_FAILURE: (state, action) =>
    assign({}, state, { error: action.payload }),
}, initialState);
