# Activity Indicators

Use the render callbacks to render an activity indicator while data is being fetched.

```javascript
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withFetch } from '@flowio/redux-fetch';
import { fetchUser } from './app/actions';
import { ActivityIndicator, UserProfile } from './app/components';

const fetchAsyncState = dispatch => dispatch(fetchUser());

const fetchOptions = {
  renderLoading: () => (<ActivityIndicator />),
};

const mapStateToProps = state => ({
  user: state.user,
});

export default compose(
  withFetch(fetchAsyncState, fetchOptions),
  connect(mapStateToProps),
)(UserProfile);
```

In this example we make use of the `renderLoading` callback to replace the last
view rendered while data for the next view is being fetched.

If you prefer to keep the last view rendered, but still render some indication
of background activity:

* Listen to store changes in your component (e.g. using `connect` from
`react-redux`) and create a specific reducer that listens to `FETCH_REQUEST` and
`FETCH_SUCCESS` from Redux Fetch to toggle the visibility of your activity indicator.

* Listen to store changes in your component and use the selectors exported by
Redux Fetch (i.e. `getIsPending` and/or `getIsLoading`) to toggle the
visibility of your activity indicator.

* Latch on to the render callbacks to mount/unmount a component in a separate
DOM node (feels wrong, but it works too):

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withFetch } from '@flowio/redux-fetch';
import { fetchUser } from './application/actions';
import { OverlaySpinner, UserProfile } from './app/components';

const fetchData = dispatch => dispatch(fetchUser());

const fetchOptions = {
  renderLoading: () => {
    const mountNode = document.querySelector('...'); // or create element and destroy it later
    ReactDOM.render(<ActivityIndicator />, mountNode);
  },
  renderSuccess: (children) => {
    const mountNode = document.querySelector('...');
    ReactDOM.unmountComponentAtNode(mountNode);
    return children;
  },
};

export default compose(
  withFetch(fetchData, fetchOptions),
  connect(mapStateToProps),
)(UserProfile);
```
