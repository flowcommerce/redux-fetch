import PropTypes from 'prop-types';
import React from 'react';
import CancellationTokenSource from '../utilities/CancellationTokenSource';
import FetchPropTypes from '../utilities/FetchPropTypes';
import FetchReadyStateRenderer from './FetchReadyStateRenderer';
import ReadyState from '../constants/ReadyState';

class FetchRenderer extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = this.getInitialState();
    this.fetchSource = undefined;
    this.retryRequest = this.retryRequest.bind(this);
  }

  getInitialState() {
    const { readyState } = this.props;
    return { readyState };
  }

  componentDidMount() {
    const { forceFetch } = this.props;
    const { readyState } = this.state;

    if (readyState === ReadyState.PENDING || forceFetch) {
      this.makeRequest();
    }
  }

  componentWillReceiveProps(nextProps) {
    const { location: prevLocation } = this.props;
    const { location: nextLocation, readyState: nextReadyState } = nextProps;

    // A location object is never mutated so we should be able to determine
    // that navigation happened using this condition.
    if (prevLocation === nextLocation) {
      this.setState({ readyState: nextReadyState });
    } else {
      this.setState({ readyState: ReadyState.PENDING });
    }
  }

  componentDidUpdate() {
    const { readyState } = this.state;

    if (readyState === ReadyState.PENDING) {
      this.makeRequest();
    }
  }

  componentWillUnmount() {
    this.cancelRequest();
  }

  cancelRequest() {
    if (this.fetchSource) {
      this.fetchSource.cancel();
      this.fetchSource = undefined;
    }
  }

  makeRequest() {
    const { fetchDataForRoutes, location, routes } = this.props;
    this.cancelRequest();
    this.fetchSource = new CancellationTokenSource();
    fetchDataForRoutes(routes, location.pathname, this.fetchSource.token);
  }

  retryRequest() {
    const { readyState } = this.state;
    if (readyState === ReadyState.REJECTED) {
      this.makeRequest();
    }
  }

  render() {
    const { error, render } = this.props;
    const { readyState } = this.state;

    return (
      <FetchReadyStateRenderer
        error={error}
        render={render}
        readyState={readyState}
        retry={this.retryRequest} />
    );
  }
}

FetchRenderer.displayName = 'FetchRenderer';

FetchRenderer.propTypes = {
  error: PropTypes.any,
  fetchDataForRoutes: PropTypes.func.isRequired,
  forceFetch: PropTypes.bool,
  location: PropTypes.object.isRequired,
  readyState: FetchPropTypes.ReadyState,
  render: PropTypes.func.isRequired,
  routes: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
  ]).isRequired,
};

FetchRenderer.defaultProps = {
  forceFetch: false,
  readyState: ReadyState.PENDING,
};

export default FetchRenderer;
