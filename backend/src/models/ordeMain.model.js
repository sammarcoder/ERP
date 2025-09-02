// const { Model, DataTypes } = require('sequelize');

// class Order_Main extends Model {
//   static init(sequelize) {
//     return super.init(
//       {
//         ID: {
//           type: DataTypes.INTEGER,
//           primaryKey: true,
//           autoIncrement: true,
//           allowNull: false
//         },
//         Stock_Type_ID: {
//           type: DataTypes.INTEGER,
//           allowNull: false,
//         //   references: {
//         //     model: 'stock_types',
//         //     key: 'id'
//         //   }
//         },
//         Date: {
//           type: DataTypes.DATE,
//           allowNull: false
//         },
//         Number: {
//           type: DataTypes.INTEGER,
//           allowNull: false
//         },
//         COA_ID: {
//           type: DataTypes.INTEGER,
//           allowNull: false,
//           references: {
//             model: 'chart_of_accounts',
//             key: 'id'
//           }
//         },
//         Next_Status: {
//           type: DataTypes.ENUM('Complete', 'Incomplete'),
//           allowNull: false,
//           defaultValue: 'Incomplete'
//         }
//       },
//       {
//         sequelize,
//         modelName: 'Order_Main',
//         tableName: 'Order_Main',
//         timestamps: false, // Set to true if you have createdAt/updatedAt
//         underscored: false
//       }
//     );
//   }

//   static associate(models) {
//     // Define associations here
//     // Example:
//     // this.hasMany(models.Order_Detail, {
//     //   foreignKey: 'Order_Main_Id',
//     //   as: 'orderDetails'
//     // });

//     // this.belongsTo(models.StockType, {
//     //   foreignKey: 'Stock_Type_ID',
//     //   as: 'stockType'
//     // });

//     // this.belongsTo(models.ChartOfAccount, {
//     //   foreignKey: 'COA_ID',
//     //   as: 'account'
//     // });
//   }
// }

// module.exports = Order_Main;



























// const { Model, DataTypes } = require('sequelize');
// const sequelize = require('../../config/database');

// class Order_Main extends Model {
//   static associate(models) {
//     // associations here
//   }
// }

// Order_Main.init(
//   {
//     ID: {
//       type: DataTypes.INTEGER,
//       primaryKey: true,
//       autoIncrement: true,
//       allowNull: false
//     },
//     Stock_Type_ID: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//     },
//     Date: {
//       type: DataTypes.DATE,
//       allowNull: false
//     },
//     Number: {
//       type: DataTypes.INTEGER,
//       allowNull: false
//     },
//     COA_ID: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//     },
//     Next_Status: {
//       type: DataTypes.ENUM('Complete', 'Incomplete'),
//       allowNull: false,
//       defaultValue: 'Incomplete'
//     }
//   },
//   {
//     sequelize,  // ← Pass the sequelize instance directly
//     modelName: 'Order_Main',
//     tableName: 'Order_Main',
//     timestamps: false,
//     underscored: false
//   }
// );

// module.exports = Order_Main;








































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
    Next_Status: {
      type: DataTypes.ENUM('Complete', 'Incomplete'),
      allowNull: false,
      defaultValue: 'Incomplete'
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
