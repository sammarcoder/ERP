
// models/ZvoucherType.js (update your existing)
const sequelize = require('../../config/database');
const { DataTypes } = require('sequelize');

const ZvoucherType = sequelize.define('ZvoucherType', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    vType: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            notEmpty: true,
        },
        comment: 'Voucher/Stock type name'
    }
}, {
    tableName: 'ZvoucherType',
    // freezeTableName: true,
    timestamps: true
});

// Updated associations following your pattern
ZvoucherType.associate = function (models) {
    // Existing associations
    ZvoucherType.hasMany(models.JournalMaster, {
        foreignKey: 'voucherTypeId',
        as: 'journalMasters'
    });

    // ADDED: Stock type associations
    ZvoucherType.hasMany(models.Stk_main, {
        foreignKey: 'Stock_Type_ID',
        as: 'stockTransactions'
    });

    // ADDED: Order type associations
    ZvoucherType.hasMany(models.Order_Main, {
        foreignKey: 'Stock_Type_ID',
        as: 'orders'
    });
};

module.exports = ZvoucherType;














