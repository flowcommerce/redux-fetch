import React, { Component } from 'react';
import PropTypes from 'prop-types';
import StaticContainer from 'react-static-container';
import ReadyState from './ReadyState';

class FetchReadyStateRenderer extends Component {
  renderChildrenIfNeeded() {
    const {
      children, error, readyState, renderFailure, renderSuccess, renderLoading,
    } = this.props;

    if (readyState === ReadyState.PENDING || readyState === ReadyState.LOADING) {
      if (renderLoading) {
        return renderLoading();
      }
    } else if (readyState === ReadyState.FAILURE) {
      if (renderFailure) {
        return renderFailure(error);
      }
    } else if (readyState === ReadyState.SUCCESS) {
      if (renderSuccess) {
        return renderSuccess();
      }

      return children;
    }

    return undefined;
  }

  render() {
    let children = this.renderChildrenIfNeeded();
    let shouldUpdate = true;

    if (typeof children === 'undefined') {
      shouldUpdate = false;
      children = null;
    }

    return (
      <StaticContainer shouldUpdate={shouldUpdate}>
        {children}
      </StaticContainer>
    );
  }
}

FetchReadyStateRenderer.displayName = 'FetchReadyStateRenderer';

FetchReadyStateRenderer.propTypes = {
  children: PropTypes.node,
  error: PropTypes.any,
  readyState: PropTypes.oneOf([
    ReadyState.FAILURE,
    ReadyState.LOADING,
    ReadyState.PENDING,
    ReadyState.SUCCESS,
  ]).isRequired,
  renderFailure: PropTypes.func,
  renderLoading: PropTypes.func,
  renderSuccess: PropTypes.func,
};

export default FetchReadyStateRenderer;
