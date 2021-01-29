const { version: babelRuntimeVersion } = require('@babel/runtime/package.json');

module.exports = {
  presets: [
    ['@babel/preset-env', {
      // Exclude transforms that make all code slower.
      // See https://github.com/facebook/create-react-app/pull/5278
      exclude: ['transform-typeof-symbol'],
    }],
    '@babel/preset-react',
  ],
  plugins: [
    ['@babel/plugin-transform-runtime', {
      corejs: false,
      helpers: true,
      regenerator: false,
      // By default, babel assumes babel/runtime version 7.0.0-beta.0,
      // explicitly resolving to match the provided helper functions.
      // https://github.com/babel/babel/issues/10261
      version: babelRuntimeVersion,
    }],
    '@babel/plugin-proposal-class-properties',
    ['@babel/plugin-proposal-object-rest-spread', {
      useBuiltIns: true,
    }],
  ],
  env: {
    test: {
      plugins: ['babel-plugin-istanbul'],
    },
  },
};
