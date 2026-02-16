// models/ZGinMain.model.js

const { DataTypes, Model } = require('sequelize');
const sequelize = require('../../config/database');

class ZGinMain extends Model {
  static associate(models) {
    this.belongsTo(models.ZItems, {
      foreignKey: 'item_id',
      as: 'item',
      onDelete: 'RESTRICT'
    });

    this.belongsTo(models.Uom, {
      foreignKey: 'Uom_Id',
      as: 'uom',
      onDelete: 'RESTRICT'
    });

    this.hasMany(models.ZGinDetail, {
      foreignKey: 'gin_main_id',
      as: 'details',
      onDelete: 'CASCADE'
    });

    this.hasMany(models.ZGinEmployee, {
      foreignKey: 'gin_id',
      as: 'employees',
      onDelete: 'CASCADE'
    });
    this.hasMany(models.Stk_Detail, {
      foreignKey: 'gin_id',
      as: 'stockDetails',
      onDelete: 'restrict'
    });
   
    this.belongsTo(models.ZCoa, {
      foreignKey: 'coa_id',
      as: 'coa',
      onDelete: 'RESTRICT'
    });
  }
}

ZGinMain.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  gin_number: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  item_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'zitems',
      key: 'id'
    }
  },
  qty_planned: {
    type: DataTypes.DECIMAL(10, 4),
    allowNull: false,
    defaultValue: 0
  },
  Uom_Id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'uoms',
      key: 'id'
    }
  },
  status: {
    type: DataTypes.ENUM('open', 'close', 'pending', 'rejected'),
    allowNull: false,
    defaultValue: 'open'
  },
  reason: {
    type: DataTypes.TEXT,
    allowNull: true
  },


  coa_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'zcoas',
      key: 'id'
    }
  },
  gin_date: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    defaultValue: DataTypes.NOW
  }

  // Add association




}, {
  sequelize,
  modelName: 'ZGinMain',
  tableName: 'zginmain',
  timestamps: true
});

module.exports = ZGinMain;
