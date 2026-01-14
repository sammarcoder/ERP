const sequelize = require('../../config/database');
const { DataTypes } = require('sequelize');
const ZMachine = require('./ZMachine.model');
const ZEmployee = require('./ZEmployee.model');
const ZShift = require('./ZShift.model');
const ZMould = require('./ZMould.model');
const ZItems = require('./zItems.model');

const ZMoulding = sequelize.define('ZMoulding', {
    // Basic Information
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    machineId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: ZMachine,
            key: 'id'
        }
    },
    operatorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: ZEmployee,
            key: 'id'
        }
    },
    shiftId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: ZShift,
            key: 'id'
        }
    },
    startTime: {
        type: DataTypes.TIME,
        allowNull: false
    },
    endTime: {
        type: DataTypes.TIME,
        allowNull: false
    },

    // Shutdown/Downtime (in minutes - INTEGER)
    shutdownElectricity: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
        comment: 'Electricity downtime in minutes'
    },
    shutdownMachine: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
        comment: 'Machine breakdown time in minutes'
    },
    shutdownNamaz: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
        comment: 'Prayer break time in minutes'
    },
    shutdownMould: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
        comment: 'Mould issue time in minutes'
    },
    shutdownOther: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
        comment: 'Other downtime in minutes'
    },

    // Counter Readings
    counterOne: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    counterTwo: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    finalCounter: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Calculated: counterTwo - counterOne'
    },

    // Mould & Production
    mouldId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: ZMould,
            key: 'id'
        }
    },
    selectedOutputMaterialId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: ZItems,
            key: 'id'
        }
    },
    inputQty: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0
    },
    outputQty: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0
    },
    qualityCheckerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: ZEmployee,
            key: 'id'
        }
    }
});

// Define Relationships
ZMoulding.belongsTo(ZMachine, { foreignKey: 'machineId', as: 'machine' });
ZMoulding.belongsTo(ZEmployee, { foreignKey: 'operatorId', as: 'operator' });
ZMoulding.belongsTo(ZShift, { foreignKey: 'shiftId', as: 'shift' });
ZMoulding.belongsTo(ZMould, { foreignKey: 'mouldId', as: 'mould' });
ZMoulding.belongsTo(ZItems, { foreignKey: 'selectedOutputMaterialId', as: 'selectedOutputMaterial' });
ZMoulding.belongsTo(ZEmployee, { foreignKey: 'qualityCheckerId', as: 'qualityChecker' });

ZMachine.hasMany(ZMoulding, { foreignKey: 'machineId', as: 'mouldings' });
ZEmployee.hasMany(ZMoulding, { foreignKey: 'operatorId', as: 'operatedMouldings' });
ZEmployee.hasMany(ZMoulding, { foreignKey: 'qualityCheckerId', as: 'checkedMouldings' });
ZShift.hasMany(ZMoulding, { foreignKey: 'shiftId', as: 'mouldings' });
ZMould.hasMany(ZMoulding, { foreignKey: 'mouldId', as: 'mouldingRecords' });
ZItems.hasMany(ZMoulding, { foreignKey: 'selectedOutputMaterialId', as: 'mouldingOutputs' });

module.exports = ZMoulding;
