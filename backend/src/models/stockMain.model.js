const sequelize = require('../../config/database')
const { Model, DataTypes } = require("sequelize");

class StockMain extends Model {
    static associate(models) {
        // Stock Type association
        this.belongsTo(models.ZvoucherType, {
            foreignKey: 'stockTypeId',
            as: 'stockType',
            constraints: true,
            onDelete: 'RESTRICT'
        });

        // COA associations
        this.belongsTo(models.ZCoa, {
            foreignKey: 'coaId',
            as: 'mainAccount',
            constraints: true,
            onDelete: 'RESTRICT'
        });

        // this.belongsTo(models.ZCoa, {
        //     foreignKey: 'purchaseBatchno',
        //     as: 'purchaseBatch',
        //     constraints: true,
        //     onDelete: 'SET NULL'
        // });

        // this.belongsTo(models.ZCoa, {
        //     foreignKey: 'carriageCoa',
        //     as: 'carriageAccount',
        //     constraints: true,
        //     onDelete: 'SET NULL'
        // });

        // Has many relationship with Stock Detail
        this.hasMany(models.StockDetail, {
            foreignKey: 'stkMainId',
            as: 'stockDetails',
            onDelete: 'CASCADE'
        });
    }
}

StockMain.init(
    {
        // Primary Key
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        // Foreign Keys
        stockTypeId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            // references: {
            //     model: 'zvoucherTypes',
            //     key: 'id'
            // }
        },

        coaId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'ZCoas',
                key: 'id'
            }
        },

        // Transaction Details
        date: {
            type: DataTypes.DATE,
            allowNull: false
        },

        number: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },

        // Status Fields
        status: {
            type: DataTypes.ENUM('Post', 'UnPost'),
            allowNull: false,
            defaultValue: 'UnPost'
        },

        // Purchase Information
        purchaseType: {
            type: DataTypes.ENUM('Local', 'Foreign', 'Mfg', 'Local selling'),
            allowNull: false
        },

        purchaseBatchno: {
            type: DataTypes.INTEGER,
            allowNull: true,
            // references: {
            //     model: 'ZCoas',
            //     key: 'id'
            // }
        },

        statusAccountEntry: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },

        // Carriage Information
        carriageCoa: {
            type: DataTypes.INTEGER,
            allowNull: true,
            // references: {
            //     model: 'ZCoas',
            //     key: 'id'
            // }
        },

        carriageAmount: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: true,
            defaultValue: 0
        },
    },
    {
        sequelize,
        modelName: "StockMain",
        tableName: "stock_main",
        timestamps: true,
    }
);

module.exports = StockMain;
