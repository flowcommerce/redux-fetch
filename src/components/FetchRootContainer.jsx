import PropTypes from 'prop-types';
import React from 'react';
import FetchRenderer from '../containers/FetchRenderer';
import defaultGetFetchState from '../selectors/getFetchState';

const FetchRootContainer = ({
  children,
  getFetchState,
  forceFetch,
  history,
  location,
  match,
  renderFailure,
  renderFetched,
  renderLoading,
  routes,
}) => (
  <FetchRenderer
    getFetchState={getFetchState}
    forceFetch={forceFetch}
    history={history}
    location={location}
    match={match}
    routes={routes}
    render={({ error, loading, retry }) => {
      if (error) {
        if (renderFailure) {
          return renderFailure(error, retry);
        }
      } else if (loading) {
        if (renderLoading) {
          return renderLoading();
        }
      } else {
        if (renderFetched) {
          return renderFetched();
        }

        return children;
      }

      return undefined;
    }} />
);

FetchRootContainer.displayName = 'FetchRootContainer';

FetchRootContainer.propTypes = {
  children: PropTypes.node.isRequired,
  getFetchState: PropTypes.func,
  forceFetch: PropTypes.bool,
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  renderFailure: PropTypes.func,
  renderFetched: PropTypes.func,
  renderLoading: PropTypes.func,
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

FetchRootContainer.defaultProps = {
  getFetchState: defaultGetFetchState,
  forceFetch: false,
};

export default FetchRootContainer;
