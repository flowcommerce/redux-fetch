// use babel-register to precompile ES6 syntax
require('babel-register');

const chokidar = require('chokidar');
const server = require('./server').default;

// Do "hot-reloading" of Hapi stuff on the server
// Throw away cached modules and re-require next time
// Ensure there's no important state in there!
const watcher = chokidar.watch('./server');

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
