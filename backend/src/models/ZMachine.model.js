const sequelize = require('../../config/database');
const { DataTypes } = require('sequelize');

const ZMachine = sequelize.define('ZMachine', {
    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            notEmpty: true
        },
    },
    function: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            notEmpty: true
        }
    }
});

module.exports = ZMachine;
