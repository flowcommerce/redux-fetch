# Change Log

All notable changes to this project will be documented in this file. This
project adheres to [Semantic Versioning](http://semver.org/).

## 0.14.1

* Update outdated dependencies to their latest version.

## 0.14.0

In this release, Redux Fetch will use Redux as the source of truth so that data
between the server and client can be shared accordingly. An overhaul of the
implementation was required and therefore is not backwards compatible.

* Use Redux to record fetch state between server and client.

* Renamed `fetch` to `withFetch` to avoid conflict with native Fetch API.

* The `FetchRootContainer` is the only component using `StaticContainer` to
  continue rendering the previous view until the data required to render the
  next view is fetched from the server.

* The `FetchContainer` is a higher-order component whose only purpose is to
  declare the function used to fulfill the data required to render a component
  as a static method.

* Additional documentation regarding usage in different scenarios were added.

## 0.12.2

* Fix issue where rendering errors were swallowed.

## 0.12.1

* Export React Router middleware in main file

## 0.12.0

* Add a React Router middleware.

## 0.11.1

* Fix an issue where modules would not be found in some environments.

* Update documentation with argument and return value types.

## 0.11.0

* Complete API overhaul that simplifies the library integration by leveraging
  React Router 2 API

## 0.10.0

* Fix an issue where data requirements are not fulfilled before transitioning
  between components on the client side.

  The issue surfaced as a result of the changes made to `0.9.4` where the fetch
  container was updated to perform fulfillment of data requirements on
  `componentDidMount` instead of `componentWillMount` to ensure the component
  is rendered on the server-side and prevent warnings in React when `setState`
  is called unexpectedly.

  *We feel that this fix is hackish and will go back to the drawing board to
  figure out a better way to handle universal rendering with React Router
  and Redux.*

* Some breaking changes were made to the API to help clarify the context in
  which things are executed:

  - Renamed `shouldFetchOnMount` to `shouldFetchBeforeMount` and changed the
    order of the injected parameters.
  - Renamed `shouldFetchOnUpdate` to `shouldFetchBeforeUpdate` and changed the
    order of the injected parameters.
  - Renamed `renderSuccess` to `renderFetched`
  - Renamed `fetchRouteData` to `fetchAsyncStateOnServer`

## 0.9.4

* Fix an issue where `setState()` was called unexpectedly while server-side
  rendering a wrapped component.

## 0.9.3

* Fix an issue where calling `fetchRouteData` with an `undefined` component
  results in an error.

## 0.9.2

* Removed `./utilities/fetch-data` module.

* Moved store prop types definition into its own file, namely
  `./utilities/store-shape.js`.

* Modified language in render error messages to feel similar to those around
  the React community.

## 0.9.1

* Fix unresolvable path in entry file

## 0.9.0

* New `renderSuccess` callback option was added to `fetch` higher order component.

* Unset default render callbacks for loading and error states. Instead users
  will need to explicitly define them in each component wrapped with
  `fetch()` or globally using `fetch.setup()`.

## 0.8.1

* Fix issue where fetchers are not called when route component is updated with
  different locations.

## 0.8.0

* Rename options that indicate whether HOC should fetch on mount and update.

* Fix issue where `setState()` is called after components are unmounted.

* Fix issue where fetchers are called multiple times between route transitions.

* Fix issue where application state is not injected into `shouldFetchOnUpdate` option.

* Fix issue where rendering errors are swallowed in promise chain.

## 0.7.0

* By default, the `fetch` higher order component will fetch data when mounted
  or updated, unless specified to do otherwise using `fetchOnMount()` or
  `fetchOnUpdate()` options.

* The `forceInitialFetch` option was removed in favor of the `fetchOnMount()`
  function, which can be configured globally with `fetch.setup()`.

## 0.6.0

* Forward props passed to wrapped components to `getInitialAsyncState`.
  It allows developers to access props passed from React Router to their
  components. Unfortunately, in universal applications, populating this
  parameter requires the developer to pass it to `fetchRouteData`,
  potentially leading to discrepancies since React Router provide slightly
  different properties.

## 0.5.0

* Move `react` and `redux` to peer dependencies

## 0.4.0

* Reflect project rename across all files.

## 0.3.0

* Settings configured with `fetch.setup()` apply to all unmounted/uninitialized
  fetcher components returned by `fetch()`.

## 0.2.0

* A new `<Glitch />` component rendered when an uncaught error occurs after
  fetching data.

* Ability to configure loading component rendered while fetching.

* Ability to configure failure component rendered when an uncaught error
  occurs after fetching.

* Ability to force a request to the server even after data is hydrated on the
  Redux store after first render.

* Ability to change the default behavior for the `fetch` component globally
  using `fetch.setup` function.

* Modifying the store state via the `fetchReducer` is no longer needed to
  figure out whether the wrapped route components should send a request to the
  server on first mount.

## 0.1.0

* Initial release
