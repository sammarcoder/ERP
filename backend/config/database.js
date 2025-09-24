// const {Sequelize} = require('sequelize')
// require('dotenv').config()
// const sequelize = new Sequelize(
//     'erp_system',
//     'root',
//     '@mysql123',
//     // process.env.DB_NAME,
//     // process.env.DB_USER,
//     // process.env.DB_PASSWORD,
//     {
//         host:'localhost',
//         dialect:'mysql',
//         logging:false
//     }
// )


// module.exports = sequelize























const { Sequelize } = require('sequelize');
const config = require('./config');

// Get the current environment (e.g., 'development')
const env = process.env.NODE_ENV || 'development';
const currentConfig = config[env];

// Create the Sequelize instance using the configuration from config.js
const sequelize = new Sequelize(
  currentConfig.database,
  currentConfig.username,
  currentConfig.password,
  {
    host: currentConfig.host,
    dialect: currentConfig.dialect,
    logging: false
  }
);

module.exports = sequelize;