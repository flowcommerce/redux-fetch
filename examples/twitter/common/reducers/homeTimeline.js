import { handleActions } from 'redux-actions';
import assign from 'lodash/assign';

import ActionTypes from '../constants/ActionTypes';

const initialState = {
  error: null,
  timeline: [],
};

export default handleActions({
  [ActionTypes.FETCH_HOME_TIMELINE_SUCCESS]:
    (state, action) => assign({}, state, { timeline: action.payload, error: null }),
  [ActionTypes.FETCH_HOME_TIMELINE_FAILURE]:
    (state, action) => assign({}, state, { error: action.payload, timeline: [] }),
}, initialState);
