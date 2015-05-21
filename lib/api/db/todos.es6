'use strict';

var _ = require('lodash-node'),
  config = require('../../../json/config'),
  options = config.db,
  util = require ('../util'),
  log = util.log('todos', 'TDA'),
  pg = require('pg.js');


module.exports = ((connectionString) => {

  /*
   * PSQL query function
   */
  function query(query, params, callback) {

    pg.connect(connectionString, function(err, client, done) {
      done();

      if (err) {
        callback(err);
        return;
      }

      client.query(query, params, function(err, result) {
        if (err) {
          callback(err);
          return;
        }

        callback(null, result.rows);
      });
    });
  }

  /*
   * API queries
   */
  return {
    all: (callback) => {
      query('SELECT * FROM todos', [], callback);
    },

    get: (id, callback) => {
      query('SELECT * FROM todos WHERE id = $1', [id], function(err, rows) {
        callback(err, rows && rows[0]);
      });
    },

    create: (title, order, created, callback) => {
      query('INSERT INTO todos ("title", "order", "created", "completed") VALUES ($1, $2, $3, false) RETURNING *', [title, order, created], function(err, rows) {
        callback(err, rows && rows[0]);
      });
    },

    update: (id, properties, callback) => {
      var assigns = [], values = [];
      if ('title' in properties) {
        assigns.push('"title"=$' + (assigns.length + 1));
        values.push(properties.title);
      }
      if ('order' in properties) {
        assigns.push('"order"=$' + (assigns.length + 1));
        values.push(properties.order);
      }
      if ('completed' in properties) {
        assigns.push('"completed"=$' + (assigns.length + 1));
        values.push(properties.completed);
      }

      var updateQuery = [
        'UPDATE todos',
        'SET ' + assigns.join(', '),
        'WHERE id = $' + (assigns.length + 1),
        'RETURNING *'
      ];

      query(updateQuery.join(' '), values.concat([id]), function(err, rows) {
        callback(err, rows && rows[0]);
      });
    },

    remove: (id, callback) => {
      query('DELETE FROM todos WHERE id = $1 RETURNING *', [id], function(err, rows) {
        callback(err, rows && rows[0]);
      });
    },

    clear: (callback) => {
      query('DELETE FROM todos RETURNING *', [], callback);
    },

    reset: (callback) => {
      query('ALTER SEQUENCE todos_id_seq RESTART WITH 1', [], callback)
    }
  };
});
