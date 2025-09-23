const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

class Order_Main extends Model {
  static associate(models) {
    // Relationship with Order_Detail
    this.hasMany(models.Order_Detail, {
      foreignKey: 'Order_Main_Id',
      as: 'details',
      onDelete: 'CASCADE'
    });
    this.hasMany(models.Stk_main, {
      foreignKey: 'Order_Main_ID',
      as: 'order',
      onDelete: 'CASCADE'
    });

    // Relationship with ZCoa (Supplier/Customer)
    this.belongsTo(models.ZCoa, {
      foreignKey: 'COA_ID',
      as: 'account'
    });
  }
}

Order_Main.init(
  {
    ID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    Stock_Type_ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '1=Purchase, 2=Sales'
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
      allowNull: false,
      // references: {
      //   model: 'ZCoas',
      //   key: 'id'
      // }
    },
    // Next_Status: {
    //   type: DataTypes.ENUM('Complete', 'Incomplete'),
    //   allowNull: false,
    //   defaultValue: 'Incomplete'
    // },
    Next_Status: {
      type: DataTypes.ENUM('Incomplete', 'Complete', 'Partial'),
      defaultValue: 'Incomplete'
    },
    GRN_Status: {
      type: DataTypes.ENUM('Pending', 'Partial', 'Complete'),
      defaultValue: 'Pending',
      comment: 'Status of goods receiving for PO'
    },
    Dispatch_Status: {
      type: DataTypes.ENUM('Pending', 'Partial', 'Complete'),
      defaultValue: 'Pending',
      comment: 'Status of dispatch for SO'
    }
  },
  {
    sequelize,
    modelName: 'Order_Main',
    tableName: 'Order_Main',
    timestamps: true
  }
);

module.exports = Order_Main;
