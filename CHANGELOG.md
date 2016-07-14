# Change Log

All notable changes to this project will be documented in this file. This project adheres to [Semantic Versioning](http://semver.org/).

## 0.9.3

* Fix an issue where calling `fetchRouteData` with an `undefined` component results in an error.

## 0.9.2

* Removed `./utilities/fetch-data` module.
* Moved store prop types definition into its own file, namely `./utilities/store-shape.js`.
* Modified language in render error messages to feel similar to those around the React community.

## 0.9.1

* Fix unresolvable path in entry file

## 0.9.0

* New `renderSuccess` callback option was added to `fetch` higher order component.
* Unset default render callbacks for loading and error states. Instead users will need to explicitly define them in each component wrapped with `fetch()` or globally using `fetch.setup()`.

## 0.8.1

* Fix issue where fetchers are not called when route component is updated with different locations.

## 0.8.0

* Rename options that indicate whether HOC should fetch on mount and update.
* Fix issue where `setState()` is called after components are unmounted.
* Fix issue where fetchers are called multiple times between route transitions.
* Fix issue where application state is not injected into `shouldFetchOnUpdate` option.
* Fix issue where rendering errors are swallowed in promise chain.

## 0.7.0

* By default, the `fetch` higher order component will fetch data when mounted or updated, unless specified to do otherwise using `fetchOnMount()` or `fetchOnUpdate()` options.
* The `forceInitialFetch` option was removed in favor of the `fetchOnMount()` function, which can be configured globally with `fetch.setup()`.

## 0.6.0

* Forward props passed to wrapped components to `getInitialAsyncState`. It allows developers to access props passed from React Router to their components. Unfortunately, in universal applications, populating this parameter requires the developer to pass it to `fetchRouteData`, potentially leading to discrepancies since React Router provide slightly different properties.

## 0.5.0

* Move `react` and `redux` to peer dependencies

## 0.4.0

* Reflect project rename across all files.

## 0.3.0

* Settings configured with `fetch.setup()` apply to all unmounted/uninitialized fetcher components returned by `fetch()`.

## 0.2.0

* A new `<Glitch />` component rendered when an uncaught error occurs after fetching data.
* Ability to configure loading component rendered while fetching.
* Ability to configure failure component rendered when an uncaught error occurs after fetching.
* Ability to force a request to the server even after data is hydrated on the Redux store after first render.
* Ability to change the default behavior for the `fetch` component globally using `fetch.setup` function.
* Modifying the store state via the `fetchReducer` is no longer needed to figure out whether the wrapped route components should send a request to the server on first mount.

## 0.1.0

* Initial release
