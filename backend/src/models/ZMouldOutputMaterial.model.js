const sequelize = require('../../config/database');
const { DataTypes } = require('sequelize');
const ZMould = require('./ZMould.model');
const ZItems = require('./zItems.model');

const ZMouldOutputMaterial = sequelize.define('ZMouldOutputMaterial', {
    mouldId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: ZMould,
            key: 'id'
        }
    },
    itemId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: ZItems,
            key: 'id'
        }
    }
}, {
    indexes: [
        {
            unique: true,
            fields: ['mouldId', 'itemId'],
            name: 'zmould_output_unique'
        }
    ]
});

// Define Many-to-Many relationship through junction table
ZMould.belongsToMany(ZItems, { 
    through: ZMouldOutputMaterial, 
    foreignKey: 'mouldId', 
    otherKey: 'itemId',
    as: 'outputMaterials' 
});

ZItems.belongsToMany(ZMould, { 
    through: ZMouldOutputMaterial, 
    foreignKey: 'itemId', 
    otherKey: 'mouldId',
    as: 'mouldsAsOutput' 
});

// Direct associations for the junction table
ZMouldOutputMaterial.belongsTo(ZMould, { foreignKey: 'mouldId', as: 'mould' });
ZMouldOutputMaterial.belongsTo(ZItems, { foreignKey: 'itemId', as: 'item' });
ZMould.hasMany(ZMouldOutputMaterial, { foreignKey: 'mouldId', as: 'outputMaterialLinks' });
ZItems.hasMany(ZMouldOutputMaterial, { foreignKey: 'itemId', as: 'mouldOutputLinks' });

module.exports = ZMouldOutputMaterial;
