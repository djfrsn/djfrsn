/* eslint no-console: 0 */
var path = require('path');
var express = require('express');
var routes = require('./routes.js');
var https = require('https');
var http = require('http');
var webpack = require('webpack');
var webpackMiddleware = require('webpack-dev-middleware');
var webpackHotMiddleware = require('webpack-hot-middleware');
var config = require('./webpack.config.js');
var favicon = require('serve-favicon');
var os = require('os');

var isDeveloping = process.env.NODE_ENV !== 'production';
var port = isDeveloping ? 3000 : process.env.PORT;
var env = isDeveloping ? 'development' : process.env.PORT;
var host = isDeveloping ? 'http://localhost' : os.hostname();
var app = express();

if (isDeveloping) {
  var compiler = webpack(config);
  var middleware = webpackMiddleware(compiler, {
    publicPath: config.output.publicPath,
    contentBase: 'src',
    stats: {
      colors: true,
      hash: false,
      timings: true,
      chunks: false,
      chunkModules: false,
      modules: false
    }
  });

  app.use(middleware);
  app.use(webpackHotMiddleware(compiler));
  app.get('*', function response(req, res) {
    res.write(middleware.fileSystem.readFileSync(path.join(__dirname, 'dist/index.html')));
    res.end();
  });
} else {
  app.use(express.static(__dirname + '/dist'));
  app.get('*', function response(req, res) {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
  });
}

app.use(favicon(path.join(__dirname,'public','images','favicon.ico')));

http.createServer(app).listen(port, function onStart(err) {
  if (err) {
    console.log(err);
  }
  console.info('==> 🌎  Listening at ' + host + ':' + port + ' in ' + env );
});
