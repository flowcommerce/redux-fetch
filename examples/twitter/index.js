// use babel-register to precompile ES6 syntax
require('babel-register');

const Chokidar = require('chokidar');
const Hoek = require('hoek');
const composer = require('./server').default;

composer.then((server) => {
  // Do "hot-reloading" of Hapi stuff on the server
  // Throw away cached modules and re-require next time
  // Ensure there's no important state in there!
  const watcher = Chokidar.watch('./server');

  watcher.on('ready', () => {
    watcher.on('all', () => {
      console.log('Clearing /server/* module cache from server');
      Object.keys(require.cache).forEach((id) => {
        if (/[/\\]server[/\\]/.test(id)) delete require.cache[id];
      });
    });
  });

  // Do "hot-reloading" of react stuff on the server
  // Throw away the cached client modules and let them be re-required next time
  server.app.webpackCompiler.plugin('done', () => {
    console.log('Clearing /common/* module cache from server');
    Object.keys(require.cache).forEach((id) => {
      if (/[/\\]common[/\\]/.test(id)) delete require.cache[id];
    });
  });

  server.start((error) => {
    Hoek.assert(!error, error);
    console.info(`Server running at: ${server.info.uri}`);
  });
}).catch((error) => {
  Hoek.assert(!error, error);
});
