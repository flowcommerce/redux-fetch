const path = require('path');
const webpack = require('webpack');
const HappyPack = require('happypack');

const threadPool = HappyPack.ThreadPool({ size: 4 });

module.exports = {
  devtool: 'inline-source-map',
  entry: [
    'react-hot-loader/patch',
    'webpack-hot-middleware/client',
    path.resolve(__dirname, './client/index.jsx'),
  ],
  output: {
    path: path.resolve(__dirname, './public'),
    publicPath: '/',
    filename: 'js/bundle.js',
  },
  target: 'web',
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
  },
  module: {
    rules: [{
      test: /\.jsx?$/,
      use: 'happypack/loader?id=javascript',
      include: [
        path.resolve(__dirname, './client'),
        path.resolve(__dirname, './common'),
      ],
    }, {
      test: /\.css$/,
      use: 'happypack/loader?id=stylesheet',
      include: [
        path.resolve(__dirname, './client'),
        path.resolve(__dirname, './common'),
      ],
    }],
  },
  plugins: [
    new HappyPack({
      id: 'javascript',
      threadPool,
      loaders: [{
        loader: 'babel-loader',
      }],
    }),
    new HappyPack({
      id: 'stylesheet',
      threadPool,
      loaders: [{
        loader: 'style-loader',
      }, {
        loader: 'css-loader',
        options: {
          importLoaders: 1,
          localIdentName: '[name]__[local]___[hash:base64:5]',
          modules: true,
          sourceMap: true,
        },
      }, {
        loader: 'postcss-loader',
      }],
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        BUILD_TARGET: JSON.stringify('client'),
      },
    }),
  ],
};
