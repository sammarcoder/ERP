// const sequelize = require('../../config/database')
// const { Model, DataTypes } = require("sequelize");

// class StockDetail extends Model {
//     static associate(models) {
//         // Belongs to Stock Main
//         this.belongsTo(models.StockMain, {
//             foreignKey: 'stkMainId',
//             as: 'stockMain',
//             constraints: true,
//             onDelete: 'CASCADE'
//         });

//         // Item association
//         this.belongsTo(models.ZItems, {
//             foreignKey: 'itemId',
//             as: 'stock_item',
//             constraints: true,
//             onDelete: 'RESTRICT'
//         });

//         // Batch association
//         // this.belongsTo(models.ZCoa, {
//         //     foreignKey: 'batchnoId',
//         //     as: 'batch',
//         //     constraints: true,
//         //     onDelete: 'SET NULL'
//         // });

//         // // Stock In UOM associations
//         // this.belongsTo(models.ZItems, {
//         //     foreignKey: 'stockInUOM',
//         //     as: 'stockInUOMItem',
//         //     constraints: true,
//         //     onDelete: 'RESTRICT'
//         // });

//         // this.belongsTo(models.ZItems, {
//         //     foreignKey: 'stockInSKUUOM',
//         //     as: 'stockInSKUUOMItem',
//         //     constraints: true,
//         //     onDelete: 'RESTRICT'
//         // });

//         // // Stock Out UOM associations
//         // this.belongsTo(models.ZItems, {
//         //     foreignKey: 'stockOutUOM',
//         //     as: 'stockOutUOMItem',
//         //     constraints: true,
//         //     onDelete: 'RESTRICT'
//         // });

//         // this.belongsTo(models.ZItems, {
//         //     foreignKey: 'stockOutSKUUOM',
//         //     as: 'stockOutSKUUOMItem',
//         //     constraints: true,
//         //     onDelete: 'RESTRICT'
//         // });
//     }
// }

// StockDetail.init(
//     {
//         // Primary Key
//         id: {
//             type: DataTypes.INTEGER,
//             autoIncrement: true,
//             primaryKey: true,
//         },

//         // Foreign Key to Stock Main
//         stkMainId: {
//             type: DataTypes.INTEGER,
//             allowNull: false,
//             references: {
//                 model: 'stock_main',
//                 key: 'id'
//             }
//         },

//         // Line Identifier
//         lineId: {
//             type: DataTypes.INTEGER,
//             allowNull: false
//         },

//         // Item Reference
//         itemId: {
//             type: DataTypes.INTEGER,
//             allowNull: false,
//             references: {
//                 model: 'zitems',
//                 key: 'id'
//             }
//         },

//         // Batch Reference
//         batchnoId: {
//             type: DataTypes.INTEGER,
//             allowNull: true,
//             references: {
//                 model: 'ZCoas',
//                 key: 'id'
//             }
//         },

//         // Stock Pricing
//         stockPrice: {
//             type: DataTypes.DECIMAL(12, 4),
//             allowNull: false
//         },

//         // Stock In UOM Fields
//         stockInUOM: {
//             type: DataTypes.INTEGER,
//             allowNull: true,
//             references: {
//                 model: 'zitems',
//                 key: 'id'
//             }
//         },

//         stockInUOMQty: {
//             type: DataTypes.DECIMAL(12, 4),
//             allowNull: true
//         },

//         // Stock Out UOM Fields
//         stockOutUOM: {
//             type: DataTypes.INTEGER,
//             allowNull: true,
//             references: {
//                 model: 'zitems',
//                 key: 'id'
//             }
//         },

//         stockOutUOMQty: {
//             type: DataTypes.DECIMAL(12, 4),
//             allowNull: true
//         },

//         // SKU Pricing
//         stockSKUPrice: {
//             type: DataTypes.DECIMAL(12, 4),
//             allowNull: true
//         },

//         // Stock In SKU UOM Fields
//         stockInSKUUOM: {
//             type: DataTypes.INTEGER,
//             allowNull: true,
//             references: {
//                 model: 'zitems',
//                 key: 'id'
//             }
//         },

//         stockInSKUUOMQty: {
//             type: DataTypes.DECIMAL(12, 4),
//             allowNull: true
//         },

//         // Stock Out SKU UOM Fields
//         stockOutSKUUOM: {
//             type: DataTypes.INTEGER,
//             allowNull: true,
//             references: {
//                 model: 'zitems',
//                 key: 'id'
//             }
//         },

//         stockOutSKUUOMQty: {
//             type: DataTypes.DECIMAL(12, 4),
//             allowNull: true
//         },

