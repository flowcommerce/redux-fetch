import ReadyState from './ReadyState';

export const getLocation = state => state.fetch.location;
export const getReadyState = state => state.fetch.readyState;
export const getIsReadyStatePending = state => getReadyState(state) === ReadyState.PENDING;
export const getIsReadyStateLoading = state => getReadyState(state) === ReadyState.LOADING;
export const getIsReadyStateSuccess = state => getReadyState(state) === ReadyState.SUCCESS;
export const getIsReadyStateFailure = state => getReadyState(state) === ReadyState.FAILURE;
