import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { fetchRouteData } from './actions';
import { getError, getReadyState } from './selectors';
import FetchReadyStateRenderer from './FetchReadyStateRenderer';
import ReadyState from './ReadyState';
import isSameLocation from './isSameLocation';

class FetchRootContainer extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = this.getInitialState();
  }

  getInitialState() {
    const { readyState } = this.props;
    return { readyState };
  }

  componentDidMount() {
    const { forceInitialFetch } = this.props;
    const { readyState } = this.state;

    if (readyState === ReadyState.PENDING || forceInitialFetch) {
      this.fetchRouteData();
    }
  }

  componentWillReceiveProps(nextProps) {
    const { routerProps: previousRouterProps } = this.props;
    const { readyState: nextReadyState, routerProps: nextRouterProps } = nextProps;
    const { location: previousLocation } = previousRouterProps;
    const { location: nextLocation } = nextRouterProps;

    if (isSameLocation(previousLocation, nextLocation)) {
      this.setState({ readyState: nextReadyState });
    } else {
      this.setState({ readyState: ReadyState.PENDING });
    }
  }

  componentDidUpdate() {
    const { readyState } = this.state;

    if (readyState === ReadyState.PENDING) {
      this.fetchRouteData();
    }
  }

  fetchRouteData() {
    const { onFetchRouteData, routerProps } = this.props;
    onFetchRouteData(routerProps);
  }

  render() {
    const {
      children, error, renderFailure, renderSuccess, renderLoading,
    } = this.props;
    const { readyState } = this.state;

    return (
      <FetchReadyStateRenderer
        error={error}
        readyState={readyState}
        renderFailure={renderFailure}
        renderLoading={renderLoading}
        renderSuccess={renderSuccess}>
        {children}
      </FetchReadyStateRenderer>
    );
  }
}

FetchRootContainer.displayName = 'FetchRootContainer';

FetchRootContainer.propTypes = {
  children: PropTypes.node.isRequired,
  error: PropTypes.any,
  forceInitialFetch: PropTypes.bool,
  onFetchRouteData: PropTypes.func.isRequired,
  readyState: PropTypes.oneOf([
    ReadyState.FAILURE,
    ReadyState.LOADING,
    ReadyState.PENDING,
    ReadyState.SUCCESS,
  ]).isRequired,
  renderFailure: PropTypes.func,
  renderLoading: PropTypes.func,
  renderSuccess: PropTypes.func,
  routerProps: PropTypes.object.isRequired,
};

FetchRootContainer.defaultProps = {
  forceInitialFetch: false,
};

const mapStateToProps = state => ({
  error: getError(state),
  readyState: getReadyState(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
  onFetchRouteData: fetchRouteData,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(FetchRootContainer);
export { FetchRootContainer as FetchRootComponent }; // for testing
