[![Build Status](https://travis-ci.org/flowcommerce/redux-fetch.svg?branch=master)](https://travis-ci.org/flowcommerce/redux-fetch)

# Redux Fetch

Redux Fetch provides universal data fetching bindings for applications built with React, React Router, and Redux.

## Installation

Redux Fetch requires **React 15** and **React Router 2**.

```
npm install --save @flowio/redux-fetch
```

This assumes that you’re using [npm](http://npmjs.com/) package manager with a module bundler like [Webpack](http://webpack.github.io) or [Browserify](http://browserify.org/) to consume [CommonJS modules](http://webpack.github.io/docs/commonjs.html).

## Usage

### Configure components to fetch required data before rendering

You must decorate your components with `fetch()` and provide a function that returns a promise that is settled after the application state is updated with the data required before rendering them.

```js
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetch } from '@flowio/redux-fetch';
import { getExamples } from './path/to/async/action/example';

function getAsyncState(dispatch /* getState, routerState */) {
  return dispatch(getExamples());
}

function mapStateToProps(state) {
  return state.examples;
}

@fetch(getAsyncState)
@connect(mapStateToProps)
export default class Container extends Component {
  /* ... */
}
```

### Configure server-side rendering

On the server side you will need to match the routes to a location, fulfill data requirements, and finally render.

```js
import React from 'react';
import { renderToString } from 'react-dom/server';
import { match, RouterContext } from 'react-router';
import { Provider } from 'react-redux';
import { fetchAsyncState, FetchProvider } from '@flowio/redux-fetch';
import configureStore from './path/to/configure/store';
import routes from './path/to/routes';

// Render the application server-side for a given path:
export default (location) => {
  return new Promise((resolve, reject) => {
    const store = configureStore();

    // Match routes to a location
    match({ routes, location }, (matchError, redirectLocation, renderProps) => {
      // Fulfill data requirements
      fetchAsyncState(store, renderProps).then(() => {
        // Initial state passed to the client-side
        const state = store.getState();

        const html = renderToString(
          <Provider store={store}>
            <FetchProvider routerProps={renderProps}>
              <RouterContext {...renderProps} />
            </FetchProvider>
          </Provider>
        );

        resolve({ html, state });
      });
    });
  });
}
```

### Configure client-side rendering

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

* `getAsyncState(dispatch, getState, routerState): Promise`: A function whose result must be a promise that is resolved when the Redux store is updated with the data required to render the React component or rejected otherwise.

	The three arguments passed to the `getAsyncState` function are:

	- `dispatch`: A dispatcher used to broadcast payloads to change the application state.

	- `getState`: A function that returns the current state tree of your application.

	- [`routerState`](https://github.com/reactjs/react-router/blob/master/docs/Glossary.md#routerstate): Properties normally injected into `RouterContext` that represent the current state of a router.

* `[options: Object]`: If specified, further customizes the behavior of the container.

  - `[renderLoading: Function]`: Redux Fetch renders the loading state whenever it cannot immediately fulfill data needed to render. By default, nothing is rendered while loading data for the initial render. If a previous component was fulfilled and rendered, the default behavior is to continue rendering the previous view. You can change this behavior by supplying the `renderLoading` property. A `renderLoading` callback can simulate the default behavior by returning `undefined`. Notice that this is different from a `renderLoading` callback that returns `null`, which would render nothing whenever data is loading, even if there was a previous view rendered.

  - `[renderFailure(error): Function]`: If an error occurs that prevents Redux Fetch from fetching the data required for rendering a component, nothing will be rendered by default. Error handling behavior can be configured by supplying a callback to the `renderFailure` property. The `renderFailure` callback is called with an error object.

#### Returns

A React component class that renders your component according to the specified options.

##### Static Properties

All the original static properties of the component are hoisted.

##### Static Methods

* `getAsyncState`: The function passed to `fetch()` to resolve data requirements for your component.

All the original static methods of the component are hoisted.

#### Remarks

* It needs to be invoked two times. The first time with its arguments described above, and a second time, with the component: `fetch(getAsyncState, options)(MyComponent)`.

* It does not modify the passed React component. It returns a new component that you should use instead.

* The static `getAsyncState` function is used to resolve the data required before rendering the matched route components for a location.

### `FetchProvider`

A React component that provides the context needed for containers created with `fetch()` in the component hierarchy below to perform their expected behavior.

#### Props

* `[aggregator: Function]`: A function responsible for fulfilling the data requirements for components matched to a location. The application store and router state will be injected into the function when called and it should return a promise that is settled after fetching the required data.

* `[forceInitialFetch: Boolean]`: By default, the component assumes the store will be rehydrated from data bootstrapped on the server response on first render and will prevent sending requests to the server until the next route change. If you instead wanted to force requests even if the store was rehydrated, you can use the `forceInitialFetch` boolean property.

* `routerProps: RouterState`: The React Router properties normally injected into `RouterContext` that represent the current state of the router.

* `[renderLoading: Function]`: Similar to the `renderLoading` property passed to `fetch()`. You should define this property if you want to propagate the same behavior on *all* containers created with `fetch()` in the component hierarchy below.

* `[renderFailure: Function]`: Similar to the `renderFailure` property passed to `fetch()`. You should define this property if you want to propagate the same behavior on *all* containers created with `fetch()` in the component hierarchy below.

#### Remarks

* You should only set `forceInitialFetch` to `true` on the client-side.

* Providing a render callback to `fetch()` will take precedence over render callbacks injected to `FetchProvider`.

### `fetchAsyncState(store, routerState)`

An utility that you would normally use on the server-side to fetch the data required before rendering matched route components.

The three arguments you should inject into the `fetchAsyncState` are:

  - `store`: A Redux store instance that will be hydrated with the application state before rendering you route components.

  - `routerState`: Properties normally injected into `RouterContext` that represent the current state of a router.


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
