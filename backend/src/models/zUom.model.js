// models/Uom.js - UPDATED
const { DataTypes, Model } = require('sequelize');
const sequelize = require('../../config/database');

class Uom extends Model {
  static associate(models) {
    // ADDED: UOM has many ZItems relationships
    this.hasMany(models.ZItems, {
      foreignKey: 'skuUOM',
      as: 'itemsUom1'
    });

    this.hasMany(models.ZItems, {
      foreignKey: 'uom2',
      as: 'itemsUom2'
    });

    this.hasMany(models.ZItems, {
      foreignKey: 'uom3',
      as: 'itemsUom3'
    });

    this.hasMany(models.ZItems, {
      foreignKey: 'assessmentUOM',
      as: 'itemsUom4'
    });

    // ADDED: UOM has many Stk_Detail relationships
    this.hasMany(models.Stk_Detail, {
      foreignKey: 'Stock_In_UOM',
      as: 'stockInUom1'
    });

    this.hasMany(models.Stk_Detail, {
      foreignKey: 'Stock_In_SKU_UOM',
      as: 'stockInUom2'
    });

    this.hasMany(models.Stk_Detail, {
      foreignKey: 'Stock_out_UOM',
      as: 'stockOutUom1'
    });

    this.hasMany(models.Stk_Detail, {
      foreignKey: 'Stock_out_SKU_UOM',
      as: 'stockOutUom2'
    });
    this.hasMany(models.Stk_Detail, {
      foreignKey: 'Sale_Unit',
      as: 'stockSaleUnit'
    });

    this.hasMany(models.Order_Detail, {
      foreignKey: 'Uom_Id',
      as: 'Sale_Uom',
      onDelete: 'RESTRICT'
    });
  }
}

Uom.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  uom: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'Uom',
  tableName: 'uoms',
  timestamps: true
});

module.exports = Uom;
