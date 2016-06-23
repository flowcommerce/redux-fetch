import React from 'react';
import { render } from 'react-dom';
import { Router, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { Provider } from 'react-redux';
import configureStore from '../common/utilities/configureStore';
import routes from '../common/routes';
// Adds fetch to global scope
import 'isomorphic-fetch';

const store = configureStore(window.$REDUX_STATE);

const history = syncHistoryWithStore(browserHistory, store);

render(
  <Provider store={store}>
    <Router history={history} routes={routes} />
  </Provider>,
  document.querySelector('#react-root')
);
