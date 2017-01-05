import { PropTypes } from 'react';

export const fetchShape = PropTypes.shape({
  error: PropTypes.any,
  fetching: PropTypes.bool.isRequired,
  firstRender: PropTypes.bool.isRequired,
  renderFailure: PropTypes.func,
  renderLoading: PropTypes.func,
  renderSuccess: PropTypes.func,
});

export const storeShape = PropTypes.shape({
  subscribe: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
  getState: PropTypes.func.isRequired,
});
