import getIn from '../utilities/getIn';

export default function getFetchState(state) {
  return getIn(state, 'fetch');
}
