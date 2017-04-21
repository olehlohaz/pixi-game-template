var path = require('path')
var CopyWebpackPlugin = require('copy-webpack-plugin')
var pkg = require('./package.json')
var DEBUG = process.env.NODE_ENV !== 'production'
var util = require('util')
var WebpackStrip = require('webpack-strip')
var entry = {
  game: ['./app.js']
}

module.exports = {
  context: path.join(__dirname, 'app'),
  entry: entry,
  // debug : DEBUG,
  target : 'web',
  devtool : DEBUG ? 'inline-source-map' : false,
  output: {
    path: path.resolve(pkg.config.buildDir),
    publicPath: DEBUG ? "/" : "./",
    filename:  "js/[name].js"
  },
  
  plugins: [
    new CopyWebpackPlugin([
      { from: 'assets', to: './assets' },
      { from: 'lib',    to: './lib' },
    ])
  ],
  module: {
    rules: [
      { test: /\.js$/,                  exclude: /node_modules/,                                  loader: "babel-loader", query:{ presets:['latest'] } },
      { test: /\.html$/,                exclude: /node_modules/,                                  loader: "file-loader?name=[path][name].[ext]"},
      { test: /\.jpe?g$|\.svg$|\.png$/, exclude: /node_modules/,                                  loader: "file-loader?name=[path][name].[ext]"},
      { test: /\.mp3$|\.ogg$/,          exclude: /node_modules/,                                  loader: "file-loader?name=[path][name].[ext]"},
      { test: /\.json$/,                exclude: /node_modules/,                                  loader: "json-loader"},
      { test: /\.json$/,                include: path.join(__dirname, 'node_modules', 'pixi.js'), loader: "json-loader"},
      { test: /\.json$/,                include: path.join(__dirname, 'node_modules', 'p2'), loader: "json-loader"},

      { test: /node_modules\/pixi\.js/, include: path.join(__dirname, 'node_modules', 'pixi.js'), loader: 'ify-loader' },
      {
        include: path.join(__dirname, 'node_modules', 'pixi.js'),
        enforce: "post",
        loader: 'transform-loader?brfs'
      },{
        include: path.join(__dirname, 'node_modules', 'p2'),
        enforce: "post",
        loader: 'transform-loader?brfs'
      }
    ]
  }
}