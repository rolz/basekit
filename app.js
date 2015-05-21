'use strict';

var _ = require('lodash-node'),
  config = require('./json/config'),
  api = require('./lib/api'),
  express = require('express'),
  app = express();

if (process.env.NODE_ENV === 'development') {
  /* Add livereload */
  app.use(require('connect-livereload')({port: config.server.livereloadPort}));

  /* Get local enviroment variables */
  var env = require('node-env-file');
  env(__dirname + '/.env');
}

/* Connect server */
api.server.connect(app, express);

/* Connect DB */
api.db.connect(app, (function(e) {
  if(e.status === 'success') {

    /* Setup server */
    api.server.setup();

  }
}));
