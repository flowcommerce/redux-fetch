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

### Combine fetch reducer and add to store

```js
import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import { fetchReducer } from '@flowio/react-router-redux-fetch';
import reduxThunk from 'redux-thunk';

// You application's reducers
import reducers from './reducers';

const combinedReducers = combineReducers({
  ...reducers,
  fetching: fetchReducer,
}));

const enhancer = compose(applyMiddleware(reduxThunk));

export default function configureStore(initialState = {}) {
  return createStore(combinedReducers, initialState, enhancer);
}
```

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

### `fetch(getInitialAsyncState)(RouteComponent[, ActivityIndicator])`

**You must decorate your route components with this higher order component for fetching to work.**

A higher order component (HOC) that fetches the data requirements for the application state before rendering its wrapped `RouteComponent`. By default, it renders a `ActivityIndicator` provided by the library while fetching data. You may pass your own `ActivityIndicator` or set it to `null` to prevent rendering anything (not recommended).

The `getInitialAsyncState` function receives the store's `dispatch` and `state` when called and should return a promise that is resolved when the store is hydrated with the data requirements to render the `RouteComponent`. The returned promise should handle all errors that occur while fetching, usually by reducing them into the application via error action types.

### `fetch.setup(options)`

**You must call this function before decorating your components with `fetch`.**

A function that allows you to globally configure the behavior for `fetch`.

The `options` argument can have the following properties:

* `activityIndicator` - By default, the library provides a spinner component to render while fetching data. If you want to provide your own, use this option to define a different component to be rendered instead.

* `selectFetchingState` - By default, the library expects to find the fetching state at `state.fetching`. If you want to put the fetching state elsewhere, use this option to define a selector function to access the fetching state.

### `fetchReducer()`

**You must add this reducer to your store for fetching to work.**

A reducer function that stores fetching updates. If you use `combineReducers`, it should be nested under the `fetching` key.

### `fetchRouteData(store, components)`

An utility that is usually used on the server-side to fetch the data requirements before rendering matched route components.

### `@@fetch/VALIDATE`

An action type that is dispatched from `fetchRouteData` to indicate the initial store state will be
hydrated using data sent down from the server-side. It's internally used to prevent route components from fetching the route data again on first render.

### `@@fetch/INVALIDATE`

An action type that is dispatched from `fetch` to indicate the initial store state has been hydrated using data sent down from the server-side. It's internally used to indicate that subsequent mounts of route components should fetch data from the server-side before rendering.

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
