// const { Model, DataTypes } = require('sequelize');

// class Order_Detail extends Model {
//   static init(sequelize) {
//     return super.init(
//       {
//         Order_Main_Id: {
//           type: DataTypes.INTEGER,
//           allowNull: false,
//           references: {
//             model: 'Order_Main',
//             key: 'ID'
//           }
//         },
//         Line_Id: {
//           type: DataTypes.INTEGER,
//           allowNull: false
//         },
//         Item_ID: {
//           type: DataTypes.INTEGER,
//           allowNull: false,
//           references: {
//             model: 'items',
//             key: 'id'
//           }
//         },
//         Price: {
//           type: DataTypes.DECIMAL(10, 2),
//           allowNull: false
//         },
//         Stock_In_UOM: {
//           type: DataTypes.INTEGER,
//           allowNull: false
//         },
//         Stock_In_UOM_Qty: {
//           type: DataTypes.DECIMAL(10, 3),
//           allowNull: false
//         },
//         Stock_SKU_Price: {
//           type: DataTypes.DECIMAL(10, 2),
//           allowNull: false
//         },
//         Stock_In_SKU_UOM: {
//           type: DataTypes.INTEGER,
//           allowNull: false
//         },
//         Stock_In_SKU_UOM_Qty: {
//           type: DataTypes.DECIMAL(10, 3),
//           allowNull: false
//         },
//         Stock_out_UOM: {
//           type: DataTypes.INTEGER,
//           allowNull: false
//         },
//         Stock_out_UOM_Qty: {
//           type: DataTypes.DECIMAL(10, 3),
//           allowNull: false
//         },
//         Stock_out_SKU_UOM: {
//           type: DataTypes.INTEGER,
//           allowNull: false
//         },
//         Stock_out_SKU_UOM_Qty: {
//           type: DataTypes.DECIMAL(10, 3),
//           allowNull: false
//         },
//         Discount_A: {
//           type: DataTypes.DECIMAL(10, 2),
//           allowNull: true,
//           defaultValue: 0
//         },
//         Discount_B: {
//           type: DataTypes.DECIMAL(10, 2),
//           allowNull: true,
//           defaultValue: 0
//         },
//         Discount_C: {
//           type: DataTypes.DECIMAL(10, 2),
//           allowNull: true,
//           defaultValue: 0
//         },
//         Goods: {
//           type: DataTypes.TEXT,
//           allowNull: true
//         },
//         Remarks: {
//           type: DataTypes.TEXT,
//           allowNull: true
//         }
//       },
//       {
//         sequelize,
//         modelName: 'Order_Detail',
//         tableName: 'Order_Detail',
//         timestamps: false,
//         underscored: false,
//         indexes: [
//           {
//             unique: true,
//             fields: ['Order_Main_Id', 'Line_Id']
//           }
//         ]
//       }
//     );
//   }


//   static associate(models) {
//     // Define associations here
//     // Example:
//     // this.belongsTo(models.Order_Main, {
//     //   foreignKey: 'Order_Main_Id',
//     //   as: 'orderMain'
//     // });
    
//     // this.belongsTo(models.Item, {
//     //   foreignKey: 'Item_ID',
//     //   as: 'item'
//     // });
    
//     // this.belongsTo(models.UOM, {
//     //   foreignKey: 'Stock_In_UOM',
//     //   as: 'stockInUOM'
//     // });
//   }
// }

// module.exports = Order_Detail;






























// const { Model, DataTypes } = require('sequelize');
// const sequelize = require('../../config/database');

// class Order_Detail extends Model {
//   static associate(models) {
//     // Define associations here
//     this.belongsTo(models.Order_Main, {
//       foreignKey: 'Order_Main_Id',
//       as: 'orderMain'
//     });
    
//     this.belongsTo(models.ZItems, {
//       foreignKey: 'Item_ID',
//       as: 'item'
//     });
    
//     // this.belongsTo(models.Uom, {
//     //   foreignKey: 'Stock_In_UOM',
//     //   as: 'stockInUOM'
//     // });
    
//     // this.belongsTo(models.Uom, {
//     //   foreignKey: 'Stock_In_SKU_UOM',
//     //   as: 'stockInSkuUOM'
//     // });
    
//     // this.belongsTo(models.Uom, {
//     //   foreignKey: 'Stock_out_UOM',
//     //   as: 'stockOutUOM'
//     // });
    
//     // this.belongsTo(models.Uom, {
//     //   foreignKey: 'Stock_out_SKU_UOM',
//     //   as: 'stockOutSkuUOM'
//     // });
//   }
// }

