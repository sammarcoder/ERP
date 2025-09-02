const sequelize = require('../../config/database')
const { Model, DataTypes } = require("sequelize");

class StockDetail extends Model {
    static associate(models) {
        // Belongs to Stock Main
        this.belongsTo(models.StockMain, {
            foreignKey: 'stkMainId',
            as: 'stockMain',
            constraints: true,
            onDelete: 'CASCADE'
        });

        // Item association
        this.belongsTo(models.ZItems, {
            foreignKey: 'itemId',
            as: 'stock_item',
            constraints: true,
            onDelete: 'RESTRICT'
        });

        // Batch association
        // this.belongsTo(models.ZCoa, {
        //     foreignKey: 'batchnoId',
        //     as: 'batch',
        //     constraints: true,
        //     onDelete: 'SET NULL'
        // });

        // // Stock In UOM associations
        // this.belongsTo(models.ZItems, {
        //     foreignKey: 'stockInUOM',
        //     as: 'stockInUOMItem',
        //     constraints: true,
        //     onDelete: 'RESTRICT'
        // });

        // this.belongsTo(models.ZItems, {
        //     foreignKey: 'stockInSKUUOM',
        //     as: 'stockInSKUUOMItem',
        //     constraints: true,
        //     onDelete: 'RESTRICT'
        // });

        // // Stock Out UOM associations
        // this.belongsTo(models.ZItems, {
        //     foreignKey: 'stockOutUOM',
        //     as: 'stockOutUOMItem',
        //     constraints: true,
        //     onDelete: 'RESTRICT'
        // });

        // this.belongsTo(models.ZItems, {
        //     foreignKey: 'stockOutSKUUOM',
        //     as: 'stockOutSKUUOMItem',
        //     constraints: true,
        //     onDelete: 'RESTRICT'
        // });
    }
}

StockDetail.init(
    {
        // Primary Key
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        // Foreign Key to Stock Main
        stkMainId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'stock_main',
                key: 'id'
            }
        },

        // Line Identifier
        lineId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        // Item Reference
        itemId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'zitems',
                key: 'id'
            }
        },

        // Batch Reference
        batchnoId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'ZCoas',
                key: 'id'
            }
        },

        // Stock Pricing
        stockPrice: {
            type: DataTypes.DECIMAL(12, 4),
            allowNull: false
        },

        // Stock In UOM Fields
        stockInUOM: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'zitems',
                key: 'id'
            }
        },

        stockInUOMQty: {
            type: DataTypes.DECIMAL(12, 4),
            allowNull: true
        },

        // Stock Out UOM Fields
        stockOutUOM: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'zitems',
                key: 'id'
            }
        },

        stockOutUOMQty: {
            type: DataTypes.DECIMAL(12, 4),
            allowNull: true
        },

        // SKU Pricing
        stockSKUPrice: {
            type: DataTypes.DECIMAL(12, 4),
            allowNull: true
        },

        // Stock In SKU UOM Fields
        stockInSKUUOM: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'zitems',
                key: 'id'
            }
        },

        stockInSKUUOMQty: {
            type: DataTypes.DECIMAL(12, 4),
            allowNull: true
        },

        // Stock Out SKU UOM Fields
        stockOutSKUUOM: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'zitems',
                key: 'id'
            }
        },

        stockOutSKUUOMQty: {
            type: DataTypes.DECIMAL(12, 4),
            allowNull: true
        },

        // Discount Fields
        discountA: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
            defaultValue: 0
        },

        discountB: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
            defaultValue: 0
        },

        discountC: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
            defaultValue: 0
        },
    },
    {
        sequelize,
        modelName: "StockDetail",
        tableName: "stock_detail",
        timestamps: true,
    }
);

module.exports = StockDetail;
