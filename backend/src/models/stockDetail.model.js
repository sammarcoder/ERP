// models/Stk_Detail.js
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Stk_Detail = sequelize.define('Stk_Detail', {
  ID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  STK_Main_ID: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  Line_Id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  Item_ID: {
    type: DataTypes.INTEGER,
    allowNull: true
  },

  // Batch number field
  batchno: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Batch number for this item'
  },

  // Price fields
  Stock_Price: { type: DataTypes.DECIMAL(10, 2) },
  Stock_SKU_Price: { type: DataTypes.DECIMAL(10, 2) },

  // UOM1 fields
  Stock_In_UOM: { type: DataTypes.INTEGER },
  Stock_In_UOM_Qty: { type: DataTypes.DECIMAL(10, 3) },
  Stock_out_UOM: { type: DataTypes.INTEGER },
  Stock_out_UOM_Qty: { type: DataTypes.DECIMAL(10, 3) },

  // UOM2 fields
  Stock_In_SKU_UOM: { type: DataTypes.INTEGER },
  Stock_In_SKU_UOM_Qty: { type: DataTypes.DECIMAL(10, 3) },
  Stock_out_SKU_UOM: { type: DataTypes.INTEGER },
  Stock_out_SKU_UOM_Qty: { type: DataTypes.DECIMAL(10, 3) },

  // UOM3 fields
  Stock_In_UOM3_Qty: { type: DataTypes.DECIMAL(10, 3) },
  Stock_out_UOM3_Qty: { type: DataTypes.DECIMAL(10, 3) },

  // Sale Unit
  Sale_Unit: { type: DataTypes.STRING() },
  sale_Uom :{ type: DataTypes.INTEGER() },
  uom1_qty: { type: DataTypes.DECIMAL(10, 3) },
  uom2_qty: { type: DataTypes.DECIMAL(10, 3) },
  uom3_qty: { type: DataTypes.DECIMAL(10, 3) },


  Discount_A: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
    defaultValue: 0
  },
  Discount_B: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
    defaultValue: 0
  },
  Discount_C: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
    defaultValue: 0
  },
 
}, {
  tableName: 'Stk_Detail',
  timestamps: true
});

// FIXED: Associations WITH UOM
Stk_Detail.associate = function (models) {
  // Stk_Detail belongs to Stk_main
  Stk_Detail.belongsTo(models.Stk_main, {
    foreignKey: 'STK_Main_ID',
    as: 'stockMain'
  });

  // Stk_Detail belongs to ZItems
  Stk_Detail.belongsTo(models.ZItems, {
    foreignKey: 'Item_ID',
    as: 'item'
  });

  // ADDED: UOM associations for Stock_In
  Stk_Detail.belongsTo(models.Uom, {
    foreignKey: 'Stock_In_UOM',
    as: 'inUOM1'
  });

  Stk_Detail.belongsTo(models.Uom, {
    foreignKey: 'Stock_In_SKU_UOM',
    as: 'inUOM2'
  });

  // ADDED: UOM associations for Stock_out
  Stk_Detail.belongsTo(models.Uom, {
    foreignKey: 'Stock_out_UOM',
    as: 'outUOM1'
  });

  Stk_Detail.belongsTo(models.Uom, {
    foreignKey: 'Stock_out_SKU_UOM',
    as: 'outUOM2'
  });
  Stk_Detail.belongsTo(models.Uom, {
    foreignKey: 'Sale_Unit',
    as: 'SaleUnit'
  });
  Stk_Detail.belongsTo(models.ZCoa, {
    foreignKey: 'batchno',
    as: 'batchDetails'
  });
};

module.exports = Stk_Detail;
