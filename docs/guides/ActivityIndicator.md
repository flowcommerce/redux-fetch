# Activity Indicators

Use the `renderLoading` callback to render an activity indicator while data is being fetched.

```javascript
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { applyRouterMiddleware, browserHistory, Router } from 'react-router';
import { useFetch } from '@flowio/redux-fetch';
import { ActivityIndicator } from './app/components';
import configureStore from './app/configureStore';
import configureRoutes from './app/configureRoutes';

// Render the app client-side to a given container element:
export default (container) => {
  const store = configureStore(window.__INITIAL_STATE___);
  const routes = configureRoutes();
  const options = {
    renderLoading: () => (<ActivityIndicator />),
  };

  render(
    <Provider store={store}>
      <Router
        routes={routes}
        history={browserHistory}
        render={applyRouterMiddleware(useFetch(options))} />
    </Provider>,
    container
  );
}
```

In the example above we replace the last view rendered while data for the next view is being fetched.

If you prefer to keep the last view rendered, but still render some indication of background activity:

* Listen to store changes in your component (e.g. using `connect` from
`react-redux`) and create a specific reducer that listens to `FETCH_REQUEST` and `FETCH_SUCCESS` from Redux Fetch to toggle the visibility of your activity indicator.

* Listen to store changes in your component and use the selectors exported by Redux Fetch (i.e. `getIsPending` and/or `getIsLoading`) to toggle the visibility of your activity indicator.

* Latch on to the render callbacks to mount/unmount a component in a separate DOM node (feels wrong, but it should work too):

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { applyRouterMiddleware, browserHistory, Router } from 'react-router';
import { useFetch } from '@flowio/redux-fetch';
import { ActivityIndicator } from './app/components';
import configureStore from './app/configureStore';
import configureRoutes from './app/configureRoutes';

// Render the app client-side to a given container element:
export default (container) => {
  const store = configureStore(window.__INITIAL_STATE___);
  const routes = configureRoutes();
  const options = {
    renderLoading: () => {
      // or create and element and destroy it later
      const mountNode = document.querySelector('...');
      ReactDOM.render(<ActivityIndicator />, mountNode);
    },
    renderSuccess: (children) => {
      const mountNode = document.querySelector('...');
      ReactDOM.unmountComponentAtNode(mountNode);
      return children;
    },
  };

  render(
    <Provider store={store}>
      <Router
        routes={routes}
        history={browserHistory}
        render={applyRouterMiddleware(useFetch(options))} />
    </Provider>,
    container
  );
}
```
