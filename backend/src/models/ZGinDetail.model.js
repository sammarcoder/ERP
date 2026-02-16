// models/ZGinDetail.model.js

const { DataTypes, Model } = require('sequelize');
const sequelize = require('../../config/database');

class ZGinDetail extends Model {
  static associate(models) {
    this.belongsTo(models.ZGinMain, {
      foreignKey: 'gin_main_id',
      as: 'ginMain',
      onDelete: 'CASCADE'
    });

    this.belongsTo(models.ZItems, {
      foreignKey: 'item_id',
      as: 'item',
      onDelete: 'RESTRICT'
    });

    this.belongsTo(models.Uom, {
      foreignKey: 'issue_uom_id',
      as: 'issueUom',
      onDelete: 'RESTRICT'
    });
  }
}

ZGinDetail.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  gin_main_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'zginmain',
      key: 'id'
    }
  },
  item_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'zitems',
      key: 'id'
    }
  },
  suggested_qty: {
    type: DataTypes.DECIMAL(10, 4),
    allowNull: false,
    defaultValue: 0
  },
  issue_qty: {
    type: DataTypes.DECIMAL(10, 4),
    allowNull: true,
    defaultValue: 0
  },
  issue_uom_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'uoms',
      key: 'id'
    }
  },
  remained_unused: {
    type: DataTypes.DECIMAL(10, 4),
    allowNull: true,
    defaultValue: 0
  },
  wastage: {
    type: DataTypes.DECIMAL(10, 4),
    allowNull: true,
    defaultValue: 0
  },
  // models/ZGinDetail.model.js - Add these fields

  batchno: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'zcoas',
      key: 'id'
    }
  },
  issue_uom1_qty: {
    type: DataTypes.DECIMAL(10, 4),
    allowNull: true,
    defaultValue: 0
  },
  issue_uom2_qty: {
    type: DataTypes.DECIMAL(10, 4),
    allowNull: true,
    defaultValue: 0
  },
  issue_uom3_qty: {
    type: DataTypes.DECIMAL(10, 4),
    allowNull: true,
    defaultValue: 0
  },
  actual_used: {
    type: DataTypes.DECIMAL(10, 4),
    allowNull: true,
    defaultValue: 0
  },
  actual_used_uom1: {
    type: DataTypes.DECIMAL(10, 4),
    allowNull: true,
    defaultValue: 0
  },
  actual_used_uom2: {
    type: DataTypes.DECIMAL(10, 4),
    allowNull: true,
    defaultValue: 0
  },
  actual_used_uom3: {
    type: DataTypes.DECIMAL(10, 4),
    allowNull: true,
    defaultValue: 0
  }

}, {
  sequelize,
  modelName: 'ZGinDetail',
  tableName: 'zgindetail',
  timestamps: true
});

module.exports = ZGinDetail;
