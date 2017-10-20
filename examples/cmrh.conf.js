const cssnext = require('postcss-cssnext');

module.exports = {
  devMode: true,
  generateScopedName: '[name]__[local]___[hash:base64:5]',
  prepend: [
    cssnext(),
  ],
};
