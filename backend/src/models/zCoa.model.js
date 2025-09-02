


// // const sequelize = require('../../config/database');
// // const { DataTypes } = require('sequelize');
// // const { ZControlHead1, ZControlHead2, ZCOAType } = require('./zControlHead.model');

// // const ZCoa = sequelize.define('ZCoa', {
// //     acName: { type: DataTypes.STRING, allowNull: false, validate: { notEmpty: { msg: 'Account name cannot be empty' } } },
// //     ch1Id: {
// //         type: DataTypes.INTEGER,
// //         allowNull: false,
// //         references: { model: ZControlHead1, key: 'id' },
// //         validate: { notEmpty: { msg: 'Control Head 1 ID cannot be empty' } }
// //     },
// //     ch2Id: {
// //         type: DataTypes.INTEGER,
// //         allowNull: false,
// //         references: { model: ZControlHead2, key: 'id' },
// //         validate: { notEmpty: { msg: 'Control Head 2 ID cannot be empty' } }
// //     },
// //     coaTypeId: {
// //         type: DataTypes.INTEGER,
// //         allowNull: false,
// //         references: { model: ZCOAType, key: 'id' },
// //         validate: { notEmpty: { msg: 'COA Type ID cannot be empty' } }
// //     },
// //     setupName: { type: DataTypes.STRING, allowNull: false,  validate: { notEmpty: { msg: 'Setup Name cannot be empty' } } },
// //     adress:     { type: DataTypes.STRING, allowNull: false, validate: { notEmpty: { msg: 'Address cannot be empty' } } },
// //     city:       { type: DataTypes.STRING, allowNull: false, validate: { notEmpty: { msg: 'City cannot be empty' } } },
// //     personName: { type: DataTypes.STRING, allowNull: false, validate: { notEmpty: { msg: 'Person Name cannot be empty' } } },
// //     mobileNo:   { type: DataTypes.STRING, allowNull: false, validate: { notEmpty: { msg: 'Mobile Number cannot be empty' } } },
// //     taxStatus:  { type: DataTypes.STRING, allowNull: false, validate: { notEmpty: { msg: 'Tax Status cannot be empty' } } },
// //     ntn:        { type: DataTypes.STRING, allowNull: false, validate: { notEmpty: { msg: 'NTN cannot be empty' } } },
// //     cnic:       { type: DataTypes.STRING, allowNull: false, validate: { notEmpty: { msg: 'CNIC cannot be empty' } } },
// //     salesLimit: { type: DataTypes.STRING, allowNull: false, validate: { notEmpty: { msg: 'Sales Limit cannot be empty' } } },
// //     credit:     { type: DataTypes.STRING, allowNull: false, validate: { notEmpty: { msg: 'Credit cannot be empty' } } },
// //     creditDoys: { type: DataTypes.STRING, allowNull: false, validate: { notEmpty: { msg: 'Credit Days cannot be empty' } } },
// //     salesMan:   { type: DataTypes.STRING, allowNull: false, validate: { notEmpty: { msg: 'Salesman cannot be empty' } } },
// //     isJvBalance:{ type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
// // });

// // // Associations
// // ZCoa.belongsTo(ZControlHead1, { foreignKey: 'ch1Id' });
// // ZCoa.belongsTo(ZControlHead2, { foreignKey: 'ch2Id' });
// // ZCoa.belongsTo(ZCOAType,      { foreignKey: 'coaTypeId' });

// // ZControlHead1.hasMany(ZCoa, { foreignKey: 'ch1Id' });
// // ZControlHead2.hasMany(ZCoa, { foreignKey: 'ch2Id' });
// // ZCOAType.hasMany(ZCoa,      { foreignKey: 'coaTypeId' });

// // module.exports = { ZCoa };


























// const sequelize = require('../../config/database');
// const { DataTypes } = require('sequelize');

