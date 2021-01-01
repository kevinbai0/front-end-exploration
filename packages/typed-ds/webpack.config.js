const path = require('path');

module.exports = {
  target: 'web',
  entry: './src/index.ts',
  resolve: {
    extensions: ['.ts'],
  },
  mode: 'production',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'main.bundle.js',
    library: 'typed-ds',
    libraryTarget: 'umd',
    globalObject: 'this',
  },
  module: {
    rules: [
      {
        test: /\.m?(ts|js|tsx)$/,
        exclude: /(node_modules|bower_components|examples)/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
};
