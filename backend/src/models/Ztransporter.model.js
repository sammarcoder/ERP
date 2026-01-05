// models/Ztransporter.js
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Ztransporter = sequelize.define('Ztransporter', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  contactPerson: {
    type: DataTypes.STRING
  },
  phone: {
    type: DataTypes.STRING
  },
  address: {
    type: DataTypes.TEXT
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'Ztransporter',
  timestamps: true
});

// Define associations following your pattern
Ztransporter.associate = function (models) {
  Ztransporter.hasMany(models.Stk_main, {
    foreignKey: 'Transporter_ID',
    as: 'sotckTransporter',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
  });
  Ztransporter.hasMany(models.ZCoa, {
    foreignKey: 'Transporter_ID',
    as: 'coaEntries'
  });

  Ztransporter.hasMany(models.Order_Main, {
    foreignKey: 'Transporter_ID',
    as: 'ordersTransporter',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
  });
};



module.exports = Ztransporter;
