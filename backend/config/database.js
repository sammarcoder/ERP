const {Sequelize} = require('sequelize')

const sequelize = new Sequelize(
    'erp_system',
    'root',
    '@mysql123',
    {
        host:'localhost',
        dialect:'mysql',
        logging:false
    }
)


module.exports = sequelize