// const ZCoa = sequelize.define('ZCoa', {
//     acName: { 
//         type: DataTypes.STRING, 
//         allowNull: false, 
//         validate: { notEmpty: { msg: 'Account name cannot be empty' } } 
//     },
//     // ch1Id: {
//     //     type: DataTypes.INTEGER,
//     //     allowNull: false,
//     //     validate: { notEmpty: { msg: 'Control Head 1 ID cannot be empty' } }
//     // },
//     ch2Id: {
//         type: DataTypes.INTEGER,
//         allowNull: true,
//         validate: { notEmpty: { msg: 'Control Head 2 ID cannot be empty' } }
//     },
//     coaTypeId: {
//         type: DataTypes.INTEGER,
//         allowNull: false,
//         validate: { notEmpty: { msg: 'COA Type ID cannot be empty' } }
//     },
//     setupName: { type: DataTypes.STRING, allowNull: false, validate: { notEmpty: { msg: 'Setup Name cannot be empty' } } },
//     adress: { type: DataTypes.STRING, allowNull: false, validate: { notEmpty: { msg: 'Address cannot be empty' } } },
//     city: { type: DataTypes.STRING, allowNull: false, validate: { notEmpty: { msg: 'City cannot be empty' } } },
//     personName: { type: DataTypes.STRING, allowNull: false, validate: { notEmpty: { msg: 'Person Name cannot be empty' } } },
//     mobileNo: { type: DataTypes.STRING, allowNull: false, validate: { notEmpty: { msg: 'Mobile Number cannot be empty' } } },
//     taxStatus: { type: DataTypes.BOOLEAN, allowNull: false,defaultValue:false },
//     ntn: { type: DataTypes.STRING, allowNull: false, validate: { notEmpty: { msg: 'NTN cannot be empty' } } },
//     cnic: { type: DataTypes.STRING, allowNull: false, validate: { notEmpty: { msg: 'CNIC cannot be empty' } } },
//     salesLimit: { type: DataTypes.STRING, allowNull: false, validate: { notEmpty: { msg: 'Sales Limit cannot be empty' } } },
//     credit: { type: DataTypes.STRING, allowNull: false, validate: { notEmpty: { msg: 'Credit cannot be empty' } } },
//     creditDoys: { type: DataTypes.STRING, allowNull: false, validate: { notEmpty: { msg: 'Credit Days cannot be empty' } } },
//     salesMan: { type: DataTypes.STRING, allowNull: false, validate: { notEmpty: { msg: 'Salesman cannot be empty' } } },
//     isJvBalance: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
// });

// // Define associations in associate function
// ZCoa.associate = function(models) {
//     // ZCoa.belongsTo(models.ZControlHead1, { foreignKey: 'ch1Id' });
//     ZCoa.belongsTo(models.ZControlHead2, { foreignKey: 'ch2Id' });
//     ZCoa.belongsTo(models.ZCOAType, { foreignKey: 'coaTypeId' });
// };

// module.exports = ZCoa;








// const sequelize = require('../../config/database');
// const { DataTypes } = require('sequelize');

// const ZCoa = sequelize.define('ZCoa', {
//     acName: {
//         type: DataTypes.STRING,
//         allowNull: false,
//         validate: { notEmpty: { msg: 'Account name cannot be empty' } },
//         unique: true
//     },
//     ch1Id: {
//         type: DataTypes.INTEGER,
//         allowNull: true,
//         validate: { notEmpty: { msg: 'Control Head 1 ID cannot be empty' } }
//     },
//     ch2Id: {
//         type: DataTypes.INTEGER,
//         allowNull: true,
//         validate: { notEmpty: { msg: 'Control Head 2 ID cannot be empty' } }
//     },
//     coaTypeId: {
//         type: DataTypes.INTEGER,
//         allowNull: false,
//         validate: { notEmpty: { msg: 'COA Type ID cannot be empty' } }
//     },
//     setupName: { type: DataTypes.STRING, allowNull: false, validate: { notEmpty: { msg: 'Setup Name cannot be empty' } } },
//     adress: { type: DataTypes.STRING, allowNull: false, validate: { notEmpty: { msg: 'Address cannot be empty' } } },
//     city: { type: DataTypes.STRING, allowNull: false, validate: { notEmpty: { msg: 'City cannot be empty' } } },
//     personName: { type: DataTypes.STRING, allowNull: false, validate: { notEmpty: { msg: 'Person Name cannot be empty' } } },
//     mobileNo: { type: DataTypes.STRING, allowNull: false, validate: { notEmpty: { msg: 'Mobile Number cannot be empty' } } },
//     taxStatus: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
//     ntn: { type: DataTypes.STRING, allowNull: false, validate: { notEmpty: { msg: 'NTN cannot be empty' } } },
//     cnic: { type: DataTypes.STRING, allowNull: false, validate: { notEmpty: { msg: 'CNIC cannot be empty' } } },
//     salesLimit: { type: DataTypes.STRING, allowNull: false, validate: { notEmpty: { msg: 'Sales Limit cannot be empty' } } },
//     credit: { type: DataTypes.STRING, allowNull: false, validate: { notEmpty: { msg: 'Credit cannot be empty' } } },
//     creditDoys: { type: DataTypes.STRING, allowNull: false, validate: { notEmpty: { msg: 'Credit Days cannot be empty' } } },
//     salesMan: { type: DataTypes.STRING, allowNull: false, validate: { notEmpty: { msg: 'Salesman cannot be empty' } } },
//     isJvBalance: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
// });

