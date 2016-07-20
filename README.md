# redux-fetch

> Universal data fetching bindings for React, React Router, and Redux.

## Installation

Redux Fetch requires **React 15 or later** and **React Router 2 or later**.

```
npm install --save @flowio/redux-fetch
```

This assumes that you’re using [npm](http://npmjs.com/) package manager with a module bundler like [Webpack](http://webpack.github.io) or [Browserify](http://browserify.org/) to consume [CommonJS modules](http://webpack.github.io/docs/commonjs.html).

## Usage

Quick usage tutorial for getting up to speed with Redux Fetch.

### Configure Redux store to handle async action creators

It's really up to you how you want to handle asynchronous actions with Redux. For this tutorial, we will configure our store to use `redux-thunk` middleware, but there are other packages you can use instead (e.g. `redux-promise`).

```js
import { createStore, compose, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';
import rootReducer from './path/to/reducers';

const enhancer = compose(applyMiddleware(reduxThunk));

export default function configureStore(initialState = {}) {
  return createStore(rootReducer, initialState, enhancer);
}
```

### Create asynchronous action creators that fetch required data for containers

For this tutorial, we are going to return the `fetch` promise in our action creators so that we can use it to figure out when the fetched data was reduced into the store.

```js
import checkStatus from 'fetch-check-http-status';

export const getExamples = () => (dispatch) =>
  fetch('https://www.api.example.com/examples')
  .then(checkStatus)
  .then(response => response.json())
  .then(json => dispatch({ type: 'GET_EXAMPLES_SUCCESS', payload: json }))
  .catch(error => dispatch({ type: 'GET_EXAMPLES_FAILURE', payload: error }));
```

### Configure components to fetch required data before rendering

You must decorate your components with `fetch()` to indicate how to fulfill their data requirements. The `getAsyncState` function passed to `fetch()` must return a promise that is resolved when the required data is fulfilled. In the example below we are returning the promise returned by our `getExamples` action creator above.

```js
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetch } from '@flowio/redux-fetch';
import { getExamples } from './path/to/async/action/example';

function getAsyncState(dispatch /* getState, renderProps */) {
  return dispatch(getExamples());
}

function mapStateToProps(state) {
  return state.examples;
}

@fetch(getAsyncState)
@connect(mapStateToProps)
export default class ExampleComponent extends Component {
  /* ... */
}
```

### Configure server side router rendering

When building isomorphic applications on the server-side you will need to match the routes to a location, fulfill data requirements, and finally render.

```js
import React from 'react';
import { renderToString } from 'react-dom/server';
import { match, RouterContext } from 'react-router';
import { Provider } from 'react-redux';
import { fetchAsyncState, FetchProvider } from '@flowio/redux-fetch';
import configureStore from './path/to/configure/store';
import routes from './path/to/routes';

// Render the app server-side for a given path:
export default (location) => {
  return new Promise((resolve, reject) => {
    const store = configureStore();

    // match routes to a location
    match({ routes, location }, (matchError, redirectLocation, renderProps) => {
      // fulfill data requirements
      fetchAsyncState(store, renderProps).then(() => {
        // initial state passed to the client-side
        const state = store.getState();

        const html = renderToString(
          <Provider store={store}>
            <FetchProvider routerProps={renderProps}>
              <RouterContext {...renderProps} />
            </FetchProvider>
          </Provider>
        );

        resolve({ html, state });
      }).catch(reject);
    });
  });
}
```

### Configure client side router rendering

```js
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, RouterContext, browserHistory } from 'react-router';
import { FetchProvider } from '@flowio/redux-fetch';
import configureStore from './path/to/configure/store';
import routes from './path/to/routes';

// Render the app client-side to a given container element:
export default (container) => {
  // Your server rendered response needs to expose the state of the store, e.g.
  // <script>
  //   window.__INITIAL_STATE___ = JSON.stringify(state);
  // </script>
  const store = configureStore(window.__INITIAL_STATE___);

  render(
    <Provider store={store}>
      <Router
        routes={routes}
        history={browserHistory}
        render={(props) => (
          <FetchProvider routerProps={props}>
            <RouterContext {...props} />
          </FetchProvider>
        )} />
    </Provider>,
    container
  );
}
```

## API Reference

### `fetch(getAsyncState[, options])`

A higher order component that attempts to fulfill the data required in order to render an instance of a React component.

#### Arguments

* `getAsyncState(dispatch, state, props): Promise`: A function whose result must be a promise that is resolved when the Redux store is updated with the data required to render the React component.

	The three arguments passed to the `getAsyncState` function are:

	- `dispatch`: A dispatcher used to broadcast payloads to change the application state.

	- `state`: Current state tree of your application.

	- `props`: Properties normally injected into `RouterContext` that represent the current state of a router. See [RouterState](https://github.com/reactjs/react-router/blob/master/docs/Glossary.md#routerstate).

* `[options: Object]`: If specified, further customizes the behavior of the container.

  - `[renderLoading: Function]`: When data requirements have yet to be fulfilled, `renderLoading` is called to render the component. If this returns `undefined`, the previously rendered component (or nothing if there is no previous component) is rendered.

  - `[renderFetched: Function]`: When all data requirements are fulfilled, `renderFetched` is called to render the component.

  - `[renderFailure(error): Function]`: When data requirements failed to be fulfilled, `renderFailure` is called to render the component. The function will receive the `error` received while attempting to fetch data requirements.

#### Returns

A React component class that renders your component according to the specified options.

##### Static Properties

All the original static properties of the component are hoisted.

##### Static Methods

* `getAsyncState`: The function passed to `fetch()` to resolve data requirements for your component.

All the original static methods of the component are hoisted.

##### Remarks

* It needs to be invoked two times. The first time with its arguments described above, and a second time, with the component: `fetch(getAsyncState, options)(MyComponent)`.

* It does not modify the passed React component. It returns a new component that you should use instead.

* The static `getAsyncState` function is used by `fetchAsyncState()` to resolve the data required before rendering the matched route components for a location.

* Sometimes you would handle fetch errors by updating the Redux store state, but you may choose to leverage the `renderFailure` option to separate the concerns.

### `FetchProvider`

A React component that provides the context needed for containers created with `fetch()`, in the component hierarchy below, to perform their expected behavior.

#### Props

* `aggregator`: A function that is called with the application store and injected router properties every time the router state is updated and should return a promise that is resolved after fulfilling the data requirements for all matched route components or rejected otherwise. All components created with `fetch()` will have a static `getAsyncState` function that should be called to fulfill the data requirements for that component.

* `forceInitialFetch`: By default, the component assumes the store will be rehydrated from data bootstrapped on the server response on first render and will prevent sending requests to the server until the next route change. If you instead wanted to force requests even if the store was rehydrated, you can use the `forceInitialFetch` boolean property. **You should only set this property on the client-side.**.

* `routerProps`: The React Router properties normally injected into `RouterContext` after matching routes to a location.

* `renderLoading`: When data requirements have yet to be fulfilled, `renderLoading` is called to render the component. If this returns `undefined`, the previously rendered component (or nothing if there is no previous component) is rendered. You should define this property if you want to propagate the same behavior on all containers created with `fetch()` in the component hierarchy below.

* `renderFailure`: When data requirements failed to be fulfilled, `renderFailure` is called to render the component. The function will receive the `error` received while attempting to fetch data requirements. You should define this property if you want to propagate the same behavior on all containers created with `fetch()` in the component hierarchy below.

* `renderFetched`: When all data requirements are fulfilled, `renderFetched` is called to render the component. You should define this property if you want to propagate the same behavior on all containers created with `fetch()` in the component hierarchy below.

### `fetchAsyncState(store, props)`

An utility that you would normally use on the server-side to fetch the data required before rendering matched route components.

The three arguments you should inject into the `fetchAsyncState` are:

  - `store`: A Redux store instance that will be hydrated with the application state before rendering you route components.

  - `props`: Properties normally injected into `RouterContext` that represent the current state of a router.


## Acknowledgments

This project, while far less complex, was inspired and borrows some concepts from [Relay](https://facebook.github.io/relay/).

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
