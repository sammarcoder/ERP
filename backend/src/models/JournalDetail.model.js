const sequelize = require('../../config/database');
const { DataTypes } = require('sequelize');

const JournalDetail = sequelize.define('JournalDetail', {
    jmId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      
    },
    lineId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      
    },
    coaId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      
    },
    description: {
        type: DataTypes.STRING(100),
        allowNull: true,
      
    },
    chqNo: {
        type: DataTypes.STRING(50),
        allowNull: true,
      
    },
    recieptNo: {
        type: DataTypes.STRING(50),
        allowNull: true,
      
    },
    ownDb: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      
    },
    ownCr: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      
    },
    rate: {
        type: DataTypes.DOUBLE,
        allowNull: true,
      
    },
    amountDb: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      
    },
    amountCr: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      
    },
    isCost: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    currencyId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      
    },
    status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      
    },
    idCard: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    bank:{
        type:DataTypes.STRING,
        allowNull:true
    },
    bankDate:{
        type: DataTypes.DATE,
        allowNull: true,
    }
},
    {
        tableName: 'JournalDetail', // 👈 match your existing migration table name
        freezeTableName: true,
    }
);

// Define associations in a separate function
JournalDetail.associate = function (models) {
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





