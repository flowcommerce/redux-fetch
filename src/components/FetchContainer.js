import React from 'react';
import hoistStatics from 'hoist-non-react-statics';
import StaticContainer from 'react-static-container';
import getDisplayName from '../utilities/getDisplayName';
import { fetchShape } from '../utilities/PropTypes';

// A higher-order component that provides the ability to fulfill data requirements for components
// before rendering based on the specified parameters.
export default function fetch(getAsyncState, options = {}) {
  return function createContainer(Component) {
    const componentName = getDisplayName(Component);
    const containerName = `Fetch(${componentName})`;

    class FetchContainer extends React.Component {

      static displayName = containerName;

      static contextTypes = {
        fetch: fetchShape.isRequired,
      };

      // Define `getAsyncState` as a static property of the component so that it can be accessed
      // later by `fetchAsyncState` utility, which aggregates all asynchronous calls needed
      // to fulfill the data requirements for a branch of the router before rendering.
      static getAsyncState = getAsyncState;

      renderChildrenIfNecessary() {
        const {
          error,
          fetching,
          renderFailure,
          renderLoading,
          renderFetched,
        } = Object.assign({}, this.context.fetch, options);

        if (error) {
          if (renderFailure) {
            return renderFailure(error);
          }
        } else if (fetching) {
          if (renderLoading) {
            return renderLoading();
          }
        } else {
          if (renderFetched) {
            return renderFetched(this.props);
          }

          return <Component {...this.props} />;
        }

        return undefined;
      }

      render() {
        let children = this.renderChildrenIfNecessary();
        let shouldUpdate = true;

        if (children === undefined) {
          children = null;
          shouldUpdate = false;
        }

        return (
          <StaticContainer shouldUpdate={shouldUpdate}>
            {children}
          </StaticContainer>
        );
      }
    }

    return hoistStatics(FetchContainer, Component);
  };
}
