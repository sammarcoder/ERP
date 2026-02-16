// migrations/20260210000002-create-zgindetail.js

'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('zgindetail', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      gin_main_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'zginmain',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      item_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'zitems',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      suggested_qty: {
        type: Sequelize.DECIMAL(10, 4),
        allowNull: false,
        defaultValue: 0
      },
      issue_qty: {
        type: Sequelize.DECIMAL(10, 4),
        allowNull: true,
        defaultValue: 0
      },
      issue_uom_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'uoms',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      remained_unused: {
        type: Sequelize.DECIMAL(10, 4),
        allowNull: true,
        defaultValue: 0
      },
      wastage: {
        type: Sequelize.DECIMAL(10, 4),
        allowNull: true,
        defaultValue: 0
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('zgindetail');
  }
};
