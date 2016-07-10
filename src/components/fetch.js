/* eslint-disable no-underscore-dangle */

import React, { Component, PropTypes } from 'react';
import invariant from 'invariant';
import hoistStatics from 'hoist-non-react-statics';
import getDisplayName from '../utilities/get-display-name';
import Spinner from './spinner';
import Glitch from './glitch';

const storePropTypes = PropTypes.shape({
  subscribe: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
  getState: PropTypes.func.isRequired,
});

export default function fetch(getAsyncState, options = {}) {
  return function wrapWithFetch(WrappedComponent) {
    const displayName = `Fetch(${getDisplayName(WrappedComponent)})`;

    class Fetch extends Component {
      static displayName = displayName;

      static contextTypes = {
        store: storePropTypes,
      };

      static propTypes = {
        store: storePropTypes,
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
          console.error(
            `Error while rendering component. Check render() method of component ${displayName}. ` +
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

      render() {
        if (this.state.isFetching) {
          return this.settings.renderLoading();
        }

        if (this.state.hasError) {
          return this.settings.renderFailure(this.state.error);
        }

        return <WrappedComponent {...this.props} />;
      }
    }

    return hoistStatics(Fetch, WrappedComponent);
  };
}

fetch.settings = {
  renderFailure: () => <Glitch />,
  renderLoading: () => <Spinner />,
  shouldFetchOnMount: () => true,
  shouldFetchOnUpdate: (state, prevProps, nextProps) =>
    prevProps.location.pathname !== nextProps.location.pathname &&
    prevProps.location.search !== nextProps.location.search,
};

fetch.setup = (options) => {
  Object.assign(fetch.settings, options);
};
