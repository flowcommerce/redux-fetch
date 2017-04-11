import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { fetchRouteData } from './actions';
import { getIsSameLocation, getReadyState } from './selectors';
import FetchReadyStateRenderer from './FetchReadyStateRenderer';
import ReadyState from './ReadyState';

class FetchRootContainer extends Component {

  static displayName = 'FetchRootContainer';

  static propTypes = {
    children: PropTypes.node.isRequired,
    forceInitialFetch: PropTypes.bool,
    isSameLocation: PropTypes.bool.isRequired,
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

  static defaultProps = {
    forceInitialFetch: false,
  };

  componentDidMount() {
    const { forceInitialFetch, readyState } = this.props;
    if (readyState === ReadyState.PENDING || forceInitialFetch) {
      this.fetchRouteData();
    }
  }

  componentDidUpdate() {
    const { isSameLocation } = this.props;
    if (!isSameLocation) {
      this.fetchRouteData();
    }
  }

  getReadyState() {
    const { isSameLocation, readyState } = this.props;
    return isSameLocation ? readyState : ReadyState.PENDING;
  }

  fetchRouteData() {
    const { onFetchRouteData, routerProps } = this.props;
    onFetchRouteData(routerProps);
  }

  render() {
    const { children, renderFailure, renderSuccess, renderLoading } = this.props;
    const readyState = this.getReadyState();

    return (
      <FetchReadyStateRenderer
        readyState={readyState}
        renderFailure={renderFailure}
        renderLoading={renderLoading}
        renderSuccess={renderSuccess}>
        {children}
      </FetchReadyStateRenderer>
    );
  }
}

const mapStateToProps = (state, { routerProps: { location } }) => ({
  readyState: getReadyState(state),
  isSameLocation: getIsSameLocation(location)(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
  onFetchRouteData: fetchRouteData,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(FetchRootContainer);
export { FetchRootContainer as FetchRootComponent };
