// const sequelize = require('../../config/database')
// const { Model, DataTypes } = require("sequelize");

// // const sequelize = require("../config/database");

// class ZItems extends Model {
//     //   static associate(models) {
//     //     this.belongsTo(ZClassType,{foreignKey:'itemClass1'});
//     //     this.belongsTo(ZClassType,{foreignKey:'itemClass2'});
//     //     this.belongsTo(ZClassType,{foreignKey:'itemClass3'});
//     //     this.belongsTo(ZClassType,{foreignKey:'itemClass4'});
//     //   }


//     static associate(models) {
//         // IMPORTANT: Use aliases for each association
//         this.belongsTo(models.ZClassType, {
//             foreignKey: 'itemClass1',
//             as: 'class1',
//             constraints: true,
//             onDelete: 'RESTRICT'
//         });

//         this.belongsTo(models.ZClassType, {
//             foreignKey: 'itemClass2',
//             as: 'class2',
//             constraints: true,
//             onDelete: 'RESTRICT'
//         });

//         this.belongsTo(models.ZClassType, {
//             foreignKey: 'itemClass3',
//             as: 'class3',
//             constraints: true,
//             onDelete: 'RESTRICT'
//         });

//         this.belongsTo(models.ZClassType, {
//             foreignKey: 'itemClass4',
//             as: 'class4',
//             constraints: true,
//             onDelete: 'RESTRICT'
//         });
//         this.belongsTo(models.Uom, {
//             foreignKey: 'skuUom', as: 'uom1',
//             constraints: true,
//             onDelete: 'RESTRICT'
//         })
//         this.belongsTo(models.Uom, {
//             foreignKey: 'uom2', as: 'uomTwo',
//             constraints: true,
//             onDelete: 'RESTRICT'
//         })
//         this.belongsTo(models.Uom, {
//             foreignKey: 'uom3', as: 'uomThree',
//             constraints: true,
//             onDelete: 'RESTRICT'
//         })
//         this.belongsTo(models.Uom, {
//             foreignKey: 'assessmentUom', as: 'uom4',
//             constraints: true,
//             onDelete: 'RESTRICT'
//         })
//         this.belongsTo(models.ZCoa, {
//             foreignKey: 'purcahseAccount', as: 'purchase',
//             constraints: true,
//             onDelete: 'RESTRICT'
//         })
//         this.belongsTo(models.ZCoa, {
//             foreignKey: 'salesAccount', as: 'sales',
//             constraints: true,
//             onDelete: 'RESTRICT'
//         })
//         this.belongsTo(models.ZCoa, {
//             foreignKey: 'salesTaxAccount', as: 'salesTaxAc',
//             constraints: true,
//             onDelete: 'RESTRICT'
//         })
//     }


// }

// ZItems.init(
//     {
//         // Prime Key
//         id: {
//             type: DataTypes.INTEGER,
//             autoIncrement: true,
//             primaryKey: true,
//         },

//         itemName: {
//             type: DataTypes.STRING,
//             allowNull: false,
//             unique: true
//         },

//         // Foreign Keys for Item Class
//         itemClass1: { type: DataTypes.INTEGER, allowNull: true },
//         itemClass2: { type: DataTypes.INTEGER, allowNull: true },
//         itemClass3: { type: DataTypes.INTEGER, allowNull: true },
//         itemClass4: { type: DataTypes.INTEGER, allowNull: true },

//         // UOMs
//         skuUOM: { type: DataTypes.INTEGER, allowNull: true },
//         uom2: { type: DataTypes.INTEGER, allowNull: true },
//         uom2_qty: { type: DataTypes.DECIMAL, allowNull: true },
//         uom3: { type: DataTypes.INTEGER, allowNull: true },
//         uom3_qty: { type: DataTypes.DECIMAL, allowNull: true },
//         assessmentUOM: { type: DataTypes.INTEGER, allowNull: true },

//         weight_per_pcs: { type: DataTypes.DECIMAL, allowNull: true },
//         barCode: { type: DataTypes.BIGINT, allowNull: true },

//         // Prices
//         sellingPrice: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
//         purchasePricePKR: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
//         purchasePriceFC: { type: DataTypes.DECIMAL(12, 6), allowNull: true },
//         assessedPrice: { type: DataTypes.DECIMAL(12, 6), allowNull: true },

