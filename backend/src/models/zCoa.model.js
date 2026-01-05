const sequelize = require('../../config/database');
const { DataTypes } = require('sequelize');

const ZCoa = sequelize.define('ZCoa', {
    acName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: { msg: 'Account name cannot be empty' } },
        unique: true
    },

    // FIXED: Remove notEmpty validators from nullable fields
    ch1Id: {
        type: DataTypes.INTEGER,
        allowNull: true
        // REMOVED: validate: { notEmpty: { msg: 'Control Head 1 ID cannot be empty' } }
    },
    ch2Id: {
        type: DataTypes.INTEGER,
        allowNull: true
        // REMOVED: validate: { notEmpty: { msg: 'Control Head 2 ID cannot be empty' } }
    },
    coaTypeId: {
        type: DataTypes.INTEGER,
        allowNull: false, // This is required, so keep notEmpty
        validate: { notEmpty: { msg: 'COA Type ID cannot be empty' } }
    },

    // FIXED: Remove notEmpty from all nullable fields
    setupName: {
        type: DataTypes.STRING,
        allowNull: true
        // REMOVED: validate: { notEmpty: { msg: 'Setup Name cannot be empty' } }
    },
    adress: {
        type: DataTypes.STRING,
        allowNull: true
        // REMOVED: validate: { notEmpty: { msg: 'Address cannot be empty' } }
    },
    city: {
        type: DataTypes.STRING,
        allowNull: true
        // REMOVED: validate: { notEmpty: { msg: 'City cannot be empty' } }
    },
    personName: {
        type: DataTypes.STRING,
        allowNull: true
        // REMOVED: validate: { notEmpty: { msg: 'Person Name cannot be empty' } }
    },
    mobileNo: {
        type: DataTypes.STRING,
        allowNull: true
        // REMOVED: validate: { notEmpty: { msg: 'Mobile Number cannot be empty' } }
    },
    taxStatus: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
    },
    ntn: {
        type: DataTypes.STRING,
        allowNull: true
        // REMOVED: validate: { notEmpty: { msg: 'NTN cannot be empty' } }
    },
    cnic: {
        type: DataTypes.STRING,
        allowNull: true
        // REMOVED: validate: { notEmpty: { msg: 'CNIC cannot be empty' } }
    },
    salesLimit: {
        type: DataTypes.STRING,
        allowNull: true
        // REMOVED: validate: { notEmpty: { msg: 'Sales Limit cannot be empty' } }
    },
    credit: {
        type: DataTypes.STRING,
        allowNull: true
        // REMOVED: validate: { notEmpty: { msg: 'Credit cannot be empty' } }
    },
    creditDoys: {
        type: DataTypes.STRING,
        allowNull: true
        // REMOVED: validate: { notEmpty: { msg: 'Credit Days cannot be empty' } }
    },
    salesMan: {
        type: DataTypes.STRING,
        allowNull: true
        // REMOVED: validate: { notEmpty: { msg: 'Salesman cannot be empty' } }
    },
    isJvBalance: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
    },

    isPettyCash: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
    },

    // Discount fields remain the same
    discountA: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 0.00,
        validate: {
            min: 0,
            max: 100,
            isDecimal: { msg: 'Discount A must be a valid decimal number' }
        }
    },
    discountB: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 0.00,
        validate: {
            min: 0,
            max: 100,
            isDecimal: { msg: 'Discount B must be a valid decimal number' }
        }
    },
    discountC: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 0.00,
        validate: {
            min: 0,
            max: 100,
            isDecimal: { msg: 'Discount C must be a valid decimal number' }
        }
    },
    batch_no: {
        type: DataTypes.STRING(30),
        allowNull: true
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
        allowNull:true
    }
});

// Keep your existing associations
ZCoa.associate = function (models) {
    if (models && models.ZControlHead2) {
        ZCoa.belongsTo(models.ZControlHead2, { foreignKey: 'ch2Id' });
    }
    if (models && models.ZControlHead1) {
        ZCoa.belongsTo(models.ZControlHead1, { foreignKey: 'ch1Id' })
    }
    if (models && models.ZCOAType) {
        ZCoa.belongsTo(models.ZCOAType, { foreignKey: 'coaTypeId' });
    }

    if (models && models.ZItems) {
        ZCoa.hasMany(models.ZItems, { foreignKey: 'purchaseAccount', as: 'purchase' })
    }
    if (models && models.ZItems) {
        ZCoa.hasMany(models.ZItems, { foreignKey: 'salesTaxAccount', as: 'salesTaxAc' })
    }
    if (models && models.ZItems) {
        ZCoa.hasMany(models.ZItems, { foreignKey: 'salesAccount', as: 'sales' })
    }
    if (models && models.Order_Main) {
        ZCoa.hasMany(models.Order_Main, {
            foreignKey: 'COA_ID',
            as: 'orders',
            onDelete: 'RESTRICT',
            onUpdate: 'CASCADE'
        });
    }
    if (models && models.Stk_main) {
        ZCoa.hasMany(models.Stk_main, {
            foreignKey: 'COA_ID',
            as: 'account',
            onDelete: 'RESTRICT',
            onUpdate: 'CASCADE'
        });
    }
    if (models && models.Stk_main) {
        ZCoa.hasMany(models.Stk_main, {
            foreignKey: 'Carriage_ID',
            as: 'Voucher_carriage_account',
            onDelete: 'RESTRICT',
            onUpdate: 'CASCADE'
        });
    }
    if (models && models.Ztransporter) {
        ZCoa.belongsTo(models.Ztransporter, {
            foreignKey: 'Transporter_ID',
            as: 'transporter'
        });
    }
    if (models && models.Stk_Detail) {
        ZCoa.hasMany(models.Stk_Detail, {
            foreignKey: 'batchno',
            as: 'stock_batch',
            onDelete: 'RESTRICT',
            onUpdate: 'CASCADE'
        });
    }
    
};

module.exports = ZCoa;
