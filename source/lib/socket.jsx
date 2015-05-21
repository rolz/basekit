'use strict';

var util = require('./util.jsx');
var logger = Logger.get('Socket');
var TodoActions = require('../actions/TodoActions.jsx');


/*
 * SOCKET.IO
 * http://socket.io/
 */
var socket = io();

/* TodoActions */


module.exports = (() => { return socket; });