//         // Duty Structure
//         hsCode: { type: DataTypes.STRING, allowNull: true },
//         cd: { type: DataTypes.DECIMAL, allowNull: true },
//         ftaCd: { type: DataTypes.DECIMAL, allowNull: true },
//         acd: { type: DataTypes.DECIMAL, allowNull: true },
//         rd: { type: DataTypes.DECIMAL, allowNull: true },
//         salesTax: { type: DataTypes.DECIMAL, allowNull: true },
//         addSalesTax: { type: DataTypes.DECIMAL, allowNull: true },
//         itaxImport: { type: DataTypes.DECIMAL, allowNull: true },
//         furtherTax: { type: DataTypes.DECIMAL, allowNull: true },

//         // Supplier (FK)
//         supplier: { type: DataTypes.INTEGER, allowNull: true },

//         // Accounts (FKs)
//         purchaseAccount: { type: DataTypes.INTEGER, allowNull: true },
//         salesAccount: { type: DataTypes.INTEGER, allowNull: true },
//         salesTaxAccount: { type: DataTypes.INTEGER, allowNull: true },

//         // Binary fields
//         wastageItem: { type: DataTypes.BOOLEAN, allowNull: true, defaultValue: false },
//         isNonInventory: { type: DataTypes.BOOLEAN, allowNull: true, defaultValue: false },
//     },
//     {
//         sequelize,
//         modelName: "ZItems",
//         tableName: "zitems",
//         timestamps: true, // true by default
//     }
// );

// module.exports = ZItems;


















































const sequelize = require('../../config/database')
const { Model, DataTypes } = require("sequelize");

class ZItems extends Model {
    static associate(models) {
        // Item Class associations with aliases
        this.belongsTo(models.ZClassType, {
            foreignKey: 'itemClass1',
            as: 'class1',
            constraints: true,
            onDelete: 'SET NULL'
        });

        this.belongsTo(models.ZClassType, {
            foreignKey: 'itemClass2',
            as: 'class2',
            constraints: true,
            onDelete: 'SET NULL'
        });

        this.belongsTo(models.ZClassType, {
            foreignKey: 'itemClass3',
            as: 'class3',
            constraints: true,
            onDelete: 'SET NULL'
        });

        this.belongsTo(models.ZClassType, {
            foreignKey: 'itemClass4',
            as: 'class4',
            constraints: true,
            onDelete: 'SET NULL'
        });

        // UOM associations
        this.belongsTo(models.Uom, {
            foreignKey: 'skuUOM',
            as: 'uom1',
            constraints: true,
            onDelete: 'RESTRICT'
        });

        this.belongsTo(models.Uom, {
            foreignKey: 'uom2',
            as: 'uomTwo',
            constraints: true,
            onDelete: 'RESTRICT'
        });

        this.belongsTo(models.Uom, {
            foreignKey: 'uom3',
            as: 'uomThree',
            constraints: true,
            onDelete: 'RESTRICT'
        });

        this.belongsTo(models.Uom, {
            foreignKey: 'assessmentUOM',
            as: 'uom4',
            constraints: true,
            onDelete: 'RESTRICT'
        });

        // Account associations
        this.belongsTo(models.ZCoa, {
            foreignKey: 'purchaseAccount',
            as: 'purchase',
            constraints: true,
            onDelete: 'SET NULL'
        });

        this.belongsTo(models.ZCoa, {
            foreignKey: 'salesAccount',
            as: 'sales',
            constraints: true,
            onDelete: 'SET NULL'
        });

        this.belongsTo(models.ZCoa, {
            foreignKey: 'salesTaxAccount',
            as: 'salesTaxAc',
            constraints: true,
            onDelete: 'SET NULL'
        });
         
        this.hasMany(models.Order_Detail,{
            foreignKey: 'Item_ID',
            as : "item"
        })
        
        this.hasMany(models.StockDetail,{
            foreignKey: 'itemId',
            as : "stock_item"
        })
        
        // this.hasMany('')
        
        // Supplier association (if you have a Supplier model)
        // this.belongsTo(models.Supplier, {
        //     foreignKey: 'supplier',
        //     as: 'supplierInfo',
        //     constraints: true,
        //     onDelete: 'SET NULL'
        // });


    }
}

