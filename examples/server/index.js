/* eslint-disable global-require */

// Enable ES6 features
require('babel-register');
// Enable CSS modules imports
require('css-modules-require-hook/preset');

const chokidar = require('chokidar');
const http = require('http');
const webpack = require('webpack');
const createWebpackDevMiddleware = require('webpack-dev-middleware');
const createWebpackHotMiddleware = require('webpack-hot-middleware');
const webpackConfig = require('../webpack.config');

const webpackCompiler = webpack(webpackConfig);

const createRequestListener = (webpackDevMiddleware, webpackHotMiddleware) => {
  const createListener = require('./helpers/createRequestListener').default;
  return createListener(webpackDevMiddleware, webpackHotMiddleware);
};

const webpackHotMiddleware = createWebpackHotMiddleware(webpackCompiler);

const webpackDevMiddleware = createWebpackDevMiddleware(webpackCompiler, {
  noInfo: true,
  publicPath: webpackConfig.output.publicPath,
  serverSideRender: true,
});

const chokidarWatcher = chokidar.watch('.');

const server = http.createServer(createRequestListener(webpackDevMiddleware, webpackHotMiddleware));

chokidarWatcher.on('ready', () => {
  chokidarWatcher.on('all', () => {
    // console.info('Invalidating server modules...');

    Object.keys(require.cache).forEach((id) => {
      if (/[/\\]server[/\\]/.test(id)) {
        delete require.cache[id];
      }
    });

    server.removeAllListeners('request');
    server.on('request', createRequestListener(webpackDevMiddleware, webpackHotMiddleware));
  });
});

webpackCompiler.plugin('done', () => {
  // console.info('Invalidating common modules...');

  Object.keys(require.cache).forEach((id) => {
    if (/[/\\]common[/\\]/.test(id)) {
      delete require.cache[id];
    }
  });
});

server.listen(3000, () => {
  console.info('Server listening on port 3000');
});
