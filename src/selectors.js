import ReadyState from './ReadyState';

export const getLocation = state => state.fetch.location;

export const getReadyState = state => state.fetch.readyState;

export const getIsSameLocation = nextLocation => (state) => {
  const prevLocation = getLocation(state);
  return prevLocation && nextLocation &&
    prevLocation.pathname === nextLocation.pathname &&
    prevLocation.search === nextLocation.search;
};

export const getIsReadyStatePending = state => getReadyState(state) === ReadyState.PENDING;
export const getIsReadyStateLoading = state => getReadyState(state) === ReadyState.LOADING;
export const getIsReadyStateSuccess = state => getReadyState(state) === ReadyState.SUCCESS;
export const getIsReadyStateFailure = state => getReadyState(state) === ReadyState.FAILURE;
