import React from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';
import getDisplayName from '../utilities/getDisplayName';

export default function withFetch(fetchData) {
  return function createFetchContainer(Component) {
    const FetchContainer = props => (<Component {...props} />);
    FetchContainer.displayName = `WithFetch(${getDisplayName(Component)})`;
    FetchContainer.fetchData = fetchData;
    return hoistNonReactStatics(FetchContainer, Component);
  };
}
