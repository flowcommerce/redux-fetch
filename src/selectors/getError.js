import defaultGetFetchState from './getFetchState';
import getIn from '../utilities/getIn';

export default function createGetError(getFetchState = defaultGetFetchState) {
  return function getError(state) {
    return getIn(getFetchState(state), 'error');
  };
}
