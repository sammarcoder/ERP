// const sequelize = require('../../config/database')
// const { Model, DataTypes } = require("sequelize");

// class StockMain extends Model {
//     static associate(models) {
//         // Stock Type association
//         this.belongsTo(models.ZvoucherType, {
//             foreignKey: 'stockTypeId',
//             as: 'stockType',
//             constraints: true,
//             onDelete: 'RESTRICT'
//         });

//         // COA associations
//         this.belongsTo(models.ZCoa, {
//             foreignKey: 'coaId',
//             as: 'mainAccount',
//             constraints: true,
//             onDelete: 'RESTRICT'
//         });

//         // this.belongsTo(models.ZCoa, {
//         //     foreignKey: 'purchaseBatchno',
//         //     as: 'purchaseBatch',
//         //     constraints: true,
//         //     onDelete: 'SET NULL'
//         // });

//         // this.belongsTo(models.ZCoa, {
//         //     foreignKey: 'carriageCoa',
//         //     as: 'carriageAccount',
//         //     constraints: true,
//         //     onDelete: 'SET NULL'
//         // });

//         // Has many relationship with Stock Detail
//         this.hasMany(models.StockDetail, {
//             foreignKey: 'stkMainId',
//             as: 'stockDetails',
//             onDelete: 'CASCADE'
//         });
//     }
// }

// StockMain.init(
//     {
//         // Primary Key
//         id: {
//             type: DataTypes.INTEGER,
//             autoIncrement: true,
//             primaryKey: true,
//         },

//         // Foreign Keys
//         stockTypeId: {
//             type: DataTypes.INTEGER,
//             allowNull: false,
//             // references: {
//             //     model: 'zvoucherTypes',
//             //     key: 'id'
//             // }
//         },

//         coaId: {
//             type: DataTypes.INTEGER,
//             allowNull: false,
//             references: {
//                 model: 'ZCoas',
//                 key: 'id'
//             }
//         },

//         // Transaction Details
//         date: {
//             type: DataTypes.DATE,
//             allowNull: false
//         },

//         number: {
//             type: DataTypes.STRING,
//             allowNull: false,
//             unique: true
//         },

//         // Status Fields
//         status: {
//             type: DataTypes.ENUM('Post', 'UnPost'),
//             allowNull: false,
//             defaultValue: 'UnPost'
//         },

//         // Purchase Information
//         purchaseType: {
//             type: DataTypes.ENUM('Local', 'Foreign', 'Mfg', 'Local selling'),
//             allowNull: false
//         },

//         purchaseBatchno: {
//             type: DataTypes.INTEGER,
//             allowNull: true,
//             // references: {
//             //     model: 'ZCoas',
//             //     key: 'id'
//             // }
//         },

//         statusAccountEntry: {
//             type: DataTypes.BOOLEAN,
//             allowNull: false,
//             defaultValue: false
//         },

//         // Carriage Information
//         carriageCoa: {
//             type: DataTypes.INTEGER,
//             allowNull: true,
//             // references: {
//             //     model: 'ZCoas',
//             //     key: 'id'
//             // }
//         },

//         carriageAmount: {
//             type: DataTypes.DECIMAL(12, 2),
//             allowNull: true,
//             defaultValue: 0
//         },
//     },
//     {
//         sequelize,
//         modelName: "StockMain",
//         tableName: "stock_main",
//         timestamps: true,
//     }
// );

// module.exports = StockMain;




















































// models/Stk_main.js
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Stk_main = sequelize.define('Stk_main', {
    ID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: 'Prime Key'
    },
    Stock_Type_ID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Foreign key to Zvoucher_type (1=GRN, 2=Dispatch)'
    },
    COA_ID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Foreign key to ZCOA (Supplier/Customer)'
    },
    Date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    Number: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        comment: 'Auto generated GRN/Dispatch number'
    },
    Status: {
        type: DataTypes.ENUM('Post', 'UnPost'),
        defaultValue: 'UnPost'
    },
    Purchase_Type: {
        type: DataTypes.ENUM('Local', 'Foreign', 'Mfg', 'Local selling'),
        comment: 'Local/Foreign/Mfg/ Local selling'
    },
    Purchase_Batchno: {
        type: DataTypes.INTEGER,
        comment: 'Foreign key to ZCOA for batch reference'
    },
    Status_Account_Entry: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        comment: 'True/False for accounting entry status'
    },
    //   Carriage_Cost: {
    //     type: DataTypes.INTEGER,
    //     comment: 'Foreign key to ZCOA for carriage account'
    //   },
    Carriage_Amount: {
        type: DataTypes.DECIMAL(10, 2),
        comment: 'Numeric field for carriage amount'
    },
    //   Transporter: {
    //     type: DataTypes.INTEGER,
    //     comment: 'Foreign key to Ztransporter'
    //   },
    Order_Main_ID: {
        type: DataTypes.INTEGER,
        comment: 'Reference to original PO/SO - Need to update Order_main table'
    }
}, {
    tableName: 'Stk_main',
    timestamps: true
});

// Define associations following your pattern
Stk_main.associate = function (models) {
    // Stk_main has many Stk_Detail
    Stk_main.hasMany(models.Stk_Detail, {
        foreignKey: 'STK_Main_ID',
        as: 'stock_details'
    });

    // Stk_main belongs to ZvoucherType (stock type)
    Stk_main.belongsTo(models.ZvoucherType, {
        foreignKey: 'Stock_Type_ID',
        as: 'stockType'
    });

    // Stk_main belongs to ZCOA (supplier/customer)
    Stk_main.belongsTo(models.ZCoa, {
        foreignKey: 'COA_ID',
        as: 'account'
    });

    // Stk_main belongs to ZCOA for batch reference
    //   Stk_main.belongsTo(models.ZCOA, {
    //     foreignKey: 'Purchase_Batchno',
    //     as: 'batchAccount'
    //   });

    // Stk_main belongs to ZCOA for carriage cost
    //   Stk_main.belongsTo(models.ZCOA, {
    //     foreignKey: 'Carriage_Cost',
    //     as: 'carriageAccount'
    //   });

    // Stk_main belongs to Ztransporter
    //   Stk_main.belongsTo(models.Ztransporter, {
    //     foreignKey: 'Transporter',
    //     as: 'transporter'
    //   });

    // Stk_main belongs to Order_Main (original order)
    Stk_main.belongsTo(models.Order_Main, {
        foreignKey: 'Order_Main_ID',
        as: 'order'
    });
};

module.exports = Stk_main;
