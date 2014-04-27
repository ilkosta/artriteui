var mysql = require('mysql');
exports.createConnection = function() {
  return mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'cespuglietto',
    database: 'artrite'
  });
}