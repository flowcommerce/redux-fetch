/**
 * @fileoverview
 * A module that exports a Hapi route configuration that forwards all requests
 * to Twitter API.
 */

import { OAuth } from 'oauth';
import config from 'config';
import url from 'url';

export default {
  auth: 'jwt',
  handler: (request, reply) => {
    const oauth = new OAuth(
      'https://api.twitter.com/oauth/request_token',
      'https://api.twitter.com/oauth/access_token',
      config.get('twitter.consumerKey'),
      config.get('twitter.consumerSecret'),
      '1.0A',
      null,
      'HMAC-SHA1',
    );

    const twitterUrl = url.format({
      protocol: 'https',
      hostname: 'api.twitter.com',
      pathname: `/1.1/${request.params.endpoint}`,
      query: request.query,
    });

    oauth.get(
      twitterUrl,
      request.auth.credentials.token,
      request.auth.credentials.secret,
      (error, data) => {
        if (error) {
          reply(JSON.parse(error.data)).code(error.statusCode);
        } else {
          reply(JSON.parse(data));
        }
      },
    );
  },
};
