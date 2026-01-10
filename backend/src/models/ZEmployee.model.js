const sequelize = require('../../config/database');
const { DataTypes } = require('sequelize');
const ZDepartment = require('./ZDepartment.model');

const ZEmployee = sequelize.define('ZEmployee', {
    employeeName: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            notEmpty: true
        },
    },
    phone: {
        type: DataTypes.STRING(20),
        allowNull: false,
        validate: {
            notEmpty: true,
            is: /^[0-9+\-\s]+$/
        }
    },
    address: {
        type: DataTypes.STRING(500),
        allowNull: true,
    },
    departmentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: ZDepartment,
            key: 'id'
        }
    }
});

// Define relationship
ZDepartment.hasMany(ZEmployee, { foreignKey: 'departmentId', as: 'employees' });
ZEmployee.belongsTo(ZDepartment, { foreignKey: 'departmentId', as: 'department' });

module.exports = ZEmployee;
