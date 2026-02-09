// models/ZMasterType.js

const sequelize = require('../../config/database');
const { DataTypes } = require('sequelize');

const ZMasterType = sequelize.define('ZMasterType', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  type: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      isIn: [[1, 2, 3, 4, 5]]
    },
    comment: '1=Shipper, 2=Carriage, 3=Bank Name, 4=Contact Type, 5=Clearing Agent'
  },
  typeName: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  actualName: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  status: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
}, {
  tableName: 'ZMasterTypes',
  timestamps: true
});

// Type constants
ZMasterType.TYPES = {
  SHIPPER: 1,
  CARRIAGE: 2,
  BANK_NAME: 3,
  CONTACT_TYPE: 4,
  CLEARING_AGENT: 5
};

ZMasterType.TYPE_NAMES = {
  1: 'Shipper',
  2: 'Carriage',
  3: 'Bank Name',
  4: 'Contact Type',
  5: 'Clearing Agent'
};

module.exports = ZMasterType;
