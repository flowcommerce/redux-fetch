import 'isomorphic-fetch';

import Bell from 'bell';
import Boom from 'boom';
import Good from 'good';
import Hapi from 'hapi';
import HapiAuthJwt from 'hapi-auth-jwt2';
import HapiWebpackDevMiddleware from 'hapi-webpack-dev-middleware';
import HapiWebpackHotMiddleware from 'hapi-webpack-hot-middleware';
import Hoek from 'hoek';
import Inert from 'inert';
import Jwt from 'jsonwebtoken';
import config from 'config';
import path from 'path';

import ReactRouter from './controllers/ReactRouter';
import TwitterApi from './controllers/TwitterApi';
import webpackConfig from '../webpack.config';

const server = new Hapi.Server();

server.connection({
  host: config.get('hostname'),
  port: config.get('port'),
  routes: {
    files: {
      relativeTo: path.resolve(__dirname, '../client/assets'),
    },
  },
});

server.register([Bell, HapiAuthJwt], (error) => {
  Hoek.assert(!error, error);

  // Configure scheme that will require the user to login with twitter when
  // JWT token is not valid.
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

  // Configure JWT session cookie
  server.state(config.get('jwt.cookie'), {
    ttl: config.get('jwt.ttl'),
    encoding: 'none',
    isSecure: false,
    isHttpOnly: true,
    clearInvalid: false,
    strictHeader: true,
    path: '/',
  });

  // Configure the JWT strategy
  server.auth.strategy('jwt', 'jwt', {
    // Use a real secret in production.
    // NEVER commit to source control.
    key: config.get('jwt.secret'),
    urlKey: false,
    cookieKey: config.get('jwt.cookie'),
    verifyOptions: {
      algorithms: ['HS256'],
    },
    validateFunc: (decoded, request, callback) => {
      callback(null, true);
    },
  });

  // Configure the social Twitter login strategy
  server.auth.strategy('twitter', 'bell', {
    provider: 'twitter',
    // Use something more secure in production
    // NEVER store in source control.
    password: config.get('twitter.password'),
    clientId: config.get('twitter.consumerKey'),
    clientSecret: config.get('twitter.consumerSecret'),
    // Should be set to true (which is the default) in production
    isSecure: false,
    config: {
      extendedProfile: false,
    },
  });
});

// Configure application logging
server.register({
  register: Good,
  options: {
    ops: { interval: 1500 },
    reporters: {
      console: [
        { module: 'good-squeeze', name: 'Squeeze', args: [{ log: '*', request: '*', response: '*' }] },
        { module: 'good-console' },
        'stdout',
      ],
    },
  },
});

// Configure plugin to serve static files.
server.register(Inert, (error) => {
  Hoek.assert(!error, error);
});

// Configure webpack dev middleware
server.register({
  register: HapiWebpackDevMiddleware,
  options: {
    config: webpackConfig,
    options: {
      noInfo: false,
      publicPath: webpackConfig.output.publicPath,
    },
  },
});

// Configure webpack hot module reloading
server.register({
  register: HapiWebpackHotMiddleware,
});

// Configure route that authenticates user with Twitter.
// If all is well, a JWT token is generated and stored as a session cookie.
// The session cookie will be used to authorized further requests.
server.route({
  method: 'GET',
  path: '/auth/twitter',
  config: {
    auth: 'twitter', // Use our twitter strategy and let bell take over
    handler: (request, reply) => {
      if (!request.auth.isAuthenticated) {
        return reply(Boom.unauthorized(`Authentication failed: ${request.auth.error.message}`));
      }

      const token = Jwt.sign(request.auth.credentials, config.get('jwt.secret'));

      return reply.redirect('/').state(config.get('jwt.cookie'), token);
    },
  },
});

// Configure routes that respond with static assets.
server.route({
  method: 'GET',
  path: '/assets/{param*}',
  handler: {
    directory: {
      path: '.',
    },
  },
});

// Configure routes that forward requests to Twitter API
server.route({
  method: 'GET',
  path: '/api/{endpoint*}',
  config: TwitterApi,
});

// Configure routes that render with React Router
server.route({
  method: 'GET',
  path: '/{param*}',
  config: ReactRouter,
});

// Start application
server.start((error) => {
  Hoek.assert(!error, error);
  console.info(`Server running at: ${server.info.uri}`);
});

export default server;
