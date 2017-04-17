import React from 'react';
import FetchRootContainer from './FetchRootContainer';

export default function useFetch(options) {
  return {
    renderRouterContext: (child, renderProps) => (
      <FetchRootContainer {...options} routerProps={renderProps}>
        {child}
      </FetchRootContainer>
    ),
  };
}
