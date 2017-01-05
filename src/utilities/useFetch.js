import React from 'react';
import FetchProvider from '../components/FetchProvider';

/**
 * A React Router middleware that provides the context needed for containers
 * created with `withFetch()` in the component hierarchy below to perform their
 * expected behavior. The available options are the same as those available to
 * the `FetchProvider` component with the exception of the `routerProps` since
 * that can be obtained from the middleware.
 */
export default function useFetch(options) {
  return {
    renderRouterContext: (child, renderProps) => (
      <FetchProvider {...options} routerProps={renderProps}>
        {child}
      </FetchProvider>
    ),
  };
}
