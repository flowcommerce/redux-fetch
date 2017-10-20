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

## Getting Started

### Configure Redux store with Redux Fetch

The first thing that you have to do is give the Redux Fetch reducer to Redux. You will only have to do this once, no matter how many fetch containers your application uses. For more information, consult the [Redux documentation](http://redux.js.org).

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

```javascript
import React from 'react';
import { connect } from 'react-redux';
import { withFetch } from '@flowio/redux-fetch';

import { fetchTeamMatches, fetchTeamProfile } from './app/actions';
import { getTeamMatches, getTeamProfile } from './app/selectors';

function fetchData(dispatch, getState, match) {
  const { teamId } = match.params;
  return Promise.all([
    dispatch(fetchTeamMatches(teamId)),
    dispatch(fetchTeamProfile(teamId))
  ]);
}

function mapStateToProps(state) {
  return {
    matches: getTeamMatches(state),
    profile: getTeamProfile(state),
  };
}

@withFetch(fetchData)
@connect(mapStateToProps)
export default class Team extends React.Component {
  /* ... */
}
```

### Configure routes statically

In order to support server-side rendering your application routes must be configured statically to allow Redux Fetch to determine the data requirements embedded in your route components outside of the React rendering lifecycles.

```javascript
import Home from './app/components/Home';
import Team from './app/components/Team';

export default function configureRoutes() {
  return {
    component: Root,
    routes: [{
      exact: true,
      path: '/',
      component: Home,
    }, {
      path: '/teams/:id',
      component: Team,
    }]
  };
}
```

### Configure server-side rendering

On the server side you should match the routes to a location, fulfill data requirements, and finally render.

```js
import React from 'react';
import { FetchRootContainer, fetchDataForRoutes } from '@flowio/redux-fetch';
import { Provider } from 'react-redux';
import { StaticRouter } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';
import { renderToString } from 'react-dom/server';

import configureStore from './app/configureStore';
import configureRoutes from './app/configureRoutes';

// Render the application server-side for a given path:
export default (location) => {
  const store = configureStore();
  const routes = configureRoutes();
  return new Promise((resolve, reject) => {
    // Match routes to a location and fulfill data requirements
    store.dispatch(fetchDataForRoutes(routes, location)).then(() => {
      // Initial state passed to the client-side
      const state = store.getState();
      const context = {};
      const content = renderToString(
        <Provider store={store}>
          <StaticRouter context={context} location={location}>
            <FetchRootContainer routes={routes}>
              {renderRoutes(routes)}
            </FetchRootContainer>
          </StaticRouter>
        </Provider>
      );
      resolve({ content, context, state });
    });
  });
}
```

### Configure client-side rendering

On the client-side you should rehydrate the Redux store with the state from the server.

```js
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { FetchRootContainer } from '@flowio/redux-fetch';
import { Provider } from 'react-redux';
import { hydrate } from 'react-dom';
import { renderRoutes } from 'react-router-config';

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

  hydrate(
    <Provider store={store}>
      <BrowserRouter>
        <FetchRootContainer routes={routes}>
          {renderRoutes(routes)}
        </FetchRootContainer>
      </BrowserRouter>
    </Provider>,
    container
  );
}
```

## Usage

### Error handling

Redux Fetch uses [`Promise.all`](https://mzl.la/29uN1k8) to wait until data requirements for route components matching a specific location are fulfilled. Therefore, the first rejected promise will indicate that data requirements cannot be fulfilled.

It's up to you to decide what is considered an error in your application. For example, you may choose to reject on API responses that fall outside the 2xx status code range or to never reject and store API errors that occur into the Redux store.

Redux Fetch assumes that the first argument passed into its rejection handler is the error that occured and will store that into your Redux store by dispatching a `@@fetch/FAILURE` action. Therefore, you should aggregate any information you want into the first argument of your rejection.

### Rendering background activity indicators

There are different approaches you can take to render activity indicators in your application.

1. Use the `renderLoading` callback property, which replaces the last view rendered while data for the next view is being fetched.

    ```js
    import React from 'react';
    import { BrowserRouter } from 'react-router-dom';
    import { FetchRootContainer } from '@flowio/redux-fetch';
    import { Provider } from 'react-redux';
    import { hydrate } from 'react-dom';
    import { renderRoutes } from 'react-router-config';

    import ActivityIndicator from './app/components/ActivityIndicator';
    import configureStore from './app/configureStore';
    import configureRoutes from './app/configureRoutes';

    // Render the app client-side to a given container element:
    export default (container) => {
      const store = configureStore(window.__INITIAL_STATE___);
      const routes = configureRoutes();
      hydrate(
        <Provider store={store}>
          <BrowserRouter>
            <FetchRootContainer
              renderLoading={() => <ActivityIndicator />}
              routes={routes}>
              {renderRoutes(routes)}
            </FetchRootContainer>
          </BrowserRouter>
        </Provider>,
        container
      );
    }
    ```


1. Listen to store changes in your component (e.g. using `connect` from `react-redux`) and use the selectors exported by Redux Fetch to toggle the visibility of your activity indicator.

    ```js
    import React from 'react';
    import { connect } from 'react-redux';
    import { getReadyState, ReadyState } from '@flowio/redux-fetch';
    import ActivityIndicator from './app/components/ActivityIndicator';

    function mapStateToProps(state) {
      return {
        fetching: getReadyState()(state) === ReadyState.LOADING,
      }
    }

    @connect(mapStateToProps)
    export default class Application extends React.Component {
      render() {
        return (
          <div>
            {this.props.fetching && (
              <ActivityIndicator />
            )}
          </div>
        );
      }
    }
    ```


1. Listen to store changes in your component (e.g. using `connect` from `react-redux`) and create a specific reducer that listens to actions dispatched from Redux Fetch to toggle the visibility of your activity indicator.

    ```js
    import { ActionType } from '@flowio/redux-fetch';

    const initialState = { fetching: false };

    export default reducer(state = initialState, action) {
      switch (action.type) {
      case ActionType.LOADING:
        return { ...state, fetching: true };
      case ActionType.FULFILLED:
      case ActionType.REJECTED:
      case ActionType.CANCELED:
        return { ...state, fetching: false };
      default:
        return state;
      }
    }
    ```

## API Reference

### `withFetch(fetchData: Function): Function`

A higher-order component that lets route components encode their data requirements.

#### Arguments

* `fetchData(dispatch: Function, getState: Function, match: Object): Promise`: A function that returns a promise that is resolved when the Redux store is updated with the data required to render the decorated component or rejected otherwise.

	The three arguments passed to the `fetchData` function are:

	- `dispatch`: A dispatcher used to broadcast payloads to change the application state.
	- `getState`: A function that returns the current state tree of your application.
	- `match`: An object that contains information about how a route matched the URL.

#### Returns

A React component class that renders your component.

#### Static Properties

* `fetchData`: The function passed to `withFetch()` to resolve data requirements for your component.

All the original static properties of your component are hoisted.

#### Remarks

* It needs to be invoked two times. The first time with its arguments as described above, and a second time, with the component: `withFetch(fetchData)(MyComponent)`.

* It does not modify the passed React component. It returns a new component that you should use instead.

* The static `fetchData` function is used to resolve the data required before rendering the matched route components for a location.

### `<FetchRootContainer />`

A React component that attempts to fulfill the data required in order to render matched route components in the component hierarchy below.

#### Props

* `routes: RouterConfig[]`: The route configuration.

* `[getFetchState: Function]` A function that takes the entire Redux state and returns the state slice which corresponds to where the Redux Fetch reducer was mounted. This functionality is rarely needed, and defaults to assuming that the reducer is mounted under the `fetch` key.

* `[forceFetch: Boolean]`: If supplied and set to `true`, a request for data will always be made to the server regardless of whether data on the client is available to immediately fulfill the data requirements.

* `[renderLoading: Function]`: Redux Fetch renders the loading state whenever it cannot immediately fulfill data needed to render. By default, nothing is rendered while loading data for the initial render. If a previous component was fulfilled and rendered, the default behavior is to continue rendering the previous view. You can change this behavior by supplying the `renderLoading` property. A `renderLoading` callback can simulate the default behavior by returning `undefined`. Notice that this is different from a `renderLoading` callback that returns `null`, which would render nothing whenever data is loading, even if there was a previous view rendered.

* `[renderFailure: Function]`: If an error occurs that prevents Redux Fetch from fetching the data required for rendering a component, nothing will be rendered by default. Error handling behavior can be configured by supplying a callback to the `renderFailure` property. The `renderFailure` callback is called with the error.

* `[renderFetched: Function]`: When all data necessary to render becomes available, Redux Fetch will render the matched route components by default. However, you can change this behavior by supplying a callback to the `renderFetched` property. The `renderFetched` callback is called with the `children` to be rendered.

#### Remarks

* Views returned by `renderLoading`, `renderFailure`, and `renderFetched` are rendered outside the router context.

* Typically, you will not use the `renderFetched` callback. It's exposed in case you need to hack something together.

### `fetchDataForRoutes(routes: RouterConfig[], location: String)`

An asynchronous action creator that fetches the data required before rendering matched route components when dispatched.

The arguments you should inject into `fetchDataForRoutes` are:

  - `routes: RouterConfig[]`: The route configuration
  - `location: String`: The current location

### `ReadyState: Object`
### `ActionType: Object`
### `getError(getFetchState: Function): Function`
### `getPathname(getFetchState: Function): Function`
### `getReadyState(getFetchState: Function): Function`
### `FetchPropTypes: Object`

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
