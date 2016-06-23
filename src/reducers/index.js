import { ActionTypes } from '../constants';

const initialState = {
  shouldFetch: true,
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
  case ActionTypes.FETCH_VALIDATE:
    return { ...state, shouldFetch: false };
  case ActionTypes.FETCH_INVALIDATE:
    return { ...state, shouldFetch: true };
  default:
    return state;
  }
}
