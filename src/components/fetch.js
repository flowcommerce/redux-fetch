/* eslint-disable no-underscore-dangle */

import React, { Component, PropTypes } from 'react';
import invariant from 'invariant';
import hoistStatics from 'hoist-non-react-statics';
import fetchData from '../utilities/fetch-data';
import getDisplayName from '../utilities/get-display-name';
import Spinner from './spinner';
import Glitch from './glitch';

const storePropTypes = PropTypes.shape({
  subscribe: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
  getState: PropTypes.func.isRequired,
});

export default function fetch(getInitialAsyncState, options = {}) {
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

      static getInitialAsyncState = getInitialAsyncState;

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
        if (this.store.__didInitialLoad__ || this.settings.forceInitialFetch) {
          this.setState({ isFetching: true, hasError: false, error: null });

          fetchData(this.store, getInitialAsyncState).then(() => {
            this.setState({ isFetching: false });
          }).catch((error) => {
            this.setState({ isFetching: false, hasError: true, error });
          });
        }

        this.store.__didInitialLoad__ = true;
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
  forceInitialFetch: false,
  renderFailure: (/* error */) => <Glitch />,
  renderLoading: () => <Spinner />,
};

fetch.setup = (options) => {
  Object.assign(fetch.settings, options);
};
