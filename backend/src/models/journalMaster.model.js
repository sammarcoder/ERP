const sequelize = require('../../config/database');
const { DataTypes } = require('sequelize');

const JournalMaster = sequelize.define('JournalMaster', {
    date: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    stk_Main_ID: {
        type: DataTypes.INTEGER,
    },
    voucherTypeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    voucherNo: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
            notEmpty: true,
        },
        unique: true,
    },
    balacingId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
            notEmpty: true,
        }
    },
    status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        validate: {
            notEmpty: true,
        }
    }
}
,
 {
  tableName: 'JournalMaster', // 👈 match your existing migration table name
  freezeTableName: true, }
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
};

module.exports = JournalMaster;





