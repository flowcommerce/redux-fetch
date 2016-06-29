# react-router-redux-fetch

> Universal data fetching bindings for React, React Router, and Redux.

## Installation

This package requires **React 0.14 or later**.

```
npm install --save @flowio/react-router-redux-fetch
```

This assumes that you’re using [npm](http://npmjs.com/) package manager with a module bundler like [Webpack](http://webpack.github.io) or [Browserify](http://browserify.org/) to consume [CommonJS modules](http://webpack.github.io/docs/commonjs.html).

## Usage

The most important files are listed here, but look in the example for some extra stuff.

### Decorate route components

```js
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetch } from '@flowio/react-router-redux-fetch';
import { getSomething, getSomethingElse } from 'actions/things';

function mapStateToProps() { /* ... */ }

function mapDispatchToProps() { /* ... */ }

function getInitialAsyncState(dispatch/*, state */) {
  return Promise.all([
    dispatch(getSomething()),
    dispatch(getSomethingElse()),
  ]);  
}

@fetch(getInitialAsyncState)
@connect(mapStateToProps, mapDispatchToProps)
class MyRouteHandler extends Component {
  render() {
    return <div>...</div>;
  }
}
```

### Handle server-side rendering

```js
import React from 'react';
import { renderToString } from 'react-dom/server';
import { RouterContext, createMemoryHistory, match } from 'react-router';
import { Provider } from 'react-redux';
// Module defined above to create store with combined `fetchReducer`
import configureStore from './utilities/configureStore';

// You application's routes
import routes from './routes';

// Render the app server-side for a given path:
export default path => new Promise((resolve, reject) => {
  const store = configureStore();

  // Set up history for React Router:
  const history = createMemoryHistory(path);

  // Match routes based on history object:
  match({ routes, history }, (error, redirectLocation, renderProps) => {
    // Get array of route handler components:
    const { components } = renderProps;

    // Wait for async data fetching to complete, then render:
    fetchRouteData(store, components)
      .then(() => {
        const state = getState();
        const html = renderToString(
          <Provider store={store}>
            <RouterContext {...renderProps} />
          </Provider>
        );

        resolve({ html, state });
      })
      .catch(reject);
  });
});
```

### Handle client-side rendering

```js
import React from 'react';
import { render } from 'react-dom';
import { Router, browserHistory } from 'react-router';
import { Provider } from 'react-redux';
// Module defined above to create store with combined `fetchReducer`
import configureStore from './utilities/configureStore';
// You application routes
import routes from './routes';

// Render the app client-side to a given container element:
export default container => {
  // Your server rendered response needs to expose the state of the store, e.g.
  // <script>
  //   window.INITIAL_STATE = <%- JSON.stringify(state) %>
  // </script>
  const store = configureStore(window.INITIAL_STATE);

  // Render app with Redux and router context to container element:
  render((
    <Provider store={store}>
      <Router history={browserHistory} routes={routes} />
    </Provider>
  ), container);
};
```

## API

### `fetch(getInitialAsyncState[, options])`

**You must decorate your route components with this higher order component for fetching to work.**

A higher order component (HOC) that renders a React component after fetching the data requirements for a Redux store.

#### Arguments

* `getInitialAsyncState(dispatch, state): Promise`: A function whose result must be a promise that is resolved when the store is updated with the data requirements to render the wrapped React component.

* `[options]`: If specified, further customizes the behavior of the fetcher instance.

  - `[forceInitialFetch = false]`: By default, the fetch component assumes the store will be rehydrated from data bootstrapped on the server response on first render and will prevent sending requests to the server until the next route change. If you instead wanted to force requests even if the store was rehydrated or you are not building an isomorphic application, you can use the `forceInitialFetch` boolean property.    

  - `[renderLoading = () => <Spinner />]`: By default, an activity indicator is rendered while fetching data, which often happens when the page loads or route changes. If you want to define you own component, use this option to define a function that returns a React element to be rendered instead. You may also define a function that returns `null` to avoid rendering anything (not recommended).

  - `[renderFailure = (error) => <Glitch />]`: By default, an error message is rendered when an uncaught error occurs while fetching data. Typically you would handle fetch errors by updating the Redux store state, but you may choose to leverage this option to separate the concerns. If you want to define your own component, use this option to return a React element to be rendered instead. The function will receive the uncaught error as an argument. You may also define a function that returns `null` to avoid rendering anything (not recommended).

### `fetch.setup(options)`

A function that allows you configure the behavior of future fetchers.

For details on the `options` available for `fetch.setup()`, see [`fetch()`](#fetchgetinitialasyncstateoptions).

All subsequent `fetch` calls will use the new settings, unless overridden by the individual calls.

It's recommended that you call this function before decorating your components.


### `fetchRouteData(store, components)`

An utility that is usually used on the server-side to fetch the data requirements before rendering matched route components.

## Related projects

- [Redux Prefetch](https://github.com/makeomatic/redux-prefetch) by [@v_aminev](https://twitter.com/v_aminev)
- [Redial](https://github.com/markdalgleish/redial) by [@markdalgleish](https://twitter.com/markdalgleish)
- [React Resolver](https://github.com/ericclemmons/react-resolver) by [@ericclemmons](https://twitter.com/ericclemmons)
- [React Transmit](https://github.com/RickWong/react-transmit) by [@rygu](https://twitter.com/rygu)
- [AsyncProps for React Router](https://github.com/rackt/async-props) by [@ryanflorence](https://twitter.com/ryanflorence)
- [GroundControl](https://github.com/raisemarketplace/ground-control) by [@nickdreckshage](https://twitter.com/nickdreckshage)
- [React Async](https://github.com/andreypopp/react-async) by [@andreypopp](https://twitter.com/andreypopp)

## License

[MIT License](https://github.com/flowcommerce/react-router-redux-fetch/blob/master/LICENSE)
