// models/ZRecipeDetail.model.js

const { DataTypes, Model } = require('sequelize');
const sequelize = require('../../config/database');

class ZRecipeDetail extends Model {
  static associate(models) {
    // Parent Recipe Main
    this.belongsTo(models.ZRecipeMain, {
      foreignKey: 'zRp_Main_id',
      as: 'recipeMain',
      onDelete: 'CASCADE'
    });

    // Component Item
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
  }
}

ZRecipeDetail.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  zRp_Main_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'zrecipemain',
      key: 'id'
    }
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
  }
}, {
  sequelize,
  modelName: 'ZRecipeDetail',
  tableName: 'zrecipedetail',
  timestamps: true
});

module.exports = ZRecipeDetail;
