'use strict';

var _ = require('lodash-node'),
  // redis = require('socket.io-redis'),
  config = require('../../../json/config'),
  options = config.server,
  util = require ('../util'),
  log = util.log('socket', 'TDA'),
  io;

/*
 * [TODO] Security setting!!!!
 * Setup coockie/sessionID
 * http://jxck.hatenablog.com/entry/20111226/1324905662
 * http://stackoverflow.com/questions/6502031/authenticate-user-for-socket-io-nodejs
 */

/*
 * Used to parse cookie
 */
function parse_cookies(_cookies) {
    var cookies = {};

    _cookies && _cookies.split(';').forEach(function( cookie ) {
        var parts = cookie.split('=');
        cookies[ parts[ 0 ].trim() ] = ( parts[ 1 ] || '' ).trim();
    });
    return cookies;
}

function setSocket() {

  /* Connnect */
  io.on('connection', ((socket) => {
    log(`a user connected: ${socket.id}`, 'blue');


    /* Disconnnect */
    socket.on('disconnect', (() => {
      log(`user disconnected: ${socket.id}`, 'red');
    }));
  }));
}

exports.emit = ((message, val) => {
  io.emit(message, val);
});


exports.setup = ((http, app) => {
  // var redis = require('socket.io-redis');
  io = require('socket.io')(http);
  // io.adapter(redis({ host: 'localhost', port: 6379 }));
  // io = require('socket.io').listen(app);
  // setConfigure();
  setSocket();
});
