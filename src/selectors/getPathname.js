import defaultGetFetchState from './getFetchState';
import getIn from '../utilities/getIn';

export default function createGetPathname(getFetchState = defaultGetFetchState) {
  return function getPathname(state) {
    return getIn(getFetchState(state), 'pathname');
  };
}
