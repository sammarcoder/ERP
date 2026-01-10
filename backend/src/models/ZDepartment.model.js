const sequelize = require('../../config/database');
const { DataTypes } = require('sequelize');

const ZDepartment = sequelize.define('ZDepartment', {
    departmentName: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            notEmpty: true
        },
    },
    departmentCode: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: true
        }
    },
    description: {
        type: DataTypes.STRING(500),
        allowNull: true,
    },
    location: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    managerId: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    }
});

module.exports = ZDepartment;
