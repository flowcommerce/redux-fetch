# Server Rendering

On the server side you will need to match the routes to a location, fulfill data
requirements, and finally render.

```javascript
import React from 'react';
import { renderToString } from 'react-dom/server';
import { match, RouterContext } from 'react-router';
import { Provider } from 'react-redux';
import { fetchRouteData, FetchRootContainer } from '@flowio/redux-fetch';
import routes from './app/routes';
import store from './app/store';

// Render the application server-side for a given path:
export default (location) => {
  return new Promise((resolve, reject) => {
    // Match routes to a location
    match({ routes, location }, (matchError, redirectLocation, renderProps) => {
      // Fulfill data requirements
      store.dispatch(fetchRouteData(renderProps)).then(() => {
        // Initial state passed to the client-side
        const state = store.getState();

        const html = renderToString(
          <Provider store={store}>
            <FetchRootContainer routerProps={renderProps}>
              <RouterContext {...renderProps} />
            </FetchRootContainer>
          </Provider>
        );

        resolve({ html, state });
      });
    });
  });
}
```
