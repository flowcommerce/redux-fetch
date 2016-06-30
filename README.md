# redux-fetch

> Universal data fetching bindings for React, React Router, and Redux.

## Installation

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
// Your application's actions
import { getSomething, getSomethingElse } from './actions';

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
import { createStore, applyMiddleware, compose } from 'redux'
import { Provider } from 'react-redux';
import reduxThunk from 'redux-thunk';
import { fetchRouteData } from '@flowio/redux-fetch';
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
    // Get array of route handler components:
    const { components } = renderProps;

    // Wait for async data fetching to complete, then render:
    fetchRouteData(store, components).then(() => {
      const state = getState();
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

A higher order component that renders a React component after fetching the data requirements for a Redux store.

#### Arguments

* `getInitialAsyncState(dispatch, state): Promise`: A function whose result must be a promise that is resolved when the store is updated with the data requirements to render the wrapped React component.

* `[options]`: If specified, further customizes the behavior of the fetcher instance.

  - `[forceInitialFetch = false]`: By default, the fetch component assumes the store will be rehydrated from data bootstrapped on the server response on first render and will prevent sending requests to the server until the next route change. If you instead wanted to force requests even if the store was rehydrated or you are not building an isomorphic application, you can use the `forceInitialFetch` boolean property.    

  - `[renderLoading = () => <Spinner />]`: By default, an activity indicator is rendered while fetching data, which often happens when the page loads or route changes. If you want to define you own component, use this option to define a function that returns a React element to be rendered instead. You may also define a function that returns `null` to avoid rendering anything (not recommended).

  - `[renderFailure = (error) => <Glitch />]`: By default, an error message is rendered when an uncaught error occurs while fetching data. Typically you would handle fetch errors by updating the Redux store state, but you may choose to leverage this option to separate the concerns. If you want to define your own component, use this option to return a React element to be rendered instead. The function will receive the uncaught error as an argument. You may also define a function that returns `null` to avoid rendering anything (not recommended).

#### Returns

A React component class that renders your component according to the specified options.

##### Static Properties

All the original static properties of the component are hoisted.

##### Static Methods

* `getInitialAsyncState`: The function passed to `fetch()` to resolve data requirements for your component.

All the original static methods of the component are hoisted.

##### Remarks

* It needs to be invoked two times. The first time with its arguments described above, and a second time, with the component: `fetch(getInitialAsyncState, options)(MyComponent)`.

* It does not modify the passed React component. It returns a new, connected component, that you should use instead.

* The static `getInitialAsyncState` function is used by `fetchRouteData()` to resolve the data requirements for the matched route components.

### `fetch.setup(options)`

A function that allows you configure the behavior of fetchers globally. For details on the `options` available for `fetch.setup()`, see `fetch()` above.

#### Remarks

* It will modify the behavior of fetcher components that are not mounted. Therefore, if you import a fetcher component returned by `fetch()` and then call `fetch.setup()` it will still change the behavior of that component.

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

[MIT License](https://github.com/flowcommerce/redux-fetch/blob/master/LICENSE)
