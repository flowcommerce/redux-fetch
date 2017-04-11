import isEqual from 'lodash/isEqual';
import pick from 'lodash/pick';

export const getLocation = state => state.fetching.location;

export const getIsSameLocation = nextLocation => (state) => {
  const prevLocation = getLocation(state);
  const compareProps = ['pathname', 'search', 'hash'];
  return isEqual(pick(prevLocation, compareProps), pick(nextLocation, compareProps));
};

export const getReadyState = state => state.fetching.readyState;
