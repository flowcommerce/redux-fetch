import Config from 'config';
import Path from 'path';
import webpackConfig from '../webpack.config';

export default {
  connections: [{
    host: Config.get('hostname'),
    port: Config.get('port'),
    routes: {
      files: {
        relativeTo: Path.resolve(__dirname, '../client/assets'),
      },
    },
  }],
  registrations: [{
    plugin: 'bell',
  }, {
    plugin: 'hapi-auth-jwt2',
  }, {
    plugin: 'inert',
  }, {
    plugin: {
      register: 'good',
      options: {
        ops: { interval: 1500 },
        reporters: {
          console: [{
            module: 'good-squeeze',
            name: 'Squeeze',
            args: [{ log: '*', request: '*', response: '*' }],
          }, {
            module: 'good-console',
          }, 'stdout'],
        },
      },
    },
  }, {
    plugin: {
      register: 'hapi-webpack-dev-middleware',
      options: {
        config: webpackConfig,
        options: {
          noInfo: true,
          publicPath: webpackConfig.output.publicPath,
        },
      },
    },
  }, {
    plugin: 'hapi-webpack-hot-middleware',
  }],
};
