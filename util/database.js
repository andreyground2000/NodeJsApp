const Sequelize = require('sequelize');

const sequelize = new Sequelize('node_shop', 'root', 'shinyBoy1994!', {
  dialect: 'mysql',
  host: 'localhost'
});

module.exports = sequelize;