//         // Discount Fields
//         discountA: {
//             type: DataTypes.DECIMAL(10, 2),
//             allowNull: true,
//             defaultValue: 0
//         },

//         discountB: {
//             type: DataTypes.DECIMAL(10, 2),
//             allowNull: true,
//             defaultValue: 0
//         },

//         discountC: {
//             type: DataTypes.DECIMAL(10, 2),
//             allowNull: true,
//             defaultValue: 0
//         },
//     },
//     {
//         sequelize,
//         modelName: "StockDetail",
//         tableName: "stock_detail",
//         timestamps: true,
//     }
// );

// module.exports = StockDetail;






























































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
    allowNull: false,
    comment: 'Foreign key to Stk_main'
  },
  Line_Id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  Item_ID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Foreign key to Zitems'
  },
  Batchno_id: {
    type: DataTypes.INTEGER,
    comment: 'Foreign key to ZCOA (For L.C.L.P P.S Records)'
  },
  
  // Price fields
  Stock_Price: {
    type: DataTypes.DECIMAL(10, 2),
    comment: 'Numeric field for stock price'
  },
  Stock_SKU_Price: {
    type: DataTypes.DECIMAL(10, 2),
    comment: 'Numeric field for SKU price'
  },

  // UOM1 fields (Pieces)
  Stock_In_UOM: {
    type: DataTypes.INTEGER,
    comment: 'Foreign key to Zitems UOM1'
  },
  Stock_In_UOM_Qty: {
    type: DataTypes.DECIMAL(10, 3),
    comment: 'Numeric quantity in UOM1 (for receiving)'
  },
  Stock_out_UOM: {
    type: DataTypes.INTEGER,
    comment: 'Foreign key to Zitems UOM1'
  },
  Stock_out_UOM_Qty: {
    type: DataTypes.DECIMAL(10, 3),
    comment: 'Numeric quantity in UOM1 (for dispatching)'
  },

  // UOM2 fields (Dozens/SKU)
  Stock_In_SKU_UOM: {
    type: DataTypes.INTEGER,
    comment: 'Foreign key to Zitems UOM2'
  },
  Stock_In_SKU_UOM_Qty: {
    type: DataTypes.DECIMAL(10, 3),
    comment: 'Numeric quantity in UOM2 (for receiving)'
  },
  Stock_out_SKU_UOM: {
    type: DataTypes.INTEGER,
    comment: 'Foreign key to Zitems UOM2'
  },
  Stock_out_SKU_UOM_Qty: {
    type: DataTypes.DECIMAL(10, 3),
    comment: 'Numeric quantity in UOM2 (for dispatching)'
  },

  // UOM3 fields (Boxes) - ADDED based on our discussions
  Stock_In_UOM3_Qty: {
    type: DataTypes.DECIMAL(10, 3),
    comment: 'Numeric quantity in UOM3 (for receiving)'
  },
  Stock_out_UOM3_Qty: {
    type: DataTypes.DECIMAL(10, 3),
    comment: 'Numeric quantity in UOM3 (for dispatching)'
  }
}, {
  tableName: 'Stk_Detail',
  timestamps: true
});

// Define associations following your pattern
Stk_Detail.associate = function (models) {
  // Stk_Detail belongs to Stk_main
  Stk_Detail.belongsTo(models.Stk_main, {
    foreignKey: 'STK_Main_ID',
    as: 'stock_details'
  });

  // Stk_Detail belongs to ZItems
  Stk_Detail.belongsTo(models.ZItems, {
    foreignKey: 'Item_ID',
    as: 'stock_item'
  });

  // Stk_Detail belongs to ZCOA for batch reference
//   Stk_Detail.belongsTo(models.ZCOA, {
//     foreignKey: 'Batchno_id',
//     as: 'batchAccount'
//   });

  // UOM associations for receiving (Stock_In)
  Stk_Detail.belongsTo(models.ZItems, {
    foreignKey: 'Stock_In_UOM',
    as: 'inUOM1'
  });

  Stk_Detail.belongsTo(models.ZItems, {
    foreignKey: 'Stock_In_SKU_UOM',
    as: 'inUOM2'
  });

  // UOM associations for dispatching (Stock_out)
  Stk_Detail.belongsTo(models.ZItems, {
    foreignKey: 'Stock_out_UOM',
    as: 'outUOM1'
  });

  Stk_Detail.belongsTo(models.ZItems, {
    foreignKey: 'Stock_out_SKU_UOM',
    as: 'outUOM2'
  });
};

module.exports = Stk_Detail;
