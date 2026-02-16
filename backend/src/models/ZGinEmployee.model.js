// models/ZGinEmployee.model.js

const { DataTypes, Model } = require('sequelize');
const sequelize = require('../../config/database');

class ZGinEmployee extends Model {
  static associate(models) {
    this.belongsTo(models.ZGinMain, {
      foreignKey: 'gin_id',
      as: 'gin',
      onDelete: 'CASCADE'
    });

    this.belongsTo(models.ZEmployee, {
      foreignKey: 'employee_id',
      as: 'employee',
      onDelete: 'RESTRICT'
    });
  }
}

ZGinEmployee.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  gin_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'zginmain',
      key: 'id'
    }
  },
  employee_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'ZEmployees',
      key: 'id'
    }
  }
}, {
  sequelize,
  modelName: 'ZGinEmployee',
  tableName: 'zginemployee',
  timestamps: true
});

module.exports = ZGinEmployee;
