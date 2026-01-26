const sequelize = require('../../config/database');
const { DataTypes } = require('sequelize');

const JournalMaster = sequelize.define('JournalMaster', {
    date: {
        type: DataTypes.DATE,
        allowNull: false,

    },
    stk_Main_ID: {
        type: DataTypes.INTEGER,
    },
    voucherTypeId: {
        type: DataTypes.INTEGER,
        allowNull: false,

    },
    voucherNo: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
    },
    balacingId: {
        type: DataTypes.INTEGER,
        allowNull: true,

    },
    status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    isOpening: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
    },
    linkedJournalId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
        comment: 'Links Petty Cash voucher to parent Journal Voucher'
    },
    is_partially_deleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    }
},
    {
        tableName: 'JournalMaster', // 👈 match your existing migration table name
        freezeTableName: true,
    }
);

// Define associations in a separate function
JournalMaster.associate = function (models) {
    JournalMaster.belongsTo(models.ZvoucherType, {
        foreignKey: 'voucherTypeId',
        as: 'voucherType'
    });

    JournalMaster.belongsTo(models.Stk_main, {
        foreignKey: 'stk_Main_ID',
        as: 'Voucher'
    });
    JournalMaster.hasMany(models.JournalDetail, {
        foreignKey: 'jmId',
        as: 'details'
    });
    // ✅ NEW: Self-referencing relation for Petty Cash → Journal link
    // A Petty Cash voucher belongs to a Journal voucher
    JournalMaster.belongsTo(models.JournalMaster, {
        foreignKey: 'linkedJournalId',
        as: 'linkedJournal',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
    });
    // A Journal voucher can have many linked Petty Cash vouchers
    JournalMaster.hasMany(models.JournalMaster, {
        foreignKey: 'linkedJournalId',
        as: 'linkedPettyCash'
    });
};

module.exports = JournalMaster;





