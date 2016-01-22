'use strict';

var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var CopyWebpackPlugin = require('copy-webpack-plugin');
var StatsPlugin = require('stats-webpack-plugin');

const autoprefixer = require('autoprefixer');
const postcssImport = require('postcss-import');

module.exports = {
  entry: [
    'bootstrap-loader',
    'webpack-hot-middleware/client?reload=true',
    path.join(__dirname, './public/js/index.js')
  ],
  output: {
    path: path.join(__dirname, '/dist'),
    chunkFilename: "[hash]/js/[id].js",
    filename: '[name].[hash].min.js'
  },
  plugins: [
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
    // used to load css & js in seperate modules
    new ExtractTextPlugin('bundle.css'),
    // Avoid loading duplicate code
    new webpack.optimize.DedupePlugin(),
    // Optimize module load order in bundles
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.ProvidePlugin({
      jQuery: 'jquery',
    }),
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
        { from: './public/config/robots.txt', to: './robots.txt' },
    ]),
  ],
    postcss: (webpack) => {
    return [
      autoprefixer({
        browsers: ['last 2 versions'],
      }),
      postcssImport({
        addDependencyTo: webpack,
      }),
    ];
  },
  module: {
    loaders: [{
      test: /bootstrap-sass\/assets\/javascripts\//,
      loader: 'imports?jQuery=jquery',
    }, {
      test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'url?limit=10000&mimetype=application/font-woff',
    }, {
      test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'url?limit=10000&mimetype=application/font-woff2',
    }, {
      test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'url?limit=10000&mimetype=application/octet-stream',
    }, {
      test: /\.otf(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'url?limit=10000&mimetype=application/font-otf',
    }, {
      test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'file',
    }, {
      test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'url?limit=10000&mimetype=image/svg+xml',
    }, {
      test: /\.js$/,
      loaders: ['babel-loader'],
      exclude: /node_modules/,
    }, {
      test: /\.png$/,
      loader: 'file?name=[name].[ext]',
    }, {
      test: /\.jpg$/,
      loader: 'file?name=[name].[ext]',
    },
    {
      test: /\.scss$/,
      loader: 'style!css?localIdentName=[path][name]--[local]!postcss-loader!sass',
    }],
  },
  resolve: {
    root: [
      path.join(__dirname, 'node_modules')
    ],
    extensions: ['', '.jsx', '.js', '.json', '.scss'],
    // use to point to folders for imports node style
    modulesDirectories: [
      './public/js'
    ]
    // set an alias for dependencies in node_modules or other dirs
    // alias: {
    // }
  }
};
