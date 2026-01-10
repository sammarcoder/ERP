'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ZMouldOutputMaterials', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      mouldId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'ZMoulds',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      itemId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'ZItems',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Add unique constraint on mouldId + itemId combination
    await queryInterface.addIndex('ZMouldOutputMaterials', ['mouldId', 'itemId'], {
      unique: true,
      name: 'zmould_output_unique'
    });

    // Add index on mouldId for faster lookups
    await queryInterface.addIndex('ZMouldOutputMaterials', ['mouldId'], {
      name: 'zmould_output_mould_idx'
    });

    // Add index on itemId for faster lookups
    await queryInterface.addIndex('ZMouldOutputMaterials', ['itemId'], {
      name: 'zmould_output_item_idx'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('ZMouldOutputMaterials', 'zmould_output_unique');
    await queryInterface.removeIndex('ZMouldOutputMaterials', 'zmould_output_mould_idx');
    await queryInterface.removeIndex('ZMouldOutputMaterials', 'zmould_output_item_idx');
    await queryInterface.dropTable('ZMouldOutputMaterials');
  }
};
