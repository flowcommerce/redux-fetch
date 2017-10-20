import defaultGetFetchState from './getFetchState';
import getIn from '../utilities/getIn';

export default function createGetReadyState(getFetchState = defaultGetFetchState) {
  return function getReadyState(state) {
    return getIn(getFetchState(state), 'readyState');
  };
}
