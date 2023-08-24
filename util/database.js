const mySql2 = require('mysql2');

const pool = mySql2.createPool({
  host: 'localhost',
  user: 'root',
  database: 'node_shop',
  password: 'shinyBoy1994!'
});

module.exports = pool.promise();