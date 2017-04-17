import ActionTypes from './ActionTypes';
import ReadyState from './ReadyState';

const defaultState = {
  readyState: ReadyState.PENDING,
};

const isSameFetchId = (state, action) =>
  state.fetchId === action.payload.fetchId;

const requestReducer = (state, action) => ({
  ...state,
  fetchId: action.payload.fetchId,
  location: action.payload.location,
  readyState: ReadyState.LOADING,
});

const failureReducer = (state, action) => {
  if (!isSameFetchId(state, action)) return state;
  return {
    ...state,
    fetchId: action.payload.fetchId,
    location: action.payload.location,
    readyState: ReadyState.FAILURE,
  };
};

const successReducer = (state, action) => {
  if (!isSameFetchId(state, action)) return state;
  return {
    ...state,
    fetchId: action.payload.fetchId,
    location: action.payload.location,
    readyState: ReadyState.SUCCESS,
  };
};

export default function (state = defaultState, action) {
  switch (action.type) {
  case ActionTypes.FETCH_FAILURE:
    return failureReducer(state, action);
  case ActionTypes.FETCH_REQUEST:
    return requestReducer(state, action);
  case ActionTypes.FETCH_SUCCESS:
    return successReducer(state, action);
  default:
    return state;
  }
}
