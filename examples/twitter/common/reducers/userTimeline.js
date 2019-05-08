import { handleActions } from 'redux-actions';
import assign from 'lodash/assign';

import ActionTypes from '../constants/ActionTypes';

const initialState = {
  error: null,
  timeline: [],
};

export default handleActions({
  [ActionTypes.FETCH_USER_TIMELINE_SUCCESS]:
    (state, action) => assign({}, state, { timeline: action.payload }),
  [ActionTypes.FETCH_USER_TIMELINE_FAILURE]:
    (state, action) => assign({}, state, { error: action.payload }),
}, initialState);
