import React, { Component } from 'react';
import invariant from 'invariant';
import hoistStatics from 'hoist-non-react-statics';
import StaticContainer from 'react-static-container';
import getDisplayName from '../utilities/get-display-name';
import storeShape from '../utilities/store-shape';

/**
 * A higher order component that sends requests for data required to render
 * supplied `WrappedComponent`.
 *
 * Render Callbacks
 * ================
 *
 * Whenever the component renders, one of one of three render callback options are invoked
 * depending on whether data is being loaded, can be resolved, or if an error is incurred.
 *
 *    import { connect } from 'react-redux';
 *    import { fetch } from '@flowio/redux-fetch';
 *    import { fetchSomeData } from '../path/to/some/actions';
 *    import SomeComponent from '../path/to/some/component';
 *
 *    function getAsyncState(dispatch) {
 *      return dispatch(fetchSomeData());
 *    }
 *
 *    function mapStateToProps(state) {
 *      return state.something;
 *    }
 *
 *    export default fetch(getAsyncState, {
 *      renderLoading: () => <View>Loading...</View>,
 *      renderSuccess: () => <SomeComponent />,
 *      renderFailure: (error) => <View>Error: {error.message}</View>,
 *    })(connect(mapStateToProps)(SomeComponent));
 *
 * If a callback is not supplied, it has a default behavior:
 *
 *  - Without `renderSuccess`, `Component` will be rendered.
 *  - Without `renderFailure`, an error will render to `null`.
 *  - Without `renderLoading`, the existing view will continue to render. If this is the initial
 *    mount (with no existing view), renders to `null`.
 *
 * In addition, supplying a `renderLoading` that returns `undefined` has the same effect as not
 * supplying the callback. (Usually, an undefined return value is an error in React).
 */
export default function fetch(getAsyncState, options = {}) {
  return function wrapWithFetch(WrappedComponent) {
    const displayName = `Fetch(${getDisplayName(WrappedComponent)})`;

    class Fetch extends Component {
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

        if (this.settings.shouldFetchOnMount(state, ownProps)) {
          this.fetchData(dispatch, state, ownProps);
        }
      }

      componentWillReceiveProps(nextProps) {
        const dispatch = this.store.dispatch;
        const state = this.store.getState();
        const prevProps = this.props;

        if (this.settings.shouldFetchOnUpdate(state, prevProps, nextProps)) {
          this.fetchData(dispatch, state, nextProps);
        }
      }

      componentWillUnmount() {
        this.ignoreLastFetch = true;
      }

      // Enclose `setState` in try/catch statement in promise chain to avoid swallowing errors
      // thrown while rendering components.
      setAsyncState(nextState) {
        try {
          this.setState(nextState);
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error(
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
            this.setAsyncState({ isFetching: false });
          }
        }).catch((error) => {
          if (!this.ignoreLastFetch) {
            this.setAsyncState({ isFetching: false, hasError: true, error });
          }
        });
      }

      renderChildren() {
        if (this.state.hasError) {
          if (this.settings.renderFailure) {
            return this.settings.renderFailure(this.state.error);
          }
        } else if (this.state.isFetching) {
          if (this.settings.renderLoading) {
            return this.settings.renderLoading();
          }
        } else {
          if (this.settings.renderSuccess) {
            return this.settings.renderSuccess(this.props);
          }

          return <WrappedComponent {...this.props} />;
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

    return hoistStatics(Fetch, WrappedComponent);
  };
}

fetch.settings = {
  renderLoading: undefined,
  renderSuccess: undefined,
  renderFailure: undefined,
  shouldFetchOnMount: () => true,
  shouldFetchOnUpdate: (state, prevProps, nextProps) =>
    prevProps.location.pathname !== nextProps.location.pathname ||
    prevProps.location.search !== nextProps.location.search,
};

fetch.setup = (options) => {
  Object.assign(fetch.settings, options);
};
