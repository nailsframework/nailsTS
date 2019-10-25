const path = require('path');

module.exports = {
  entry: './src/main.ts',
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },

  resolve: {
    extensions: [ '.js','.tsx', '.ts'],
  },
  output: {
    filename: 'src/app.js',
    path: path.resolve(__dirname, 'dist'),
  },
};