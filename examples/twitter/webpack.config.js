import webpack from 'webpack';
import path from 'path';

export default {
  devtool: '#inline-source-map',
  entry: [
    'webpack-hot-middleware/client',
    'react-hot-loader/patch',
    path.resolve(__dirname, './client/index.js'),
  ],
  output: {
    path: path.resolve(__dirname, './client/assets'),
    publicPath: '/assets/',
    filename: 'bundle.js',
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
  },
  resolveLoader: {
    root: path.resolve(__dirname, 'node_modules'),
  },
  module: {
    loaders: [{
      test: /\.(js|jsx)$/,
      loader: 'babel-loader',
      include: [
        path.resolve(__dirname, './client'),
        path.resolve(__dirname, './common'),
      ],
    }, {
      test: /\.(css)$/,
      loader: 'style-loader!css-loader',
      include: [
        path.resolve(__dirname, './client'),
        path.resolve(__dirname, './common'),
        path.resolve(__dirname, './node_modules/react-spinner'),
      ]
    }],
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
  ],
};
