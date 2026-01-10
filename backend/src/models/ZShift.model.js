const sequelize = require('../../config/database');
const { DataTypes } = require('sequelize');

const ZShift = sequelize.define('ZShift', {
    name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
            notEmpty: true
        },
    },
    startTime: {
        type: DataTypes.TIME,
        allowNull: false,
    },
    endTime: {
        type: DataTypes.TIME,
        allowNull: false,
    }
});

module.exports = ZShift;
