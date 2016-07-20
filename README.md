# redux-fetch

> Universal data fetching bindings for React, React Router, and Redux.

## Installation

Redux Fetch requires **React 15 or later**.

```
npm install --save @flowio/redux-fetch
```

This assumes that you’re using [npm](http://npmjs.com/) package manager with a module bundler like [Webpack](http://webpack.github.io) or [Browserify](http://browserify.org/) to consume [CommonJS modules](http://webpack.github.io/docs/commonjs.html).

## Usage

The most important files are listed here, but look in the `./examples` directory for some additional information.

### Decorate route components

```js
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetch } from '@flowio/redux-fetch';
// Your application's asynchronous actions
import { getSomething, getSomethingElse } from './actions';

function getAsyncState(dispatch/*, state, ownProps */) {
  return Promise.all([
    dispatch(getSomething()),
    dispatch(getSomethingElse()),
  ]);  
}

function mapStateToProps(state) {
  return state.something;
}

@fetch(getAsyncState)
@connect(mapStateToProps)
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
import { createStore, applyMiddleware, compose } from 'redux'
import { Provider } from 'react-redux';
import reduxThunk from 'redux-thunk';
import { fetchAsyncStateOnServer } from '@flowio/redux-fetch';
// Your application's reducers
import reducers from './reducers';
// Your application's routes
import routes from './routes';

// Set up Redux to handle asynchronous actions with Redux Thunk.
const enhancer = compose(applyMiddleware(reduxThunk));

// Render the app server-side for a given path:
export default path => new Promise((resolve, reject) => {
  const initialState = {};
  const store = createStore(reducers, initialState, enhancer)
  // Set up history for React Router:
  const history = createMemoryHistory(path);

  // Match routes based on history object:
  match({ routes, history }, (error, redirectLocation, renderProps) => {
    // Wait for async data fetching to complete, then render:
    fetchAsyncStateOnServer(store, renderProps.components, {
      location: renderProps.location,
      params: renderProps.params,
    }).then(() => {
      const state = store.getState();
      const html = renderToString(
        <Provider store={store}>
          <RouterContext {...renderProps} />
        </Provider>
      );

      resolve({ html, state });
    }).catch(reject);
  });
});
```

### Handle client-side rendering

```js
import React from 'react';
import { render } from 'react-dom';
import { Router, browserHistory } from 'react-router';
import { createStore, applyMiddleware, compose } from 'redux'
import { Provider } from 'react-redux';
import { fetch } from '@flowio/redux-fetch';
import reduxThunk from 'redux-thunk';
// Your application's reducers
import reducers from './reducers';
// Your application's routes
import routes from './routes';

// Set up Redux to handle asynchronous actions with Redux Thunk.
const enhancer = compose(applyMiddleware(reduxThunk));

// Render the app client-side to a given container element:
export default container => {
  // Your server rendered response needs to expose the state of the store, e.g.
  // <script>
  //   window.INITIAL_STATE = <%- JSON.stringify(state) %>
  // </script>
  const initialState = window.INITIAL_STATE;
  const store = createStore(reducers, initialState, enhancer)

  // Configure all fetchers to avoid fetching on first render.
  fetch.setup({
    shouldFetchBeforeMount: () => {
      if (window.INITIAL_STATE) {
        delete window.INITIAL_STATE;
        return false;
      }

      return true;
    }
  });  

  // Render app with Redux and router context to container element:
  render((
    <Provider store={store}>
      <Router history={browserHistory} routes={routes} />
    </Provider>
  ), container);
};
```

## API Reference

### `fetch(getAsyncState[, options])`

**You must decorate your route components with this higher order component for fetching to work.**

A higher order component that attempts to fulfill the data required in order to render an instance of a React component for a React Router route.

#### Arguments

* `getAsyncState(dispatch, state, ownProps): Promise`: A function whose result must be a promise that is resolved when the Redux store is updated with the data requirements to render the wrapped React component.

	The three arguments passed to the `getAsyncState` function are:

	- `dispatch`: The store's dispatch function. Usually, it is used to dispatch actions to hydrate your application state.

	- `state`: The current state tree of your application.

	- `ownProps`: On the client-side, its value will be the props injected to your component, usually by React Router. However, on the server-side, its value is the `params` argument injected to `fetchAsyncStateOnServer()`.

	> Note: The React Router props on the server-side differ slightly from those passed to the route components rendered on the client-side. You should refer to the React Router docs for more information.

* `[options: Object]`: If specified, further customizes the behavior of the fetcher instance.

  - `[renderLoading: Function]`: When data requirements have yet to be fulfilled, `renderLoading` is called to render the component. If this returns `undefined`, the previously rendered component (or nothing if there is no previous component) is rendered.

  - `[renderFetched(props): Function]`: When all data requirements are fulfilled, `renderFetched` is called to render the component. The function will receive the `props` injected by its parent component.

  - `[renderFailure(error): Function]`: When data requirements failed to be fulfilled, `renderFailure` is called to render the component. The function will receive the `error` received while attempting to fetch data requirements.

  - `[shouldFetchBeforeMount(ownProps, state): Function]`: By default, the application state for your React component will be fetched before the component is mounted, except on the server where you are expected to use `fetchAsyncStateOnServer` to prepare your application state. If you want to change this behavior, use this option to define a function that returns a boolean value indicating whether data should be fetched instead. The function will receive the component's own `props` and current application `state` when called.

  - `[shouldFetchBeforeUpdate(prevProps, nextProps, state): Function]`: By default, the application state for your React component will be fetched when the component is updated only if the location differ. If you want to change this behavior, use this option to define a function that returns a boolean value indicating whether data should be fetched instead. The function will receive the `prevProps`, and `nextProps` passed to your component before updating and the current application `state`.

#### Returns

A React component class that renders your component according to the specified options.

##### Static Properties

All the original static properties of the component are hoisted.

##### Static Methods

* `getAsyncState`: The function passed to `fetch()` to resolve data requirements for your component.

All the original static methods of the component are hoisted.

##### Remarks

* It needs to be invoked two times. The first time with its arguments described above, and a second time, with the component: `fetch(getAsyncState, options)(MyComponent)`.

* It does not modify the passed React component. It returns a new, connected component, that you should use instead.

* The static `getAsyncState` function is used by `fetchAsyncStateOnServer()` to resolve the data requirements for the matched route components.

* Sometimes you would handle fetch errors by updating the Redux store state, but you may choose to leverage the `renderFailure` option to separate the concerns.

### `fetch.setup(options)`

A function that allows you to configure the behavior of fetchers globally. For details on the `options` available for `fetch.setup()`, see `fetch()` above.

#### Remarks

* It will modify the behavior of fetcher components that are not mounted. Therefore, if you import a fetcher component returned by `fetch()` and then call `fetch.setup()` it will still change the behavior of that component.

### `fetchAsyncStateOnServer(store, components, params)`

An utility that you should use on the server-side to fetch the data requirements before rendering matched route components.

The three arguments you should pass to the `fetchAsyncStateOnServer` are:

  - `store`: A Redux store instance that should be hydrated with the application state before rendering you route components.

  - `components`: Matched route components for a specific location. `fetchRouterData` will iterate through these components, calling the `getAsyncState` function assigned to them with `fetch()` to update your application state.

  - `params`: Parameters passed as `ownProps` to the `getAsyncState` function.

## Acknowledgments

This project, while far less complex, was inspired and borrows some of [Relay's](https://facebook.github.io/relay/) concepts.

## Related projects

- [Redux Prefetch](https://github.com/makeomatic/redux-prefetch) by [@v_aminev](https://twitter.com/v_aminev)
- [Redial](https://github.com/markdalgleish/redial) by [@markdalgleish](https://twitter.com/markdalgleish)
- [React Resolver](https://github.com/ericclemmons/react-resolver) by [@ericclemmons](https://twitter.com/ericclemmons)
- [React Transmit](https://github.com/RickWong/react-transmit) by [@rygu](https://twitter.com/rygu)
- [AsyncProps for React Router](https://github.com/rackt/async-props) by [@ryanflorence](https://twitter.com/ryanflorence)
- [GroundControl](https://github.com/raisemarketplace/ground-control) by [@nickdreckshage](https://twitter.com/nickdreckshage)
- [React Async](https://github.com/andreypopp/react-async) by [@andreypopp](https://twitter.com/andreypopp)

## License

[MIT License](https://github.com/flowcommerce/redux-fetch/blob/master/LICENSE)
