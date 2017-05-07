import ReadyState from './ReadyState';

export const getLocation = state => state.fetch.location;
export const getReadyState = state => state.fetch.readyState;
export const getError = state => state.fetch.error;
export const getIsPending = state => getReadyState(state) === ReadyState.PENDING;
export const getIsLoading = state => getReadyState(state) === ReadyState.LOADING;
export const getIsSuccess = state => getReadyState(state) === ReadyState.SUCCESS;
export const getIsFailure = state => getReadyState(state) === ReadyState.FAILURE;
