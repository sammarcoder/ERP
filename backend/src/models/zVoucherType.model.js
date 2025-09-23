// const sequelize = require('../../config/database');
// const { DataTypes } = require('sequelize');
// const { JournalMaster } = require('./journalMaster.model');

// const ZvoucherType = sequelize.define('ZvoucherType', {
//     vType: {
//         type: DataTypes.STRING(10),
//         allowNull: false,
//         validate: {
//             notEmpty: true,
//         }
//     }
// })

// ZvoucherType.associations = (models) =>{
//     ZvoucherType.hasMany(JournalMaster, {foreignKey: 'voucherTypeId', as:'journalMasters'})
// }
// module.exports = { ZvoucherType }



















// const sequelize = require('../../config/database');
// const { DataTypes } = require('sequelize');

// const ZvoucherType = sequelize.define('ZvoucherType', {
//     vType: {
//         type: DataTypes.STRING(100),
//         allowNull: false,
//         validate: {
//             notEmpty: true,
//         }
//     }
// });

// // Fixed: associate (not associations)
// ZvoucherType.associate = function (models) {
//     ZvoucherType.hasMany(models.JournalMaster, {
//         foreignKey: 'voucherTypeId',
//         as: 'journalMasters'
//     });

//     ZvoucherType.hasMany(models.StockMain, {
//         foreignKey: 'stockTypeId',
//         as: 'stockType'
//     })
// };

// module.exports = ZvoucherType;




































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














