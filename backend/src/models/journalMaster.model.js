// const sequelize = require('../../config/database');
// const { DataTypes } = require('sequelize');
// // const {JournalDetail} = require('./JournalDetail.model').ZJournalDetail;
// // const { JournalDetail } = require('./JournalDetail.model');
// // console.log(JournalDetail)
// const { ZvoucherType } = require('./zVoucherType.model');

// const JournalMaster = sequelize.define('JournalMaster', {
//     date: {
//         type: DataTypes.DATE,
//         allowNull: false,
//         validate: {
//             notEmpty: true,
//         }
//     },

    
//     voucherTypeId: {
//         type: DataTypes.INTEGER,
//         allowNull: false,
//         validate: {
//             notEmpty: true,
//         },
//         references: {
//             model: ZvoucherType,
//             key: 'id'
//         }
//     },
//     voucherNo: {
//         type: DataTypes.STRING(50),
//         allowNull: false,
//         validate: {
//             notEmpty: true,
//         }
//     },
//     balacingId: {
//         type: DataTypes.INTEGER,
//         allowNull: false,
//         validate: {
//             notEmpty: true,
//         }
//     },
//     status: {
//         type: DataTypes.BOOLEAN,
//         allowNull: false,
//         defaultValue: true,
//         validate: {
//             notEmpty: true,
//         }
//     },
//     // voucherNo: {
//     //     type: DataTypes.STRING(50),
//     //     allowNull: false,
//     //     validate: {
//     //         notEmpty: true,
//     //     }
//     // }
// })

// // Associations

// JournalMaster.belongsTo(ZvoucherType, { foreign: 'voucherTypeId', as: 'voucherType' });
// // JournalMaster.hasMany(JournalDetail, {
// //     foreignKey: 'jmId', as: 'details'
// // })

// JournalMaster.hasMany(require('./JournalDetail.model').JournalDetail, {
//     foreignKey: 'jmId',
//     as: 'details'
// });



// module.exports = { JournalMaster };









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
        }
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
});

// Define associations in a separate function
JournalMaster.associate = function(models) {
    JournalMaster.belongsTo(models.ZvoucherType, { 
        foreignKey: 'voucherTypeId', 
        as: 'voucherType' 
    });
    JournalMaster.hasMany(models.JournalDetail, {
        foreignKey: 'jmId',
        as: 'details'
    });
};

module.exports = JournalMaster;
