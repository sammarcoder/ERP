// models/zlcv.model.js

const sequelize = require('../../config/database');
const { DataTypes } = require('sequelize');
const ZCoa = require('./zCoa.model');  // Import COA model for association

const Zlcv = sequelize.define('Zlcv', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  coaId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  description: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  order: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true
  },
  status: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  isCost: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  isDb: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
}, {
  tableName: 'zlcv',
  timestamps: true
});

// Association
Zlcv.belongsTo(ZCoa, {
  foreignKey: 'coaId',
  as: 'coa'
});

module.exports = Zlcv;
