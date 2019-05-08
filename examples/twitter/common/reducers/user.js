import { handleActions } from 'redux-actions';
import assign from 'lodash/assign';

import ActionTypes from '../constants/ActionTypes';

const initialState = {
  error: null,
};

export default handleActions({
  [ActionTypes.FETCH_USER_SUCCESS]: (state, action) => assign({}, state, action.payload),
  [ActionTypes.FETCH_USER_FAILURE]: (state, action) => assign({}, state, { error: action.payload }),
}, initialState);
