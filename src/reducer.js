import ActionTypes from './ActionTypes';
import ReadyState from './ReadyState';

const defaultState = {
  readyState: ReadyState.PENDING,
};

export default function (state = defaultState, action) {
  switch (action.type) {
  case ActionTypes.FETCH_FAILURE:
    return {
      ...state,
      location: action.payload,
      readyState: ReadyState.FAILURE,
    };
  case ActionTypes.FETCH_REQUEST:
    return {
      ...state,
      location: action.payload,
      readyState: ReadyState.LOADING,
    };
  case ActionTypes.FETCH_SUCCESS:
    return {
      ...state,
      location: action.payload,
      readyState: ReadyState.SUCCESS,
    };
  default:
    return state;
  }
}
