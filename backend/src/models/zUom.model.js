const { Model, DataTypes } = require("sequelize");
// const sequelize = require("../config/database"); // apna sequelize instance import karo
const sequelize = require('../../config/database');
class Uom extends Model {
  static associate(models) {
   
    // this.hasMany(models.TaxInfo, { foreignKey: "uomId" });
    this.hasMany(models.ZItems,{foreignKey: 'skuUOM', as:'uom1'
    })
    this.hasMany(models.ZItems,{foreignKey: 'uom2', as:'uomTow'
    })
    this.hasMany(models.ZItems,{foreignKey: 'uom3', as:'uomThree'
    })
    this.hasMany(models.ZItems,{foreignKey: 'assessmentUOM', as:'uom4'
    })
  }
}

Uom.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    uom: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Uom",
    tableName: "uoms",
    // timestamps: false,
  }
);

module.exports = Uom;
