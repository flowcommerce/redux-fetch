import { PropTypes } from 'react';

const { any, bool, func, shape } = PropTypes;

export const fetchShape = shape({
  error: any,
  fetching: bool.isRequired,
  firstRender: bool.isRequired,
  renderFailure: func,
  renderLoading: func,
  retry: func.isRequired,
});

export const storeShape = shape({
  subscribe: func.isRequired,
  dispatch: func.isRequired,
  getState: func.isRequired,
});
