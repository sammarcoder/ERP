

const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
// const { Model, DataTypes } = require('sequelize');
// const sequelize = require('../../config/database');
// models/Order_Main.js - SIMPLIFIED (Keep existing structure)
class Order_Main extends Model {
  static associate(models) {
    this.hasMany(models.Order_Detail, {
      foreignKey: 'Order_Main_Id',
      as: 'details',
      onDelete: 'CASCADE'
    });
    
    this.hasMany(models.Stk_main, {
      foreignKey: 'Order_Main_ID',
      as: 'stockTransactions',
      onDelete: 'CASCADE'
    });

    this.belongsTo(models.ZCoa, {
      foreignKey: 'COA_ID',
      as: 'account'
    });

    this.belongsTo(models.ZvoucherType, {
      foreignKey: 'Stock_Type_ID',
      as: 'orderType'
    });
  }
}

Order_Main.init({
  ID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  Stock_Type_ID: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: '11=Purchase Order, 12=Sales Order'
  },
  Date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  Number: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  COA_ID: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  
  // USE EXISTING FIELD - No new fields needed!
  Next_Status: {
    type: DataTypes.ENUM('Incomplete', 'Complete', 'Partial'),
    defaultValue: 'Incomplete'
  }
}, {
  sequelize,
  modelName: 'Order_Main',
  tableName: 'Order_Main',
  timestamps: true
});
module.exports = Order_Main;