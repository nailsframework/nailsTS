const path = require('path');

module.exports = {
  entry: './src/main.ts',
  mode: 'development',
  devServer: {
    contentBase: './src/'
  },
  module: {
    rules: [{
      // Include ts, tsx, js, and jsx files.
      test: /\.(ts|js)x?$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
    }],
  },

  resolve: {
    extensions: ['.js', '.tsx', '.ts'],

  },
  output: {
    filename: 'app.js',
    path: path.resolve(__dirname, 'dist'),
  },
};