const sequelize = require('../../config/database');
const { DataTypes } = require('sequelize');
const ZItems = require('./zItems.model');

const ZMould = sequelize.define('ZMould', {
    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    cycleTime: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1
        },
        comment: 'Cycle time in seconds'
    },
    totalCavities: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1
        }
    },
    effectiveCavities: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1
        }
    },
    inputMaterialId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: ZItems,
            key: 'id'
        }
    }
});

// Define relationship for input material (single item)
ZMould.belongsTo(ZItems, { foreignKey: 'inputMaterialId', as: 'inputMaterial' });
ZItems.hasMany(ZMould, { foreignKey: 'inputMaterialId', as: 'mouldsAsInput' });

module.exports = ZMould;
