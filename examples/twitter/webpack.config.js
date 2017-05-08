import webpack from 'webpack';
import path from 'path';

export default {
  devtool: '#inline-source-map',
  entry: [
    'webpack-hot-middleware/client',
    'react-hot-loader/patch',
    path.resolve(__dirname, './client/index.jsx'),
  ],
  output: {
    path: path.resolve(__dirname, './client/assets'),
    publicPath: '/assets/',
    filename: 'bundle.js',
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
  },
  module: {
    rules: [{
      test: /\.(js|jsx)$/,
      use: [
        { loader: 'babel-loader' },
      ],
      include: [
        path.resolve(__dirname, './client'),
        path.resolve(__dirname, './common'),
      ],
    }, {
      test: /\.(css)$/,
      use: [
        { loader: 'style-loader' },
        { loader: 'css-loader' },
      ],
      include: [
        path.resolve(__dirname, './client'),
        path.resolve(__dirname, './common'),
        path.resolve(__dirname, './node_modules/react-spinner'),
      ],
    }],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
  ],
};
