# Change Log

All notable changes to this project will be documented in this file. This project adheres to [Semantic Versioning](http://semver.org/).

## 0.8.1

* Fix issue where fetchers are not called when route component is updated with different locations.

## 0.8.0

## Change

* Rename options that indicate whether HOC should fetch on mount or update
* Fix issue where `setState()` is called after components are unmounted
* Fix issue where fetchers are called multiple times between route transitions
* Fix issue where application state is not injected into `shouldFetchOnUpdate` option
* Fix issue where rendering errors are swallowed in promise chain

## 0.7.0

### Added

* By default, the `fetch` higher order component will fetch data when mounted or updated, unless specified to do otherwise using `shouldFetchOnMount()` or `shouldFetchOnUpdate()` options.

### Removed

* The `forceInitialFetch` option was removed in favor of the `shouldFetchOnMount()` function, which can be configured globally with `fetch.setup()`.

## 0.6.0

### Added

* Forward props passed to wrapped components to `getInitialAsyncState`. It allows developers to access props passed from React Router to their components. Unfortunately, in universal applications, populating this parameter requires the developer to pass it to `fetchRouteData`, potentially leading to discrepancies since React Router provide slightly different properties.

## 0.5.0

### Changed

* Move `react` and `redux` to peer dependencies

## 0.4.0

### Changed

* Reflect project rename across all files.

## 0.3.0

### Changed

* Settings configured with `fetch.setup()` apply to all unmounted/uninitialized fetcher components returned by `fetch()`.

## 0.2.0

### Added

* A new `<Glitch />` component rendered when an uncaught error occurs after fetching data.
* Ability to configure loading component rendered while fetching.
* Ability to configure failure component rendered when an uncaught error occurs after fetching.
* Ability to force a request to the server even after data is hydrated on the Redux store after first render.
* Ability to change the default behavior for the `fetch` component globally using `fetch.setup` function.

### Removed

* Modifying the store state via the `fetchReducer` is no longer needed to figure out whether the wrapped route components should send a request to the server on first mount.
