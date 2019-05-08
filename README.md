# Redux Fetch

[![Build Status][travis-image]][travis-url]
[![NPM Version][npm-image]][npm-url]
[![Downloads][downloads-image]][downloads-url]
[![Greenkeeper badge](https://badges.greenkeeper.io/flowcommerce/redux-fetch.svg)](https://greenkeeper.io/)

Redux Fetch provides universal data fetching bindings for applications built with React, React Router, and Redux. It relies on promises implemented in your application to determine whether the state to render route components matching a location is fulfilled.

## Installation

Install the correct versions of each package, which are listed by the command:

```bash
npm info "@flowio/redux-fetch" peerDependencies
```

Linux / OSX users can simply run:

```bash
npm info "@flowio/redux-fetch@latest" peerDependencies --json | command sed 's/[\{\},]//g ; s/: /@/g' | xargs npm install --save "@flowio/redux-fetch@latest"
```

Windows users can either install all the peer dependencies manually, or use the `install-peerdeps` cli tool.

```bash
npm install -g install-peerdeps
install-peerdeps @flowio/redux-fetch
```

This assumes that you’re using [npm][npm] package manager with a module bundler like [Webpack][webpack] or [Browserify][browserify] to consume [CommonJS modules][commonjs-modules].

## Usage

### Configure Redux store with Redux Fetch

The first thing that you have to do is give the Redux Fetch reducer to Redux. You will only have to do this once, no matter how many fetch containers your application uses.

```javascript
import { createStore, combineReducers } from 'redux';
import { reducer as fetchReducer } from '@flowio/redux-fetch';

const reducer = combineReducers({
  // ...Your other reducers here
  fetch: fetchReducer,
});

export default function configureStore(initialState) {
  return createStore(reducer, initialState);
}
```

### Configure route components to fetch required data before rendering

Decorate your route components with `withFetch()` and provide a function that returns a promise that is settled after the application state is updated with the data required before rendering them.

```js
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withFetch } from '@flowio/redux-fetch';
import { fetchOneThing, fetchTwoThings } from './app/actions';
import { getThings } from './app/selectors';
import { ThingComponent } from './app/components';

const fetchAsyncState = (dispatch/*, getState, routerState */) => Promise.all([
  dispatch(fetchOneThing()),
  dispatch(fetchTwoThings()),
]);

const mapStateToProps = (state) => ({
  things: getThings(state),
});

const enhance = compose(
  withFetch(fetchAsyncState),
  connect(mapStateToProps),
);

export default enhance(ThingComponent);
```

### Configure server-side rendering

On the server side you should match the routes to a location, fulfill data requirements, and finally render.

```js
import React from 'react';
import { renderToString } from 'react-dom/server';
import { match, RouterContext } from 'react-router';
import { Provider } from 'react-redux';
import { fetchRouteData, FetchRootContainer } from '@flowio/redux-fetch';
import store from './app/store';
import routes from './app/routes';

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

### Configure client-side rendering

On the client-side you should use the `useFetch` router middleware and rehydrate the Redux store with the state from the server.

```js
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { applyRouterMiddleware, browserHistory, Router } from 'react-router';
import { useFetch } from '@flowio/redux-fetch';
import configureStore from './app/configureStore';
import configureRoutes from './app/configureRoutes';

// Render the app client-side to a given container element:
export default (container) => {
  // Your server rendered response needs to expose the state of the store, e.g.
  // <script>
  //   window.__INITIAL_STATE___ = JSON.stringify(state);
  // </script>
  const store = configureStore(window.__INITIAL_STATE___);
  const routes = configureRoutes();

  render(
    <Provider store={store}>
      <Router
        routes={routes}
        history={browserHistory}
        render={applyRouterMiddleware(useFetch())} />
    </Provider>,
    container
  );
}
```

## API Reference

### `withFetch(fetchAsyncState)`

A higher-order component that lets route components encode their data requirements.

#### Arguments

* `fetchAsyncState(dispatch: Function, getState: Function, routerState: RouterState): Promise`: A function that returns a promise that is resolved when the Redux store is updated with the data required to render the decorated component or rejected otherwise.

	The three arguments passed to the `fetchAsyncState` function are:

	- `dispatch`: A dispatcher used to broadcast payloads to change the application state.

	- `getState`: A function that returns the current state tree of your application.

	- `routerState`: Properties normally injected into `RouterContext` that represent the current state of a router.

#### Returns

A React component class that renders your component.

#### Static Properties

All the original static properties of your component are hoisted.

#### Static Methods

* `fetchAsyncState`: The function passed to `withFetch()` to resolve data requirements for your component.

All the original static methods of your component are hoisted.

#### Remarks

* It needs to be invoked two times. The first time with its arguments as described above, and a second time, with the component: `withFetch(fetchAsyncState)(MyComponent)`.

* It does not modify the passed React component. It returns a new component that you should use instead.

* The static `fetchAsyncState` function is used to resolve the data required before rendering the matched route components for a location.

### `FetchRootContainer`

A React component that attempts to fulfill the data required in order to render matched route components in the component hierarchy below.

#### Props

* `routerProps: RouterState`: The React Router properties normally injected into `RouterContext` that represent the current state of the router.

* `[forceInitialFetch: Boolean]`: If supplied and set to `true`, a request for data will always be made to the server regardless of whether data on the client is available to immediately fulfill the data requirements.

* `[renderLoading: Function]`: Redux Fetch renders the loading state whenever it cannot immediately fulfill data needed to render. By default, nothing is rendered while loading data for the initial render. If a previous component was fulfilled and rendered, the default behavior is to continue rendering the previous view. You can change this behavior by supplying the `renderLoading` property. A `renderLoading` callback can simulate the default behavior by returning `undefined`. Notice that this is different from a `renderLoading` callback that returns `null`, which would render nothing whenever data is loading, even if there was a previous view rendered.

* `[renderFailure: Function]`: If an error occurs that prevents Redux Fetch from fetching the data required for rendering a component, nothing will be rendered by default. Error handling behavior can be configured by supplying a callback to the `renderFailure` property. The `renderFailure` callback is called with the error.

* `[renderSuccess: Function]`: When all data necessary to render becomes available, Redux Fetch will render the matched route components by default. However, you can change this behavior by supplying a callback to the `renderSuccess` property. The `renderSuccess` callback is called with the `children` to be rendered.

#### Remarks

* Views returned by `renderLoading`, `renderFailure`, and `renderSuccess` are rendered outside the router context.

* Typically, you will not use the `renderSuccess` callback. It's exposed in case you need to hack something together.

### `useFetch([options])`

A React Router middleware that attempts to fulfill the data required in order to render matched decorated route components in the component hierarchy below.

#### Arguments

* `[options: Object]`: Same options available for `FetchRootContainer` as props with the exception of `routerProps` since it can be inferred.

### `fetchRouteData(routerProps)`

An asynchronous action creator that fetches the data required before rendering matched route components when dispatched.

The arguments you should inject into `fetchRouteData` are:

  - `routerProps: RouterState`: Properties normally injected into `RouterContext` that represent the current state of a router.

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

[MIT License][mit]

[browserify]: http://browserify.org/
[commonjs-modules]: http://webpack.github.io/docs/commonjs.html
[mit]: https://github.com/flowcommerce/redux-fetch/blob/master/LICENSE
[npm]: http://npmjs.com/
[npm-image]: https://img.shields.io/npm/v/@flowio/redux-fetch.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/@flowio/redux-fetch
[downloads-image]: https://img.shields.io/npm/dm/redux-fetch.svg?style=flat-square
[downloads-url]: https://www.npmjs.com/package/@flowio/redux-fetch
[travis-image]: https://img.shields.io/travis/flowcommerce/redux-fetch/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/flowcommerce/redux-fetch
[webpack]: http://webpack.github.io
