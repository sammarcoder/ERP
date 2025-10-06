const sequelize = require('../../config/database');
const { DataTypes } = require('sequelize');

const JournalDetail = sequelize.define('JournalDetail', {
    jmId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    lineId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    coaId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    description: {
        type: DataTypes.STRING(100),
        allowNull: true,
        validate: {
            notEmpty: true,
        }
    },
    chqNo: {
        type: DataTypes.STRING(50),
        allowNull: true,
        validate: {
            notEmpty: true,
        }
    },
    recieptNo: {
        type: DataTypes.STRING(50),
        allowNull: true,
        validate: {
            notEmpty: true,
        }
    },
    ownDb: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    ownCr: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    rate: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        validate: {
            notEmpty: true,
        }
    },
    amountDb: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    amountCr: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    isCost: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    currencyId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
            notEmpty: true,
        }
    },
    status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        validate: {
            notEmpty: true,
        }
    }
}
,

{
  tableName: 'JournalDetail', // 👈 match your existing migration table name
  freezeTableName: true, }
);

// Define associations in a separate function
JournalDetail.associate = function(models) {
    JournalDetail.belongsTo(models.JournalMaster, { 
        foreignKey: 'jmId',
        as: 'master'
    });
    // Changed from Coa to ZCoa to match your actual model name
    JournalDetail.belongsTo(models.ZCoa, {
        foreignKey: 'coaId',
        as: 'coa'
    });
    JournalDetail.belongsTo(models.Zcurrency, {
        foreignKey: 'currencyId',
        as: 'currency'
    });
};

module.exports = JournalDetail;





