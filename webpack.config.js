const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'lib'),
    filename: 'redux-helpers.js',
    library: "reduxHelpers",
    libraryTarget: "umd"
  },
  externals: {
    "redux": {
      commonjs: "redux",
      commonjs2: "redux",
      amd: "redux",
      root: "redux"
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve('src'),
        loaders: ['babel-loader']
      }
    ]
  }
}