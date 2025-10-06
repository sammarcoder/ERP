const sequelize = require('../../config/database');
const { DataTypes } = require('sequelize');

const Zcurrency = sequelize.define('Zcurrency', {
    currencyName: {
        type: DataTypes.STRING(10),
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    }
});

// Fixed typo: associate (not assciate)
Zcurrency.associate = function(models) {
    Zcurrency.hasMany(models.JournalDetail, { 
        foreignKey: 'currencyId', 
        as: 'details' 
    });
};

module.exports = Zcurrency;
