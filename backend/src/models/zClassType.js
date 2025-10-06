const sequelize = require('../../config/database');
const { DataTypes } = require('sequelize')
// const ZItems = require('./zItems.model')

const ZClassType = sequelize.define('ZClassType', {
    classId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: { msg: 'Class Id can not be null' }
        }
    },
    className: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: { msg: 'Uom fields cannot be empty string' }
        },
        unique: true

    }
}
);



ZClassType.associate = function(models) {
    // Each association needs to specify WHICH foreign key it uses
    ZClassType.hasMany(models.ZItems, {
        foreignKey: 'itemClass1',
        as: 'itemsWithClass1'
    });
    
    ZClassType.hasMany(models.ZItems, {
        foreignKey: 'itemClass2',
        as: 'itemsWithClass2'
    });
    
    ZClassType.hasMany(models.ZItems, {
        foreignKey: 'itemClass3',
        as: 'itemsWithClass3'
    });
    
    ZClassType.hasMany(models.ZItems, {
        foreignKey: 'itemClass4',
        as: 'itemsWithClass4'
    });
}



module.exports = ZClassType