// // Define associations with safety checks
// ZCoa.associate = function (models) {
//     // Check if models exist before trying to associate
//     if (models && models.ZControlHead2) {
//         ZCoa.belongsTo(models.ZControlHead2, { foreignKey: 'ch2Id' });
//     }
//     if (models && models.ZControlHead1) {
//         ZCoa.belongsTo(models.ZControlHead1, { foreignKey: 'ch1Id' })
//     }
//     if (models && models.ZCOAType) {
//         ZCoa.belongsTo(models.ZCOAType, { foreignKey: 'coaTypeId' });
//     }

//     if (models && models.ZItems) {
//         ZCoa.hasMany(models.ZItems, { foreignKey: 'purchaseAccount', as: 'purchase' })
//     }
//     if (models && models.ZItems) {
//         ZCoa.hasMany(models.ZItems, { foreignKey: 'salesTaxAccount', as: 'salesTaxAc' })
//     }
//     if (models && models.ZItems) {
//         ZCoa.hasMany(models.ZItems, { foreignKey: 'salesAccount', as: 'sales' })
//     }
//     if (models && models.Order_Main) {
//         ZCoa.hasMany(models.Order_Main, {
//             foreignKey: 'COA_ID',
//             as: 'orders'
//         });
//     }

//     ZCoa.hasMany(StockMain,{
//         foreignKey:'coaId',
//         as:'mainAccount'
//     })
// };


// console.log(ZCoa === sequelize.models.ZCoa);
// // Export the model directly
// module.exports = ZCoa;























const sequelize = require('../../config/database');
const { DataTypes } = require('sequelize');

const ZCoa = sequelize.define('ZCoa', {
    acName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: { msg: 'Account name cannot be empty' } },
        unique: true
    },
    ch1Id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: { notEmpty: { msg: 'Control Head 1 ID cannot be empty' } }
    },
    ch2Id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: { notEmpty: { msg: 'Control Head 2 ID cannot be empty' } }
    },
    coaTypeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { notEmpty: { msg: 'COA Type ID cannot be empty' } }
    },
    setupName: { type: DataTypes.STRING, allowNull: false, validate: { notEmpty: { msg: 'Setup Name cannot be empty' } } },
    adress: { type: DataTypes.STRING, allowNull: false, validate: { notEmpty: { msg: 'Address cannot be empty' } } },
    city: { type: DataTypes.STRING, allowNull: false, validate: { notEmpty: { msg: 'City cannot be empty' } } },
    personName: { type: DataTypes.STRING, allowNull: false, validate: { notEmpty: { msg: 'Person Name cannot be empty' } } },
    mobileNo: { type: DataTypes.STRING, allowNull: false, validate: { notEmpty: { msg: 'Mobile Number cannot be empty' } } },
    taxStatus: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    ntn: { type: DataTypes.STRING, allowNull: false, validate: { notEmpty: { msg: 'NTN cannot be empty' } } },
    cnic: { type: DataTypes.STRING, allowNull: false, validate: { notEmpty: { msg: 'CNIC cannot be empty' } } },
    salesLimit: { type: DataTypes.STRING, allowNull: false, validate: { notEmpty: { msg: 'Sales Limit cannot be empty' } } },
    credit: { type: DataTypes.STRING, allowNull: false, validate: { notEmpty: { msg: 'Credit cannot be empty' } } },
    creditDoys: { type: DataTypes.STRING, allowNull: false, validate: { notEmpty: { msg: 'Credit Days cannot be empty' } } },
    salesMan: { type: DataTypes.STRING, allowNull: false, validate: { notEmpty: { msg: 'Salesman cannot be empty' } } },
    isJvBalance: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    
    // NEW DISCOUNT FIELDS
    discountA: { 
        type: DataTypes.DECIMAL(5,2), 
        allowNull: false, 
        defaultValue: 0.00,
        validate: { 
            min: 0, 
            max: 100,
            isDecimal: { msg: 'Discount A must be a valid decimal number' }
        }
    },
    discountB: { 
        type: DataTypes.DECIMAL(5,2), 
        allowNull: false, 
        defaultValue: 0.00,
        validate: { 
            min: 0, 
            max: 100,
            isDecimal: { msg: 'Discount B must be a valid decimal number' }
        }
    },
    discountC: { 
        type: DataTypes.DECIMAL(5,2), 
        allowNull: false, 
        defaultValue: 0.00,
        validate: { 
            min: 0, 
            max: 100,
            isDecimal: { msg: 'Discount C must be a valid decimal number' }
        }
    }
});

// Define associations with safety checks
ZCoa.associate = function (models) {
    // Check if models exist before trying to associate
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
            as: 'orders'
        });
    }

    if (models && models.StockMain) {
        ZCoa.hasMany(models.StockMain, {
            foreignKey: 'coaId',
            as: 'mainAccount'
        });
    }
};

console.log(ZCoa === sequelize.models.ZCoa);
// Export the model directly
module.exports = ZCoa;
