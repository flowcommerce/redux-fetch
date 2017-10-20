import PropTypes from 'prop-types';
import React from 'react';
import FetchPropTypes from '../utilities/FetchPropTypes';
import FetchStaticContainer from '../components/FetchStaticContainer';
import ReadyState from '../constants/ReadyState';

const FetchReadyStateRenderer = ({ error, readyState, render, retry }) => {
  let shouldUpdate = true;

  let children = render({
    error,
    loading: readyState === ReadyState.PENDING || readyState === ReadyState.LOADING,
    retry,
  });

  if (typeof children === 'undefined') {
    shouldUpdate = false;
    children = null;
  }

  return (
    <FetchStaticContainer shouldUpdate={shouldUpdate}>
      {children}
    </FetchStaticContainer>
  );
};

FetchReadyStateRenderer.displayName = 'FetchReadyStateRenderer';

FetchReadyStateRenderer.propTypes = {
  error: PropTypes.any,
  readyState: FetchPropTypes.ReadyState.isRequired,
  render: PropTypes.func.isRequired,
  retry: PropTypes.func.isRequired,
};

export default FetchReadyStateRenderer;
