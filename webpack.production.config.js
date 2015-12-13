'use strict';

var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var StatsPlugin = require('stats-webpack-plugin');

module.exports = {
  entry: [
    path.join(__dirname, 'rudeco/public/js/main.js')
  ],
  output: {
    path: path.join(__dirname, '/dist'),
    chunkFilename: "[hash]/js/[id].js",
    filename: '[name].[hash].min.js'
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new HtmlWebpackPlugin({
      template: 'rudeco/public/index.html',
      inject: 'body',
      filename: 'index.html'
    }),
    new ExtractTextPlugin('[name]-[hash].min.css'),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false,
        screw_ie8: true
      }
    }),
    new StatsPlugin('webpack.stats.json', {
      source: false,
      modules: false
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    })
  ],
  new CopyWebpackPlugin([
        // Files 
        { from: './4over/public/favicon.ico', to: './favicon.ico' },
        { from: './4over/public/.htaccess' },
        { from: './4over/public/robots.txt', to: './robots.txt' },
    ]),
  ],
  module: {
    loaders: [
      { test: /\.js?$/, exclude: /node_modules/, loader: 'babel-loader', query: { plugins: ['system-import-transformer'] } },
      { test: /\.(scss|css)$/i, loader: ExtractTextPlugin.extract("style-loader", "css-loader?sourceMap!sass-loader") },
      //{ test: /\.(scss|css)$/i, loader: 'style-loader!raw-loader!css-loader?sourceMap!sass-loader?includePaths[]=' + path.resolve(__dirname, './4over/public/sass/modules/4over/mixins') },
      { test: /\.(jpe?g|png|gif|svg)$/i, loader: 'url?limit=10000!img?progressive=true' },
      { test:  /\.json?$/, loader: 'url?limit=10000!img?progressive=true' }
    ]
  },
  postcss: [
    require('autoprefixer')
  ],
  resolve: {
    root: [
      'node_modules'
    ],
    extensions: ['', '.js'],
    // use to point to folders for imports node style
    modulesDirectories: [
      'rudeco/public'
    ],
    // set an alias for dependencies in node_modules or other dirs
    // alias: {
    // }
  }
};
