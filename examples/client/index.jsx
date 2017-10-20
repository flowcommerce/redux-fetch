import { AppContainer } from 'react-hot-loader';
import React from 'react';
import ReactDOM from 'react-dom';
import attempt from 'lodash/attempt';
import isError from 'lodash/isError';
import Root from '../common/components/Root';
import configureStore from '../common/utilities/configureStore';
import configureRoutes from '../common/utilities/configureRoutes';

function getPreloadedState() {
  const preloadedState = attempt(() => {
    const json = document.querySelector('#preload').innerHTML;
    return JSON.parse(json);
  });
  return isError(preloadedState) ? {} : preloadedState;
}

const initialState = getPreloadedState();
const store = configureStore(initialState);
const routes = configureRoutes();
const rootElement = document.querySelector('#root');

function render() {
  ReactDOM.hydrate(
    <AppContainer>
      <Root routes={routes} store={store} />
    </AppContainer>,
    rootElement,
  );
}

render();

if (module.hot) {
  module.hot.accept('../common/components/Root', () => {
    render();
  });
}
