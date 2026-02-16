// migrations/20260209000001-create-zrecipemain.js

'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('zrecipemain', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      Item_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'zitems',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      qty: {
        type: Sequelize.DECIMAL(10, 4),
        allowNull: false,
        defaultValue: 1
      },
      Uom_Id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'uoms',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      timeRequired: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      status: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
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

    // Add unique index on Item_id (one recipe per item)
    await queryInterface.addIndex('zrecipemain', ['Item_id'], {
      unique: true,
      name: 'zrecipemain_item_unique'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('zrecipemain');
  }
};
