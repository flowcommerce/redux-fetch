import React from 'react';
import getDisplayName from './getDisplayName';

export default fetchAsyncState => (WrappedComponent) => {
  const FetchContainer = props => (<WrappedComponent {...props} />);
  FetchContainer.displayName = `WithFetch(${getDisplayName(WrappedComponent)})`;
  FetchContainer.fetchAsyncState = fetchAsyncState;
  return FetchContainer;
};
