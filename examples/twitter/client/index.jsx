import 'isomorphic-fetch';

import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';

import configureStore from '../common/utilities/configureStore';

const store = configureStore(window.$REDUX_STATE);

const rootElement = document.querySelector('#react-root');

function render() {
  // eslint-disable-next-line global-require
  const Root = require('../common/components/Root').default;

  ReactDOM.render(
    <AppContainer>
      <Root store={store} />
    </AppContainer>,
    rootElement,
  );
}

render();

// Hot Module Replacement API
if (module.hot) {
  module.hot.accept('../common/components/Root', () => {
    // Workaround to support hot swapping of routes.
    // Follow this thread to understand the reasoning behind it.
    // https://github.com/ReactTraining/react-router/issues/2182
    setTimeout(() => {
      ReactDOM.unmountComponentAtNode(rootElement);
      render();
    });
  });
}
