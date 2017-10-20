import ActionType from './constants/ActionType';
import ReadyState from './constants/ReadyState';

const defaultState = {
  readyState: ReadyState.PENDING,
};

export default function (state = defaultState, action) {
  switch (action.type) {
  case ActionType.LOADING:
    return Object.assign({}, state, {
      pathname: action.payload.pathname,
      readyState: ReadyState.LOADING,
    });
  case ActionType.CANCELED:
    return Object.assign({}, state, {
      pathname: action.payload.pathname,
      readyState: ReadyState.CANCELED,
    });
  case ActionType.FULFILLED:
    return Object.assign({}, state, {
      pathname: action.payload.pathname,
      readyState: ReadyState.FULFILLED,
    });
  case ActionType.REJECTED:
    return Object.assign({}, state, {
      error: action.payload.error,
      pathname: action.payload.pathname,
      readyState: ReadyState.REJECTED,
    });
  default:
    return state;
  }
}