ZItems.init(
    {
        // Primary Key
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        itemName: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },

        // Foreign Keys for Item Classes
        itemClass1: { 
            type: DataTypes.INTEGER, 
            allowNull: true,
            references: {
                model: 'ZClassTypes',
                key: 'id'
            }
        },
        itemClass2: { 
            type: DataTypes.INTEGER, 
            allowNull: true,
            references: {
                model: 'ZClassTypes',
                key: 'id'
            }
        },
        itemClass3: { 
            type: DataTypes.INTEGER, 
            allowNull: true,
            references: {
                model: 'ZClassTypes',
                key: 'id'
            }
        },
        itemClass4: { 
            type: DataTypes.INTEGER, 
            allowNull: true,
            references: {
                model: 'ZClassTypes',
                key: 'id'
            }
        },

        // UOM Fields - FIXED: No duplicates
        skuUOM: { 
            type: DataTypes.INTEGER, 
            allowNull: true,
            references: {
                model: 'uoms',
                key: 'id'
            }
        },
        uom2: { 
            type: DataTypes.INTEGER, 
            allowNull: true,
            references: {
                model: 'uoms',
                key: 'id'
            }
        },
        uom2_qty: { 
            type: DataTypes.DECIMAL(10, 2), 
            allowNull: true 
        },
        uom3: { 
            type: DataTypes.INTEGER, 
            allowNull: true,
            references: {
                model: 'uoms',
                key: 'id'
            }
        },
        uom3_qty: { 
            type: DataTypes.DECIMAL(10, 2), 
            allowNull: true 
        },
        assessmentUOM: { 
            type: DataTypes.INTEGER, 
            allowNull: true,
            references: {
                model: 'uoms',
                key: 'id'
            }
        },

        // Product Details
        weight_per_pcs: { 
            type: DataTypes.DECIMAL(10, 4), 
            allowNull: true 
        },
        barCode: { 
            type: DataTypes.BIGINT, 
            allowNull: true 
        },

        // Pricing Fields
        sellingPrice: { 
            type: DataTypes.DECIMAL(10, 2), 
            allowNull: true 
        },
        purchasePricePKR: { 
            type: DataTypes.DECIMAL(10, 2), 
            allowNull: true 
        },
        purchasePriceFC: { 
            type: DataTypes.DECIMAL(12, 6), 
            allowNull: true 
        },
        assessedPrice: { 
            type: DataTypes.DECIMAL(12, 6), 
            allowNull: true 
        },

        // Duty Structure
        hsCode: { 
            type: DataTypes.STRING, 
            allowNull: true 
        },
        cd: { 
            type: DataTypes.DECIMAL(5, 2), 
            allowNull: true 
        },
        ftaCd: { 
            type: DataTypes.DECIMAL(5, 2), 
            allowNull: true 
        },
        acd: { 
            type: DataTypes.DECIMAL(5, 2), 
            allowNull: true 
        },
        rd: { 
            type: DataTypes.DECIMAL(5, 2), 
            allowNull: true 
        },
        salesTax: { 
            type: DataTypes.DECIMAL(5, 2), 
            allowNull: true 
        },
        addSalesTax: { 
            type: DataTypes.DECIMAL(5, 2), 
            allowNull: true 
        },
        itaxImport: { 
            type: DataTypes.DECIMAL(5, 2), 
            allowNull: true 
        },
        furtherTax: { 
            type: DataTypes.DECIMAL(5, 2), 
            allowNull: true 
        },

        // Supplier Foreign Key
        supplier: { 
            type: DataTypes.INTEGER, 
            allowNull: true 
        },

        // Account Foreign Keys - FIXED: No duplicates, typo corrected
        purchaseAccount: { 
            type: DataTypes.INTEGER, 
            allowNull: true,
            references: {
                model: 'ZCoas',
                key: 'id'
            }
        },
        salesAccount: { 
            type: DataTypes.INTEGER, 
            allowNull: true,
            references: {
                model: 'ZCoas',
                key: 'id'
            }
        },
        salesTaxAccount: { 
            type: DataTypes.INTEGER, 
            allowNull: true,
            references: {
                model: 'ZCoas',
                key: 'id'
            }
        },

        // Boolean Fields
        wastageItem: { 
            type: DataTypes.BOOLEAN, 
            allowNull: true, 
            defaultValue: false 
        },
        isNonInventory: { 
            type: DataTypes.BOOLEAN, 
            allowNull: true, 
            defaultValue: false 
        },
    },
    {
        sequelize,
        modelName: "ZItems",
        tableName: "zitems",
        timestamps: true, // adds createdAt and updatedAt automatically
    }
);

module.exports = ZItems;
