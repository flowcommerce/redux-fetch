module.exports = {
  ui: 'bdd',
  require: [
    '@babel/register',
    './test/setup.js'
  ],
  recursive: true,
  colors: true,
  checkLeaks: true,
};
