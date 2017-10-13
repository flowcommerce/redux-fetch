import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { Provider } from 'react-redux';
import { RouterContext, createMemoryHistory, match } from 'react-router';
import { fetchRouteData, FetchRootContainer } from '@flowio/redux-fetch';
import Html from '../../common/components/Html';
import InternalServerError from '../../common/components/InternalServerError';
import NotFound from '../../common/components/NotFound';
import configureRoutes from '../../common/utilities/configureRoutes';
import configureStore from '../../common/utilities/configureStore';

/* Helpers */

function matchRoute(options) {
  return new Promise((resolve, reject) => {
    match(options, (error, redirectLocation, renderProps) => {
      if (error) reject(error);
      else resolve({ redirectLocation, renderProps });
    });
  });
}

function renderPage({ markup, state }) {
  const html = ReactDOMServer.renderToStaticMarkup(<Html state={state} markup={markup} />);
  return `<!DOCTYPE html>${html}`;
}

function renderInternalServerError({ message }) {
  const markup = ReactDOMServer.renderToStaticMarkup(<InternalServerError message={message} />);
  const html = ReactDOMServer.renderToStaticMarkup(<Html markup={markup} />);
  return `<!DOCTYPE html>${html}`;
}

function renderNotFound() {
  const markup = ReactDOMServer.renderToStaticMarkup(<NotFound />);
  const html = ReactDOMServer.renderToStaticMarkup(<Html markup={markup} />);
  return `<!DOCTYPE html>${html}`;
}

function renderToString(store, renderProps) {
  return ReactDOMServer.renderToString(
    <Provider store={store}>
      <FetchRootContainer routerProps={renderProps}>
        <RouterContext {...renderProps} />
      </FetchRootContainer>
    </Provider>,
  );
}

function handleMatch(store) {
  return ({ redirectLocation, renderProps }) => {
    if (redirectLocation) {
      return {
        status: 302,
        redirect: `${redirectLocation.pathname}${redirectLocation.search}`,
      };
    }

    if (!renderProps) {
      return {
        status: 404,
        message: 'Path not found.',
      };
    }

    return store.dispatch(fetchRouteData(renderProps)).then(() => {
      const state = store.getState();
      const markup = renderToString(store, renderProps);
      return { status: 200, markup, state };
    });
  };
}

function handleMatchError() {
  return error => ({
    status: error.status || 500,
    message: error.message,
    error,
  });
}

export default function (request, reply) {
  const location = request.url.href;
  const history = createMemoryHistory(location);
  const routes = configureRoutes();
  const store = configureStore({
    authorization: {
      token: request.auth.token,
      user_id: request.auth.credentials.profile.id,
      screen_name: request.auth.credentials.profile.username,
    },
  });

  return matchRoute({ history, location, routes })
    .then(handleMatch(store))
    .catch(handleMatchError())
    .then(({
      error, markup, state, status, redirect,
    }) => {
      switch (status) {
      case 200: return reply(renderPage({ markup, state }));
      case 302: return reply().redirect(redirect);
      case 404: return reply(renderNotFound()).code(status);
      default: return reply(renderInternalServerError(error)).code(status);
      }
    });
}
