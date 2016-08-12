var path = require('path')
var webpack = require('webpack')

module.exports = {
  entry: {
    utils: "./index.js"
  },
  output: {
    path: path.join(__dirname, 'browser'),
    filename: "OpenRegistry.[name].js",
    library: ["OpenRegistry", "[name]"],
    libraryTarget: "umd"
  },

  node: {
    fs: "empty",
  },

  resolve: {
    extensions: ['', '.js', 'index.js', '.json', 'index.json']
  },

  module: {
    preLoaders: [
        { test: /\.json$/, loader: 'json'}
    ],
    loaders: [
        { test: /\.js$/, loader: 'babel-loader', plugins: [], query: {presets: ['es2015']}},
    ]
  },
  resolveLoader: {
        root: path.join(__dirname, 'node_modules'),
        packageMains: ['json-loader']
  },
  devtool: '#eval'
}