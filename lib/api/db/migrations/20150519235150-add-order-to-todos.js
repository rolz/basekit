var dbm = global.dbm || require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
  db.addColumn('todos', 'order', { type: 'int' }, callback);
};

exports.down = function(db, callback) {
  db.removeColumn('todos', 'order', callback);
};
