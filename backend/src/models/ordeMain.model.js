

const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
class Order_Main extends Model {
  static associate(models) {
    this.hasMany(models.Order_Detail, {
      foreignKey: 'Order_Main_Id',
      as: 'details',
      onDelete: 'CASCADE',
    });

    this.hasMany(models.Stk_main, {
      foreignKey: 'Order_Main_ID',
      as: 'stockTransactions',
      // onDelete: 'CASCADE'
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',

    });

    this.belongsTo(models.ZCoa, {
      foreignKey: 'COA_ID',
      as: 'account'
    });

    this.belongsTo(models.ZvoucherType, {
      foreignKey: 'Stock_Type_ID',
      as: 'orderType'
    });

    this.belongsTo(models.Ztransporter, {
      foreignKey: 'Transporter_ID',
      as: 'transporter',
      // onDelete: 'RESTRICT'
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
  },
  GRN_Status: {
    type: DataTypes.ENUM('Not Generated', 'Generated', 'Partial'),
    defaultValue: 'Not Generated'
  },
  approved: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  
  Transporter_ID: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  freight_crt: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 0.00
  },
  labour_crt: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 0.00
  },
  bility_expense: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 0.00
  },
  other_expense: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 0.00
  },
  foreign_currency: {
    type: DataTypes.STRING,
    allowNull: true
  },
  sub_customer: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: false
  },
  sub_city: {
    type: DataTypes.STRING,
    allowNull: true
  },
  str: {
    type: DataTypes.INTEGER,
    allowNull: true
  },

  is_Note_generated: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  sequelize,
  modelName: 'Order_Main',
  tableName: 'Order_Main',
  timestamps: true
});

const modelAttributes = Object.keys(Order_Main.getAttributes());
console.log('Model Attributes:', modelAttributes);

module.exports = Order_Main;