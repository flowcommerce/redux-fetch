import path from 'path';
import Hapi from 'hapi';
import Bell from 'bell';
import Hoek from 'hoek';
import Good from 'good';
import Inert from 'inert';
import Vision from 'vision';
import Boom from 'boom';
import { OAuth } from 'oauth';
import JWT from 'jsonwebtoken';
import HapiAuthJWT from 'hapi-auth-jwt2';
import HapiWebpackDevMiddleware from 'hapi-webpack-dev-middleware';
import HapiWebpackHotMiddleware from 'hapi-webpack-hot-middleware';
import Handlebars from 'handlebars';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { RouterContext, match } from 'react-router';
import { Provider } from 'react-redux';
import configureStore from '../common/utilities/configureStore';
import routes from '../common/routes';
import appConfig from './config/application.json';
import twitterConfig from './config/twitter.json';
import webpackConfig from '../webpack.config';
import { fetchAsyncState, FetchProvider } from '../../../src/'; // @flowio/react-redux-fetch

// Adds fetch to global scope
import 'isomorphic-fetch';

const server = new Hapi.Server();

const oauth = new OAuth(
  'https://api.twitter.com/oauth/request_token',
  'https://api.twitter.com/oauth/access_token',
  twitterConfig.consumerKey,
  twitterConfig.consumerSecret,
  '1.0A',
  null,
  'HMAC-SHA1'
);

server.connection({
  host: appConfig.hostname,
  port: appConfig.port,
  labels: ['web'],
  routes: {
    files: {
      relativeTo: path.resolve(__dirname, '../client/assets'),
    },
  },
});

server.connection({
  host: '0.0.0.0',
  port: '9000',
  labels: ['api'],
  routes: {
    cors: {
      origin: ['*'],
      maxAge: 259200, // 3 days
      headers: ['Accept', 'Authorization', 'Content-Type', 'If-None-Match'],
    },
  },
});

server.register([Bell, HapiAuthJWT], (error) => {
  Hoek.assert(!error, error);

  server.auth.scheme('login', () => ({
    authenticate: (request, reply) => {
      server.auth.test('jwt', request, (err, credentials) => {
        if (err) {
          reply.redirect('/auth/twitter');
        } else {
          reply.continue({ credentials });
        }
      });
    },
  }));

  server.auth.strategy('login', 'login', true);

  // JWT Configuration
  server.state(appConfig.jwt.cookie, {
    ttl: 30 * 60 * 1000, // expires in 30 minutes
    encoding: 'none',
    isSecure: false,
    isHttpOnly: true,
    clearInvalid: false,
    strictHeader: true,
    path: '/',
  });

  server.auth.strategy('jwt', 'jwt', {
    key: appConfig.jwt.secret, // Use a real secret in production
    urlKey: false,
    cookieKey: appConfig.jwt.cookie,
    verifyOptions: {
      algorithms: ['HS256'],
    },
    validateFunc: (decoded, request, callback) => {
      callback(null, true);
    },
  });

  // Setup the social Twitter login strategy
  server.auth.strategy('twitter', 'bell', {
    provider: 'twitter',
    password: 'secret_cookie_encryption_password', // Use something more secure in production
    clientId: twitterConfig.consumerKey,
    clientSecret: twitterConfig.consumerSecret,
    isSecure: false, // Should be set to true (which is the default) in production
    config: {
      extendedProfile: false,
    },
  });
});

server.register(Vision, (error) => {
  Hoek.assert(!error, error);

  server.views({
    engines: { handlebars: Handlebars },
    path: path.resolve(__dirname, './views'),
  });
});

// Configure logging
server.register({
  register: Good,
  options: {
    ops: { interval: 1500 },
    reporters: {
      console: [
        { module: 'good-squeeze', name: 'Squeeze', args: [{ log: '*', response: '*' }] },
        { module: 'good-console' },
        'stdout',
      ],
      file: [
        { module: 'good-squeeze', name: 'Squeeze', args: [{ log: '*', response: '*' }] },
        { module: 'good-squeeze', name: 'SafeJson', args: [{}, { separator: '\n' }] },
        { module: 'good-file', args: ['./logs/application.log'] },
      ],
    },
  },
});

server.register(Inert, (error) => {
  Hoek.assert(!error, error);

  server.select('web').route({
    method: 'GET',
    path: '/assets/{param*}',
    handler: {
      directory: {
        path: '.',
      },
    },
  });
});

// Configure webpack dev middleware
server.register({
  register: HapiWebpackDevMiddleware,
  options: {
    config: webpackConfig,
    options: {
      noInfo: true,
      publicPath: webpackConfig.output.publicPath,
    },
  },
});

// Configure webpack hot module reloading
server.select('web').register({
  register: HapiWebpackHotMiddleware,
});

// Setup the routes (this could be done in an own file but for the sake of simplicity isn't)
server.select('web').route({
  method: 'GET',
  path: '/auth/twitter',
  config: {
    auth: 'twitter', // Use our twitter strategy and let bell take over
    handler: (request, reply) => {
      if (!request.auth.isAuthenticated) {
        return reply(Boom.unauthorized(`Authentication failed: ${request.auth.error.message}`));
      }

      const token = JWT.sign(request.auth.credentials, appConfig.jwt.secret);

      return reply.redirect('/').state(appConfig.jwt.cookie, token);
    },
  },
});

// Forward all request to Twitter API
server.select('api').route({
  method: '*',
  path: '/{param*}',
  config: {
    auth: 'jwt',
    handler: (request, reply) => {
      oauth.get(
        `https://api.twitter.com/1.1${request.url.path}`,
        request.auth.credentials.token,
        request.auth.credentials.secret,
        (error, data) => {
          if (error) {
            reply(Boom.create(error.statusCode, error.data));
          } else {
            reply(JSON.parse(data));
          }
        });
    },
  },
});

// Handle routes with React Router
server.select('web').route({
  method: 'GET',
  path: '/{param*}',
  config: {
    auth: 'login',
    handler: (request, reply) => {
      const store = configureStore({
        authorization: {
          token: request.auth.token,
          user_id: request.auth.credentials.profile.id,
          screen_name: request.auth.credentials.profile.username,
        },
      });

      const location = request.path;

      return match({ routes, location }, (matchError, redirectLocation, renderProps) => {
        if (matchError) {
          return reply(Boom.badImplementation(matchError.message));
        }

        if (redirectLocation) {
          return reply.redirect(redirectLocation.pathname + redirectLocation.search);
        }

        // If nothing matched let the Hapi server handle the request
        if (renderProps == null) {
          return reply.continue();
        }

        return fetchAsyncState(store, renderProps)
        .then(() => {
          const initialState = JSON.stringify(store.getState());

          const html = renderToString((
            <Provider store={store}>
              <FetchProvider routerProps={renderProps}>
                <RouterContext {...renderProps} />
              </FetchProvider>
            </Provider>
          ));

          return { html, initialState };
        })
        .then((templateData) => reply.view('main', templateData))
        .catch((renderError) => reply(Boom.badImplementation(renderError.message)));
      });
    },
  },
});

// Start application
server.start((error) => {
  Hoek.assert(!error, error);
  // console.info(`Server running at: ${server.info.uri}`);
});

export default server;
