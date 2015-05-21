var dbm = global.dbm || require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
  var schema = {
    id: {
      type: 'int',
      primaryKey: true,
      autoIncrement: true
    },
    title: 'string',
    completed: 'boolean',
    created: 'timestamp'
  };

  db.createTable('todos', schema, callback);
};

exports.down = function(db, callback) {
  db.dropTable('todos', callback);
};
