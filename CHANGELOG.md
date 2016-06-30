# Change Log

All notable changes to this project will be documented in this file. This project adheres to [Semantic Versioning](http://semver.org/).

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
