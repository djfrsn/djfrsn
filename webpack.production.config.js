'use strict';

var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var StatsPlugin = require('stats-webpack-plugin');

module.exports = {
  entry: [
    path.join(__dirname, './public/js/shell.js')
  ],
  output: {
    path: path.join(__dirname, '/dist'),
    chunkFilename: "[hash]/js/[id].js",
    filename: '[name].[hash].min.js'
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new HtmlWebpackPlugin({
      template: './public/index.html',
      inject: 'body',
      filename: 'index.html'
    }),
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
    }),
    new CopyWebpackPlugin([
        // Files 
        { from: './public/images/favicon.ico', to: './favicon.ico' },
        { from: './public/config/robots.txt', to: './robots.txt' }
    ]),
  ],
  module: {
    loaders: [
      { test: /\.js?$/, exclude: /node_modules/, loader: 'babel-loader' },
      { test: /\.css$/, loader: "style-loader!css-loader!postcss-loader" },
      { test: /\.(jpe?g|png|gif|svg)$/i, loader: 'url?limit=10000!img?progressive=true' },
      { test:  /\.json?$/, loader: 'url?limit=10000!img?progressive=true' }
    ]
  },
  postcss: [
    require('lost'),
    require('autoprefixer')
  ],
  resolve: {
    root: [
      'node_modules'
    ],
    extensions: ['', '.js'],
    // use to point to folders for imports node style
    modulesDirectories: [
      './public'
    ]
    // set an alias for dependencies in node_modules or other dirs
    // alias: {
    // }
  }
};
