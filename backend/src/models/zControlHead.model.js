// const sequelize = require('../../config/database');
// const { DataTypes } = require('sequelize');

// const db = require('../models');
// const {ZCoa} = db

// // Define all three models
// const ZControlHead1 = sequelize.define('ZControlHead1', {
//     zHead1: {
//         type: DataTypes.STRING,
//         allowNull: false
//     }
// });

// const ZControlHead2 = sequelize.define('ZControlHead2', {
//     zHead2: {
//         type: DataTypes.STRING,
//         allowNull: false
//     },
//     zHead1Id: {
//         type: DataTypes.INTEGER,
//         allowNull: false
//     }
// });

// const ZCOAType = sequelize.define('ZCOAType', {
//     zType: {
//         type: DataTypes.STRING,
//         allowNull: false
//     }
// });

// // Define associations
// ZControlHead1.associate = function(models) {
//     ZControlHead1.hasMany(models.ZControlHead2, { foreignKey: 'zHead1Id' });
//     // ZControlHead1.hasMany(models.ZCoa, { foreignKey: 'ch1Id' });
// };

// ZControlHead2.associate = function(models) {
//     ZControlHead2.belongsTo(models.ZControlHead1, { foreignKey: 'zHead1Id' });
//     ZControlHead2.hasMany(models.ZCoa, { foreignKey: 'ch2Id' });
// };

// ZCOAType.associate = function(models) {
//     ZCOAType.hasMany(models.ZCoa, { foreignKey: 'coaTypeId' });
// };

// // Export as a single object with all models
// module.exports = {
//     ZControlHead1,
//     ZControlHead2,
//     ZCOAType
// };





const sequelize = require('../../config/database');
const { DataTypes } = require('sequelize');

// REMOVE THIS LINE - This is causing circular dependency
// const db = require('../models');
// const {ZCoa} = db

// Define all three models
const ZControlHead1 = sequelize.define('ZControlHead1', {
    zHead1: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

const ZControlHead2 = sequelize.define('ZControlHead2', {
    zHead2: {
        type: DataTypes.STRING,
        allowNull: false
    },
    zHead1Id: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});

const ZCOAType = sequelize.define('ZCOAType', {
    zType: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

// Define associations with safety checks
ZControlHead1.associate = function(models) {
    if (models && models.ZControlHead2) {
        ZControlHead1.hasMany(models.ZControlHead2, { foreignKey: 'zHead1Id', as:'Control-Head-2' });
    }
    if(models && models.ZCoa){
        ZControlHead1.hasMany(models.ZCoa, {foreignKey:'ch1Id'})
    }
};

ZControlHead2.associate = function(models) {
    if (models && models.ZControlHead1) {
        ZControlHead2.belongsTo(models.ZControlHead1, { foreignKey: 'zHead1Id',  as:'Control-Head-2' });
    }
    if (models && models.ZCoa) {
        ZControlHead2.hasMany(models.ZCoa, { foreignKey: 'ch2Id' });
    }
};

ZCOAType.associate = function(models) {
    if (models && models.ZCoa) {
        ZCOAType.hasMany(models.ZCoa, { foreignKey: 'coaTypeId' });
    }
};

// Export as a single object with all models
module.exports = {
    ZControlHead1,
    ZControlHead2,
    ZCOAType
};
