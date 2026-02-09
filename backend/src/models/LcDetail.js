// models/LcDetail.js

const sequelize = require('../../config/database');
const { DataTypes } = require('sequelize');
const ZItems = require('./zItems.model');

const LcDetail = sequelize.define('LcDetail', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  lcMainId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Link to LcMain'
  },
  itemId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Link to ZItems'
  },
  cd: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 0,
    comment: 'Customs Duty'
  },
  acd: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 0,
    comment: 'Additional Customs Duty'
  },
  rd: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 0,
    comment: 'Regulatory Duty'
  },
  salesTax: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 0
  },
  addSalesTax: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 0,
    comment: 'Additional Sales Tax'
  },
  itaxImport: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 0,
    comment: 'Income Tax Import'
  },
  furtherTax: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 0
  },
  incomeTaxWithheld: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 0
  },
  assessedPrice: {
    type: DataTypes.DECIMAL(10, 6),
    allowNull: true,
    defaultValue: 0
  },
  priceFC: {
    type: DataTypes.DECIMAL(10, 6),
    allowNull: true,
    defaultValue: 0,
    comment: 'Purchase Price FC'
  },
  assessedQty: {
    type: DataTypes.DECIMAL(10, 3),
    allowNull: true,
    defaultValue: 0
  }
}, {
  tableName: 'lcdetail',
  timestamps: true
});

// Associations
LcDetail.belongsTo(ZItems, {
  foreignKey: 'itemId',
  as: 'item'
});

ZItems.hasMany(LcDetail, {
  foreignKey: 'itemId',
  as: 'lcDetails'
});

module.exports = LcDetail;
