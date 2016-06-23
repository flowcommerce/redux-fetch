import { handleActions } from 'redux-actions';
import { assign } from 'lodash';

const initialState = {
  errors: null,
  conversations: [],
};

export default handleActions({
  FETCH_USER_TIMELINE_SUCCESS: (state, action) =>
    assign({}, state, { conversations: action.payload }),
  FETCH_USER_TIMELINE_FAILURE: (state, action) =>
    assign({}, state, { error: action.payload }),
}, initialState);
