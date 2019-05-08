module.exports = {
  presets: [
    '@babel/preset-env',
    '@babel/preset-react',
  ],
  plugins: [
    ['@babel/plugin-transform-runtime', {
      corejs: false,
      regenerator: false,
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
