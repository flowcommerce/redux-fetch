import PropTypes from 'prop-types';
import React from 'react';
import { applyRouterMiddleware, browserHistory, Router } from 'react-router';
import { Provider } from 'react-redux';
import { useFetch } from '@flowio/redux-fetch';

import configureRoutes from '../utilities/configureRoutes';

const routes = configureRoutes();

const Root = ({ store }) => (
  <Provider store={store}>
    <Router
      history={browserHistory}
      routes={routes}
      render={applyRouterMiddleware(useFetch())} />
  </Provider>
);

Root.displayName = 'Root';

Root.propTypes = {
  store: PropTypes.shape({
    subscribe: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    getState: PropTypes.func.isRequired,
  }),
};

export default Root;
