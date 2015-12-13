'use strict';

var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  devtool: 'eval-source-map',
  entry: [
    'webpack-hot-middleware/client?reload=true',
    path.join(__dirname, './public/js/shell.js')
  ],
  output: {
    path: path.join(__dirname, '/dist'),
    chunkFilename: "js/[id].js",
    filename: '[name].js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      inject: 'body',
      filename: 'index.html'
    }),
    // used to load css & js in seperate modules
    // new ExtractTextPlugin('css/styles.extract.css', {
    //   allChunks: true
    // }),
    // Avoid loading duplicate code
    new webpack.optimize.DedupePlugin(),
    // Optimize module load order in bundles
    new webpack.optimize.OccurenceOrderPlugin(),
    // new webpack.ProvidePlugin({
    //     _: "underscore"
    // }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    // create common modules shared between entry points
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: "commons",
    //   // (the common chunk name)
 
    //   filename: "commons.js"
    //   // (the filename of the commons chunk)

    //   // minChunks: 3,
    //   // (Modules must be shared between 3 entries)

    //   // chunks: ["pageA", "pageB"],
    //   // (Only use these entries)
    // }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    }),
    // __dirname '../..' 
    // Copy files to dist
    new CopyWebpackPlugin([
        // Files 
        { from: './public/images/favicon.ico', to: './favicon.ico' },
        { from: './public/config/.htaccess' },
        { from: './public/config/robots.txt', to: './robots.txt' },
    ]),
  ],
  postcss: [
    require('lost')
  ],
  module: {
    // preLoaders: [
    //   { test: /\.js$/, exclude: /node_modules/, loader: 'eslint-loader' }
    // ],
    loaders: [
      { test: /\.js?$/, exclude: /node_modules/, loader: 'babel-loader' },
      { test: /\.(scss|css)$/i, loader: ExtractTextPlugin.extract("style-loader", "css-loader?sourceMap!postcss-loader") },
      { test: /\.(jpe?g|png|gif|svg)$/i, loader: 'url?limit=10000!img?progressive=true' },
      { test:  /\.json?$/, loader: 'url?limit=10000!img?progressive=true' }
    ]
  },
  resolve: {
    root: [
      'node_modules'
    ],
    extensions: ['', '.js'],
    // use to point to folders for imports node style
    modulesDirectories: [
      './public'
    ],
    // set an alias for dependencies in node_modules or other dirs
    // alias: {
    // }
  }
};
