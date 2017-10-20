import React from 'react';
import PropTypes from 'prop-types';
import { FetchRootContainer } from '@flowio/redux-fetch';
import { BrowserRouter, StaticRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

import Application from '../Application';
import isBrowser from '../../utilities/isBrowser';

const Router = isBrowser ? BrowserRouter : StaticRouter;

const Root = ({ context, location, routes, store }) => (
  <Provider store={store}>
    <Router context={context} location={location}>
      <FetchRootContainer routes={routes}>
        <Application routes={routes} />
      </FetchRootContainer>
    </Router>
  </Provider>
);

Root.displayName = 'Root';

Root.propTypes = {
  context: PropTypes.object,
  location: PropTypes.string,
  routes: PropTypes.array.isRequired,
  store: PropTypes.object.isRequired,
};

export default Root;
