import PropTypes from 'prop-types';
import ReadyState from '../constants/ReadyState';

const FetchPropTypes = {
  ReadyState: PropTypes.oneOf([
    ReadyState.CANCELED,
    ReadyState.FULFILLED,
    ReadyState.LOADING,
    ReadyState.PENDING,
    ReadyState.REJECTED,
  ]),
};

export default FetchPropTypes;
