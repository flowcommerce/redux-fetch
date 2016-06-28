import React, { Component, PropTypes } from 'react';
import invariant from 'invariant';
import hoistStatics from 'hoist-non-react-statics';
import { invalidate } from '../actions';
import fetchData from '../utilities/fetch-data';
import getDisplayName from '../utilities/get-display-name';
import Spinner from './spinner';

// Global settings, overwrite using `fetch.setup` function.
const fetchSettings = {
  activityIndicator: Spinner,
  selectFetchingState: state => state.fetching,
};

const storePropTypes = PropTypes.shape({
  subscribe: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
  getState: PropTypes.func.isRequired,
});

export default function fetch(getInitialAsyncState) {
  return function wrapWithFetch(
    RouteComponent,
    ActivityIndicator = fetchSettings.activityIndicator
  ) {
    const displayName = `Fetch(${getDisplayName(RouteComponent)})`;

    class Fetch extends Component {
      static displayName = displayName;

      static contextTypes = {
        store: storePropTypes,
      };

      static propTypes = {
        store: storePropTypes,
      }

      static getInitialAsyncState = getInitialAsyncState;

      constructor(props, context) {
        super(props, context);

        const store = this.store = props.store || context.store;

        invariant(store,
          `Could not find "store" in either the context or props of "${displayName}". ` +
          'Either wrap the root component in a `<Provider>`, ' +
          `or explicitly pass "store" as a prop to "${displayName}".`
        );

        invariant(fetchSettings.selectFetchingState(store.getState()),
          'Expected the fetching state to be available as `state.fetching`. ' +
          'or as the custom expression you can specify as `selectFetchingState` ' +
          'with the `fetch.setup()` interface. ' +
          'Ensure you have added the `fetchReducer` to your store\'s ' +
          'reducers via `combineReducers` or whatever method you use to isolate ' +
          'your reducers.'
        );
      }

      state = {
        isFetching: false,
      };

      componentWillMount() {
        const state = fetchSettings.selectFetchingState(this.store.getState());

        // Guard to ensure we do not attempt to reload route state when data
        // is hydrated on the client-side from the serve-side.
        if (!state.shouldFetch) {
          // Invalidate guard so that subsequent route components fetch data
          // from the server-side.
          this.store.dispatch(invalidate());
        } else {
          this.setState({ isFetching: true });
          fetchData(this.store, getInitialAsyncState).then(() => {
            this.setState({ isFetching: false });
          });
        }
      }

      render() {
        if (this.state.isFetching && ActivityIndicator) {
          return <ActivityIndicator {...this.props} />;
        }

        return <RouteComponent {...this.props} />;
      }
    }

    return hoistStatics(Fetch, RouteComponent);
  };
}

fetch.setup = (options) => {
  Object.assign(fetchSettings, options);
};
