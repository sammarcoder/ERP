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



















const sequelize = require('../../config/database');
const { DataTypes } = require('sequelize');

const ZvoucherType = sequelize.define('ZvoucherType', {
    vType: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    }
});

// Fixed: associate (not associations)
ZvoucherType.associate = function (models) {
    ZvoucherType.hasMany(models.JournalMaster, {
        foreignKey: 'voucherTypeId',
        as: 'journalMasters'
    });

    ZvoucherType.hasMany(models.StockMain, {
        foreignKey: 'stockTypeId',
        as: 'stockType'
    })
};

module.exports = ZvoucherType;
