// models/ZRecipeMain.model.js

const { DataTypes, Model } = require('sequelize');
const sequelize = require('../../config/database');

class ZRecipeMain extends Model {
  static associate(models) {
    // Finished Product Item
    this.belongsTo(models.ZItems, {
      foreignKey: 'Item_id',
      as: 'item',
      onDelete: 'RESTRICT'
    });

    // UOM
    this.belongsTo(models.Uom, {
      foreignKey: 'Uom_Id',
      as: 'uom',
      onDelete: 'RESTRICT'
    });

    // Recipe Details (Components)
    this.hasMany(models.ZRecipeDetail, {
      foreignKey: 'zRp_Main_id',
      as: 'details',
      onDelete: 'CASCADE'
    });
  }
}

ZRecipeMain.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  Item_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'zitems',
      key: 'id'
    }
  },
  qty: {
    type: DataTypes.DECIMAL(10, 4),
    allowNull: false,
    defaultValue: 1
  },
  Uom_Id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'uoms',
      key: 'id'
    }
  },
  timeRequired: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0
  },
  status: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
}, {
  sequelize,
  modelName: 'ZRecipeMain',
  tableName: 'zrecipemain',
  timestamps: true
});

module.exports = ZRecipeMain;
