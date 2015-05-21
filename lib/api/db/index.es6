'use strict';

var _ = require('lodash-node'),
  config = require('../../../json/config'),
  util = require('../util'),
  log = util.log('db', 'TDA'),
  pg = require('pg.js'),
  connectionString = process.env.DATABASE_URL || config.db.localUrl,
  todos = require('./todos.es6')(connectionString),
  app;


function setRoutes() {

  /*
   * The API implementation
   */

  function createCallback(res, onSuccess) {
    return function callback(err, data) {
      if (err || !data) {
        res.status(500).send('Something bad happened!');
        return;
      }

      onSuccess(data);
    }
  }

  /* define json structure for web api */
  function createTodo(req, data) {
    return {
      id: data.id,
      created: data.created,
      title: data.title,
      order: data.order,
      completed: data.completed || false,
      url: req.protocol + '://' + req.get('host') + config.api.urlParam + '/' + data.id
    };
  }

  function getCreateTodo(req) {
    return function(data) {
      return createTodo(req, data);
    };
  }

  /*
   * API ROUTES
   */

   /* get all */
  app.get(config.api.urlParam, function(req, res) {
    todos.all(createCallback(res, function(todos) {
      res.send(todos.map(getCreateTodo(req)));
    }));
  });

  /* get single todo  */
  app.get(config.api.urlParam + '/:id', function(req, res) {
    todos.get(req.params.id, createCallback(res, function(todo) {
      res.send(createTodo(req, todo));
    }));
  });

  /* create todo */
  app.post(config.api.urlParam, function(req, res) {
    todos.create(req.body.title, req.body.order, req.body.created, createCallback(res, function(todo) {
      res.send(createTodo(req, todo));
    }));
  });

  /* edit todo */
  app.patch(config.api.urlParam + '/:id', function(req, res) {
    todos.update(req.params.id, req.body, createCallback(res, function(todo) {
      res.send(createTodo(req, todo));
    }));
  });

  /* remove all */
  app.delete(config.api.urlParam, function(req, res) {
    todos.clear(createCallback(res, function(todos) {
      res.send(todos.map(getCreateTodo(req)));
    }));
  });

  /* remove single todo */
  app.delete(config.api.urlParam + '/:id', function(req, res) {
    todos.remove(req.params.id, createCallback(res, function(todo) {
      res.send(createTodo(req, todo));
    }));
  });

  /* reset db starting key back 1 */
  app.put(config.api.urlParam + '/reset', function(req, res) {
    todos.reset(createCallback(res, function(e) {}));
  });

}

exports.connect = ((expressApp, cb) => {

  app = expressApp;

  /* Connect to postgresql db on startup */
  pg.connect(connectionString, function(err, client, done) {
    done();

    if (err) {

      log('not connected to db');

      /* Send ERROR to NOT setup server */
      if (cb) {
        cb({
          status: 'error'
        });
      }

    } else {

      /* set api routes once connection with db has been made */
      setRoutes();

      /* Send SUCCESS to setup server */
      if (cb) {
        cb({
          status: 'success'
        });
      }


    }
  })

});
