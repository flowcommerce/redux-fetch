import React from 'react';
import invariant from 'invariant';
import hoistStatics from 'hoist-non-react-statics';
import StaticContainer from 'react-static-container';
import warning from '../utilities/warning';
import isBrowser from '../utilities/isBrowser';
import getDisplayName from '../utilities/getDisplayName';
import { storeShape } from '../utilities/propTypes';

// A higher-order component that provides the ability to fulfill data requirements for components
// before rendering based on the specified parameters.
export default function fetch(getAsyncState, options = {}) {
  return function createContainer(Component) {
    const displayName = `Fetch(${getDisplayName(Component)})`;

    class FetchContainer extends React.Component {

      static displayName = displayName;

      static contextTypes = {
        store: storeShape,
      };

      static propTypes = {
        store: storeShape,
      }

      static getAsyncState = getAsyncState;

      constructor(props, context) {
        super(props, context);

        this.store = props.store || context.store;
        this.settings = Object.assign({}, fetch.settings, options);

        invariant(this.store,
          `Could not find "store" in either the context or props of "${displayName}". ` +
          'Either wrap the root component in a `<Provider>`, ' +
          `or explicitly pass "store" as a prop to "${displayName}".`
        );
      }

      state = {
        error: null,
        hasError: false,
        isFetching: false,
      };

      componentWillMount() {
        const dispatch = this.store.dispatch;
        const state = this.store.getState();
        const ownProps = this.props;

        if (this.settings.shouldFetchBeforeMount(ownProps, state)) {
          this.fetchData(dispatch, state, ownProps);
        }
      }

      componentWillReceiveProps(nextProps) {
        const dispatch = this.store.dispatch;
        const state = this.store.getState();
        const prevProps = this.props;

        if (this.settings.shouldFetchBeforeUpdate(prevProps, nextProps, state)) {
          this.fetchData(dispatch, state, nextProps);
        }
      }

      componentWillUnmount() {
        this.ignoreLastFetch = true;
      }

      setStateSafely(nextState) {
        // Enclose `setState` in try/catch statement to avoid swallowing errors thrown while
        // rendering components within async executions.
        try {
          this.setState(nextState);
        } catch (error) {
          // eslint-disable-next-line no-console
          warning(false,
            'Error while rendering component. ' +
            `Check the render method of ${displayName}. ` +
            `Error details: ${error}`
          );
        }
      }

      fetchData(dispatch, state, props) {
        this.setState({ isFetching: true, hasError: false, error: null });

        getAsyncState(dispatch, state, props).then(() => {
          if (!this.ignoreLastFetch) {
            this.setStateSafely({ isFetching: false });
          }
        }).catch((error) => {
          if (!this.ignoreLastFetch) {
            this.setStateSafely({ isFetching: false, hasError: true, error });
          }
        });
      }

      renderChildren() {
        const { renderFailure, renderLoading, renderFetched } = this.settings;

        if (this.state.hasError) {
          if (renderFailure) {
            return renderFailure(this.state.error);
          }
        } else if (this.state.isFetching) {
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
        let children = this.renderChildren();
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

fetch.settings = {
  renderLoading: undefined,
  renderSuccess: undefined,
  renderFailure: undefined,
  shouldFetchBeforeMount() {
    // Avoid fulfilling data requirements before mounting the component on the server since
    // developers are expected to use the `fetchAsyncStateOnServer` utility to prepare the
    // application state before rendering the matched components by React Router.
    return isBrowser();
  },
  shouldFetchBeforeUpdate(prevProps, nextProps) {
    // Avoid fulfilling data requirements before updating the component unless the route locations
    // are completely different.
    return prevProps.location.pathname !== nextProps.location.pathname ||
      prevProps.location.search !== nextProps.location.search;
  },
};

fetch.setup = (options) => {
  Object.assign(fetch.settings, options);
};
