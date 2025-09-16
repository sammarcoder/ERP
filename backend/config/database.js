const {Sequelize} = require('sequelize')
require('dotenv').config()
const sequelize = new Sequelize(
    'erp_system',
    'root',
    '@mysql123',
    // process.env.DB_NAME,
    // process.env.DB_USER,
    // process.env.DB_PASSWORD,
    {
        host:'localhost',
        dialect:'mysql',
        logging:false
    }
)


module.exports = sequelize