// Order_Detail.init(
//   {
//     Order_Main_Id: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       // references: {
//       //   model: 'Order_Main',
//       //   key: 'ID'
//       // }
//     },
//     Line_Id: {
//       type: DataTypes.INTEGER,
//       allowNull: false
//     },
//     Item_ID: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       // references: {
//       //   model: 'zitems',
//       //   key: 'id'
//       // }
//     },
//     Price: {
//       type: DataTypes.DECIMAL(10, 2),
//       allowNull: false
//     },
//     Stock_In_UOM: {
//       type: DataTypes.INTEGER,
//       allowNull: false
//     },
//     Stock_In_UOM_Qty: {
//       type: DataTypes.DECIMAL(10, 3),
//       allowNull: false
//     },
//     Stock_SKU_Price: {
//       type: DataTypes.DECIMAL(10, 2),
//       allowNull: false
//     },
//     Stock_In_SKU_UOM: {
//       type: DataTypes.INTEGER,
//       allowNull: false
//     },
//     Stock_In_SKU_UOM_Qty: {
//       type: DataTypes.DECIMAL(10, 3),
//       allowNull: false
//     },
//     Stock_out_UOM: {
//       type: DataTypes.INTEGER,
//       allowNull: false
//     },
//     Stock_out_UOM_Qty: {
//       type: DataTypes.DECIMAL(10, 3),
//       allowNull: false
//     },
//     Stock_out_SKU_UOM: {
//       type: DataTypes.INTEGER,
//       allowNull: false
//     },
//     Stock_out_SKU_UOM_Qty: {
//       type: DataTypes.DECIMAL(10, 3),
//       allowNull: false
//     },
//     Discount_A: {
//       type: DataTypes.DECIMAL(10, 2),
//       allowNull: true,
//       defaultValue: 0
//     },
//     Discount_B: {
//       type: DataTypes.DECIMAL(10, 2),
//       allowNull: true,
//       defaultValue: 0
//     },
//     Discount_C: {
//       type: DataTypes.DECIMAL(10, 2),
//       allowNull: true,
//       defaultValue: 0
//     },
//     Goods: {
//       type: DataTypes.TEXT,
//       allowNull: true
//     },
//     Remarks: {
//       type: DataTypes.TEXT,
//       allowNull: true
//     }
//   },
//   {
//     sequelize,
//     modelName: 'Order_Detail',
//     tableName: 'Order_Detail',
//     timestamps: false,
//     // underscored: false,
//     // indexes: [
//     //   {
//     //     unique: true,
//     //     fields: ['Order_Main_Id', 'Line_Id']
//     //   }
//     // ]
//   }
// );

// module.exports = Order_Detail;


































const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

class Order_Detail extends Model {
  static associate(models) {
    // Relationship with Order_Main
    this.belongsTo(models.Order_Main, {
      foreignKey: 'Order_Main_Id',
      as: 'orderMain',
      onDelete: 'CASCADE'
    });
    
    // Relationship with ZItems
    this.belongsTo(models.ZItems, {
      foreignKey: 'Item_ID',
      as: 'item',
      constraints: false  // This prevents auto-adding foreign key column
    });
  }
}

Order_Detail.init(
  {
    ID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    Order_Main_Id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Order_Main',
        key: 'ID'
      }
    },
    Line_Id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    Item_ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'zitems',
        key: 'id'
      }
    },
    Price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0
    },
    Stock_In_UOM: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Stock_In_UOM_Qty: {
      type: DataTypes.DECIMAL(10, 3),
      allowNull: true,
      defaultValue: 0
    },
    Stock_SKU_Price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0
    },
    Stock_In_SKU_UOM: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Stock_In_SKU_UOM_Qty: {
      type: DataTypes.DECIMAL(10, 3),
      allowNull: true,
      defaultValue: 0
    },
    Stock_out_UOM: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Stock_out_UOM_Qty: {
      type: DataTypes.DECIMAL(10, 3),
      allowNull: true,
      defaultValue: 0
    },
    Stock_out_SKU_UOM: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Stock_out_SKU_UOM_Qty: {
      type: DataTypes.DECIMAL(10, 3),
      allowNull: true,
      defaultValue: 0
    },
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
    Goods: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    Remarks: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  },
  {
    sequelize,
    modelName: 'Order_Detail',
    tableName: 'Order_Detail',
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['Order_Main_Id', 'Line_Id']
      }
    ]
  }
);

module.exports = Order_Detail;
