// migrations/20260209000002-create-zrecipedetail.js

'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('zrecipedetail', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      zRp_Main_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'zrecipemain',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
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

    // Add index for faster lookups
    await queryInterface.addIndex('zrecipedetail', ['zRp_Main_id'], {
      name: 'zrecipedetail_main_idx'
    });

    // Add unique index (one item per recipe)
    await queryInterface.addIndex('zrecipedetail', ['zRp_Main_id', 'Item_id'], {
      unique: true,
      name: 'zrecipedetail_main_item_unique'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('zrecipedetail');
  }
};
