export const getLocation = state => state.fetch.location;

export const getReadyState = state => state.fetch.readyState;

export const getIsSameLocation = nextLocation => (state) => {
  const prevLocation = getLocation(state);
  return prevLocation.pathname === nextLocation.pathname &&
    prevLocation.search === nextLocation.search;
};
