import 'isomorphic-fetch';

import Boom from 'boom';
import Config from 'config';
import Glue from 'glue';
import Hoek from 'hoek';
import Jwt from 'jsonwebtoken';
import Renderer from './controllers/renderer';
import Twitter from './controllers/twitter';
import settings from './settings';

export default Glue.compose(settings).then((server) => {
  // Configure scheme that will require the user to login with twitter when
  // JWT token is not valid.
  server.auth.scheme('login', () => ({
    authenticate: (request, reply) => {
      server.auth.test('jwt', request, (error, credentials) => {
        if (error) {
          reply.redirect('/auth/twitter');
        } else {
          reply.continue({ credentials });
        }
      });
    },
  }));

  server.auth.strategy('login', 'login', true);

  // Configure JWT session cookie
  server.state(Config.get('jwt.cookie'), {
    ttl: Config.get('jwt.ttl'),
    encoding: 'none',
    isSecure: false,
    isHttpOnly: true,
    isSameSite: false,
    path: '/',
  });

  // Configure the JWT strategy
  server.auth.strategy('jwt', 'jwt', {
    // Use a real secret in production.
    // NEVER commit to source control.
    key: Config.get('jwt.secret'),
    urlKey: false,
    cookieKey: Config.get('jwt.cookie'),
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
    password: Config.get('twitter.password'),
    clientId: Config.get('twitter.consumerKey'),
    clientSecret: Config.get('twitter.consumerSecret'),
    // Should be set to true (which is the default) in production
    isSecure: false,
    config: {
      extendedProfile: false,
    },
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

        const token = Jwt.sign(request.auth.credentials, Config.get('jwt.secret'));

        return reply.redirect('/').state(Config.get('jwt.cookie'), token);
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
    config: {
      auth: 'jwt',
      handler: Twitter,
    },
  });

  // Configure routes that render with React Router
  server.route({
    method: 'GET',
    path: '/{param*}',
    config: {
      auth: 'login',
      handler: Renderer,
    },
  });

  // Make sure that if the script is being required as a module by another
  // script, we don’t start the server, likely in a test.
  if (!module.parent) {
    server.start((error) => {
      Hoek.assert(!error, error);
      console.info(`Server running at: ${server.info.uri}`);
    });
  }

  return server;
}).catch((error) => {
  Hoek.assert(!error, error);
});
