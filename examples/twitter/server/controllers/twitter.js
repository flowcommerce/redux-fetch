import { OAuth } from 'oauth';
import Config from 'config';
import Url from 'url';

export default function (request, reply) {
  const oauth = new OAuth(
    'https://api.twitter.com/oauth/request_token',
    'https://api.twitter.com/oauth/access_token',
    Config.get('twitter.consumerKey'),
    Config.get('twitter.consumerSecret'),
    '1.0A',
    null,
    'HMAC-SHA1',
  );

  const url = Url.format({
    protocol: 'https',
    hostname: 'api.twitter.com',
    pathname: `/1.1/${request.params.endpoint}`,
    query: request.query,
  });

  oauth.get(
    url,
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
}
