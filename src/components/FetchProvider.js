import { Children, Component, PropTypes } from 'react';
import { locationShape } from 'react-router';
import invariant from 'invariant';
import { fetchShape, storeShape } from '../utilities/PropTypes';
import fetchAsyncState from '../utilities/fetchAsyncState';

/**
 * Provides context needed for containers created with `fetch()` in the
 * component hierarchy below to perform their expected behavior.
 */
export default class FetchProvider extends Component {

  static displayName = 'FetchProvider';

  static propTypes = {
    /**
     * @property {Function} A function responsible for fulfilling the data
     * requirements for components matched to a location. The application store
     * and router state will be injected into the function when called and it
     * should return a promise that is settled after fetching the required data.
     */
    aggregator: PropTypes.func,

    children: PropTypes.node.isRequired,

    /**
     * @property {Boolean} By default, the component assumes the store will be
     * rehydrated from data bootstrapped on the server response on first render
     * and will prevent sending requests to the server until the next route
     * change. If you instead wanted to force requests even if the store was
     * rehydrated, you can use the `forceInitialFetch` boolean property. You
     * should only set this property in browser environments.
     */
    forceInitialFetch: PropTypes.bool,

    /**
     * @property {Object} The React Router properties normally injected into
     * RouterContext after matching routes to a location.
     */
    routerProps: PropTypes.shape({
      location: locationShape.isRequired,
    }).isRequired,

    /**
     * @property {Function} When data requirements have yet to be fulfilled,
     * `renderLoading` is called to render the component. If this returns
     * `undefined`, the previously rendered component (or nothing if there is
     * no previous component) is rendered. You should define this property if
     * you want to propagate the same behavior on all containers created with
     * `fetch()` in the component hierarchy below.
     */
    renderLoading: PropTypes.func,

    /**
     * @property {Function} When data requirements failed to be fulfilled,
     * `renderFailure` is called to render the component. The function will
     * receive the `error` received while attempting to fetch data requirements.
     * You should define this property if you want to propagate the same
     * behavior on all containers created with `fetch()` in the component
     * hierarchy below.
     */
    renderFailure: PropTypes.func,

    /**
     * @property {Object} An instance of the Redux store used in your
     * application.
     */
    store: storeShape,
  };

  static defaultProps = {
    aggregator: fetchAsyncState,
    forceInitialFetch: false,
  };

  static contextTypes = {
    /**
     * @property {Object} An instance of the Redux store used in your
     * application.
     */
    store: storeShape,
  };

  static childContextTypes = {
    fetch: fetchShape.isRequired,
  };

  constructor(props, context) {
    super(props, context);

    this.retry = this.retry.bind(this);

    this.firstRender = true;
    this.store = props.store || context.store;
    this.state = { error: null, fetching: false };

    invariant(this.store,
      'Could not find "store" in either the context or props of "FetchProvider". ' +
      'Either wrap the root component in a `<Provider>`, ' +
      'or explicitly pass "store" as a prop to "FetchProvider".',
    );
  }

  getChildContext() {
    return {
      fetch: {
        error: this.state.error,
        fetching: this.state.fetching,
        firstRender: this.firstRender,
        renderFailure: this.props.renderFailure,
        renderLoading: this.props.renderLoading,
        retry: this.retry,
      },
    };
  }

  componentWillMount() {
    const { aggregator, forceInitialFetch, routerProps } = this.props;

    // Rendering on the server-side is stateless, therefore it will always be
    // "first render" and data will not be fetched. Developers are expected to
    // fulfill the data requirements with `fetchAsyncState` on the server instead.
    if (!this.firstRender || forceInitialFetch) {
      this.getAsyncState(aggregator, routerProps);
    }
  }

  componentDidMount() {
    this.firstRender = false;
  }

  componentWillReceiveProps(nextProps) {
    const { aggregator, routerProps } = nextProps;
    const prevLocation = this.props.routerProps.location;
    const nextLocation = routerProps.location;

    if (nextLocation !== prevLocation) {
      this.getAsyncState(aggregator, routerProps);
    }
  }

  getAsyncState(aggregator, routerProps) {
    this.setState({ fetching: true, error: null });
    aggregator(this.store, routerProps).then(() => {
      this.setState({ fetching: false });
    }, (error) => {
      this.setState({ fetching: false, error });
    });
  }

  retry() {
    const { aggregator, routerProps } = this.props;
    this.getAsyncState(aggregator, routerProps);
  }

  render() {
    return Children.only(this.props.children);
  }
}
